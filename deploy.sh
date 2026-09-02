#!/usr/bin/env bash
# CEAN Auto-Deploy Script
# This script will:
# 1. Verify _redirects file exists
# 2. Rebuild frontend
# 3. Commit + push to GitHub
# 4. Show Netlify redeploy trigger instructions

set -e

cd "$(dirname "$0")/frontend"

echo ""
echo "========================================"
echo "  CEAN Auto-Deploy"
echo "========================================"
echo ""

# Verify _redirects file
if [ ! -f "public/_redirects" ]; then
    echo "[ERROR] public/_redirects file missing!"
    exit 1
fi

echo "[1/4] _redirects file: OK"

# Build
echo ""
echo "[2/4] Building frontend..."
npm run build

if [ ! -d "dist" ]; then
    echo "[ERROR] Build failed - dist folder not created"
    exit 1
fi

if [ ! -f "dist/_redirects" ]; then
    echo "[ERROR] _redirects not in dist after build"
    exit 1
fi

echo "[3/4] Build: OK (_redirects included)"

# Git commit + push
cd ..
echo ""
echo "[4/4] Git commit + push..."

GIT="C:/Program Files/Git/bin/git.exe"

"$GIT" add . 2>&1 | grep -v "warning:" || true
"$GIT" commit -m "Fix: Netlify _redirects for SPA routing" 2>&1 | grep -v "warning:" || true
"$GIT" push origin main 2>&1 | grep -v "warning:" || true

echo ""
echo "========================================"
echo "  Done!"
echo "========================================"
echo ""
echo "Next: Wait 2-3 minutes for Netlify auto-deploy."
echo "Then visit: https://ceanwebsite.netlify.app"
echo ""
echo "If still 404:"
echo "  1. Go to: https://app.netlify.com"
echo "  2. Click your site"
echo "  3. Site settings > Build & deploy > Continuous deployment"
echo "  4. Verify: Base dir = 'frontend', Publish dir = 'frontend/dist'"
echo ""