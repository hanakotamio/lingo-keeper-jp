import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Fix incomplete beginner stories (10-13)
 * Each story should have 5 chapters with proper branching
 */
async function fixBeginnerStories() {
  console.log('Fixing incomplete beginner stories...');

  // Delete incomplete stories 10-13
  const storiesToDelete = ['10', '11', '12', '13'];

  for (const storyId of storiesToDelete) {
    console.log(`\nDeleting incomplete story ${storyId}...`);

    // Delete choices first
    await prisma.choice.deleteMany({
      where: {
        chapter: {
          story_id: storyId,
        },
      },
    });

    // Delete quizzes and quiz choices
    await prisma.quizChoice.deleteMany({
      where: {
        quiz: {
          story_id: storyId,
        },
      },
    });

    await prisma.quiz.deleteMany({
      where: {
        story_id: storyId,
      },
    });

    // Delete chapters
    await prisma.chapter.deleteMany({
      where: {
        story_id: storyId,
      },
    });

    // Delete story
    await prisma.story.delete({
      where: {
        story_id: storyId,
      },
    });

    console.log(`✓ Deleted story ${storyId}`);
  }

  // Create improved Story 10: 朝のあいさつ
  console.log('\n\nCreating improved Story 10: 朝のあいさつ...');

  const story10 = await prisma.story.create({
    data: {
      story_id: '10',
      title: '朝のあいさつ',
      description: '学校での朝のあいさつを学びます。友達や先生との自然な会話を体験しましょう。',
      level_jlpt: 'N5',
      level_cefr: 'A1',
      estimated_time: 5,
      root_chapter_id: 'ch-10-1',
    },
  });

  // Chapter 1
  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-10-1',
      story_id: '10',
      parent_chapter_id: null,
      chapter_number: 1,
      depth_level: 0,
      content: '朝、学校に着きました。友達の田中さんが来ます。',
      content_with_ruby:
        '<ruby>朝<rt>あさ</rt></ruby>、<ruby>学校<rt>がっこう</rt></ruby>に<ruby>着<rt>つ</rt></ruby>きました。<ruby>友達<rt>ともだち</rt></ruby>の<ruby>田中<rt>たなか</rt></ruby>さんが<ruby>来<rt>き</rt></ruby>ます。',
      translation: 'You arrived at school in the morning. Your friend Tanaka is coming.',
      vocabulary: [
        {
          word: '朝',
          reading: 'あさ',
          meanings: { en: 'morning', ko: '아침', zh: '早上' },
          example: '朝ごはんを食べます。',
        },
        {
          word: '学校',
          reading: 'がっこう',
          meanings: { en: 'school', ko: '학교', zh: '学校' },
          example: '学校に行きます。',
        },
        {
          word: '友達',
          reading: 'ともだち',
          meanings: { en: 'friend', ko: '친구', zh: '朋友' },
          example: '友達と遊びます。',
        },
      ],
    },
  });

  // Chapter 1 choices
  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-10-1-a',
        chapter_id: 'ch-10-1',
        choice_text: 'おはようございます！',
        choice_description: '元気にあいさつする',
        next_chapter_id: 'ch-10-2',
        display_order: 1,
      },
      {
        choice_id: 'choice-10-1-b',
        chapter_id: 'ch-10-1',
        choice_text: 'あ、おはよう...',
        choice_description: '少し恥ずかしそうにあいさつする',
        next_chapter_id: 'ch-10-3',
        display_order: 2,
      },
    ],
  });

  // Chapter 2
  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-10-2',
      story_id: '10',
      parent_chapter_id: 'ch-10-1',
      chapter_number: 2,
      depth_level: 1,
      content: '田中：おはよう！今日はいい天気だね。',
      content_with_ruby:
        '<ruby>田中<rt>たなか</rt></ruby>：おはよう！<ruby>今日<rt>きょう</rt></ruby>はいい<ruby>天気<rt>てんき</rt></ruby>だね。',
      translation: 'Tanaka: Good morning! Nice weather today, right?',
      vocabulary: [
        {
          word: '今日',
          reading: 'きょう',
          meanings: { en: 'today', ko: '오늘', zh: '今天' },
          example: '今日は月曜日です。',
        },
        {
          word: '天気',
          reading: 'てんき',
          meanings: { en: 'weather', ko: '날씨', zh: '天气' },
          example: '天気がいいです。',
        },
      ],
    },
  });

  // Chapter 2 choices
  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-10-2-a',
        chapter_id: 'ch-10-2',
        choice_text: 'そうだね！気持ちいいね。',
        choice_description: '天気の話を続ける',
        next_chapter_id: 'ch-10-4',
        display_order: 1,
      },
      {
        choice_id: 'choice-10-2-b',
        chapter_id: 'ch-10-2',
        choice_text: 'うん。今日のテストは大丈夫？',
        choice_description: 'テストの話に変える',
        next_chapter_id: 'ch-10-4',
        display_order: 2,
      },
    ],
  });

  // Chapter 3
  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-10-3',
      story_id: '10',
      parent_chapter_id: 'ch-10-1',
      chapter_number: 3,
      depth_level: 1,
      content: '田中：どうしたの？元気ないね。',
      content_with_ruby:
        '<ruby>田中<rt>たなか</rt></ruby>：どうしたの？<ruby>元気<rt>げんき</rt></ruby>ないね。',
      translation: 'Tanaka: What\'s wrong? You don\'t seem energetic.',
      vocabulary: [
        {
          word: '元気',
          reading: 'げんき',
          meanings: { en: 'energetic, healthy', ko: '건강한', zh: '精神' },
          example: '元気ですか。',
        },
      ],
    },
  });

  // Chapter 3 choices
  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-10-3-a',
        chapter_id: 'ch-10-3',
        choice_text: 'ちょっと眠いだけだよ。',
        choice_description: '正直に答える',
        next_chapter_id: 'ch-10-4',
        display_order: 1,
      },
      {
        choice_id: 'choice-10-3-b',
        chapter_id: 'ch-10-3',
        choice_text: '大丈夫！ありがとう。',
        choice_description: '気を使わせないようにする',
        next_chapter_id: 'ch-10-4',
        display_order: 2,
      },
    ],
  });

  // Chapter 4
  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-10-4',
      story_id: '10',
      parent_chapter_id: null,
      chapter_number: 4,
      depth_level: 2,
      content: '先生が教室に入ってきました。',
      content_with_ruby:
        '<ruby>先生<rt>せんせい</rt></ruby>が<ruby>教室<rt>きょうしつ</rt></ruby>に<ruby>入<rt>はい</rt></ruby>ってきました。',
      translation: 'The teacher entered the classroom.',
      vocabulary: [
        {
          word: '先生',
          reading: 'せんせい',
          meanings: { en: 'teacher', ko: '선생님', zh: '老师' },
          example: '先生に質問します。',
        },
        {
          word: '教室',
          reading: 'きょうしつ',
          meanings: { en: 'classroom', ko: '교실', zh: '教室' },
          example: '教室に入ります。',
        },
      ],
    },
  });

  // Chapter 4 choices
  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-10-4-a',
        chapter_id: 'ch-10-4',
        choice_text: 'おはようございます！',
        choice_description: 'すぐに先生にあいさつする',
        next_chapter_id: 'ch-10-5',
        display_order: 1,
      },
      {
        choice_id: 'choice-10-4-b',
        chapter_id: 'ch-10-4',
        choice_text: '（席に座って待つ）',
        choice_description: '静かに座る',
        next_chapter_id: 'ch-10-5',
        display_order: 2,
      },
    ],
  });

  // Chapter 5 (Final)
  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-10-5',
      story_id: '10',
      parent_chapter_id: 'ch-10-4',
      chapter_number: 5,
      depth_level: 3,
      content:
        '先生：おはようございます。みなさん、今日も元気に頑張りましょう！\n\nあなたは朝のあいさつを学びました。',
      content_with_ruby:
        '<ruby>先生<rt>せんせい</rt></ruby>：おはようございます。みなさん、<ruby>今日<rt>きょう</rt></ruby>も<ruby>元気<rt>げんき</rt></ruby>に<ruby>頑張<rt>がんば</rt></ruby>りましょう！\n\nあなたは<ruby>朝<rt>あさ</rt></ruby>のあいさつを<ruby>学<rt>まな</rt></ruby>びました。',
      translation:
        'Teacher: Good morning, everyone. Let\'s do our best today!\n\nYou learned morning greetings.',
      vocabulary: [
        {
          word: '頑張る',
          reading: 'がんばる',
          meanings: { en: 'do one\'s best', ko: '열심히 하다', zh: '加油' },
          example: '明日も頑張ります。',
        },
      ],
    },
  });

  console.log('✓ Created improved Story 10');
  console.log('\n✅ All stories fixed!');
}

// Execute
fixBeginnerStories()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
