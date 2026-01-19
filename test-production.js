#!/usr/bin/env node

/**
 * Production Environment Smoke Test
 * Tests the deployed frontend and backend
 */

const FRONTEND_URL = 'https://frontend-8ae59c53w-mio-furumakis-projects.vercel.app';
const BACKEND_URL = 'https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app';

async function testEndpoint(url, description) {
  try {
    const response = await fetch(url);
    const status = response.status;
    const ok = response.ok;

    if (ok) {
      console.log(`✅ ${description}`);
      console.log(`   URL: ${url}`);
      console.log(`   Status: ${status}`);
      return true;
    } else {
      console.log(`❌ ${description}`);
      console.log(`   URL: ${url}`);
      console.log(`   Status: ${status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description}`);
    console.log(`   URL: ${url}`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function testJSON(url, description) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.success) {
      console.log(`✅ ${description}`);
      console.log(`   URL: ${url}`);
      console.log(`   Data count: ${data.count || data.data?.length || 'N/A'}`);
      return true;
    } else {
      console.log(`❌ ${description}`);
      console.log(`   URL: ${url}`);
      console.log(`   Response:`, JSON.stringify(data).substring(0, 100));
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description}`);
    console.log(`   URL: ${url}`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Lingo Keeper JP - Production Smoke Test\n');
  console.log('='.repeat(60));

  const results = [];

  // Frontend tests
  console.log('\n📱 Frontend Tests:');
  console.log('-'.repeat(60));
  results.push(await testEndpoint(FRONTEND_URL, 'Frontend Homepage'));
  results.push(await testEndpoint(`${FRONTEND_URL}/story`, 'Story Page'));
  results.push(await testEndpoint(`${FRONTEND_URL}/quiz`, 'Quiz Page'));

  // Backend API tests
  console.log('\n🔧 Backend API Tests:');
  console.log('-'.repeat(60));
  results.push(await testJSON(`${BACKEND_URL}/api/health`, 'Health Check'));
  results.push(await testJSON(`${BACKEND_URL}/api/stories`, 'Stories API'));
  results.push(await testJSON(`${BACKEND_URL}/api/stories/1/chapters`, 'Chapters API'));
  results.push(await testJSON(`${BACKEND_URL}/api/quizzes`, 'Quizzes API'));

  // Summary
  console.log('\n' + '='.repeat(60));
  const passed = results.filter(r => r).length;
  const total = results.length;
  const percentage = ((passed / total) * 100).toFixed(1);

  console.log(`\n📊 Test Results: ${passed}/${total} passed (${percentage}%)\n`);

  if (passed === total) {
    console.log('🎉 All tests passed! Production environment is healthy.\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Please check the logs above.\n');
    process.exit(1);
  }
}

runTests();
