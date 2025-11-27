#!/bin/bash

# Simple tree generator that respects .gitignore
dir=${1:-.}

echo "# Project Tree"
echo ""
echo '```'

# Change to target directory if specified
if [[ "$dir" != "." ]]; then
    cd "$dir" || exit 1
fi

# Get files respecting .gitignore
if git rev-parse --git-dir >/dev/null 2>&1; then
    git ls-files --cached --others --exclude-standard | sort
else
    find . -type f | sed 's|^\./||' | sort
fi | awk -F'/' '
{
    # For each file path
    for (i = 1; i <= NF; i++) {
        path = ""
        for (j = 1; j <= i; j++) {
            if (j > 1) path = path "/"
            path = path $j
        }
        
        # Mark this path level
        if (!seen[path]) {
            seen[path] = 1
            
            # Create indentation
            indent = ""
            for (k = 1; k < i; k++) {
                indent = indent "│   "
            }
            
            # Print directory or file
            if (i < NF) {
                print indent "├── " $i "/"
            } else {
                print indent "├── " $i
            }
        }
    }
}
'

echo '```'
