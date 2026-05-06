const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mjs': 'text/javascript',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

const CDN_BASE = 'https://framerusercontent.com/sites/5DkOFTpzztDZPstI94IHjB/';

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  
  // If the request is for a .mjs file, proxy from the Framer CDN
  if (urlPath.endsWith('.mjs')) {
    // Extract just the filename (remove any directory prefix like /categories/)
    const mjsFilename = path.basename(urlPath);
    const cdnUrl = CDN_BASE + mjsFilename;
    
    console.log(`[PROXY] ${urlPath} -> ${cdnUrl}`);
    
    https.get(cdnUrl, (cdnRes) => {
      if (cdnRes.statusCode === 200) {
        res.writeHead(200, {
          'Content-Type': 'text/javascript',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=31536000'
        });
        cdnRes.pipe(res);
      } else {
        // If not found on CDN, try serving locally
        serveLocal(req, res, urlPath);
      }
    }).on('error', (err) => {
      console.error(`[PROXY ERROR] ${err.message}`);
      serveLocal(req, res, urlPath);
    });
    return;
  }

  serveLocal(req, res, urlPath);
});

function serveLocal(req, res, urlPath) {
  let filePath = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);
  
  if (!fs.existsSync(filePath)) {
    // try adding .html
    if (fs.existsSync(filePath + '.html')) {
        filePath += '.html';
    } else {
        res.writeHead(404);
        res.end('Not found');
        return;
    }
  }

  // If it's a directory, serve index.html from it
  if (fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if(err.code == 'ENOENT'){
        res.writeHead(404);
        res.end('Not found');
      } else {
        res.writeHead(500);
        res.end('Server Error: '+err.code);
      }
    } else {
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content, 'utf-8');
    }
  });
}

server.listen(3000, '127.0.0.1', () => {
  console.log('Server running at http://localhost:3000/');
  console.log('MJS files will be proxied from Framer CDN');
});
