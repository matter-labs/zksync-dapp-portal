#!/bin/sh

# Ensure the script stops if any command fails
set -e

# Run the first npm command and move folder
npm run generate:node:memory
mv .output/public ./dist-node-memory

# Run the second npm command and move folder
npm run generate:node:docker
mv .output/public ./dist-node-docker

# Run the final npm command
npm run generate