// ============================================================
// Story 11: 家族の紹介 (N5/A1) - 9 Chapters with Branching
// ============================================================
const story11 = await prisma.story.create({
  data: {
    story_id: '11',
    title: '家族の紹介',
    title_en: 'Introducing My Family',
    description: 'ホストファミリーに初めて会う日。自分の家族を紹介しながら、家族を表す語彙や人の特徴を説明する表現を学びます。',
    description_en: 'First day meeting your host family. Learn vocabulary for family members and expressions to describe people\'s characteristics while introducing your family.',
    category: 'family',
    difficulty_level: 'beginner',
    level_jlpt: 'N5',
    level_cefr: 'A1',
    estimated_time: 8,
    estimated_duration_minutes: 8,
    is_active: true,
    root_chapter_id: 'ch-11-1',
  },
});

// Root chapter
const chapter11_1 = await prisma.chapter.create({
  data: {
    chapter_id: 'ch-11-1',
    story_id: story11.story_id,
    chapter_number: 1,
    content: '今日はホストファミリーの家に着きました。田中さん一家が温かく迎えてくれました。「家族の写真を持ってきました。紹介してもいいですか？」と聞くと、みんな「見たい！見たい！」と言ってくれました。誰から紹介しますか？',
    content_en: 'Today I arrived at my host family\'s house. The Tanaka family welcomed me warmly. When I asked, "I brought family photos. May I introduce them?" everyone said, "We want to see! We want to see!" Who should I introduce first?',
  },
});

await prisma.choice.createMany({
  data: [
    {
      choice_id: 'choice-11-1-a',
      chapter_id: chapter11_1.chapter_id,
      choice_text: '父から紹介する',
      choice_description: '父の仕事や性格について話してみます。',
      next_chapter_id: 'ch-11-2a',
      display_order: 1,
    },
    {
      choice_id: 'choice-11-1-b',
      chapter_id: chapter11_1.chapter_id,
      choice_text: '母から紹介する',
      choice_description: '母の仕事や趣味について話してみます。',
      next_chapter_id: 'ch-11-2b',
      display_order: 2,
    },
    {
      choice_id: 'choice-11-1-c',
      chapter_id: chapter11_1.chapter_id,
      choice_text: '家族写真を全部見せる',
      choice_description: 'みんなをまとめて紹介してみます。',
      next_chapter_id: 'ch-11-2c',
      display_order: 3,
    },
  ],
});

