const https = require('https');
const http = require('http');

function checkURL(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;

    const req = protocol.request(url, { method: 'HEAD', timeout: 5000 }, (res) => {
      resolve({
        url,
        status: res.statusCode,
        contentType: res.headers['content-type'],
        contentLength: res.headers['content-length']
      });
    });

    req.on('error', (err) => {
      resolve({
        url,
        status: 'ERROR',
        error: err.message
      });
    });

    req.end();
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
    const name = script.split('/').pop();
    if (result.error) {
      console.log(`✗ ${name}`);
      console.log(`  Error: ${result.error}`);
    } else {
      const status = result.status === 200 ? '✓' : '✗';
      console.log(`${status} ${name}`);
      console.log(`  Status: ${result.status}`);
      if (result.contentType) {
        console.log(`  Content-Type: ${result.contentType}`);
      }
      if (result.contentLength) {
        console.log(`  Size: ${result.contentLength} bytes`);
      }
    }
  }
}

main().catch(console.error);
