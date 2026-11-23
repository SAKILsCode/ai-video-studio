#!/usr/bin/env python3
"""
AI Video Studio — Line-Cached TTS & Exact Word-Timestamp Engine
- Uses edge-tts 7.x with explicit boundary="WordBoundary"
- Applies engine/respell.json only to spoken text (safe for English + Bangla)
- Caches each line by SHA-256 hash so editing 1 line only regenerates that line
- Concatenates exact 48kHz PCM WAV frames for zero cumulative drift
- Normalizes final narration.mp3 to -16 LUFS and writes audio/timestamps.json
"""

import argparse
import asyncio
import hashlib
import json
import re
import subprocess
import sys
import wave
from pathlib import Path
from typing import Any

import edge_tts

STUDIO_ROOT = Path(__file__).resolve().parents[2]
RESPELL_PATH = STUDIO_ROOT / "engine" / "respell.json"
SAMPLE_RATE = 48000
PUNCT_STRIP = ".,!?;:\"'()[]{}—–-।…“”‘’"


def load_lines(path: Path) -> list[str]:
    if not path.exists():
        raise FileNotFoundError(f"Missing required script file: {path}")
    lines = []
    for raw in path.read_text(encoding="utf-8").splitlines():
        stripped = raw.strip()
        if stripped and not stripped.startswith("#"):
            lines.append(stripped)
    return lines


def load_respell(path: Path) -> dict[str, str]:
    if not path.exists():
        return {}
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return {str(k): str(v) for k, v in data.items() if str(k).strip()}


def apply_respell(text: str, respell_map: dict[str, str]) -> str:
    if not respell_map:
        return text

    # 1. Apply multi-word replacements first using whitespace boundaries
    multi = {k: v for k, v in respell_map.items() if " " in k.strip()}
    single = {k.lower(): v for k, v in respell_map.items() if " " not in k.strip()}

    updated = text
    for phrase, replacement in sorted(multi.items(), key=lambda kv: -len(kv[0])):
        pattern = r"(?<!\S)" + re.escape(phrase) + r"(?!\S)"
        updated = re.sub(pattern, replacement, updated, flags=re.IGNORECASE)

    # 2. Apply single-token replacements safely (works for English & Bangla Unicode)
    if not single:
        return updated

    out_tokens = []
    for token in updated.split():
        core = token.strip(PUNCT_STRIP)
        if core and core.lower() in single:
            start_idx = token.find(core)
            end_idx = start_idx + len(core)
            out_tokens.append(token[:start_idx] + single[core.lower()] + token[end_idx:])
        else:
            out_tokens.append(token)
    return " ".join(out_tokens)


async def synthesize_line(
    spoken_text: str,
    voice: str,
    rate: str,
    mp3_path: Path,
    words_path: Path,
) -> list[dict[str, Any]]:
    communicate = edge_tts.Communicate(
        spoken_text,
        voice=voice,
        rate=rate,
        boundary="WordBoundary",
    )
    audio_chunks = bytearray()
    word_events: list[dict[str, Any]] = []

    async for chunk in communicate.stream():
        ctype = chunk.get("type")
        if ctype == "audio":
            audio_chunks.extend(chunk["data"])
        elif ctype == "WordBoundary":
            start_s = chunk["offset"] / 10_000_000
            end_s = (chunk["offset"] + chunk["duration"]) / 10_000_000
            word_events.append(
                {
                    "spoken": chunk["text"],
                    "start": round(start_s, 4),
                    "end": round(end_s, 4),
                }
            )

    if not audio_chunks:
        raise RuntimeError(
            f"edge-tts returned empty audio for voice '{voice}' on line: {spoken_text}"
        )

    mp3_path.write_bytes(audio_chunks)
    words_path.write_text(
        json.dumps(word_events, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    return word_events


def convert_to_wav(mp3_path: Path, wav_path: Path) -> float:
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-v",
            "error",
            "-i",
            str(mp3_path),
            "-ar",
            str(SAMPLE_RATE),
            "-ac",
            "1",
            "-c:a",
            "pcm_s16le",
            str(wav_path),
        ],
        check=True,
    )
    with wave.open(str(wav_path), "rb") as wf:
        return wf.getnframes() / float(wf.getframerate())


