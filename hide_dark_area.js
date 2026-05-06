const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Add CSS to hide the "Features" block which is the large dark area
            const style = '<style>div[data-framer-name="Features"], div[data-framer-name="Features Wrapper"], div[data-framer-name="Triggers"] { display: none !important; }</style>';
            if (!content.includes('div[data-framer-name="Features Wrapper"]')) {
                if (content.includes('</body>')) {
                    content = content.replace('</body>', style + '</body>');
                    modified = true;
                }
            }

            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log('Updated ' + fullPath);
            }
        }
    }
}

processDir('.');
