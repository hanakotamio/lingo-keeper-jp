// Story 13: レストランでの注文 (Ordering at a Restaurant) - N4/A2
// Category: restaurant

const story13 = await prisma.story.create({
  data: {
    story_id: '13',
    title: 'レストランでの注文',
    title_en: 'Ordering at a Restaurant',
    description: '友達と初めて日本のレストランに行きます。メニューを見て、店員さんに注文して、食事を楽しみます。レストランでの基本的な会話表現を学びます。あなたの選択で物語が変わります。',
    description_en: 'You go to a Japanese restaurant for the first time with a friend. Look at the menu, order from the staff, and enjoy your meal. Learn basic conversation expressions at restaurants. Your choices will change the story.',
    category: 'restaurant',
    difficulty_level: 'intermediate',
    level_jlpt: 'N4',
    level_cefr: 'A2',
    estimated_time: 10,
    estimated_duration_minutes: 10,
    is_active: true,
    root_chapter_id: 'ch-13-1',
  },
});

// Create chapters
await prisma.chapter.createMany({
  data: [
    // Chapter 1: Root - レストランに到着
    {
      chapter_id: 'ch-13-1',
      story_id: story13.story_id,
      chapter_number: 1,
      content: '今日は友達のサキさんと日本料理のレストランに来ました。「いらっしゃいませ！何名様ですか？」と店員さんが聞きます。\n\n「2名です」とサキさんが答えます。\n\n店員さんが「こちらのテーブルへどうぞ」と案内してくれました。メニューを見ると、色々な料理があります。\n\n何を注文しますか？',
      content_en: 'Today you came to a Japanese restaurant with your friend Saki-san. "Welcome! How many people?" asks the staff.\n\n"Two people," answers Saki-san.\n\nThe staff shows you to a table: "Please come this way." Looking at the menu, there are many different dishes.\n\nWhat will you order?',
      parent_chapter_id: null,
    },

    // Chapter 2A: 定食メニュー
    {
      chapter_id: 'ch-13-2a',
      story_id: story13.story_id,
      chapter_number: 2,
      content: '定食のページを開きます。「天ぷら定食」「焼き魚定食」「とんかつ定食」があります。\n\nサキさんが「定食はご飯と味噌汁とおかずがセットになっているんですよ」と教えてくれます。\n\n「どれがおすすめですか？」と店員さんに聞きます。\n\n「天ぷら定食が人気ですよ」と店員さんが答えます。',
      content_en: 'You open the set meal page. There are "Tempura Set," "Grilled Fish Set," and "Tonkatsu Set."\n\nSaki-san explains: "Set meals come with rice, miso soup, and a main dish."\n\n"Which one do you recommend?" you ask the staff.\n\n"The tempura set is popular," the staff answers.',
      parent_chapter_id: 'ch-13-1',
    },

    // Chapter 2B: 丼もの
    {
      chapter_id: 'ch-13-2b',
      story_id: story13.story_id,
      chapter_number: 2,
      content: '丼もののページを見ます。「親子丼」「牛丼」「天丼」があります。\n\n「丼ものは大きなご飯の上に具が乗っているんです。ボリュームがありますよ」とサキさんが説明します。\n\n写真を見ると、とてもおいしそうです。',
      content_en: 'You look at the rice bowl dishes page. There are "Oyakodon," "Gyudon," and "Tendon."\n\n"Rice bowl dishes have ingredients on top of a large bowl of rice. They\'re quite filling," Saki-san explains.\n\nLooking at the photos, they look very delicious.',
      parent_chapter_id: 'ch-13-1',
    },

    // Chapter 2C: 単品メニュー
    {
      chapter_id: 'ch-13-2c',
      story_id: story13.story_id,
      chapter_number: 2,
      content: '単品のページを見ます。色々な料理が並んでいます。\n\n「単品だと、好きなものを組み合わせられますよ。でも、定食より高くなるかもしれません」とサキさんが言います。',
      content_en: 'You look at the individual dishes page. Various dishes are listed.\n\n"With individual dishes, you can combine what you like. But it might be more expensive than a set meal," says Saki-san.',
      parent_chapter_id: 'ch-13-1',
    },

    // Chapter 3A: 天ぷら定食注文
    {
      chapter_id: 'ch-13-3a',
      story_id: story13.story_id,
      chapter_number: 3,
      content: '店員さんを呼びます。「すみません、注文お願いします」\n\n「はい、ご注文をどうぞ」と店員さんが来ます。\n\n「天ぷら定食を2つください」とあなたが言います。\n\n「かしこまりました。お飲み物はいかがですか？」',
      content_en: 'You call the staff. "Excuse me, we\'d like to order please."\n\n"Yes, what would you like?" the staff comes over.\n\n"Two tempura sets please," you say.\n\n"Certainly. Would you like any drinks?"',
      parent_chapter_id: 'ch-13-2a',
    },

    // Chapter 3B: とんかつ定食注文
    {
      chapter_id: 'ch-13-3b',
      story_id: story13.story_id,
      chapter_number: 3,
      content: '「すみません！」と手を上げて店員さんを呼びます。\n\n「とんかつ定食を1つと、天ぷら定食を1つお願いします」とサキさんが注文します。\n\n「かしこまりました。少々お待ちください」と店員さんが言います。',
      content_en: '"Excuse me!" you raise your hand to call the staff.\n\n"One tonkatsu set and one tempura set please," Saki-san orders.\n\n"Certainly. Please wait a moment," says the staff.',
      parent_chapter_id: 'ch-13-2a',
    },

    // Chapter 3C: 親子丼注文
    {
      chapter_id: 'ch-13-3c',
      story_id: story13.story_id,
      chapter_number: 3,
      content: '「親子丼を2つお願いします」とあなたが注文します。\n\n「親子丼2つですね。かしこまりました」と店員さんが確認します。\n\n「あ、お水もください」とサキさんが言います。\n\n「はい、すぐにお持ちします」',
      content_en: '"Two oyakodon please," you order.\n\n"Two oyakodon, understood," the staff confirms.\n\n"Oh, and water please," says Saki-san.\n\n"Yes, I\'ll bring it right away."',
      parent_chapter_id: 'ch-13-2b',
    },

    // Chapter 3D: 天丼注文
    {
      chapter_id: 'ch-13-3d',
      story_id: story13.story_id,
      chapter_number: 3,
      content: '「天丼を2人前お願いします」と注文します。\n\n「天丼2つですね。お飲み物はいかがですか？」と店員さんが聞きます。\n\n「お茶を2つください」とサキさんが答えます。\n\n「かしこまりました」',
      content_en: '"Two tendon please," you order.\n\n"Two tendon, understood. Would you like any drinks?" asks the staff.\n\n"Two green teas please," answers Saki-san.\n\n"Certainly."',
      parent_chapter_id: 'ch-13-2b',
    },

    // Chapter 3E: 単品で注文
    {
      chapter_id: 'ch-13-3e',
      story_id: story13.story_id,
      chapter_number: 3,
      content: '「刺身盛り合わせと、焼き鳥と、サラダをください」とあなたが注文します。\n\n「私は天ぷらをお願いします」とサキさんが注文します。\n\n「かしこまりました。以上でよろしいですか？」と店員さんが確認します。\n\n「はい、大丈夫です」',
      content_en: '"Sashimi platter, yakitori, and salad please," you order.\n\n"I\'ll have tempura," Saki-san orders.\n\n"Understood. Is that all?" the staff confirms.\n\n"Yes, that\'s fine."',
      parent_chapter_id: 'ch-13-2c',
    },

    // Chapter 4: 料理を待つ (Convergence point)
    {
      chapter_id: 'ch-13-4',
      story_id: story13.story_id,
      chapter_number: 4,
      content: '注文が終わって、料理を待ちます。\n\n店員さんがお水とおしぼりを持ってきてくれました。「お待たせしました」\n\n「ありがとうございます」とサキさんが言います。\n\nレストランの雰囲気はとても良いです。他のお客さんも食事を楽しんでいます。',
      content_en: 'After ordering, you wait for the food.\n\nThe staff brings water and wet towels. "Thank you for waiting."\n\n"Thank you," says Saki-san.\n\nThe restaurant atmosphere is very nice. Other customers are also enjoying their meals.',
      parent_chapter_id: 'ch-13-3a',
    },

    // Chapter 5: 料理が来る
    {
      chapter_id: 'ch-13-5',
      story_id: story13.story_id,
      chapter_number: 5,
      content: 'しばらくすると、店員さんが料理を持ってきます。\n\n「お待たせしました。こちら、〇〇でございます」\n\n料理はとても美味しそうです！湯気が立っていて、いい匂いがします。\n\n「いただきます！」と二人で言います。',
      content_en: 'After a while, the staff brings the food.\n\n"Thank you for waiting. Here is your 〇〇."\n\nThe food looks very delicious! It\'s steaming and smells good.\n\n"Itadakimasu!" you both say.',
      parent_chapter_id: 'ch-13-4',
    },

    // Chapter 6: 食事を楽しむ
    {
      chapter_id: 'ch-13-6',
      story_id: story13.story_id,
      chapter_number: 6,
      content: '料理を食べ始めます。とても美味しいです！\n\n「どうですか？」とサキさんが聞きます。\n\n「本当に美味しいです！日本の料理は素晴らしいですね」とあなたは答えます。\n\n「良かった！この店は地元の人にも人気なんですよ」とサキさんが嬉しそうに言います。',
      content_en: 'You start eating. It\'s very delicious!\n\n"How is it?" asks Saki-san.\n\n"It\'s really delicious! Japanese food is wonderful," you answer.\n\n"I\'m glad! This restaurant is popular with locals too," Saki-san says happily.',
      parent_chapter_id: 'ch-13-5',
    },

    // Chapter 7: 追加注文
    {
      chapter_id: 'ch-13-7',
      story_id: story13.story_id,
      chapter_number: 7,
      content: '食事の途中で、サキさんが「デザートも食べませんか？」と提案します。\n\n「いいですね！何がありますか？」とあなたは答えます。\n\nメニューを見ると、抹茶アイスクリームと、みたらし団子があります。',
      content_en: 'During the meal, Saki-san suggests: "Shall we have dessert too?"\n\n"Sounds good! What do they have?" you answer.\n\nLooking at the menu, there are matcha ice cream and mitarashi dango.',
      parent_chapter_id: 'ch-13-6',
    },

    // Chapter 8: お会計
    {
      chapter_id: 'ch-13-8',
      story_id: story13.story_id,
      chapter_number: 8,
      content: '食事が終わりました。「ごちそうさまでした！」\n\n「お会計お願いします」とサキさんが店員さんに言います。\n\n「かしこまりました。お会計は2,800円でございます」\n\n「では、半分ずつ払いましょう」とサキさんが提案します。',
      content_en: 'The meal is finished. "Gochisousama deshita!"\n\n"Check please," Saki-san says to the staff.\n\n"Certainly. The total is 2,800 yen."\n\n"Let\'s split it half and half," Saki-san suggests.',
      parent_chapter_id: 'ch-13-7',
    },

    // Chapter 9: まとめ (Ending)
    {
      chapter_id: 'ch-13-9',
      story_id: story13.story_id,
      chapter_number: 9,
      content: 'レストランを出ます。「ありがとうございました！」と店員さんが見送ってくれます。\n\n今日のレストラン体験はとても楽しかったです。\n\nあなたは：\n- レストランでの注文の仕方を学びました\n- 店員さんとの会話を練習しました\n- 日本の食事マナーを体験しました\n- 「いただきます」「ごちそうさま」を使いました\n\n次回はもっと色々な日本料理に挑戦してみましょう！',
      content_en: 'You leave the restaurant. "Thank you very much!" the staff sees you off.\n\nToday\'s restaurant experience was very enjoyable.\n\nYou:\n- Learned how to order at a restaurant\n- Practiced conversations with staff\n- Experienced Japanese dining manners\n- Used "itadakimasu" and "gochisousama"\n\nNext time, let\'s try more varieties of Japanese cuisine!',
      parent_chapter_id: 'ch-13-8',
    },
  ],
});

