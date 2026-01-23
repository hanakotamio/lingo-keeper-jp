import fetch from 'node-fetch';

const BASE_URL = 'https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app';

async function testAllAPIs() {
  console.log('Testing all API endpoints...\n');

  try {
    // 1. Health check
    console.log('1. Testing /api/health...');
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const health = await healthRes.json();
    console.log(`   Status: ${health.status} | Database: ${health.database}`);

    // 2. Get all stories
    console.log('\n2. Testing /api/stories...');
    const storiesRes = await fetch(`${BASE_URL}/api/stories`);
    const stories = await storiesRes.json();
    console.log(`   Success: ${stories.success} | Count: ${stories.data.length} stories`);
    console.log(`   First story: ${stories.data[0].title}`);

    // 3. Get specific story
    console.log('\n3. Testing /api/stories/10...');
    const story10Res = await fetch(`${BASE_URL}/api/stories/10`);
    const story10 = await story10Res.json();
    console.log(`   Success: ${story10.success} | Title: ${story10.data.title}`);

    // 4. Get quizzes
    console.log('\n4. Testing /api/quizzes?story_id=10...');
    const quizzesRes = await fetch(`${BASE_URL}/api/quizzes?story_id=10`);
    const quizzes = await quizzesRes.json();
    console.log(`   Success: ${quizzes.success}`);
    console.log(`   Question: ${quizzes.data.question_text}`);
    console.log(`   Choices: ${quizzes.data.choices.length}`);

    // 5. Test TTS
    console.log('\n5. Testing /api/tts/synthesize...');
    const ttsRes = await fetch(`${BASE_URL}/api/tts/synthesize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'おはようございます',
        speakingRate: 1.0,
      }),
    });
    const tts = await ttsRes.json();
    console.log(`   Success: ${tts.success}`);
    console.log(`   Audio URL length: ${tts.data.audioUrl.length} chars`);

    console.log('\n✅ All API tests passed!');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

testAllAPIs();
