const fs = require('fs');
const path = require('path');

function searchFiles() {
    let results = { widget: [], rawline: [], framerText: [] };

    function walk(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (file.startsWith('.') || file === 'node_modules') continue;
            if (fs.statSync(fullPath).isDirectory()) {
                walk(fullPath);
            } else if (fullPath.endsWith('.html')) {
                const content = fs.readFileSync(fullPath, 'utf8');
                
                // Find widget
                if (content.includes('width: 142px') && content.includes('background: white')) {
                    results.widget.push(fullPath);
                }
                
                // Find Rawline (case insensitive)
                const rawlineMatches = [...content.matchAll(/\b[Rr]awline\b/g)];
                if (rawlineMatches.length > 0) {
                    results.rawline.push({ file: fullPath, count: rawlineMatches.length });
                }
                
                // Find "Made in Framer", "Built in Framer", etc
                const framerText = [...content.matchAll(/[^<]*\bFramer\b[^<]*/g)];
                framerText.forEach(m => {
                    const txt = m[0].trim();
                    if (!txt.includes('framer-') && !txt.includes('.mjs') && txt.length < 150) {
                        results.framerText.push({ file: fullPath, text: txt });
                    }
                });
            }
        }
    }
    walk('.');
    
    console.log("Widget found in files:", results.widget.length);
    console.log("\nRawline found in files:", results.rawline);
    console.log("\nFramer visible text found:", results.framerText.length);
    if (results.framerText.length > 0) {
        results.framerText.slice(0, 5).forEach(f => console.log(`  [${f.file}] ${f.text}`));
    }
}

searchFiles();
