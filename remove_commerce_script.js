const fs = require('fs');
const path = require('path');

let totalUpdated = 0;

// Regex to remove the entire <!-- Plugin: ced618 --> ... <!-- SnippetEnd: ... --> block
// This covers the __FcCheckoutConfigs script injected by Framer Commerce
const snippetRegex = /<!-- Plugin: ced618 -->[\s\S]*?<!-- SnippetEnd:[^>]*-->/g;

// Also remove any standalone __FcCheckoutConfigs script blocks (fallback)
const fcConfigRegex = /<script>\s*\(function\(\)\s*\{[\s\S]*?window\.__FcCheckoutConfigs[\s\S]*?\}\)\(\);\s*<\/script>/g;

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            // Skip .git and node_modules
            if (file === '.git' || file === 'node_modules') continue;
            processDir(fullPath);
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;

            content = content.replace(snippetRegex, '');
            content = content.replace(fcConfigRegex, '');

            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Cleaned: ' + fullPath);
                totalUpdated++;
            }
        }
    }
}

processDir('.');
console.log(`\nDone. Removed Framer Commerce scripts from ${totalUpdated} file(s).`);
