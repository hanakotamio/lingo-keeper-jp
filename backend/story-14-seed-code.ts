// Story 14: 友達との約束 (Making Plans with a Friend) - N4/A2
// Category: friendship

const story14 = await prisma.story.create({
  data: {
    story_id: '14',
    title: '友達との約束',
    title_en: 'Making Plans with a Friend',
    description: '週末に友達と遊ぶ約束をします。何をするか、どこで会うか、何時に会うかを決めます。約束をする時の表現や、提案・誘いの表現を学びます。あなたの選択で物語が変わります。',
    description_en: 'You make plans to hang out with a friend on the weekend. Decide what to do, where to meet, and what time to meet. Learn expressions for making promises and invitations/suggestions. Your choices will change the story.',
    category: 'friendship',
    difficulty_level: 'intermediate',
    level_jlpt: 'N4',
    level_cefr: 'A2',
    estimated_time: 10,
    estimated_duration_minutes: 10,
    is_active: true,
    root_chapter_id: 'ch-14-1',
  },
});

// Create chapters
await prisma.chapter.createMany({
  data: [
    // Chapter 1: Root
    {
      chapter_id: 'ch-14-1',
      story_id: story14.story_id,
      chapter_number: 1,
      content: '金曜日の夜、友達のユウタさんからメッセージが来ました。\n\n「週末、暇？一緒に遊びませんか？」\n\nあなたは明日も明後日も予定がありません。「いいですね！何をしますか？」と返信します。\n\nユウタさんから返事が来ます。「何がいいかな？」\n\n何を提案しますか？',
      content_en: 'On Friday night, you receive a message from your friend Yuta-san.\n\n"Are you free this weekend? Would you like to hang out?"\n\nYou don\'t have plans tomorrow or the day after. "Sounds good! What shall we do?" you reply.\n\nYuta-san replies: "What would be good?"\n\nWhat will you suggest?',
      parent_chapter_id: null,
    },

    // Chapter 2A-C
    {
      chapter_id: 'ch-14-2a',
      story_id: story14.story_id,
      chapter_number: 2,
      content: '「映画を見ませんか？」と提案します。\n\n「いいですね！どんな映画が見たいですか？」とユウタさんが聞きます。\n\n「アクション映画はどうですか？今、面白いのがやっているそうですよ」とあなたは答えます。\n\n「いいね！じゃあ、映画館で会いましょう」',
      content_en: '"How about watching a movie?" you suggest.\n\n"Sounds good! What kind of movie do you want to see?" asks Yuta-san.\n\n"How about an action movie? I heard there\'s an interesting one showing now," you answer.\n\n"Nice! Then let\'s meet at the movie theater."',
      parent_chapter_id: 'ch-14-1',
    },
    {
      chapter_id: 'ch-14-2b',
      story_id: story14.story_id,
      chapter_number: 2,
      content: '「買い物に行きましょう！」と提案します。\n\n「何を買いたいですか？」とユウタさんが聞きます。\n\n「服を見たいです。あなたは？」と聞き返します。\n\n「僕も新しいシャツが欲しいです。駅前のショッピングモールはどうですか？」\n\n「いいですね！」',
      content_en: '"Let\'s go shopping!" you suggest.\n\n"What do you want to buy?" asks Yuta-san.\n\n"I want to look at clothes. How about you?" you ask back.\n\n"I also want a new shirt. How about the shopping mall by the station?"\n\n"Sounds good!"',
      parent_chapter_id: 'ch-14-1',
    },
    {
      chapter_id: 'ch-14-2c',
      story_id: story14.story_id,
      chapter_number: 2,
      content: '「カラオケはどうですか？」と提案します。\n\n「カラオケ！いいですね！久しぶりに歌いたいです」とユウタさんが嬉しそうに言います。\n\n「僕も！最近、練習している歌があるんです」\n\n「楽しみですね。どこのカラオケがいいですか？」\n\n「駅の近くに新しいカラオケ店ができたそうですよ」',
      content_en: '"How about karaoke?" you suggest.\n\n"Karaoke! Sounds good! I want to sing after a long time," says Yuta-san happily.\n\n"Me too! I have a song I\'ve been practicing recently."\n\n"I\'m looking forward to it. Which karaoke place is good?"\n\n"I heard there\'s a new karaoke place near the station."',
      parent_chapter_id: 'ch-14-1',
    },

    // Chapter 3A-F
    {
      chapter_id: 'ch-14-3a',
      story_id: story14.story_id,
      chapter_number: 3,
      content: '「午前中はどうですか？10時に映画館の前で会いましょう」と提案します。\n\n「10時ですね。わかりました！」とユウタさんが答えます。\n\n「映画の後、ランチも食べませんか？」\n\n「いいですね！楽しみにしています」',
      content_en: '"How about in the morning? Let\'s meet at 10 o\'clock in front of the movie theater," you suggest.\n\n"10 o\'clock, got it!" answers Yuta-san.\n\n"After the movie, shall we have lunch too?"\n\n"Sounds good! I\'m looking forward to it."',
      parent_chapter_id: 'ch-14-2a',
    },
    {
      chapter_id: 'ch-14-3b',
      story_id: story14.story_id,
      chapter_number: 3,
      content: '「午後2時はどうですか？」と提案します。\n\n「2時ですね。ちょうどいいです！」とユウタさんが言います。\n\n「映画を見た後、カフェでお茶をしましょう」\n\n「いいですね。明日が楽しみです！」',
      content_en: '"How about 2 PM?" you suggest.\n\n"2 PM, that\'s perfect!" says Yuta-san.\n\n"After the movie, let\'s have tea at a cafe."\n\n"Sounds good. I\'m looking forward to tomorrow!"',
      parent_chapter_id: 'ch-14-2a',
    },
    {
      chapter_id: 'ch-14-3c',
      story_id: story14.story_id,
      chapter_number: 3,
      content: '「10時にショッピングモールの入口で会いましょう」と言います。\n\n「わかりました！朝から行けば、人が少ないですね」とユウタさんが言います。\n\n「そうですね。ゆっくり見られます」\n\n「お昼はモールのレストランで食べましょう」\n\n「いいですね！」',
      content_en: '"Let\'s meet at 10 at the shopping mall entrance," you say.\n\n"Got it! If we go in the morning, there will be fewer people," says Yuta-san.\n\n"That\'s right. We can look around leisurely."\n\n"Let\'s have lunch at the mall restaurant."\n\n"Sounds good!"',
      parent_chapter_id: 'ch-14-2b',
    },
    {
      chapter_id: 'ch-14-3d',
      story_id: story14.story_id,
      chapter_number: 3,
      content: '「1時に駅で会いましょう」と提案します。\n\n「わかりました。お昼を食べてから買い物しますか？」とユウタさんが聞きます。\n\n「いいですね。駅前においしいレストランがありますよ」\n\n「じゃあ、そこで会いましょう！」',
      content_en: '"Let\'s meet at the station at 1 PM," you suggest.\n\n"Got it. Shall we eat lunch before shopping?" asks Yuta-san.\n\n"Sounds good. There\'s a good restaurant by the station."\n\n"Then let\'s meet there!"',
      parent_chapter_id: 'ch-14-2b',
    },
    {
      chapter_id: 'ch-14-3e',
      story_id: story14.story_id,
      chapter_number: 3,
      content: '「12時に駅で会いましょう」と言います。\n\n「はい！お昼を食べてから歌いますか？」とユウタさんが提案します。\n\n「そうしましょう。たくさん歌えますね」\n\n「楽しみです！明日、12時に駅で！」',
      content_en: '"Let\'s meet at the station at 12," you say.\n\n"Yes! Shall we eat lunch before singing?" suggests Yuta-san.\n\n"Let\'s do that. We can sing a lot."\n\n"I\'m looking forward to it! Tomorrow at 12 at the station!"',
      parent_chapter_id: 'ch-14-2c',
    },
    {
      chapter_id: 'ch-14-3f',
      story_id: story14.story_id,
      chapter_number: 3,
      content: '「5時はどうですか？」と提案します。\n\n「5時ですね。夕方からゆっくり歌えますね」とユウタさんが言います。\n\n「はい。夜まで歌って、その後、夕飯を食べましょう」\n\n「いいですね！では、明日5時に駅で！」',
      content_en: '"How about 5 PM?" you suggest.\n\n"5 PM, we can sing leisurely from the evening," says Yuta-san.\n\n"Yes. Let\'s sing until night, then have dinner."\n\n"Sounds good! Then tomorrow at 5 at the station!"',
      parent_chapter_id: 'ch-14-2c',
    },

    // Chapter 4: Convergence
    {
      chapter_id: 'ch-14-4',
      story_id: story14.story_id,
      chapter_number: 4,
      content: '約束が決まりました。確認のメッセージを送ります。\n\n「明日、楽しみにしています！遅れないでくださいね」\n\n「はい！絶対に遅れません。あなたも気をつけて来てください」とユウタさんが返信します。\n\n「わかりました。じゃあ、また明日！」\n\n「また明日！おやすみなさい」',
      content_en: 'The plan is set. You send a confirmation message.\n\n"I\'m looking forward to tomorrow! Please don\'t be late."\n\n"Yes! I definitely won\'t be late. You be careful coming too," Yuta-san replies.\n\n"Understood. See you tomorrow!"\n\n"See you tomorrow! Good night."',
      parent_chapter_id: 'ch-14-3a',
    },

    // Chapter 5-9: Linear
    {
      chapter_id: 'ch-14-5',
      story_id: story14.story_id,
      chapter_number: 5,
      content: '次の日の朝です。\n\n準備をして、家を出ます。天気も良くて、気持ちがいいです。\n\n約束の時間に間に合うように、早めに出発します。\n\n駅に向かう途中、ユウタさんからメッセージが来ました。\n\n「今、家を出ました。楽しみです！」',
      content_en: 'It\'s the morning of the next day.\n\nYou get ready and leave the house. The weather is nice and you feel good.\n\nYou leave early to arrive on time for your appointment.\n\nOn the way to the station, you receive a message from Yuta-san.\n\n"I just left home. I\'m excited!"',
      parent_chapter_id: 'ch-14-4',
    },
    {
      chapter_id: 'ch-14-6',
      story_id: story14.story_id,
      chapter_number: 6,
      content: '約束の場所に着きました。\n\nすぐにユウタさんが見えました。手を振って呼びます。\n\n「おはよう！」「おはよう！」\n\n「待った？」とユウタさんが聞きます。\n\n「ううん、今来たところだよ」と答えます。\n\n「じゃあ、行こう！」',
      content_en: 'You arrive at the meeting place.\n\nYou immediately see Yuta-san. You wave and call out.\n\n"Good morning!" "Good morning!"\n\n"Did you wait?" asks Yuta-san.\n\n"No, I just got here," you answer.\n\n"Then let\'s go!"',
      parent_chapter_id: 'ch-14-5',
    },
    {
      chapter_id: 'ch-14-7',
      story_id: story14.story_id,
      chapter_number: 7,
      content: '一緒に過ごす時間はとても楽しいです。\n\nたくさん話して、たくさん笑いました。\n\n「今日は本当に楽しいね！」とユウタさんが言います。\n\n「うん！また遊びたいね」とあなたは答えます。\n\n「もちろん！また約束しよう」',
      content_en: 'The time spent together is very enjoyable.\n\nYou talk a lot and laugh a lot.\n\n"Today is really fun!" says Yuta-san.\n\n"Yes! I want to hang out again," you answer.\n\n"Of course! Let\'s make plans again."',
      parent_chapter_id: 'ch-14-6',
    },
    {
      chapter_id: 'ch-14-8',
      story_id: story14.story_id,
      chapter_number: 8,
      content: '楽しい時間はあっという間に過ぎました。\n\n「そろそろ帰らないと」とユウタさんが言います。\n\n「そうだね。今日はありがとう！」\n\n「こちらこそ。また連絡するね！」\n\n「うん！気をつけて帰ってね」\n\n「あなたも！じゃあね！」',
      content_en: 'The fun time passed in no time.\n\n"I should head home soon," says Yuta-san.\n\n"Yeah. Thanks for today!"\n\n"Thank you too. I\'ll contact you again!"\n\n"Yes! Be careful going home."\n\n"You too! See you!"',
      parent_chapter_id: 'ch-14-7',
    },
    {
      chapter_id: 'ch-14-9',
      story_id: story14.story_id,
      chapter_number: 9,
      content: '今日は友達と楽しい時間を過ごしました。\n\nあなたは：\n- 約束をする表現を学びました\n- 提案・誘いの言い方を練習しました\n- 時間と場所を決める会話をしました\n- 友達との良い関係を築きました\n\n日本語で友達と約束ができるようになりました！\n\n次回はもっと色々な場面で約束をしてみましょう。',
      content_en: 'Today you spent enjoyable time with a friend.\n\nYou:\n- Learned expressions for making appointments\n- Practiced ways to suggest and invite\n- Had conversations about deciding time and place\n- Built a good relationship with a friend\n\nYou can now make plans with friends in Japanese!\n\nNext time, let\'s try making appointments in more various situations.',
      parent_chapter_id: 'ch-14-8',
    },
  ],
});

