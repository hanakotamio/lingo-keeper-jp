import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_9zkXoHEsC8PQ@ep-morning-sky-a1dv4mjd-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    }
  }
});

// Story data for all 25 stories across JLPT levels
const storyData = [
  // Existing Story 1
  { story_id: '1', title: '東京での新しい生活', level_jlpt: 'N3', level_cefr: 'B1', category: '日常生活', difficulty: 'intermediate' },

  // N5 Stories (Beginner) - Stories 2-6
  { story_id: '2', title: '初めての挨拶', level_jlpt: 'N5', level_cefr: 'A1', category: '基本会話', difficulty: 'beginner' },
  { story_id: '3', title: '家族の紹介', level_jlpt: 'N5', level_cefr: 'A1', category: '家族', difficulty: 'beginner' },
  { story_id: '4', title: 'コンビニで買い物', level_jlpt: 'N5', level_cefr: 'A1', category: '日常生活', difficulty: 'beginner' },
  { story_id: '5', title: '好きな食べ物', level_jlpt: 'N5', level_cefr: 'A1', category: '食事', difficulty: 'beginner' },
  { story_id: '6', title: '公園での散歩', level_jlpt: 'N5', level_cefr: 'A1', category: '趣味', difficulty: 'beginner' },

  // N4 Stories (Elementary) - Stories 7-11
  { story_id: '7', title: 'レストランでの注文', level_jlpt: 'N4', level_cefr: 'A2', category: '食事', difficulty: 'elementary' },
  { story_id: '8', title: '友達との約束', level_jlpt: 'N4', level_cefr: 'A2', category: '友情', difficulty: 'elementary' },
  { story_id: '9', title: '電車での通学', level_jlpt: 'N4', level_cefr: 'A2', category: '交通', difficulty: 'elementary' },
  { story_id: '10', title: '週末の計画', level_jlpt: 'N4', level_cefr: 'A2', category: '日常生活', difficulty: 'elementary' },
  { story_id: '11', title: '図書館での勉強', level_jlpt: 'N4', level_cefr: 'A2', category: '学習', difficulty: 'elementary' },

  // N3 Stories (Intermediate) - Stories 12-16
  { story_id: '12', title: 'アルバイトの面接', level_jlpt: 'N3', level_cefr: 'B1', category: '仕事', difficulty: 'intermediate' },
  { story_id: '13', title: '病院での診察', level_jlpt: 'N3', level_cefr: 'B1', category: '健康', difficulty: 'intermediate' },
  { story_id: '14', title: '旅行の準備', level_jlpt: 'N3', level_cefr: 'B1', category: '旅行', difficulty: 'intermediate' },
  { story_id: '15', title: '会社での会議', level_jlpt: 'N3', level_cefr: 'B1', category: '仕事', difficulty: 'intermediate' },
  { story_id: '16', title: '引っ越しの手続き', level_jlpt: 'N3', level_cefr: 'B1', category: '日常生活', difficulty: 'intermediate' },

  // N2 Stories (Upper Intermediate) - Stories 17-21
  { story_id: '17', title: 'ビジネスメールの作成', level_jlpt: 'N2', level_cefr: 'B2', category: 'ビジネス', difficulty: 'upper_intermediate' },
  { story_id: '18', title: '文化交流イベント', level_jlpt: 'N2', level_cefr: 'B2', category: '文化', difficulty: 'upper_intermediate' },
  { story_id: '19', title: 'プロジェクトの進捗報告', level_jlpt: 'N2', level_cefr: 'B2', category: 'ビジネス', difficulty: 'upper_intermediate' },
  { story_id: '20', title: '環境問題について', level_jlpt: 'N2', level_cefr: 'B2', category: '社会問題', difficulty: 'upper_intermediate' },
  { story_id: '21', title: '就職活動の準備', level_jlpt: 'N2', level_cefr: 'B2', category: 'キャリア', difficulty: 'upper_intermediate' },

  // N1 Stories (Advanced) - Stories 22-25
  { story_id: '22', title: '経済政策の分析', level_jlpt: 'N1', level_cefr: 'C1', category: '経済', difficulty: 'advanced' },
  { story_id: '23', title: '文学作品の解釈', level_jlpt: 'N1', level_cefr: 'C1', category: '文学', difficulty: 'advanced' },
  { story_id: '24', title: '国際関係の考察', level_jlpt: 'N1', level_cefr: 'C1', category: '政治', difficulty: 'advanced' },
  { story_id: '25', title: '伝統文化の継承', level_jlpt: 'N1', level_cefr: 'C1', category: '文化', difficulty: 'advanced' }
];

