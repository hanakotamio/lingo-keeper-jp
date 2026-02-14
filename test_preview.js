const http = require('http');

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  try {
    console.log('Connecting to preview server...\n');
    const html = await fetchHTML('http://localhost:4173/');

    // Check if root is rendered
    const rootStart = html.indexOf('<div id="root">');
    const rootEnd = html.indexOf('</div>', rootStart);
    const rootContent = html.substring(rootStart + 15, rootEnd).trim();

    console.log('=== LOCAL PREVIEW TEST ===');
    console.log(`Root content length: ${rootContent.length}`);

    if (rootContent.length > 100) {
      console.log('✓ React app has rendered successfully');
      console.log('Content preview:', rootContent.substring(0, 200));
    } else if (rootContent.length > 0) {
      console.log('⚠ React app has minimal content');
      console.log('Content:', rootContent);
    } else {
      console.log('✗ Root is EMPTY - app not rendering');
    }

    // Check assets
    if (html.includes('index-D1kR4xfA.js')) {
      console.log('✓ Main bundle script tag found');
    }

    console.log('\nHTML size:', html.length, 'bytes');
  } catch (error) {
    console.error('Error:', error.message);
  }

  process.exit(0);
}

setTimeout(() => {
  main().catch(console.error);
}, 2000);
