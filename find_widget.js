const fs = require('fs');
const txt = fs.readFileSync('index.html', 'utf8');

// Find the widget element using its fixed inline styles (bottom right corner)
const widgetIdx = txt.indexOf('bottom: 16px; right: 16px;');
if (widgetIdx !== -1) {
    const divStart = txt.lastIndexOf('<div', widgetIdx);
    const divEnd = txt.indexOf('</div>', widgetIdx) + 6;
    console.log("Found widget HTML:");
    console.log(txt.substring(divStart, divStart + 500));
} else {
    // Try to find the inner SVG or link
    const linkIdx = txt.indexOf('href="https://rapidcode.in/"');
    if (linkIdx !== -1) {
        console.log("Found rapidcode link, might be the widget.");
        console.log(txt.substring(linkIdx - 200, linkIdx + 200));
    }
}
