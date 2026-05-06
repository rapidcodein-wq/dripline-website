const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Simple regex to find the anchor tag containing "Built by Rapidcode" 
            // and replace its href with https://rapidcode.in/
            // The HTML looks like <a ... href="https://x.com/Tahoor_Ali" ...>... Built by Rapidcode ... </a>
            
            // Wait, an easier way is to update the script we injected earlier.
            // Let's replace the old script with the new one.
            const oldScript = `
      if(el.textContent.trim() === 'Get Now') {
        const a = el.closest('a');
        if(a) {
          a.style.display = 'none';
          a.style.opacity = '0';
          a.style.pointerEvents = 'none';
          a.style.visibility = 'hidden';
        }
      }
    });
  };`;

            const newScript = `
      if(el.textContent.trim() === 'Get Now') {
        const a = el.closest('a');
        if(a) {
          a.style.display = 'none';
          a.style.opacity = '0';
          a.style.pointerEvents = 'none';
          a.style.visibility = 'hidden';
        }
      }
      if(el.textContent.trim() === 'Built by Rapidcode') {
        const a = el.closest('a');
        if(a) {
          a.href = 'https://rapidcode.in/';
          a.target = '_blank';
        }
      }
    });
  };`;

            if (content.includes(oldScript) && !content.includes('https://rapidcode.in/')) {
                content = content.replace(oldScript, newScript);
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content);
                console.log('Updated ' + fullPath);
            }
        }
    }
}

processDir('.');