def align_subtitle_words(
    sub_line: str,
    word_events: list[dict[str, Any]],
    line_offset: float,
    line_duration: float,
) -> tuple[list[dict[str, Any]], str]:
    sub_tokens = sub_line.split()
    aligned: list[dict[str, Any]] = []

    if not sub_tokens:
        return aligned, "empty"

    # Case 1: Exact 1:1 parity between subtitle words and TTS WordBoundary events
    if len(word_events) == len(sub_tokens):
        for i, (tok, ev) in enumerate(zip(sub_tokens, word_events)):
            aligned.append(
                {
                    "index": i,
                    "word": tok,
                    "spoken": ev["spoken"],
                    "start": round(line_offset + ev["start"], 4),
                    "end": round(line_offset + ev["end"], 4),
                }
            )
        return aligned, "exact_1to1"

    # Case 2: TTS returned WordBoundary events, but tokenization differed slightly
    # Map proportionally across the active speech span [first_start, last_end]
    if word_events:
        span_start = word_events[0]["start"]
        span_end = max(word_events[-1]["end"], span_start + 0.05)
        mode = f"mapped_from_{len(word_events)}_tts_events"
    else:
        # Case 3: Voice emitted 0 WordBoundary events (fallback by character weight)
        span_start = 0.03
        span_end = max(line_duration - 0.05, 0.08)
        mode = "estimated_char_weighted"

    weights = [max(len(t.strip(PUNCT_STRIP)), 1) for t in sub_tokens]
    total_w = float(sum(weights))
    cursor = span_start
    span = span_end - span_start

    for i, (tok, w) in enumerate(zip(sub_tokens, weights)):
        seg = span * (w / total_w)
        aligned.append(
            {
                "index": i,
                "word": tok,
                "spoken": tok,
                "start": round(line_offset + cursor, 4),
                "end": round(line_offset + cursor + seg, 4),
            }
        )
        cursor += seg

    return aligned, mode


