const fs = require('fs');
const path = require('path');

const scriptToInject = `
<style>html { scroll-behavior: smooth !important; }</style>
<script>
  const hideGetNow = () => {
    document.querySelectorAll('.framer-text').forEach(el => {
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
        }
      }
    });
  };
  
  document.addEventListener('DOMContentLoaded', hideGetNow);
  const observer = new MutationObserver(() => {
    hideGetNow();
  });
  // Wait a bit for body to exist if it doesn't
  if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
  } else {
      document.addEventListener('DOMContentLoaded', () => {
          observer.observe(document.body, { childList: true, subtree: true });
      });
  }
</script>
`;

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Replace text
            if (content.includes('Built in Framer by Syed')) {
                content = content.replace(/Built in Framer by Syed/g, 'Built by Rapidcode');
                modified = true;
            }

            // Add smooth scroll and Get Now hider if not already added
            if (!content.includes('hideGetNow')) {
                if (content.includes('</body>')) {
                    content = content.replace('</body>', scriptToInject + '</body>');
                } else {
                    content += scriptToInject;
                }
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
