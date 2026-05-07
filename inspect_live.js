const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    console.log("Navigating to live site...");
    await page.goto('https://dripline-website.vercel.app/', { waitUntil: 'networkidle2' });
    
    // Wait for 5 seconds for any framer JS to execute
    await new Promise(r => setTimeout(r, 5000));
    
    // Check if the CSS is present
    const hasKillBadgeCss = await page.evaluate(() => {
        return !!document.getElementById('dripline-kill-badge');
    });
    console.log("Kill badge CSS present:", hasKillBadgeCss);
    
    // Find any anchor tags or divs that look like the framer badge
    const badgeInfo = await page.evaluate(() => {
        // Find links that go to framer
        const framerLinks = Array.from(document.querySelectorAll('a[href*="framer.com"], a[href*="framer"]'));
        
        return framerLinks.map(a => {
            const rect = a.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(a);
            return {
                href: a.href,
                className: a.className,
                id: a.id,
                text: a.innerText,
                visible: rect.width > 0 && rect.height > 0 && computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden',
                display: computedStyle.display,
                visibility: computedStyle.visibility,
                opacity: computedStyle.opacity,
                zIndex: computedStyle.zIndex,
                position: computedStyle.position,
                rect: { width: rect.width, height: rect.height, bottom: rect.bottom, right: rect.right },
                parentClass: a.parentElement ? a.parentElement.className : null,
                parentId: a.parentElement ? a.parentElement.id : null,
            };
        });
    });
    
    console.log("Found Framer links:", JSON.stringify(badgeInfo, null, 2));
    
    await browser.close();
})();