await prisma.chapter.createMany({
  data: [
    {
      chapter_id: 'ch-11-2a',
      story_id: story11.story_id,
      chapter_number: 2,
      parent_chapter_id: chapter11_1.chapter_id,
      content: '「これは私の父です。名前はジョンです。50歳です。父は会社員です。」田中さんのお母さんが「どんなお仕事ですか？」と興味深そうに聞きました。',
      content_en: '"This is my father. His name is John. He is 50 years old. My father is a company employee." Mrs. Tanaka asked with interest, "What kind of work does he do?"',
    },
    {
      chapter_id: 'ch-11-2b',
      story_id: story11.story_id,
      chapter_number: 2,
      parent_chapter_id: chapter11_1.chapter_id,
      content: '「これは私の母です。名前はメアリーです。48歳です。母は看護師です。」田中さんのお父さんが「素晴らしいですね！優しいお母さんでしょう？」と言いました。「はい、とても優しいです。」と答えました。',
      content_en: '"This is my mother. Her name is Mary. She is 48 years old. My mother is a nurse." Mr. Tanaka said, "That\'s wonderful! She must be a kind mother, right?" I answered, "Yes, she is very kind."',
    },
    {
      chapter_id: 'ch-11-2c',
      story_id: story11.story_id,
      chapter_number: 2,
      parent_chapter_id: chapter11_1.chapter_id,
      content: '大きな家族写真を見せました。「これが私の家族です。父、母、兄、妹、そして私です。5人家族です。」みんなが「わあ！素敵な家族ですね！」と言ってくれました。',
      content_en: 'I showed them a large family photo. "This is my family. Father, mother, older brother, younger sister, and me. We are a family of five." Everyone said, "Wow! What a wonderful family!"',
    },
    {
      chapter_id: 'ch-11-3a',
      story_id: story11.story_id,
      chapter_number: 3,
      parent_chapter_id: 'ch-11-2a',
      content: '「父はエンジニアです。コンピューターの仕事をしています。とても忙しいですが、週末は家族と過ごします。父は優しくて、面白いです。」と話しました。みんなが笑顔で聞いてくれました。',
      content_en: '"My father is an engineer. He works with computers. He is very busy, but spends weekends with the family. My father is kind and funny," I said. Everyone listened with smiles.',
    },
    {
      chapter_id: 'ch-11-3b',
      story_id: story11.story_id,
      chapter_number: 3,
      parent_chapter_id: 'ch-11-2a',
      content: '「次は私の母です。名前はメアリーです。母は看護師です。とても優しくて、料理が上手です。」田中さんの娘さんが「素敵なお母さんですね！」と言いました。',
      content_en: '"Next is my mother. Her name is Mary. My mother is a nurse. She is very kind and good at cooking." Tanaka\'s daughter said, "What a lovely mother!"',
    },
    {
      chapter_id: 'ch-11-3c',
      story_id: story11.story_id,
      chapter_number: 3,
      parent_chapter_id: 'ch-11-2b',
      content: '「母の趣味はガーデニングです。花が大好きです。家の庭にはたくさんの花があります。母は毎日、花の世話をします。」田中さんのお母さんが「私もガーデニングが好きです！今度一緒に庭を見ましょう。」と言いました。',
      content_en: '"My mother\'s hobby is gardening. She loves flowers. There are many flowers in our garden at home. My mother takes care of the flowers every day." Mrs. Tanaka said, "I also like gardening! Let\'s look at the garden together next time."',
    },
    {
      chapter_id: 'ch-11-3d',
      story_id: story11.story_id,
      chapter_number: 3,
      parent_chapter_id: 'ch-11-2b',
      content: '「これは私の兄です。名前はトムです。22歳です。大学生です。兄は背が高くて、スポーツが好きです。」田中さんの息子さんが「かっこいいですね！何のスポーツをしますか？」と聞きました。',
      content_en: '"This is my older brother. His name is Tom. He is 22 years old. He is a university student. My brother is tall and likes sports." Tanaka\'s son asked, "He looks cool! What sport does he play?"',
    },
    {
      chapter_id: 'ch-11-3e',
      story_id: story11.story_id,
      chapter_number: 3,
      parent_chapter_id: 'ch-11-2c',
      content: '「では、一人ずつ紹介します。父はジョン、会社員です。母はメアリー、看護師です。兄はトム、大学生です。妹はエミリー、高校生です。」みんながうなずきながら聞いてくれました。',
      content_en: '"Now, let me introduce them one by one. My father is John, a company employee. My mother is Mary, a nurse. My brother is Tom, a university student. My sister is Emily, a high school student." Everyone nodded and listened.',
    },
    {
      chapter_id: 'ch-11-4',
      story_id: story11.story_id,
      chapter_number: 4,
      parent_chapter_id: 'ch-11-3a',
      content: '「私には兄が一人と妹が一人います。兄はトム、22歳です。大学でコンピューターを勉強しています。妹はエミリー、16歳です。高校生で、音楽が大好きです。」田中さん一家がとても興味深そうに聞いてくれました。',
      content_en: '"I have one older brother and one younger sister. My brother Tom is 22 years old. He studies computers at university. My sister Emily is 16 years old. She is a high school student and loves music." The Tanaka family listened with great interest.',
    },
    {
      chapter_id: 'ch-11-5',
      story_id: story11.story_id,
      chapter_number: 5,
      parent_chapter_id: 'ch-11-4',
      content: '「週末、私の家族はよく一緒に過ごします。父と兄はサッカーをします。母と妹は買い物に行きます。私は時々みんなと一緒に、時々一人で本を読みます。」田中さんのお父さんが「素敵な家族ですね！」と言いました。',
      content_en: '"On weekends, my family often spends time together. My father and brother play soccer. My mother and sister go shopping. I sometimes join everyone, and sometimes read books alone." Mr. Tanaka said, "What a wonderful family!"',
    },
    {
      chapter_id: 'ch-11-6',
      story_id: story11.story_id,
      chapter_number: 6,
      parent_chapter_id: 'ch-11-5',
      content: '「では、私たちの家族も紹介しましょう！」と田中さんが言いました。「私は田中健、妻は由美、息子は太郎で15歳、娘は花子で12歳です。4人家族です。」みんなで自己紹介をしました。',
      content_en: '"Now, let us introduce our family too!" said Mr. Tanaka. "I am Tanaka Ken, my wife is Yumi, our son is Taro, 15 years old, and our daughter is Hanako, 12 years old. We are a family of four." Everyone introduced themselves.',
    },
    {
      chapter_id: 'ch-11-7',
      story_id: story11.story_id,
      chapter_number: 7,
      parent_chapter_id: 'ch-11-6',
      content: '話をしているうちに、たくさんの共通点を見つけました。太郎くんも兄のトムと同じようにスポーツが好きです。花子ちゃんも妹のエミリーと同じように音楽が好きです。「これから、家族みたいに過ごしましょう！」と田中さんが言いました。',
      content_en: 'As we talked, we found many things in common. Taro also likes sports like my brother Tom. Hanako also likes music like my sister Emily. "From now on, let\'s spend time together like family!" said Mr. Tanaka.',
    },
    {
      chapter_id: 'ch-11-8',
      story_id: story11.story_id,
      chapter_number: 8,
      parent_chapter_id: 'ch-11-7',
      content: '田中さん一家も家族写真を見せてくれました。海に行った時の写真、お祭りの写真、たくさんの思い出がありました。「私も日本で新しい思い出を作りたいです。」と言うと、みんなが「一緒に作りましょう！」と笑顔で言いました。',
      content_en: 'The Tanaka family also showed me their family photos. Photos from the beach, festival photos, so many memories. When I said, "I want to make new memories in Japan too," everyone smiled and said, "Let\'s make them together!"',
    },
    {
      chapter_id: 'ch-11-9',
      story_id: story11.story_id,
      chapter_number: 9,
      parent_chapter_id: 'ch-11-8',
      content: '今日は家族について話しました。アメリカの家族も、日本のホストファミリーも、みんな大切な家族です。これから、田中さん一家と一緒に過ごします。新しい家族ができて、とても嬉しいです。日本での生活が楽しみです！',
      content_en: 'Today I talked about family. Both my family in America and my host family in Japan are precious families. From now on, I will spend time with the Tanaka family. I\'m very happy to have a new family. I\'m looking forward to life in Japan!',
    },
  ],
});

