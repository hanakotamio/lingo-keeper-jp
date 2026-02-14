const http = require('http');
const vm = require('vm');

// Fetch the dev server HTML
function fetchHTML() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3847/', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Fetch a script from dev server
function fetchScript(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3847${path}`, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Script ${path} returned ${res.statusCode}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  try {
    console.log('Simulating browser rendering...\n');

    const html = await fetchHTML();
    console.log('1. HTML fetched');

    // Extract script paths from HTML
    const scriptMatches = html.match(/src="([^"]*\.js)"/g) || [];
    console.log(`2. Found ${scriptMatches.length} scripts in HTML`);

    if (scriptMatches.length === 0) {
      console.log('No scripts to load!');
      process.exit(1);
    }

    // Show the scripts
    scriptMatches.forEach((match, i) => {
      const src = match.replace(/src="/, '').replace(/"/, '');
      console.log(`   ${i + 1}. ${src}`);
    });

    // Try to fetch the main bundle
    console.log('\n3. Testing main bundle fetch...');
    try {
      const mainScript = await fetchScript('/src/main.tsx');
      console.log(`   ✓ Main script loaded (${mainScript.length} bytes)`);

      // Look for potential errors
      if (mainScript.includes('throw') || mainScript.includes('Error')) {
        console.log('   ⚠ Script contains error handling code');
      }
    } catch (err) {
      console.log(`   ✗ Failed: ${err.message}`);
    }

    // Check app initialization
    console.log('\n4. Checking for App component...');
    try {
      const appScript = await fetchScript('/src/App.tsx');
      console.log(`   ✓ App component loaded (${appScript.length} bytes)`);
    } catch (err) {
      console.log(`   ✗ Failed: ${err.message}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }

  process.exit(0);
}

setTimeout(() => {
  main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}, 1000);
