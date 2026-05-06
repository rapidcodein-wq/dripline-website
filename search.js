const fs = require('fs');
const path = require('path');

function searchDir(dir, terms) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            searchDir(fullPath, terms);
        } else if (fullPath.endsWith('.html') || fullPath.endsWith('.js') || fullPath.endsWith('.mjs') || fullPath.endsWith('.css')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            for (const term of terms) {
                if (content.toLowerCase().includes(term.toLowerCase())) {
                    console.log(`Found "${term}" in ${fullPath}`);
                    
                    // Show a little context
                    const index = content.toLowerCase().indexOf(term.toLowerCase());
                    console.log('Context:', content.substring(Math.max(0, index - 30), Math.min(content.length, index + 30)));
                }
            }
        }
    }
}

searchDir('.', ['get now', 'syed']);
