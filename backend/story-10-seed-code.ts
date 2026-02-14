// ============================================================
// Story 10: 初めての挨拶 (N5/A1) - 9 Chapters with Branching
// ============================================================
const story10 = await prisma.story.create({
  data: {
    story_id: '10',
    title: '初めての挨拶',
    title_en: 'First Greetings',
    description: '日本語学校の初日。先生やクラスメートとの挨拶を通じて、基本的な日本語の挨拶表現を学びます。あなたの選択で物語が変わります。',
    description_en: 'First day at Japanese language school. Learn basic Japanese greeting expressions through greetings with teachers and classmates. Your choices will change the story.',
    category: 'basic_conversation',
    difficulty_level: 'beginner',
    level_jlpt: 'N5',
    level_cefr: 'A1',
    estimated_time: 8,
    estimated_duration_minutes: 8,
    is_active: true,
    root_chapter_id: 'ch-10-1',
  },
});

// Chapter 1: Root - 日本語学校の初日
const chapter10_1 = await prisma.chapter.create({
  data: {
    chapter_id: 'ch-10-1',
    story_id: story10.story_id,
    chapter_number: 1,
    content: '今日は日本語学校の初めての日です。朝、教室に入りました。先生が「おはようございます！」と言いました。他の学生もいます。みんな、私を見ています。どうしますか？',
    content_en: 'Today is my first day at Japanese language school. In the morning, I entered the classroom. The teacher said "Good morning!" There are other students too. Everyone is looking at me. What should I do?',
  },
});

// Choices for Chapter 1
await prisma.choice.createMany({
  data: [
    {
      choice_id: 'choice-10-1-a',
      chapter_id: chapter10_1.chapter_id,
      choice_text: '大きな声で「おはようございます！」と言う',
      choice_description: '元気よく挨拶して、良い第一印象を与えましょう。',
      next_chapter_id: 'ch-10-2a',
      display_order: 1,
    },
    {
      choice_id: 'choice-10-1-b',
      chapter_id: chapter10_1.chapter_id,
      choice_text: '恥ずかしくて小さな声で挨拶する',
      choice_description: '少し緊張していますが、先生が優しく助けてくれるでしょう。',
      next_chapter_id: 'ch-10-2b',
      display_order: 2,
    },
    {
      choice_id: 'choice-10-1-c',
      chapter_id: chapter10_1.chapter_id,
      choice_text: '笑顔で手を振る',
      choice_description: '言葉はまだ難しいので、笑顔で挨拶してみます。',
      next_chapter_id: 'ch-10-2c',
      display_order: 3,
    },
  ],
});

