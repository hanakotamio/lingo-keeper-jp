import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();
const uuidv4 = randomUUID;

// Complete Japanese story content
const japaneseStories = [
  {
    title: '初めての挨拶',
    level_jlpt: 'N5',
    level_cefr: 'A1',
    category: 'daily_life',
    description: 'Learn basic greetings and self-introduction in a classroom setting',
    estimated_duration_minutes: 15,
    chapters: [
      {
        chapter_number: 1,
        title: '新しいクラスで',
        content: 'きょうは　あたらしい　クラスの　はじめての　ひです。わたしは　ドアを　あけて、きょうしつに　はいります。せんせいが　「おはよう　ございます」と　いいました。わたしも　「おはよう　ございます」と　こたえました。きょうしつには　たくさんの　がくせいが　います。みんな　しんせつそうです。',
        learningPoints: ['Basic greetings', 'Classroom vocabulary', 'Polite expressions'],
        vocabulary: [
          { word: 'おはよう ございます', reading: 'ohayou gozaimasu', meanings: { en: 'good morning (polite)', ja: 'おはよう ございます' } },
          { word: 'クラス', reading: 'kurasu', meanings: { en: 'class', ja: 'クラス' } },
          { word: 'きょうしつ', reading: 'kyoushitsu', meanings: { en: 'classroom', ja: 'きょうしつ' } },
          { word: 'がくせい', reading: 'gakusei', meanings: { en: 'student', ja: 'がくせい' } },
        ],
        choices: [
          { choice_text: 'じこしょうかいを　する', ending_type: 'continue' },
          { choice_text: 'せきに　すわる', ending_type: 'continue' },
        ],
      },
      {
        chapter_number: 2,
        title: 'じこしょうかい',
        content: 'せんせいが　「みなさんに　じこしょうかいを　して　ください」と　いいました。わたしは　まえに　たちました。「わたしの　なまえは　たなかです。１９さいです。にほんごの　べんきょうが　すきです。どうぞ　よろしく　おねがいします」と　いいました。クラスメートが　「よろしく　おねがいします」と　いいました。',
        learningPoints: ['Self-introduction', 'Basic sentence patterns', 'Polite requests'],
        vocabulary: [
          { word: 'じこしょうかい', reading: 'jikoshoukai', meanings: { en: 'self-introduction', ja: 'じこしょうかい' } },
          { word: 'なまえ', reading: 'namae', meanings: { en: 'name', ja: 'なまえ' } },
          { word: 'よろしく おねがいします', reading: 'yoroshiku onegaishimasu', meanings: { en: 'nice to meet you', ja: 'よろしく おねがいします' } },
        ],
        choices: [
          { choice_text: 'ともだちと　はなす', ending_type: 'continue' },
          { choice_text: 'じゅぎょうを　はじめる', ending_type: 'ending' },
        ],
      },
      {
        chapter_number: 3,
        title: 'あたらしい　ともだち',
        content: 'じゅぎょうが　おわって、となりの　せきの　ひとが　はなしかけて　きました。「こんにちは。わたしは　さとうです。あなたの　なまえは　なんですか」。わたしは　「たなかです。よろしく」と　いいました。さとうさんは　「にほんごは　むずかしいですが、いっしょに　がんばりましょう」と　いいました。わたしたちは　ともだちに　なりました。',
        learningPoints: ['Question and answer patterns', 'Making friends', 'Casual speech'],
        vocabulary: [
          { word: 'ともだち', reading: 'tomodachi', meanings: { en: 'friend', ja: 'ともだち' } },
          { word: 'となり', reading: 'tonari', meanings: { en: 'next to', ja: 'となり' } },
          { word: 'がんばる', reading: 'ganbaru', meanings: { en: 'to do one\'s best', ja: 'がんばる' } },
        ],
        choices: [],
      },
    ],
    quizzes: [
      {
        question_text: '「おはよう ございます」は　いつ　つかいますか。',
        question_type: 'multiple_choice',
        difficulty: 'N5',
        options: {
          choices: [
            { id: 1, text: 'あさに　あいさつする　とき', is_correct: true },
            { id: 2, text: 'ひるに　あいさつする　とき', is_correct: false },
            { id: 3, text: 'よるに　あいさつする　とき', is_correct: false },
            { id: 4, text: 'ねる　まえ', is_correct: false },
          ]
        },
        correct_answer: '1',
        explanation: '「おはよう ございます」は　あさの　あいさつです。ひるは　「こんにちは」、よるは　「こんばんは」を　つかいます。',
      },
      {
        question_text: 'じこしょうかいで　さいしょに　なにを　いいますか。',
        question_type: 'multiple_choice',
        difficulty: 'N5',
        options: {
          choices: [
            { id: 1, text: 'わたしの　なまえ', is_correct: true },
            { id: 2, text: 'しゅみ', is_correct: false },
            { id: 3, text: 'すきな　たべもの', is_correct: false },
            { id: 4, text: 'でんわばんごう', is_correct: false },
          ]
        },
        correct_answer: '1',
        explanation: 'じこしょうかいでは　さいしょに　なまえを　いいます。そのあとで　ねんれいや　しゅみなどを　いいます。',
      },
      {
        question_text: 'ストーリーで　わたしは　だれと　ともだちに　なりましたか。',
        question_type: 'multiple_choice',
        difficulty: 'N5',
        options: {
          choices: [
            { id: 1, text: 'さとうさん', is_correct: true },
            { id: 2, text: 'せんせい', is_correct: false },
            { id: 3, text: 'やまださん', is_correct: false },
            { id: 4, text: 'すずきさん', is_correct: false },
          ]
        },
        correct_answer: '1',
        explanation: 'ストーリーで　わたしは　となりの　さとうさんと　ともだちに　なりました。',
      },
    ],
  },
  {
    title: '家族の紹介',
    level_jlpt: 'N5',
    level_cefr: 'A1',
    category: 'daily_life',
    description: 'Learn how to talk about family members and their occupations',
    estimated_duration_minutes: 15,
    chapters: [
      {
        chapter_number: 1,
        title: 'わたしの　かぞく',
        content: 'わたしの　かぞくは　４にんです。ちちと　ははと　あねと　わたしです。わたしたちは　とうきょうに　すんで　います。ちちは　かいしゃいんです。まいにち　でんしゃで　かいしゃに　いきます。ははは　かんごしです。びょういんで　はたらいて　います。あねは　だいがくせいです。',
        learningPoints: ['Family members vocabulary', 'Occupations', 'Simple descriptions'],
        vocabulary: [
          { word: 'かぞく', reading: 'kazoku', meanings: { en: 'family', ja: 'かぞく' } },
          { word: 'ちち', reading: 'chichi', meanings: { en: 'father', ja: 'ちち' } },
          { word: 'はは', reading: 'haha', meanings: { en: 'mother', ja: 'はは' } },
          { word: 'あね', reading: 'ane', meanings: { en: 'older sister', ja: 'あね' } },
          { word: 'かいしゃいん', reading: 'kaishain', meanings: { en: 'company employee', ja: 'かいしゃいん' } },
          { word: 'かんごし', reading: 'kangoshi', meanings: { en: 'nurse', ja: 'かんごし' } },
        ],
        choices: [
          { choice_text: 'あねの　はなしを　する', ending_type: 'continue' },
          { choice_text: 'かぞくの　しゃしんを　みせる', ending_type: 'continue' },
        ],
      },
      {
        chapter_number: 2,
        title: 'あねの　しごと',
        content: 'あねは　だいがくせいです。びじゅつを　べんきょうして　います。あねは　えを　かくのが　すきです。まいにち　だいがくに　いって、えを　かきます。あねの　えは　とても　きれいです。あねは　しょうらい　がかに　なりたいと　いって　います。わたしも　あねの　えが　すきです。',
        learningPoints: ['Hobbies and interests', 'University life', 'Adjective usage', 'Future dreams'],
        vocabulary: [
          { word: 'だいがくせい', reading: 'daigakusei', meanings: { en: 'university student', ja: 'だいがくせい' } },
          { word: 'びじゅつ', reading: 'bijutsu', meanings: { en: 'art', ja: 'びじゅつ' } },
          { word: 'え', reading: 'e', meanings: { en: 'picture', ja: 'え' } },
          { word: 'きれい', reading: 'kirei', meanings: { en: 'beautiful', ja: 'きれい' } },
          { word: 'がか', reading: 'gaka', meanings: { en: 'painter', ja: 'がか' } },
        ],
        choices: [
          { choice_text: 'しゅうまつの　はなしを　する', ending_type: 'continue' },
          { choice_text: 'あねの　えを　みる', ending_type: 'ending' },
        ],
      },
      {
        chapter_number: 3,
        title: 'しゅうまつの　かぞく',
        content: 'しゅうまつに　かぞくで　こうえんに　いきます。ちちは　しゃしんを　とります。ちちは　しゃしんが　しゅみです。ははは　おべんとうを　つくります。ははの　りょうりは　とても　おいしいです。あねと　わたしは　いっしょに　あそびます。かぞくで　たのしく　すごします。しゅうまつが　すきです。',
        learningPoints: ['Weekend activities', 'Family activities', 'Together expressions'],
        vocabulary: [
          { word: 'しゅうまつ', reading: 'shuumatsu', meanings: { en: 'weekend', ja: 'しゅうまつ' } },
          { word: 'こうえん', reading: 'kouen', meanings: { en: 'park', ja: 'こうえん' } },
          { word: 'いっしょに', reading: 'issho ni', meanings: { en: 'together', ja: 'いっしょに' } },
          { word: 'たのしい', reading: 'tanoshii', meanings: { en: 'fun', ja: 'たのしい' } },
          { word: 'しゅみ', reading: 'shumi', meanings: { en: 'hobby', ja: 'しゅみ' } },
        ],
        choices: [],
      },
    ],
    quizzes: [
      {
        question_text: 'ストーリーで　かぞくは　なんにん　ですか。',
        question_type: 'multiple_choice',
        difficulty: 'N5',
        options: {
          choices: [
            { id: 1, text: '４にん', is_correct: true },
            { id: 2, text: '３にん', is_correct: false },
            { id: 3, text: '５にん', is_correct: false },
            { id: 4, text: '２にん', is_correct: false },
          ]
        },
        correct_answer: '1',
        explanation: 'ちち、はは、あね、わたしで　４にんです。',
      },
      {
        question_text: 'あねは　なにを　べんきょうして　いますか。',
        question_type: 'multiple_choice',
        difficulty: 'N5',
        options: {
          choices: [
            { id: 1, text: 'びじゅつ', is_correct: true },
            { id: 2, text: 'おんがく', is_correct: false },
            { id: 3, text: 'すうがく', is_correct: false },
            { id: 4, text: 'えいご', is_correct: false },
          ]
        },
        correct_answer: '1',
        explanation: 'あねは　だいがくで　びじゅつを　べんきょうして　います。えを　かくのが　すきです。',
      },
      {
        question_text: 'ははの　しごとは　なんですか。',
        question_type: 'multiple_choice',
        difficulty: 'N5',
        options: {
          choices: [
            { id: 1, text: 'かんごし', is_correct: true },
            { id: 2, text: 'せんせい', is_correct: false },
            { id: 3, text: 'かいしゃいん', is_correct: false },
            { id: 4, text: 'がか', is_correct: false },
          ]
        },
        correct_answer: '1',
        explanation: 'ははは　かんごしです。びょういんで　はたらいて　います。',
      },
    ],
  },
  {
    title: 'コンビニで買い物',
    level_jlpt: 'N5',
    level_cefr: 'A1',
    category: 'daily_life',
    description: 'Learn shopping vocabulary and how to buy things at a convenience store',
    estimated_duration_minutes: 15,
    chapters: [
      {
        chapter_number: 1,
        title: 'コンビニに　いく',
        content: 'きょうは　いい　てんきです。わたしは　コンビニに　かいものに　いきます。コンビニは　いえから　５ふんです。あるいて　いきます。コンビニの　まえに　つきました。じどうドアが　あきます。「いらっしゃいませ」と　てんいんさんが　いいました。コンビニの　なかは　すずしいです。',
        learningPoints: ['Shopping vocabulary', 'Time expressions', 'Polite greetings', 'Store vocabulary'],
        vocabulary: [
          { word: 'コンビニ', reading: 'konbini', meanings: { en: 'convenience store', ja: 'コンビニ' } },
          { word: 'かいもの', reading: 'kaimono', meanings: { en: 'shopping', ja: 'かいもの' } },
          { word: 'てんいん', reading: 'ten\'in', meanings: { en: 'shop clerk', ja: 'てんいん' } },
          { word: 'いらっしゃいませ', reading: 'irasshaimase', meanings: { en: 'welcome (to store)', ja: 'いらっしゃいませ' } },
        ],
        choices: [
          { choice_text: 'おにぎりを　さがす', ending_type: 'continue' },
          { choice_text: 'のみものを　みる', ending_type: 'continue' },
        ],
      },
      {
        chapter_number: 2,
        title: 'なにを　かう',
        content: 'コンビニの　なかは　ひろいです。たくさんの　しなものが　あります。わたしは　おにぎりと　おちゃを　かいます。おにぎりは　１２０えんです。おちゃは　１３０えんです。それから、チョコレートも　かいます。チョコレートは　２５０えんです。ぜんぶで　５００えんです。',
        learningPoints: ['Food items', 'Counting money', 'Shopping choices', 'Addition'],
        vocabulary: [
          { word: 'おにぎり', reading: 'onigiri', meanings: { en: 'rice ball', ja: 'おにぎり' } },
          { word: 'おちゃ', reading: 'ocha', meanings: { en: 'tea', ja: 'おちゃ' } },
          { word: 'チョコレート', reading: 'chokoreeto', meanings: { en: 'chocolate', ja: 'チョコレート' } },
          { word: 'えん', reading: 'en', meanings: { en: 'yen', ja: 'えん' } },
        ],
        choices: [
          { choice_text: 'レジに　いく', ending_type: 'continue' },
          { choice_text: 'もっと　みる', ending_type: 'ending' },
        ],
      },
      {
        chapter_number: 3,
        title: 'レジで　はらう',
        content: 'しなものを　もって、レジに　いきます。てんいんさんが　「５００えんです」と　いいました。わたしは　１０００えんさつを　だします。てんいんさんは　おつりの　５００えんを　くれます。「ありがとう　ございました」と　てんいんさんが　いいました。わたしは　「ありがとう　ございます」と　いいました。コンビニを　でます。',
        learningPoints: ['Payment vocabulary', 'Money exchange', 'Polite expressions', 'Gratitude'],
        vocabulary: [
          { word: 'レジ', reading: 'reji', meanings: { en: 'cash register', ja: 'レジ' } },
          { word: 'はらう', reading: 'harau', meanings: { en: 'to pay', ja: 'はらう' } },
          { word: 'おつり', reading: 'otsuri', meanings: { en: 'change (money)', ja: 'おつり' } },
          { word: 'ありがとう ございました', reading: 'arigatou gozaimashita', meanings: { en: 'thank you (past)', ja: 'ありがとう ございました' } },
        ],
        choices: [],
      },
    ],
    quizzes: [
      {
        question_text: 'コンビニは　いえから　どのくらい　ですか。',
        question_type: 'multiple_choice',
        difficulty: 'N5',
        options: {
          choices: [
            { id: 1, text: '５ふん', is_correct: true },
            { id: 2, text: '１０ぷん', is_correct: false },
            { id: 3, text: '１５ふん', is_correct: false },
            { id: 4, text: '３０ぷん', is_correct: false },
          ]
        },
        correct_answer: '1',
        explanation: 'コンビニは　いえから　あるいて　５ふんです。',
      },
      {
        question_text: 'おにぎりと　おちゃで　いくら　ですか。',
        question_type: 'multiple_choice',
        difficulty: 'N5',
        options: {
          choices: [
            { id: 1, text: '２５０えん', is_correct: true },
            { id: 2, text: '５００えん', is_correct: false },
            { id: 3, text: '１２０えん', is_correct: false },
            { id: 4, text: '１３０えん', is_correct: false },
          ]
        },
        correct_answer: '1',
        explanation: 'おにぎりは　１２０えん、おちゃは　１３０えんで、あわせて　２５０えんです。',
      },
      {
        question_text: 'おつりは　いくら　でしたか。',
        question_type: 'multiple_choice',
        difficulty: 'N5',
        options: {
          choices: [
            { id: 1, text: '５００えん', is_correct: true },
            { id: 2, text: '１０００えん', is_correct: false },
            { id: 3, text: '２５０えん', is_correct: false },
            { id: 4, text: '１５００えん', is_correct: false },
          ]
        },
        correct_answer: '1',
        explanation: '１０００えん　はらって、５００えんの　しなものを　かったので、おつりは　５００えんです。',
      },
    ],
  },
];