async def build_narration(
    project_dir: Path,
    voice: str,
    rate: str,
    pause_sec: float,
    tail_pad_sec: float,
) -> None:
    voice_lines = load_lines(project_dir / "voice_script.txt")
    sub_lines = load_lines(project_dir / "subtitle_script.txt")

    if len(voice_lines) != len(sub_lines):
        raise ValueError(
            f"Line count mismatch: voice_script.txt has {len(voice_lines)} lines "
            f"but subtitle_script.txt has {len(sub_lines)} lines."
        )

    respell_map = load_respell(RESPELL_PATH)
    audio_dir = project_dir / "audio"
    cache_dir = audio_dir / "cache"
    cache_dir.mkdir(parents=True, exist_ok=True)

    timeline_lines: list[dict[str, Any]] = []
    wav_paths: list[Path] = []
    cursor_sec = 0.0
    cache_hits = 0

    print(f"\nGenerating narration for: {project_dir.name}")
    print(f"Voice: {voice} | Rate: {rate} | Lines: {len(voice_lines)}\n")

    for idx, (v_line, s_line) in enumerate(zip(voice_lines, sub_lines)):
        spoken_line = apply_respell(v_line, respell_map)
        key_material = f"{voice}|{rate}|{spoken_line}".encode("utf-8")
        digest = hashlib.sha256(key_material).hexdigest()[:16]

        mp3_path = cache_dir / f"{digest}.mp3"
        wav_path = cache_dir / f"{digest}.wav"
        words_path = cache_dir / f"{digest}.words.json"

        if mp3_path.exists() and wav_path.exists() and words_path.exists():
            word_events = json.loads(words_path.read_text(encoding="utf-8"))
            with wave.open(str(wav_path), "rb") as wf:
                duration = wf.getnframes() / float(wf.getframerate())
            cache_hits += 1
            status = "CACHE"
        else:
            word_events = await synthesize_line(
                spoken_line, voice, rate, mp3_path, words_path
            )
            duration = convert_to_wav(mp3_path, wav_path)
            status = "NEW  "

        aligned_words, align_mode = align_subtitle_words(
            s_line, word_events, cursor_sec, duration
        )

        if align_mode != "exact_1to1":
            print(
                f"  [{status}] Line {idx:02d} ({duration:.2f}s) "
                f"[WARN: {align_mode} — sub={len(s_line.split())} vs tts={len(word_events)}]"
            )
        else:
            print(f"  [{status}] Line {idx:02d} ({duration:.2f}s) — exact 1:1 sync")

        timeline_lines.append(
            {
                "line_index": idx,
                "voice_text": v_line,
                "spoken_text": spoken_line,
                "subtitle_text": s_line,
                "start": round(cursor_sec, 4),
                "end": round(cursor_sec + duration, 4),
                "duration": round(duration, 4),
                "alignment_mode": align_mode,
                "words": aligned_words,
            }
        )
        wav_paths.append(wav_path)
        cursor_sec += duration
        if idx < len(voice_lines) - 1:
            cursor_sec += pause_sec

    total_duration = round(cursor_sec + tail_pad_sec, 4)

    # Concatenate PCM WAV frames cleanly (zero drift)
    raw_wav = audio_dir / "narration_raw.wav"
    pause_bytes = b"\x00\x00" * int(round(pause_sec * SAMPLE_RATE))
    tail_bytes = b"\x00\x00" * int(round(tail_pad_sec * SAMPLE_RATE))

    with wave.open(str(raw_wav), "wb") as out_wf:
        out_wf.setnchannels(1)
        out_wf.setsampwidth(2)
        out_wf.setframerate(SAMPLE_RATE)
        for i, wp in enumerate(wav_paths):
            with wave.open(str(wp), "rb") as in_wf:
                out_wf.writeframes(in_wf.readframes(in_wf.getnframes()))
            if i < len(wav_paths) - 1 and pause_bytes:
                out_wf.writeframes(pause_bytes)
        if tail_bytes:
            out_wf.writeframes(tail_bytes)

    # Normalize to -16 LUFS and encode final narration.mp3
    final_mp3 = audio_dir / "narration.mp3"
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-v",
            "error",
            "-i",
            str(raw_wav),
            "-af",
            "loudnorm=I=-16:TP=-1.5:LRA=11",
            "-ar",
            str(SAMPLE_RATE),
            "-ac",
            "1",
            "-b:a",
            "192k",
            str(final_mp3),
        ],
        check=True,
    )
    raw_wav.unlink(missing_ok=True)

    timestamps_path = audio_dir / "timestamps.json"
    payload = {
        "voice": voice,
        "rate": rate,
        "pause_between_lines": pause_sec,
        "tail_pad": tail_pad_sec,
        "total_duration": total_duration,
        "lines": timeline_lines,
    }
    timestamps_path.write_text(
        json.dumps(payload, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    print(
        f"\nDONE! Saved {final_mp3.relative_to(STUDIO_ROOT)} and "
        f"{timestamps_path.relative_to(STUDIO_ROOT)}"
    )
    print(
        f"Total duration: {total_duration:.2f}s | "
        f"Cache hits: {cache_hits}/{len(voice_lines)}\n"
    )


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate line-cached TTS narration + word-level timestamps.json"
    )
    parser.add_argument(
        "project_dir",
        help="Path to episode folder (e.g., projects/00-test-30s)",
    )
    parser.add_argument(
        "--voice",
        default="en-US-AndrewNeural",
        help="edge-tts voice (e.g., en-US-AndrewNeural, bn-BD-PradeepNeural, bn-BD-NabanitaNeural)",
    )
    parser.add_argument("--rate", default="+0%", help="Speech rate (e.g., +5%%, -5%%)")
    parser.add_argument(
        "--pause",
        type=float,
        default=0.22,
        help="Silence gap between lines in seconds (default: 0.22)",
    )
    parser.add_argument(
        "--tail-pad",
        type=float,
        default=0.35,
        help="Trailing silence after final word in seconds (default: 0.35)",
    )
    args = parser.parse_args()

    project_path = Path(args.project_dir)
    if not project_path.is_absolute():
        project_path = (STUDIO_ROOT / project_path).resolve()

    asyncio.run(
        build_narration(
            project_dir=project_path,
            voice=args.voice,
            rate=args.rate,
            pause_sec=args.pause,
            tail_pad_sec=args.tail_pad,
        )
    )


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"\n[ERROR] {exc}", file=sys.stderr)
        sys.exit(1)