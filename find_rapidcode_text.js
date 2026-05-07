const fs = require('fs');

function findExactRapidcode(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const regex = /rapidcode/gi;
    
    let match;
    console.log(`\n--- Matches in ${filePath} ---`);
    let count = 0;
    while ((match = regex.exec(content)) !== null) {
        count++;
        const pos = match.index;
        const context = content.substring(Math.max(0, pos - 60), Math.min(content.length, pos + 60));
        console.log(`[Match ${count}] ...${context}...`);
    }
    if (count === 0) console.log("No text occurrences found.");
}

findExactRapidcode('legal/privacy-policy.html');
findExactRapidcode('legal/terms-and-conditions.html');
