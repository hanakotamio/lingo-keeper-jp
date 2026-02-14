const https = require('https');

function checkURL(url) {
  return new Promise((resolve) => {
    https.head(url, { timeout: 5000 }, (res) => {
      resolve({
        url,
        status: res.statusCode,
        contentType: res.headers['content-type']
      });
    }).on('error', (err) => {
      resolve({
        url,
        status: 'ERROR',
        error: err.message
      });
    });
  });
}

async function main() {
  const scripts = [
    'https://lingo-keeper-jp.vercel.app/assets/index-D1kR4xfA.js',
    'https://lingo-keeper-jp.vercel.app/assets/react-vendor-B6tso_Pi.js',
    'https://lingo-keeper-jp.vercel.app/assets/mui-core-DkRbyJnd.js',
    'https://lingo-keeper-jp.vercel.app/assets/index-ByPEL43v.css'
  ];

  console.log('Checking script and CSS file availability:\n');

  for (const script of scripts) {
    const result = await checkURL(script);
    console.log(`${result.status} - ${script}`);
    if (result.contentType) {
      console.log(`  Content-Type: ${result.contentType}`);
    }
    if (result.error) {
      console.log(`  Error: ${result.error}`);
    }
  }

  // Also check the main page again but look at the response
  console.log('\n\nChecking main page redirect/response:');
  https.get('https://lingo-keeper-jp.vercel.app', { redirect: 'follow' }, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`URL: ${res.url}`);
    console.log(`Headers:`, Object.keys(res.headers).slice(0, 10));
  }).on('error', console.error);
}

main().catch(console.error);
