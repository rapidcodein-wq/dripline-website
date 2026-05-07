const fs = require('fs');

function findKeywords(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    // Basic text extraction
    const text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    
    // Look for common address/email patterns
    const addressMatches = text.match(/.{0,50}(?:\b(?:address|email|contact|street|ave|road|india|ahmedabad|rawline\.com|@)\b).{0,50}/gi);
    
    if (addressMatches) {
        console.log(`\n--- ${filePath} ---`);
        // Remove duplicates and limit output
        const unique = [...new Set(addressMatches)].slice(0, 5);
        unique.forEach(m => console.log(m));
    }
}

// Check a few key files
findKeywords('index.html');
findKeywords('about.html');
findKeywords('legal/privacy-policy.html');