// Choices
await prisma.choice.createMany({
  data: [
    { choice_id: 'choice-11-2a-1', chapter_id: 'ch-11-2a', choice_text: '父の仕事について詳しく話す', choice_description: 'エンジニアの仕事について説明します。', next_chapter_id: 'ch-11-3a', display_order: 1 },
    { choice_id: 'choice-11-2a-2', chapter_id: 'ch-11-2a', choice_text: '母の紹介に移る', choice_description: '母について話します。', next_chapter_id: 'ch-11-3b', display_order: 2 },
    { choice_id: 'choice-11-2b-1', chapter_id: 'ch-11-2b', choice_text: '母の趣味を話す', choice_description: 'ガーデニングについて話します。', next_chapter_id: 'ch-11-3c', display_order: 1 },
    { choice_id: 'choice-11-2b-2', chapter_id: 'ch-11-2b', choice_text: '兄弟の紹介に移る', choice_description: '兄について話します。', next_chapter_id: 'ch-11-3d', display_order: 2 },
    { choice_id: 'choice-11-2c-1', chapter_id: 'ch-11-2c', choice_text: '一人ずつ詳しく紹介する', choice_description: '家族全員を順番に紹介します。', next_chapter_id: 'ch-11-3e', display_order: 1 },
    { choice_id: 'choice-11-3a-1', chapter_id: 'ch-11-3a', choice_text: '兄弟姉妹の紹介へ', choice_description: '兄と妹について話します。', next_chapter_id: 'ch-11-4', display_order: 1 },
    { choice_id: 'choice-11-3b-1', chapter_id: 'ch-11-3b', choice_text: '兄弟姉妹の紹介へ', choice_description: '兄と妹について話します。', next_chapter_id: 'ch-11-4', display_order: 1 },
    { choice_id: 'choice-11-3c-1', chapter_id: 'ch-11-3c', choice_text: '兄弟姉妹の紹介へ', choice_description: '兄と妹について話します。', next_chapter_id: 'ch-11-4', display_order: 1 },
    { choice_id: 'choice-11-3d-1', chapter_id: 'ch-11-3d', choice_text: '兄のスポーツについて話す', choice_description: 'サッカーについて詳しく話します。', next_chapter_id: 'ch-11-4', display_order: 1 },
    { choice_id: 'choice-11-3e-1', chapter_id: 'ch-11-3e', choice_text: 'それぞれの特徴を話す', choice_description: '家族の性格や趣味を話します。', next_chapter_id: 'ch-11-4', display_order: 1 },
    { choice_id: 'choice-11-4-1', chapter_id: 'ch-11-4', choice_text: '家族の週末の過ごし方を話す', choice_description: '週末の家族時間について話します。', next_chapter_id: 'ch-11-5', display_order: 1 },
    { choice_id: 'choice-11-5-1', chapter_id: 'ch-11-5', choice_text: 'ホストファミリーの紹介を聞く', choice_description: '田中さん一家の紹介を聞きます。', next_chapter_id: 'ch-11-6', display_order: 1 },
    { choice_id: 'choice-11-6-1', chapter_id: 'ch-11-6', choice_text: '共通点を見つける', choice_description: '家族同士の共通点を話し合います。', next_chapter_id: 'ch-11-7', display_order: 1 },
    { choice_id: 'choice-11-7-1', chapter_id: 'ch-11-7', choice_text: '家族写真を交換する', choice_description: 'お互いの家族写真を見せ合います。', next_chapter_id: 'ch-11-8', display_order: 1 },
    { choice_id: 'choice-11-8-1', chapter_id: 'ch-11-8', choice_text: '新しい家族との生活を楽しみにする', choice_description: 'これからの生活に期待します。', next_chapter_id: 'ch-11-9', display_order: 1 },
  ],
});

console.log('Created Story 11: 家族の紹介 (N5/A1) with 9 chapters');
