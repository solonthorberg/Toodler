#!/bin/bash

echo "# Project Structure (Folders Only)"
echo ""
echo '```'

# Get all files and extract unique directory paths
git ls-files --cached --others --exclude-standard | \
while IFS= read -r file; do
    dirname "$file"
done | \
sort -u | \
grep -v '^.$' | \
awk -F'/' '
{
    # For each directory path
    for (i = 1; i <= NF; i++) {
        path = ""
        for (j = 1; j <= i; j++) {
            if (j > 1) path = path "/"
            path = path $j
        }
        
        # Mark this directory level
        if (!seen[path]) {
            seen[path] = 1
            
            # Create indentation
            indent = ""
            for (k = 1; k < i; k++) {
                indent = indent "│   "
            }
            
            # Print directory with trailing slash
            print indent "├── " $i "/"
        }
    }
}
'

echo '```'
