// Story 15: 週末の計画 (Weekend Plans) - N4/A2
// Category: daily_life

const story15 = await prisma.story.create({
  data: {
    story_id: '15',
    title: '週末の計画',
    title_en: 'Weekend Plans',
    description: '週末になりました。土曜日と日曜日、何をするか計画を立てます。部屋の掃除、買い物、勉強、休憩など、色々なことができます。予定を立てる表現や、時間の使い方を学びます。あなたの選択で週末の過ごし方が変わります。',
    description_en: 'It\'s the weekend. You plan what to do on Saturday and Sunday. You can do various things like cleaning your room, shopping, studying, resting, etc. Learn expressions for making plans and how to use your time. Your choices will change how you spend your weekend.',
    category: 'daily_life',
    difficulty_level: 'intermediate',
    level_jlpt: 'N4',
    level_cefr: 'A2',
    estimated_time: 10,
    estimated_duration_minutes: 10,
    is_active: true,
    root_chapter_id: 'ch-15-1',
  },
});

// Create chapters
await prisma.chapter.createMany({
  data: [
    // Chapter 1: Root
    {
      chapter_id: 'ch-15-1',
      story_id: story15.story_id,
      chapter_number: 1,
      content: '土曜日の朝です。今日と明日は休みです。\n\n窓の外を見ると、いい天気です。「今日は何をしようかな」と考えます。\n\nやりたいことがたくさんあります。部屋が少し汚いので、掃除をしたいです。冷蔵庫も空っぽなので、買い物にも行きたいです。でも、平日は忙しかったので、ゆっくり休みたい気持ちもあります。\n\nまず、何をしますか？',
      content_en: 'It\'s Saturday morning. Today and tomorrow are your days off.\n\nLooking out the window, you see it\'s nice weather. "What should I do today?" you think.\n\nThere are many things you want to do. Your room is a bit messy, so you want to clean. The refrigerator is empty too, so you also want to go shopping. But you were busy on weekdays, so you also feel like resting well.\n\nWhat will you do first?',
      parent_chapter_id: null,
    },

    // Chapter 2A-C
    {
      chapter_id: 'ch-15-2a',
      story_id: story15.story_id,
      chapter_number: 2,
      content: '「よし、まず掃除をしよう」と決めます。\n\n部屋をきれいにすると、気持ちがいいです。掃除機をかけて、窓を開けて、新しい空気を入れます。\n\n1時間ほど掃除をして、部屋がとてもきれいになりました。\n\n「きれいになった！気持ちいいな」\n\n時計を見ると、もう11時です。お腹も空いてきました。\n\n午後は何をしますか？',
      content_en: '"Alright, let\'s clean first," you decide.\n\nWhen you make your room clean, it feels good. You vacuum, open the windows, and let in fresh air.\n\nAfter cleaning for about an hour, your room became very clean.\n\n"It\'s clean! Feels good."\n\nLooking at the clock, it\'s already 11 o\'clock. You\'re getting hungry too.\n\nWhat will you do in the afternoon?',
      parent_chapter_id: 'ch-15-1',
    },
    {
      chapter_id: 'ch-15-2b',
      story_id: story15.story_id,
      chapter_number: 2,
      content: '「買い物に行こう」と決めて、準備をします。\n\nスーパーマーケットまで歩いて15分です。天気がいいので、散歩もできます。\n\nスーパーに着いて、買い物カゴを持ちます。野菜、肉、魚、牛乳...色々な物を買います。\n\n「今日の夕飯は何を作ろうかな」と考えながら、楽しく買い物をします。\n\n買い物が終わって、家に帰ります。',
      content_en: '"Let\'s go shopping," you decide and get ready.\n\nIt\'s a 15-minute walk to the supermarket. Since the weather is nice, you can also take a walk.\n\nArriving at the supermarket, you grab a shopping basket. Vegetables, meat, fish, milk... you buy various things.\n\n"What should I make for dinner tonight?" you think while enjoying shopping.\n\nAfter finishing shopping, you head home.',
      parent_chapter_id: 'ch-15-1',
    },
    {
      chapter_id: 'ch-15-2c',
      story_id: story15.story_id,
      chapter_number: 2,
      content: '「今日はゆっくり休もう」と決めます。\n\nソファに座って、好きな音楽を聴きます。コーヒーを入れて、リラックスします。\n\n平日は忙しくて、こんなにゆっくりする時間がありませんでした。\n\n「あー、幸せだな」\n\n読みたかった本を読んだり、映画を見たり、好きなことをして過ごします。\n\n気が付くと、もう午後2時です。',
      content_en: '"Let\'s rest well today," you decide.\n\nYou sit on the sofa and listen to your favorite music. You make coffee and relax.\n\nYou were busy on weekdays and didn\'t have time to relax like this.\n\n"Ah, I\'m happy."\n\nYou spend time doing things you like, reading a book you wanted to read or watching a movie.\n\nWhen you realize it, it\'s already 2 PM.',
      parent_chapter_id: 'ch-15-1',
    },

    // Chapter 3A-F
    {
      chapter_id: 'ch-15-3a',
      story_id: story15.story_id,
      chapter_number: 3,
      content: 'きれいになった部屋で、料理を作ります。\n\n冷蔵庫にある材料で、簡単なパスタを作ることにします。トマト、にんにく、オリーブオイル...\n\n料理をしている時は、とても楽しいです。いい匂いがします。\n\n「できた！」\n\nおいしいランチを食べて、満足です。\n\n午後は買い物に行こうと思います。',
      content_en: 'In your now-clean room, you cook.\n\nYou decide to make simple pasta with ingredients from the refrigerator. Tomatoes, garlic, olive oil...\n\nWhen you\'re cooking, it\'s very enjoyable. It smells good.\n\n"Done!"\n\nYou eat a delicious lunch and feel satisfied.\n\nYou think you\'ll go shopping in the afternoon.',
      parent_chapter_id: 'ch-15-2a',
    },
    {
      chapter_id: 'ch-15-3b',
      story_id: story15.story_id,
      chapter_number: 3,
      content: '外に出て、近くのレストランでランチを食べます。\n\n日替わりランチを注文します。おいしいです。\n\n食事の後、スーパーマーケットに行きます。野菜、果物、パン...週末に必要な物を買います。\n\n買い物袋を持って、家に帰ります。\n\n「今日は充実した一日だな」\n\n家に帰って、買った物を冷蔵庫に入れます。',
      content_en: 'You go out and eat lunch at a nearby restaurant.\n\nYou order the daily lunch special. It\'s delicious.\n\nAfter the meal, you go to the supermarket. Vegetables, fruits, bread... you buy things you need for the weekend.\n\nCarrying shopping bags, you head home.\n\n"Today is a fulfilling day."\n\nYou get home and put the things you bought in the refrigerator.',
      parent_chapter_id: 'ch-15-2a',
    },
    {
      chapter_id: 'ch-15-3c',
      story_id: story15.story_id,
      chapter_number: 3,
      content: '買ってきた材料で、夕飯の準備をします。\n\n新鮮な野菜と肉で、カレーを作ることにします。\n\n野菜を切って、肉を炒めて...丁寧に料理します。\n\n部屋中にカレーのいい匂いが広がります。\n\n「明日も食べられるように、たくさん作ろう」\n\n料理は楽しいです。',
      content_en: 'You prepare dinner with the ingredients you bought.\n\nYou decide to make curry with fresh vegetables and meat.\n\nYou cut vegetables, fry meat... you cook carefully.\n\nThe good smell of curry spreads throughout the room.\n\n"Let\'s make a lot so I can eat it tomorrow too."\n\nCooking is fun.',
      parent_chapter_id: 'ch-15-2b',
    },
    {
      chapter_id: 'ch-15-3d',
      story_id: story15.story_id,
      chapter_number: 3,
      content: '買い物から帰って、少し疲れたので休憩します。\n\n30分ほどソファで休んで、元気になりました。\n\n「さあ、料理をしよう」\n\n買ってきた新鮮な魚で、焼き魚定食を作ります。ご飯、味噌汁、焼き魚、サラダ...\n\n健康的な夕飯ができました。\n\n「おいしそう！」\n\n自分で作った料理は特においしいです。',
      content_en: 'After returning from shopping, you\'re a bit tired so you rest.\n\nAfter resting on the sofa for about 30 minutes, you feel refreshed.\n\n"Now, let\'s cook."\n\nWith the fresh fish you bought, you make a grilled fish set meal. Rice, miso soup, grilled fish, salad...\n\nA healthy dinner is ready.\n\n"Looks delicious!"\n\nFood you make yourself is especially delicious.',
      parent_chapter_id: 'ch-15-2b',
    },
    {
      chapter_id: 'ch-15-3e',
      story_id: story15.story_id,
      chapter_number: 3,
      content: 'ずっと家にいたので、外に出ることにします。\n\n近くの公園まで散歩します。天気がいいので、気持ちがいいです。\n\n公園では、犬の散歩をしている人や、ジョギングをしている人がいます。\n\nベンチに座って、少し休憩します。\n\n「いい気分転換になったな」\n\n家に帰って、夕飯の準備をしようと思います。',
      content_en: 'Since you\'ve been home all along, you decide to go out.\n\nYou walk to the nearby park. The weather is nice, so it feels good.\n\nIn the park, there are people walking their dogs and jogging.\n\nYou sit on a bench and rest a bit.\n\n"That was a good change of pace."\n\nYou think you\'ll go home and prepare dinner.',
      parent_chapter_id: 'ch-15-2c',
    },
    {
      chapter_id: 'ch-15-3f',
      story_id: story15.story_id,
      chapter_number: 3,
      content: '久しぶりに友達に電話をすることにします。\n\n「もしもし、元気？」\n\n「元気だよ！今、何してるの？」\n\n「のんびり休んでるよ。そっちは？」\n\n30分ほど、色々な話をします。楽しい時間です。\n\n「じゃあ、また今度会おうね！」\n\n「うん！また連絡するね」\n\n電話を切って、いい気分です。',
      content_en: 'You decide to call a friend after a long time.\n\n"Hello, how are you?"\n\n"I\'m good! What are you doing now?"\n\n"Relaxing. How about you?"\n\nYou talk about various things for about 30 minutes. It\'s enjoyable time.\n\n"Well, let\'s meet again sometime!"\n\n"Yeah! I\'ll contact you again."\n\nYou hang up feeling good.',
      parent_chapter_id: 'ch-15-2c',
    },

    // Chapter 4: Convergence
    {
      chapter_id: 'ch-15-4',
      story_id: story15.story_id,
      chapter_number: 4,
      content: '土曜日の夜です。\n\n今日は充実した一日でした。明日は日曜日です。明日の予定を考えます。\n\n「明日は何をしようかな」\n\n日記を開いて、明日の計画を書きます。\n\n朝はゆっくり起きて、朝ご飯を食べます。午前中は少し勉強しようと思います。午後は自由時間にします。\n\n「いい計画だ。明日も楽しみだな」\n\nそう思いながら、ベッドに入ります。',
      content_en: 'It\'s Saturday night.\n\nToday was a fulfilling day. Tomorrow is Sunday. You think about tomorrow\'s schedule.\n\n"What should I do tomorrow?"\n\nYou open your diary and write tomorrow\'s plan.\n\nYou\'ll wake up leisurely in the morning and eat breakfast. You think you\'ll study a bit in the morning. You\'ll make the afternoon free time.\n\n"Good plan. I\'m looking forward to tomorrow too."\n\nThinking this, you get into bed.',
      parent_chapter_id: 'ch-15-3a',
    },

    // Chapter 5-9: Linear
    {
      chapter_id: 'ch-15-5',
      story_id: story15.story_id,
      chapter_number: 5,
      content: '日曜日の朝です。\n\nアラームなしで、自然に目が覚めました。ゆっくり起きて、窓を開けます。\n\n今日もいい天気です。\n\n朝ご飯を作ります。トースト、卵、サラダ、コーヒー...\n\n「おいしい朝ご飯だな」\n\nゆっくり食べて、新聞を読みます。\n\nこんな朝は最高です。',
      content_en: 'It\'s Sunday morning.\n\nYou wake up naturally without an alarm. You get up leisurely and open the window.\n\nToday is also nice weather.\n\nYou make breakfast. Toast, eggs, salad, coffee...\n\n"A delicious breakfast."\n\nYou eat slowly and read the newspaper.\n\nMornings like this are the best.',
      parent_chapter_id: 'ch-15-4',
    },
    {
      chapter_id: 'ch-15-6',
      story_id: story15.story_id,
      chapter_number: 6,
      content: '朝ご飯の後、少し勉強することにします。\n\n机に座って、日本語の本を開きます。新しい言葉を覚えたり、文法を復習したりします。\n\n1時間ほど勉強して、休憩します。\n\n「よく頑張った」\n\nコーヒーを飲みながら、達成感を感じます。\n\n週末でも、少し勉強すると気持ちがいいです。',
      content_en: 'After breakfast, you decide to study a bit.\n\nYou sit at your desk and open a Japanese book. You learn new words and review grammar.\n\nAfter studying for about an hour, you take a break.\n\n"Good job."\n\nWhile drinking coffee, you feel a sense of accomplishment.\n\nEven on weekends, studying a bit feels good.',
      parent_chapter_id: 'ch-15-5',
    },
    {
      chapter_id: 'ch-15-7',
      story_id: story15.story_id,
      chapter_number: 7,
      content: '午後は自由時間です。\n\n何をしてもいいです。好きな音楽を聴いたり、映画を見たり、ゲームをしたり...\n\n「週末って最高だな」と思います。\n\n平日は仕事や学校で忙しいですが、週末は自分の時間です。\n\n好きなことをして、リラックスして過ごします。\n\n時間がゆっくり流れていきます。',
      content_en: 'The afternoon is free time.\n\nYou can do anything. Listen to your favorite music, watch a movie, play games...\n\n"Weekends are the best," you think.\n\nWeekdays are busy with work or school, but weekends are your own time.\n\nYou do what you like and spend time relaxing.\n\nTime flows slowly.',
      parent_chapter_id: 'ch-15-6',
    },
    {
      chapter_id: 'ch-15-8',
      story_id: story15.story_id,
      chapter_number: 8,
      content: '夕方になりました。\n\nもうすぐ週末が終わります。少し寂しい気持ちもありますが、とても充実した週末でした。\n\n明日からまた平日が始まります。でも、週末にしっかり休んだので、元気いっぱいです。\n\n「明日からまた頑張ろう」\n\n夕飯を食べて、明日の準備をします。',
      content_en: 'Evening has come.\n\nThe weekend will end soon. You feel a bit sad, but it was a very fulfilling weekend.\n\nWeekdays will start again from tomorrow. But since you rested well on the weekend, you\'re full of energy.\n\n"Let\'s do my best again from tomorrow."\n\nYou eat dinner and prepare for tomorrow.',
      parent_chapter_id: 'ch-15-7',
    },
    {
      chapter_id: 'ch-15-9',
      story_id: story15.story_id,
      chapter_number: 9,
      content: '週末が終わりました。\n\nあなたは：\n- 週末の計画を立てました\n- 予定を立てる表現を学びました\n- 時間の使い方を考えました\n- 充実した休日を過ごしました\n\n日本語で予定や計画について話せるようになりました！\n\n仕事と休みのバランスは大切です。次の週末も楽しい計画を立てましょう。\n\nおやすみなさい。また明日！',
      content_en: 'The weekend has ended.\n\nYou:\n- Made weekend plans\n- Learned expressions for making schedules\n- Thought about how to use time\n- Spent a fulfilling holiday\n\nYou can now talk about schedules and plans in Japanese!\n\nBalance between work and rest is important. Let\'s make fun plans for the next weekend too.\n\nGood night. See you tomorrow!',
      parent_chapter_id: 'ch-15-8',
    },
  ],
});

