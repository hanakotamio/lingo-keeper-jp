import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Adding beginner (N5/A1) stories to production database...');

  // Delete existing stories 10-13 if they exist (for re-running script)
  await prisma.chapter.deleteMany({ where: { story_id: { in: ['10', '11', '12', '13'] } } });
  await prisma.story.deleteMany({ where: { story_id: { in: ['10', '11', '12', '13'] } } });
  console.log('Cleared any existing stories 10-13');

  // ============================================================
  // Story 10: 朝のあいさつ (N5/A1) - Morning Greetings
  // ============================================================
  const story10 = await prisma.story.create({
    data: {
      story_id: '10',
      title: '朝のあいさつ',
      description: '学校での朝のあいさつ。簡単な日本語で話してみましょう。',
      level_jlpt: 'N5',
      level_cefr: 'A1',
      estimated_time: 3,
      root_chapter_id: 'ch-10-1',
    },
  });

  const chapter10_1 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-10-1',
      story_id: story10.story_id,
      chapter_number: 1,
      depth_level: 0,
      content: 'おはようございます。今日はいい天気ですね。',
      content_with_ruby:
        'おはようございます。<ruby>今日<rt>きょう</rt></ruby>はいい<ruby>天気<rt>てんき</rt></ruby>ですね。',
      translation: 'Good morning. Nice weather today, isn\'t it?',
      vocabulary: {
        create: [
          {
            word: 'おはよう',
            reading: 'おはよう',
            meanings: { en: 'good morning', zh: '早上好', ko: '좋은 아침' },
            example: 'おはようございます。',
          },
          {
            word: '今日',
            reading: 'きょう',
            meanings: { en: 'today', zh: '今天', ko: '오늘' },
            example: '今日は月曜日です。',
          },
          {
            word: '天気',
            reading: 'てんき',
            meanings: { en: 'weather', zh: '天气', ko: '날씨' },
            example: '今日はいい天気です。',
          },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-10-1-a',
        chapter_id: chapter10_1.chapter_id,
        choice_text: 'はい、いい天気ですね。',
        choice_description: '同意する',
        next_chapter_id: 'ch-10-2',
        display_order: 1,
      },
      {
        choice_id: 'choice-10-1-b',
        chapter_id: chapter10_1.chapter_id,
        choice_text: 'おはようございます。',
        choice_description: 'あいさつを返す',
        next_chapter_id: 'ch-10-3',
        display_order: 2,
      },
    ],
  });

  const chapter10_2 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-10-2',
      story_id: story10.story_id,
      parent_chapter_id: chapter10_1.chapter_id,
      chapter_number: 2,
      depth_level: 1,
      content: 'そうですね。今日は暑いですね。',
      content_with_ruby:
        'そうですね。<ruby>今日<rt>きょう</rt></ruby>は<ruby>暑<rt>あつ</rt></ruby>いですね。',
      translation: 'That\'s right. It\'s hot today.',
      vocabulary: {
        create: [
          {
            word: '暑い',
            reading: 'あつい',
            meanings: { en: 'hot', zh: '热', ko: '덥다' },
            example: '夏は暑いです。',
          },
        ],
      },
    },
  });

  const chapter10_3 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-10-3',
      story_id: story10.story_id,
      parent_chapter_id: chapter10_1.chapter_id,
      chapter_number: 3,
      depth_level: 1,
      content: 'はい、おはようございます。元気ですか。',
      content_with_ruby:
        'はい、おはようございます。<ruby>元気<rt>げんき</rt></ruby>ですか。',
      translation: 'Yes, good morning. How are you?',
      vocabulary: {
        create: [
          {
            word: '元気',
            reading: 'げんき',
            meanings: { en: 'fine, healthy', zh: '健康', ko: '건강하다' },
            example: '私は元気です。',
          },
        ],
      },
    },
  });

  console.log('✅ Story 10 created: 朝のあいさつ');

  // ============================================================
  // Story 11: スーパーで買い物 (N5/A1) - Shopping at Supermarket
  // ============================================================
  const story11 = await prisma.story.create({
    data: {
      story_id: '11',
      title: 'スーパーで買い物',
      description: 'スーパーマーケットで食べ物を買います。数字と食べ物の名前を覚えましょう。',
      level_jlpt: 'N5',
      level_cefr: 'A1',
      estimated_time: 4,
      root_chapter_id: 'ch-11-1',
    },
  });

  const chapter11_1 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-11-1',
      story_id: story11.story_id,
      chapter_number: 1,
      depth_level: 0,
      content: 'スーパーに来ました。何を買いますか。',
      content_with_ruby:
        'スーパーに<ruby>来<rt>き</rt></ruby>ました。<ruby>何<rt>なに</rt></ruby>を<ruby>買<rt>か</rt></ruby>いますか。',
      translation: 'I came to the supermarket. What will you buy?',
      vocabulary: {
        create: [
          {
            word: 'スーパー',
            reading: 'すーぱー',
            meanings: { en: 'supermarket', zh: '超市', ko: '슈퍼마켓' },
            example: 'スーパーで買い物をします。',
          },
          {
            word: '買う',
            reading: 'かう',
            meanings: { en: 'to buy', zh: '买', ko: '사다' },
            example: 'りんごを買います。',
          },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-11-1-a',
        chapter_id: chapter11_1.chapter_id,
        choice_text: 'りんごを買います。',
        choice_description: '果物を買う',
        next_chapter_id: 'ch-11-2',
        display_order: 1,
      },
      {
        choice_id: 'choice-11-1-b',
        chapter_id: chapter11_1.chapter_id,
        choice_text: 'パンを買います。',
        choice_description: 'パンを買う',
        next_chapter_id: 'ch-11-3',
        display_order: 2,
      },
    ],
  });

  const chapter11_2 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-11-2',
      story_id: story11.story_id,
      parent_chapter_id: chapter11_1.chapter_id,
      chapter_number: 2,
      depth_level: 1,
      content: 'りんごは１個１００円です。３個買いました。',
      content_with_ruby:
        'りんごは<ruby>１個<rt>いっこ</rt></ruby><ruby>１００円<rt>ひゃくえん</rt></ruby>です。<ruby>３個<rt>さんこ</rt></ruby><ruby>買<rt>か</rt></ruby>いました。',
      translation: 'Apples are 100 yen each. I bought 3.',
      vocabulary: {
        create: [
          {
            word: 'りんご',
            reading: 'りんご',
            meanings: { en: 'apple', zh: '苹果', ko: '사과' },
            example: 'りんごが好きです。',
          },
          {
            word: '円',
            reading: 'えん',
            meanings: { en: 'yen (Japanese currency)', zh: '日元', ko: '엔' },
            example: 'これは千円です。',
          },
        ],
      },
    },
  });

  const chapter11_3 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-11-3',
      story_id: story11.story_id,
      parent_chapter_id: chapter11_1.chapter_id,
      chapter_number: 3,
      depth_level: 1,
      content: 'パンは１つ１５０円です。２つ買いました。',
      content_with_ruby:
        'パンは<ruby>１<rt>ひと</rt></ruby>つ<ruby>１５０円<rt>ひゃくごじゅうえん</rt></ruby>です。<ruby>２<rt>ふた</rt></ruby>つ<ruby>買<rt>か</rt></ruby>いました。',
      translation: 'Bread is 150 yen each. I bought 2.',
      vocabulary: {
        create: [
          {
            word: 'パン',
            reading: 'ぱん',
            meanings: { en: 'bread', zh: '面包', ko: '빵' },
            example: '朝ごはんはパンです。',
          },
        ],
      },
    },
  });

  console.log('✅ Story 11 created: スーパーで買い物');

  // ============================================================
  // Story 12: 家族の紹介 (N5/A1) - Introducing Family
  // ============================================================
  const story12 = await prisma.story.create({
    data: {
      story_id: '12',
      title: '家族の紹介',
      description: '私の家族を紹介します。家族の言葉を学びましょう。',
      level_jlpt: 'N5',
      level_cefr: 'A1',
      estimated_time: 3,
      root_chapter_id: 'ch-12-1',
    },
  });

  const chapter12_1 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-12-1',
      story_id: story12.story_id,
      chapter_number: 1,
      depth_level: 0,
      content: '私の家族は４人です。父と母と兄がいます。',
      content_with_ruby:
        '<ruby>私<rt>わたし</rt></ruby>の<ruby>家族<rt>かぞく</rt></ruby>は<ruby>４人<rt>よにん</rt></ruby>です。<ruby>父<rt>ちち</rt></ruby>と<ruby>母<rt>はは</rt></ruby>と<ruby>兄<rt>あに</rt></ruby>がいます。',
      translation: 'My family has 4 people. I have a father, mother, and older brother.',
      vocabulary: {
        create: [
          {
            word: '家族',
            reading: 'かぞく',
            meanings: { en: 'family', zh: '家人', ko: '가족' },
            example: '家族は大切です。',
          },
          {
            word: '父',
            reading: 'ちち',
            meanings: { en: 'father (my father)', zh: '父亲', ko: '아버지' },
            example: '父は会社員です。',
          },
          {
            word: '母',
            reading: 'はは',
            meanings: { en: 'mother (my mother)', zh: '母亲', ko: '어머니' },
            example: '母は料理が上手です。',
          },
          {
            word: '兄',
            reading: 'あに',
            meanings: { en: 'older brother', zh: '哥哥', ko: '형/오빠' },
            example: '兄は大学生です。',
          },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-12-1-a',
        chapter_id: chapter12_1.chapter_id,
        choice_text: '父の仕事は何ですか。',
        choice_description: '父について聞く',
        next_chapter_id: 'ch-12-2',
        display_order: 1,
      },
      {
        choice_id: 'choice-12-1-b',
        chapter_id: chapter12_1.chapter_id,
        choice_text: '兄は何歳ですか。',
        choice_description: '兄について聞く',
        next_chapter_id: 'ch-12-3',
        display_order: 2,
      },
    ],
  });

  const chapter12_2 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-12-2',
      story_id: story12.story_id,
      parent_chapter_id: chapter12_1.chapter_id,
      chapter_number: 2,
      depth_level: 1,
      content: '父は会社員です。毎日会社に行きます。',
      content_with_ruby:
        '<ruby>父<rt>ちち</rt></ruby>は<ruby>会社員<rt>かいしゃいん</rt></ruby>です。<ruby>毎日<rt>まいにち</rt></ruby><ruby>会社<rt>かいしゃ</rt></ruby>に<ruby>行<rt>い</rt></ruby>きます。',
      translation: 'My father is an office worker. He goes to the office every day.',
      vocabulary: {
        create: [
          {
            word: '会社員',
            reading: 'かいしゃいん',
            meanings: { en: 'office worker', zh: '公司职员', ko: '회사원' },
            example: '私は会社員です。',
          },
          {
            word: '毎日',
            reading: 'まいにち',
            meanings: { en: 'every day', zh: '每天', ko: '매일' },
            example: '毎日日本語を勉強します。',
          },
        ],
      },
    },
  });

  const chapter12_3 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-12-3',
      story_id: story12.story_id,
      parent_chapter_id: chapter12_1.chapter_id,
      chapter_number: 3,
      depth_level: 1,
      content: '兄は２０歳です。大学生です。',
      content_with_ruby:
        '<ruby>兄<rt>あに</rt></ruby>は<ruby>２０歳<rt>はたち</rt></ruby>です。<ruby>大学生<rt>だいがくせい</rt></ruby>です。',
      translation: 'My brother is 20 years old. He is a university student.',
      vocabulary: {
        create: [
          {
            word: '歳',
            reading: 'さい',
            meanings: { en: 'years old', zh: '岁', ko: '살' },
            example: '私は２５歳です。',
          },
          {
            word: '大学生',
            reading: 'だいがくせい',
            meanings: { en: 'university student', zh: '大学生', ko: '대학생' },
            example: '私は大学生です。',
          },
        ],
      },
    },
  });

  console.log('✅ Story 12 created: 家族の紹介');

  // ============================================================
  // Story 13: レストランで注文 (N5/A1) - Ordering at Restaurant
  // ============================================================
  const story13 = await prisma.story.create({
    data: {
      story_id: '13',
      title: 'レストランで注文',
      description: 'レストランで食べ物を注文します。簡単な注文の仕方を学びましょう。',
      level_jlpt: 'N5',
      level_cefr: 'A1',
      estimated_time: 4,
      root_chapter_id: 'ch-13-1',
    },
  });

  const chapter13_1 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-13-1',
      story_id: story13.story_id,
      chapter_number: 1,
      depth_level: 0,
      content: 'すみません。注文をお願いします。',
      content_with_ruby:
        'すみません。<ruby>注文<rt>ちゅうもん</rt></ruby>をお<ruby>願<rt>ねが</rt></ruby>いします。',
      translation: 'Excuse me. I would like to order, please.',
      vocabulary: {
        create: [
          {
            word: 'すみません',
            reading: 'すみません',
            meanings: { en: 'excuse me, sorry', zh: '不好意思', ko: '죄송합니다' },
            example: 'すみません、ちょっといいですか。',
          },
          {
            word: '注文',
            reading: 'ちゅうもん',
            meanings: { en: 'order', zh: '点菜', ko: '주문' },
            example: '注文してもいいですか。',
          },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-13-1-a',
        chapter_id: chapter13_1.chapter_id,
        choice_text: 'ラーメンをください。',
        choice_description: 'ラーメンを注文する',
        next_chapter_id: 'ch-13-2',
        display_order: 1,
      },
      {
        choice_id: 'choice-13-1-b',
        chapter_id: chapter13_1.chapter_id,
        choice_text: 'カレーをください。',
        choice_description: 'カレーを注文する',
        next_chapter_id: 'ch-13-3',
        display_order: 2,
      },
    ],
  });

  const chapter13_2 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-13-2',
      story_id: story13.story_id,
      parent_chapter_id: chapter13_1.chapter_id,
      chapter_number: 2,
      depth_level: 1,
      content: 'はい、ラーメンですね。飲み物は何にしますか。',
      content_with_ruby:
        'はい、ラーメンですね。<ruby>飲<rt>の</rt></ruby>み<ruby>物<rt>もの</rt></ruby>は<ruby>何<rt>なに</rt></ruby>にしますか。',
      translation: 'Yes, ramen. What would you like to drink?',
      vocabulary: {
        create: [
          {
            word: 'ラーメン',
            reading: 'らーめん',
            meanings: { en: 'ramen', zh: '拉面', ko: '라면' },
            example: 'ラーメンが好きです。',
          },
          {
            word: '飲み物',
            reading: 'のみもの',
            meanings: { en: 'drink, beverage', zh: '饮料', ko: '음료수' },
            example: '飲み物を買います。',
          },
        ],
      },
    },
  });

  const chapter13_3 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-13-3',
      story_id: story13.story_id,
      parent_chapter_id: chapter13_1.chapter_id,
      chapter_number: 3,
      depth_level: 1,
      content: 'カレーですね。かしこまりました。少々お待ちください。',
      content_with_ruby:
        'カレーですね。かしこまりました。<ruby>少々<rt>しょうしょう</rt></ruby>お<ruby>待<rt>ま</rt></ruby>ちください。',
      translation: 'Curry, understood. Please wait a moment.',
      vocabulary: {
        create: [
          {
            word: 'カレー',
            reading: 'かれー',
            meanings: { en: 'curry', zh: '咖喱', ko: '카레' },
            example: 'カレーライスを食べます。',
          },
          {
            word: '待つ',
            reading: 'まつ',
            meanings: { en: 'to wait', zh: '等待', ko: '기다리다' },
            example: 'ちょっと待ってください。',
          },
        ],
      },
    },
  });

  console.log('✅ Story 13 created: レストランで注文');

  console.log('\n✅ All beginner stories added successfully!');
  console.log('Total new stories: 4 (N5/A1 level)');
}

main()
  .catch((e) => {
    console.error('Error adding stories:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
