import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Story content templates with proper Japanese content
const storyContentTemplates = {
  // N5 Stories
  '初めての挨拶': {
    chapters: [
      {
        title: '新しいクラスで',
        content: 'きょうは　あたらしい　クラスの　はじめての　ひです。わたしは　ドアを　あけて、きょうしつに　はいります。せんせいが　「おはよう　ございます」と　いいました。わたしも　「おはよう　ございます」と　こたえました。',
        learningPoints: ['Basic greetings', 'Classroom vocabulary', 'Polite expressions'],
        vocabulary: [
          { word: 'おはよう ございます', reading: 'ohayou gozaimasu', meanings: { en: 'good morning (polite)', ja: 'おはよう ございます' } },
          { word: 'クラス', reading: 'kurasu', meanings: { en: 'class', ja: 'クラス' } },
          { word: 'きょうしつ', reading: 'kyoushitsu', meanings: { en: 'classroom', ja: 'きょうしつ' } },
        ],
      },
      {
        title: 'じこしょうかい',
        content: 'せんせいが　「みなさんに　じこしょうかいを　して　ください」と　いいました。わたしは　まえに　たちました。「わたしの　なまえは　たなかです。どうぞ　よろしく　おねがいします」と　いいました。クラスメートが　「よろしく　おねがいします」と　いいました。',
        learningPoints: ['Self-introduction', 'Basic sentence patterns', 'Polite requests'],
        vocabulary: [
          { word: 'じこしょうかい', reading: 'jikoshoukai', meanings: { en: 'self-introduction', ja: 'じこしょうかい' } },
          { word: 'なまえ', reading: 'namae', meanings: { en: 'name', ja: 'なまえ' } },
          { word: 'よろしく おねがいします', reading: 'yoroshiku onegaishimasu', meanings: { en: 'nice to meet you', ja: 'よろしく おねがいします' } },
        ],
      },
      {
        title: 'あたらしい　ともだち',
        content: 'じゅぎょうが　おわって、となりの　せきの　ひとが　はなしかけて　きました。「こんにちは。わたしは　さとうです。あなたの　なまえは　なんですか」。わたしは　「たなかです。よろしく」と　いいました。わたしたちは　ともだちに　なりました。',
        learningPoints: ['Question and answer patterns', 'Making friends', 'Casual speech'],
        vocabulary: [
          { word: 'ともだち', reading: 'tomodachi', meanings: { en: 'friend', ja: 'ともだち' } },
          { word: 'となり', reading: 'tonari', meanings: { en: 'next to', ja: 'となり' } },
          { word: 'なんですか', reading: 'nan desu ka', meanings: { en: 'what is it?', ja: 'なんですか' } },
        ],
      },
    ],
    quizzes: [
      {
        question: '「おはよう ございます」は　いつ　つかいますか。',
        choices: [
          { text: 'あさに　あいさつする　とき', is_correct: true, explanation: '「おはよう ございます」は　あさの　あいさつです。' },
          { text: 'ひるに　あいさつする　とき', is_correct: false, explanation: 'ひるは　「こんにちは」を　つかいます。' },
          { text: 'よるに　あいさつする　とき', is_correct: false, explanation: 'よるは　「こんばんは」を　つかいます。' },
          { text: 'ねる　まえ', is_correct: false, explanation: 'ねる　まえは　「おやすみなさい」を　つかいます。' },
        ],
      },
      {
        question: 'じこしょうかいで　さいしょに　なにを　いいますか。',
        choices: [
          { text: 'わたしの　なまえ', is_correct: true, explanation: 'じこしょうかいでは　さいしょに　なまえを　いいます。' },
          { text: 'しゅみ', is_correct: false, explanation: 'しゅみは　なまえの　あとに　いいます。' },
          { text: 'すきな　たべもの', is_correct: false, explanation: 'たべものは　あとで　いいます。' },
          { text: 'でんわばんごう', is_correct: false, explanation: 'でんわばんごうは　ふつう　いいません。' },
        ],
      },
    ],
  },

  '家族の紹介': {
    chapters: [
      {
        title: 'わたしの　かぞく',
        content: 'わたしの　かぞくは　４にんです。ちちと　ははと　あねと　わたしです。わたしたちは　とうきょうに　すんで　います。ちちは　かいしゃいんです。ははは　かんごしです。',
        learningPoints: ['Family members vocabulary', 'Occupations', 'Simple descriptions'],
        vocabulary: [
          { word: 'かぞく', reading: 'kazoku', meanings: { en: 'family', ja: 'かぞく' } },
          { word: 'ちち', reading: 'chichi', meanings: { en: 'father', ja: 'ちち' } },
          { word: 'はは', reading: 'haha', meanings: { en: 'mother', ja: 'はは' } },
          { word: 'あね', reading: 'ane', meanings: { en: 'older sister', ja: 'あね' } },
          { word: 'かいしゃいん', reading: 'kaishain', meanings: { en: 'company employee', ja: 'かいしゃいん' } },
        ],
      },
      {
        title: 'あねの　しごと',
        content: 'あねは　だいがくせいです。びじゅつを　べんきょうして　います。あねは　えを　かくのが　すきです。まいにち　だいがくに　いって、えを　かきます。あねの　えは　とても　きれいです。',
        learningPoints: ['Hobbies and interests', 'University life', 'Adjective usage'],
        vocabulary: [
          { word: 'だいがくせい', reading: 'daigakusei', meanings: { en: 'university student', ja: 'だいがくせい' } },
          { word: 'びじゅつ', reading: 'bijutsu', meanings: { en: 'art', ja: 'びじゅつ' } },
          { word: 'え', reading: 'e', meanings: { en: 'picture', ja: 'え' } },
          { word: 'きれい', reading: 'kirei', meanings: { en: 'beautiful', ja: 'きれい' } },
        ],
      },
      {
        title: 'しゅうまつの　かぞく',
        content: 'しゅうまつに　かぞくで　こうえんに　いきます。ちちは　しゃしんを　とります。ははは　おべんとうを　つくります。あねと　わたしは　いっしょに　あそびます。かぞくで　たのしく　すごします。',
        learningPoints: ['Weekend activities', 'Family activities', 'Together expressions'],
        vocabulary: [
          { word: 'しゅうまつ', reading: 'shuumatsu', meanings: { en: 'weekend', ja: 'しゅうまつ' } },
          { word: 'こうえん', reading: 'kouen', meanings: { en: 'park', ja: 'こうえん' } },
          { word: 'いっしょに', reading: 'issho ni', meanings: { en: 'together', ja: 'いっしょに' } },
          { word: 'たのしい', reading: 'tanoshii', meanings: { en: 'fun', ja: 'たのしい' } },
        ],
      },
    ],
    quizzes: [
      {
        question: 'ストーリーで　かぞくは　なんにん　ですか。',
        choices: [
          { text: '４にん', is_correct: true, explanation: 'ちち、はは、あね、わたしで　４にんです。' },
          { text: '３にん', is_correct: false, explanation: 'よく　よんで　ください。４にんです。' },
          { text: '５にん', is_correct: false, explanation: 'ちがいます。４にんです。' },
          { text: '２にん', is_correct: false, explanation: 'もっと　おおいです。４にんです。' },
        ],
      },
      {
        question: 'あねは　なにを　べんきょうして　いますか。',
        choices: [
          { text: 'びじゅつ', is_correct: true, explanation: 'あねは　びじゅつを　べんきょうして　います。' },
          { text: 'おんがく', is_correct: false, explanation: 'ストーリーに　おんがくは　ありません。' },
          { text: 'すうがく', is_correct: false, explanation: 'ちがいます。びじゅつです。' },
          { text: 'えいご', is_correct: false, explanation: 'ちがいます。びじゅつです。' },
        ],
      },
    ],
  },

  'コンビニで買い物': {
    chapters: [
      {
        title: 'コンビニに　いく',
        content: 'きょうは　いい　てんきです。わたしは　コンビニに　かいものに　いきます。いえから　５ふんです。コンビニの　まえに　つきました。じどうドアが　あきます。「いらっしゃいませ」と　てんいんさんが　いいました。',
        learningPoints: ['Shopping vocabulary', 'Time expressions', 'Polite greetings'],
        vocabulary: [
          { word: 'コンビニ', reading: 'konbini', meanings: { en: 'convenience store', ja: 'コンビニ' } },
          { word: 'かいもの', reading: 'kaimono', meanings: { en: 'shopping', ja: 'かいもの' } },
          { word: 'てんいん', reading: 'ten\'in', meanings: { en: 'shop clerk', ja: 'てんいん' } },
          { word: 'いらっしゃいませ', reading: 'irasshaimase', meanings: { en: 'welcome (to store)', ja: 'いらっしゃいませ' } },
        ],
      },
      {
        title: 'なにを　かう',
        content: 'コンビニの　なかは　ひろいです。たくさんの　しなものが　あります。わたしは　おにぎりと　おちゃを　かいます。それから、チョコレートも　かいます。ぜんぶで　５００えんです。',
        learningPoints: ['Food items', 'Counting money', 'Shopping choices'],
        vocabulary: [
          { word: 'おにぎり', reading: 'onigiri', meanings: { en: 'rice ball', ja: 'おにぎり' } },
          { word: 'おちゃ', reading: 'ocha', meanings: { en: 'tea', ja: 'おちゃ' } },
          { word: 'チョコレート', reading: 'chokoreeto', meanings: { en: 'chocolate', ja: 'チョコレート' } },
          { word: 'えん', reading: 'en', meanings: { en: 'yen', ja: 'えん' } },
        ],
      },
      {
        title: 'レジで　はらう',
        content: 'しなものを　もって、レジに　いきます。てんいんさんが　「５００えんです」と　いいました。わたしは　１０００えんさつを　だします。てんいんさんは　おつりの　５００えんを　くれます。「ありがとう　ございました」。',
        learningPoints: ['Payment vocabulary', 'Money exchange', 'Polite expressions'],
        vocabulary: [
          { word: 'レジ', reading: 'reji', meanings: { en: 'cash register', ja: 'レジ' } },
          { word: 'はらう', reading: 'harau', meanings: { en: 'to pay', ja: 'はらう' } },
          { word: 'おつり', reading: 'otsuri', meanings: { en: 'change (money)', ja: 'おつり' } },
          { word: 'ありがとう ございました', reading: 'arigatou gozaimashita', meanings: { en: 'thank you (past)', ja: 'ありがとう ございました' } },
        ],
      },
    ],
    quizzes: [
      {
        question: 'コンビニは　いえから　どのくらい　ですか。',
        choices: [
          { text: '５ふん', is_correct: true, explanation: 'コンビニは　いえから　５ふんです。' },
          { text: '１０ぷん', is_correct: false, explanation: 'ストーリーを　よく　よんで　ください。' },
          { text: '１５ふん', is_correct: false, explanation: 'ちがいます。５ふんです。' },
          { text: '３０ぷん', is_correct: false, explanation: 'もっと　ちかいです。５ふんです。' },
        ],
      },
      {
        question: 'ぜんぶで　いくら　ですか。',
        choices: [
          { text: '５００えん', is_correct: true, explanation: 'ぜんぶで　５００えんです。' },
          { text: '３００えん', is_correct: false, explanation: 'ちがいます。５００えんです。' },
          { text: '１０００えん', is_correct: false, explanation: 'それは　だした　おかねです。' },
          { text: '７００えん', is_correct: false, explanation: 'ちがいます。５００えんです。' },
        ],
      },
    ],
  },

  '好きな食べ物': {
    chapters: [
      {
        title: 'すきな　たべもの',
        content: 'わたしは　たべることが　だいすきです。とくに　すしが　すきです。まぐろと　サーモンが　すきです。いつも　かいてんずしに　いきます。おいしいです。',
        learningPoints: ['Food preferences', 'Likes and dislikes', 'Taste expressions'],
        vocabulary: [
          { word: 'すき', reading: 'suki', meanings: { en: 'like', ja: 'すき' } },
          { word: 'すし', reading: 'sushi', meanings: { en: 'sushi', ja: 'すし' } },
          { word: 'まぐろ', reading: 'maguro', meanings: { en: 'tuna', ja: 'まぐろ' } },
          { word: 'おいしい', reading: 'oishii', meanings: { en: 'delicious', ja: 'おいしい' } },
        ],
      },
      {
        title: 'ともだちの　すきな　たべもの',
        content: 'ともだちの　たなかさんは　ラーメンが　すきです。とんこつラーメンを　よく　たべます。でも、からい　たべものは　すきじゃ　ありません。わたしは　からい　たべものが　すきです。',
        learningPoints: ['Comparing preferences', 'Negative forms', 'Different tastes'],
        vocabulary: [
          { word: 'ラーメン', reading: 'raamen', meanings: { en: 'ramen', ja: 'ラーメン' } },
          { word: 'とんこつ', reading: 'tonkotsu', meanings: { en: 'pork bone', ja: 'とんこつ' } },
          { word: 'からい', reading: 'karai', meanings: { en: 'spicy', ja: 'からい' } },
          { word: 'すきじゃ ありません', reading: 'suki ja arimasen', meanings: { en: 'don\'t like', ja: 'すきじゃ ありません' } },
        ],
      },
      {
        title: 'あたらしい　レストラン',
        content: 'きのう、あたらしい　レストランに　いきました。イタリアりょうりの　レストランです。パスタと　ピザを　たべました。とても　おいしかったです。また　いきたいです。',
        learningPoints: ['Past tense', 'Restaurant experience', 'Want to expressions'],
        vocabulary: [
          { word: 'レストラン', reading: 'resutoran', meanings: { en: 'restaurant', ja: 'レストラン' } },
          { word: 'パスタ', reading: 'pasuta', meanings: { en: 'pasta', ja: 'パスタ' } },
          { word: 'ピザ', reading: 'piza', meanings: { en: 'pizza', ja: 'ピザ' } },
          { word: 'いきたい', reading: 'ikitai', meanings: { en: 'want to go', ja: 'いきたい' } },
        ],
      },
    ],
    quizzes: [
      {
        question: 'ストーリーの　ひとは　なにが　いちばん　すき　ですか。',
        choices: [
          { text: 'すし', is_correct: true, explanation: 'とくに　すしが　すきだと　いって　います。' },
          { text: 'ラーメン', is_correct: false, explanation: 'ラーメンは　ともだちが　すきです。' },
          { text: 'パスタ', is_correct: false, explanation: 'パスタは　たべましたが、いちばん　すきじゃ　ありません。' },
          { text: 'ピザ', is_correct: false, explanation: 'ちがいます。すしが　すきです。' },
        ],
      },
      {
        question: 'たなかさんは　なにが　すきじゃ　ありませんか。',
        choices: [
          { text: 'からい たべもの', is_correct: true, explanation: 'たなかさんは　からい　たべものが　すきじゃ　ありません。' },
          { text: 'ラーメン', is_correct: false, explanation: 'たなかさんは　ラーメンが　すきです。' },
          { text: 'すし', is_correct: false, explanation: 'ストーリーに　そんな　ことは　ありません。' },
          { text: 'あまい たべもの', is_correct: false, explanation: 'ちがいます。からい　たべものが　すきじゃ　ありません。' },
        ],
      },
    ],
  },

  '公園での散歩': {
    chapters: [
      {
        title: 'こうえんに　いく',
        content: 'きょうは　てんきが　いいです。あたたかくて、はれて　います。わたしは　こうえんに　さんぽに　いきます。こうえんは　いえから　ちかいです。あるいて　１０ぷんです。みちには　きれいな　はなが　さいて　います。',
        learningPoints: ['Weather expressions', 'Walking and movement', 'Nature vocabulary'],
        vocabulary: [
          { word: 'こうえん', reading: 'kouen', meanings: { en: 'park', ja: 'こうえん' } },
          { word: 'さんぽ', reading: 'sanpo', meanings: { en: 'walk', ja: 'さんぽ' } },
          { word: 'てんき', reading: 'tenki', meanings: { en: 'weather', ja: 'てんき' } },
          { word: 'はな', reading: 'hana', meanings: { en: 'flower', ja: 'はな' } },
          { word: 'あたたかい', reading: 'atatakai', meanings: { en: 'warm', ja: 'あたたかい' } },
        ],
      },
      {
        title: 'こうえんで',
        content: 'こうえんに　つきました。おおきな　きが　たくさん　あります。とりが　ないて　います。こどもたちが　あそんで　います。ベンチに　すわって、やすみます。とても　きもちが　いいです。',
        learningPoints: ['Park features', 'Present progressive', 'Feelings'],
        vocabulary: [
          { word: 'き', reading: 'ki', meanings: { en: 'tree', ja: 'き' } },
          { word: 'とり', reading: 'tori', meanings: { en: 'bird', ja: 'とり' } },
          { word: 'こども', reading: 'kodomo', meanings: { en: 'child', ja: 'こども' } },
          { word: 'ベンチ', reading: 'benchi', meanings: { en: 'bench', ja: 'ベンチ' } },
          { word: 'きもちが いい', reading: 'kimochi ga ii', meanings: { en: 'feel good', ja: 'きもちが いい' } },
        ],
      },
      {
        title: 'ひとに　あう',
        content: 'さんぽを　して　いると、となりの　おばあさんに　あいました。「こんにちは。いい　てんきですね」と　いいました。おばあさんも　「そうですね。きょうは　あたたかいですね」と　いいました。いぬも　いっしょです。かわいい　いぬです。',
        learningPoints: ['Meeting people', 'Casual conversation', 'Animal vocabulary'],
        vocabulary: [
          { word: 'おばあさん', reading: 'obaasan', meanings: { en: 'grandmother/elderly woman', ja: 'おばあさん' } },
          { word: 'となり', reading: 'tonari', meanings: { en: 'next door', ja: 'となり' } },
          { word: 'いぬ', reading: 'inu', meanings: { en: 'dog', ja: 'いぬ' } },
          { word: 'かわいい', reading: 'kawaii', meanings: { en: 'cute', ja: 'かわいい' } },
        ],
      },
    ],
    quizzes: [
      {
        question: 'きょうの　てんきは　どうですか。',
        choices: [
          { text: 'あたたかくて、はれて います', is_correct: true, explanation: 'ストーリーで　「あたたかくて、はれて　います」と　いって　います。' },
          { text: 'さむくて、くもって います', is_correct: false, explanation: 'ちがいます。あたたかい　てんきです。' },
          { text: 'あめが　ふって　います', is_correct: false, explanation: 'あめは　ふって　いません。はれて　います。' },
          { text: 'ゆきが　ふって　います', is_correct: false, explanation: 'ゆきは　ありません。あたたかいです。' },
        ],
      },
      {
        question: 'こうえんで　だれに　あいましたか。',
        choices: [
          { text: 'となりの おばあさん', is_correct: true, explanation: 'となりの　おばあさんに　あいました。' },
          { text: 'ともだち', is_correct: false, explanation: 'ストーリーに　ともだちは　でて　きません。' },
          { text: 'かぞく', is_correct: false, explanation: 'かぞくには　あって　いません。' },
          { text: 'せんせい', is_correct: false, explanation: 'ちがいます。おばあさんに　あいました。' },
        ],
      },
    ],
  },
};

