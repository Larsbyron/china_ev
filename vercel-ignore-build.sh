#!/usr/bin/env bash
# Vercel Ignored Build Step — skips deploys when a commit only touches
# state/log files that don't affect any rendered page.
#
# Vercel convention:
#   exit 0 → skip build
#   exit 1 → proceed with build (default if this script errors)
#
# Decision rule: build IF any changed file is OUTSIDE the ignore list.

set -uo pipefail

IGNORE_REGEX='^(tweet-log\.json|processed_articles\.json|\.runlog\.jsonl|README\.md|CLAUDE\.md)$'

# Vercel runs this in the deployment workspace with HEAD pointing at the
# commit being built. HEAD^ may be unavailable on first commit or unusual
# shallow clones — in that case, build to be safe.
if ! CHANGED=$(git diff --name-only HEAD^ HEAD 2>/dev/null); then
  echo "[ignore-build] cannot diff against HEAD^ — building to be safe"
  exit 1
fi

if [ -z "$CHANGED" ]; then
  echo "[ignore-build] no file changes detected — skipping build"
  exit 0
fi

echo "[ignore-build] changed files:"
printf '  %s\n' $CHANGED

# Any file not matching the ignore regex forces a build
while IFS= read -r file; do
  if ! [[ "$file" =~ $IGNORE_REGEX ]]; then
    echo "[ignore-build] $file requires build → proceeding"
    exit 1
  fi
done <<< "$CHANGED"

echo "[ignore-build] only state/log files changed → skipping build"
exit 0
