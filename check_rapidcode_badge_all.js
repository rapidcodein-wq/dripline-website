const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                processDir(fullPath);
            }
        } else if (file.endsWith('.html')) {
            const html = fs.readFileSync(fullPath, 'utf8');
            const regex = /<a href="https:\/\/rapidcode\.in\/"[^>]*>.*?<\/a>/gs;
            const matches = html.match(regex);
            
            if (matches) {
                console.log(`Found ${matches.length} matches in ${fullPath}`);
            }
        }
    }
}

processDir('.');
