const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Set viewport to a common desktop size
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log("Navigating to live site...");
    await page.goto('https://dripline-website.vercel.app/', { waitUntil: 'networkidle2' });
    
    // Wait for 8 seconds
    await new Promise(r => setTimeout(r, 8000));
    
    // Take a screenshot of the whole page (or bottom)
    await page.screenshot({ path: 'live_screenshot.png', fullPage: true });
    
    const floatingElements = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const results = [];
        
        for (let el of elements) {
            const style = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            
            // Look for elements that are fixed or absolute and visible
            if ((style.position === 'fixed' || style.position === 'absolute') && 
                style.display !== 'none' && style.visibility !== 'hidden' &&
                rect.width > 0 && rect.height > 0) {
                
                // If it's near the bottom right of the viewport
                if (rect.bottom > window.innerHeight - 100 && rect.right > window.innerWidth - 100) {
                    results.push({
                        tagName: el.tagName,
                        id: el.id,
                        className: el.className,
                        text: el.innerText ? el.innerText.substring(0, 50).replace(/\n/g, ' ') : '',
                        zIndex: style.zIndex,
                        rect: { width: rect.width, height: rect.height, bottom: rect.bottom, right: rect.right, top: rect.top, left: rect.left },
                        innerHTML: el.innerHTML.substring(0, 100)
                    });
                }
            }
        }
        return results;
    });
    
    console.log("Found floating elements near bottom-right:");
    console.log(JSON.stringify(floatingElements, null, 2));
    
    await browser.close();
})();
