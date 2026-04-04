#!/bin/bash
set -e

STRATO_HOST="your-domain.de"
STRATO_USER="your-username"
STRATO_PASS="your-password"
LOCAL_DIR="public"

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo "=========================================="
echo "  China EV News — Deploy to Strato"
echo "=========================================="

if [ ! -d "$LOCAL_DIR" ]; then
    echo -e "${RED}❌ Error: $LOCAL_DIR not found. Run 'hugo' first${NC}"
    exit 1
fi

FILE_COUNT=$(find "$LOCAL_DIR" -type f | wc -l)
echo -e "${GREEN}📦 Deploying $FILE_COUNT files${NC}"

if ! command -v lftp &> /dev/null; then
    echo "Installing lftp..."
    brew install lftp
fi

lftp -c "set ftp:ssl-allow no; open -u $STRATO_USER,$STRATO_PASS ftp.$STRATO_HOST; mirror -R --verbose $LOCAL_DIR /; bye"

echo -e "${GREEN}✅ Deployment successful!${NC}"
