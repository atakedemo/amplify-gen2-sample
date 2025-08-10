#!/bin/bash

echo "=== Checking available tools ==="
echo "wget location: $(which wget 2>/dev/null || echo 'NOT FOUND')"
echo "curl location: $(which curl 2>/dev/null || echo 'NOT FOUND')"
echo "Current user: $(whoami)"
echo "Current directory: $(pwd)"
echo "Available packages:"
apk list --installed | grep -E "(wget|curl|ca-certificates)" || echo "No matching packages found" 