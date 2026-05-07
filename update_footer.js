const fs = require('fs');
const path = require('path');

let updatedCount = 0;

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // Address replacements
    // The exact HTML string might vary slightly with spaces, so let's use regex
    const addressRegex1 = /DRIP Studio<br[^>]*>12 Forge Lane, Riverton<br[^>]*>Fictionland 00000/g;
    const addressRegex2 = /12 Forge Lane, Riverton<br[^>]*>Fictionland 00000/g;
    const addressRegex3 = /12 Forge Lane, Riverton Fictionland 00000/g;
    
    // Replace address
    content = content.replace(addressRegex1, 'Ahmedabad Indian - 382445');
    content = content.replace(addressRegex2, 'Ahmedabad Indian - 382445');
    content = content.replace(addressRegex3, 'Ahmedabad Indian - 382445');

    // Email replacements
    content = content.replace(/hello@raw\.example/gi, 'p.anupam@rapidcode.in');
    
    // Some places might have mailto links
    content = content.replace(/mailto:hello@raw\.example/gi, 'mailto:p.anupam@rapidcode.in');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated footer details in ${filePath}`);
        updatedCount++;
    }
}

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                processDir(fullPath);
            }
        } else if (file.endsWith('.html')) {
            processFile(fullPath);
        }
    }
}

processDir('.');
console.log(`\nUpdated ${updatedCount} files.`);
