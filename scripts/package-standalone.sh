#!/usr/bin/env bash
# Builds the site into one self-contained folder, ready to upload to a host
# that runs Node.js but should not build the app itself (for example a cPanel
# "Setup Node.js App" / Passenger host). Output: deploy/ (start file: app.js, site files in deploy/site).
set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf .next deploy
NEXT_OUTPUT=standalone NEXT_TELEMETRY_DISABLED=1 npx next build

# The site goes in deploy/site, so its node_modules folder never clashes with
# the node_modules link that cPanel/CloudLinux manages in the app's root folder.
mkdir -p deploy
cp -R .next/standalone deploy/site
mkdir -p deploy/site/.next deploy/site/db
cp -R .next/static deploy/site/.next/static
cp -R public deploy/site/public
cp db/schema.sql deploy/site/db/schema.sql
# Never ship local secrets.
rm -f deploy/site/.env deploy/site/.env.*
# Passenger hosts look for app.js in the app root by default.
cat > deploy/app.js <<'JS'
// Start file for Passenger / cPanel Node.js hosting: runs the site in ./site
// (server.js switches the working folder to ./site itself).
require("./site/server.js");
JS
# A package.json with no dependencies, for control panels that expect one.
cat > deploy/package.json <<'JSON'
{ "name": "ark-mouldtech-website", "private": true, "main": "app.js", "scripts": { "start": "node app.js" }, "engines": { "node": ">=20.9.0" } }
JSON

echo "Ready: deploy/ ($(du -sh deploy | cut -f1)). Start with: node app.js"
