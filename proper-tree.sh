#!/bin/bash

dir=${1:-.}

echo "# Project Tree"
echo ""
echo "\`\`\`"

# Get files respecting .gitignore
if git rev-parse --git-dir >/dev/null 2>&1; then
    files=$(git ls-files --cached --others --exclude-standard | sort)
else
    files=$(find . -type f | sed 's|^\./||' | sort)
fi

# Build tree structure
declare -A tree_structure
while IFS= read -r file; do
    [[ -z "$file" ]] && continue
    tree_structure["$file"]=1
done <<< "$files"

# Print root directory
echo "."

# Process and print tree
echo "$files" | while IFS= read -r file; do
    [[ -z "$file" ]] && continue
    
    # Count depth and create proper tree characters
    depth=$(echo "$file" | tr -cd '/' | wc -c)
    
    # Create the tree prefix
    prefix=""
    IFS='/' read -ra parts <<< "$file"
    
    for ((i=0; i<${#parts[@]}; i++)); do
        if [[ $i -eq $((${#parts[@]}-1)) ]]; then
            # Last item (file)
            echo "${prefix}├── ${parts[i]}"
        else
            # Directory
            if [[ $i -eq 0 ]]; then
                echo "├── ${parts[i]}/"
                prefix="│   "
            else
                echo "${prefix}├── ${parts[i]}/"
                prefix="${prefix}│   "
            fi
        fi
    done
done | sort -u

echo "\`\`\`"
