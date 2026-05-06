const fs = require('fs');
const path = require('path');

let totalUpdated = 0;

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            // Skip node_modules or hidden dirs
            if (file.startsWith('.') || file === 'node_modules') continue;
            processDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            processFile(fullPath);
        }
    }
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // ===== 1. BRAND NAME: Rawline -> DripLine =====
    // Replace visible text "RAWLINE" (uppercase, used in headers/logos)
    content = content.replace(/\bRAWLINE\b/g, 'DRIPLINE');
    // Replace visible text "Rawline" (mixed case)
    content = content.replace(/\bRawline\b/g, 'DripLine');
    // Replace visible text "rawline" (lowercase)
    content = content.replace(/\brawline\b/g, 'dripline');
    
    // Replace "RAW CLOTHING STORE" in footer copyright
    content = content.replace(/RAW CLOTHING STORE/g, 'DRIPLINE CLOTHING STORE');
    content = content.replace(/Raw Clothing Store/g, 'DripLine Clothing Store');
    
    // Replace in page <title>
    content = content.replace(/<title>RAWLINE<\/title>/g, '<title>DRIPLINE</title>');

    // ===== 2. SOCIAL MEDIA LINKS -> rapidcode.in =====
    // Replace Facebook links
    content = content.replace(/href="https?:\/\/(?:www\.)?facebook\.com[^"]*"/g, 'href="https://rapidcode.in/"');
    // Replace Instagram links
    content = content.replace(/href="https?:\/\/(?:www\.)?instagram\.com[^"]*"/g, 'href="https://rapidcode.in/"');
    // Replace X/Twitter links (but NOT x.com in framer internal JS paths)
    content = content.replace(/href="https?:\/\/x\.com\/[^"]*"/g, 'href="https://rapidcode.in/"');
    content = content.replace(/href="https?:\/\/(?:www\.)?twitter\.com[^"]*"/g, 'href="https://rapidcode.in/"');

    // ===== 3. REMOVE FRAMER LINKS =====
    // Replace framer.com links (but be careful not to break internal JS imports)
    // Only replace href attributes pointing to framer.com
    content = content.replace(/href="https?:\/\/(?:www\.)?framer\.com[^"]*"/g, 'href="https://rapidcode.in/"');
    content = content.replace(/href="https?:\/\/(?:www\.)?framercommerce\.com[^"]*"/g, 'href="https://rapidcode.in/"');

    // ===== 4. INJECT ANIMATIONS & TEXT EFFECTS =====
    const animMarker = '/* dripline-animations-v1 */';
    if (!content.includes(animMarker)) {
        const animationStyles = `
<style>${animMarker}
/* Smooth fade-in on scroll */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-40px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

/* Text glow effect for headings */
@keyframes textGlow {
  0%, 100% { text-shadow: 0 0 5px rgba(234, 48, 31, 0.3), 0 0 10px rgba(234, 48, 31, 0.1); }
  50% { text-shadow: 0 0 15px rgba(234, 48, 31, 0.5), 0 0 30px rgba(234, 48, 31, 0.2); }
}

/* Apply animations to elements when they become visible */
.dripline-animate {
  animation: fadeInUp 0.8s ease-out forwards;
}

/* Hover effects for product cards */
[data-framer-name="Main"] {
  transition: transform 0.3s ease, box-shadow 0.3s ease !important;
}
[data-framer-name="Main"]:hover {
  transform: translateY(-5px) !important;
  box-shadow: 0 15px 40px rgba(0,0,0,0.4) !important;
}

/* Hover effect for category images */
[data-framer-name="Mobile"] {
  transition: transform 0.5s ease !important;
  overflow: hidden !important;
}
[data-framer-name="Mobile"]:hover {
  transform: scale(1.03) !important;
}

/* Button hover glow */
a[data-framer-name*="Button"],
a[data-framer-name*="Tablet"] {
  transition: all 0.3s ease !important;
}
a[data-framer-name*="Button"]:hover,
a[data-framer-name*="Tablet"]:hover {
  filter: brightness(1.15) !important;
  box-shadow: 0 0 20px rgba(234, 48, 31, 0.3) !important;
}

/* Smooth link transitions */
a {
  transition: opacity 0.2s ease, color 0.2s ease !important;
}

/* Section headings glow on hover */
h2.framer-text:hover, h3.framer-text:hover, h4.framer-text:hover {
  animation: textGlow 2s ease-in-out infinite !important;
}

/* Image hover zoom */
[data-framer-name="Image Container"] img {
  transition: transform 0.5s ease !important;
}
[data-framer-name="Image Container"]:hover img {
  transform: scale(1.05) !important;
}

/* Wishlist heart animation */
[data-framer-name*="Icon"] {
  transition: transform 0.2s ease !important;
}
[data-framer-name*="Icon"]:hover {
  transform: scale(1.2) !important;
}
</style>

<script>
// Intersection Observer for scroll-triggered animations
(function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  function initAnimations() {
    // Animate sections on scroll
    const sections = document.querySelectorAll('section');
    sections.forEach((section, i) => {
      if (section.style.display === 'none') return;
      section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
      section.style.transitionDelay = (i * 0.05) + 's';
      observer.observe(section);
    });

    // Animate product cards with stagger
    const cards = document.querySelectorAll('[data-framer-name="Main"][data-highlight="true"]');
    cards.forEach((card, i) => {
      card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      card.style.transitionDelay = (i % 4 * 0.1) + 's';
      observer.observe(card);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }
})();
</script>`;

        if (content.includes('</body>')) {
            content = content.replace('</body>', animationStyles + '</body>');
        }
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        totalUpdated++;
        console.log('Updated: ' + filePath);
    }
}

processDir('.');
console.log(`\nTotal files updated: ${totalUpdated}`);
