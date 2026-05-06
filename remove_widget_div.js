const fs = require('fs');
const path = require('path');

let totalUpdated = 0;

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (file.startsWith('.') || file === 'node_modules') continue;
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            processFile(fullPath);
        }
    }
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // The widget div has specific styles and structure:
    // <div style="position: fixed; z-index: 2147483647;...
    
    // Let's use a regex that matches this exact block
    // We look for the div with z-index: 2147483647 and the onmouseover event
    const widgetRegex = /<div\s+style="position:\s*fixed;\s*z-index:\s*2147483647;[^>]*>[\s\S]*?<\/div>\s*(?=<\/body>|<script)/g;
    
    content = content.replace(widgetRegex, '');

    // Also remove any other hardcoded bottom-right fixed divs with 2147483647
    const fallbackRegex = /<div\s+[^>]*2147483647[^>]*>[\s\S]*?<\/div>/g;
    content = content.replace(fallbackRegex, '');

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        totalUpdated++;
    }
}

processDir('.');
console.log(`Removed hardcoded commerce widget from ${totalUpdated} files`);
