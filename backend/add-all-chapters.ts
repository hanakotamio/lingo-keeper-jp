import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_9zkXoHEsC8PQ@ep-morning-sky-a1dv4mjd-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    }
  }
});

// Content templates for different JLPT levels
const contentTemplates = {
  N5: {
    learningPoints: ['Basic greetings', 'Simple vocabulary', 'Present tense verbs'],
    vocabularyTemplate: (chapterNum: number) => [
      { word: 'こんにちは', reading: 'konnichiwa', meanings: { en: 'hello', ja: 'あいさつ' } },
      { word: 'ありがとう', reading: 'arigatou', meanings: { en: 'thank you', ja: 'ありがとう' } }
    ]
  },
  N4: {
    learningPoints: ['Past tense', 'Adjectives', 'Particle usage'],
    vocabularyTemplate: (chapterNum: number) => [
      { word: '昨日', reading: 'kinou', meanings: { en: 'yesterday', ja: '昨日' } },
      { word: '楽しい', reading: 'tanoshii', meanings: { en: 'fun', ja: '楽しい' } }
    ]
  },
  N3: {
    learningPoints: ['Conditional forms', 'Passive voice', 'Keigo basics'],
    vocabularyTemplate: (chapterNum: number) => [
      { word: '経験', reading: 'keiken', meanings: { en: 'experience', ja: '経験' } },
      { word: '準備', reading: 'junbi', meanings: { en: 'preparation', ja: '準備' } }
    ]
  },
  N2: {
    learningPoints: ['Advanced grammar', 'Business Japanese', 'Cultural nuances'],
    vocabularyTemplate: (chapterNum: number) => [
      { word: '実施', reading: 'jisshi', meanings: { en: 'implementation', ja: '実施' } },
      { word: '課題', reading: 'kadai', meanings: { en: 'issue/task', ja: '課題' } }
    ]
  },
  N1: {
    learningPoints: ['Literary expressions', 'Complex honorifics', 'Idiomatic phrases'],
    vocabularyTemplate: (chapterNum: number) => [
      { word: '遂行', reading: 'suikou', meanings: { en: 'execution/accomplishment', ja: '遂行' } },
      { word: '懸念', reading: 'kenen', meanings: { en: 'concern/worry', ja: '懸念' } }
    ]
  }
};

function generateChapterContent(level: string, chapterNumber: number, storyTitle: string): string {
  const templates: Record<string, string[]> = {
    N5: [
      `これは ${storyTitle} の chapter ${chapterNumber} です。今日は いい 天気ですね。`,
      `わたしは 学生です。毎日 日本語を 勉強します。楽しいです。`,
      `友達と 話します。「こんにちは」と 言いました。うれしいです。`,
      `お茶を 飲みます。おいしいです。もう 一杯 ください。`,
      `今日は ありがとう ございました。また 会いましょう。さようなら。`
    ],
    N4: [
      `昨日、${storyTitle} について 考えました。とても 興味深かったです。`,
      `先週の 出来事を 思い出します。楽しい 時間を 過ごしました。`,
      `新しい 経験を しました。友達も 喜んでいました。`,
      `色々な ことを 学びました。これからも 頑張ります。`,
      `この 話は ここで 終わりです。次の 機会を 楽しみにしています。`
    ],
    N3: [
      `${storyTitle} に関して、様々な視点から考察しました。非常に興味深い内容でした。`,
      `過去の経験を振り返ると、多くの学びがありました。これは貴重な機会です。`,
      `新しい発見をしました。この知識は今後に役立つでしょう。`,
      `さまざまな課題に直面しましたが、乗り越えることができました。`,
      `この物語を通じて、大切なことを学びました。感謝の気持ちでいっぱいです。`
    ],
    N2: [
      `${storyTitle} における主題について、詳細な分析を行いました。その結果、興味深い知見が得られました。`,
      `過去の事例を検討した結果、いくつかの重要な傾向が明らかになりました。`,
      `この問題に対する新たなアプローチを試みました。その成果は期待以上でした。`,
      `様々な課題に直面しましたが、適切な対応により解決することができました。`,
      `本件を総括すると、多くの学びと成果が得られたと言えるでしょう。`
    ],
    N1: [
      `${storyTitle} に関する考察において、従来の見解を覆すような新たな知見が得られました。`,
      `過去の文献を精査した結果、これまで看過されてきた重要な点が浮き彫りになりました。`,
      `本研究の遂行にあたり、多岐にわたる困難に直面しましたが、それらを克服することができました。`,
      `諸般の事情を鑑みると、当初の懸念は杞憂に終わったと言えるでしょう。`,
      `本論を締めくくるにあたり、今後の展望について言及しておきたいと思います。`
    ]
  };

  const levelTemplates = templates[level] || templates.N5;
  return levelTemplates[(chapterNumber - 1) % levelTemplates.length];
}

