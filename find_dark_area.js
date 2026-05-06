const fs = require('fs');
const txt = fs.readFileSync('index.html', 'utf8');

// Find all elements with data-framer-name that might be the mouse or scroll
const matches = [...txt.matchAll(/data-framer-name="([^"]*)"/g)];
const names = new Set();
for (const match of matches) {
    const name = match[1].toLowerCase();
    if (name.includes('mouse') || name.includes('scroll') || name.includes('dark') || name.includes('empty')) {
        names.add(match[1]);
    }
}
console.log("Found suspicious names:", Array.from(names));

// Alternatively, let's find the section after the Products Container.
// It should be a large block of HTML.
// Let's just find "Mouse" and print the surrounding HTML.
const idx = txt.indexOf('data-framer-name="Dark"');
if (idx !== -1) {
    console.log("Context around Dark:", txt.substring(idx - 300, idx + 300));
} else {
    console.log("No Dark found exactly.");
}
