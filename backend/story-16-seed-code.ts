// Story 16: アパートの契約 (Apartment Contract) - N3/B1
// Category: housing

const story16 = await prisma.story.create({
  data: {
    story_id: '16',
    title: 'アパートの契約',
    title_en: 'Apartment Contract',
    description: '日本でアパートを借りることになりました。不動産屋さんに行って、部屋を探します。予算、場所、間取りを決めて、物件を内見します。気に入った部屋が見つかったら、契約の手続きをします。日本の賃貸契約は少し複雑ですが、丁寧に説明を聞いて、無事に契約を完了させましょう。',
    description_en: 'You\'ve decided to rent an apartment in Japan. You visit a real estate agency to look for a place. You decide on your budget, location, and floor plan, then view properties. Once you find a room you like, you proceed with the contract procedures. Japanese rental contracts are somewhat complex, but listen carefully to the explanations and successfully complete the contract.',
    category: 'housing',
    difficulty_level: 'intermediate',
    level_jlpt: 'N3',
    level_cefr: 'B1',
    estimated_time: 10,
    estimated_duration_minutes: 10,
    is_active: true,
    root_chapter_id: 'ch-16-1',
  },
});

// Create chapters
await prisma.chapter.createMany({
  data: [
    // Chapter 1: Root
    {
      chapter_id: 'ch-16-1',
      story_id: story16.story_id,
      chapter_number: 1,
      content: '日本での生活が始まって1週間。ホテル暮らしはお金がかかるので、そろそろアパートを借りなければなりません。\n\n駅前の不動産屋に入ります。「いらっしゃいませ。今日はどのような物件をお探しですか？」と店員さんが聞きます。\n\n「はじめまして。日本に来たばかりで、アパートを探しています」と答えます。\n\n「そうですか。では、まずご希望の条件を教えていただけますか？」\n\n何を一番重視しますか？',
      content_en: 'One week has passed since you started living in Japan. Hotel living is expensive, so you must rent an apartment soon.\n\nYou enter a real estate agency in front of the station. "Welcome. What kind of property are you looking for today?" the staff asks.\n\n"Nice to meet you. I just came to Japan and I\'m looking for an apartment," you reply.\n\n"I see. Then, could you tell me your desired conditions first?"\n\nWhat do you prioritize most?',
      parent_chapter_id: null,
    },

    // Chapter 2A-C
    {
      chapter_id: 'ch-16-2a',
      story_id: story16.story_id,
      chapter_number: 2,
      content: '「予算をできるだけ抑えたいです。家賃は月6万円以内で探しています」と伝えます。\n\n店員さんは少し考えて、「6万円以内ですね。わかりました。この予算だと、駅から少し離れた場所や、ワンルームになりますが、よろしいですか？」と説明します。\n\n「はい、大丈夫です。駅から何分くらいですか？」\n\n「この物件は駅から徒歩15分です。静かな住宅街にあって、スーパーも近いですよ」\n\n予算内でいい条件の物件が見つかりそうです。',
      content_en: '"I want to keep the budget as low as possible. I\'m looking for rent within 60,000 yen per month," you tell them.\n\nThe staff thinks for a moment, "Within 60,000 yen. I understand. With this budget, it would be a bit far from the station or a studio apartment, is that okay?"\n\n"Yes, that\'s fine. About how many minutes from the station?"\n\n"This property is a 15-minute walk from the station. It\'s in a quiet residential area, and there\'s also a supermarket nearby."\n\nIt looks like you\'ll find a property with good conditions within your budget.',
      parent_chapter_id: 'ch-16-1',
    },
    {
      chapter_id: 'ch-16-2b',
      story_id: story16.story_id,
      chapter_number: 2,
      content: '「駅から近い場所がいいです。徒歩5分以内で探しています」と伝えます。\n\n「駅近ですね。承知しました。ただ、駅から5分以内の物件は人気が高いので、家賃が少し高めになります。予算はどのくらいですか？」と店員さんが聞きます。\n\n「月8万円くらいまでなら大丈夫です」\n\n「わかりました。それでしたら、いくつか良い物件があります。こちらの1Kはいかがですか？駅から徒歩3分、築5年で新しいですよ」\n\n駅近で便利そうな物件が見つかりました。',
      content_en: '"I want a location close to the station. I\'m looking within a 5-minute walk," you tell them.\n\n"Close to the station. Understood. However, properties within 5 minutes of the station are popular, so the rent will be a bit higher. What\'s your budget?" the staff asks.\n\n"Up to about 80,000 yen per month is fine."\n\n"I understand. In that case, there are several good properties. How about this 1K? It\'s a 3-minute walk from the station, and it\'s new, built 5 years ago."\n\nYou found a convenient property close to the station.',
      parent_chapter_id: 'ch-16-1',
    },
    {
      chapter_id: 'ch-16-2c',
      story_id: story16.story_id,
      chapter_number: 2,
      content: '「広めの部屋がいいです。1DKか1LDKを探しています」と伝えます。\n\n店員さんが説明します。「1DKか1LDKですね。料理をしたり、ゆっくり過ごせる広さですね。この条件だと、家賃は7万円から9万円くらいになります」\n\n「それくらいなら大丈夫です。キッチンが広い物件はありますか？」\n\n「ありますよ。こちらの1DKは、キッチンにガスコンロが2口あって、料理がしやすいです。バス・トイレも別ですよ」\n\n広くて快適そうな物件が見つかりました。',
      content_en: '"I want a spacious room. I\'m looking for a 1DK or 1LDK," you tell them.\n\nThe staff explains, "1DK or 1LDK. A size where you can cook and relax comfortably. With these conditions, the rent will be from about 70,000 to 90,000 yen."\n\n"That\'s fine. Are there any properties with a large kitchen?"\n\n"Yes, there are. This 1DK has a two-burner gas stove in the kitchen, making it easy to cook. The bath and toilet are also separate."\n\nYou found a spacious and comfortable-looking property.',
      parent_chapter_id: 'ch-16-1',
    },

    // Chapter 3A-F
    {
      chapter_id: 'ch-16-3a',
      story_id: story16.story_id,
      chapter_number: 3,
      content: '「では、この物件を見に行きましょう」と店員さんが言います。\n\n車で10分ほど移動して、物件に到着しました。3階建てのアパートです。\n\n部屋に入ると、コンパクトですが、きれいに整理されています。「築10年ですが、前の入居者がきれいに使っていたので、状態は良いですよ」\n\n窓から外を見ると、公園が見えます。日当たりも悪くありません。\n\n「初期費用はどのくらいかかりますか？」と聞きます。\n\n「敷金1ヶ月分、礼金1ヶ月分、仲介手数料1ヶ月分、それに最初の家賃を合わせて、約24万円です」',
      content_en: '"Then, let\'s go see this property," the staff says.\n\nAfter about a 10-minute drive, you arrive at the property. It\'s a 3-story apartment building.\n\nEntering the room, it\'s compact but neatly organized. "It\'s 10 years old, but the previous tenant used it carefully, so it\'s in good condition."\n\nLooking out the window, you can see a park. The sunlight isn\'t bad either.\n\n"About how much are the initial costs?" you ask.\n\n"One month\'s security deposit, one month\'s key money, one month\'s agency fee, plus the first month\'s rent, totaling about 240,000 yen."',
      parent_chapter_id: 'ch-16-2a',
    },
    {
      chapter_id: 'ch-16-3b',
      story_id: story16.story_id,
      chapter_number: 3,
      content: '「もう一つ、駅から10分の物件もご案内しますね」と店員さんが提案します。\n\n2つ目の物件は、駅から少し近く、スーパーマーケットの隣にあります。\n\n部屋は少し狭いですが、買い物に便利な立地です。「こちらは家賃が5万5千円です。初期費用も少し安くなりますよ」\n\n両方の物件を見比べて、考えることにします。',
      content_en: '"Let me also show you another property, 10 minutes from the station," the staff suggests.\n\nThe second property is a bit closer to the station and next to a supermarket.\n\nThe room is a bit smaller, but it\'s in a convenient location for shopping. "This one is 55,000 yen rent. The initial costs are also a bit cheaper."\n\nYou decide to compare both properties and think about it.',
      parent_chapter_id: 'ch-16-2a',
    },
    {
      chapter_id: 'ch-16-3c',
      story_id: story16.story_id,
      chapter_number: 3,
      content: '物件まで歩いて3分で到着しました。新しいマンションです。\n\nエレベーターで5階に上がります。部屋に入ると、とても明るくて、設備も新しいです。\n\n「エアコン、洗濯機置き場、インターネット回線、すべて完備されています。入居日はいつがご希望ですか？」と店員さんが聞きます。\n\n「来週から入居できますか？」\n\n「大丈夫です。審査に2-3日かかりますが、来週の月曜日から入居可能です」\n\n条件がとても良い物件です。',
      content_en: 'You arrive at the property in a 3-minute walk. It\'s a new apartment building.\n\nYou take the elevator to the 5th floor. Entering the room, it\'s very bright and the facilities are new.\n\n"Air conditioner, washing machine space, internet connection, everything is equipped. When would you like to move in?" the staff asks.\n\n"Can I move in from next week?"\n\n"That\'s fine. The screening takes 2-3 days, but you can move in from next Monday."\n\nThis property has very good conditions.',
      parent_chapter_id: 'ch-16-2b',
    },
    {
      chapter_id: 'ch-16-3d',
      story_id: story16.story_id,
      chapter_number: 3,
      content: '「もう一つ、家賃7万円の1Kもあります。広さは少し小さいですが、設備が良いですよ」\n\nその物件を見に行くと、ワンルームタイプですが、収納が多くて使いやすそうです。\n\n「家賃は少し安いけど、快適に住めそうだな」と思います。\n\n店員さんが「どちらの物件がよろしいですか？」と聞きます。',
      content_en: '"There\'s also another one, a 1K for 70,000 yen rent. It\'s a bit smaller, but the facilities are good."\n\nWhen you go to see that property, it\'s a studio type but has lots of storage and seems easy to use.\n\n"The rent is a bit cheaper, but I could live comfortably," you think.\n\nThe staff asks, "Which property would you prefer?"',
      parent_chapter_id: 'ch-16-2b',
    },
    {
      chapter_id: 'ch-16-3e',
      story_id: story16.story_id,
      chapter_number: 3,
      content: '1DKの物件を内見します。ダイニングキッチンが広くて、料理がしやすそうです。\n\n寝室も十分な広さがあり、ベッドと机を置いても余裕があります。\n\n「この広さなら、友達を呼ぶこともできますね」と店員さんが言います。\n\nバス・トイレが別なのも、とても便利です。\n\n「初期費用と、契約に必要な書類を教えてください」とお願いします。',
      content_en: 'You view the 1DK property. The dining kitchen is spacious and seems easy to cook in.\n\nThe bedroom also has sufficient space, with room to spare even with a bed and desk.\n\n"With this size, you could even invite friends over," the staff says.\n\nHaving the bath and toilet separate is also very convenient.\n\n"Please tell me the initial costs and the documents needed for the contract," you request.',
      parent_chapter_id: 'ch-16-2c',
    },
    {
      chapter_id: 'ch-16-3f',
      story_id: story16.story_id,
      chapter_number: 3,
      content: '2つの物件を見て、不動産屋に戻ります。\n\n「どちらの物件も良かったです。初期費用はどのくらい違いますか？」と聞きます。\n\n店員さんが計算して見せてくれます。「1DKの方が、初期費用が約5万円高くなります。でも、長く住むなら、広い方が快適ですよ」\n\n慎重に考えて、決めることにします。',
      content_en: 'After seeing two properties, you return to the real estate agency.\n\n"Both properties were good. How much do the initial costs differ?" you ask.\n\nThe staff calculates and shows you. "The 1DK will have initial costs about 50,000 yen higher. But if you\'re living long-term, the spacious one will be more comfortable."\n\nYou decide to think carefully before deciding.',
      parent_chapter_id: 'ch-16-2c',
    },

    // Chapter 4: Convergence
    {
      chapter_id: 'ch-16-4',
      story_id: story16.story_id,
      chapter_number: 4,
      content: '気に入った物件が決まりました。契約の手続きを進めます。\n\n店員さんが契約書を出して、詳しく説明してくれます。\n\n「家賃は毎月25日までに振り込んでください。契約期間は2年間で、更新する場合は更新料が1ヶ月分かかります」\n\n「保証人が必要ですか？」と聞くと、「はい、日本人の保証人が必要です。もし保証人がいない場合は、保証会社を利用することもできます」\n\n契約の条件をよく理解することが大切です。\n\n「わかりました。では、必要な書類を準備します」',
      content_en: 'You\'ve decided on the property you like. You proceed with the contract procedures.\n\nThe staff brings out the contract and explains it in detail.\n\n"Please transfer the rent by the 25th of each month. The contract period is 2 years, and if you renew, the renewal fee is one month\'s rent."\n\nWhen you ask "Do I need a guarantor?", they reply, "Yes, you need a Japanese guarantor. If you don\'t have a guarantor, you can also use a guarantee company."\n\nIt\'s important to understand the contract conditions well.\n\n"I understand. Then, I\'ll prepare the necessary documents."',
      parent_chapter_id: 'ch-16-3a',
    },

    // Chapter 5-9: Linear
    {
      chapter_id: 'ch-16-5',
      story_id: story16.story_id,
      chapter_number: 5,
      content: '契約に必要な書類を準備します。\n\n店員さんが説明します。「パスポートのコピー、在留カードのコピー、収入証明書、それに印鑑が必要です。保証会社を利用する場合は、保証会社の申込書も記入してください」\n\n「印鑑は持っていないのですが...」\n\n「そうですか。それでは、サインでも大丈夫です。ただ、将来のために印鑑を作っておくと便利ですよ」\n\n翌日、すべての書類を揃えて、不動産屋に持って行きます。\n\n審査には2-3日かかるそうです。',
      content_en: 'You prepare the necessary documents for the contract.\n\nThe staff explains, "You need a copy of your passport, a copy of your residence card, proof of income, and a seal. If you use a guarantee company, please also fill out the guarantee company\'s application form."\n\n"I don\'t have a seal though..."\n\n"I see. In that case, a signature is also fine. However, it\'s convenient to make a seal for the future."\n\nThe next day, you gather all the documents and bring them to the real estate agency.\n\nThe screening apparently takes 2-3 days.',
      parent_chapter_id: 'ch-16-4',
    },
    {
      chapter_id: 'ch-16-6',
      story_id: story16.story_id,
      chapter_number: 6,
      content: '3日後、不動産屋から連絡が来ました。「審査が通りました。おめでとうございます！」\n\n不動産屋に行って、正式に契約書に署名します。\n\n契約書は何枚もあって、すべてに署名が必要です。店員さんが一つ一つ説明しながら、丁寧に案内してくれます。\n\n「これで契約は完了です。初期費用をお支払いいただければ、鍵をお渡しします」\n\n銀行で振り込みを済ませて、不動産屋に戻ります。',
      content_en: 'Three days later, you receive a call from the real estate agency. "You\'ve passed the screening. Congratulations!"\n\nYou go to the real estate agency and formally sign the contract.\n\nThere are many pages to the contract, and all require signatures. The staff guides you carefully while explaining each one.\n\n"With this, the contract is complete. Once you pay the initial costs, we\'ll hand over the keys."\n\nYou complete the bank transfer and return to the real estate agency.',
      parent_chapter_id: 'ch-16-5',
    },
    {
      chapter_id: 'ch-16-7',
      story_id: story16.story_id,
      chapter_number: 7,
      content: '「振り込みを確認しました。では、鍵をお渡しします」と店員さんが言います。\n\n鍵を2本受け取ります。「一本は予備として、大切に保管してください。もし鍵を失くした場合は、すぐにご連絡ください」\n\n「はい、わかりました」\n\n部屋の使い方、ゴミ出しのルール、困ったときの連絡先など、最後の説明を受けます。\n\n「何か質問はありますか？」\n\n「大丈夫です。ありがとうございました」\n\nついに、自分の部屋の鍵を手に入れました。',
      content_en: '"We\'ve confirmed the transfer. Now, we\'ll hand over the keys," the staff says.\n\nYou receive two keys. "Please keep one as a spare. If you lose a key, please contact us immediately."\n\n"Yes, I understand."\n\nYou receive final explanations about how to use the room, garbage disposal rules, and emergency contacts.\n\n"Do you have any questions?"\n\n"I\'m fine. Thank you very much."\n\nYou\'ve finally obtained the keys to your own room.',
      parent_chapter_id: 'ch-16-6',
    },
    {
      chapter_id: 'ch-16-8',
      story_id: story16.story_id,
      chapter_number: 8,
      content: '新しいアパートに入ります。まだ家具は何もありませんが、自分の部屋です。\n\n窓を開けて、新鮮な空気を入れます。部屋の隅々を確認して、写真を撮ります。\n\n「まず、何を買わないといけないかな」と考えます。\n\nリストを作ります：\n- 布団かベッド\n- 冷蔵庫\n- 洗濯機\n- テーブル\n- カーテン\n\n近くの家具屋さんやホームセンターに行く予定です。\n\n少しずつ、自分の部屋を作っていきます。',
      content_en: 'You enter your new apartment. There\'s no furniture yet, but it\'s your own room.\n\nYou open the windows and let in fresh air. You check every corner of the room and take photos.\n\n"First, what do I need to buy?" you think.\n\nYou make a list:\n- Futon or bed\n- Refrigerator\n- Washing machine\n- Table\n- Curtains\n\nYou plan to go to nearby furniture stores and home centers.\n\nLittle by little, you\'ll create your own room.',
      parent_chapter_id: 'ch-16-7',
    },
    {
      chapter_id: 'ch-16-9',
      story_id: story16.story_id,
      chapter_number: 9,
      content: '入居して1週間が経ちました。\n\n基本的な家具と家電を揃えて、生活ができるようになりました。隣の部屋の人にも挨拶をして、良い関係を築いています。\n\nアパートの契約は大変でしたが、無事に完了しました。\n\nあなたは：\n- 日本の賃貸契約の仕組みを学びました\n- 不動産屋での会話を経験しました\n- 初期費用や契約条件について理解しました\n- 自分の希望に合った部屋を見つけました\n\nこれから、この部屋で新しい生活が始まります。\n\n日本での一人暮らし、頑張りましょう！',
      content_en: 'One week has passed since you moved in.\n\nYou\'ve acquired basic furniture and appliances and can now live properly. You\'ve also greeted your next-door neighbor and built a good relationship.\n\nThe apartment contract was difficult, but you completed it successfully.\n\nYou:\n- Learned about Japan\'s rental contract system\n- Experienced conversations at a real estate agency\n- Understood initial costs and contract conditions\n- Found a room that matches your preferences\n\nFrom now on, your new life begins in this room.\n\nLet\'s do your best living alone in Japan!',
      parent_chapter_id: 'ch-16-8',
    },
  ],
});

