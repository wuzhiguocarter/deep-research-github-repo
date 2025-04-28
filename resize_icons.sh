#!/bin/bash

# Script to resize icons for Chrome extension
# Uses sips which is built into macOS

SOURCE_ICON="images/icon.png"
SIZES=(16 48 128)

# Check if source icon exists
if [ ! -f "$SOURCE_ICON" ]; then
  echo "Error: Source icon $SOURCE_ICON not found!"
  exit 1
fi

# Create resized icons
for size in "${SIZES[@]}"; do
  echo "Creating ${size}x${size} icon..."
  sips -Z $size "$SOURCE_ICON" --out "images/icon${size}.png"
done

echo "Icon resizing complete!"