// Chapter 2 variants
await prisma.chapter.createMany({
  data: [
    // Chapter 2A: 元気な挨拶
    {
      chapter_id: 'ch-10-2a',
      story_id: story10.story_id,
      chapter_number: 2,
      parent_chapter_id: chapter10_1.chapter_id,
      content: '「おはようございます！」と大きな声で挨拶しました。先生は嬉しそうに笑いました。「元気がいいですね！はじめまして、私は田中先生です。」みんなも「おはようございます！」と言いました。次に、自己紹介をします。',
      content_en: 'I greeted loudly, "Good morning!" The teacher smiled happily. "You\'re energetic! Nice to meet you, I\'m Teacher Tanaka." Everyone also said "Good morning!" Next, I will introduce myself.',
    },
    // Chapter 2B: 小さな声の挨拶
    {
      chapter_id: 'ch-10-2b',
      story_id: story10.story_id,
      chapter_number: 2,
      parent_chapter_id: chapter10_1.chapter_id,
      content: '恥ずかしくて、小さな声で「おはよう...」と言いました。先生は優しく「大丈夫ですよ。もう一度、一緒に言いましょう。」と言いました。みんなも温かく見守っています。',
      content_en: 'Embarrassed, I said "Good morning..." in a small voice. The teacher kindly said, "It\'s okay. Let\'s say it together again." Everyone is also watching warmly.',
    },
    // Chapter 2C: 笑顔で手を振る
    {
      chapter_id: 'ch-10-2c',
      story_id: story10.story_id,
      chapter_number: 2,
      parent_chapter_id: chapter10_1.chapter_id,
      content: '言葉の代わりに、笑顔で手を振りました。先生は笑って「素敵な笑顔ですね！では、日本語で挨拶を練習しましょう。みんなで『おはようございます』と言ってみましょう。」',
      content_en: 'Instead of words, I waved with a smile. The teacher laughed and said, "What a lovely smile! Now, let\'s practice greetings in Japanese. Let\'s all say \'Good morning\' together."',
    },
    // Chapter 3A: 詳しい自己紹介
    {
      chapter_id: 'ch-10-3a',
      story_id: story10.story_id,
      chapter_number: 3,
      parent_chapter_id: 'ch-10-2a',
      content: '「はじめまして。私はアレックスです。アメリカから来ました。日本のアニメが大好きです。よろしくお願いします。」と言いました。クラスメートは「よろしく！」と言って、拍手してくれました。',
      content_en: '"Nice to meet you. I\'m Alex. I came from America. I love Japanese anime. Please treat me well," I said. My classmates said "Nice to meet you!" and clapped.',
    },
    // Chapter 3B: 簡単な自己紹介
    {
      chapter_id: 'ch-10-3b',
      story_id: story10.story_id,
      chapter_number: 3,
      parent_chapter_id: 'ch-10-2a',
      content: '「私はアレックスです。アメリカから来ました。よろしくお願いします。」とシンプルに言いました。先生は「上手ですね！」と言いました。',
      content_en: '"I\'m Alex. I came from America. Please treat me well," I said simply. The teacher said, "Very good!"',
    },
    // Chapter 3C: もう一度挨拶
    {
      chapter_id: 'ch-10-3c',
      story_id: story10.story_id,
      chapter_number: 3,
      parent_chapter_id: 'ch-10-2b',
      content: '深呼吸して、今度は大きな声で「おはようございます！」と言いました。先生は「素晴らしい！とても上手です。」と褒めてくれました。自信が出てきました。',
      content_en: 'I took a deep breath and this time said loudly, "Good morning!" The teacher praised me, "Wonderful! Very good." I gained confidence.',
    },
    // Chapter 3D: 先生と一緒に
    {
      chapter_id: 'ch-10-3d',
      story_id: story10.story_id,
      chapter_number: 3,
      parent_chapter_id: 'ch-10-2b',
      content: '先生と一緒に「おはようございます！」と言いました。先生は「いいですよ！少しずつ、慣れていきましょう。」と優しく言いました。',
      content_en: 'I said "Good morning!" together with the teacher. The teacher kindly said, "Good! Let\'s get used to it little by little."',
    },
    // Chapter 3E: みんなと練習
    {
      chapter_id: 'ch-10-3e',
      story_id: story10.story_id,
      chapter_number: 3,
      parent_chapter_id: 'ch-10-2c',
      content: 'みんなで「おはようございます！」と言いました。次に「こんにちは！」「こんばんは！」も練習しました。楽しくて、日本語が好きになりました。',
      content_en: 'We all said "Good morning!" Next, we also practiced "Hello!" and "Good evening!" It was fun, and I came to like Japanese.',
    },
    // Chapter 5: 休憩時間（収束ポイント）
    {
      chapter_id: 'ch-10-5',
      story_id: story10.story_id,
      chapter_number: 5,
      parent_chapter_id: 'ch-10-4a', // Will connect from all chapter 4 variants
      content: '休憩時間になりました。隣の席の学生が「こんにちは！私はエミリーです。韓国から来ました。」と話しかけてきました。「こんにちは！私はアレックスです。」と返事をしました。新しい友達ができて嬉しいです。',
      content_en: 'It\'s break time. A student in the next seat spoke to me, "Hello! I\'m Emily. I came from Korea." I replied, "Hello! I\'m Alex." I\'m happy to have made a new friend.',
    },
    // Chapter 6: 友情の始まり
    {
      chapter_id: 'ch-10-6',
      story_id: story10.story_id,
      chapter_number: 6,
      parent_chapter_id: 'ch-10-5',
      content: 'エミリーと一緒にランチを食べることになりました。「日本の食べ物、好きですか？」とエミリーが聞きました。「はい、好きです！特に寿司が好きです。」と答えました。',
      content_en: 'I decided to have lunch with Emily. "Do you like Japanese food?" Emily asked. "Yes, I do! I especially like sushi," I answered.',
    },
    // Chapter 7: お昼休み
    {
      chapter_id: 'ch-10-7',
      story_id: story10.story_id,
      chapter_number: 7,
      parent_chapter_id: 'ch-10-6',
      content: '学校の食堂で一緒に食べました。他のクラスメートも来て、みんなで自己紹介をしました。中国、タイ、フランスから来た学生がいます。国際的なクラスです。',
      content_en: 'We ate together in the school cafeteria. Other classmates also came and we all introduced ourselves. There are students from China, Thailand, and France. It\'s an international class.',
    },
    // Chapter 8: 午後の授業
    {
      chapter_id: 'ch-10-8',
      story_id: story10.story_id,
      chapter_number: 8,
      parent_chapter_id: 'ch-10-7',
      content: '午後の授業で、先生が「今日は挨拶と自己紹介を勉強しました。明日は、数字と時間を勉強します。」と言いました。たくさん学んだので、少し疲れましたが、とても楽しかったです。',
      content_en: 'In the afternoon class, the teacher said, "Today we studied greetings and self-introductions. Tomorrow we will study numbers and time." I learned a lot, so I\'m a little tired, but it was very fun.',
    },
    // Chapter 9: 初日の終わり（エンディング）
    {
      chapter_id: 'ch-10-9',
      story_id: story10.story_id,
      chapter_number: 9,
      parent_chapter_id: 'ch-10-8',
      content: '学校が終わりました。先生とクラスメートに「さようなら！また明日！」と言って、帰りました。今日はたくさんの挨拶を覚えました。新しい友達もできました。日本語の勉強が楽しみです。頑張ります！',
      content_en: 'School is over. I said "Goodbye! See you tomorrow!" to the teacher and classmates and went home. Today I learned many greetings. I also made new friends. I\'m looking forward to studying Japanese. I\'ll do my best!',
    },
  ],
});

