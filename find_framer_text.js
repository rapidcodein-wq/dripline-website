const fs = require('fs');

const filePath = 'legal/privacy-policy.html';
const content = fs.readFileSync(filePath, 'utf8');

// We want to find occurrences of the word "Framer" or "framer" that are likely text.
// Let's use a regex to find "Framer" not immediately preceded or followed by a hyphen or slash or dot or in a tag attribute.
// It's safer to just search for ">[^<]*[Ff]ramer[^<]*<" (text between HTML tags).

const textMatches = content.match(/>[^<]*[Ff]ramer[^<]*</g);
if (textMatches) {
    console.log("Text occurrences:");
    textMatches.forEach(match => console.log(match));
} else {
    console.log("No text occurrences found.");
}