async function rebuildWithJapanese() {
  try {
    console.log('🔧 Starting database rebuild with Japanese content...\n');

    // Step 1: Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.$executeRaw`DELETE FROM quiz_questions`;
    await prisma.$executeRaw`DELETE FROM quiz_answers`;
    await prisma.$executeRaw`DELETE FROM choices`;
    await prisma.$executeRaw`DELETE FROM chapters`;
    await prisma.$executeRaw`DELETE FROM stories`;
    console.log('✓ Existing data cleared\n');

    // Step 2: Insert Japanese stories with chapters and quizzes
    let totalStories = 0;
    let totalChapters = 0;
    let totalQuizzes = 0;

    for (const storyData of japaneseStories) {
      console.log(`📖 Creating story: ${storyData.title}`);

      // Create story
      const story = await prisma.$executeRaw`
        INSERT INTO stories (
          story_id, title, description, category, difficulty_level,
          level_jlpt, level_cefr, estimated_duration_minutes, is_active, root_chapter_id
        ) VALUES (
          ${uuidv4()}, ${storyData.title}, ${storyData.description}, ${storyData.category},
          ${storyData.level_jlpt}, ${storyData.level_jlpt}, ${storyData.level_cefr},
          ${storyData.estimated_duration_minutes}, true, NULL
        ) RETURNING story_id
      `;

      // Get the story_id
      const storyResult: any = await prisma.$queryRaw`
        SELECT story_id FROM stories WHERE title = ${storyData.title}
      `;
      const storyId = storyResult[0].story_id;
      totalStories++;

      let previousChapterId: string | null = null;

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
        for (let i = 0; i < chapterData.choices.length; i++) {
          const choiceData = chapterData.choices[i];
          const choiceId = uuidv4();
          const nextChapterId = i < storyData.chapters.length - 1 ? uuidv4() : null; // Will be updated later

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

        previousChapterId = chapterId;
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

    console.log('\n🎉 Database rebuild completed!');
    console.log(`\n📊 Summary:`);
    console.log(`  - Japanese stories created: ${totalStories}`);
    console.log(`  - Total chapters: ${totalChapters}`);
    console.log(`  - Total quizzes: ${totalQuizzes}`);
    console.log(`\n✅ All content is now in Japanese with story-specific themes!`);

  } catch (error) {
    console.error('\n❌ Error rebuilding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the rebuild
rebuildWithJapanese();