// Create choices
await prisma.choice.createMany({
  data: [
    // Chapter 1 choices
    {
      choice_id: 'choice-16-1-a',
      chapter_id: 'ch-16-1',
      choice_text: '予算を重視する',
      choice_description: 'Prioritize budget',
      next_chapter_id: 'ch-16-2a',
      display_order: 1,
    },
    {
      choice_id: 'choice-16-1-b',
      chapter_id: 'ch-16-1',
      choice_text: '場所を重視する',
      choice_description: 'Prioritize location',
      next_chapter_id: 'ch-16-2b',
      display_order: 2,
    },
    {
      choice_id: 'choice-16-1-c',
      chapter_id: 'ch-16-1',
      choice_text: '間取りを重視する',
      choice_description: 'Prioritize floor plan',
      next_chapter_id: 'ch-16-2c',
      display_order: 3,
    },

    // Chapter 2 choices
    {
      choice_id: 'choice-16-2a-a',
      chapter_id: 'ch-16-2a',
      choice_text: 'その物件を内見したい',
      choice_description: 'Want to view that property',
      next_chapter_id: 'ch-16-3a',
      display_order: 1,
    },
    {
      choice_id: 'choice-16-2a-b',
      chapter_id: 'ch-16-2a',
      choice_text: 'もう少し駅に近い物件も見たい',
      choice_description: 'Want to see a property closer to the station',
      next_chapter_id: 'ch-16-3b',
      display_order: 2,
    },
    {
      choice_id: 'choice-16-2b-a',
      chapter_id: 'ch-16-2b',
      choice_text: 'その物件を内見したい',
      choice_description: 'Want to view that property',
      next_chapter_id: 'ch-16-3c',
      display_order: 1,
    },
    {
      choice_id: 'choice-16-2b-b',
      chapter_id: 'ch-16-2b',
      choice_text: 'もう少し安い物件も見たい',
      choice_description: 'Want to see a cheaper property too',
      next_chapter_id: 'ch-16-3d',
      display_order: 2,
    },
    {
      choice_id: 'choice-16-2c-a',
      chapter_id: 'ch-16-2c',
      choice_text: 'その物件を内見したい',
      choice_description: 'Want to view that property',
      next_chapter_id: 'ch-16-3e',
      display_order: 1,
    },
    {
      choice_id: 'choice-16-2c-b',
      chapter_id: 'ch-16-2c',
      choice_text: 'もう少しコンパクトな物件も見たい',
      choice_description: 'Want to see a more compact property too',
      next_chapter_id: 'ch-16-3f',
      display_order: 2,
    },

    // Chapter 3 choices (converge to 4)
    {
      choice_id: 'choice-16-3a-next',
      chapter_id: 'ch-16-3a',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-16-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-16-3b-next',
      chapter_id: 'ch-16-3b',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-16-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-16-3c-next',
      chapter_id: 'ch-16-3c',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-16-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-16-3d-next',
      chapter_id: 'ch-16-3d',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-16-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-16-3e-next',
      chapter_id: 'ch-16-3e',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-16-4',
      display_order: 1,
    },
    {
      choice_id: 'choice-16-3f-next',
      chapter_id: 'ch-16-3f',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-16-4',
      display_order: 1,
    },

    // Chapter 4-8 linear choices
    {
      choice_id: 'choice-16-4-next',
      chapter_id: 'ch-16-4',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-16-5',
      display_order: 1,
    },
    {
      choice_id: 'choice-16-5-next',
      chapter_id: 'ch-16-5',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-16-6',
      display_order: 1,
    },
    {
      choice_id: 'choice-16-6-next',
      chapter_id: 'ch-16-6',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-16-7',
      display_order: 1,
    },
    {
      choice_id: 'choice-16-7-next',
      chapter_id: 'ch-16-7',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-16-8',
      display_order: 1,
    },
    {
      choice_id: 'choice-16-8-next',
      chapter_id: 'ch-16-8',
      choice_text: '次へ',
      choice_description: 'Next',
      next_chapter_id: 'ch-16-9',
      display_order: 1,
    },
  ],
});

console.log('Created Story 16: アパートの契約 (N3/B1) with 9 chapters');
