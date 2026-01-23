import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Adding 5 new beginner (N5/A1) stories to database...');

  // Delete existing stories 11-15 if they exist (for re-running script)
  await prisma.chapter.deleteMany({ where: { story_id: { in: ['11', '12', '13', '14', '15'] } } });
  await prisma.quiz.deleteMany({ where: { story_id: { in: ['11', '12', '13', '14', '15'] } } });
  await prisma.story.deleteMany({ where: { story_id: { in: ['11', '12', '13', '14', '15'] } } });
  console.log('Cleared any existing stories 11-15');

  // ============================================================
  // Story 11: 電車に乗る (N5/A1) - Taking the Train
  // ============================================================
  const story11 = await prisma.story.create({
    data: {
      story_id: '11',
      title: '電車に乗る',
      description: '駅で電車に乗ります。切符を買って、電車に乗る方法を学びましょう。',
      level_jlpt: 'N5',
      level_cefr: 'A1',
      estimated_time: 5,
      root_chapter_id: 'ch-11-1',
    },
  });

  const chapter11_1 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-11-1',
      story_id: story11.story_id,
      chapter_number: 1,
      depth_level: 0,
      content: '駅に着きました。切符を買います。',
      content_with_ruby:
        '<ruby>駅<rt>えき</rt></ruby>に<ruby>着<rt>つ</rt></ruby>きました。<ruby>切符<rt>きっぷ</rt></ruby>を<ruby>買<rt>か</rt></ruby>います。',
      translation: 'I arrived at the station. I will buy a ticket.',
      vocabulary: {
        create: [
          {
            word: '駅',
            reading: 'えき',
            meanings: { en: 'station', zh: '车站', ko: '역' },
            example: '駅はどこですか。',
          },
          {
            word: '着く',
            reading: 'つく',
            meanings: { en: 'to arrive', zh: '到达', ko: '도착하다' },
            example: '東京に着きました。',
          },
          {
            word: '切符',
            reading: 'きっぷ',
            meanings: { en: 'ticket', zh: '车票', ko: '표' },
            example: '切符を買います。',
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
        choice_text: '券売機で買います。',
        choice_description: '券売機を使う',
        next_chapter_id: 'ch-11-2',
        display_order: 1,
      },
      {
        choice_id: 'choice-11-1-b',
        chapter_id: chapter11_1.chapter_id,
        choice_text: '窓口で買います。',
        choice_description: '窓口で買う',
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
      content: '券売機で切符を買いました。渋谷まで２００円です。',
      content_with_ruby:
        '<ruby>券売機<rt>けんばいき</rt></ruby>で<ruby>切符<rt>きっぷ</rt></ruby>を<ruby>買<rt>か</rt></ruby>いました。<ruby>渋谷<rt>しぶや</rt></ruby>まで<ruby>２００円<rt>にひゃくえん</rt></ruby>です。',
      translation: 'I bought a ticket at the ticket machine. It is 200 yen to Shibuya.',
      vocabulary: {
        create: [
          {
            word: '券売機',
            reading: 'けんばいき',
            meanings: { en: 'ticket machine', zh: '自动售票机', ko: '매표기' },
            example: '券売機で切符を買います。',
          },
          {
            word: 'まで',
            reading: 'まで',
            meanings: { en: 'until, to', zh: '到', ko: '까지' },
            example: '学校まで歩きます。',
          },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-11-2-a',
        chapter_id: chapter11_2.chapter_id,
        choice_text: 'ホームに行きます。',
        choice_description: '電車に乗る',
        next_chapter_id: 'ch-11-4',
        display_order: 1,
      },
    ],
  });

  const chapter11_3 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-11-3',
      story_id: story11.story_id,
      parent_chapter_id: chapter11_1.chapter_id,
      chapter_number: 3,
      depth_level: 1,
      content: '窓口で駅員さんに聞きます。「渋谷まで切符をください。」',
      content_with_ruby:
        '<ruby>窓口<rt>まどぐち</rt></ruby>で<ruby>駅員<rt>えきいん</rt></ruby>さんに<ruby>聞<rt>き</rt></ruby>きます。「<ruby>渋谷<rt>しぶや</rt></ruby>まで<ruby>切符<rt>きっぷ</rt></ruby>をください。」',
      translation: 'I ask the station staff at the ticket window. "A ticket to Shibuya, please."',
      vocabulary: {
        create: [
          {
            word: '窓口',
            reading: 'まどぐち',
            meanings: { en: 'ticket window, counter', zh: '窗口', ko: '창구' },
            example: '窓口で切符を買います。',
          },
          {
            word: '駅員',
            reading: 'えきいん',
            meanings: { en: 'station staff', zh: '车站工作人员', ko: '역무원' },
            example: '駅員さんに聞きます。',
          },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-11-3-a',
        chapter_id: chapter11_3.chapter_id,
        choice_text: 'ホームに行きます。',
        choice_description: '電車に乗る',
        next_chapter_id: 'ch-11-4',
        display_order: 1,
      },
    ],
  });

  const chapter11_4 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-11-4',
      story_id: story11.story_id,
      parent_chapter_id: 'ch-11-2',
      chapter_number: 4,
      depth_level: 2,
      content: 'ホームで電車を待ちます。電車が来ました。電車に乗ります。',
      content_with_ruby:
        'ホームで<ruby>電車<rt>でんしゃ</rt></ruby>を<ruby>待<rt>ま</rt></ruby>ちます。<ruby>電車<rt>でんしゃ</rt></ruby>が<ruby>来<rt>き</rt></ruby>ました。<ruby>電車<rt>でんしゃ</rt></ruby>に<ruby>乗<rt>の</rt></ruby>ります。',
      translation: 'I wait for the train at the platform. The train arrived. I get on the train.',
      vocabulary: {
        create: [
          {
            word: 'ホーム',
            reading: 'ほーむ',
            meanings: { en: 'platform', zh: '站台', ko: '플랫폼' },
            example: 'ホームで電車を待ちます。',
          },
          {
            word: '電車',
            reading: 'でんしゃ',
            meanings: { en: 'train', zh: '电车', ko: '전철' },
            example: '電車で学校に行きます。',
          },
          {
            word: '待つ',
            reading: 'まつ',
            meanings: { en: 'to wait', zh: '等待', ko: '기다리다' },
            example: 'ここで待ってください。',
          },
          {
            word: '乗る',
            reading: 'のる',
            meanings: { en: 'to ride, to get on', zh: '乘坐', ko: '타다' },
            example: 'バスに乗ります。',
          },
        ],
      },
    },
  });

  console.log('✅ Story 11 created: 電車に乗る');

  // Create quizzes for Story 11
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-11-1',
      story_id: '11',
      question_text: '「駅」の読み方はどれですか？',
      question_type: '語彙',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: '電車に乗る',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-11-1-choice-1',
        quiz_id: 'quiz-11-1',
        choice_text: 'えき',
        is_correct: true,
        explanation: '「駅」は「えき」と読みます。(Eki means station.)',
      },
      {
        choice_id: 'quiz-11-1-choice-2',
        quiz_id: 'quiz-11-1',
        choice_text: 'いき',
        is_correct: false,
        explanation: '「いき」ではありません。正しくは「えき」です。',
      },
      {
        choice_id: 'quiz-11-1-choice-3',
        quiz_id: 'quiz-11-1',
        choice_text: 'うき',
        is_correct: false,
        explanation: '「うき」ではありません。正しくは「えき」です。',
      },
      {
        choice_id: 'quiz-11-1-choice-4',
        quiz_id: 'quiz-11-1',
        choice_text: 'おき',
        is_correct: false,
        explanation: '「おき」ではありません。正しくは「えき」です。',
      },
    ],
  });

  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-11-2',
      story_id: '11',
      question_text: '電車に乗る前に何をしますか？',
      question_type: '読解',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: '電車に乗る',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-11-2-choice-1',
        quiz_id: 'quiz-11-2',
        choice_text: '切符を買います',
        is_correct: true,
        explanation: '電車に乗る前に切符を買います。(You buy a ticket before getting on the train.)',
      },
      {
        choice_id: 'quiz-11-2-choice-2',
        quiz_id: 'quiz-11-2',
        choice_text: 'ご飯を食べます',
        is_correct: false,
        explanation: 'ストーリーには書いていません。切符を買います。',
      },
      {
        choice_id: 'quiz-11-2-choice-3',
        quiz_id: 'quiz-11-2',
        choice_text: '本を読みます',
        is_correct: false,
        explanation: 'ストーリーには書いていません。切符を買います。',
      },
      {
        choice_id: 'quiz-11-2-choice-4',
        quiz_id: 'quiz-11-2',
        choice_text: '寝ます',
        is_correct: false,
        explanation: 'ストーリーには書いていません。切符を買います。',
      },
    ],
  });

  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-11-3',
      story_id: '11',
      question_text: '「～まで」はどういう意味ですか？',
      question_type: '文法',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: '電車に乗る',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-11-3-choice-1',
        quiz_id: 'quiz-11-3',
        choice_text: '目的地を示す（～to, until）',
        is_correct: true,
        explanation: '「～まで」は目的地や終点を示します。(～made indicates the destination or endpoint.)',
      },
      {
        choice_id: 'quiz-11-3-choice-2',
        quiz_id: 'quiz-11-3',
        choice_text: '場所を示す（～at, in）',
        is_correct: false,
        explanation: '場所は「～で」や「～に」を使います。',
      },
      {
        choice_id: 'quiz-11-3-choice-3',
        quiz_id: 'quiz-11-3',
        choice_text: '時間を示す（～when）',
        is_correct: false,
        explanation: '時間は「～に」を使います。',
      },
      {
        choice_id: 'quiz-11-3-choice-4',
        quiz_id: 'quiz-11-3',
        choice_text: '理由を示す（～because）',
        is_correct: false,
        explanation: '理由は「～から」を使います。',
      },
    ],
  });

  console.log('✅ Story 11 quizzes created');

  // ============================================================
  // Story 12: 図書館で本を借りる (N5/A1) - Borrowing Books at the Library
  // ============================================================
  const story12 = await prisma.story.create({
    data: {
      story_id: '12',
      title: '図書館で本を借りる',
      description: '図書館で本を借ります。図書館での基本的なマナーと手続きを学びましょう。',
      level_jlpt: 'N5',
      level_cefr: 'A1',
      estimated_time: 4,
      root_chapter_id: 'ch-12-1',
    },
  });

  const chapter12_1 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-12-1',
      story_id: story12.story_id,
      chapter_number: 1,
      depth_level: 0,
      content: '図書館に来ました。本を探します。',
      content_with_ruby:
        '<ruby>図書館<rt>としょかん</rt></ruby>に<ruby>来<rt>き</rt></ruby>ました。<ruby>本<rt>ほん</rt></ruby>を<ruby>探<rt>さが</rt></ruby>します。',
      translation: 'I came to the library. I will look for books.',
      vocabulary: {
        create: [
          {
            word: '図書館',
            reading: 'としょかん',
            meanings: { en: 'library', zh: '图书馆', ko: '도서관' },
            example: '図書館で勉強します。',
          },
          {
            word: '本',
            reading: 'ほん',
            meanings: { en: 'book', zh: '书', ko: '책' },
            example: '本を読みます。',
          },
          {
            word: '探す',
            reading: 'さがす',
            meanings: { en: 'to look for, to search', zh: '寻找', ko: '찾다' },
            example: 'ペンを探します。',
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
        choice_text: '本棚を見ます。',
        choice_description: '自分で探す',
        next_chapter_id: 'ch-12-2',
        display_order: 1,
      },
      {
        choice_id: 'choice-12-1-b',
        chapter_id: chapter12_1.chapter_id,
        choice_text: '職員に聞きます。',
        choice_description: '職員に聞く',
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
      content: '本棚で本を見つけました。この本を借ります。',
      content_with_ruby:
        '<ruby>本棚<rt>ほんだな</rt></ruby>で<ruby>本<rt>ほん</rt></ruby>を<ruby>見<rt>み</rt></ruby>つけました。この<ruby>本<rt>ほん</rt></ruby>を<ruby>借<rt>か</rt></ruby>ります。',
      translation: 'I found a book on the bookshelf. I will borrow this book.',
      vocabulary: {
        create: [
          {
            word: '本棚',
            reading: 'ほんだな',
            meanings: { en: 'bookshelf', zh: '书架', ko: '책장' },
            example: '本棚に本があります。',
          },
          {
            word: '見つける',
            reading: 'みつける',
            meanings: { en: 'to find', zh: '找到', ko: '찾다' },
            example: 'かばんを見つけました。',
          },
          {
            word: '借りる',
            reading: 'かりる',
            meanings: { en: 'to borrow', zh: '借', ko: '빌리다' },
            example: '友達にペンを借ります。',
          },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-12-2-a',
        chapter_id: chapter12_2.chapter_id,
        choice_text: 'カウンターに行きます。',
        choice_description: '本を借りる',
        next_chapter_id: 'ch-12-4',
        display_order: 1,
      },
    ],
  });

  const chapter12_3 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-12-3',
      story_id: story12.story_id,
      parent_chapter_id: chapter12_1.chapter_id,
      chapter_number: 3,
      depth_level: 1,
      content: '「すみません。日本の歴史の本はどこですか。」',
      content_with_ruby:
        '「すみません。<ruby>日本<rt>にほん</rt></ruby>の<ruby>歴史<rt>れきし</rt></ruby>の<ruby>本<rt>ほん</rt></ruby>はどこですか。」',
      translation: '"Excuse me. Where are the books about Japanese history?"',
      vocabulary: {
        create: [
          {
            word: '歴史',
            reading: 'れきし',
            meanings: { en: 'history', zh: '历史', ko: '역사' },
            example: '日本の歴史を勉強します。',
          },
          {
            word: 'どこ',
            reading: 'どこ',
            meanings: { en: 'where', zh: '哪里', ko: '어디' },
            example: 'トイレはどこですか。',
          },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-12-3-a',
        chapter_id: chapter12_3.chapter_id,
        choice_text: '職員が教えてくれました。',
        choice_description: '本を探す',
        next_chapter_id: 'ch-12-4',
        display_order: 1,
      },
    ],
  });

  const chapter12_4 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-12-4',
      story_id: story12.story_id,
      parent_chapter_id: 'ch-12-2',
      chapter_number: 4,
      depth_level: 2,
      content: 'カウンターで図書館カードを見せます。本を借りました。',
      content_with_ruby:
        'カウンターで<ruby>図書館<rt>としょかん</rt></ruby>カードを<ruby>見<rt>み</rt></ruby>せます。<ruby>本<rt>ほん</rt></ruby>を<ruby>借<rt>か</rt></ruby>りました。',
      translation: 'I show my library card at the counter. I borrowed the book.',
      vocabulary: {
        create: [
          {
            word: 'カード',
            reading: 'かーど',
            meanings: { en: 'card', zh: '卡', ko: '카드' },
            example: 'カードで払います。',
          },
          {
            word: '見せる',
            reading: 'みせる',
            meanings: { en: 'to show', zh: '出示', ko: '보여주다' },
            example: 'パスポートを見せてください。',
          },
        ],
      },
    },
  });

  console.log('✅ Story 12 created: 図書館で本を借りる');

  // Create quizzes for Story 12
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-12-1',
      story_id: '12',
      question_text: '「図書館」の読み方はどれですか？',
      question_type: '語彙',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: '図書館で本を借りる',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-12-1-choice-1',
        quiz_id: 'quiz-12-1',
        choice_text: 'としょかん',
        is_correct: true,
        explanation: '「図書館」は「としょかん」と読みます。(Toshokan means library.)',
      },
      {
        choice_id: 'quiz-12-1-choice-2',
        quiz_id: 'quiz-12-1',
        choice_text: 'ずしょかん',
        is_correct: false,
        explanation: '「ずしょかん」ではありません。正しくは「としょかん」です。',
      },
      {
        choice_id: 'quiz-12-1-choice-3',
        quiz_id: 'quiz-12-1',
        choice_text: 'としょうかん',
        is_correct: false,
        explanation: '「としょうかん」ではありません。正しくは「としょかん」です。',
      },
      {
        choice_id: 'quiz-12-1-choice-4',
        quiz_id: 'quiz-12-1',
        choice_text: 'ずしょうかん',
        is_correct: false,
        explanation: '「ずしょうかん」ではありません。正しくは「としょかん」です。',
      },
    ],
  });

  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-12-2',
      story_id: '12',
      question_text: '本を借りる時、何を見せますか？',
      question_type: '読解',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: '図書館で本を借りる',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-12-2-choice-1',
        quiz_id: 'quiz-12-2',
        choice_text: '図書館カード',
        is_correct: true,
        explanation: '図書館で本を借りる時、図書館カードを見せます。(You show your library card when borrowing books.)',
      },
      {
        choice_id: 'quiz-12-2-choice-2',
        quiz_id: 'quiz-12-2',
        choice_text: 'パスポート',
        is_correct: false,
        explanation: 'パスポートではありません。図書館カードです。',
      },
      {
        choice_id: 'quiz-12-2-choice-3',
        quiz_id: 'quiz-12-2',
        choice_text: '学生証',
        is_correct: false,
        explanation: '学生証ではありません。図書館カードです。',
      },
      {
        choice_id: 'quiz-12-2-choice-4',
        quiz_id: 'quiz-12-2',
        choice_text: '運転免許証',
        is_correct: false,
        explanation: '運転免許証ではありません。図書館カードです。',
      },
    ],
  });

  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-12-3',
      story_id: '12',
      question_text: '図書館では静かにする必要があります。これは日本の何ですか？',
      question_type: '文化',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: '図書館で本を借りる',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-12-3-choice-1',
        quiz_id: 'quiz-12-3',
        choice_text: '公共の場でのマナー',
        is_correct: true,
        explanation: '日本では図書館などの公共の場では静かにするマナーがあります。(In Japan, it is good manners to be quiet in public places like libraries.)',
      },
      {
        choice_id: 'quiz-12-3-choice-2',
        quiz_id: 'quiz-12-3',
        choice_text: '法律',
        is_correct: false,
        explanation: '法律ではありませんが、マナーとして大切です。',
      },
      {
        choice_id: 'quiz-12-3-choice-3',
        quiz_id: 'quiz-12-3',
        choice_text: '宗教',
        is_correct: false,
        explanation: '宗教ではありません。公共の場でのマナーです。',
      },
      {
        choice_id: 'quiz-12-3-choice-4',
        quiz_id: 'quiz-12-3',
        choice_text: '習慣',
        is_correct: false,
        explanation: '習慣でもありますが、より正確には「マナー」です。',
      },
    ],
  });

  console.log('✅ Story 12 quizzes created');

  // ============================================================
  // Story 13: 新しい友達 (N5/A1) - Making a New Friend
  // ============================================================
  const story13 = await prisma.story.create({
    data: {
      story_id: '13',
      title: '新しい友達',
      description: '学校で新しい友達を作ります。自己紹介と友達になる会話を学びましょう。',
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
      content: '学校に新しい学生が来ました。話しかけます。',
      content_with_ruby:
        '<ruby>学校<rt>がっこう</rt></ruby>に<ruby>新<rt>あたら</rt></ruby>しい<ruby>学生<rt>がくせい</rt></ruby>が<ruby>来<rt>き</rt></ruby>ました。<ruby>話<rt>はな</rt></ruby>しかけます。',
      translation: 'A new student came to school. I will talk to them.',
      vocabulary: {
        create: [
          {
            word: '学校',
            reading: 'がっこう',
            meanings: { en: 'school', zh: '学校', ko: '학교' },
            example: '学校で勉強します。',
          },
          {
            word: '新しい',
            reading: 'あたらしい',
            meanings: { en: 'new', zh: '新的', ko: '새로운' },
            example: '新しい本を買いました。',
          },
          {
            word: '学生',
            reading: 'がくせい',
            meanings: { en: 'student', zh: '学生', ko: '학생' },
            example: '私は学生です。',
          },
          {
            word: '話す',
            reading: 'はなす',
            meanings: { en: 'to talk, to speak', zh: '说话', ko: '말하다' },
            example: '日本語を話します。',
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
        choice_text: '「こんにちは。私は田中です。」',
        choice_description: '自己紹介する',
        next_chapter_id: 'ch-13-2',
        display_order: 1,
      },
      {
        choice_id: 'choice-13-1-b',
        chapter_id: chapter13_1.chapter_id,
        choice_text: '「初めまして。よろしくお願いします。」',
        choice_description: '丁寧に挨拶する',
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
      content: '「こんにちは。私はマイクです。アメリカから来ました。」',
      content_with_ruby:
        '「こんにちは。<ruby>私<rt>わたし</rt></ruby>はマイクです。アメリカから<ruby>来<rt>き</rt></ruby>ました。」',
      translation: '"Hello. I am Mike. I came from America."',
      vocabulary: {
        create: [
          {
            word: '私',
            reading: 'わたし',
            meanings: { en: 'I, me', zh: '我', ko: '나' },
            example: '私は学生です。',
          },
          {
            word: 'から',
            reading: 'から',
            meanings: { en: 'from', zh: '从', ko: '부터' },
            example: '日本から来ました。',
          },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-13-2-a',
        chapter_id: chapter13_2.chapter_id,
        choice_text: '「趣味は何ですか。」',
        choice_description: '趣味を聞く',
        next_chapter_id: 'ch-13-4',
        display_order: 1,
      },
    ],
  });

  const chapter13_3 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-13-3',
      story_id: story13.story_id,
      parent_chapter_id: chapter13_1.chapter_id,
      chapter_number: 3,
      depth_level: 1,
      content: '「初めまして。マイクです。よろしくお願いします。」',
      content_with_ruby:
        '「<ruby>初<rt>はじ</rt></ruby>めまして。マイクです。よろしくお<ruby>願<rt>ねが</rt></ruby>いします。」',
      translation: '"Nice to meet you. I am Mike. Please treat me well."',
      vocabulary: {
        create: [
          {
            word: '初めまして',
            reading: 'はじめまして',
            meanings: { en: 'nice to meet you', zh: '初次见面', ko: '처음 뵙겠습니다' },
            example: '初めまして。田中です。',
          },
          {
            word: 'よろしくお願いします',
            reading: 'よろしくおねがいします',
            meanings: { en: 'please treat me well', zh: '请多关照', ko: '잘 부탁드립니다' },
            example: '初めまして。よろしくお願いします。',
          },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-13-3-a',
        chapter_id: chapter13_3.chapter_id,
        choice_text: '「趣味は何ですか。」',
        choice_description: '趣味を聞く',
        next_chapter_id: 'ch-13-4',
        display_order: 1,
      },
    ],
  });

  const chapter13_4 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-13-4',
      story_id: story13.story_id,
      parent_chapter_id: 'ch-13-2',
      chapter_number: 4,
      depth_level: 2,
      content: '「私の趣味はサッカーです。一緒にサッカーをしませんか。」',
      content_with_ruby:
        '「<ruby>私<rt>わたし</rt></ruby>の<ruby>趣味<rt>しゅみ</rt></ruby>はサッカーです。<ruby>一緒<rt>いっしょ</rt></ruby>にサッカーをしませんか。」',
      translation: '"My hobby is soccer. Would you like to play soccer together?"',
      vocabulary: {
        create: [
          {
            word: '趣味',
            reading: 'しゅみ',
            meanings: { en: 'hobby', zh: '爱好', ko: '취미' },
            example: '趣味は読書です。',
          },
          {
            word: '一緒に',
            reading: 'いっしょに',
            meanings: { en: 'together', zh: '一起', ko: '함께' },
            example: '一緒に行きましょう。',
          },
        ],
      },
    },
  });

  console.log('✅ Story 13 created: 新しい友達');

  // Create quizzes for Story 13
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-13-1',
      story_id: '13',
      question_text: '「初めまして」はいつ使いますか？',
      question_type: '語彙',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: '新しい友達',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-13-1-choice-1',
        quiz_id: 'quiz-13-1',
        choice_text: '初めて会う時',
        is_correct: true,
        explanation: '「初めまして」は初めて会う人に使います。(Hajimemashite is used when meeting someone for the first time.)',
      },
      {
        choice_id: 'quiz-13-1-choice-2',
        quiz_id: 'quiz-13-1',
        choice_text: '朝会う時',
        is_correct: false,
        explanation: '朝は「おはようございます」を使います。',
      },
      {
        choice_id: 'quiz-13-1-choice-3',
        quiz_id: 'quiz-13-1',
        choice_text: '別れる時',
        is_correct: false,
        explanation: '別れる時は「さようなら」を使います。',
      },
      {
        choice_id: 'quiz-13-1-choice-4',
        quiz_id: 'quiz-13-1',
        choice_text: '夜会う時',
        is_correct: false,
        explanation: '夜は「こんばんは」を使います。',
      },
    ],
  });

  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-13-2',
      story_id: '13',
      question_text: 'マイクはどこから来ましたか？',
      question_type: '読解',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: '新しい友達',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-13-2-choice-1',
        quiz_id: 'quiz-13-2',
        choice_text: 'アメリカ',
        is_correct: true,
        explanation: 'マイクはアメリカから来ました。(Mike came from America.)',
      },
      {
        choice_id: 'quiz-13-2-choice-2',
        quiz_id: 'quiz-13-2',
        choice_text: 'イギリス',
        is_correct: false,
        explanation: 'イギリスではありません。アメリカです。',
      },
      {
        choice_id: 'quiz-13-2-choice-3',
        quiz_id: 'quiz-13-2',
        choice_text: 'カナダ',
        is_correct: false,
        explanation: 'カナダではありません。アメリカです。',
      },
      {
        choice_id: 'quiz-13-2-choice-4',
        quiz_id: 'quiz-13-2',
        choice_text: 'オーストラリア',
        is_correct: false,
        explanation: 'オーストラリアではありません。アメリカです。',
      },
    ],
  });

  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-13-3',
      story_id: '13',
      question_text: '「～しませんか」はどういう意味ですか？',
      question_type: '文法',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: '新しい友達',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-13-3-choice-1',
        quiz_id: 'quiz-13-3',
        choice_text: '誘う（～Would you like to...?）',
        is_correct: true,
        explanation: '「～しませんか」は誘う時に使います。(～shimasenka is used to invite someone.)',
      },
      {
        choice_id: 'quiz-13-3-choice-2',
        quiz_id: 'quiz-13-3',
        choice_text: '禁止する（～Don\'t...）',
        is_correct: false,
        explanation: '禁止は「～しないでください」を使います。',
      },
      {
        choice_id: 'quiz-13-3-choice-3',
        quiz_id: 'quiz-13-3',
        choice_text: '命令する（～Do...!）',
        is_correct: false,
        explanation: '命令は「～しなさい」を使います。',
      },
      {
        choice_id: 'quiz-13-3-choice-4',
        quiz_id: 'quiz-13-3',
        choice_text: '質問する（～Do you...?）',
        is_correct: false,
        explanation: '質問は「～しますか」を使います。',
      },
    ],
  });

  console.log('✅ Story 13 quizzes created');

  // ============================================================
  // Story 14: 郵便局で (N5/A1) - At the Post Office
  // ============================================================
  const story14 = await prisma.story.create({
    data: {
      story_id: '14',
      title: '郵便局で',
      description: '郵便局で手紙を送ります。郵便局での基本的な手続きを学びましょう。',
      level_jlpt: 'N5',
      level_cefr: 'A1',
      estimated_time: 4,
      root_chapter_id: 'ch-14-1',
    },
  });

  const chapter14_1 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-14-1',
      story_id: story14.story_id,
      chapter_number: 1,
      depth_level: 0,
      content: '郵便局に来ました。手紙を送りたいです。',
      content_with_ruby:
        '<ruby>郵便局<rt>ゆうびんきょく</rt></ruby>に<ruby>来<rt>き</rt></ruby>ました。<ruby>手紙<rt>てがみ</rt></ruby>を<ruby>送<rt>おく</rt></ruby>りたいです。',
      translation: 'I came to the post office. I want to send a letter.',
      vocabulary: {
        create: [
          {
            word: '郵便局',
            reading: 'ゆうびんきょく',
            meanings: { en: 'post office', zh: '邮局', ko: '우체국' },
            example: '郵便局で手紙を送ります。',
          },
          {
            word: '手紙',
            reading: 'てがみ',
            meanings: { en: 'letter', zh: '信', ko: '편지' },
            example: '友達に手紙を書きます。',
          },
          {
            word: '送る',
            reading: 'おくる',
            meanings: { en: 'to send', zh: '寄', ko: '보내다' },
            example: 'プレゼントを送ります。',
          },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-14-1-a',
        chapter_id: chapter14_1.chapter_id,
        choice_text: '切手を買います。',
        choice_description: '切手を買う',
        next_chapter_id: 'ch-14-2',
        display_order: 1,
      },
      {
        choice_id: 'choice-14-1-b',
        chapter_id: chapter14_1.chapter_id,
        choice_text: '窓口で聞きます。',
        choice_description: '職員に聞く',
        next_chapter_id: 'ch-14-3',
        display_order: 2,
      },
    ],
  });

  const chapter14_2 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-14-2',
      story_id: story14.story_id,
      parent_chapter_id: chapter14_1.chapter_id,
      chapter_number: 2,
      depth_level: 1,
      content: '切手を買いました。８４円です。手紙に切手を貼ります。',
      content_with_ruby:
        '<ruby>切手<rt>きって</rt></ruby>を<ruby>買<rt>か</rt></ruby>いました。<ruby>８４円<rt>はちじゅうよんえん</rt></ruby>です。<ruby>手紙<rt>てがみ</rt></ruby>に<ruby>切手<rt>きって</rt></ruby>を<ruby>貼<rt>は</rt></ruby>ります。',
      translation: 'I bought a stamp. It is 84 yen. I put the stamp on the letter.',
      vocabulary: {
        create: [
          {
            word: '切手',
            reading: 'きって',
            meanings: { en: 'stamp', zh: '邮票', ko: '우표' },
            example: '切手を買います。',
          },
          {
            word: '貼る',
            reading: 'はる',
            meanings: { en: 'to stick, to paste', zh: '贴', ko: '붙이다' },
            example: 'ポスターを壁に貼ります。',
          },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-14-2-a',
        chapter_id: chapter14_2.chapter_id,
        choice_text: 'ポストに入れます。',
        choice_description: '手紙を投函する',
        next_chapter_id: 'ch-14-4',
        display_order: 1,
      },
    ],
  });

  const chapter14_3 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-14-3',
      story_id: story14.story_id,
      parent_chapter_id: chapter14_1.chapter_id,
      chapter_number: 3,
      depth_level: 1,
      content: '「すみません。この手紙を送りたいです。」「はい。８４円です。」',
      content_with_ruby:
        '「すみません。この<ruby>手紙<rt>てがみ</rt></ruby>を<ruby>送<rt>おく</rt></ruby>りたいです。」「はい。<ruby>８４円<rt>はちじゅうよんえん</rt></ruby>です。」',
      translation: '"Excuse me. I want to send this letter." "Yes. It is 84 yen."',
      vocabulary: {
        create: [
          {
            word: '～たい',
            reading: '～たい',
            meanings: { en: 'want to', zh: '想要', ko: '~고 싶다' },
            example: '日本に行きたいです。',
          },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-14-3-a',
        chapter_id: chapter14_3.chapter_id,
        choice_text: 'お金を払います。',
        choice_description: '料金を払う',
        next_chapter_id: 'ch-14-4',
        display_order: 1,
      },
    ],
  });

  const chapter14_4 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-14-4',
      story_id: story14.story_id,
      parent_chapter_id: 'ch-14-2',
      chapter_number: 4,
      depth_level: 2,
      content: '手紙をポストに入れました。手紙を送りました。',
      content_with_ruby:
        '<ruby>手紙<rt>てがみ</rt></ruby>をポストに<ruby>入<rt>い</rt></ruby>れました。<ruby>手紙<rt>てがみ</rt></ruby>を<ruby>送<rt>おく</rt></ruby>りました。',
      translation: 'I put the letter in the mailbox. I sent the letter.',
      vocabulary: {
        create: [
          {
            word: 'ポスト',
            reading: 'ぽすと',
            meanings: { en: 'mailbox', zh: '邮箱', ko: '우체통' },
            example: 'ポストに手紙を入れます。',
          },
          {
            word: '入れる',
            reading: 'いれる',
            meanings: { en: 'to put in, to insert', zh: '放入', ko: '넣다' },
            example: 'かばんに本を入れます。',
          },
        ],
      },
    },
  });

  console.log('✅ Story 14 created: 郵便局で');

  // Create quizzes for Story 14
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-14-1',
      story_id: '14',
      question_text: '「郵便局」の読み方はどれですか？',
      question_type: '語彙',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: '郵便局で',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-14-1-choice-1',
        quiz_id: 'quiz-14-1',
        choice_text: 'ゆうびんきょく',
        is_correct: true,
        explanation: '「郵便局」は「ゆうびんきょく」と読みます。(Yuubinkyoku means post office.)',
      },
      {
        choice_id: 'quiz-14-1-choice-2',
        quiz_id: 'quiz-14-1',
        choice_text: 'ゆびんきょく',
        is_correct: false,
        explanation: '「ゆびんきょく」ではありません。正しくは「ゆうびんきょく」です。',
      },
      {
        choice_id: 'quiz-14-1-choice-3',
        quiz_id: 'quiz-14-1',
        choice_text: 'ゆうびんぎょく',
        is_correct: false,
        explanation: '「ゆうびんぎょく」ではありません。正しくは「ゆうびんきょく」です。',
      },
      {
        choice_id: 'quiz-14-1-choice-4',
        quiz_id: 'quiz-14-1',
        choice_text: 'ゆびんぎょく',
        is_correct: false,
        explanation: '「ゆびんぎょく」ではありません。正しくは「ゆうびんきょく」です。',
      },
    ],
  });

  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-14-2',
      story_id: '14',
      question_text: '手紙を送る時、何を買いますか？',
      question_type: '読解',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: '郵便局で',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-14-2-choice-1',
        quiz_id: 'quiz-14-2',
        choice_text: '切手',
        is_correct: true,
        explanation: '手紙を送る時、切手を買います。(You buy stamps when sending letters.)',
      },
      {
        choice_id: 'quiz-14-2-choice-2',
        quiz_id: 'quiz-14-2',
        choice_text: '封筒',
        is_correct: false,
        explanation: '封筒も必要ですが、ストーリーでは切手を買いました。',
      },
      {
        choice_id: 'quiz-14-2-choice-3',
        quiz_id: 'quiz-14-2',
        choice_text: 'ペン',
        is_correct: false,
        explanation: 'ペンではありません。切手です。',
      },
      {
        choice_id: 'quiz-14-2-choice-4',
        quiz_id: 'quiz-14-2',
        choice_text: '紙',
        is_correct: false,
        explanation: '紙ではありません。切手です。',
      },
    ],
  });

  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-14-3',
      story_id: '14',
      question_text: '「～たい」はどういう意味ですか？',
      question_type: '文法',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: '郵便局で',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-14-3-choice-1',
        quiz_id: 'quiz-14-3',
        choice_text: '願望（～want to）',
        is_correct: true,
        explanation: '「～たい」は願望を表します。(～tai expresses desire or want.)',
      },
      {
        choice_id: 'quiz-14-3-choice-2',
        quiz_id: 'quiz-14-3',
        choice_text: '過去（～did）',
        is_correct: false,
        explanation: '過去は「～た」を使います。',
      },
      {
        choice_id: 'quiz-14-3-choice-3',
        quiz_id: 'quiz-14-3',
        choice_text: '命令（～do!）',
        is_correct: false,
        explanation: '命令は「～なさい」を使います。',
      },
      {
        choice_id: 'quiz-14-3-choice-4',
        quiz_id: 'quiz-14-3',
        choice_text: '禁止（～don\'t）',
        is_correct: false,
        explanation: '禁止は「～ないでください」を使います。',
      },
    ],
  });

  console.log('✅ Story 14 quizzes created');

  // ============================================================
  // Story 15: 天気と洋服 (N5/A1) - Weather and Clothes
  // ============================================================
  const story15 = await prisma.story.create({
    data: {
      story_id: '15',
      title: '天気と洋服',
      description: '天気に合わせて洋服を選びます。天気と洋服の言葉を学びましょう。',
      level_jlpt: 'N5',
      level_cefr: 'A1',
      estimated_time: 4,
      root_chapter_id: 'ch-15-1',
    },
  });

  const chapter15_1 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-15-1',
      story_id: story15.story_id,
      chapter_number: 1,
      depth_level: 0,
      content: '今日は雨が降っています。外に出ます。',
      content_with_ruby:
        '<ruby>今日<rt>きょう</rt></ruby>は<ruby>雨<rt>あめ</rt></ruby>が<ruby>降<rt>ふ</rt></ruby>っています。<ruby>外<rt>そと</rt></ruby>に<ruby>出<rt>で</rt></ruby>ます。',
      translation: 'It is raining today. I will go outside.',
      vocabulary: {
        create: [
          {
            word: '雨',
            reading: 'あめ',
            meanings: { en: 'rain', zh: '雨', ko: '비' },
            example: '雨が降っています。',
          },
          {
            word: '降る',
            reading: 'ふる',
            meanings: { en: 'to fall (rain, snow)', zh: '下(雨/雪)', ko: '내리다' },
            example: '雪が降ります。',
          },
          {
            word: '外',
            reading: 'そと',
            meanings: { en: 'outside', zh: '外面', ko: '밖' },
            example: '外で遊びます。',
          },
          {
            word: '出る',
            reading: 'でる',
            meanings: { en: 'to go out, to leave', zh: '出去', ko: '나가다' },
            example: '家を出ます。',
          },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-15-1-a',
        chapter_id: chapter15_1.chapter_id,
        choice_text: '傘を持って行きます。',
        choice_description: '傘を持つ',
        next_chapter_id: 'ch-15-2',
        display_order: 1,
      },
      {
        choice_id: 'choice-15-1-b',
        chapter_id: chapter15_1.chapter_id,
        choice_text: 'レインコートを着ます。',
        choice_description: 'レインコートを着る',
        next_chapter_id: 'ch-15-3',
        display_order: 2,
      },
    ],
  });

  const chapter15_2 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-15-2',
      story_id: story15.story_id,
      parent_chapter_id: chapter15_1.chapter_id,
      chapter_number: 2,
      depth_level: 1,
      content: '傘を持って外に出ました。雨に濡れません。',
      content_with_ruby:
        '<ruby>傘<rt>かさ</rt></ruby>を<ruby>持<rt>も</rt></ruby>って<ruby>外<rt>そと</rt></ruby>に<ruby>出<rt>で</rt></ruby>ました。<ruby>雨<rt>あめ</rt></ruby>に<ruby>濡<rt>ぬ</rt></ruby>れません。',
      translation: 'I went outside with an umbrella. I did not get wet.',
      vocabulary: {
        create: [
          {
            word: '傘',
            reading: 'かさ',
            meanings: { en: 'umbrella', zh: '伞', ko: '우산' },
            example: '傘を持って行きます。',
          },
          {
            word: '持つ',
            reading: 'もつ',
            meanings: { en: 'to hold, to carry', zh: '拿', ko: '들다' },
            example: 'かばんを持ちます。',
          },
          {
            word: '濡れる',
            reading: 'ぬれる',
            meanings: { en: 'to get wet', zh: '湿', ko: '젖다' },
            example: '雨に濡れました。',
          },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-15-2-a',
        chapter_id: chapter15_2.chapter_id,
        choice_text: '駅に着きました。',
        choice_description: '目的地到着',
        next_chapter_id: 'ch-15-4',
        display_order: 1,
      },
    ],
  });

  const chapter15_3 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-15-3',
      story_id: story15.story_id,
      parent_chapter_id: chapter15_1.chapter_id,
      chapter_number: 3,
      depth_level: 1,
      content: 'レインコートを着て外に出ました。手が自由です。',
      content_with_ruby:
        'レインコートを<ruby>着<rt>き</rt></ruby>て<ruby>外<rt>そと</rt></ruby>に<ruby>出<rt>で</rt></ruby>ました。<ruby>手<rt>て</rt></ruby>が<ruby>自由<rt>じゆう</rt></ruby>です。',
      translation: 'I went outside wearing a raincoat. My hands are free.',
      vocabulary: {
        create: [
          {
            word: 'レインコート',
            reading: 'れいんこーと',
            meanings: { en: 'raincoat', zh: '雨衣', ko: '비옷' },
            example: 'レインコートを着ます。',
          },
          {
            word: '着る',
            reading: 'きる',
            meanings: { en: 'to wear (clothes)', zh: '穿', ko: '입다' },
            example: 'Tシャツを着ます。',
          },
          {
            word: '手',
            reading: 'て',
            meanings: { en: 'hand', zh: '手', ko: '손' },
            example: '手を洗います。',
          },
          {
            word: '自由',
            reading: 'じゆう',
            meanings: { en: 'free, freedom', zh: '自由', ko: '자유' },
            example: '時間が自由です。',
          },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-15-3-a',
        chapter_id: chapter15_3.chapter_id,
        choice_text: '駅に着きました。',
        choice_description: '目的地到着',
        next_chapter_id: 'ch-15-4',
        display_order: 1,
      },
    ],
  });

  const chapter15_4 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-15-4',
      story_id: story15.story_id,
      parent_chapter_id: 'ch-15-2',
      chapter_number: 4,
      depth_level: 2,
      content: '駅に着きました。雨の日も準備すれば大丈夫です。',
      content_with_ruby:
        '<ruby>駅<rt>えき</rt></ruby>に<ruby>着<rt>つ</rt></ruby>きました。<ruby>雨<rt>あめ</rt></ruby>の<ruby>日<rt>ひ</rt></ruby>も<ruby>準備<rt>じゅんび</rt></ruby>すれば<ruby>大丈夫<rt>だいじょうぶ</rt></ruby>です。',
      translation: 'I arrived at the station. If you prepare, rainy days are okay too.',
      vocabulary: {
        create: [
          {
            word: '日',
            reading: 'ひ',
            meanings: { en: 'day', zh: '天', ko: '날' },
            example: '毎日勉強します。',
          },
          {
            word: '準備',
            reading: 'じゅんび',
            meanings: { en: 'preparation', zh: '准备', ko: '준비' },
            example: 'テストの準備をします。',
          },
          {
            word: '大丈夫',
            reading: 'だいじょうぶ',
            meanings: { en: 'okay, all right', zh: '没关系', ko: '괜찮다' },
            example: '大丈夫ですか。',
          },
        ],
      },
    },
  });

  console.log('✅ Story 15 created: 天気と洋服');

  // Create quizzes for Story 15
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-15-1',
      story_id: '15',
      question_text: '「雨」の読み方はどれですか？',
      question_type: '語彙',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: '天気と洋服',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-15-1-choice-1',
        quiz_id: 'quiz-15-1',
        choice_text: 'あめ',
        is_correct: true,
        explanation: '「雨」は「あめ」と読みます。(Ame means rain.)',
      },
      {
        choice_id: 'quiz-15-1-choice-2',
        quiz_id: 'quiz-15-1',
        choice_text: 'ゆき',
        is_correct: false,
        explanation: '「ゆき」は「雪」です。「雨」は「あめ」です。',
      },
      {
        choice_id: 'quiz-15-1-choice-3',
        quiz_id: 'quiz-15-1',
        choice_text: 'くも',
        is_correct: false,
        explanation: '「くも」は「雲」です。「雨」は「あめ」です。',
      },
      {
        choice_id: 'quiz-15-1-choice-4',
        quiz_id: 'quiz-15-1',
        choice_text: 'かぜ',
        is_correct: false,
        explanation: '「かぜ」は「風」です。「雨」は「あめ」です。',
      },
    ],
  });

  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-15-2',
      story_id: '15',
      question_text: '雨の日に使うものは何ですか？',
      question_type: '読解',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: '天気と洋服',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-15-2-choice-1',
        quiz_id: 'quiz-15-2',
        choice_text: '傘またはレインコート',
        is_correct: true,
        explanation: '雨の日は傘またはレインコートを使います。(Use an umbrella or raincoat on rainy days.)',
      },
      {
        choice_id: 'quiz-15-2-choice-2',
        quiz_id: 'quiz-15-2',
        choice_text: 'サングラス',
        is_correct: false,
        explanation: 'サングラスは晴れの日に使います。',
      },
      {
        choice_id: 'quiz-15-2-choice-3',
        quiz_id: 'quiz-15-2',
        choice_text: '帽子',
        is_correct: false,
        explanation: '帽子は晴れの日に使うことが多いです。',
      },
      {
        choice_id: 'quiz-15-2-choice-4',
        quiz_id: 'quiz-15-2',
        choice_text: '手袋',
        is_correct: false,
        explanation: '手袋は寒い日に使います。',
      },
    ],
  });

  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-15-3',
      story_id: '15',
      question_text: '「着る」はどういう意味ですか？',
      question_type: '文法',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: '天気と洋服',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-15-3-choice-1',
        quiz_id: 'quiz-15-3',
        choice_text: '服を身につける（to wear）',
        is_correct: true,
        explanation: '「着る」は服を身につけることです。(Kiru means to wear clothes.)',
      },
      {
        choice_id: 'quiz-15-3-choice-2',
        quiz_id: 'quiz-15-3',
        choice_text: '服を脱ぐ（to take off）',
        is_correct: false,
        explanation: '脱ぐは「ぬぐ」です。',
      },
      {
        choice_id: 'quiz-15-3-choice-3',
        quiz_id: 'quiz-15-3',
        choice_text: '服を買う（to buy）',
        is_correct: false,
        explanation: '買うは「かう」です。',
      },
      {
        choice_id: 'quiz-15-3-choice-4',
        quiz_id: 'quiz-15-3',
        choice_text: '服を洗う（to wash）',
        is_correct: false,
        explanation: '洗うは「あらう」です。',
      },
    ],
  });

  console.log('✅ Story 15 quizzes created');

  console.log('\n✅ All 5 new beginner stories added successfully!');
  console.log('Stories added: 11-15 (N5/A1 level)');
  console.log('Total chapters: 18');
  console.log('Total quizzes: 15');
}

main()
  .catch((e) => {
    console.error('Error adding stories:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
