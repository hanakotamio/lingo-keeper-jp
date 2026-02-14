const https = require('https');

function fetchWithDetails(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function checkProduction() {
  console.log('Fetching https://lingo-keeper-jp.vercel.app...\n');

  try {
    const response = await fetchWithDetails('https://lingo-keeper-jp.vercel.app');

    console.log('=== RESPONSE STATUS ===');
    console.log(`Status: ${response.status}`);
    console.log(`Content-Type: ${response.headers['content-type']}`);

    console.log('\n=== HTML CONTENT ANALYSIS ===');
    const body = response.body;

    // Check for error messages in HTML
    console.log(`Page size: ${body.length} bytes`);

    // Look for common error patterns
    if (body.includes('error')) {
      console.log('Found "error" text in page');
    }

    if (body.includes('404')) {
      console.log('Found "404" in page - Not Found error');
    }

    if (body.includes('VITE_API_URL')) {
      console.log('Found "VITE_API_URL" reference in page');
    }

    // Check for React root
    if (body.includes('<div id="root">')) {
      const rootMatch = body.match(/<div id="root">(.*?)<\/div>/s);
      if (rootMatch) {
        const rootContent = rootMatch[1].trim();
        if (rootContent.length === 0) {
          console.log('React root exists but is EMPTY');
        } else {
          console.log(`React root has content (${rootContent.length} bytes)`);
        }
      }
    }

    // Look for specific error messages
    const errorPatterns = [
      /Failed to fetch/gi,
      /Network error/gi,
      /API error/gi,
      /TypeError/gi,
      /ReferenceError/gi,
      /SyntaxError/gi
    ];

    console.log('\n=== ERROR PATTERNS ===');
    let foundErrors = false;
    errorPatterns.forEach(pattern => {
      if (pattern.test(body)) {
        console.log(`Found pattern: ${pattern}`);
        foundErrors = true;
      }
    });

    if (!foundErrors) {
      console.log('No obvious error patterns found');
    }

    // Check for fetch/XHR related content
    console.log('\n=== API/FETCH ANALYSIS ===');
    if (body.includes('api/stories')) {
      console.log('Found "api/stories" reference');
    }

    if (body.includes('lingo-keeper-jp-backend')) {
      console.log('Found backend URL reference');
    }

    // Look for script tags and inline errors
    const scriptMatches = body.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    console.log(`Found ${scriptMatches ? scriptMatches.length : 0} script tags`);

    // Check Vercel deployment info
    console.log('\n=== VERCEL DEPLOYMENT ===');
    if (body.includes('__NEXT_DATA__')) {
      console.log('This appears to be a Next.js site');
    }

    if (body.includes('vercel')) {
      console.log('Contains Vercel references');
    }

    // Extract meta tags
    const metaTags = body.match(/<meta[^>]*>/gi) || [];
    console.log(`Found ${metaTags.length} meta tags`);

    // Check for viewport and basic tags
    if (body.includes('charset')) {
      console.log('Has charset meta tag');
    }

    if (body.includes('viewport')) {
      console.log('Has viewport meta tag');
    }

  } catch (error) {
    console.error('Error fetching page:', error.message);
  }

  // Try to fetch the API directly
  console.log('\n=== TESTING API ENDPOINTS ===');

  const apiUrls = [
    'https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app/api/health',
    'https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app/api/stories'
  ];

  for (const apiUrl of apiUrls) {
    try {
      console.log(`\nFetching ${apiUrl}...`);
      const apiResponse = await fetchWithDetails(apiUrl);
      console.log(`Status: ${apiResponse.status}`);
      if (apiResponse.status === 200) {
        try {
          const json = JSON.parse(apiResponse.body);
          console.log('Response:', JSON.stringify(json, null, 2).substring(0, 500));
        } catch (e) {
          console.log('Response body:', apiResponse.body.substring(0, 200));
        }
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }
}

checkProduction().catch(console.error);
