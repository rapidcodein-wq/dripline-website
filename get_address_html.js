const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const pos = content.indexOf('Fictionland');
if (pos !== -1) {
    console.log(content.substring(pos - 100, pos + 100));
}
