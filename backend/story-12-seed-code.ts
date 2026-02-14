// Story 12: 好きな食べ物 (Favorite Foods) - N5/A1
// Category: food_preferences

const story12 = await prisma.story.create({
  data: {
    story_id: '12',
    title: '好きな食べ物',
    title_en: 'Favorite Foods',
    description: '学校のカフェテリアで、クラスメートと昼ごはんを食べながら、好きな食べ物について話します。日本の食べ物や世界の食べ物について、「好き」「嫌い」の表現を練習します。あなたの選択で物語が変わります。',
    description_en: 'At the school cafeteria, you talk about your favorite foods while having lunch with classmates. Practice expressing likes and dislikes about Japanese and world foods. Your choices will change the story.',
    category: 'food_preferences',
    difficulty_level: 'beginner',
    level_jlpt: 'N5',
    level_cefr: 'A1',
    estimated_time: 8,
    estimated_duration_minutes: 8,
    is_active: true,
    root_chapter_id: 'ch-12-1',
  },
});

// Create chapters
await prisma.chapter.createMany({
  data: [
    // Chapter 1: Root - カフェテリアで
    {
      chapter_id: 'ch-12-1',
      story_id: story12.story_id,
      chapter_number: 1,
      content: '今日は学校のカフェテリアで昼ごはんの時間です。クラスメートのユキさんとケンさんが話しています。「こんにちは！一緒に食べませんか？」とユキさんが言います。\n\n今日のメニューは：カレー、ラーメン、寿司、サラダがあります。\n\nあなたは何を選びますか？',
      content_en: 'It\'s lunchtime at the school cafeteria. Your classmates Yuki-san and Ken-san are talking. "Hello! Would you like to eat together?" says Yuki-san.\n\nToday\'s menu includes: curry, ramen, sushi, and salad.\n\nWhat will you choose?',
      parent_chapter_id: null,
    },

    // Chapter 2A: カレーが好き
    {
      chapter_id: 'ch-12-2a',
      story_id: story12.story_id,
      chapter_number: 2,
      content: '「カレーが好きなんですね！」とユキさんが言います。「日本のカレーはどうですか？」\n\n「日本のカレーは甘くておいしいです。私の国のカレーは辛いです」とあなたは答えます。\n\nケンさんが聞きます：「他にどんな食べ物が好きですか？」',
      content_en: '"You like curry!" says Yuki-san. "How do you like Japanese curry?"\n\n"Japanese curry is sweet and delicious. Curry in my country is spicy," you answer.\n\nKen-san asks: "What other foods do you like?"',
      parent_chapter_id: 'ch-12-1',
    },

    // Chapter 2B: ラーメン大好き
    {
      chapter_id: 'ch-12-2b',
      story_id: story12.story_id,
      chapter_number: 2,
      content: '「わあ、ラーメンですね！」とケンさんが言います。「私もラーメンが大好きです。どんなラーメンが好きですか？」\n\n「味噌ラーメンが好きです。とても温かいです」とあなたは言います。\n\nユキさんが聞きます：「辛い食べ物は好きですか？」',
      content_en: '"Wow, ramen!" says Ken-san. "I love ramen too. What kind of ramen do you like?"\n\n"I like miso ramen. It\'s very warm," you say.\n\nYuki-san asks: "Do you like spicy food?"',
      parent_chapter_id: 'ch-12-1',
    },

    // Chapter 2C: 寿司を食べる
    {
      chapter_id: 'ch-12-2c',
      story_id: story12.story_id,
      chapter_number: 2,
      content: '「寿司ですか！いいですね」とユキさんが言います。「初めて寿司を食べますか？」\n\n「いいえ、私の国でも寿司を食べます。でも日本の寿司は特別においしいです」とあなたは言います。\n\nケンさんが聞きます：「生の魚は大丈夫ですか？」',
      content_en: '"Sushi! That\'s great," says Yuki-san. "Is this your first time eating sushi?"\n\n"No, I eat sushi in my country too. But Japanese sushi is especially delicious," you say.\n\nKen-san asks: "Are you okay with raw fish?"',
      parent_chapter_id: 'ch-12-1',
    },

    // Chapter 3A: お肉料理の話
    {
      chapter_id: 'ch-12-3a',
      story_id: story12.story_id,
      chapter_number: 3,
      content: '「お肉が好きなんですね」とユキさんが言います。「日本の焼肉を食べたことがありますか？」\n\n「まだです。でも食べてみたいです！」とあなたは言います。\n\n「今度一緒に焼肉に行きましょう！」とケンさんが提案します。',
      content_en: '"You like meat," says Yuki-san. "Have you ever eaten Japanese yakiniku (grilled meat)?"\n\n"Not yet. But I want to try it!" you say.\n\n"Let\'s go to yakiniku together sometime!" suggests Ken-san.',
      parent_chapter_id: 'ch-12-2a',
    },

    // Chapter 3B: 野菜の話
    {
      chapter_id: 'ch-12-3b',
      story_id: story12.story_id,
      chapter_number: 3,
      content: '「野菜が好きなんですね。健康的ですね！」とケンさんが言います。\n\n「はい、サラダが大好きです。果物も好きです」とあなたは言います。\n\n「日本の野菜はどうですか？」とユキさんが聞きます。\n\n「新鮮でおいしいです！」と答えます。',
      content_en: '"You like vegetables. That\'s healthy!" says Ken-san.\n\n"Yes, I love salad. I also like fruit," you say.\n\n"How do you like Japanese vegetables?" asks Yuki-san.\n\n"They\'re fresh and delicious!" you answer.',
      parent_chapter_id: 'ch-12-2a',
    },

    // Chapter 3C: 辛い食べ物が好き
    {
      chapter_id: 'ch-12-3c',
      story_id: story12.story_id,
      chapter_number: 3,
      content: '「そうですか！辛いラーメンもありますよ」とケンさんが言います。\n\n「本当ですか？食べてみたいです！」とあなたは答えます。\n\n「韓国料理も好きですか？」とユキさんが聞きます。\n\n「はい、キムチが大好きです」と言います。',
      content_en: '"I see! There\'s also spicy ramen," says Ken-san.\n\n"Really? I want to try it!" you answer.\n\n"Do you also like Korean food?" asks Yuki-san.\n\n"Yes, I love kimchi," you say.',
      parent_chapter_id: 'ch-12-2b',
    },

    // Chapter 3D: 辛くない方が好き
    {
      chapter_id: 'ch-12-3d',
      story_id: story12.story_id,
      chapter_number: 3,
      content: '「そうですか。私も辛い食べ物はあまり好きじゃないです」とユキさんが言います。\n\n「甘い食べ物は好きですか？」とケンさんが聞きます。\n\n「はい、デザートが大好きです！」とあなたは答えます。',
      content_en: '"I see. I also don\'t really like spicy food," says Yuki-san.\n\n"Do you like sweet foods?" asks Ken-san.\n\n"Yes, I love desserts!" you answer.',
      parent_chapter_id: 'ch-12-2b',
    },

    // Chapter 3E: 生魚が大好き
    {
      chapter_id: 'ch-12-3e',
      story_id: story12.story_id,
      chapter_number: 3,
      content: '「それは良かったです！日本の寿司は新鮮ですから」とユキさんが言います。\n\n「サーモンとマグロが特に好きです」とあなたは言います。\n\n「今度、回転寿司に行きませんか？」とケンさんが提案します。\n\n「ぜひ行きたいです！」と答えます。',
      content_en: '"That\'s great! Japanese sushi is fresh," says Yuki-san.\n\n"I especially like salmon and tuna," you say.\n\n"Would you like to go to a conveyor belt sushi restaurant sometime?" suggests Ken-san.\n\n"I\'d love to!" you answer.',
      parent_chapter_id: 'ch-12-2c',
    },

    // Chapter 4: デザートの話 (Convergence point)
    {
      chapter_id: 'ch-12-4',
      story_id: story12.story_id,
      chapter_number: 4,
      content: '食事が終わって、みんなデザートを選びます。\n\n「デザートは何が好きですか？」とユキさんが聞きます。\n\nカフェテリアには、アイスクリーム、ケーキ、果物があります。',
      content_en: 'After the meal, everyone chooses dessert.\n\n"What dessert do you like?" asks Yuki-san.\n\nThe cafeteria has ice cream, cake, and fruit.',
      parent_chapter_id: 'ch-12-3a',
    },

    // Chapter 5: 好きな果物
    {
      chapter_id: 'ch-12-5',
      story_id: story12.story_id,
      chapter_number: 5,
      content: '「私はアイスクリームが大好きです！」とあなたは言います。\n\n「日本の果物は食べたことがありますか？」とケンさんが聞きます。\n\n「イチゴを食べました。とても甘くておいしかったです」と答えます。\n\n「良かったです！」とみんなが笑います。',
      content_en: '"I love ice cream!" you say.\n\n"Have you tried Japanese fruits?" asks Ken-san.\n\n"I ate strawberries. They were very sweet and delicious," you answer.\n\n"That\'s great!" everyone laughs.',
      parent_chapter_id: 'ch-12-4',
    },

    // Chapter 6: 食べ物の好みを共有
    {
      chapter_id: 'ch-12-6',
      story_id: story12.story_id,
      chapter_number: 6,
      content: '「今日は楽しかったです。好きな食べ物について話せて嬉しいです」とあなたは言います。\n\n「また一緒に食べましょう！」とユキさんが言います。\n\n「次は何を食べたいですか？」とケンさんが聞きます。',
      content_en: '"Today was fun. I\'m glad we could talk about our favorite foods," you say.\n\n"Let\'s eat together again!" says Yuki-san.\n\n"What do you want to eat next time?" asks Ken-san.',
      parent_chapter_id: 'ch-12-5',
    },

    // Chapter 7: 週末の計画
    {
      chapter_id: 'ch-12-7',
      story_id: story12.story_id,
      chapter_number: 7,
      content: '「週末、一緒にレストランに行きませんか？」とユキさんが提案します。\n\n「いいですね！どんなレストランがいいですか？」とあなたは聞きます。\n\n「日本料理のレストランはどうですか？」とケンさんが言います。',
      content_en: '"Would you like to go to a restaurant together this weekend?" suggests Yuki-san.\n\n"That sounds great! What kind of restaurant would be good?" you ask.\n\n"How about a Japanese restaurant?" says Ken-san.',
      parent_chapter_id: 'ch-12-6',
    },

    // Chapter 8: 新しい食べ物に挑戦
    {
      chapter_id: 'ch-12-8',
      story_id: story12.story_id,
      chapter_number: 8,
      content: '「日本には色々な食べ物があります。まだ食べていないものはありますか？」とユキさんが聞きます。\n\n「天ぷらを食べてみたいです」とあなたは言います。\n\n「天ぷらはおいしいですよ！」とケンさんが言います。',
      content_en: '"There are many different foods in Japan. Is there anything you haven\'t tried yet?" asks Yuki-san.\n\n"I want to try tempura," you say.\n\n"Tempura is delicious!" says Ken-san.',
      parent_chapter_id: 'ch-12-7',
    },

    // Chapter 9: まとめ (Ending)
    {
      chapter_id: 'ch-12-9',
      story_id: story12.story_id,
      chapter_number: 9,
      content: '今日のカフェテリアでの会話はとても楽しかったです。\n\nあなたは：\n- 好きな食べ物について話しました\n- 「好き」「嫌い」の表現を練習しました\n- 日本の食べ物について学びました\n- 新しい友達と食事の計画を立てました\n\n次回はレストランで、もっと日本の食べ物を楽しみましょう！',
      content_en: 'Today\'s conversation at the cafeteria was very enjoyable.\n\nYou:\n- Talked about your favorite foods\n- Practiced expressing likes and dislikes\n- Learned about Japanese foods\n- Made plans to eat with new friends\n\nNext time, let\'s enjoy more Japanese foods at a restaurant!',
      parent_chapter_id: 'ch-12-8',
    },
  ],
});

