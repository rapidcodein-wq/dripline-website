const fs = require('fs');
const path = require('path');

let widgetRegex = /<div\s+style="position:\s*fixed;\s*z-index:\s*2147483647;[^>]*>[\s\S]*?<\/div>\s*(?=<script|<\/body>)/;
let fallbackWidgetRegex = /<div[^>]*2147483647[^>]*>[\s\S]*?<\/div>/;

// The widget is essentially injected by a script or it's hardcoded. Wait, I saw it has "width: 142px;" and "background: white;" and href="https://rapidcode.in/". Let's use a very safe regex.
let exactWidgetRegex = /<div[^>]*>\s*<a\s+href="https:\/\/rapidcode\.in\/"[^>]*>\s*<img[^>]*src="[^"]*commerce-badge[^"]*"[^>]*>\s*<\/a>\s*<\/div>/g;
// Actually the img src might be different. Let's just find "width: 142px;" and "z-index" in a div.
let widgetRegex2 = /<div\s+style="position:\s*fixed;\s*z-index:\s*2147483647;\s*bottom:\s*16px;\s*right:\s*16px;\s*width:\s*142px;\s*height:\s*38px;[\s\S]*?<\/div>/g;

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

            // 1. Legal Pages text replacement
            if (fullPath.includes('privacy-policy.html') || fullPath.includes('terms-and-conditions.html')) {
                // Replace all visible "Framer" mentions with "Made by RapidCode"
                // Being careful not to touch class="framer-..." or data-framer-...
                
                // We'll replace the text content of elements. The legal text is likely inside <p> or <span> tags.
                // Replace "Framer" (word boundary) with "Made by RapidCode" only when it's part of regular text
                // Since this is tricky with regex, let's just replace all "Framer" that are not preceded by "-" or "."
                content = content.replace(/(?<![\-\.])\bFramer\b(?![\-\.])/g, 'Made by RapidCode');
            }

            // 2. Replace "Rawline" with "DripLine" globally
            content = content.replace(/(?<![\-\.])\bRawline\b(?![\-\.])/g, 'DripLine');
            content = content.replace(/(?<![\-\.])\bRAWLINE\b(?![\-\.])/g, 'DRIPLINE');
            content = content.replace(/(?<![\-\.])\brawline\b(?![\-\.])/g, 'dripline');

            // 3. Remove the commerce widget definitively
            content = content.replace(widgetRegex2, '');
            
            // Also, let's check for the exact string we saw earlier
            const widgetStr = `<div style="position: fixed; z-index: 2147483647; bottom: 16px; right: 16px; width: 142px; height: 38px; background: white; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px; display: flex; align-items: center; justify-content: center; overflow: hidden;" onmouseover="this.style.opacity = '1'" onmouseout="this.style.opacity = '1'"><a href="https://rapidcode.in/" target="_blank" style="display: block; line-height: 0;"><img src="https://framerusercontent.com/images/15vRGEuO7k9uF1b5f1s2QpP3I.svg" alt="DripLine" style="width: 110px; height: auto;"></a></div>`;
            content = content.replace(widgetStr, '');
            
            // And variations with different whitespace
            content = content.replace(/<div\s+style="position:\s*fixed;\s*z-index:\s*2147483647;[\s\S]*?<\/a>\s*<\/div>/g, '');

            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log(`Cleaned: ${fullPath}`);
            }
        }
    }
}

cleanFiles('.');
console.log('Cleanup complete.');
