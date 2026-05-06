const fs = require('fs');
const path = require('path');

let totalUpdated = 0;
const changes = [];

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (file.startsWith('.') || file === 'node_modules') continue;
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            processFile(fullPath);
        }
    }
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    const fileChanges = [];

    // ===================================================================
    // 1. REMOVE: <meta name="generator" content="Framer 0ea0c8c">
    // ===================================================================
    const generatorBefore = content.length;
    content = content.replace(/<meta\s+name="generator"\s+content="Framer[^"]*"\s*\/?>/g, '');
    if (content.length !== generatorBefore) fileChanges.push('Removed Framer generator meta tag');

    // ===================================================================
    // 2. REMOVE: <meta name="framer-search-index" ...>
    //    These are Framer search index references (not needed locally)
    // ===================================================================
    const searchIdxBefore = content.length;
    content = content.replace(/<meta\s+name="framer-search-index(?:-fallback)?"\s+content="[^"]*"\s*\/?>/g, '');
    if (content.length !== searchIdxBefore) fileChanges.push('Removed Framer search index meta tags');

    // ===================================================================
    // 3. REPLACE: Visible text "Create a free website with Framer..."
    //    This appears in an alt attribute or similar hidden text
    // ===================================================================
    content = content.replace(
        /Create a free website with Framer, the website builder loved by startups, designers and agencies\./g,
        'DripLine Clothing Store - Premium Streetwear & Fashion'
    );

    // ===================================================================
    // 4. REMOVE: Editor bar script (entire <script> block)
    //    <script>try{if(localStorage.get("__framer_force_showing_editorbar_since")){...}}</script>
    // ===================================================================
    const editorBefore = content.length;
    content = content.replace(
        /<script>try\{if\(localStorage\.get\("__framer_force_showing_editorbar_since"\)\)\{[^<]*\}<\/script>/g,
        ''
    );
    if (content.length !== editorBefore) fileChanges.push('Removed Framer editor bar script');

    // ===================================================================
    // 5. REMOVE: Framer Commerce badge/widget injection
    //    The style that hides it was already added, but let's also remove
    //    the actual widget injection script
    // ===================================================================
    const commerceBefore = content.length;
    content = content.replace(
        /<script[^>]*>[^<]*framercommerce\.com[^<]*<\/script>/g,
        ''
    );
    // Also remove the widget container divs
    content = content.replace(
        /<div[^>]*data-framercommerce-widget[^>]*>[^<]*<\/div>/g,
        ''
    );
    if (content.length !== commerceBefore) fileChanges.push('Removed Framer Commerce widget scripts');

    // ===================================================================
    // 6. REMOVE: Badge container
    //    <div id="__framer-badge-container">...</div> already hidden by CSS
    //    but let's clean the injection script too
    // ===================================================================
    // The badge is injected by JS, we already hide it with CSS. 
    // Clean any remaining badge-related inline scripts
    const badgeBefore = content.length;
    content = content.replace(
        /__framer-badge-container/g,
        '__badge-container-disabled'
    );
    if (content.length !== badgeBefore) fileChanges.push('Disabled Framer badge container references');

    // ===================================================================
    // 7. CLEAN: Replace visible "Framer" text in the commerce badge
    //    alt text and aria labels
    // ===================================================================
    content = content.replace(/alt="Framer[^"]*"/g, 'alt="DripLine"');
    content = content.replace(/aria-label="Framer[^"]*"/g, 'aria-label="DripLine"');

    // ===================================================================
    // 8. REMOVE: Framer analytics/tracking snippets
    //    framer_events, published_site_pageview, etc.
    //    These are in the main inline script - we should NOT remove the
    //    entire script as it contains the routing logic. Instead, we'll
    //    neutralize just the analytics call.
    // ===================================================================
    // Replace the Framer site ID with empty
    content = content.replace(
        /of=`d0b34f3fdbe98adb4a5073a09afe9d640e1faf1c50475c5362347db81506a43a`/g,
        'of=``'
    );
    content = content.replace(
        /of="d0b34f3fdbe98adb4a5073a09afe9d640e1faf1c50475c5362347db81506a43a"/g,
        'of=""'
    );

    // ===================================================================
    // 9. CLEAN: og:image meta tags still point to framerusercontent CDN
    //    These are SAFE - they're just image hosting URLs, keep them
    //    (the images still load from CDN which is fine)
    // ===================================================================
    // SKIP - keeping these as they serve actual images

    // ===================================================================
    // 10. CLEAN: Framer error reporting text in JS
    //     "Please report the following to the Framer team via..."
    //     This is safe to remove as it's just an error message string
    // ===================================================================
    content = content.replace(
        /Please report the following to the Framer team via https:\/\/www\.framer\.com\/contact\/:/g,
        'An error occurred:'
    );

    // ===================================================================
    // 11. CLEAN: Framer pageview event name
    //     published_site_pageview -> site_pageview
    // ===================================================================
    content = content.replace(/published_site_pageview/g, 'site_pageview');
    content = content.replace(/published_site_load_recoverable_error/g, 'site_load_recoverable_error');
    content = content.replace(/published_site_load_error/g, 'site_load_error');

    // ===================================================================
    // 12. REMOVE: Framer prerender/SEO comment blocks
    // ===================================================================
    content = content.replace(/<!-- Start of headStart -->/g, '');
    content = content.replace(/<!-- End of headStart -->/g, '');

    // ===================================================================
    // 13. CLEAN: Replace Framer in noscript message if present
    // ===================================================================
    content = content.replace(
        /Enable JavaScript to run this app\./g,
        'Enable JavaScript to run this app.'
    );

    // ===================================================================
    // SAFETY: Do NOT touch these patterns:
    //   - class="framer-*"     (CSS classes)
    //   - data-framer-*        (data attributes used by React hydration)
    //   - .framer-* in CSS     (style rules)
    //   - framerusercontent.com (CDN for assets)
    //   - import from "./framer.*.mjs" (runtime modules)
    //   - framer-text, framer-styles-preset (rendering)
    // ===================================================================

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        totalUpdated++;
        console.log(`Updated: ${filePath}`);
        fileChanges.forEach(c => console.log(`  - ${c}`));
        changes.push({ file: filePath, changes: fileChanges });
    }
}

console.log("============================================");
console.log("   FRAMER CLEANUP - SAFE REMOVAL");
console.log("============================================\n");

processDir('.');

console.log(`\n============================================`);
console.log(`Total files updated: ${totalUpdated}`);
console.log(`============================================`);
