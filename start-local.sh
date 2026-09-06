#!/usr/bin/env sh
set -eu

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required. Install Node 22 LTS and run this script again."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

PORT="${PORT:-3000}"
echo "Starting LOCAL/SHOWROOM V2 on http://localhost:${PORT}"
npm run dev -- -p "$PORT"
