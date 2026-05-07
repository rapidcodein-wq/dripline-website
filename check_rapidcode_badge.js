const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const regex = /<a href="https:\/\/rapidcode\.in\/"[^>]*>.*?<\/a>/gs;
const matches = html.match(regex);

if (matches) {
    console.log(`Found ${matches.length} matches`);
    console.log(matches[0].substring(0, 500));
} else {
    console.log('No matches found for rapidcode link');
}
