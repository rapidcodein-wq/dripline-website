const fs = require('fs');

function dumpText(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    // Basic HTML tag removal
    let text = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                      .replace(/<[^>]+>/g, ' ')
                      .replace(/\s+/g, ' ');
    
    // Look for framer or rapidcode in the clean text
    const framerMatches = text.match(/.{0,50}framer.{0,50}/gi);
    const rapidcodeMatches = text.match(/.{0,50}rapidcode.{0,50}/gi);
    
    console.log(`\n=== ${filePath} ===`);
    console.log("Framer mentions:");
    console.log(framerMatches ? framerMatches : "None");
    console.log("\nRapidcode mentions:");
    console.log(rapidcodeMatches ? rapidcodeMatches : "None");
}

dumpText('legal/privacy-policy.html');
dumpText('legal/terms-and-conditions.html');
