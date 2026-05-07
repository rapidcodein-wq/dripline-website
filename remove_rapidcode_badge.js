const fs = require('fs');
const path = require('path');

let removedCount = 0;

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // The badge is wrapped in a div. We can remove it by finding the div that contains this link.
    // It's likely injected right before </body>
    // Let's use a regex to match the wrapper div and the link.
    
    // Pattern to match the rapidcode badge div. It looks like it's a div containing the link.
    const badgeRegex = /<div[^>]*>\s*<a href="https:\/\/rapidcode\.in\/"[^>]*>.*?<\/a>\s*<\/div>/gs;
    
    content = content.replace(badgeRegex, '');

    // Also remove the specific kill badge CSS since the user might not need it, or we can keep it just in case.
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Removed rapidcode badge from ${filePath}`);
        removedCount++;
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
console.log(`\nRemoved badge from ${removedCount} files.`);
