const fs = require('fs');
const path = require('path');

let totalUpdated = 0;

function cleanFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (file.startsWith('.') || file === 'node_modules') continue;
        if (fs.statSync(fullPath).isDirectory()) {
            cleanFiles(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;

            // Find and remove any <script> ... </script> block that contains "data-framercommerce-widget"
            // Using a while loop to handle multiple matches just in case
            let pos = 0;
            while ((pos = content.indexOf('data-framercommerce-widget', pos)) !== -1) {
                const scriptStart = content.lastIndexOf('<script', pos);
                const scriptEnd = content.indexOf('</script>', pos) + 9;
                
                if (scriptStart !== -1 && scriptEnd !== -1 && scriptStart < pos && pos < scriptEnd) {
                    const scriptBlock = content.substring(scriptStart, scriptEnd);
                    // Double check it's the right script
                    if (scriptBlock.includes('document.createElement(\'div\')') || scriptBlock.includes('widget.innerHTML')) {
                        content = content.substring(0, scriptStart) + content.substring(scriptEnd);
                        pos = scriptStart; // adjust position since string shrank
                    } else {
                        pos += 10;
                    }
                } else {
                    pos += 10;
                }
            }

            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log(`Removed widget injection script from: ${fullPath}`);
                totalUpdated++;
            }
        }
    }
}

cleanFiles('.');
console.log(`Total files updated: ${totalUpdated}`);
