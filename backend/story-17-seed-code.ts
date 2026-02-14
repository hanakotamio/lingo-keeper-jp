// Story 17: 電車の乗り換え (Train Transfer) - N3/B1
// Category: transportation

const story17 = await prisma.story.create({
  data: {
    story_id: '17',
    title: '電車の乗り換え',
    title_en: 'Train Transfer',
    description: '東京の複雑な電車網を使って、目的地まで移動します。乗り換え案内アプリを使ったり、駅員さんに聞いたりして、正しい電車に乗ります。切符の買い方、改札の通り方、ホームの見つけ方など、日本の電車システムを学びます。乗り換えは最初は難しいですが、慣れればとても便利な交通手段です。',
    description_en: 'You use Tokyo\'s complex train network to travel to your destination. By using a transfer guidance app or asking station staff, you board the correct train. You learn about Japan\'s train system, including how to buy tickets, go through ticket gates, and find platforms. Transfers are difficult at first, but once you get used to them, trains are a very convenient means of transportation.',
    category: 'transportation',
    difficulty_level: 'intermediate',
    level_jlpt: 'N3',
    level_cefr: 'B1',
    estimated_time: 10,
    estimated_duration_minutes: 10,
    is_active: true,
    root_chapter_id: 'ch-17-1',
  },
});