// Create choices for branching narrative
await prisma.choice.createMany({
  data: [
    // Chapter 1 choices (3 main branches)
    {
      choice_id: 'choice-12-1-a',
      chapter_id: 'ch-12-1',
      choice_text: 'カレーを選ぶ',
      choice_description: 'Choose curry',
      next_chapter_id: 'ch-12-2a',
      display_order: 1,
    },
    {
      choice_id: 'choice-12-1-b',
      chapter_id: 'ch-12-1',
      choice_text: 'ラーメンを選ぶ',
      choice_description: 'Choose ramen',
      next_chapter_id: 'ch-12-2b',
      display_order: 2,
    },
    {
      choice_id: 'choice-12-1-c',
      chapter_id: 'ch-12-1',
      choice_text: '寿司を選ぶ',
      choice_description: 'Choose sushi',
      next_chapter_id: 'ch-12-2c',
      display_order: 3,
    },

    // Chapter 2A choices (2 sub-branches)
    {
      choice_id: 'choice-12-2a-a',
      chapter_id: 'ch-12-2a',
      choice_text: 'お肉が好きです',
      choice_description: 'I like meat',
      next_chapter_id: 'ch-12-3a',
      display_order: 1,
    },
    {
      choice_id: 'choice-12-2a-b',
      chapter_id: 'ch-12-2a',
      choice_text: '野菜が好きです',
      choice_description: 'I like vegetables',
      next_chapter_id: 'ch-12-3b',
      display_order: 2,
    },

    // Chapter 2B choices (2 sub-branches)
    {
      choice_id: 'choice-12-2b-a',
      chapter_id: 'ch-12-2b',
      choice_text: 'はい、辛い食べ物が好きです',
      choice_description: 'Yes, I like spicy food',
      next_chapter_id: 'ch-12-3c',
      display_order: 1,
    },
    {
      choice_id: 'choice-12-2b-b',
      chapter_id: 'ch-12-2b',
      choice_text: 'いいえ、あまり好きじゃないです',
      choice_description: 'No, I don\'t really like it',
      next_chapter_id: 'ch-12-3d',
      display_order: 2,
    },

    // Chapter 2C choice (1 sub-branch)
    {
      choice_id: 'choice-12-2c-a',
      chapter_id: 'ch-12-2c',
      choice_text: 'はい、大好きです',
      choice_description: 'Yes, I love it',
      next_chapter_id: 'ch-12-3e',
      display_order: 1,
    },

    // Chapter 3 choices (all converge to Chapter 4)
    {
      choice_id: 'choice-12-3a-next',
      chapter_id: 'ch-12-3a',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-12-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-12-3b-next',
      chapter_id: 'ch-12-3b',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-12-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-12-3c-next',
      chapter_id: 'ch-12-3c',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-12-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-12-3d-next',
      chapter_id: 'ch-12-3d',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-12-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-12-3e-next',
      chapter_id: 'ch-12-3e',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-12-4',
      display_order: 1,
    },

    // Chapter 4 choice
    {
      choice_id: 'choice-12-4-next',
      chapter_id: 'ch-12-4',
      choice_text: 'アイスクリーム',
      choice_description: 'Ice cream',
      next_chapter_id: 'ch-12-5',
      display_order: 1,
    },

    // Chapter 5-8 linear choices
    {
      choice_id: 'choice-12-5-next',
      chapter_id: 'ch-12-5',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-12-6',
      display_order: 1,
    },
    {
      choice_id: 'choice-12-6-next',
      chapter_id: 'ch-12-6',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-12-7',
      display_order: 1,
    },
    {
      choice_id: 'choice-12-7-next',
      chapter_id: 'ch-12-7',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-12-8',
      display_order: 1,
    },
    {
      choice_id: 'choice-12-8-next',
      chapter_id: 'ch-12-8',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-12-9',
      display_order: 1,
    },
  ],
});

console.log('Created Story 12: 好きな食べ物 (N5/A1) with 9 chapters');