async function addAllChapters() {
  console.log('=== 全25ストーリーに5チャプターずつ追加開始 ===\n');
  console.log(`データベース接続先: ${prisma._datasources?.db?.url?.substring(0, 50)}...\n`);

  try {
    // Step 1: Get all stories from the database
    console.log('Step 1: データベースから全ストーリーを取得中...');
    const stories = await prisma.story.findMany({
      orderBy: { story_id: 'asc' }
    });

    console.log(`✅ ${stories.length} 件のストーリーを取得しました\n`);

    if (stories.length === 0) {
      console.log('❌ ストーリーが見つかりませんでした');
      return;
    }

    // Show story details
    console.log('取得したストーリー:');
    stories.forEach((story, index) => {
      console.log(`  ${index + 1}. ID: ${story.story_id}, Title: ${story.title}, Level: ${story.level_jlpt || 'N/A'}`);
    });
    console.log();

    // Step 2: Add 5 chapters to each story
    console.log('Step 2: 各ストーリーに5チャプターを追加中...\n');

    let totalChaptersAdded = 0;
    let totalChaptersSkipped = 0;

    for (const story of stories) {
      console.log(`📖 Story ${story.story_id}: "${story.title}" (${story.level_jlpt || 'N/A'})`);

      const level = story.level_jlpt || 'N5';
      const levelConfig = contentTemplates[level as keyof typeof contentTemplates] || contentTemplates.N5;

      for (let chapterNum = 1; chapterNum <= 5; chapterNum++) {
        const chapterId = `ch-${story.story_id}-${chapterNum}`;

        // Check if chapter already exists
        const existingChapter = await prisma.chapter.findUnique({
          where: { chapter_id: chapterId }
        });

        if (existingChapter) {
          console.log(`  ⏭️  Chapter ${chapterNum} (${chapterId}) - すでに存在します`);
          totalChaptersSkipped++;
          continue;
        }

        // Generate chapter content
        const content = generateChapterContent(level, chapterNum, story.title);
        const vocabulary = levelConfig.vocabularyTemplate(chapterNum);

        // Create chapter
        await prisma.chapter.create({
          data: {
            chapter_id: chapterId,
            story_id: story.story_id,
            chapter_number: chapterNum,
            title: `Chapter ${chapterNum}`,
            content: content,
            learning_points: levelConfig.learningPoints,
            vocabulary: vocabulary
          }
        });

        console.log(`  ✅ Chapter ${chapterNum} (${chapterId}) - 作成成功`);
        totalChaptersAdded++;

        // Add 2-3 choices for each chapter
        if (chapterNum < 5) {
          // Not the last chapter - add choices that lead to next chapter
          const nextChapterId = `ch-${story.story_id}-${chapterNum + 1}`;

          // Choice 1: Continue normally
          await prisma.choice.create({
            data: {
              choice_id: `choice-${chapterId}-1`,
              chapter_id: chapterId,
              choice_text: 'Continue the story',
              next_chapter_id: nextChapterId,
              difficulty_adjustment: 0,
              ending_type: null
            }
          });

          // Choice 2: Alternative path (still leads to next chapter)
          await prisma.choice.create({
            data: {
              choice_id: `choice-${chapterId}-2`,
              chapter_id: chapterId,
              choice_text: 'Take a different approach',
              next_chapter_id: nextChapterId,
              difficulty_adjustment: 1,
              ending_type: null
            }
          });

          console.log(`    📝 2つの選択肢を追加 → 次チャプター: ${nextChapterId}`);
        } else {
          // Last chapter - add ending choices
          await prisma.choice.create({
            data: {
              choice_id: `choice-${chapterId}-1`,
              chapter_id: chapterId,
              choice_text: 'Complete the story',
              next_chapter_id: null,
              difficulty_adjustment: 0,
              ending_type: 'happy'
            }
          });

          await prisma.choice.create({
            data: {
              choice_id: `choice-${chapterId}-2`,
              chapter_id: chapterId,
              choice_text: 'Reflect on the journey',
              next_chapter_id: null,
              difficulty_adjustment: 0,
              ending_type: 'reflective'
            }
          });

          console.log(`    📝 2つの終了選択肢を追加 (next_chapter_id: null)`);
        }
      }

      // Update story's root_chapter_id to point to first chapter
      const firstChapterId = `ch-${story.story_id}-1`;
      await prisma.story.update({
        where: { story_id: story.story_id },
        data: { root_chapter_id: firstChapterId }
      });

      console.log(`  🔗 ストーリーのroot_chapter_idを更新: ${firstChapterId}\n`);
    }

    console.log('\n=== 追加作業完了 ===');
    console.log(`✅ 新規追加: ${totalChaptersAdded} チャプター`);
    console.log(`⏭️  スキップ: ${totalChaptersSkipped} チャプター`);
    console.log(`📊 合計処理: ${totalChaptersAdded + totalChaptersSkipped} チャプター\n`);

    // Step 3: Verify chapters were created
    console.log('Step 3: チャプター数の検証中...\n');

    for (const story of stories) {
      const chapterCount = await prisma.chapter.count({
        where: { story_id: story.story_id }
      });

      const status = chapterCount === 5 ? '✅' : '⚠️';
      console.log(`${status} Story ${story.story_id}: ${chapterCount}/5 チャプター`);
    }

    // Overall verification
    const totalChapters = await prisma.chapter.count();
    console.log(`\n📊 データベース内の総チャプター数: ${totalChapters}`);
    console.log(`🎯 期待値: ${stories.length * 5} チャプター (${stories.length} ストーリー × 5 チャプター)`);

    if (totalChapters >= stories.length * 5) {
      console.log('\n🎉 すべてのチャプターが正常に作成されました！');
    } else {
      console.log('\n⚠️ 一部のチャプターが不足している可能性があります');
    }

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log('\n✅ データベース接続を切断しました');
  }
}

// Execute the script
addAllChapters()
  .then(() => {
    console.log('\n=== スクリプト実行完了 ===');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ スクリプト実行失敗:', error);
    process.exit(1);
  });
