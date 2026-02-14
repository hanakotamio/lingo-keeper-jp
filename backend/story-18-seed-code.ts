// Story 18: 郵便局で (At the Post Office) - N3/B1
// Category: service

const story18 = await prisma.story.create({
  data: {
    story_id: '18',
    title: '郵便局で',
    title_en: 'At the Post Office',
    description: '日本の郵便局で荷物を送ります。国際郵便の手続きは少し複雑ですが、窓口の人が丁寧に教えてくれます。宛先の書き方、サービスの選び方、料金の支払い方を学びます。追跡番号をもらって、荷物が無事に届くまで確認できます。日本の郵便サービスは信頼性が高く、とても便利です。',
    description_en: 'You send a package at a Japanese post office. International mail procedures are a bit complex, but the counter staff kindly teaches you. You learn how to write the address, choose services, and pay fees. You receive a tracking number and can confirm until the package arrives safely. Japanese postal services are highly reliable and very convenient.',
    category: 'service',
    difficulty_level: 'intermediate',
    level_jlpt: 'N3',
    level_cefr: 'B1',
    estimated_time: 10,
    estimated_duration_minutes: 10,
    is_active: true,
    root_chapter_id: 'ch-18-1',
  },
});

// Create chapters
await prisma.chapter.createMany({
  data: [
    // Chapter 1: Root
    {
      chapter_id: 'ch-18-1',
      story_id: story18.story_id,
      chapter_number: 1,
      content: '母国の家族にお土産を送ることにしました。\n\n荷物を持って、近くの郵便局に向かいます。郵便局に入ると、窓口と自動販売機があります。\n\n「何を送るんだっけ？」と確認します。\n\n荷物の中身は：\n- お菓子（和菓子とチョコレート）\n- お茶（緑茶のパック）\n- 小さな置物（招き猫）\n\n重さは約2キロです。\n\n何を送りますか？',
      content_en: 'You\'ve decided to send souvenirs to your family back home.\n\nCarrying the package, you head to the nearby post office. Entering the post office, there\'s a counter and vending machines.\n\n"What am I sending again?" you confirm.\n\nThe package contents are:\n- Sweets (wagashi and chocolate)\n- Tea (green tea packs)\n- Small ornament (lucky cat)\n\nIt weighs about 2 kilograms.\n\nWhat will you send?',
      parent_chapter_id: null,
    },

    // Chapter 2A-C
    {
      chapter_id: 'ch-18-2a',
      story_id: story18.story_id,
      chapter_number: 2,
      content: '「小包を送りたいです」と窓口の人に伝えます。\n\n窓口の人が笑顔で対応してくれます。「国際郵便ですか、それとも国内ですか？」\n\n「国際郵便です。アメリカに送りたいです」\n\n「わかりました。では、こちらの伝票に記入してください」と緑色の伝票を渡してくれます。\n\n伝票を見ると、送り主の住所、受取人の住所、内容物を書く欄があります。\n\n机に行って、丁寧に記入します。',
      content_en: '"I want to send a package," you tell the counter staff.\n\nThe counter staff responds with a smile. "Is it international mail or domestic?"\n\n"International mail. I want to send it to America."\n\n"I understand. Then, please fill out this form," they hand you a green form.\n\nLooking at the form, there are sections to write the sender\'s address, recipient\'s address, and contents.\n\nYou go to the desk and fill it out carefully.',
      parent_chapter_id: 'ch-18-1',
    },
    {
      chapter_id: 'ch-18-2b',
      story_id: story18.story_id,
      chapter_number: 2,
      content: '「もっと簡単な方法はないかな」と考えて、「国際郵便の箱を買えますか？」と聞きます。\n\n窓口の人が説明します。「はい、国際小包用の箱があります。サイズは小・中・大とあって、箱代は180円からです」\n\n「中サイズをください」\n\n箱を受け取って、荷物を詰め替えます。専用の箱なので、住所を書く欄が印刷されていて便利です。\n\n荷物を箱に詰めて、テープで閉じます。',
      content_en: 'Thinking "Is there an easier way?", you ask, "Can I buy a box for international mail?"\n\nThe counter staff explains. "Yes, there are boxes for international parcels. The sizes are small, medium, and large, and box prices start from 180 yen."\n\n"I\'ll take a medium size."\n\nYou receive the box and repack your items. Since it\'s a dedicated box, it\'s convenient with address sections already printed.\n\nYou pack the items in the box and seal it with tape.',
      parent_chapter_id: 'ch-18-1',
    },
    {
      chapter_id: 'ch-18-2c',
      story_id: story18.story_id,
      chapter_number: 2,
      content: '「手紙と小包、どっちがいいかな」と考えます。\n\n荷物をよく見ると、意外と薄くて軽いです。「これなら国際eパケットで送れるかも」\n\n窓口の人に聞きます。「2キロの荷物ですが、一番安い方法は何ですか？」\n\n「2キロですと、国際eパケットが一番安いです。追跡番号も付いて、2週間くらいで届きますよ」\n\n「それでお願いします」\n\n専用の封筒を受け取って、荷物を入れます。',
      content_en: '"Should I send it as a letter or package?" you think.\n\nLooking carefully at the items, they\'re surprisingly thin and light. "Maybe I can send this by international ePacket."\n\nYou ask the counter staff. "It\'s a 2 kilogram package, but what\'s the cheapest method?"\n\n"For 2 kilograms, international ePacket is cheapest. It comes with a tracking number and arrives in about 2 weeks."\n\n"I\'ll go with that, please."\n\nYou receive a special envelope and put the items in.',
      parent_chapter_id: 'ch-18-1',
    },

    // Chapter 3A-F
    {
      chapter_id: 'ch-18-3a',
      story_id: story18.story_id,
      chapter_number: 3,
      content: '伝票の記入が終わりました。窓口に持って行きます。\n\n窓口の人が確認します。「内容物は食品と雑貨ですね。税関告知書も必要です。こちらにも記入してください」\n\nもう一枚、英語の書類を渡されます。「CN22」という書類です。\n\n内容物の種類、価値、重量を英語で書きます。\n\n「食品は...food、置物は...ornament」と辞書で調べながら記入します。\n\n両方の書類を記入して、窓口に出します。',
      content_en: 'You finish filling out the form. You bring it to the counter.\n\nThe counter staff checks it. "The contents are food and miscellaneous goods. You also need a customs declaration. Please fill this out too."\n\nYou\'re handed another document in English. It\'s a "CN22" form.\n\nYou write the type of contents, value, and weight in English.\n\n"Food is... food, ornament is... ornament," you write while checking a dictionary.\n\nYou fill out both documents and submit them at the counter.',
      parent_chapter_id: 'ch-18-2a',
    },
    {
      chapter_id: 'ch-18-3b',
      story_id: story18.story_id,
      chapter_number: 3,
      content: '窓口の人が荷物を計量します。「2.3キロですね」\n\n「サービスはどれにしますか？船便、SAL便、航空便がありますよ」\n\n料金表を見せてくれます：\n- 船便：2ヶ月、2500円\n- SAL便：2週間、4000円\n- 航空便：1週間、6000円\n\n「どれがいいかな」と考えます。',
      content_en: 'The counter staff weighs the package. "It\'s 2.3 kilograms."\n\n"Which service would you like? There\'s sea mail, SAL, and airmail."\n\nThey show you a rate table:\n- Sea mail: 2 months, 2500 yen\n- SAL: 2 weeks, 4000 yen\n- Airmail: 1 week, 6000 yen\n\n"Which is best?" you think.',
      parent_chapter_id: 'ch-18-2a',
    },
    {
      chapter_id: 'ch-18-3c',
      story_id: story18.story_id,
      chapter_number: 3,
      content: '箱に住所を書きます。\n\n「送り主」の欄に自分の日本の住所を書きます。「受取人」の欄に家族の住所を英語で書きます。\n\n「内容物」の欄には、「Sweets, Tea, Ornament」と書きます。\n\n価値は、「Total value: $50」と書きます。\n\n箱を窓口に持って行きます。「これを送りたいです」',
      content_en: 'You write the address on the box.\n\nIn the "Sender" section, you write your Japanese address. In the "Recipient" section, you write your family\'s address in English.\n\nIn the "Contents" section, you write "Sweets, Tea, Ornament."\n\nFor value, you write "Total value: $50."\n\nYou bring the box to the counter. "I want to send this."',
      parent_chapter_id: 'ch-18-2b',
    },
    {
      chapter_id: 'ch-18-3d',
      story_id: story18.story_id,
      chapter_number: 3,
      content: '窓口の人が箱を見て、「きれいに梱包されていますね。では、サービスを選んでください」と言います。\n\n「早く届けたいですが、料金も気になります。おすすめはどれですか？」\n\n「SAL便が人気ですよ。航空便より安くて、船便より早いです。2週間で届きます」\n\n「それでお願いします」\n\n窓口の人が計算します。「2.3キロで、アメリカまでSAL便は4200円です」',
      content_en: 'The counter staff looks at the box and says, "It\'s neatly packed. Now, please choose a service."\n\n"I want it to arrive quickly, but I\'m also concerned about the cost. Which do you recommend?"\n\n"SAL is popular. It\'s cheaper than airmail and faster than sea mail. It arrives in 2 weeks."\n\n"I\'ll go with that, please."\n\nThe counter staff calculates. "For 2.3 kilograms to America by SAL, it\'s 4200 yen."',
      parent_chapter_id: 'ch-18-2b',
    },
    {
      chapter_id: 'ch-18-3e',
      story_id: story18.story_id,
      chapter_number: 3,
      content: 'eパケットの封筒に住所を書きます。\n\n送り主と受取人の情報を英語で記入します。内容物の詳細も書きます。\n\n窓口に持って行くと、「はい、確認しますね」と言って、重さを測ります。\n\n「2キロですね。料金は3800円です。追跡番号が付いています」\n\n「ありがとうございます。支払いはカードでできますか？」\n\n「はい、クレジットカードも使えますよ」',
      content_en: 'You write the address on the ePacket envelope.\n\nYou fill in sender and recipient information in English. You also write the contents details.\n\nWhen you bring it to the counter, they say "Yes, let me check" and weigh it.\n\n"It\'s 2 kilograms. The fee is 3800 yen. It comes with a tracking number."\n\n"Thank you. Can I pay by card?"\n\n"Yes, credit cards are accepted."',
      parent_chapter_id: 'ch-18-2c',
    },
    {
      chapter_id: 'ch-18-3f',
      story_id: story18.story_id,
      chapter_number: 3,
      content: '窓口の人が説明します。「eパケットは追跡可能で、保険も少し付いています。破損や紛失の心配が少ないですよ」\n\n「それは安心ですね。でも、追加で保険を付けることはできますか？」\n\n「はい、できます。500円で5000円分の保険が付けられます」\n\n「では、保険も付けてください」\n\n「わかりました。合計で4300円になります」',
      content_en: 'The counter staff explains. "ePacket is trackable and comes with some insurance. There\'s less worry about damage or loss."\n\n"That\'s reassuring. But can I add additional insurance?"\n\n"Yes, you can. For 500 yen, you can add 5000 yen worth of insurance."\n\n"Then, please add insurance."\n\n"Understood. The total will be 4300 yen."',
      parent_chapter_id: 'ch-18-2c',
    },

    // Chapter 4: Convergence
    {
      chapter_id: 'ch-18-4',
      story_id: story18.story_id,
      chapter_number: 4,
      content: '料金を支払います。クレジットカードで支払いました。\n\n窓口の人がレシートと一緒に、小さな紙を渡してくれます。\n\n「こちらが追跡番号です。この番号で、荷物がどこにあるか確認できますよ」\n\n追跡番号を見ると、「EJ123456789JP」と書いてあります。\n\n「インターネットで追跡できますか？」\n\n「はい、日本郵便のウェブサイトで確認できます。アメリカに着いたら、USPSのサイトでも追跡できますよ」\n\n追跡番号をスマートフォンで写真に撮ります。',
      content_en: 'You pay the fee. You paid by credit card.\n\nThe counter staff hands you a small paper along with the receipt.\n\n"This is your tracking number. With this number, you can check where your package is."\n\nLooking at the tracking number, it says "EJ123456789JP."\n\n"Can I track it on the Internet?"\n\n"Yes, you can check on the Japan Post website. Once it arrives in America, you can also track it on the USPS site."\n\nYou take a photo of the tracking number with your smartphone.',
      parent_chapter_id: 'ch-18-3a',
    },

    // Chapter 5-9: Linear
    {
      chapter_id: 'ch-18-5',
      story_id: story18.story_id,
      chapter_number: 5,
      content: '「いつごろ届きますか？」と聞きます。\n\n窓口の人が答えます。「SAL便だと、だいたい2週間から3週間です。ただ、税関の混雑状況によって、少し遅れることもあります」\n\n「税関？」\n\n「はい、国際郵便は、送る国と受け取る国の両方で税関検査があります。食品を送る場合は、特に検査が厳しいこともありますよ」\n\n「わかりました。ありがとうございます」\n\n郵便局を出て、家に帰ります。',
      content_en: '"About when will it arrive?" you ask.\n\nThe counter staff answers. "With SAL, it\'s usually 2 to 3 weeks. However, depending on customs congestion, it may be slightly delayed."\n\n"Customs?"\n\n"Yes, international mail goes through customs inspection in both the sending and receiving countries. When sending food, inspections can be especially strict."\n\n"I understand. Thank you."\n\nYou leave the post office and go home.',
      parent_chapter_id: 'ch-18-4',
    },
    {
      chapter_id: 'ch-18-6',
      story_id: story18.story_id,
      chapter_number: 6,
      content: '家に帰って、すぐに家族にメールを送ります。\n\n「今日、お土産を送ったよ。追跡番号は EJ123456789JP です。2-3週間で届くと思います」\n\n家族から返事が来ました。「ありがとう！楽しみに待っているね」\n\n日本郵便のウェブサイトで追跡番号を入力します。\n\n「引受」と表示されています。荷物が郵便局で受け付けられたことがわかります。\n\nこれから毎日、追跡番号をチェックしようと思います。',
      content_en: 'You get home and immediately send an email to your family.\n\n"I sent souvenirs today. The tracking number is EJ123456789JP. I think it\'ll arrive in 2-3 weeks."\n\nYou receive a reply from your family. "Thank you! We\'re looking forward to it."\n\nYou enter the tracking number on the Japan Post website.\n\nIt shows "Accepted." You can see the package was received at the post office.\n\nYou plan to check the tracking number every day from now on.',
      parent_chapter_id: 'ch-18-5',
    },
    {
      chapter_id: 'ch-18-7',
      story_id: story18.story_id,
      chapter_number: 7,
      content: '3日後、追跡番号をチェックします。\n\nステータスが更新されています。「国際交換局から発送」\n\n「もう日本を出たんだ！」と嬉しくなります。\n\nUSPSのウェブサイトでも追跡番号を入力してみます。まだ情報は更新されていません。\n\n「アメリカに着いたら更新されるのかな」と思います。\n\n1週間後、もう一度チェックします。',
      content_en: 'Three days later, you check the tracking number.\n\nThe status has been updated. "Dispatched from outward office of exchange."\n\n"It\'s already left Japan!" you feel happy.\n\nYou also try entering the tracking number on the USPS website. The information hasn\'t been updated yet.\n\n"Maybe it\'ll update when it reaches America," you think.\n\nOne week later, you check again.',
      parent_chapter_id: 'ch-18-6',
    },
    {
      chapter_id: 'ch-18-8',
      story_id: story18.story_id,
      chapter_number: 8,
      content: 'USPSのサイトで確認すると、「到着しました」と表示されています！\n\n「やった！アメリカに着いたんだ」\n\nステータスを見ると、「税関検査中」となっています。\n\n「もう少しかかるかな」と思います。\n\n2日後、家族から連絡が来ました。「荷物が届いたよ！お菓子も置物もとてもきれい。ありがとう！」\n\n写真が送られてきました。家族が笑顔で荷物を開けている写真です。',
      content_en: 'When you check the USPS site, it shows "Arrived!"\n\n"Yes! It reached America."\n\nLooking at the status, it says "In customs."\n\n"It might take a bit longer," you think.\n\nTwo days later, you receive contact from your family. "The package arrived! The sweets and ornament are very nice. Thank you!"\n\nA photo is sent. It\'s a photo of your family smiling while opening the package.',
      parent_chapter_id: 'ch-18-7',
    },
    {
      chapter_id: 'ch-18-9',
      story_id: story18.story_id,
      chapter_number: 9,
      content: '荷物が無事に届いてよかったです。\n\n日本の郵便サービスはとても信頼できることがわかりました。\n\n追跡番号のおかげで、安心して待つことができました。\n\nあなたは：\n- 日本の郵便局の使い方を学びました\n- 国際郵便の送り方を経験しました\n- 伝票の書き方、サービスの選び方を知りました\n- 追跡番号で荷物を追跡する方法を学びました\n\n次回からは、もっとスムーズに荷物を送れそうです。\n\n日本の郵便サービス、とても便利でした！',
      content_en: 'You\'re glad the package arrived safely.\n\nYou learned that Japanese postal services are very reliable.\n\nThanks to the tracking number, you could wait with peace of mind.\n\nYou:\n- Learned how to use Japanese post offices\n- Experienced sending international mail\n- Know how to fill out forms and choose services\n- Learned how to track packages with tracking numbers\n\nFrom next time, you\'ll be able to send packages more smoothly.\n\nJapanese postal services were very convenient!',
      parent_chapter_id: 'ch-18-8',
    },
  ],
});

