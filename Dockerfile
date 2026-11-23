FROM node:22-bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive \
    CHROME_BIN=/usr/bin/chromium \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    HYPERFRAMES_PREVIEW_HOST=0.0.0.0 \
    PATH="/opt/venv/bin:/root/.local/bin:${PATH}"

# 1. Core media, browser, Python, archive tools, and Bangla + English fonts
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    chromium \
    python3 \
    python3-pip \
    python3-venv \
    git \
    curl \
    unzip \
    xz-utils \
    ca-certificates \
    fontconfig \
    fonts-noto-core \
    fonts-noto-ui-core \
    fonts-noto-extra \
    fonts-noto-color-emoji \
    fonts-liberation \
    && fc-cache -fv \
    && rm -rf /var/lib/apt/lists/*

# 2. Isolated Python virtual environment with free neural TTS (EN + BN)
RUN python3 -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir edge-tts

# 3. HyperFrames CLI (open-source HTML-to-MP4 engine)
RUN npm install -g hyperframes

# 4. Google Antigravity CLI (official coding agent for Google AI Pro accounts)
RUN curl -fsSL https://antigravity.google/cli/install.sh | bash

WORKDIR /studio
CMD ["sleep", "infinity"]