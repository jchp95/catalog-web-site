#!/usr/bin/env bash
# One-time helper: push CapRover secrets to GitHub Actions.
# Usage (after `gh auth login`):
#   CAPROVER_SERVER='https://captain.apps.solva.click' \
#   APP_NAME='catalog-web-site' \
#   APP_TOKEN='<token from CapRover Deployment tab>' \
#   ./scripts/set-caprover-secrets.sh
set -euo pipefail

REPO="${GITHUB_REPO:-jchp95/catalog-web-site}"

: "${CAPROVER_SERVER:?Set CAPROVER_SERVER (e.g. https://captain.apps.solva.click)}"
: "${APP_NAME:?Set APP_NAME (e.g. catalog-web-site)}"
: "${APP_TOKEN:?Set APP_TOKEN (CapRover app token)}"

# Normalize trailing slash
CAPROVER_SERVER="${CAPROVER_SERVER%/}"

gh secret set CAPROVER_SERVER --repo "$REPO" --body "$CAPROVER_SERVER"
gh secret set APP_NAME --repo "$REPO" --body "$APP_NAME"
gh secret set APP_TOKEN --repo "$REPO" --body "$APP_TOKEN"

echo "Secrets set on $REPO:"
gh secret list --repo "$REPO"