// Create chapters
await prisma.chapter.createMany({
  data: [
    // Chapter 1: Root
    {
      chapter_id: 'ch-17-1',
      story_id: story17.story_id,
      chapter_number: 1,
      content: '今日は渋谷から新宿の友達のアパートに行く予定です。\n\n駅に到着しました。東京の電車は路線が多くて、最初は難しく感じます。\n\n目的地までの行き方を調べる必要があります。スマートフォンを取り出して、画面を見ます。\n\n「どうやって調べようかな」と考えます。\n\n周りを見ると、駅員さんもいるし、大きな路線図も壁に貼ってあります。\n\nどの方法で調べますか？',
      content_en: 'Today you plan to go from Shibuya to your friend\'s apartment in Shinjuku.\n\nYou arrive at the station. Tokyo\'s trains have many lines, and it feels difficult at first.\n\nYou need to check how to get to your destination. You take out your smartphone and look at the screen.\n\n"How should I look it up?" you think.\n\nLooking around, there are station staff and a large route map posted on the wall.\n\nWhich method will you use to check?',
      parent_chapter_id: null,
    },

    // Chapter 2A-C
    {
      chapter_id: 'ch-17-2a',
      story_id: story17.story_id,
      chapter_number: 2,
      content: '乗り換え案内アプリを開きます。「出発」に「渋谷」、「到着」に「新宿」と入力します。\n\n検索ボタンを押すと、いくつかのルートが表示されます。\n\n一番上のルートを見ると：\n- JR山手線で5分\n- 乗り換えなし\n- 運賃140円\n\n「なるほど、山手線に乗ればいいんだ。簡単そうだな」と思います。\n\nアプリには「4番線から発車」と書いてあります。\n\nホームに向かいます。',
      content_en: 'You open a transfer guidance app. You enter "Shibuya" for departure and "Shinjuku" for arrival.\n\nWhen you press the search button, several routes are displayed.\n\nLooking at the top route:\n- JR Yamanote Line, 5 minutes\n- No transfers\n- Fare 140 yen\n\n"I see, I just need to take the Yamanote Line. Seems easy," you think.\n\nThe app says "Departing from Platform 4."\n\nYou head to the platform.',
      parent_chapter_id: 'ch-17-1',
    },
    {
      chapter_id: 'ch-17-2b',
      story_id: story17.story_id,
      chapter_number: 2,
      content: '駅員さんのところに行きます。「すみません、新宿に行きたいのですが」と声をかけます。\n\n駅員さんは親切に説明してくれます。「新宿ですね。ここから山手線に乗ってください。4番線のホームです。5分くらいで着きますよ」\n\n「ありがとうございます。切符はどこで買えますか？」\n\n「券売機はあちらです。140円です」と指差して教えてくれます。\n\n駅員さんに聞いてよかったです。安心して進めます。',
      content_en: 'You go to the station staff. "Excuse me, I want to go to Shinjuku," you call out.\n\nThe station staff kindly explains. "Shinjuku. Please take the Yamanote Line from here. It\'s Platform 4. You\'ll arrive in about 5 minutes."\n\n"Thank you. Where can I buy a ticket?"\n\n"The ticket machines are over there. It\'s 140 yen," they say, pointing.\n\nYou\'re glad you asked the station staff. You can proceed with confidence.',
      parent_chapter_id: 'ch-17-1',
    },
    {
      chapter_id: 'ch-17-2c',
      story_id: story17.story_id,
      chapter_number: 2,
      content: '壁に貼ってある路線図を見ます。カラフルな線がたくさんあって、少し混乱します。\n\n「えっと、今いるのは渋谷で...新宿は...あった！」\n\n路線図を見ると、渋谷と新宿は緑色の線（山手線）でつながっています。\n\n「山手線に乗ればいいんだ。でも、どっちの方向だろう？」\n\n路線図をよく見ると、「内回り」と「外回り」があります。新宿方面は「外回り」のようです。\n\n少し時間がかかりましたが、自力で調べることができました。',
      content_en: 'You look at the route map posted on the wall. There are many colorful lines, and you feel a bit confused.\n\n"Let\'s see, I\'m at Shibuya now... and Shinjuku is... found it!"\n\nLooking at the route map, Shibuya and Shinjuku are connected by a green line (Yamanote Line).\n\n"I should take the Yamanote Line. But which direction?"\n\nLooking carefully at the route map, there\'s "Inbound" and "Outbound." The Shinjuku direction seems to be "Outbound."\n\nIt took a bit of time, but you were able to figure it out on your own.',
      parent_chapter_id: 'ch-17-1',
    },

    // Chapter 3A-F
    {
      chapter_id: 'ch-17-3a',
      story_id: story17.story_id,
      chapter_number: 3,
      content: '券売機の前に来ました。タッチパネル式の券売機です。\n\n画面に「きっぷ」「IC カード」のボタンがあります。\n\nICカードは持っていないので、「きっぷ」を選びます。\n\n路線図が表示されて、「140円」のボタンを押します。お金を入れて、切符が出てきました。\n\n「これで準備OK」と思います。\n\n改札に向かいます。',
      content_en: 'You arrive at the ticket machine. It\'s a touch-panel ticket machine.\n\nThe screen has buttons for "Ticket" and "IC Card."\n\nSince you don\'t have an IC card, you select "Ticket."\n\nA route map is displayed, and you press the "140 yen" button. You insert money, and a ticket comes out.\n\n"All set," you think.\n\nYou head to the ticket gate.',
      parent_chapter_id: 'ch-17-2a',
    },
    {
      chapter_id: 'ch-17-3b',
      story_id: story17.story_id,
      chapter_number: 3,
      content: '「ICカードを使った方が便利かな」と考えます。\n\n駅の売店でSuicaを買うことにします。「Suicaを1枚ください」\n\n店員さんが説明します。「デポジット500円と、チャージ金額が必要です。2000円チャージしますか？」\n\n「はい、お願いします」\n\n合計2500円を払って、Suicaを受け取ります。\n\n「これからは毎回切符を買わなくていいんだ。便利だな」\n\n改札に向かいます。',
      content_en: '"Maybe it\'s more convenient to use an IC card," you think.\n\nYou decide to buy a Suica at the station shop. "One Suica, please."\n\nThe clerk explains. "You need a 500 yen deposit and a charge amount. Shall we charge 2000 yen?"\n\n"Yes, please."\n\nYou pay a total of 2500 yen and receive the Suica.\n\n"From now on, I don\'t have to buy a ticket every time. How convenient."\n\nYou head to the ticket gate.',
      parent_chapter_id: 'ch-17-2a',
    },
    {
      chapter_id: 'ch-17-3c',
      story_id: story17.story_id,
      chapter_number: 3,
      content: '券売機で切符を買います。駅員さんが教えてくれた通り、140円のボタンを押します。\n\nお金を入れると、切符とお釣りが出てきます。\n\n切符を見ると、「渋谷→140円区間」と書いてあります。\n\n「これを改札に入れればいいんだな」と確認します。\n\n改札に向かいます。たくさんの人が改札を通っています。',
      content_en: 'You buy a ticket at the ticket machine. Just as the station staff told you, you press the 140 yen button.\n\nWhen you insert money, a ticket and change come out.\n\nLooking at the ticket, it says "Shibuya → 140 yen section."\n\n"I just need to insert this at the ticket gate," you confirm.\n\nYou head to the ticket gate. Many people are passing through the gates.',
      parent_chapter_id: 'ch-17-2b',
    },
    {
      chapter_id: 'ch-17-3d',
      story_id: story17.story_id,
      chapter_number: 3,
      content: '「モバイルSuicaも便利そうだな」と思います。\n\nスマートフォンにSuicaアプリをダウンロードします。\n\n新規登録をして、クレジットカードで1000円チャージします。\n\n「これでスマホをタッチするだけで改札を通れるんだ」\n\n便利な時代だと感心します。\n\n改札に向かいます。',
      content_en: '"Mobile Suica seems convenient too," you think.\n\nYou download the Suica app on your smartphone.\n\nYou register and charge 1000 yen with your credit card.\n\n"Now I can just touch my phone to pass through the ticket gate."\n\nYou\'re impressed by the convenient era.\n\nYou head to the ticket gate.',
      parent_chapter_id: 'ch-17-2b',
    },
    {
      chapter_id: 'ch-17-3e',
      story_id: story17.story_id,
      chapter_number: 3,
      content: '券売機に行って、140円の切符を買います。\n\n路線図を見ながら、金額を確認します。「渋谷から新宿は140円だな」\n\nお金を入れて、切符を受け取ります。\n\n改札に向かいます。改札機の使い方を観察します。\n\n他の人は切符を入れて、出てきた切符を取って、通っていきます。',
      content_en: 'You go to the ticket machine and buy a 140 yen ticket.\n\nWhile looking at the route map, you check the amount. "From Shibuya to Shinjuku is 140 yen."\n\nYou insert money and receive the ticket.\n\nYou head to the ticket gate. You observe how to use the ticket gate.\n\nOther people insert their tickets, take the ticket that comes out, and pass through.',
      parent_chapter_id: 'ch-17-2c',
    },
    {
      chapter_id: 'ch-17-3f',
      story_id: story17.story_id,
      chapter_number: 3,
      content: '「ICカードがあれば便利だな」と思い、券売機でSuicaを買います。\n\n券売機の画面で「Suica購入」を選び、500円のデポジットと1000円のチャージを選択します。\n\n合計1500円を払って、新しいSuicaカードが出てきました。\n\n「これで毎回切符を買わなくていいんだ」\n\n改札に向かいます。',
      content_en: '"An IC card would be convenient," you think, and buy a Suica at the ticket machine.\n\nOn the ticket machine screen, you select "Purchase Suica" and choose a 500 yen deposit and 1000 yen charge.\n\nYou pay a total of 1500 yen, and a new Suica card comes out.\n\n"Now I don\'t have to buy a ticket every time."\n\nYou head to the ticket gate.',
      parent_chapter_id: 'ch-17-2c',
    },

    // Chapter 4: Convergence
    {
      chapter_id: 'ch-17-4',
      story_id: story17.story_id,
      chapter_number: 4,
      content: '改札を無事に通過しました。\n\n案内表示を見ます。「JR山手線　4番線　新宿・池袋方面」と書いてあります。\n\n矢印に従って、階段を降りてホームに到着します。\n\nホームには電光掲示板があり、「次の電車　新宿方面　2分後」と表示されています。\n\nホームには黄色い線があり、「危ないので黄色い線の内側でお待ちください」とアナウンスが流れます。\n\n線の内側で待ちます。たくさんの人が並んでいます。\n\nまもなく電車が来ます。',
      content_en: 'You successfully pass through the ticket gate.\n\nYou look at the guidance signs. It says "JR Yamanote Line, Platform 4, Shinjuku/Ikebukuro direction."\n\nFollowing the arrows, you go down the stairs and arrive at the platform.\n\nThere\'s an electronic display board on the platform showing "Next train, Shinjuku direction, in 2 minutes."\n\nThere\'s a yellow line on the platform, and an announcement says "For safety, please wait inside the yellow line."\n\nYou wait inside the line. Many people are queuing.\n\nThe train will arrive soon.',
      parent_chapter_id: 'ch-17-3a',
    },

    // Chapter 5-9: Linear
    {
      chapter_id: 'ch-17-5',
      story_id: story17.story_id,
      chapter_number: 5,
      content: '電車が到着しました。ドアが開きます。\n\n降りる人を待ってから、電車に乗ります。これが日本のマナーです。\n\n車内は混んでいますが、席が一つ空いています。\n\nどうしますか？座りますか、それとも立っていますか？\n\n「5分だけだから、立っていてもいいかな」と思いますが、座った方が楽です。\n\n空いている席に座ることにします。\n\n電車が動き出します。車内アナウンスが流れます。「次は、原宿、原宿です」',
      content_en: 'The train arrives. The doors open.\n\nAfter waiting for people to get off, you board the train. This is Japanese etiquette.\n\nThe inside of the car is crowded, but there\'s one empty seat.\n\nWhat will you do? Will you sit, or stand?\n\n"It\'s only 5 minutes, so I could stand," you think, but sitting would be more comfortable.\n\nYou decide to sit in the empty seat.\n\nThe train starts moving. A car announcement plays. "Next is Harajuku, Harajuku."',
      parent_chapter_id: 'ch-17-4',
    },
    {
      chapter_id: 'ch-17-6',
      story_id: story17.story_id,
      chapter_number: 6,
      content: '原宿駅を通過します。次は代々木です。\n\n窓の外を見ると、東京の街並みが見えます。高いビルがたくさんあります。\n\nスマートフォンで現在地を確認します。「あと2駅だな」\n\n車内は静かです。みんな携帯を見たり、本を読んだり、寝たりしています。\n\n日本の電車は時間に正確で、静かです。とても便利な交通手段だと思います。\n\n「次は、新宿、新宿です」というアナウンスが聞こえます。',
      content_en: 'The train passes Harajuku Station. Next is Yoyogi.\n\nLooking out the window, you can see Tokyo\'s cityscape. There are many tall buildings.\n\nYou check your current location on your smartphone. "Two more stations."\n\nThe inside of the car is quiet. Everyone is looking at their phones, reading books, or sleeping.\n\nJapanese trains are punctual and quiet. You think they\'re a very convenient means of transportation.\n\nYou hear an announcement: "Next is Shinjuku, Shinjuku."',
      parent_chapter_id: 'ch-17-5',
    },
    {
      chapter_id: 'ch-17-7',
      story_id: story17.story_id,
      chapter_number: 7,
      content: '新宿駅に到着しました。ドアが開きます。\n\nたくさんの人が降ります。電車から降りて、ホームに立ちます。\n\n「さて、出口はどこかな」と周りを見ます。\n\n新宿駅は大きくて、出口がたくさんあります。案内板を見ると、「東口」「西口」「南口」など、いろいろな出口があります。\n\n友達のアパートは東口の近くです。「東口」の矢印に従って歩きます。\n\n改札に向かいます。',
      content_en: 'You arrive at Shinjuku Station. The doors open.\n\nMany people get off. You get off the train and stand on the platform.\n\n"Now, where\'s the exit?" you look around.\n\nShinjuku Station is large and has many exits. Looking at the information board, there are various exits like "East Exit," "West Exit," "South Exit."\n\nYour friend\'s apartment is near the East Exit. You follow the "East Exit" arrows and walk.\n\nYou head to the ticket gate.',
      parent_chapter_id: 'ch-17-6',
    },
    {
      chapter_id: 'ch-17-8',
      story_id: story17.story_id,
      chapter_number: 8,
      content: '改札を出ます。切符を入れると、切符は回収されて出られます。ICカードの場合は、タッチするだけです。\n\n改札を出ると、たくさんの店があります。カフェ、レストラン、コンビニ、本屋など。\n\n「新宿駅は本当に大きいな」と感心します。\n\n東口の階段を上って、地上に出ます。\n\n外に出ると、高いビルが並んでいます。人もたくさん歩いています。\n\nスマートフォンで地図を確認して、友達のアパートに向かいます。',
      content_en: 'You exit the ticket gate. When you insert your ticket, it\'s collected and you can exit. With an IC card, you just touch.\n\nOutside the ticket gate, there are many shops. Cafes, restaurants, convenience stores, bookstores, etc.\n\n"Shinjuku Station is really big," you\'re impressed.\n\nYou go up the East Exit stairs and come out to ground level.\n\nOutside, tall buildings line up. Many people are walking too.\n\nYou check the map on your smartphone and head to your friend\'s apartment.',
      parent_chapter_id: 'ch-17-7',
    },
    {
      chapter_id: 'ch-17-9',
      story_id: story17.story_id,
      chapter_number: 9,
      content: '10分歩いて、友達のアパートに到着しました。\n\nインターホンを押します。「はーい、今開けるね！」と友達の声が聞こえます。\n\n友達が笑顔で迎えてくれます。「よく来れたね！電車は大丈夫だった？」\n\n「うん、最初はちょっと不安だったけど、無事に着けたよ」\n\n「東京の電車は最初は難しいけど、慣れればすごく便利だよ」\n\nあなたは：\n- 東京の電車の乗り方を学びました\n- 切符の買い方、ICカードの使い方を知りました\n- 改札の通り方、ホームの見つけ方を経験しました\n- 乗り換えなしで目的地に到着しました\n\n次は、もっと複雑な乗り換えにも挑戦してみましょう！',
      content_en: 'After a 10-minute walk, you arrive at your friend\'s apartment.\n\nYou press the intercom. "Coming! I\'ll open it now!" you hear your friend\'s voice.\n\nYour friend greets you with a smile. "You made it! Was the train okay?"\n\n"Yeah, I was a bit nervous at first, but I arrived safely."\n\n"Tokyo trains are difficult at first, but once you get used to them, they\'re really convenient."\n\nYou:\n- Learned how to ride Tokyo trains\n- Know how to buy tickets and use IC cards\n- Experienced passing through ticket gates and finding platforms\n- Arrived at your destination without transfers\n\nNext time, let\'s try a more complex transfer!',
      parent_chapter_id: 'ch-17-8',
    },
  ],
});