// Create choices
await prisma.choice.createMany({
  data: [
    // Chapter 1 choices
    {
      choice_id: 'choice-14-1-a',
      chapter_id: 'ch-14-1',
      choice_text: '映画を見ませんか',
      choice_description: 'How about watching a movie?',
      next_chapter_id: 'ch-14-2a',
      display_order: 1,
    },
    {
      choice_id: 'choice-14-1-b',
      chapter_id: 'ch-14-1',
      choice_text: '買い物に行きましょう',
      choice_description: 'Let\'s go shopping',
      next_chapter_id: 'ch-14-2b',
      display_order: 2,
    },
    {
      choice_id: 'choice-14-1-c',
      chapter_id: 'ch-14-1',
      choice_text: 'カラオケはどうですか',
      choice_description: 'How about karaoke?',
      next_chapter_id: 'ch-14-2c',
      display_order: 3,
    },

    // Chapter 2 choices
    {
      choice_id: 'choice-14-2a-a',
      chapter_id: 'ch-14-2a',
      choice_text: '午前中に会う',
      choice_description: 'Meet in the morning',
      next_chapter_id: 'ch-14-3a',
      display_order: 1,
    },
    {
      choice_id: 'choice-14-2a-b',
      chapter_id: 'ch-14-2a',
      choice_text: '午後に会う',
      choice_description: 'Meet in the afternoon',
      next_chapter_id: 'ch-14-3b',
      display_order: 2,
    },
    {
      choice_id: 'choice-14-2b-a',
      chapter_id: 'ch-14-2b',
      choice_text: '朝から行く',
      choice_description: 'Go from the morning',
      next_chapter_id: 'ch-14-3c',
      display_order: 1,
    },
    {
      choice_id: 'choice-14-2b-b',
      chapter_id: 'ch-14-2b',
      choice_text: '昼から行く',
      choice_description: 'Go from noon',
      next_chapter_id: 'ch-14-3d',
      display_order: 2,
    },
    {
      choice_id: 'choice-14-2c-a',
      chapter_id: 'ch-14-2c',
      choice_text: '昼から歌う',
      choice_description: 'Sing from noon',
      next_chapter_id: 'ch-14-3e',
      display_order: 1,
    },
    {
      choice_id: 'choice-14-2c-b',
      chapter_id: 'ch-14-2c',
      choice_text: '夕方から歌う',
      choice_description: 'Sing from evening',
      next_chapter_id: 'ch-14-3f',
      display_order: 2,
    },

    // Chapter 3 choices (converge to 4)
    {
      choice_id: 'choice-14-3a-next',
      chapter_id: 'ch-14-3a',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-14-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-14-3b-next',
      chapter_id: 'ch-14-3b',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-14-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-14-3c-next',
      chapter_id: 'ch-14-3c',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-14-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-14-3d-next',
      chapter_id: 'ch-14-3d',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-14-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-14-3e-next',
      chapter_id: 'ch-14-3e',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-14-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-14-3f-next',
      chapter_id: 'ch-14-3f',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-14-4',
      display_order: 1,
    },

    // Chapter 4-8 linear choices
    {
      choice_id: 'choice-14-4-next',
      chapter_id: 'ch-14-4',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-14-5',
      display_order: 1,
    },
    {
      choice_id: 'choice-14-5-next',
      chapter_id: 'ch-14-5',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-14-6',
      display_order: 1,
    },
    {
      choice_id: 'choice-14-6-next',
      chapter_id: 'ch-14-6',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-14-7',
      display_order: 1,
    },
    {
      choice_id: 'choice-14-7-next',
      chapter_id: 'ch-14-7',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-14-8',
      display_order: 1,
    },
    {
      choice_id: 'choice-14-8-next',
      chapter_id: 'ch-14-8',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-14-9',
      display_order: 1,
    },
  ],
});

console.log('Created Story 14: 友達との約束 (N4/A2) with 9 chapters');
