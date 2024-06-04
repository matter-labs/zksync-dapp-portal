#!/bin/sh

# Ensure the script stops if any command fails
set -e

# Run the final npm command
npm run generate

# Run the first npm command and move folder
cp -r .output/public/ ./dist-node-memory/

# Run the second npm command and move folder
cp -r .output/public/ ./dist-node-docker/