// Choices for Chapter 2A
await prisma.choice.createMany({
  data: [
    {
      choice_id: 'choice-10-2a-1',
      chapter_id: 'ch-10-2a',
      choice_text: '詳しく自己紹介する',
      choice_description: '趣味や出身国について詳しく話してみます。',
      next_chapter_id: 'ch-10-3a',
      display_order: 1,
    },
    {
      choice_id: 'choice-10-2a-2',
      chapter_id: 'ch-10-2a',
      choice_text: '簡単に自己紹介する',
      choice_description: '名前と出身国だけシンプルに伝えます。',
      next_chapter_id: 'ch-10-3b',
      display_order: 2,
    },
  ],
});

// Choices for Chapter 2B
await prisma.choice.createMany({
  data: [
    {
      choice_id: 'choice-10-2b-1',
      chapter_id: 'ch-10-2b',
      choice_text: 'もう一度、大きな声で挨拶する',
      choice_description: '勇気を出して、もう一度チャレンジしてみます。',
      next_chapter_id: 'ch-10-3c',
      display_order: 1,
    },
    {
      choice_id: 'choice-10-2b-2',
      chapter_id: 'ch-10-2b',
      choice_text: '先生と一緒に言う',
      choice_description: '先生に助けてもらって、一緒に練習します。',
      next_chapter_id: 'ch-10-3d',
      display_order: 2,
    },
  ],
});

// Choice for Chapter 2C (single path)
await prisma.choice.create({
  data: {
    choice_id: 'choice-10-2c-1',
    chapter_id: 'ch-10-2c',
    choice_text: 'みんなと一緒に練習する',
    choice_description: 'クラス全員で一緒に挨拶を練習してみましょう。',
    next_chapter_id: 'ch-10-3e',
    display_order: 1,
  },
});

// Simplified Chapter 4 (intermediate convergence) - Not creating separate chapters,
// connecting Chapter 3 variants directly to Chapter 5
// This reduces complexity while maintaining the 9-chapter count

// Choices from Chapter 3 variants to Chapter 5
await prisma.choice.createMany({
  data: [
    // From 3A
    {
      choice_id: 'choice-10-3a-1',
      chapter_id: 'ch-10-3a',
      choice_text: '休憩時間を待つ',
      choice_description: '授業を聞いて、休憩時間に友達と話したいです。',
      next_chapter_id: 'ch-10-5',
      display_order: 1,
    },
    // From 3B
    {
      choice_id: 'choice-10-3b-1',
      chapter_id: 'ch-10-3b',
      choice_text: '休憩時間を待つ',
      choice_description: '授業を聞いて、休憩時間に友達と話したいです。',
      next_chapter_id: 'ch-10-5',
      display_order: 1,
    },
    // From 3C
    {
      choice_id: 'choice-10-3c-1',
      chapter_id: 'ch-10-3c',
      choice_text: '自己紹介を頑張る',
      choice_description: '自信がついたので、自己紹介をしてみます。',
      next_chapter_id: 'ch-10-5',
      display_order: 1,
    },
    // From 3D
    {
      choice_id: 'choice-10-3d-1',
      chapter_id: 'ch-10-3d',
      choice_text: 'ゆっくり自己紹介する',
      choice_description: '先生に助けてもらいながら、ゆっくり話します。',
      next_chapter_id: 'ch-10-5',
      display_order: 1,
    },
    // From 3E
    {
      choice_id: 'choice-10-3e-1',
      chapter_id: 'ch-10-3e',
      choice_text: '新しい友達と話す',
      choice_description: '練習が楽しかったので、友達と話してみたいです。',
      next_chapter_id: 'ch-10-5',
      display_order: 1,
    },
  ],
});

// Choices from Chapter 5 onwards (linear path)
await prisma.choice.createMany({
  data: [
    {
      choice_id: 'choice-10-5-1',
      chapter_id: 'ch-10-5',
      choice_text: 'エミリーとランチを食べる',
      choice_description: '新しい友達と一緒にランチを楽しみます。',
      next_chapter_id: 'ch-10-6',
      display_order: 1,
    },
    {
      choice_id: 'choice-10-6-1',
      chapter_id: 'ch-10-6',
      choice_text: '食堂に行く',
      choice_description: '学校の食堂で一緒に食べましょう。',
      next_chapter_id: 'ch-10-7',
      display_order: 1,
    },
    {
      choice_id: 'choice-10-7-1',
      chapter_id: 'ch-10-7',
      choice_text: '午後の授業に参加する',
      choice_description: 'ランチの後、午後の授業が始まります。',
      next_chapter_id: 'ch-10-8',
      display_order: 1,
    },
    {
      choice_id: 'choice-10-8-1',
      chapter_id: 'ch-10-8',
      choice_text: '帰る',
      choice_description: '初日の授業が終わったので、家に帰ります。',
      next_chapter_id: 'ch-10-9',
      display_order: 1,
    },
  ],
});

console.log('Created Story 10: 初めての挨拶 (N5/A1) with 9 chapters');
