const fs = require('fs');

function findCleanFramer(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    // Match "framer" (case insensitive) where it's not part of a URL, class, or attribute
    // Basically, preceded and followed by space or punctuation (but not hyphens/dots used in URLs/classes)
    const regex = /(?:^|[^a-zA-Z0-9\-\.\/])([Ff]ramer)(?=[^a-zA-Z0-9\-\.\/]|$)/g;
    
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

findCleanFramer('legal/privacy-policy.html');
findCleanFramer('legal/terms-and-conditions.html');