// Create choices
await prisma.choice.createMany({
  data: [
    // Chapter 1 choices
    {
      choice_id: 'choice-18-1-a',
      chapter_id: 'ch-18-1',
      choice_text: '窓口で小包を送る',
      choice_description: 'Send package at counter',
      next_chapter_id: 'ch-18-2a',
      display_order: 1,
    },
    {
      choice_id: 'choice-18-1-b',
      chapter_id: 'ch-18-1',
      choice_text: '専用の箱を買う',
      choice_description: 'Buy a dedicated box',
      next_chapter_id: 'ch-18-2b',
      display_order: 2,
    },
    {
      choice_id: 'choice-18-1-c',
      chapter_id: 'ch-18-1',
      choice_text: '安い方法を聞く',
      choice_description: 'Ask about cheap options',
      next_chapter_id: 'ch-18-2c',
      display_order: 3,
    },

    // Chapter 2 choices
    {
      choice_id: 'choice-18-2a-a',
      chapter_id: 'ch-18-2a',
      choice_text: '伝票を記入する',
      choice_description: 'Fill out the form',
      next_chapter_id: 'ch-18-3a',
      display_order: 1,
    },
    {
      choice_id: 'choice-18-2a-b',
      chapter_id: 'ch-18-2a',
      choice_text: 'サービスを選ぶ',
      choice_description: 'Choose a service',
      next_chapter_id: 'ch-18-3b',
      display_order: 2,
    },
    {
      choice_id: 'choice-18-2b-a',
      chapter_id: 'ch-18-2b',
      choice_text: '箱に住所を書く',
      choice_description: 'Write address on box',
      next_chapter_id: 'ch-18-3c',
      display_order: 1,
    },
    {
      choice_id: 'choice-18-2b-b',
      chapter_id: 'ch-18-2b',
      choice_text: 'おすすめのサービスを聞く',
      choice_description: 'Ask for recommended service',
      next_chapter_id: 'ch-18-3d',
      display_order: 2,
    },
    {
      choice_id: 'choice-18-2c-a',
      chapter_id: 'ch-18-2c',
      choice_text: '住所を記入する',
      choice_description: 'Fill in the address',
      next_chapter_id: 'ch-18-3e',
      display_order: 1,
    },
    {
      choice_id: 'choice-18-2c-b',
      chapter_id: 'ch-18-2c',
      choice_text: '保険を追加する',
      choice_description: 'Add insurance',
      next_chapter_id: 'ch-18-3f',
      display_order: 2,
    },

    // Chapter 3 choices (converge to 4)
    {
      choice_id: 'choice-18-3a-next',
      chapter_id: 'ch-18-3a',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-18-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-18-3b-next',
      chapter_id: 'ch-18-3b',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-18-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-18-3c-next',
      chapter_id: 'ch-18-3c',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-18-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-18-3d-next',
      chapter_id: 'ch-18-3d',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-18-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-18-3e-next',
      chapter_id: 'ch-18-3e',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-18-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-18-3f-next',
      chapter_id: 'ch-18-3f',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-18-4',
      display_order: 1,
    },

    // Chapter 4-8 linear choices
    {
      choice_id: 'choice-18-4-next',
      chapter_id: 'ch-18-4',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-18-5',
      display_order: 1,
    },
    {
      choice_id: 'choice-18-5-next',
      chapter_id: 'ch-18-5',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-18-6',
      display_order: 1,
    },
    {
      choice_id: 'choice-18-6-next',
      chapter_id: 'ch-18-6',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-18-7',
      display_order: 1,
    },
    {
      choice_id: 'choice-18-7-next',
      chapter_id: 'ch-18-7',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-18-8',
      display_order: 1,
    },
    {
      choice_id: 'choice-18-8-next',
      chapter_id: 'ch-18-8',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-18-9',
      display_order: 1,
    },
  ],
});

console.log('Created Story 18: 郵便局で (N3/B1) with 9 chapters');