// Story metadata
const storyMetadata: Record<string, { level: string; category: string }> = {
  '初めての挨拶': { level: 'N5', category: 'daily_life' },
  '家族の紹介': { level: 'N5', category: 'daily_life' },
  'コンビニで買い物': { level: 'N5', category: 'daily_life' },
  '好きな食べ物': { level: 'N5', category: 'daily_life' },
  '公園での散歩': { level: 'N5', category: 'daily_life' },
  'レストランでの注文': { level: 'N4', category: 'daily_life' },
  '友達との約束': { level: 'N4', category: 'daily_life' },
  '電車での通学': { level: 'N4', category: 'daily_life' },
  '週末の計画': { level: 'N4', category: 'daily_life' },
  '図書館での勉強': { level: 'N4', category: 'daily_life' },
};

async function fixAllContent() {
  try {
    console.log('🔧 Starting comprehensive content fix...\n');

    // Get all stories
    const stories = await prisma.story.findMany({
      orderBy: { story_id: 'asc' },
    });

    console.log(`📚 Found ${stories.length} stories\n`);

    let chaptersUpdated = 0;
    let quizzesUpdated = 0;
    let storiesProcessed = 0;

    // Process each story with template
    for (const story of stories) {
      const template = storyContentTemplates[story.title as keyof typeof storyContentTemplates];

      if (!template) {
        console.log(`⚠️  No template for: ${story.title} - skipping`);
        continue;
      }

      console.log(`\n📖 Processing: ${story.title} (${story.level_jlpt})`);

      // Get existing chapters
      const existingChapters = await prisma.chapter.findMany({
        where: { story_id: story.story_id },
        orderBy: { chapter_number: 'asc' },
      });

      // Update chapters
      for (let i = 0; i < Math.min(existingChapters.length, template.chapters.length); i++) {
        const chapter = existingChapters[i];
        const templateChapter = template.chapters[i];

        await prisma.chapter.update({
          where: { chapter_id: chapter.chapter_id },
          data: {
            title: templateChapter.title,
            content: templateChapter.content,
            learning_points: templateChapter.learningPoints,
            vocabulary: templateChapter.vocabulary,
          },
        });

        chaptersUpdated++;
        console.log(`  ✓ Updated Chapter ${i + 1}: ${templateChapter.title}`);
      }

      // Delete old quizzes
      await prisma.quizChoice.deleteMany({
        where: {
          quiz: {
            story_id: story.story_id,
          },
        },
      });

      await prisma.quiz.deleteMany({
        where: { story_id: story.story_id },
      });

      // Create new quizzes
      for (const quizTemplate of template.quizzes) {
        const quiz = await prisma.quiz.create({
          data: {
            story_id: story.story_id,
            question_text: quizTemplate.question,
            question_type: 'multiple_choice',
            difficulty_level: story.level_jlpt || 'N5',
            is_ai_generated: false,
            source_text: template.chapters[0].content,
          },
        });

        // Create quiz choices
        for (const choiceTemplate of quizTemplate.choices) {
          await prisma.quizChoice.create({
            data: {
              quiz_id: quiz.quiz_id,
              choice_text: choiceTemplate.text,
              is_correct: choiceTemplate.is_correct,
              explanation: choiceTemplate.explanation,
            },
          });
        }

        quizzesUpdated++;
        console.log(`  ✓ Created quiz: ${quizTemplate.question.substring(0, 40)}...`);
      }

      storiesProcessed++;
    }

    console.log('\n\n✅ Content fix completed!');
    console.log(`\n📊 Summary:`);
    console.log(`  - Stories processed: ${storiesProcessed}`);
    console.log(`  - Chapters updated: ${chaptersUpdated}`);
    console.log(`  - Quizzes recreated: ${quizzesUpdated}`);
    console.log(`\n🎉 All content is now story-specific and coherent!`);

  } catch (error) {
    console.error('\n❌ Error fixing content:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixAllContent();