import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();
const uuidv4 = randomUUID;

// Additional N5 stories
const additionalStories = [
  {
    title: '好きな食べ物',
    level_jlpt: 'N5',
    level_cefr: 'A1',
    category: 'daily_life',
    description: 'Talk about your favorite foods and restaurants',
    estimated_duration_minutes: 15,
    chapters: [
      {
        chapter_number: 1,
        title: 'すきな　たべもの',
        content: 'わたしは　たべることが　だいすきです。とくに　すしが　すきです。まぐろと　サーモンが　すきです。いつも　かいてんずしに　いきます。１さら　１００えんです。やすくて　おいしいです。まいしゅう　すしを　たべます。',
        learningPoints: ['Food preferences', 'Likes and dislikes', 'Taste expressions', 'Frequency'],
        vocabulary: [
          { word: 'すき', reading: 'suki', meanings: { en: 'like', ja: 'すき' } },
          { word: 'すし', reading: 'sushi', meanings: { en: 'sushi', ja: 'すし' } },
          { word: 'まぐろ', reading: 'maguro', meanings: { en: 'tuna', ja: 'まぐろ' } },
          { word: 'おいしい', reading: 'oishii', meanings: { en: 'delicious', ja: 'おいしい' } },
          { word: 'やすい', reading: 'yasui', meanings: { en: 'cheap', ja: 'やすい' } },
        ],
        choices: [
          { choice_text: 'ともだちの　すきな　たべものを　きく', ending_type: 'continue' },
          { choice_text: 'レストランに　いく', ending_type: 'continue' },
        ],
      },
      {
        chapter_number: 2,
        title: 'ともだちの　すきな　たべもの',
        content: 'ともだちの　たなかさんは　ラーメンが　すきです。とんこつラーメンを　よく　たべます。たなかさんは　まいにち　ラーメンを　たべます。でも、からい　たべものは　すきじゃ　ありません。わたしは　からい　たべものが　すきです。みそラーメンも　すきです。',
        learningPoints: ['Comparing preferences', 'Negative forms', 'Different tastes', 'Frequency adverbs'],
        vocabulary: [
          { word: 'ラーメン', reading: 'raamen', meanings: { en: 'ramen', ja: 'ラーメン' } },
          { word: 'とんこつ', reading: 'tonkotsu', meanings: { en: 'pork bone', ja: 'とんこつ' } },
          { word: 'からい', reading: 'karai', meanings: { en: 'spicy', ja: 'からい' } },
          { word: 'すきじゃ ありません', reading: 'suki ja arimasen', meanings: { en: 'don\'t like', ja: 'すきじゃ ありません' } },
        ],
        choices: [
          { choice_text: 'あたらしい　レストランに　いく', ending_type: 'continue' },
          { choice_text: 'いえで　たべる', ending_type: 'ending' },
        ],
      },
      {
        chapter_number: 3,
        title: 'あたらしい　レストラン',
        content: 'きのう、あたらしい　レストランに　いきました。イタリアりょうりの　レストランです。パスタと　ピザを　たべました。とても　おいしかったです。ワインも　のみました。レストランの　ふんいきも　よかったです。また　いきたいです。ともだちも　つれて　いきたいです。',
        learningPoints: ['Past tense', 'Restaurant experience', 'Want to expressions', 'Atmosphere descriptions'],
        vocabulary: [
          { word: 'レストラン', reading: 'resutoran', meanings: { en: 'restaurant', ja: 'レストラン' } },
          { word: 'パスタ', reading: 'pasuta', meanings: { en: 'pasta', ja: 'パスタ' } },
          { word: 'ピザ', reading: 'piza', meanings: { en: 'pizza', ja: 'ピザ' } },
          { word: 'いきたい', reading: 'ikitai', meanings: { en: 'want to go', ja: 'いきたい' } },
          { word: 'ふんいき', reading: 'fun\'iki', meanings: { en: 'atmosphere', ja: 'ふんいき' } },
        ],
        choices: [],
      },
    ],
    quizzes: [
      {
        question_text: 'ストーリーの　ひとは　なにが　いちばん　すき　ですか。',
        question_type: 'multiple_choice',
        difficulty: 'N5',
        options: {
          choices: [
            { id: 1, text: 'すし', is_correct: true },
            { id: 2, text: 'ラーメン', is_correct: false },
            { id: 3, text: 'パスタ', is_correct: false },
            { id: 4, text: 'ピザ', is_correct: false },
          ]
        },
        correct_answer: '1',
        explanation: 'とくに　すしが　すきだと　いって　います。',
      },
      {
        question_text: 'たなかさんは　なにが　すきじゃ　ありませんか。',
        question_type: 'multiple_choice',
        difficulty: 'N5',
        options: {
          choices: [
            { id: 1, text: 'からい たべもの', is_correct: true },
            { id: 2, text: 'ラーメン', is_correct: false },
            { id: 3, text: 'すし', is_correct: false },
            { id: 4, text: 'あまい たべもの', is_correct: false },
          ]
        },
        correct_answer: '1',
        explanation: 'たなかさんは　からい　たべものが　すきじゃ　ありません。',
      },
      {
        question_text: 'いつ　あたらしい　レストランに　いきましたか。',
        question_type: 'multiple_choice',
        difficulty: 'N5',
        options: {
          choices: [
            { id: 1, text: 'きのう', is_correct: true },
            { id: 2, text: 'きょう', is_correct: false },
            { id: 3, text: 'あした', is_correct: false },
            { id: 4, text: 'せんしゅう', is_correct: false },
          ]
        },
        correct_answer: '1',
        explanation: 'ストーリーで　「きのう」と　いって　います。',
      },
    ],
  },
  {
    title: '公園での散歩',
    level_jlpt: 'N5',
    level_cefr: 'A1',
    category: 'daily_life',
    description: 'Learn about walking in the park and nature vocabulary',
    estimated_duration_minutes: 15,
    chapters: [
      {
        chapter_number: 1,
        title: 'こうえんに　いく',
        content: 'きょうは　てんきが　いいです。あたたかくて、はれて　います。わたしは　こうえんに　さんぽに　いきます。こうえんは　いえから　ちかいです。あるいて　１０ぷんです。みちには　きれいな　はなが　さいて　います。さくらの　はなです。はるですね。',
        learningPoints: ['Weather expressions', 'Walking and movement', 'Nature vocabulary', 'Seasons'],
        vocabulary: [
          { word: 'こうえん', reading: 'kouen', meanings: { en: 'park', ja: 'こうえん' } },
          { word: 'さんぽ', reading: 'sanpo', meanings: { en: 'walk', ja: 'さんぽ' } },
          { word: 'てんき', reading: 'tenki', meanings: { en: 'weather', ja: 'てんき' } },
          { word: 'はな', reading: 'hana', meanings: { en: 'flower', ja: 'はな' } },
          { word: 'あたたかい', reading: 'atatakai', meanings: { en: 'warm', ja: 'あたたかい' } },
          { word: 'はる', reading: 'haru', meanings: { en: 'spring', ja: 'はる' } },
        ],
        choices: [
          { choice_text: 'はなを　みる', ending_type: 'continue' },
          { choice_text: 'こうえんで　やすむ', ending_type: 'continue' },
        ],
      },
      {
        chapter_number: 2,
        title: 'こうえんで',
        content: 'こうえんに　つきました。おおきな　きが　たくさん　あります。とりが　ないて　います。「ちゅんちゅん」と　ないて　います。こどもたちが　あそんで　います。ボールで　あそんで　います。ベンチに　すわって、やすみます。かぜが　きもちいいです。とても　へいわです。',
        learningPoints: ['Park features', 'Present progressive', 'Feelings', 'Sounds'],
        vocabulary: [
          { word: 'き', reading: 'ki', meanings: { en: 'tree', ja: 'き' } },
          { word: 'とり', reading: 'tori', meanings: { en: 'bird', ja: 'とり' } },
          { word: 'こども', reading: 'kodomo', meanings: { en: 'child', ja: 'こども' } },
          { word: 'ベンチ', reading: 'benchi', meanings: { en: 'bench', ja: 'ベンチ' } },
          { word: 'きもちが いい', reading: 'kimochi ga ii', meanings: { en: 'feel good', ja: 'きもちが いい' } },
          { word: 'へいわ', reading: 'heiwa', meanings: { en: 'peaceful', ja: 'へいわ' } },
        ],
        choices: [
          { choice_text: 'さんぽを　つづける', ending_type: 'continue' },
          { choice_text: 'ベンチで　ほんを　よむ', ending_type: 'ending' },
        ],
      },
      {
        chapter_number: 3,
        title: 'ひとに　あう',
        content: 'さんぽを　して　いると、となりの　おばあさんに　あいました。「こんにちは。いい　てんきですね」と　いいました。おばあさんも　「そうですね。きょうは　あたたかいですね」と　いいました。おばあさんは　いぬと　いっしょです。ちいさくて　かわいい　いぬです。わたしは　いぬが　すきです。いぬを　なでました。',
        learningPoints: ['Meeting people', 'Casual conversation', 'Animal vocabulary', 'Adjectives'],
        vocabulary: [
          { word: 'おばあさん', reading: 'obaasan', meanings: { en: 'grandmother/elderly woman', ja: 'おばあさん' } },
          { word: 'となり', reading: 'tonari', meanings: { en: 'next door', ja: 'となり' } },
          { word: 'いぬ', reading: 'inu', meanings: { en: 'dog', ja: 'いぬ' } },
          { word: 'かわいい', reading: 'kawaii', meanings: { en: 'cute', ja: 'かわいい' } },
          { word: 'なでる', reading: 'naderu', meanings: { en: 'to pet', ja: 'なでる' } },
        ],
        choices: [],
      },
    ],
    quizzes: [
      {
        question_text: 'きょうの　てんきは　どうですか。',
        question_type: 'multiple_choice',
        difficulty: 'N5',
        options: {
          choices: [
            { id: 1, text: 'あたたかくて、はれて います', is_correct: true },
            { id: 2, text: 'さむくて、くもって います', is_correct: false },
            { id: 3, text: 'あめが　ふって　います', is_correct: false },
            { id: 4, text: 'ゆきが　ふって　います', is_correct: false },
          ]
        },
        correct_answer: '1',
        explanation: 'ストーリーで　「あたたかくて、はれて　います」と　いって　います。',
      },
      {
        question_text: 'こうえんで　だれに　あいましたか。',
        question_type: 'multiple_choice',
        difficulty: 'N5',
        options: {
          choices: [
            { id: 1, text: 'となりの おばあさん', is_correct: true },
            { id: 2, text: 'ともだち', is_correct: false },
            { id: 3, text: 'かぞく', is_correct: false },
            { id: 4, text: 'せんせい', is_correct: false },
          ]
        },
        correct_answer: '1',
        explanation: 'となりの　おばあさんに　あいました。',
      },
      {
        question_text: 'みちに　なにが　さいて　いましたか。',
        question_type: 'multiple_choice',
        difficulty: 'N5',
        options: {
          choices: [
            { id: 1, text: 'さくらの はな', is_correct: true },
            { id: 2, text: 'ばらの はな', is_correct: false },
            { id: 3, text: 'チューリップ', is_correct: false },
            { id: 4, text: 'ひまわり', is_correct: false },
          ]
        },
        correct_answer: '1',
        explanation: 'みちには　きれいな　さくらの　はなが　さいて　いました。',
      },
    ],
  },
  {
    title: 'レストランでの注文',
    level_jlpt: 'N4',
    level_cefr: 'A2',
    category: 'daily_life',
    description: 'Practice ordering food at a restaurant in Japanese',
    estimated_duration_minutes: 20,
    chapters: [
      {
        chapter_number: 1,
        title: 'レストランに　いく',
        content: 'きょうは　ともだちと　レストランに　いきます。イタリアりょうりの　レストランです。レストランは　えきの　ちかくに　あります。よやくを　しました。７じから　です。レストランに　つくと、ウェイターが　「いらっしゃいませ。よやくの　おなまえは？」と　ききました。わたしは　「たなかです」と　こたえました。',
        learningPoints: ['Restaurant vocabulary', 'Reservations', 'Polite service language', 'Time expressions'],
        vocabulary: [
          { word: 'よやく', reading: 'yoyaku', meanings: { en: 'reservation', ja: 'よやく' } },
          { word: 'ウェイター', reading: 'weitaa', meanings: { en: 'waiter', ja: 'ウェイター' } },
          { word: 'イタリアりょうり', reading: 'itariaryouri', meanings: { en: 'Italian food', ja: 'イタリアりょうり' } },
          { word: 'えき', reading: 'eki', meanings: { en: 'station', ja: 'えき' } },
        ],
        choices: [
          { choice_text: 'メニューを　みる', ending_type: 'continue' },
          { choice_text: 'せきに　つく', ending_type: 'continue' },
        ],
      },
      {
        chapter_number: 2,
        title: 'メニューを　えらぶ',
        content: 'せきに　すわって、メニューを　みます。いろいろな　りょうりが　あります。パスタ、ピザ、サラダ、スープ。どれも　おいしそうです。わたしは　カルボナーラを　ちゅうもんします。ともだちは　マルゲリータピザを　ちゅうもんします。のみものは　ワインに　します。ウェイターを　よびます。',
        learningPoints: ['Menu vocabulary', 'Food choices', 'Ordering expressions', 'Decision making'],
        vocabulary: [
          { word: 'メニュー', reading: 'menyuu', meanings: { en: 'menu', ja: 'メニュー' } },
          { word: 'ちゅうもん', reading: 'chuumon', meanings: { en: 'order', ja: 'ちゅうもん' } },
          { word: 'カルボナーラ', reading: 'karubonāra', meanings: { en: 'carbonara', ja: 'カルボナーラ' } },
          { word: 'ワイン', reading: 'wain', meanings: { en: 'wine', ja: 'ワイン' } },
        ],
        choices: [
          { choice_text: 'ちゅうもんを　つたえる', ending_type: 'continue' },
          { choice_text: 'もう　すこし　かんがえる', ending_type: 'ending' },
        ],
      },
      {
        chapter_number: 3,
        title: 'ちゅうもんする',
        content: 'ウェイターが　きました。「ごちゅうもんは？」と　ききました。わたしは　「カルボナーラを　ください」と　いいました。「かしこまりました。おのみものは？」「あかワインを　２つ　ください」。ウェイターは　「しょうしょう　おまち　ください」と　いって、キッチンに　いきました。りょうりが　くるのを　まちます。',
        learningPoints: ['Polite ordering', 'Quantity expressions', 'Service interactions', 'Patience expressions'],
        vocabulary: [
          { word: 'ごちゅうもん', reading: 'gochuumon', meanings: { en: 'order (polite)', ja: 'ごちゅうもん' } },
          { word: 'かしこまりました', reading: 'kashikomarimashita', meanings: { en: 'certainly/understood', ja: 'かしこまりました' } },
          { word: 'しょうしょう おまち ください', reading: 'shoushou omachi kudasai', meanings: { en: 'please wait a moment', ja: 'しょうしょう おまち ください' } },
          { word: 'キッチン', reading: 'kicchin', meanings: { en: 'kitchen', ja: 'キッチン' } },
        ],
        choices: [],
      },
    ],
    quizzes: [
      {
        question_text: 'レストランの　よやくは　なんじからですか。',
        question_type: 'multiple_choice',
        difficulty: 'N4',
        options: {
          choices: [
            { id: 1, text: '７じ', is_correct: true },
            { id: 2, text: '６じ', is_correct: false },
            { id: 3, text: '８じ', is_correct: false },
            { id: 4, text: '９じ', is_correct: false },
          ]
        },
        correct_answer: '1',
        explanation: 'よやくは　７じからです。',
      },
      {
        question_text: 'わたしは　なにを　ちゅうもんしましたか。',
        question_type: 'multiple_choice',
        difficulty: 'N4',
        options: {
          choices: [
            { id: 1, text: 'カルボナーラ', is_correct: true },
            { id: 2, text: 'マルゲリータピザ', is_correct: false },
            { id: 3, text: 'サラダ', is_correct: false },
            { id: 4, text: 'スープ', is_correct: false },
          ]
        },
        correct_answer: '1',
        explanation: 'わたしは　カルボナーラを　ちゅうもんしました。',
      },
      {
        question_text: 'のみものを　いくつ　ちゅうもんしましたか。',
        question_type: 'multiple_choice',
        difficulty: 'N4',
        options: {
          choices: [
            { id: 1, text: '２つ', is_correct: true },
            { id: 2, text: '１つ', is_correct: false },
            { id: 3, text: '３つ', is_correct: false },
            { id: 4, text: '４つ', is_correct: false },
          ]
        },
        correct_answer: '1',
        explanation: 'あかワインを　２つ　ちゅうもんしました。',
      },
    ],
  },
];

