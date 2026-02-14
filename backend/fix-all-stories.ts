import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface StoryContent {
  storyId: string;
  title: string;
  level: string;
  chapters: Array<{
    num: number;
    content: string;
    vocabulary: Record<string, string>;
  }>;
  quizzes: Array<{
    id: string;
    question: string;
    type: string;
    choices: Array<{
      text: string;
      correct: boolean;
      explanation: string;
    }>;
  }>;
}

// N5レベルのストーリーコンテンツ
const n5Stories: Record<string, Omit<StoryContent, 'storyId' | 'level'>> = {
  '初めての挨拶': {
    title: '初めての挨拶',
    chapters: [
      {
        num: 1,
        content: `きょうは　はじめての　にほんごの　クラスです。

わたしは　きんちょうして　います。でも、たのしみです。

せんせいが　きました。「おはよう　ございます」と　いいました。`,
        vocabulary: {
          "はじめて": "first time",
          "クラス": "class",
          "きんちょう": "nervous",
          "せんせい": "teacher",
          "おはよう": "good morning"
        }
      },
      {
        num: 2,
        content: `せんせいは　やさしいです。「なまえは　なんですか」と　ききました。

「わたしの　なまえは　アレックスです」と　こたえました。

せんせいは　「よろしく　おねがいします」と　いいました。`,
        vocabulary: {
          "なまえ": "name",
          "きく": "to ask",
          "こたえる": "to answer",
          "よろしく": "nice to meet you",
          "やさしい": "kind"
        }
      },
      {
        num: 3,
        content: `クラスメートも　います。となりの　ひとに　あいさつを　します。

「こんにちは。わたしは　アレックスです」

となりの　ひとは　「わたしは　エマです。よろしく」と　いいました。`,
        vocabulary: {
          "クラスメート": "classmate",
          "となり": "next to",
          "あいさつ": "greeting",
          "こんにちは": "hello",
          "よろしく": "nice to meet you"
        }
      },
      {
        num: 4,
        content: `クラスで　にほんごを　べんきょうします。

「ありがとう」「すみません」「さようなら」を　ならいました。

みんなで　れんしゅうします。たのしいです。`,
        vocabulary: {
          "べんきょう": "study",
          "ならう": "to learn",
          "れんしゅう": "practice",
          "みんな": "everyone",
          "たのしい": "fun"
        }
      },
      {
        num: 5,
        content: `クラスが　おわりました。

せんせいに　「ありがとう　ございました」と　いいました。

あした　また　きます。にほんごの　べんきょうは　おもしろいです。`,
        vocabulary: {
          "おわる": "to end",
          "ありがとう": "thank you",
          "あした": "tomorrow",
          "また": "again",
          "おもしろい": "interesting"
        }
      }
    ],
    quizzes: [
      {
        id: 'quiz-2-1',
        question: 'きょうは　なんの　クラスですか。',
        type: '読解',
        choices: [
          { text: 'にほんごの　クラス', correct: true, explanation: 'せいかいです。はじめての　にほんごの　クラスです。' },
          { text: 'えいごの　クラス', correct: false, explanation: 'ちがいます。にほんごの　クラスです。' },
          { text: 'すうがくの　クラス', correct: false, explanation: 'ちがいます。にほんごの　クラスです。' },
          { text: 'おんがくの　クラス', correct: false, explanation: 'ちがいます。にほんごの　クラスです。' }
        ]
      },
      {
        id: 'quiz-2-2',
        question: 'となりの　ひとの　なまえは　なんですか。',
        type: '読解',
        choices: [
          { text: 'エマ', correct: true, explanation: 'せいかいです。となりの　ひとは　エマです。' },
          { text: 'アレックス', correct: false, explanation: 'それは　しゅじんこうの　なまえです。' },
          { text: 'せんせい', correct: false, explanation: 'ちがいます。' },
          { text: 'ジョン', correct: false, explanation: 'ちがいます。' }
        ]
      },
      {
        id: 'quiz-2-3',
        question: '「よろしく　おねがいします」は　いつ　つかいますか。',
        type: '語彙',
        choices: [
          { text: 'はじめて　あうとき', correct: true, explanation: 'せいかいです。はじめて　あう　ときに　つかいます。' },
          { text: 'わかれる　とき', correct: false, explanation: 'わかれる　ときは　「さようなら」です。' },
          { text: 'たべる　とき', correct: false, explanation: 'たべる　ときは　「いただきます」です。' },
          { text: 'ねる　とき', correct: false, explanation: 'ねる　ときは　「おやすみ」です。' }
        ]
      },
      {
        id: 'quiz-2-4',
        question: 'クラスで　なにを　ならいましたか。',
        type: '読解',
        choices: [
          { text: 'あいさつの　ことば', correct: true, explanation: 'せいかいです。「ありがとう」「すみません」「さようなら」を　ならいました。' },
          { text: 'かんじ', correct: false, explanation: 'ちがいます。あいさつを　ならいました。' },
          { text: 'かず', correct: false, explanation: 'ちがいます。あいさつを　ならいました。' },
          { text: 'うた', correct: false, explanation: 'ちがいます。あいさつを　ならいました。' }
        ]
      },
      {
        id: 'quiz-2-5',
        question: 'しゅじんこうは　にほんごの　べんきょうを　どう　おもいますか。',
        type: '読解',
        choices: [
          { text: 'おもしろい', correct: true, explanation: 'せいかいです。「にほんごの　べんきょうは　おもしろいです」と　いいました。' },
          { text: 'むずかしい', correct: false, explanation: 'ちがいます。おもしろいと　おもっています。' },
          { text: 'つまらない', correct: false, explanation: 'ちがいます。おもしろいと　おもっています。' },
          { text: 'こわい', correct: false, explanation: 'ちがいます。おもしろいと　おもっています。' }
        ]
      }
    ]
  },
  '家族の紹介': {
    title: '家族の紹介',
    chapters: [
      {
        num: 1,
        content: `わたしの　かぞくを　しょうかいします。

かぞくは　４にんです。ちち、はは、あね、わたしです。

みんな　げんきです。`,
        vocabulary: {
          "かぞく": "family",
          "しょうかい": "introduction",
          "ちち": "father",
          "はは": "mother",
          "あね": "older sister"
        }
      },
      {
        num: 2,
        content: `ちちは　かいしゃいんです。まいにち　はたらきます。

やさしい　ちちです。しゅうまつは　いっしょに　あそびます。

ちちは　サッカーが　すきです。`,
        vocabulary: {
          "かいしゃいん": "company employee",
          "はたらく": "to work",
          "しゅうまつ": "weekend",
          "いっしょに": "together",
          "サッカー": "soccer"
        }
      },
      {
        num: 3,
        content: `ははは　せんせいです。がっこうで　おしえます。

りょうりが　じょうずです。まいにち　おいしい　ごはんを　つくります。

ははの　りょうりは　とても　おいしいです。`,
        vocabulary: {
          "せんせい": "teacher",
          "おしえる": "to teach",
          "りょうり": "cooking",
          "じょうず": "skillful",
          "つくる": "to make"
        }
      },
      {
        num: 4,
        content: `あねは　だいがくせいです。まいにち　べんきょうします。

おんがくが　すきです。ピアノを　ひきます。

とても　きれいな　おとです。`,
        vocabulary: {
          "だいがくせい": "university student",
          "おんがく": "music",
          "ピアノ": "piano",
          "ひく": "to play (instrument)",
          "おと": "sound"
        }
      },
      {
        num: 5,
        content: `わたしの　かぞくは　とても　なかよしです。

しゅうまつは　みんなで　でかけます。

わたしは　かぞくが　だいすきです。`,
        vocabulary: {
          "なかよし": "close/get along well",
          "でかける": "to go out",
          "だいすき": "love very much",
          "しゅうまつ": "weekend",
          "みんな": "everyone"
        }
      }
    ],
    quizzes: [
      {
        id: 'quiz-3-1',
        question: 'かぞくは　なんにんですか。',
        type: '読解',
        choices: [
          { text: '４にん', correct: true, explanation: 'せいかいです。かぞくは　４にんです。' },
          { text: '３にん', correct: false, explanation: 'ちがいます。４にんです。' },
          { text: '５にん', correct: false, explanation: 'ちがいます。４にんです。' },
          { text: '２にん', correct: false, explanation: 'ちがいます。４にんです。' }
        ]
      },
      {
        id: 'quiz-3-2',
        question: 'ちちの　しごとは　なんですか。',
        type: '読解',
        choices: [
          { text: 'かいしゃいん', correct: true, explanation: 'せいかいです。ちちは　かいしゃいんです。' },
          { text: 'せんせい', correct: false, explanation: 'それは　ははの　しごとです。' },
          { text: 'がくせい', correct: false, explanation: 'ちがいます。' },
          { text: 'いしゃ', correct: false, explanation: 'ちがいます。' }
        ]
      },
      {
        id: 'quiz-3-3',
        question: 'ははは　なにが　じょうずですか。',
        type: '読解',
        choices: [
          { text: 'りょうり', correct: true, explanation: 'せいかいです。ははは　りょうりが　じょうずです。' },
          { text: 'サッカー', correct: false, explanation: 'サッカーは　ちちが　すきです。' },
          { text: 'ピアノ', correct: false, explanation: 'ピアノは　あねが　ひきます。' },
          { text: 'うた', correct: false, explanation: 'ちがいます。' }
        ]
      },
      {
        id: 'quiz-3-4',
        question: 'あねは　なにを　しますか。',
        type: '読解',
        choices: [
          { text: 'ピアノを　ひきます', correct: true, explanation: 'せいかいです。あねは　ピアノを　ひきます。' },
          { text: 'りょうりを　します', correct: false, explanation: 'ちがいます。' },
          { text: 'サッカーを　します', correct: false, explanation: 'ちがいます。' },
          { text: 'えを　かきます', correct: false, explanation: 'ちがいます。' }
        ]
      },
      {
        id: 'quiz-3-5',
        question: '「なかよし」の　いみは　なんですか。',
        type: '語彙',
        choices: [
          { text: 'get along well', correct: true, explanation: 'せいかいです。「なかよし」は　get along well です。' },
          { text: 'far away', correct: false, explanation: 'ちがいます。' },
          { text: 'busy', correct: false, explanation: 'ちがいます。' },
          { text: 'quiet', correct: false, explanation: 'ちがいます。' }
        ]
      }
    ]
  },
  'コンビニで買い物': {
    title: 'コンビニで買い物',
    chapters: [
      {
        num: 1,
        content: `きょうは　コンビニに　いきます。

かいものを　します。なにを　かいますか。

コンビニは　いえの　ちかくに　あります。`,
        vocabulary: {
          "コンビニ": "convenience store",
          "かいもの": "shopping",
          "かう": "to buy",
          "いえ": "house",
          "ちかく": "near"
        }
      },
      {
        num: 2,
        content: `コンビニに　つきました。おおきい　コンビニです。

おにぎりが　たくさん　あります。サンドイッチも　あります。

なにを　かいますか。まよいます。`,
        vocabulary: {
          "つく": "to arrive",
          "おにぎり": "rice ball",
          "サンドイッチ": "sandwich",
          "たくさん": "many",
          "まよう": "to be unsure"
        }
      },
      {
        num: 3,
        content: `おにぎりを　えらびます。さけおにぎりです。

おちゃも　かいます。つめたい　おちゃです。

おかしも　かいます。チョコレートです。`,
        vocabulary: {
          "えらぶ": "to choose",
          "さけ": "salmon",
          "おちゃ": "tea",
          "つめたい": "cold",
          "おかし": "snacks"
        }
      },
      {
        num: 4,
        content: `レジに　いきます。てんいんさんが　います。

「いらっしゃいませ」と　いいました。

ぜんぶで　５００えんです。`,
        vocabulary: {
          "レジ": "cash register",
          "てんいん": "store clerk",
          "いらっしゃいませ": "welcome",
          "ぜんぶ": "all together",
          "えん": "yen"
        }
      },
      {
        num: 5,
        content: `おかねを　はらいました。「ありがとう　ございました」

ふくろに　いれて　もらいました。

いえに　かえります。たのしい　かいものでした。`,
        vocabulary: {
          "おかね": "money",
          "はらう": "to pay",
          "ふくろ": "bag",
          "いれる": "to put in",
          "かえる": "to return"
        }
      }
    ],
    quizzes: [
      {
        id: 'quiz-4-1',
        question: 'きょうは　どこに　いきますか。',
        type: '読解',
        choices: [
          { text: 'コンビニ', correct: true, explanation: 'せいかいです。コンビニに　いきます。' },
          { text: 'スーパー', correct: false, explanation: 'ちがいます。コンビニです。' },
          { text: 'がっこう', correct: false, explanation: 'ちがいます。コンビニです。' },
          { text: 'こうえん', correct: false, explanation: 'ちがいます。コンビニです。' }
        ]
      },
      {
        id: 'quiz-4-2',
        question: 'なにを　かいましたか。',
        type: '読解',
        choices: [
          { text: 'おにぎりと　おちゃと　チョコレート', correct: true, explanation: 'せいかいです。３つ　かいました。' },
          { text: 'サンドイッチだけ', correct: false, explanation: 'ちがいます。おにぎりを　かいました。' },
          { text: 'おちゃだけ', correct: false, explanation: 'ちがいます。３つ　かいました。' },
          { text: 'なにも　かいません', correct: false, explanation: 'ちがいます。かいものを　しました。' }
        ]
      },
      {
        id: 'quiz-4-3',
        question: 'ぜんぶで　いくらでしたか。',
        type: '読解',
        choices: [
          { text: '５００えん', correct: true, explanation: 'せいかいです。ぜんぶで　５００えんです。' },
          { text: '３００えん', correct: false, explanation: 'ちがいます。５００えんです。' },
          { text: '１０００えん', correct: false, explanation: 'ちがいます。５００えんです。' },
          { text: '２００えん', correct: false, explanation: 'ちがいます。５００えんです。' }
        ]
      },
      {
        id: 'quiz-4-4',
        question: '「レジ」の　いみは　なんですか。',
        type: '語彙',
        choices: [
          { text: 'cash register', correct: true, explanation: 'せいかいです。「レジ」は　cash register です。' },
          { text: 'shelf', correct: false, explanation: 'ちがいます。' },
          { text: 'entrance', correct: false, explanation: 'ちがいます。' },
          { text: 'refrigerator', correct: false, explanation: 'ちがいます。' }
        ]
      },
      {
        id: 'quiz-4-5',
        question: 'てんいんさんは　なにと　いいましたか。',
        type: '読解',
        choices: [
          { text: 'いらっしゃいませ', correct: true, explanation: 'せいかいです。「いらっしゃいませ」と　いいました。' },
          { text: 'こんにちは', correct: false, explanation: 'ちがいます。' },
          { text: 'さようなら', correct: false, explanation: 'ちがいます。' },
          { text: 'おはよう', correct: false, explanation: 'ちがいます。' }
        ]
      }
    ]
  },
  '好きな食べ物': {
    title: '好きな食べ物',
    chapters: [
      {
        num: 1,
        content: `わたしは　たべものが　すきです。

とくに　にほんの　たべものが　すきです。

きょうは　すきな　たべものに　ついて　はなします。`,
        vocabulary: {
          "たべもの": "food",
          "とくに": "especially",
          "にほん": "Japan",
          "ついて": "about",
          "はなす": "to talk"
        }
      },
      {
        num: 2,
        content: `いちばん　すきな　たべものは　すしです。

さかなが　しんせんで　おいしいです。

まぐろが　すきです。サーモンも　すきです。`,
        vocabulary: {
          "いちばん": "most",
          "すし": "sushi",
          "さかな": "fish",
          "しんせん": "fresh",
          "まぐろ": "tuna"
        }
      },
      {
        num: 3,
        content: `ラーメンも　だいすきです。

あつい　スープが　おいしいです。

とんこつラーメンを　よく　たべます。`,
        vocabulary: {
          "ラーメン": "ramen",
          "だいすき": "love",
          "あつい": "hot",
          "スープ": "soup",
          "とんこつ": "pork bone"
        }
      },
      {
        num: 4,
        content: `おかしも　すきです。

チョコレートが　すきです。あまくて　おいしいです。

ときどき　ケーキも　たべます。`,
        vocabulary: {
          "おかし": "sweets/snacks",
          "チョコレート": "chocolate",
          "あまい": "sweet",
          "ときどき": "sometimes",
          "ケーキ": "cake"
        }
      },
      {
        num: 5,
        content: `たべものは　たのしいです。

あたらしい　たべものに　ちょうせんしたいです。

これからも　いろいろな　たべものを　たべます。`,
        vocabulary: {
          "たのしい": "fun",
          "あたらしい": "new",
          "ちょうせん": "challenge",
          "いろいろな": "various",
          "これから": "from now on"
        }
      }
    ],
    quizzes: [
      {
        id: 'quiz-5-1',
        question: 'いちばん　すきな　たべものは　なんですか。',
        type: '読解',
        choices: [
          { text: 'すし', correct: true, explanation: 'せいかいです。いちばん　すきな　たべものは　すしです。' },
          { text: 'ラーメン', correct: false, explanation: 'ラーメンも　すきですが、いちばんは　すしです。' },
          { text: 'ケーキ', correct: false, explanation: 'ちがいます。いちばんは　すしです。' },
          { text: 'チョコレート', correct: false, explanation: 'ちがいます。いちばんは　すしです。' }
        ]
      },
      {
        id: 'quiz-5-2',
        question: 'どんな　すしが　すきですか。',
        type: '読解',
        choices: [
          { text: 'まぐろと　サーモン', correct: true, explanation: 'せいかいです。まぐろと　サーモンが　すきです。' },
          { text: 'たまご', correct: false, explanation: 'ちがいます。' },
          { text: 'いか', correct: false, explanation: 'ちがいます。' },
          { text: 'えび', correct: false, explanation: 'ちがいます。' }
        ]
      },
      {
        id: 'quiz-5-3',
        question: 'どんな　ラーメンを　よく　たべますか。',
        type: '読解',
        choices: [
          { text: 'とんこつラーメン', correct: true, explanation: 'せいかいです。とんこつラーメンを　よく　たべます。' },
          { text: 'しょうゆラーメン', correct: false, explanation: 'ちがいます。とんこつラーメンです。' },
          { text: 'みそラーメン', correct: false, explanation: 'ちがいます。とんこつラーメンです。' },
          { text: 'しおラーメン', correct: false, explanation: 'ちがいます。とんこつラーメンです。' }
        ]
      },
      {
        id: 'quiz-5-4',
        question: '「あまい」の　いみは　なんですか。',
        type: '語彙',
        choices: [
          { text: 'sweet', correct: true, explanation: 'せいかいです。「あまい」は　sweet です。' },
          { text: 'sour', correct: false, explanation: 'それは「すっぱい」です。' },
          { text: 'spicy', correct: false, explanation: 'それは「からい」です。' },
          { text: 'bitter', correct: false, explanation: 'それは「にがい」です。' }
        ]
      },
      {
        id: 'quiz-5-5',
        question: 'これから　なにを　したいですか。',
        type: '読解',
        choices: [
          { text: 'あたらしい　たべものに　ちょうせんしたい', correct: true, explanation: 'せいかいです。あたらしい　たべものに　ちょうせんしたいです。' },
          { text: 'もう　たべたくない', correct: false, explanation: 'ちがいます。' },
          { text: 'すしだけ　たべたい', correct: false, explanation: 'ちがいます。いろいろな　たべものを　たべます。' },
          { text: 'りょうりを　したい', correct: false, explanation: 'ちがいます。' }
        ]
      }
    ]
  }
};