// Content templates for different JLPT levels
const contentTemplates = {
  N5: {
    learningPoints: ['Basic greetings', 'Simple vocabulary', 'Present tense verbs'],
    vocabularyTemplate: (chapterNum: number) => [
      { word: 'こんにちは', reading: 'konnichiwa', meanings: { en: 'hello', ja: 'こんにちは' } },
      { word: 'ありがとう', reading: 'arigatou', meanings: { en: 'thank you', ja: 'ありがとう' } },
      { word: 'はい', reading: 'hai', meanings: { en: 'yes', ja: 'はい' } }
    ],
    contentGenerator: (title: string, chapterNum: number) => [
      `これは ${title} の始まりです。今日は いい 天気ですね。外に 出ましょう。`,
      `わたしは 学生です。毎日 学校に 行きます。友達と 話します。楽しいです。`,
      `昼ごはんを 食べます。おいしいです。お茶も 飲みます。ありがとう。`,
      `午後、勉強を します。日本語は おもしろいです。がんばります。`,
      `今日は いい 日でした。また 明日 会いましょう。さようなら。`
    ][chapterNum - 1]
  },
  N4: {
    learningPoints: ['Past tense', 'Adjectives', 'Particle usage'],
    vocabularyTemplate: (chapterNum: number) => [
      { word: '昨日', reading: 'kinou', meanings: { en: 'yesterday', ja: '昨日' } },
      { word: '楽しい', reading: 'tanoshii', meanings: { en: 'fun', ja: '楽しい' } },
      { word: '会う', reading: 'au', meanings: { en: 'to meet', ja: '会う' } }
    ],
    contentGenerator: (title: string, chapterNum: number) => [
      `${title} について考えます。昨日はとても楽しかったです。友達と遊びました。`,
      `朝、早く起きました。朝ごはんを食べてから、出かけました。天気が良かったです。`,
      `友達と会いました。一緒に買い物をしました。新しい服を買いました。`,
      `夜、レストランで食事をしました。料理はおいしかったです。楽しく話しました。`,
      `家に帰りました。今日も良い一日でした。また会いたいです。おやすみなさい。`
    ][chapterNum - 1]
  },
  N3: {
    learningPoints: ['Conditional forms', 'Passive voice', 'Keigo basics'],
    vocabularyTemplate: (chapterNum: number) => [
      { word: '経験', reading: 'keiken', meanings: { en: 'experience', ja: '経験' } },
      { word: '準備', reading: 'junbi', meanings: { en: 'preparation', ja: '準備' } },
      { word: '必要', reading: 'hitsuyou', meanings: { en: 'necessary', ja: '必要' } }
    ],
    contentGenerator: (title: string, chapterNum: number) => [
      `${title} に関して、様々な視点から考察しました。非常に興味深い内容でした。準備が必要です。`,
      `過去の経験を振り返ると、多くの学びがありました。これは貴重な機会だと思います。`,
      `新しい発見をしました。この知識は今後に役立つでしょう。さらに研究を続けます。`,
      `さまざまな課題に直面しましたが、乗り越えることができました。成長を実感しています。`,
      `この物語を通じて、大切なことを学びました。感謝の気持ちでいっぱいです。ありがとうございました。`
    ][chapterNum - 1]
  },
  N2: {
    learningPoints: ['Advanced grammar', 'Business Japanese', 'Cultural nuances'],
    vocabularyTemplate: (chapterNum: number) => [
      { word: '実施', reading: 'jisshi', meanings: { en: 'implementation', ja: '実施' } },
      { word: '課題', reading: 'kadai', meanings: { en: 'issue/task', ja: '課題' } },
      { word: '検討', reading: 'kentou', meanings: { en: 'consideration', ja: '検討' } }
    ],
    contentGenerator: (title: string, chapterNum: number) => [
      `${title} における主題について、詳細な分析を行いました。その結果、興味深い知見が得られました。`,
      `過去の事例を検討した結果、いくつかの重要な傾向が明らかになりました。課題も見えてきました。`,
      `この問題に対する新たなアプローチを試みました。その成果は期待以上でした。実施に移します。`,
      `様々な課題に直面しましたが、適切な対応により解決することができました。チーム全体で取り組みました。`,
      `本件を総括すると、多くの学びと成果が得られたと言えるでしょう。今後も継続していきます。`
    ][chapterNum - 1]
  },
  N1: {
    learningPoints: ['Literary expressions', 'Complex honorifics', 'Idiomatic phrases'],
    vocabularyTemplate: (chapterNum: number) => [
      { word: '遂行', reading: 'suikou', meanings: { en: 'execution/accomplishment', ja: '遂行' } },
      { word: '懸念', reading: 'kenen', meanings: { en: 'concern/worry', ja: '懸念' } },
      { word: '鑑みる', reading: 'kangamiru', meanings: { en: 'to consider', ja: '鑑みる' } }
    ],
    contentGenerator: (title: string, chapterNum: number) => [
      `${title} に関する考察において、従来の見解を覆すような新たな知見が得られました。詳細な分析が必要です。`,
      `過去の文献を精査した結果、これまで看過されてきた重要な点が浮き彫りになりました。再評価が求められます。`,
      `本研究の遂行にあたり、多岐にわたる困難に直面しましたが、それらを克服することができました。`,
      `諸般の事情を鑑みると、当初の懸念は杞憂に終わったと言えるでしょう。適切な対応が功を奏しました。`,
      `本論を締めくくるにあたり、今後の展望について言及しておきたいと思います。継続的な研究が期待されます。`
    ][chapterNum - 1]
  }
};

