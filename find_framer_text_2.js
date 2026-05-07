const fs = require('fs');

function findTextWithFramer(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    // Look for tags containing text with "framer", e.g., >...Framer...<
    // We want to avoid matching URLs, class names, variable names, etc.
    // So we look for a closing bracket >, followed by some characters that don't contain <, >, =, or {,},
    // and containing the word "framer" (case insensitive), then an opening bracket <.
    const regex = />([^<]*?\bframer\b[^<]*)<\/?[a-z]/gi;
    
    let match;
    console.log(`\n--- Matches in ${filePath} ---`);
    let found = false;
    while ((match = regex.exec(content)) !== null) {
        // Exclude CSS and JS matches
        const text = match[1].trim();
        if (text.length > 0 && !text.includes('{') && !text.includes('}')) {
            console.log(text);
            found = true;
        }
    }
    if (!found) console.log("No visible text matches found.");
}

findTextWithFramer('legal/privacy-policy.html');
findTextWithFramer('legal/terms-and-conditions.html');
