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

    // Remove remaining framercommerce dataset attributes
    content = content.replace(/\sdata-framercommerce-widget(?:="[^"]*")?/g, '');
    
    // Replace dripline.framer.website with rapidcode.in in og:url
    content = content.replace(/content="https:\/\/dripline\.framer\.website\/([^"]*)"/g, 'content="https://rapidcode.in/$1"');
    content = content.replace(/content="https:\/\/rawline\.framer\.website\/([^"]*)"/g, 'content="https://rapidcode.in/$1"');

    // Make sure we didn't miss the rawline.framer.website -> rapidcode.in
    content = content.replace(/rawline\.framer\.website/g, 'rapidcode.in');
    content = content.replace(/dripline\.framer\.website/g, 'rapidcode.in');

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        totalUpdated++;
    }
}

processDir('.');
console.log(`Updated ${totalUpdated} files with remaining minor tweaks`);
