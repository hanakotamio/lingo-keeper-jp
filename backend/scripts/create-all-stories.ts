import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createStory10() {
  console.log('Creating Story 10: 朝のあいさつ with chapters...');

  // Create story
  await prisma.story.create({
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

  // Create chapters
  // Chapter 1
  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-10-1',
      story_id: '10',
      chapter_number: 1,
      depth_level: 0,
      content: '朝、学校に着きました。友達の田中さんが来ます。',
      content_with_ruby:
        '<ruby>朝<rt>あさ</rt></ruby>、<ruby>学校<rt>がっこう</rt></ruby>に<ruby>着<rt>つ</rt></ruby>きました。<ruby>友達<rt>ともだち</rt></ruby>の<ruby>田中<rt>たなか</rt></ruby>さんが<ruby>来<rt>き</rt></ruby>ます。',
      translation: 'You arrived at school in the morning. Your friend Tanaka is coming.',
      vocabulary: {
        create: [
          {
            word: '朝',
            reading: 'あさ',
            meanings: { en: 'morning' },
            example: '朝ごはんを食べます。',
          },
          {
            word: '学校',
            reading: 'がっこう',
            meanings: { en: 'school' },
            example: '学校に行きます。',
          },
          {
            word: '友達',
            reading: 'ともだち',
            meanings: { en: 'friend' },
            example: '友達と遊びます。',
          },
        ],
      },
    },
  });

  // Choices for ch-10-1
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
      vocabulary: {
        create: [
          {
            word: '今日',
            reading: 'きょう',
            meanings: { en: 'today' },
            example: '今日は月曜日です。',
          },
          {
            word: '天気',
            reading: 'てんき',
            meanings: { en: 'weather' },
            example: '天気がいいです。',
          },
        ],
      },
    },
  });

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
      translation: "Tanaka: What's wrong? You don't seem energetic.",
      vocabulary: {
        create: [
          {
            word: '元気',
            reading: 'げんき',
            meanings: { en: 'energetic, healthy' },
            example: '元気ですか。',
          },
        ],
      },
    },
  });

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
      chapter_number: 4,
      depth_level: 2,
      content: '先生が教室に入ってきました。',
      content_with_ruby:
        '<ruby>先生<rt>せんせい</rt></ruby>が<ruby>教室<rt>きょうしつ</rt></ruby>に<ruby>入<rt>はい</rt></ruby>ってきました。',
      translation: 'The teacher entered the classroom.',
      vocabulary: {
        create: [
          {
            word: '先生',
            reading: 'せんせい',
            meanings: { en: 'teacher' },
            example: '先生に質問します。',
          },
          {
            word: '教室',
            reading: 'きょうしつ',
            meanings: { en: 'classroom' },
            example: '教室に入ります。',
          },
        ],
      },
    },
  });

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

  // Chapter 5
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
        "Teacher: Good morning, everyone. Let's do our best today!\n\nYou learned morning greetings.",
      vocabulary: {
        create: [
          {
            word: '頑張る',
            reading: 'がんばる',
            meanings: { en: "do one's best" },
            example: '明日も頑張ります。',
          },
        ],
      },
    },
  });

  console.log('✓ Created Story 10 with 5 chapters');
}

async function createAllStories() {
  console.log('Creating all stories...');

  try {
    await createStory10();

    console.log('\n✅ All stories created!');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

createAllStories()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