// Create choices
await prisma.choice.createMany({
  data: [
    // Chapter 1 choices
    {
      choice_id: 'choice-15-1-a',
      chapter_id: 'ch-15-1',
      choice_text: '部屋を掃除する',
      choice_description: 'Clean the room',
      next_chapter_id: 'ch-15-2a',
      display_order: 1,
    },
    {
      choice_id: 'choice-15-1-b',
      chapter_id: 'ch-15-1',
      choice_text: '買い物に行く',
      choice_description: 'Go shopping',
      next_chapter_id: 'ch-15-2b',
      display_order: 2,
    },
    {
      choice_id: 'choice-15-1-c',
      chapter_id: 'ch-15-1',
      choice_text: 'ゆっくり休む',
      choice_description: 'Rest leisurely',
      next_chapter_id: 'ch-15-2c',
      display_order: 3,
    },

    // Chapter 2 choices
    {
      choice_id: 'choice-15-2a-a',
      chapter_id: 'ch-15-2a',
      choice_text: '昼ご飯を作って食べる',
      choice_description: 'Cook and eat lunch',
      next_chapter_id: 'ch-15-3a',
      display_order: 1,
    },
    {
      choice_id: 'choice-15-2a-b',
      chapter_id: 'ch-15-2a',
      choice_text: '外食してから買い物に行く',
      choice_description: 'Eat out then go shopping',
      next_chapter_id: 'ch-15-3b',
      display_order: 2,
    },
    {
      choice_id: 'choice-15-2b-a',
      chapter_id: 'ch-15-2b',
      choice_text: '家で料理をする',
      choice_description: 'Cook at home',
      next_chapter_id: 'ch-15-3c',
      display_order: 1,
    },
    {
      choice_id: 'choice-15-2b-b',
      chapter_id: 'ch-15-2b',
      choice_text: '少し休んでから料理する',
      choice_description: 'Rest a bit then cook',
      next_chapter_id: 'ch-15-3d',
      display_order: 2,
    },
    {
      choice_id: 'choice-15-2c-a',
      chapter_id: 'ch-15-2c',
      choice_text: '軽い運動をする',
      choice_description: 'Do light exercise',
      next_chapter_id: 'ch-15-3e',
      display_order: 1,
    },
    {
      choice_id: 'choice-15-2c-b',
      chapter_id: 'ch-15-2c',
      choice_text: '友達に連絡する',
      choice_description: 'Contact a friend',
      next_chapter_id: 'ch-15-3f',
      display_order: 2,
    },

    // Chapter 3 choices (converge to 4)
    {
      choice_id: 'choice-15-3a-next',
      chapter_id: 'ch-15-3a',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-15-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-15-3b-next',
      chapter_id: 'ch-15-3b',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-15-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-15-3c-next',
      chapter_id: 'ch-15-3c',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-15-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-15-3d-next',
      chapter_id: 'ch-15-3d',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-15-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-15-3e-next',
      chapter_id: 'ch-15-3e',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-15-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-15-3f-next',
      chapter_id: 'ch-15-3f',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-15-4',
      display_order: 1,
    },

    // Chapter 4-8 linear choices
    {
      choice_id: 'choice-15-4-next',
      chapter_id: 'ch-15-4',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-15-5',
      display_order: 1,
    },
    {
      choice_id: 'choice-15-5-next',
      chapter_id: 'ch-15-5',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-15-6',
      display_order: 1,
    },
    {
      choice_id: 'choice-15-6-next',
      chapter_id: 'ch-15-6',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-15-7',
      display_order: 1,
    },
    {
      choice_id: 'choice-15-7-next',
      chapter_id: 'ch-15-7',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-15-8',
      display_order: 1,
    },
    {
      choice_id: 'choice-15-8-next',
      chapter_id: 'ch-15-8',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-15-9',
      display_order: 1,
    },
  ],
});

console.log('Created Story 15: 週末の計画 (N4/A2) with 9 chapters');