async function fixAllStories() {
  console.log('=== 全ストーリーの内容を修正開始 ===\n');

  let fixedCount = 0;

  // N5ストーリーを修正
  for (const [storyTitle, storyData] of Object.entries(n5Stories)) {
    console.log(`\n📖 修正中: ${storyTitle}`);

    const story = await prisma.story.findFirst({
      where: { title: storyTitle }
    });

    if (!story) {
      console.log(`  ⚠️  ストーリーが見つかりません: ${storyTitle}`);
      continue;
    }

    // チャプターを更新
    for (const chapterData of storyData.chapters) {
      const chapterId = `ch-${story.story_id}-${chapterData.num}`;

      await prisma.chapter.update({
        where: { chapter_id: chapterId },
        data: {
          content: chapterData.content,
          vocabulary: chapterData.vocabulary
        }
      });
    }

    console.log(`  ✅ チャプター${storyData.chapters.length}個を更新`);

    // 既存のクイズを削除
    const existingQuizzes = await prisma.quiz.findMany({
      where: { story_id: story.story_id },
      select: { quiz_id: true }
    });

    for (const quiz of existingQuizzes) {
      await prisma.quizChoice.deleteMany({ where: { quiz_id: quiz.quiz_id } });
    }

    await prisma.quiz.deleteMany({ where: { story_id: story.story_id } });

    // 新しいクイズを作成
    for (const quizData of storyData.quizzes) {
      const quiz = await prisma.quiz.create({
        data: {
          quiz_id: quizData.id,
          question_text: quizData.question,
          question_type: quizData.type,
          difficulty_level: story.level_jlpt!,
          is_ai_generated: false,
          source_text: `${storyTitle}から`,
          story: {
            connect: { story_id: story.story_id }
          }
        },
      });

      for (let i = 0; i < quizData.choices.length; i++) {
        await prisma.quizChoice.create({
          data: {
            choice_id: `${quizData.id}-choice-${i + 1}`,
            quiz_id: quiz.quiz_id,
            choice_text: quizData.choices[i].text,
            is_correct: quizData.choices[i].correct,
            explanation: quizData.choices[i].explanation,
          },
        });
      }
    }

    console.log(`  ✅ クイズ${storyData.quizzes.length}個を更新`);
    fixedCount++;
  }

  console.log(`\n\n✅ ${fixedCount}個のストーリーを修正しました`);
  console.log('\n次のステップ: N4, N3, N2, N1レベルのストーリーも修正が必要です');

  await prisma.$disconnect();
}

fixAllStories().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
