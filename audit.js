const fs = require('fs');
const path = require('path');

function searchDir(dir, terms) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            searchDir(fullPath, terms);
        } else if (fullPath.endsWith('.html')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            for (const term of terms) {
                const regex = new RegExp(term, 'gi');
                const matches = content.match(regex);
                if (matches) {
                    console.log(`Found "${term}" x${matches.length} in ${fullPath}`);
                }
            }
        }
    }
}

// Search for brand names
searchDir('.', ['rawline', 'RAWLINE', 'Rawline', 'raw clothing', 'RAW CLOTHING']);

// Search for social media and framer links
console.log('\n--- Social/Framer links ---');
searchDir('.', ['facebook\\.com', 'instagram\\.com', 'x\\.com', 'twitter\\.com', 'framer\\.com', 'framercommerce\\.com']);