// Create choices
await prisma.choice.createMany({
  data: [
    // Chapter 1 choices
    {
      choice_id: 'choice-17-1-a',
      chapter_id: 'ch-17-1',
      choice_text: 'スマホアプリで調べる',
      choice_description: 'Check with smartphone app',
      next_chapter_id: 'ch-17-2a',
      display_order: 1,
    },
    {
      choice_id: 'choice-17-1-b',
      chapter_id: 'ch-17-1',
      choice_text: '駅員さんに聞く',
      choice_description: 'Ask station staff',
      next_chapter_id: 'ch-17-2b',
      display_order: 2,
    },
    {
      choice_id: 'choice-17-1-c',
      chapter_id: 'ch-17-1',
      choice_text: '路線図を見る',
      choice_description: 'Look at route map',
      next_chapter_id: 'ch-17-2c',
      display_order: 3,
    },

    // Chapter 2 choices
    {
      choice_id: 'choice-17-2a-a',
      chapter_id: 'ch-17-2a',
      choice_text: '切符を買う',
      choice_description: 'Buy a ticket',
      next_chapter_id: 'ch-17-3a',
      display_order: 1,
    },
    {
      choice_id: 'choice-17-2a-b',
      chapter_id: 'ch-17-2a',
      choice_text: 'ICカードを買う',
      choice_description: 'Buy an IC card',
      next_chapter_id: 'ch-17-3b',
      display_order: 2,
    },
    {
      choice_id: 'choice-17-2b-a',
      chapter_id: 'ch-17-2b',
      choice_text: '切符を買う',
      choice_description: 'Buy a ticket',
      next_chapter_id: 'ch-17-3c',
      display_order: 1,
    },
    {
      choice_id: 'choice-17-2b-b',
      chapter_id: 'ch-17-2b',
      choice_text: 'モバイルSuicaを使う',
      choice_description: 'Use Mobile Suica',
      next_chapter_id: 'ch-17-3d',
      display_order: 2,
    },
    {
      choice_id: 'choice-17-2c-a',
      chapter_id: 'ch-17-2c',
      choice_text: '切符を買う',
      choice_description: 'Buy a ticket',
      next_chapter_id: 'ch-17-3e',
      display_order: 1,
    },
    {
      choice_id: 'choice-17-2c-b',
      chapter_id: 'ch-17-2c',
      choice_text: 'ICカードを買う',
      choice_description: 'Buy an IC card',
      next_chapter_id: 'ch-17-3f',
      display_order: 2,
    },

    // Chapter 3 choices (converge to 4)
    {
      choice_id: 'choice-17-3a-next',
      chapter_id: 'ch-17-3a',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-17-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-17-3b-next',
      chapter_id: 'ch-17-3b',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-17-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-17-3c-next',
      chapter_id: 'ch-17-3c',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-17-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-17-3d-next',
      chapter_id: 'ch-17-3d',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-17-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-17-3e-next',
      chapter_id: 'ch-17-3e',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-17-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-17-3f-next',
      chapter_id: 'ch-17-3f',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-17-4',
      display_order: 1,
    },

    // Chapter 4-8 linear choices
    {
      choice_id: 'choice-17-4-next',
      chapter_id: 'ch-17-4',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-17-5',
      display_order: 1,
    },
    {
      choice_id: 'choice-17-5-next',
      chapter_id: 'ch-17-5',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-17-6',
      display_order: 1,
    },
    {
      choice_id: 'choice-17-6-next',
      chapter_id: 'ch-17-6',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-17-7',
      display_order: 1,
    },
    {
      choice_id: 'choice-17-7-next',
      chapter_id: 'ch-17-7',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-17-8',
      display_order: 1,
    },
    {
      choice_id: 'choice-17-8-next',
      chapter_id: 'ch-17-8',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-17-9',
      display_order: 1,
    },
  ],
});

console.log('Created Story 17: 電車の乗り換え (N3/B1) with 9 chapters');
