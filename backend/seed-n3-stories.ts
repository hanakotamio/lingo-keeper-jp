import prisma from './src/lib/db.js';

/**
 * Seed N3/B1 level Japanese learning stories
 * Total: 5 stories (IDs: 11-15)
 * Topics: Work situations, social interactions, daily challenges
 */
async function seedN3Stories() {
  console.log('Creating N3/B1 level stories...\n');

  try {
    // ============================================================
    // N3 / B1 Level Stories (5 stories)
    // ============================================================
    const n3Stories = [
      {
        id: '11',
        title: '新しい職場での初日',
        description: '転職先での初出勤。新しい環境に適応しながら、同僚との関係を築きます。',
        rootChapter: 'chapter-11-1',
        chapters: [
          {
            id: 'chapter-11-1',
            number: 1,
            title: '出社と挨拶',
            content: '今日は新しい会社での初出勤です。緊張しながらも、オフィスに到着しました。受付で「おはようございます。本日から配属になりました山田です」と挨拶をします。\n\n(Today is your first day at the new company. Although nervous, you arrived at the office. At reception, you greet: "Good morning. I\'m Yamada, starting my assignment today.")',
            learningPoints: {
              points: [
                'Formal workplace greetings: 本日から配属になりました',
                'Expressing nervousness: 緊張しながらも',
                'Business vocabulary: 出勤、配属、受付',
                'Polite language in professional settings'
              ]
            },
            vocabulary: {
              words: [
                { word: '出勤', reading: 'しゅっきん', meaning: 'going to work, attendance' },
                { word: '緊張', reading: 'きんちょう', meaning: 'tension, nervousness' },
                { word: '配属', reading: 'はいぞく', meaning: 'assignment, posting' },
                { word: '受付', reading: 'うけつけ', meaning: 'reception' },
                { word: 'オフィス', reading: 'おふぃす', meaning: 'office' }
              ]
            },
            choices: [
              {
                text: '上司に挨拶に行く (Go greet your supervisor)',
                nextChapter: 'chapter-11-2',
                difficulty: 0
              },
              {
                text: '先に自分の席を確認する (Check your desk first)',
                nextChapter: 'chapter-11-3',
                difficulty: 0
              }
            ]
          },
          {
            id: 'chapter-11-2',
            number: 2,
            title: '上司との面談',
            content: '部長の部屋をノックして入りました。「失礼いたします。本日付けで営業部に配属になりました山田と申します。ご指導のほど、よろしくお願いいたします」と丁寧に挨拶しました。部長は「これからよろしくね。分からないことがあったら、遠慮なく聞いてください」と優しく言ってくれました。\n\n(You knocked and entered the manager\'s office. "Excuse me. I\'m Yamada, who has been assigned to the Sales Department as of today. I look forward to your guidance." The manager kindly said, "Welcome aboard. Don\'t hesitate to ask if you have any questions.")',
            learningPoints: {
              points: [
                'Keigo expressions: 失礼いたします、申します、ご指導のほど',
                'Humble language: ～と申します',
                'Business phrases: 本日付けで、遠慮なく',
                'Professional introductions'
              ]
            },
            vocabulary: {
              words: [
                { word: '失礼', reading: 'しつれい', meaning: 'rudeness, impoliteness' },
                { word: '本日付け', reading: 'ほんじつづけ', meaning: 'as of today' },
                { word: '営業部', reading: 'えいぎょうぶ', meaning: 'sales department' },
                { word: '指導', reading: 'しどう', meaning: 'guidance, instruction' },
                { word: '遠慮', reading: 'えんりょ', meaning: 'hesitation, restraint' }
              ]
            },
            choices: []
          },
          {
            id: 'chapter-11-3',
            number: 3,
            title: '同僚との交流',
            content: '自分の席に着くと、隣の先輩社員が話しかけてきました。「初日はどうですか？慣れないことばかりで大変だと思いますが、何かあったら気軽に声をかけてくださいね」と親切に言ってくれました。ランチタイムには、チームのメンバーと一緒に食堂に行き、色々な話をしました。\n\n(When you sat at your desk, a senior colleague next to you spoke to you. "How\'s your first day? I know everything must be unfamiliar and difficult, but please feel free to ask me anything." At lunchtime, you went to the cafeteria with team members and had various conversations.)',
            learningPoints: {
              points: [
                'Casual workplace expressions: 気軽に声をかける',
                'Expressing difficulty: 大変だと思います',
                'Describing unfamiliarity: 慣れないことばかり',
                'Building workplace relationships'
              ]
            },
            vocabulary: {
              words: [
                { word: '先輩', reading: 'せんぱい', meaning: 'senior, upperclassman' },
                { word: '慣れる', reading: 'なれる', meaning: 'to get used to' },
                { word: '気軽', reading: 'きがる', meaning: 'casual, easygoing' },
                { word: '声をかける', reading: 'こえをかける', meaning: 'to call out to, to speak to' },
                { word: '食堂', reading: 'しょくどう', meaning: 'cafeteria, dining hall' }
              ]
            },
            choices: []
          }
        ]
      },
      {
        id: '12',
        title: '友人との待ち合わせトラブル',
        description: '約束の時間に遅れそうになり、連絡を取りながら対処します。',
        rootChapter: 'chapter-12-1',
        chapters: [
          {
            id: 'chapter-12-1',
            number: 1,
            title: '電車の遅延',
            content: '友達と渋谷で待ち合わせをしていましたが、乗っている電車が事故の影響で遅れています。スマホを見ると、約束の時間まであと15分しかありません。このままでは絶対に間に合いません。どうしよう。\n\n(You were supposed to meet your friend in Shibuya, but the train you\'re on is delayed due to an accident. Looking at your phone, you only have 15 minutes until the meeting time. There\'s no way you\'ll make it in time. What should you do?)',
            learningPoints: {
              points: [
                'Expressing time constraints: ～まであと～しかない',
                'Describing delays: 遅れる、影響',
                'Conditional expressions: このままでは',
                'Expressing certainty: 絶対に～ない'
              ]
            },
            vocabulary: {
              words: [
                { word: '待ち合わせ', reading: 'まちあわせ', meaning: 'meeting up, rendezvous' },
                { word: '遅延', reading: 'ちえん', meaning: 'delay' },
                { word: '事故', reading: 'じこ', meaning: 'accident' },
                { word: '影響', reading: 'えいきょう', meaning: 'influence, effect' },
                { word: '間に合う', reading: 'まにあう', meaning: 'to be in time' }
              ]
            },
            choices: [
              {
                text: 'すぐに電話で連絡する (Call immediately)',
                nextChapter: 'chapter-12-2',
                difficulty: 0
              },
              {
                text: 'LINEでメッセージを送る (Send a LINE message)',
                nextChapter: 'chapter-12-3',
                difficulty: 0
              }
            ]
          },
          {
            id: 'chapter-12-2',
            number: 2,
            title: '電話での謝罪',
            content: '友達に電話をかけました。「もしもし、ごめん！今、電車が遅れていて、30分くらい遅れそうなんだ。本当に申し訳ない」と謝りました。友達は「大丈夫だよ。じゃあ、先にカフェで待ってるね。気をつけて来てね」と言ってくれました。\n\n(You called your friend. "Hello, sorry! The train is delayed right now, and I\'ll probably be about 30 minutes late. I\'m really sorry." Your friend said, "No problem. I\'ll wait at a cafe. Come safely.")',
            learningPoints: {
              points: [
                'Apologizing expressions: 申し訳ない、ごめん',
                'Estimating time: ～くらい遅れそう',
                'Reassurance phrases: 大丈夫だよ',
                'Expressing concern: 気をつけて'
              ]
            },
            vocabulary: {
              words: [
                { word: '申し訳ない', reading: 'もうしわけない', meaning: 'inexcusable, sorry' },
                { word: '遅れる', reading: 'おくれる', meaning: 'to be late, to be delayed' },
                { word: '大丈夫', reading: 'だいじょうぶ', meaning: 'all right, okay' },
                { word: '気をつけて', reading: 'きをつけて', meaning: 'be careful, take care' }
              ]
            },
            choices: []
          },
          {
            id: 'chapter-12-3',
            number: 3,
            title: 'メッセージでの連絡',
            content: 'LINEで「ごめん！電車が止まってて、30分くらい遅れます💦先に何か食べて待っててください🙏」と送りました。すぐに友達から「了解！駅前のカフェにいるから、落ち着いて来てね☕」と返信が来ました。無事に連絡できてホッとしました。\n\n(You sent a LINE message: "Sorry! The train stopped and I\'ll be about 30 minutes late. Please eat something while waiting." Your friend immediately replied: "Got it! I\'m at the cafe in front of the station, so come calmly." You felt relieved that you communicated successfully.)',
            learningPoints: {
              points: [
                'Casual messaging language',
                'Request expressions: ～てください',
                'Expressing relief: ホッとする',
                'Modern communication vocabulary'
              ]
            },
            vocabulary: {
              words: [
                { word: '止まる', reading: 'とまる', meaning: 'to stop' },
                { word: '了解', reading: 'りょうかい', meaning: 'understood, roger' },
                { word: '駅前', reading: 'えきまえ', meaning: 'in front of the station' },
                { word: '落ち着く', reading: 'おちつく', meaning: 'to calm down' },
                { word: 'ホッとする', reading: 'ほっとする', meaning: 'to feel relieved' }
              ]
            },
            choices: []
          }
        ]
      },
      {
        id: '13',
        title: 'アパート探しの一日',
        description: '新しい住まいを探すために、不動産屋を訪れます。',
        rootChapter: 'chapter-13-1',
        chapters: [
          {
            id: 'chapter-13-1',
            number: 1,
            title: '不動産屋での相談',
            content: '引っ越しを考えているので、不動産屋に来ました。担当者に「駅から徒歩10分以内で、家賃が8万円以下の物件を探しています。できれば、日当たりが良くて、収納スペースが広い部屋が希望です」と伝えました。\n\n(You\'re thinking about moving, so you came to a real estate agency. You told the agent: "I\'m looking for a property within 10 minutes walk from the station, with rent under 80,000 yen. Preferably, I\'d like a room with good sunlight and lots of storage space.")',
            learningPoints: {
              points: [
                'Real estate vocabulary: 家賃、物件、収納',
                'Expressing preferences: できれば～が希望です',
                'Describing conditions: ～以内で、～以下の',
                'Making specific requests'
              ]
            },
            vocabulary: {
              words: [
                { word: '引っ越し', reading: 'ひっこし', meaning: 'moving (residence)' },
                { word: '不動産屋', reading: 'ふどうさんや', meaning: 'real estate agency' },
                { word: '徒歩', reading: 'とほ', meaning: 'on foot, walking' },
                { word: '家賃', reading: 'やちん', meaning: 'rent' },
                { word: '物件', reading: 'ぶっけん', meaning: 'property' },
                { word: '日当たり', reading: 'ひあたり', meaning: 'sunlight exposure' },
                { word: '収納', reading: 'しゅうのう', meaning: 'storage' }
              ]
            },
            choices: [
              {
                text: '実際に物件を見に行く (Go see the property)',
                nextChapter: 'chapter-13-2',
                difficulty: 0
              },
              {
                text: '他の条件も相談する (Discuss other conditions)',
                nextChapter: 'chapter-13-3',
                difficulty: 0
              }
            ]
          },
          {
            id: 'chapter-13-2',
            number: 2,
            title: '物件の内見',
            content: '担当者と一緒に物件を見に行きました。部屋に入ると、思ったより広く感じました。「キッチンは独立型ですし、バルコニーからの眺めも良いですよ。ただし、築年数は15年ほど経っています」と説明を受けました。設備は古いですが、リフォームされているので、清潔感があります。\n\n(You went to see the property with the agent. When you entered the room, it felt more spacious than expected. "The kitchen is separate, and the view from the balcony is nice. However, the building is about 15 years old," you were told. The facilities are old, but they\'ve been renovated, so it feels clean.)',
            learningPoints: {
              points: [
                'Comparative expressions: 思ったより',
                'Describing property features: 独立型、眺め',
                'Expressing conditions: ただし',
                'Property inspection vocabulary'
              ]
            },
            vocabulary: {
              words: [
                { word: '内見', reading: 'ないけん', meaning: 'property viewing' },
                { word: '独立型', reading: 'どくりつがた', meaning: 'separate type' },
                { word: 'バルコニー', reading: 'ばるこにー', meaning: 'balcony' },
                { word: '眺め', reading: 'ながめ', meaning: 'view' },
                { word: '築年数', reading: 'ちくねんすう', meaning: 'age of building' },
                { word: '設備', reading: 'せつび', meaning: 'facilities, equipment' },
                { word: '清潔感', reading: 'せいけつかん', meaning: 'sense of cleanliness' }
              ]
            },
            choices: []
          },
          {
            id: 'chapter-13-3',
            number: 3,
            title: '契約条件の確認',
            content: '「初期費用はどのくらいかかりますか？ペットは飼えますか？更新料はありますか？」と質問しました。担当者は「敷金が1ヶ月分、礼金が1ヶ月分、仲介手数料が0.5ヶ月分です。ペットは小型犬のみ可能で、別途ペット敷金が必要です。更新料は1年ごとに1ヶ月分です」と詳しく説明してくれました。\n\n(You asked: "How much are the initial costs? Can I keep pets? Is there a renewal fee?" The agent explained in detail: "The security deposit is one month, key money is one month, and the agency fee is 0.5 months. Only small dogs are allowed for pets, with a separate pet deposit required. The renewal fee is one month every year.")',
            learningPoints: {
              points: [
                'Real estate contracts: 敷金、礼金、仲介手数料',
                'Question patterns: ～はどのくらいですか',
                'Describing restrictions: ～のみ可能',
                'Detailed explanations'
              ]
            },
            vocabulary: {
              words: [
                { word: '初期費用', reading: 'しょきひよう', meaning: 'initial costs' },
                { word: '敷金', reading: 'しききん', meaning: 'security deposit' },
                { word: '礼金', reading: 'れいきん', meaning: 'key money' },
                { word: '仲介手数料', reading: 'ちゅうかいてすうりょう', meaning: 'brokerage fee' },
                { word: '別途', reading: 'べっと', meaning: 'separately' },
                { word: '更新料', reading: 'こうしんりょう', meaning: 'renewal fee' }
              ]
            },
            choices: []
          }
        ]
      },
      {
        id: '14',
        title: '健康診断の結果',
        description: '会社の健康診断を受けて、医師から結果を聞きます。',
        rootChapter: 'chapter-14-1',
        chapters: [
          {
            id: 'chapter-14-1',
            number: 1,
            title: '診断結果の通知',
            content: '先月受けた健康診断の結果が届きました。封筒を開けると、「要再検査」という文字が目に入りました。血液検査の数値が基準値を超えているようです。不安になって、会社の医務室に相談に行くことにしました。\n\n(The results from last month\'s health checkup arrived. When you opened the envelope, you noticed the words "Re-examination Required." It seems your blood test values exceeded the standard range. Feeling anxious, you decided to consult with the company\'s medical office.)',
            learningPoints: {
              points: [
                'Medical vocabulary: 健康診断、再検査、血液検査',
                'Expressing concern: 不安になる',
                'Describing results: 基準値を超える',
                'Decision-making: ～することにした'
              ]
            },
            vocabulary: {
              words: [
                { word: '健康診断', reading: 'けんこうしんだん', meaning: 'health checkup' },
                { word: '再検査', reading: 'さいけんさ', meaning: 're-examination' },
                { word: '血液検査', reading: 'けつえきけんさ', meaning: 'blood test' },
                { word: '数値', reading: 'すうち', meaning: 'numerical value' },
                { word: '基準値', reading: 'きじゅんち', meaning: 'standard value' },
                { word: '医務室', reading: 'いむしつ', meaning: 'medical office' },
                { word: '不安', reading: 'ふあん', meaning: 'anxiety, uneasiness' }
              ]
            },
            choices: [
              {
                text: '医務室で相談する (Consult at medical office)',
                nextChapter: 'chapter-14-2',
                difficulty: 0
              },
              {
                text: '専門病院を予約する (Book a specialist hospital)',
                nextChapter: 'chapter-14-3',
                difficulty: 0
              }
            ]
          },
          {
            id: 'chapter-14-2',
            number: 2,
            title: '産業医との面談',
            content: '医務室で産業医に診断結果を見せました。「コレステロール値が少し高めですね。最近、運動不足だったり、食生活が乱れたりしていませんか？」と聞かれました。「確かに、残業が多くて、コンビニ弁当ばかり食べています」と答えると、「なるほど。まずは生活習慣を見直すことから始めましょう。1ヶ月後にもう一度検査して、数値の変化を見てみましょう」とアドバイスを受けました。\n\n(You showed your diagnosis results to the occupational physician at the medical office. "Your cholesterol is a bit high. Have you been lacking exercise or having irregular eating habits lately?" When you answered, "Indeed, I have a lot of overtime and eat mostly convenience store meals," you received advice: "I see. Let\'s start by reviewing your lifestyle habits. Let\'s test again in a month and see how the values change.")',
            learningPoints: {
              points: [
                'Medical consultations: 診断結果を見せる',
                'Describing habits: 運動不足、食生活が乱れる',
                'Admitting patterns: 確かに～',
                'Receiving advice: ～から始めましょう'
              ]
            },
            vocabulary: {
              words: [
                { word: '産業医', reading: 'さんぎょうい', meaning: 'occupational physician' },
                { word: 'コレステロール', reading: 'これすてろーる', meaning: 'cholesterol' },
                { word: '運動不足', reading: 'うんどうぶそく', meaning: 'lack of exercise' },
                { word: '食生活', reading: 'しょくせいかつ', meaning: 'eating habits' },
                { word: '乱れる', reading: 'みだれる', meaning: 'to be disordered' },
                { word: '残業', reading: 'ざんぎょう', meaning: 'overtime work' },
                { word: '生活習慣', reading: 'せいかつしゅうかん', meaning: 'lifestyle habits' }
              ]
            },
            choices: []
          },
          {
            id: 'chapter-14-3',
            number: 3,
            title: '専門クリニックでの精密検査',
            content: '総合病院で精密検査を受けました。医師は「現時点では、治療が必要なほどではありません。ただ、このまま放置すると、将来的に生活習慣病のリスクが高まります。食事は野菜を中心に、脂っこいものを控えめにしてください。週に3回、30分程度の軽い運動を心がけるといいでしょう」と丁寧に説明してくれました。\n\n(You received a detailed examination at a general hospital. The doctor carefully explained: "At this point, it\'s not serious enough to require treatment. However, if left as is, your risk of lifestyle diseases will increase in the future. Focus on vegetables in your diet and cut back on oily foods. Try to do light exercise for about 30 minutes, three times a week.")',
            learningPoints: {
              points: [
                'Medical explanations: 治療が必要、精密検査',
                'Conditional warnings: このまま放置すると',
                'Health recommendations: ～を心がける',
                'Future predictions: 将来的に～'
              ]
            },
            vocabulary: {
              words: [
                { word: '精密検査', reading: 'せいみつけんさ', meaning: 'detailed examination' },
                { word: '治療', reading: 'ちりょう', meaning: 'treatment' },
                { word: '放置', reading: 'ほうち', meaning: 'leaving as is, neglect' },
                { word: '将来的', reading: 'しょうらいてき', meaning: 'in the future' },
                { word: '生活習慣病', reading: 'せいかつしゅうかんびょう', meaning: 'lifestyle disease' },
                { word: 'リスク', reading: 'りすく', meaning: 'risk' },
                { word: '心がける', reading: 'こころがける', meaning: 'to keep in mind, to try' }
              ]
            },
            choices: []
          }
        ]
      },
      {
        id: '15',
        title: '地域のボランティア活動',
        description: '地域の清掃ボランティアに参加して、住民との交流を深めます。',
        rootChapter: 'chapter-15-1',
        chapters: [
          {
            id: 'chapter-15-1',
            number: 1,
            title: 'ボランティア活動への参加',
            content: '地域の掲示板で見つけた清掃ボランティアに参加することにしました。集合場所の公園に行くと、すでに20人ほどの住民が集まっていました。主催者の方が「本日はお集まりいただき、ありがとうございます。地域の環境美化のため、皆さんのご協力に感謝いたします」と挨拶しました。\n\n(You decided to participate in a cleanup volunteer activity you found on the community bulletin board. When you went to the meeting place at the park, about 20 residents had already gathered. The organizer greeted everyone: "Thank you for gathering today. We appreciate your cooperation for beautifying our community environment.")',
            learningPoints: {
              points: [
                'Community participation: ボランティア、住民',
                'Formal gratitude: 感謝いたします',
                'Group activities vocabulary',
                'Expressing purposes: ～のため'
              ]
            },
            vocabulary: {
              words: [
                { word: 'ボランティア', reading: 'ぼらんてぃあ', meaning: 'volunteer' },
                { word: '掲示板', reading: 'けいじばん', meaning: 'bulletin board' },
                { word: '清掃', reading: 'せいそう', meaning: 'cleaning' },
                { word: '住民', reading: 'じゅうみん', meaning: 'resident' },
                { word: '主催者', reading: 'しゅさいしゃ', meaning: 'organizer' },
                { word: '環境美化', reading: 'かんきょうびか', meaning: 'environmental beautification' },
                { word: '協力', reading: 'きょうりょく', meaning: 'cooperation' }
              ]
            },
            choices: [
              {
                text: '公園エリアを担当する (Take charge of park area)',
                nextChapter: 'chapter-15-2',
                difficulty: 0
              },
              {
                text: '道路沿いを担当する (Take charge of roadside)',
                nextChapter: 'chapter-15-3',
                difficulty: 0
              }
            ]
          },
          {
            id: 'chapter-15-2',
            number: 2,
            title: '公園での清掃作業',
            content: '公園エリアの清掃を担当することになりました。トングとゴミ袋を持って、落ちているゴミを拾い始めました。同じグループの高齢者の方が「最近の若い人は、こういう活動に参加してくれて嬉しいわ。地域のつながりが薄れている中、こういう機会は大切ですね」と話しかけてきました。一緒に作業しながら、地域の歴史や昔の様子について色々と教えてもらいました。\n\n(You were assigned to clean the park area. With tongs and a garbage bag, you began picking up litter. An elderly person in the same group spoke to you: "I\'m happy that young people nowadays participate in activities like this. With community bonds weakening, opportunities like this are important." While working together, you learned various things about the area\'s history and how it used to be.)',
            learningPoints: {
              points: [
                'Expressing appreciation: 嬉しい、大切',
                'Describing social changes: つながりが薄れる',
                'Intergenerational communication',
                'Learning through interaction: 教えてもらう'
              ]
            },
            vocabulary: {
              words: [
                { word: 'トング', reading: 'とんぐ', meaning: 'tongs' },
                { word: 'ゴミ袋', reading: 'ごみぶくろ', meaning: 'garbage bag' },
                { word: '高齢者', reading: 'こうれいしゃ', meaning: 'elderly person' },
                { word: 'つながり', reading: 'つながり', meaning: 'connection, bond' },
                { word: '薄れる', reading: 'うすれる', meaning: 'to fade, to weaken' },
                { word: '機会', reading: 'きかい', meaning: 'opportunity' },
                { word: '様子', reading: 'ようす', meaning: 'state, appearance' }
              ]
            },
            choices: []
          },
          {
            id: 'chapter-15-3',
            number: 3,
            title: '道路沿いの清掃と交流',
            content: '道路沿いのグループに参加しました。作業中、近所のカフェのオーナーが冷たい飲み物を差し入れてくれました。「いつもありがとうございます。皆さんのおかげで、この通りがきれいに保たれています」と感謝されました。清掃後、参加者全員で集まり、「今後も定期的に活動を続けていきたいですね」「次回は植樹なども検討してはどうでしょうか」と、今後の活動について意見交換をしました。地域に貢献できて、充実感を感じました。\n\n(You joined the roadside group. During the work, a nearby cafe owner brought cold drinks. "Thank you always. Thanks to everyone, this street is kept clean," they expressed gratitude. After cleaning, all participants gathered and exchanged opinions about future activities: "We\'d like to continue activities regularly," "How about considering tree planting next time?" You felt fulfilled being able to contribute to the community.)',
            learningPoints: {
              points: [
                'Expressing gratitude: おかげで',
                'Making suggestions: ～してはどうでしょうか',
                'Discussing future plans: 今後、定期的に',
                'Expressing fulfillment: 充実感を感じる'
              ]
            },
            vocabulary: {
              words: [
                { word: 'オーナー', reading: 'おーなー', meaning: 'owner' },
                { word: '差し入れ', reading: 'さしいれ', meaning: 'bringing refreshments' },
                { word: '保つ', reading: 'たもつ', meaning: 'to maintain, to keep' },
                { word: '定期的', reading: 'ていきてき', meaning: 'regular, periodic' },
                { word: '植樹', reading: 'しょくじゅ', meaning: 'tree planting' },
                { word: '意見交換', reading: 'いけんこうかん', meaning: 'exchange of opinions' },
                { word: '貢献', reading: 'こうけん', meaning: 'contribution' },
                { word: '充実感', reading: 'じゅうじつかん', meaning: 'sense of fulfillment' }
              ]
            },
            choices: []
          }
        ]
      }
    ];

    // Insert N3/B1 stories
    for (const storyData of n3Stories) {
      const story = await prisma.story.create({
        data: {
          story_id: storyData.id,
          title: storyData.title,
          description: storyData.description,
          category: storyData.id === '11' || storyData.id === '14' ? 'work' :
                    storyData.id === '15' ? 'social' : 'daily_life',
          difficulty_level: 'intermediate',
          level_jlpt: 'N3',
          level_cefr: 'B1',
          estimated_time: 12,
          estimated_duration_minutes: 12,
          root_chapter_id: storyData.rootChapter,
          is_active: true,
        },
      });

      for (const chapterData of storyData.chapters) {
        const chapter = await prisma.chapter.create({
          data: {
            chapter_id: chapterData.id,
            story_id: story.story_id,
            chapter_number: chapterData.number,
            title: chapterData.title,
            content: chapterData.content,
            learning_points: chapterData.learningPoints,
            vocabulary: chapterData.vocabulary,
          },
        });

        if (chapterData.choices && chapterData.choices.length > 0) {
          for (const choiceData of chapterData.choices) {
            await prisma.choice.create({
              data: {
                chapter_id: chapter.chapter_id,
                choice_text: choiceData.text,
                next_chapter_id: choiceData.nextChapter || null,
                difficulty_adjustment: choiceData.difficulty,
              },
            });
          }
        }
      }

      console.log(`✅ Created: ${story.title}`);
    }

    console.log('\n✅ N3/B1 level stories created successfully!');
    console.log('Total stories created: 5 (IDs: 11-15)');
    console.log('\nStory categories:');
    console.log('- Work situations: 2 stories (11, 14)');
    console.log('- Social interactions: 1 story (15)');
    console.log('- Daily challenges: 2 stories (12, 13)');

  } catch (error) {
    console.error('❌ Error creating N3 stories:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedN3Stories();
