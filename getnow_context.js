const fs = require('fs');
const txt = fs.readFileSync('index.html', 'utf8');
const idx = txt.indexOf('Get Now');
console.log(txt.substring(Math.max(0, idx - 400), Math.min(txt.length, idx + 400)));
