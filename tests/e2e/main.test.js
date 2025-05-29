const puppeteer = require('puppeteer');
const path = require('path');
const assert = require('assert');

(async () => {
    let browser;
    try {
        console.log('Launching browser...');
        browser = await puppeteer.launch({
            headless: true, // Run in headless mode
            args: [
                '--no-sandbox', // Required for running in some CI environments
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', // Recommended for Docker/CI
                '--disable-accelerated-2d-canvas', // Performance
                '--no-first-run',
                '--no-zygote',
                // '--single-process', // Only if issues with chromium startup
                '--disable-gpu' // Performance
            ]
        });
        const page = await browser.newPage();
        const filePath = `file://${path.join(__dirname, '..', '..', 'index.html')}`;
        console.log(`Navigating to ${filePath}...`);
        await page.goto(filePath, { waitUntil: 'networkidle0' });

        // Test 1: Page Load & Title Verification
        console.log('Running Test 1: Page Load & Title Verification...');
        const pageTitle = await page.title();
        const expectedTitle = 'Small but Mighty: Transforming Democracy Through Citizen Engagement';
        assert.strictEqual(pageTitle, expectedTitle, `Test 1 Failed: Expected title "${expectedTitle}", but got "${pageTitle}"`);
        console.log('Test 1 Passed: Page title is correct.');

        // Test 2: Header Visibility
        console.log('Running Test 2: Header Visibility...');
        const headerSelector = 'header.header';
        const mainTitleSelector = 'h1.main-title';
        
        await page.waitForSelector(headerSelector, { visible: true });
        console.log('Test 2: Main header section is visible.');

        const mainTitleText = await page.$eval(mainTitleSelector, el => el.textContent.trim());
        assert.ok(mainTitleText.length > 0, 'Test 2 Failed: Main title has no text.');
        console.log('Test 2 Passed: Main title is present and contains text.');

        // Test 3: Crisis Section Chart Presence
        console.log('Running Test 3: Crisis Section Chart Presence...');
        const crisisSectionSelector = 'section.crisis-section';
        const trustChartSelector = 'canvas#trustChart';

        await page.evaluate(selector => {
            document.querySelector(selector).scrollIntoView();
        }, crisisSectionSelector);
        
        await page.waitForSelector(trustChartSelector, { visible: true }); // Check if it's at least attempted to be rendered
        const trustChartElement = await page.$(trustChartSelector);
        assert.ok(trustChartElement, 'Test 3 Failed: Trust chart canvas element not found.');
        console.log('Test 3 Passed: Trust chart canvas element is present.');

        // Test 4: Case Studies Tab Interaction
        console.log('Running Test 4: Case Studies Tab Interaction...');
        const caseStudiesSectionSelector = 'section.case-studies';
        const citizensAssembliesTabButtonSelector = 'button[data-tab="citizens-assemblies"]';
        const citizensAssembliesContentSelector = 'div#citizens-assemblies';
        const participatoryBudgetingContentSelector = 'div#participatory-budgeting';

        await page.evaluate(selector => {
            document.querySelector(selector).scrollIntoView();
        }, caseStudiesSectionSelector);
        
        await page.waitForSelector(citizensAssembliesTabButtonSelector);
        await page.click(citizensAssembliesTabButtonSelector);

        // Wait for potential class changes/animations
        await page.waitForTimeout(500); // Give time for JS to apply classes

        const citizensAssembliesContentIsActive = await page.$eval(citizensAssembliesContentSelector, el => el.classList.contains('active'));
        assert.ok(citizensAssembliesContentIsActive, 'Test 4 Failed: Citizens\' Assemblies content did not become active.');
        console.log('Test 4: Citizens\' Assemblies content is active.');

        const participatoryBudgetingContentIsActive = await page.$eval(participatoryBudgetingContentSelector, el => el.classList.contains('active'));
        assert.strictEqual(participatoryBudgetingContentIsActive, false, 'Test 4 Failed: Participatory Budgeting content is still active.');
        console.log('Test 4 Passed: Participatory Budgeting content is no longer active.');

        console.log('All tests passed successfully!');

    } catch (error) {
        console.error('An error occurred during E2E tests:', error);
        process.exitCode = 1; // Indicate failure
    } finally {
        if (browser) {
            console.log('Closing browser...');
            await browser.close();
        }
    }
})();
