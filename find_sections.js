const fs = require('fs');
const txt = fs.readFileSync('index.html', 'utf8');

// The black friday sale and its products might be inside a single parent or multiple.
// Let's use regex to find all data-framer-name attributes and their approximate position
const matches = [...txt.matchAll(/data-framer-name="([^"]*)"/g)];
let results = [];
for (let i = 0; i < matches.length; i++) {
    // We want to find the sequence of components around "Products Container"
    if (matches[i][1] === 'On Sale') {
        const start = i;
        const end = Math.min(matches.length, i + 200);
        const ignored = ['Main', 'Image Container', 'Variant 1', 'Default', 'Icon Inactive', 'Info Container', 'Product + Price', 'Product', 'Prices', 'Discount', 'BG', 'Left', 'Container', 'Arrow Icon', 'Title', 'Heading', 'Button', 'Main  - Tablet &amp; Mobile', 'Products Container', 'Color Select'];
        for(let j = start; j < end; j++) {
            if (!ignored.includes(matches[j][1])) {
                results.push(matches[j][1]);
            }
        }
        break; // just the first occurrence
    }
}
console.log("Components around Products Container:", results);

// The user mentioned "big dark area". Sometimes it's called "Spacer", "Empty", "Gap", or something else.
