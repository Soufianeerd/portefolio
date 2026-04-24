const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
        page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
        
        await page.goto('file:///Users/soufianeelrhadi/Desktop/TantiGusty/MenuQrcode/index.html', { waitUntil: 'load' });
        
        const pizzas = await page.$$('.clickable-pizza');
        console.log(`Found ${pizzas.length} pizzas.`);
        
        if (pizzas.length > 2) {
            console.log('Clicking 4 Fromages...');
            // Wait for JS to run fully
            await new Promise(r => setTimeout(r, 500));
            // Click using evaluate to bypass any interceptors
            await page.evaluate(el => el.click(), pizzas[2]);
            await new Promise(r => setTimeout(r, 500));
            
            const modalStyles = await page.evaluate(() => {
                const modal = document.getElementById('pizza-modal');
                if (!modal) return {error: "No modal found"};
                const img = document.getElementById('pizza-img');
                return {
                    modalClass: modal.className,
                    modalDisplay: window.getComputedStyle(modal).display,
                    imgSrc: img.src,
                    imgRect: img.getBoundingClientRect(),
                };
            });
            console.log('Modal status after click:', JSON.stringify(modalStyles, null, 2));
        }
        await browser.close();
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
})();