// Create choices for branching narrative
await prisma.choice.createMany({
  data: [
    // Chapter 1 choices (3 main branches)
    {
      choice_id: 'choice-13-1-a',
      chapter_id: 'ch-13-1',
      choice_text: '定食を見る',
      choice_description: 'Look at set meals',
      next_chapter_id: 'ch-13-2a',
      display_order: 1,
    },
    {
      choice_id: 'choice-13-1-b',
      chapter_id: 'ch-13-1',
      choice_text: '丼ものを見る',
      choice_description: 'Look at rice bowl dishes',
      next_chapter_id: 'ch-13-2b',
      display_order: 2,
    },
    {
      choice_id: 'choice-13-1-c',
      chapter_id: 'ch-13-1',
      choice_text: '単品を見る',
      choice_description: 'Look at individual dishes',
      next_chapter_id: 'ch-13-2c',
      display_order: 3,
    },

    // Chapter 2A choices (2 sub-branches)
    {
      choice_id: 'choice-13-2a-a',
      chapter_id: 'ch-13-2a',
      choice_text: '天ぷら定食を注文する',
      choice_description: 'Order tempura set',
      next_chapter_id: 'ch-13-3a',
      display_order: 1,
    },
    {
      choice_id: 'choice-13-2a-b',
      chapter_id: 'ch-13-2a',
      choice_text: 'とんかつ定食を注文する',
      choice_description: 'Order tonkatsu set',
      next_chapter_id: 'ch-13-3b',
      display_order: 2,
    },

    // Chapter 2B choices (2 sub-branches)
    {
      choice_id: 'choice-13-2b-a',
      chapter_id: 'ch-13-2b',
      choice_text: '親子丼を注文する',
      choice_description: 'Order oyakodon',
      next_chapter_id: 'ch-13-3c',
      display_order: 1,
    },
    {
      choice_id: 'choice-13-2b-b',
      chapter_id: 'ch-13-2b',
      choice_text: '天丼を注文する',
      choice_description: 'Order tendon',
      next_chapter_id: 'ch-13-3d',
      display_order: 2,
    },

    // Chapter 2C choice (1 branch)
    {
      choice_id: 'choice-13-2c-a',
      chapter_id: 'ch-13-2c',
      choice_text: '単品で注文する',
      choice_description: 'Order individual dishes',
      next_chapter_id: 'ch-13-3e',
      display_order: 1,
    },

    // Chapter 3 choices (all converge to Chapter 4)
    {
      choice_id: 'choice-13-3a-next',
      chapter_id: 'ch-13-3a',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-13-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-13-3b-next',
      chapter_id: 'ch-13-3b',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-13-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-13-3c-next',
      chapter_id: 'ch-13-3c',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-13-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-13-3d-next',
      chapter_id: 'ch-13-3d',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-13-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-13-3e-next',
      chapter_id: 'ch-13-3e',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-13-4',
      display_order: 1,
    },

    // Chapter 4-8 linear choices
    {
      choice_id: 'choice-13-4-next',
      chapter_id: 'ch-13-4',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-13-5',
      display_order: 1,
    },
    {
      choice_id: 'choice-13-5-next',
      chapter_id: 'ch-13-5',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-13-6',
      display_order: 1,
    },
    {
      choice_id: 'choice-13-6-next',
      chapter_id: 'ch-13-6',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-13-7',
      display_order: 1,
    },
    {
      choice_id: 'choice-13-7-next',
      chapter_id: 'ch-13-7',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-13-8',
      display_order: 1,
    },
    {
      choice_id: 'choice-13-8-next',
      chapter_id: 'ch-13-8',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-13-9',
      display_order: 1,
    },
  ],
});

console.log('Created Story 13: レストランでの注文 (N4/A2) with 9 chapters');
