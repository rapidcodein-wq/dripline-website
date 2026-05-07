const fs = require('fs');
const path = require('path');

let totalUpdated = 0;

// Remove the entire __badge-container-disabled div and all its contents
// It appears as: <div id="__badge-container-disabled">...entire badge HTML...</div>
function removeBadgeDiv(content) {
    const startMarker = '<div id="__badge-container-disabled">';
    const endMarker = '</div>';
    
    let pos = content.indexOf(startMarker);
    if (pos === -1) return content;
    
    // Find the matching closing </div> by tracking nesting depth
    let depth = 0;
    let i = pos;
    while (i < content.length) {
        if (content.startsWith('<div', i)) {
            depth++;
            i += 4;
        } else if (content.startsWith('</div>', i)) {
            depth--;
            if (depth === 0) {
                // Found the end - remove the entire block
                const end = i + 6; // length of '</div>'
                return content.slice(0, pos) + content.slice(end);
            }
            i += 6;
        } else {
            i++;
        }
    }
    return content;
}

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file === '.git' || file === 'node_modules') continue;
            processDir(fullPath);
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (!content.includes('__badge-container-disabled')) continue;
            
            const original = content;
            content = removeBadgeDiv(content);
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Removed badge div from: ' + fullPath);
                totalUpdated++;
            }
        }
    }
}

processDir('.');
console.log(`\nDone. Removed hardcoded Framer badge from ${totalUpdated} file(s).`);
