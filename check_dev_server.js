const http = require('http');

function fetchWithConsole(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { timeout: 5000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function main() {
  try {
    console.log('Fetching from dev server http://localhost:3847/\n');
    const html = await fetchWithConsole('http://localhost:3847/');

    // Check root div
    const rootMatch = html.match(/<div id="root">([\s\S]*?)<\/div>/);
    const rootContent = rootMatch ? rootMatch[1].trim() : '';

    console.log('=== DEV SERVER TEST ===');
    console.log(`Root content length: ${rootContent.length} bytes`);

    if (rootContent.length > 100) {
      console.log('✓ App rendered with content');
      console.log('\nPreview:');
      console.log(rootContent.substring(0, 500));
    } else {
      console.log('✗ Root is EMPTY');
    }

    // Check for script errors
    console.log('\n=== ERROR DETECTION ===');
    if (html.includes('ReferenceError') || html.includes('TypeError')) {
      console.log('Found error indicators in HTML');
    }

    // Look for inline scripts with errors
    const scriptMatches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
    console.log(`Found ${scriptMatches.length} script tags`);

    // Check for style tags
    const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
    console.log(`Found ${styleMatches.length} style tags`);

    // Check for specific React error boundaries
    if (html.includes('Error') && html.includes('boundary')) {
      console.log('Possible React error boundary triggered');
    }

    console.log('\nTotal HTML size:', html.length, 'bytes');

  } catch (error) {
    console.error('Error connecting to dev server:', error.message);
    process.exit(1);
  }

  process.exit(0);
}

setTimeout(() => {
  main().catch(err => {
    console.error(err);
    process.exit(1);
  });
}, 2000);
