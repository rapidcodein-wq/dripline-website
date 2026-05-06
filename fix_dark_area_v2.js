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

            // The previous rules used div[data-framer-name="Features"] but the actual
            // element is a <section>, not a <div>. We need to target by class and also
            // use element-agnostic selectors.
            const marker = '/* fix-dark-area-v2 */';
            if (!content.includes(marker)) {
                const style = `<style>${marker}
[data-framer-name="Features"],
.framer-15jom4l[data-framer-name="Features"],
section.framer-15jom4l,
section[data-framer-name="Features"] {
  display: none !important;
}
</style>`;
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