async function addRemainingStories() {
  try {
    console.log('🔧 Adding remaining Japanese stories...\n');

    let totalStories = 0;
    let totalChapters = 0;
    let totalQuizzes = 0;

    for (const storyData of additionalStories) {
      console.log(`📖 Creating story: ${storyData.title}`);

      // Create story
      await prisma.$executeRaw`
        INSERT INTO stories (
          story_id, title, description, category, difficulty_level,
          level_jlpt, level_cefr, estimated_duration_minutes, is_active, root_chapter_id
        ) VALUES (
          ${uuidv4()}, ${storyData.title}, ${storyData.description}, ${storyData.category},
          ${storyData.level_jlpt}, ${storyData.level_jlpt}, ${storyData.level_cefr},
          ${storyData.estimated_duration_minutes}, true, NULL
        )
      `;

      // Get the story_id
      const storyResult: any = await prisma.$queryRaw`
        SELECT story_id FROM stories WHERE title = ${storyData.title}
      `;
      const storyId = storyResult[0].story_id;
      totalStories++;

      // Create chapters
      for (const chapterData of storyData.chapters) {
        const chapterId = uuidv4();

        await prisma.$executeRaw`
          INSERT INTO chapters (
            chapter_id, story_id, chapter_number, title, content,
            learning_points, vocabulary, audio_url
          ) VALUES (
            ${chapterId}, ${storyId}, ${chapterData.chapter_number}, ${chapterData.title},
            ${chapterData.content}, ${JSON.stringify(chapterData.learningPoints)}::json,
            ${JSON.stringify(chapterData.vocabulary)}::json, NULL
          )
        `;

        console.log(`  ✓ Created Chapter ${chapterData.chapter_number}: ${chapterData.title}`);
        totalChapters++;

        // Create choices
        for (const choiceData of chapterData.choices) {
          const choiceId = uuidv4();

          await prisma.$executeRaw`
            INSERT INTO choices (
              choice_id, chapter_id, choice_text, next_chapter_id,
              difficulty_adjustment, ending_type
            ) VALUES (
              ${choiceId}, ${chapterId}, ${choiceData.choice_text},
              ${choiceData.ending_type === 'continue' ? 'placeholder' : null},
              0, ${choiceData.ending_type}
            )
          `;
        }
      }

      // Update root_chapter_id
      await prisma.$executeRaw`
        UPDATE stories
        SET root_chapter_id = (
          SELECT chapter_id FROM chapters
          WHERE story_id = ${storyId} AND chapter_number = 1
        )
        WHERE story_id = ${storyId}
      `;

      // Create quizzes
      for (const quizData of storyData.quizzes) {
        const quizId = uuidv4();

        // Get first chapter for this story
        const firstChapter: any = await prisma.$queryRaw`
          SELECT chapter_id FROM chapters
          WHERE story_id = ${storyId}
          ORDER BY chapter_number
          LIMIT 1
        `;

        await prisma.$executeRaw`
          INSERT INTO quiz_questions (
            question_id, chapter_id, question_text, question_type,
            options, correct_answer, explanation, difficulty
          ) VALUES (
            ${quizId}, ${firstChapter[0].chapter_id}, ${quizData.question_text},
            ${quizData.question_type}, ${JSON.stringify(quizData.options)}::json,
            ${quizData.correct_answer}, ${quizData.explanation}, ${quizData.difficulty}
          )
        `;

        console.log(`  ✓ Created quiz: ${quizData.question_text.substring(0, 40)}...`);
        totalQuizzes++;
      }

      console.log(`✅ Completed: ${storyData.title}\n`);
    }

    console.log('\n🎉 Additional stories added!');
    console.log(`\n📊 Summary:`);
    console.log(`  - New stories added: ${totalStories}`);
    console.log(`  - New chapters: ${totalChapters}`);
    console.log(`  - New quizzes: ${totalQuizzes}`);

    // Get total count
    const totalStoriesNow: any = await prisma.$queryRaw`SELECT COUNT(*) as cnt FROM stories`;
    const totalChaptersNow: any = await prisma.$queryRaw`SELECT COUNT(*) as cnt FROM chapters`;
    const totalQuizzesNow: any = await prisma.$queryRaw`SELECT COUNT(*) as cnt FROM quiz_questions`;

    console.log(`\n📚 Total in database:`);
    console.log(`  - Total stories: ${totalStoriesNow[0].cnt}`);
    console.log(`  - Total chapters: ${totalChaptersNow[0].cnt}`);
    console.log(`  - Total quizzes: ${totalQuizzesNow[0].cnt}`);

  } catch (error) {
    console.error('\n❌ Error adding stories:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addRemainingStories();
