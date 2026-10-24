#!/bin/bash
cd "$(dirname "$0")"
echo "=========================================================="
echo "  Sakil Ahammed Portfolio - Local Server"
echo "  Live at: http://localhost:5500"
echo "=========================================================="
python3 -m http.server 5500
