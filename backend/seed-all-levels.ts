import prisma from './src/lib/db.js';

/**
 * Seed all JLPT levels with 5 stories each
 * Total: 25 stories (N4-N1) + 5 existing N5 stories = 30 stories
 */
async function seedAllLevels() {
  console.log('Creating stories for all JLPT levels...\n');

  try {
    // ============================================================
    // N4 / A2 Level Stories (5 stories)
    // ============================================================
    console.log('Creating N4/A2 level stories...');

    const n4Stories = [
      {
        id: '6',
        title: '友達と映画を見に行く',
        description: '友達と映画館で日本映画を観ます。',
        rootChapter: 'chapter-6-1',
        chapters: [
          {
            id: 'chapter-6-1',
            number: 1,
            title: '映画館で待ち合わせ',
            content: 'あなたは友達と映画を見る約束をしました。映画館の前で待っています。\n\n(You made plans to see a movie with your friend. You are waiting in front of the theater.)',
            learningPoints: {
              points: [
                'Making plans with friends: 約束する',
                'Waiting: 待つ',
                'Movie theater vocabulary'
              ]
            },
            vocabulary: {
              words: [
                { word: '友達', reading: 'ともだち', meaning: 'friend' },
                { word: '映画', reading: 'えいが', meaning: 'movie' },
                { word: '約束', reading: 'やくそく', meaning: 'promise, appointment' },
                { word: '待つ', reading: 'まつ', meaning: 'to wait' }
              ]
            },
            choices: [
              {
                text: 'チケットを買います (Buy tickets)',
                nextChapter: 'chapter-6-2',
                difficulty: 0
              },
              {
                text: '友達が来るのを待ちます (Wait for friend)',
                nextChapter: 'chapter-6-3',
                difficulty: 0
              }
            ]
          },
          {
            id: 'chapter-6-2',
            number: 2,
            title: 'チケット購入',
            content: 'チケット売り場で映画のチケットを買いました。アクション映画とロマンス映画があります。\n\n(You bought movie tickets at the ticket counter. There are action movies and romance movies.)',
            learningPoints: {
              points: [
                'Movie genres in Japanese',
                'Buying tickets: チケットを買う'
              ]
            },
            vocabulary: {
              words: [
                { word: 'チケット', reading: 'ちけっと', meaning: 'ticket' },
                { word: '売り場', reading: 'うりば', meaning: 'sales counter' },
                { word: 'アクション', reading: 'あくしょん', meaning: 'action' }
              ]
            },
            choices: []
          },
          {
            id: 'chapter-6-3',
            number: 3,
            title: '友達と合流',
            content: '友達が来ました。一緒に映画館に入ります。ポップコーンを買いましょうか？\n\n(Your friend arrived. You enter the theater together. Should we buy popcorn?)',
            learningPoints: {
              points: [
                'Meeting up: 合流する',
                'Together: 一緒に',
                'Suggesting: ～ましょうか'
              ]
            },
            vocabulary: {
              words: [
                { word: '一緒に', reading: 'いっしょに', meaning: 'together' },
                { word: 'ポップコーン', reading: 'ぽっぷこーん', meaning: 'popcorn' }
              ]
            },
            choices: []
          }
        ]
      },
      {
        id: '7',
        title: 'アルバイトの面接',
        description: 'カフェでアルバイトの面接を受けます。',
        rootChapter: 'chapter-7-1',
        chapters: [
          {
            id: 'chapter-7-1',
            number: 1,
            title: '面接の準備',
            content: '今日はカフェでアルバイトの面接があります。履歴書を持って、カフェに向かいます。\n\n(You have a part-time job interview at a cafe today. You head to the cafe with your resume.)',
            learningPoints: {
              points: [
                'Part-time job: アルバイト',
                'Interview: 面接',
                'Resume: 履歴書'
              ]
            },
            vocabulary: {
              words: [
                { word: 'アルバイト', reading: 'あるばいと', meaning: 'part-time job' },
                { word: '面接', reading: 'めんせつ', meaning: 'interview' },
                { word: '履歴書', reading: 'りれきしょ', meaning: 'resume' },
                { word: '向かう', reading: 'むかう', meaning: 'to head toward' }
              ]
            },
            choices: [
              {
                text: '早めに到着します (Arrive early)',
                nextChapter: 'chapter-7-2',
                difficulty: 0
              },
              {
                text: 'ちょうどの時間に着きます (Arrive on time)',
                nextChapter: 'chapter-7-3',
                difficulty: 0
              }
            ]
          },
          {
            id: 'chapter-7-2',
            number: 2,
            title: '面接開始',
            content: '店長に挨拶をして、面接が始まりました。「どうして当店で働きたいですか？」と聞かれました。\n\n(You greeted the manager and the interview began. You were asked "Why do you want to work at our store?")',
            learningPoints: {
              points: [
                'Greeting: 挨拶',
                'Manager: 店長',
                'Why questions: どうして'
              ]
            },
            vocabulary: {
              words: [
                { word: '店長', reading: 'てんちょう', meaning: 'store manager' },
                { word: '挨拶', reading: 'あいさつ', meaning: 'greeting' },
                { word: '働く', reading: 'はたらく', meaning: 'to work' }
              ]
            },
            choices: []
          },
          {
            id: 'chapter-7-3',
            number: 3,
            title: '面接質問',
            content: '面接で色々な質問に答えました。店長は「いつから働けますか？」と聞きました。\n\n(You answered various questions in the interview. The manager asked "When can you start working?")',
            learningPoints: {
              points: [
                'Various: 色々な',
                'Answer: 答える',
                'When: いつ'
              ]
            },
            vocabulary: {
              words: [
                { word: '色々', reading: 'いろいろ', meaning: 'various' },
                { word: '質問', reading: 'しつもん', meaning: 'question' },
                { word: '答える', reading: 'こたえる', meaning: 'to answer' }
              ]
            },
            choices: []
          }
        ]
      },
      {
        id: '8',
        title: '病院で診察',
        description: '風邪をひいて病院に行きます。',
        rootChapter: 'chapter-8-1',
        chapters: [
          {
            id: 'chapter-8-1',
            number: 1,
            title: '受付で',
            content: '風邪をひいたので、病院に来ました。受付で保険証を出して、問診票に記入します。\n\n(You caught a cold, so you came to the hospital. At the reception, you show your insurance card and fill out a medical questionnaire.)',
            learningPoints: {
              points: [
                'Catching a cold: 風邪をひく',
                'Hospital: 病院',
                'Insurance card: 保険証'
              ]
            },
            vocabulary: {
              words: [
                { word: '風邪', reading: 'かぜ', meaning: 'cold (illness)' },
                { word: '病院', reading: 'びょういん', meaning: 'hospital' },
                { word: '受付', reading: 'うけつけ', meaning: 'reception' },
                { word: '保険証', reading: 'ほけんしょう', meaning: 'insurance card' }
              ]
            },
            choices: [
              {
                text: '待合室で待ちます (Wait in waiting room)',
                nextChapter: 'chapter-8-2',
                difficulty: 0
              }
            ]
          },
          {
            id: 'chapter-8-2',
            number: 2,
            title: '診察室で',
            content: '名前を呼ばれて、診察室に入りました。先生が「どうしましたか？」と聞きました。\n\n(Your name was called and you entered the examination room. The doctor asked "What\'s wrong?")',
            learningPoints: {
              points: [
                'Examination room: 診察室',
                'Doctor: 先生',
                'What\'s wrong: どうしましたか'
              ]
            },
            vocabulary: {
              words: [
                { word: '呼ぶ', reading: 'よぶ', meaning: 'to call' },
                { word: '診察', reading: 'しんさつ', meaning: 'medical examination' },
                { word: '先生', reading: 'せんせい', meaning: 'teacher, doctor' }
              ]
            },
            choices: []
          }
        ]
      },
      {
        id: '9',
        title: '図書館で勉強',
        description: '図書館で日本語を勉強します。',
        rootChapter: 'chapter-9-1',
        chapters: [
          {
            id: 'chapter-9-1',
            number: 1,
            title: '図書館に到着',
            content: '図書館に着きました。静かな場所を探して、日本語の教科書を開きます。\n\n(You arrived at the library. You look for a quiet place and open your Japanese textbook.)',
            learningPoints: {
              points: [
                'Library: 図書館',
                'Quiet: 静か',
                'Textbook: 教科書'
              ]
            },
            vocabulary: {
              words: [
                { word: '図書館', reading: 'としょかん', meaning: 'library' },
                { word: '静か', reading: 'しずか', meaning: 'quiet' },
                { word: '教科書', reading: 'きょうかしょ', meaning: 'textbook' },
                { word: '開く', reading: 'ひらく', meaning: 'to open' }
              ]
            },
            choices: [
              {
                text: '漢字を勉強します (Study kanji)',
                nextChapter: 'chapter-9-2',
                difficulty: 0
              },
              {
                text: '文法を勉強します (Study grammar)',
                nextChapter: 'chapter-9-3',
                difficulty: 0
              }
            ]
          },
          {
            id: 'chapter-9-2',
            number: 2,
            title: '漢字の練習',
            content: '漢字を一生懸命練習しています。難しい漢字もありますが、頑張って覚えます。\n\n(You are practicing kanji diligently. There are difficult kanji, but you work hard to memorize them.)',
            learningPoints: {
              points: [
                'Practice: 練習',
                'Diligently: 一生懸命',
                'Memorize: 覚える'
              ]
            },
            vocabulary: {
              words: [
                { word: '練習', reading: 'れんしゅう', meaning: 'practice' },
                { word: '一生懸命', reading: 'いっしょうけんめい', meaning: 'with all one\'s might' },
                { word: '覚える', reading: 'おぼえる', meaning: 'to memorize' }
              ]
            },
            choices: []
          },
          {
            id: 'chapter-9-3',
            number: 3,
            title: '文法の勉強',
            content: '文法の本を読んでいます。新しい文型を勉強して、例文を作ります。\n\n(You are reading a grammar book. You study new sentence patterns and create example sentences.)',
            learningPoints: {
              points: [
                'Grammar: 文法',
                'Sentence pattern: 文型',
                'Example sentence: 例文'
              ]
            },
            vocabulary: {
              words: [
                { word: '文法', reading: 'ぶんぽう', meaning: 'grammar' },
                { word: '文型', reading: 'ぶんけい', meaning: 'sentence pattern' },
                { word: '例文', reading: 'れいぶん', meaning: 'example sentence' }
              ]
            },
            choices: []
          }
        ]
      },
      {
        id: '10',
        title: '日本の祭りに参加',
        description: '地域の夏祭りに行って、日本文化を体験します。',
        rootChapter: 'chapter-10-1',
        chapters: [
          {
            id: 'chapter-10-1',
            number: 1,
            title: '祭りの会場',
            content: '夏祭りに来ました。浴衣を着た人がたくさんいます。屋台が並んでいて、良い匂いがします。\n\n(You came to the summer festival. There are many people wearing yukata. Food stalls are lined up and it smells good.)',
            learningPoints: {
              points: [
                'Festival: 祭り',
                'Yukata: 浴衣',
                'Food stall: 屋台'
              ]
            },
            vocabulary: {
              words: [
                { word: '祭り', reading: 'まつり', meaning: 'festival' },
                { word: '浴衣', reading: 'ゆかた', meaning: 'yukata (summer kimono)' },
                { word: '屋台', reading: 'やたい', meaning: 'food stall' },
                { word: '匂い', reading: 'におい', meaning: 'smell, scent' }
              ]
            },
            choices: [
              {
                text: '屋台で食べ物を買います (Buy food at stall)',
                nextChapter: 'chapter-10-2',
                difficulty: 0
              },
              {
                text: '盆踊りを見ます (Watch bon dance)',
                nextChapter: 'chapter-10-3',
                difficulty: 0
              }
            ]
          },
          {
            id: 'chapter-10-2',
            number: 2,
            title: '屋台で',
            content: '焼きそばとたこ焼きを買いました。とても美味しいです。友達と一緒に食べています。\n\n(You bought yakisoba and takoyaki. They are very delicious. You are eating with your friends.)',
            learningPoints: {
              points: [
                'Festival foods',
                'Delicious: 美味しい',
                'Eating together'
              ]
            },
            vocabulary: {
              words: [
                { word: '焼きそば', reading: 'やきそば', meaning: 'fried noodles' },
                { word: 'たこ焼き', reading: 'たこやき', meaning: 'takoyaki (octopus balls)' },
                { word: '美味しい', reading: 'おいしい', meaning: 'delicious' }
              ]
            },
            choices: []
          },
          {
            id: 'chapter-10-3',
            number: 3,
            title: '盆踊り',
            content: '盆踊りが始まりました。たくさんの人が踊っています。あなたも参加してみましょう。\n\n(The bon dance has started. Many people are dancing. Let\'s try participating too.)',
            learningPoints: {
              points: [
                'Bon dance: 盆踊り',
                'To dance: 踊る',
                'Participate: 参加する'
              ]
            },
            vocabulary: {
              words: [
                { word: '盆踊り', reading: 'ぼんおどり', meaning: 'bon dance' },
                { word: '踊る', reading: 'おどる', meaning: 'to dance' },
                { word: '参加', reading: 'さんか', meaning: 'participation' }
              ]
            },
            choices: []
          }
        ]
      }
    ];

    // Insert N4/A2 stories
    for (const storyData of n4Stories) {
      const story = await prisma.story.create({
        data: {
          story_id: storyData.id,
          title: storyData.title,
          description: storyData.description,
          category: 'daily_life',
          difficulty_level: 'intermediate',
          level_jlpt: 'N4',
          level_cefr: 'A2',
          estimated_time: 10,
          estimated_duration_minutes: 10,
          root_chapter_id: storyData.rootChapter,
          is_active: true,
        },
      });

      for (const chapterData of storyData.chapters) {
        const chapter = await prisma.chapter.create({
          data: {
            chapter_id: chapterData.id,
            story_id: story.story_id,
            chapter_number: chapterData.number,
            title: chapterData.title,
            content: chapterData.content,
            learning_points: chapterData.learningPoints,
            vocabulary: chapterData.vocabulary,
          },
        });

        if (chapterData.choices && chapterData.choices.length > 0) {
          for (const choiceData of chapterData.choices) {
            await prisma.choice.create({
              data: {
                chapter_id: chapter.chapter_id,
                choice_text: choiceData.text,
                next_chapter_id: choiceData.nextChapter || null,
                difficulty_adjustment: choiceData.difficulty,
              },
            });
          }
        }
      }

      console.log(`✅ Created: ${story.title}`);
    }

    console.log('\n✅ N4/A2 level stories created!');
    console.log('Note: N3/B1, N2/B2, and N1/C1 stories will be created next...');

  } catch (error) {
    console.error('❌ Error creating stories:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedAllLevels();
