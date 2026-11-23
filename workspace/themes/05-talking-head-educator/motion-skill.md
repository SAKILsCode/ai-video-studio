# motion-skill.md — 05 Talking Head Educator

## Motion Rules
- Use `aroll_prep` workflow (constant 30fps lock + silence trim + vocal polish + word timestamps) before coding visuals.
- Morph camera cleanly between Layout A and Layout B/C via `pip-stage-morph` using `data-track-index`.
- Render long 15-25 min lectures in 2-3 minute chapter chunks and stitch via FFmpeg to guarantee zero lip-sync drift.

## Video -> Lesson -> Skill Log
- [Lesson 00]: Locked filming framing and 30fps contract before building automated PiP transitions.