async function seedAllStoriesWithChapters() {
  console.log('=== 25ストーリーとチャプター・選択肢の一括作成 ===\n');

  try {
    let storiesCreated = 0;
    let storiesSkipped = 0;
    let chaptersCreated = 0;
    let choicesCreated = 0;

    for (const storyInfo of storyData) {
      console.log(`\n📖 Story ${storyInfo.story_id}: "${storyInfo.title}" (${storyInfo.level_jlpt})`);

      // Check if story exists
      const existingStory = await prisma.story.findUnique({
        where: { story_id: storyInfo.story_id }
      });

      if (!existingStory) {
        // Create new story
        await prisma.story.create({
          data: {
            story_id: storyInfo.story_id,
            title: storyInfo.title,
            description: `${storyInfo.title}の物語です。`,
            category: storyInfo.category,
            difficulty_level: storyInfo.difficulty,
            level_jlpt: storyInfo.level_jlpt,
            level_cefr: storyInfo.level_cefr,
            estimated_duration_minutes: 15,
            is_active: true,
            root_chapter_id: `ch-${storyInfo.story_id}-1`
          }
        });
        console.log(`  ✅ ストーリー作成成功`);
        storiesCreated++;
      } else {
        console.log(`  ⏭️  ストーリーは既に存在します`);
        storiesSkipped++;
      }

      // Create 5 chapters for this story
      const level = storyInfo.level_jlpt;
      const levelConfig = contentTemplates[level as keyof typeof contentTemplates] || contentTemplates.N5;

      for (let chapterNum = 1; chapterNum <= 5; chapterNum++) {
        const chapterId = `ch-${storyInfo.story_id}-${chapterNum}`;

        // Check if chapter exists
        const existingChapter = await prisma.chapter.findUnique({
          where: { chapter_id: chapterId }
        });

        if (existingChapter) {
          console.log(`    ⏭️  Chapter ${chapterNum} - 既に存在します`);
          continue;
        }

        // Generate chapter content
        const content = levelConfig.contentGenerator(storyInfo.title, chapterNum);
        const vocabulary = levelConfig.vocabularyTemplate(chapterNum);

        // Create chapter
        await prisma.chapter.create({
          data: {
            chapter_id: chapterId,
            story_id: storyInfo.story_id,
            chapter_number: chapterNum,
            title: `Chapter ${chapterNum}`,
            content: content,
            learning_points: levelConfig.learningPoints,
            vocabulary: vocabulary
          }
        });

        console.log(`    ✅ Chapter ${chapterNum} 作成成功`);
        chaptersCreated++;

        // Add choices
        if (chapterNum < 5) {
          // Not the last chapter - add choices leading to next chapter
          const nextChapterId = `ch-${storyInfo.story_id}-${chapterNum + 1}`;

          await prisma.choice.create({
            data: {
              choice_id: `choice-${chapterId}-1`,
              chapter_id: chapterId,
              choice_text: 'Continue the story',
              next_chapter_id: nextChapterId,
              difficulty_adjustment: 0
            }
          });

          await prisma.choice.create({
            data: {
              choice_id: `choice-${chapterId}-2`,
              chapter_id: chapterId,
              choice_text: 'Take a different approach',
              next_chapter_id: nextChapterId,
              difficulty_adjustment: 1
            }
          });

          choicesCreated += 2;
          console.log(`      📝 2つの選択肢を追加 → ${nextChapterId}`);
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

          choicesCreated += 2;
          console.log(`      📝 2つの終了選択肢を追加 (next_chapter_id: null)`);
        }
      }
    }

    console.log('\n\n=== 作成完了サマリー ===');
    console.log(`✅ ストーリー新規作成: ${storiesCreated}`);
    console.log(`⏭️  ストーリースキップ: ${storiesSkipped}`);
    console.log(`✅ チャプター作成: ${chaptersCreated}`);
    console.log(`✅ 選択肢作成: ${choicesCreated}`);

    // Final verification
    console.log('\n=== 最終検証 ===\n');

    const totalStories = await prisma.story.count();
    const totalChapters = await prisma.chapter.count();
    const totalChoices = await prisma.choice.count();

    console.log(`📊 総ストーリー数: ${totalStories}`);
    console.log(`📊 総チャプター数: ${totalChapters} (期待値: ${totalStories * 5})`);
    console.log(`📊 総選択肢数: ${totalChoices} (期待値: ${totalStories * 10})`);

    // Verify each story has 5 chapters
    console.log('\n各ストーリーのチャプター数:');
    for (const storyInfo of storyData) {
      const chapterCount = await prisma.chapter.count({
        where: { story_id: storyInfo.story_id }
      });
      const status = chapterCount === 5 ? '✅' : '⚠️';
      console.log(`${status} Story ${storyInfo.story_id}: ${chapterCount}/5 チャプター`);
    }

    if (totalStories === 25 && totalChapters === 125) {
      console.log('\n🎉 すべての作成が完了しました！');
    } else {
      console.log('\n⚠️ 一部のデータが不足している可能性があります');
    }

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log('\n✅ データベース接続を切断しました');
  }
}

// Execute
seedAllStoriesWithChapters()
  .then(() => {
    console.log('\n=== スクリプト実行完了 ===');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ スクリプト実行失敗:', error);
    process.exit(1);
  });
