import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Starting database seeding...');

  // Clear existing data (for development)
  await prisma.quizResult.deleteMany();
  await prisma.quizChoice.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.choice.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.story.deleteMany();
  console.log('Cleared existing data');

  // ============================================================
  // Story 1: 東京での新しい生活 (N3/B1) - 5 Chapters with Branching
  // ============================================================
  const story1 = await prisma.story.create({
    data: {
      story_id: '1',
      title: '東京での新しい生活',
      description: '初めて東京に来た留学生の1日を追体験。渋谷での選択があなたの物語を変えます。',
      level_jlpt: 'N3',
      level_cefr: 'B1',
      estimated_time: 10,
      root_chapter_id: 'ch-1-1',
    },
  });

  const chapter1_1 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-1-1',
      story_id: story1.story_id,
      chapter_number: 1,
      depth_level: 0,
      content: '今日は私の東京での新しい生活の初めての日です。渋谷の駅に着いて、人の多さに驚きました。これから、どこへ行きましょうか?',
      content_with_ruby: '<ruby>今日<rt>きょう</rt></ruby>は<ruby>私<rt>わたし</rt></ruby>の<ruby>東京<rt>とうきょう</rt></ruby>での<ruby>新<rt>あたら</rt></ruby>しい<ruby>生活<rt>せいかつ</rt></ruby>の<ruby>初<rt>はじ</rt></ruby>めての<ruby>日<rt>ひ</rt></ruby>です。<ruby>渋谷<rt>しぶや</rt></ruby>の<ruby>駅<rt>えき</rt></ruby>に<ruby>着<rt>つ</rt></ruby>いて、<ruby>人<rt>ひと</rt></ruby>の<ruby>多<rt>おお</rt></ruby>さに<ruby>驚<rt>おどろ</rt></ruby>きました。これから、どこへ<ruby>行<rt>い</rt></ruby>きましょうか?',
      translation: 'Today is my first day of a new life in Tokyo. I arrived at Shibuya Station and was surprised by the number of people. Where should I go from here?',
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-1-1-a',
        chapter_id: chapter1_1.chapter_id,
        choice_text: 'カフェで休憩する',
        choice_description: '疲れたので、近くのカフェで一休みして、ゆっくり考えましょう。',
        next_chapter_id: 'ch-1-2a',
        display_order: 1,
      },
      {
        choice_id: 'choice-1-1-b',
        chapter_id: chapter1_1.chapter_id,
        choice_text: '観光スポットを探す',
        choice_description: 'せっかく渋谷に来たので、有名な観光地を訪れてみたいです。',
        next_chapter_id: 'ch-1-2b',
        display_order: 2,
      },
      {
        choice_id: 'choice-1-1-c',
        chapter_id: chapter1_1.chapter_id,
        choice_text: 'アパートへ直行する',
        choice_description: '荷物が重いので、まず新しいアパートに向かって荷物を置きたいです。',
        next_chapter_id: 'ch-1-2c',
        display_order: 3,
      },
    ],
  });

  await prisma.chapter.createMany({
    data: [
      // Chapter 2 variants
      {
        chapter_id: 'ch-1-2a',
        story_id: story1.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter1_1.chapter_id,
        content: '静かなカフェに入りました。窓際の席に座って、カフェラテを注文しました。外を見ると、渋谷のスクランブル交差点が見えます。多くの人が行き交っています。',
        content_with_ruby: '<ruby>静<rt>しず</rt></ruby>かなカフェに<ruby>入<rt>はい</rt></ruby>りました。<ruby>窓際<rt>まどぎわ</rt></ruby>の<ruby>席<rt>せき</rt></ruby>に<ruby>座<rt>すわ</rt></ruby>って、カフェラテを<ruby>注文<rt>ちゅうもん</rt></ruby>しました。<ruby>外<rt>そと</rt></ruby>を<ruby>見<rt>み</rt></ruby>ると、<ruby>渋谷<rt>しぶや</rt></ruby>のスクランブル<ruby>交差点<rt>こうさてん</rt></ruby>が<ruby>見<rt>み</rt></ruby>えます。<ruby>多<rt>おお</rt></ruby>くの<ruby>人<rt>ひと</rt></ruby>が<ruby>行<rt>い</rt></ruby>き<ruby>交<rt>か</rt></ruby>っています。',
        translation: 'I entered a quiet cafe. I sat at a window seat and ordered a cafe latte. Looking outside, I can see the Shibuya Scramble Crossing. Many people are passing by.',
      },
      {
        chapter_id: 'ch-1-2b',
        story_id: story1.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter1_1.chapter_id,
        content: 'ハチ公像の前に来ました。多くの観光客が写真を撮っています。私も記念写真を撮りました。次に、渋谷センター街を歩いてみることにしました。たくさんのお店があって、とても賑やかです。',
        content_with_ruby: 'ハチ<ruby>公像<rt>こうぞう</rt></ruby>の<ruby>前<rt>まえ</rt></ruby>に<ruby>来<rt>き</rt></ruby>ました。<ruby>多<rt>おお</rt></ruby>くの<ruby>観光客<rt>かんこうきゃく</rt></ruby>が<ruby>写真<rt>しゃしん</rt></ruby>を<ruby>撮<rt>と</rt></ruby>っています。<ruby>私<rt>わたし</rt></ruby>も<ruby>記念写真<rt>きねんしゃしん</rt></ruby>を<ruby>撮<rt>と</rt></ruby>りました。<ruby>次<rt>つぎ</rt></ruby>に、<ruby>渋谷<rt>しぶや</rt></ruby>センター<ruby>街<rt>がい</rt></ruby>を<ruby>歩<rt>ある</rt></ruby>いてみることにしました。たくさんのお<ruby>店<rt>みせ</rt></ruby>があって、とても<ruby>賑<rt>にぎ</rt></ruby>やかです。',
        translation: 'I came to the Hachiko statue. Many tourists are taking pictures. I also took a commemorative photo. Next, I decided to walk through Shibuya Center Street. There are many shops and it is very lively.',
      },
      {
        chapter_id: 'ch-1-2c',
        story_id: story1.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter1_1.chapter_id,
        content: '新しいアパートに到着しました。3階の部屋です。鍵を開けて中に入ると、小さいですが綺麗な部屋でした。窓から公園が見えます。これから、この部屋で新しい生活が始まります。',
        content_with_ruby: '<ruby>新<rt>あたら</rt></ruby>しいアパートに<ruby>到着<rt>とうちゃく</rt></ruby>しました。3<ruby>階<rt>かい</rt></ruby>の<ruby>部屋<rt>へや</rt></ruby>です。<ruby>鍵<rt>かぎ</rt></ruby>を<ruby>開<rt>あ</rt></ruby>けて<ruby>中<rt>なか</rt></ruby>に<ruby>入<rt>はい</rt></ruby>ると、<ruby>小<rt>ちい</rt></ruby>さいですが<ruby>綺麗<rt>きれい</rt></ruby>な<ruby>部屋<rt>へや</rt></ruby>でした。<ruby>窓<rt>まど</rt></ruby>から<ruby>公園<rt>こうえん</rt></ruby>が<ruby>見<rt>み</rt></ruby>えます。これから、この<ruby>部屋<rt>へや</rt></ruby>で<ruby>新<rt>あたら</rt></ruby>しい<ruby>生活<rt>せいかつ</rt></ruby>が<ruby>始<rt>はじ</rt></ruby>まります。',
        translation: 'I arrived at my new apartment. It is a room on the 3rd floor. When I opened the key and entered, it was a small but clean room. I can see a park from the window. From now on, a new life will begin in this room.',
      },
      // Chapter 3 variants
      {
        chapter_id: 'ch-1-3a',
        story_id: story1.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-1-2a',
        content: 'カフェで落ち着いた後、隣のテーブルの日本人に道を尋ねました。その人はとても親切で、おすすめの場所を教えてくれました。「明治神宮は静かで素敵ですよ」と言われ、行ってみることにしました。',
        content_with_ruby: 'カフェで<ruby>落<rt>お</rt></ruby>ち<ruby>着<rt>つ</rt></ruby>いた<ruby>後<rt>あと</rt></ruby>、<ruby>隣<rt>となり</rt></ruby>のテーブルの<ruby>日本人<rt>にほんじん</rt></ruby>に<ruby>道<rt>みち</rt></ruby>を<ruby>尋<rt>たず</rt></ruby>ねました。その<ruby>人<rt>ひと</rt></ruby>はとても<ruby>親切<rt>しんせつ</rt></ruby>で、おすすめの<ruby>場所<rt>ばしょ</rt></ruby>を<ruby>教<rt>おし</rt></ruby>えてくれました。「<ruby>明治神宮<rt>めいじじんぐう</rt></ruby>は<ruby>静<rt>しず</rt></ruby>かで<ruby>素敵<rt>すてき</rt></ruby>ですよ」と<ruby>言<rt>い</rt></ruby>われ、<ruby>行<rt>い</rt></ruby>ってみることにしました。',
        translation: 'After settling down at the cafe, I asked a Japanese person at the next table for directions. That person was very kind and told me about recommended places. They said "Meiji Shrine is quiet and wonderful," so I decided to go there.',
      },
      {
        chapter_id: 'ch-1-3b',
        story_id: story1.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-1-2b',
        content: '渋谷を歩き回っているうちに、小さな神社を見つけました。都会の真ん中にある静かな場所です。お参りをして、これからの東京生活がうまくいくようにお願いしました。',
        content_with_ruby: '<ruby>渋谷<rt>しぶや</rt></ruby>を<ruby>歩<rt>ある</rt></ruby>き<ruby>回<rt>まわ</rt></ruby>っているうちに、<ruby>小<rt>ちい</rt></ruby>さな<ruby>神社<rt>じんじゃ</rt></ruby>を<ruby>見<rt>み</rt></ruby>つけました。<ruby>都会<rt>とかい</rt></ruby>の<ruby>真<rt>ま</rt></ruby>ん<ruby>中<rt>なか</rt></ruby>にある<ruby>静<rt>しず</rt></ruby>かな<ruby>場所<rt>ばしょ</rt></ruby>です。お<ruby>参<rt>まい</rt></ruby>りをして、これからの<ruby>東京<rt>とうきょう</rt></ruby><ruby>生活<rt>せいかつ</rt></ruby>がうまくいくようにお<ruby>願<rt>ねが</rt></ruby>いしました。',
        translation: 'While walking around Shibuya, I found a small shrine. It is a quiet place in the middle of the city. I prayed and wished for my Tokyo life to go well.',
      },
      {
        chapter_id: 'ch-1-3c',
        story_id: story1.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-1-2c',
        content: '荷物を置いた後、近所を散歩してみました。スーパーやコンビニ、駅までの道を確認しました。近くに公園もあって、朝のジョギングに良さそうです。この街での生活が楽しみになってきました。',
        content_with_ruby: '<ruby>荷物<rt>にもつ</rt></ruby>を<ruby>置<rt>お</rt></ruby>いた<ruby>後<rt>あと</rt></ruby>、<ruby>近所<rt>きんじょ</rt></ruby>を<ruby>散歩<rt>さんぽ</rt></ruby>してみました。スーパーやコンビニ、<ruby>駅<rt>えき</rt></ruby>までの<ruby>道<rt>みち</rt></ruby>を<ruby>確認<rt>かくにん</rt></ruby>しました。<ruby>近<rt>ちか</rt></ruby>くに<ruby>公園<rt>こうえん</rt></ruby>もあって、<ruby>朝<rt>あさ</rt></ruby>のジョギングに<ruby>良<rt>よ</rt></ruby>さそうです。この<ruby>街<rt>まち</rt></ruby>での<ruby>生活<rt>せいかつ</rt></ruby>が<ruby>楽<rt>たの</rt></ruby>しみになってきました。',
        translation: 'After putting down my luggage, I took a walk around the neighborhood. I checked the way to the supermarket, convenience store, and station. There is also a park nearby, which looks good for morning jogging. I am looking forward to life in this town.',
      },
      // Chapter 4 (convergence)
      {
        chapter_id: 'ch-1-4',
        story_id: story1.story_id,
        chapter_number: 4,
        depth_level: 3,
        parent_chapter_id: 'ch-1-3a',
        content: '夕方になり、素敵な定食屋さんを見つけました。店主のおばさんが「いらっしゃい！」と元気に迎えてくれました。生姜焼き定食を注文すると、とても美味しくて感動しました。「また来てね」と言われ、心が温かくなりました。',
        content_with_ruby: '<ruby>夕方<rt>ゆうがた</rt></ruby>になり、<ruby>素敵<rt>すてき</rt></ruby>な<ruby>定食屋<rt>ていしょくや</rt></ruby>さんを<ruby>見<rt>み</rt></ruby>つけました。<ruby>店主<rt>てんしゅ</rt></ruby>のおばさんが「いらっしゃい！」と<ruby>元気<rt>げんき</rt></ruby>に<ruby>迎<rt>むか</rt></ruby>えてくれました。<ruby>生姜焼<rt>しょうがや</rt></ruby>き<ruby>定食<rt>ていしょく</rt></ruby>を<ruby>注文<rt>ちゅうもん</rt></ruby>すると、とても<ruby>美味<rt>おい</rt></ruby>しくて<ruby>感動<rt>かんどう</rt></ruby>しました。「また<ruby>来<rt>き</rt></ruby>てね」と<ruby>言<rt>い</rt></ruby>われ、<ruby>心<rt>こころ</rt></ruby>が<ruby>温<rt>あたた</rt></ruby>かくなりました。',
        translation: 'In the evening, I found a nice set meal restaurant. The owner, an elderly woman, greeted me cheerfully with "Welcome!" When I ordered the ginger pork set meal, it was so delicious that I was moved. She said "Come again," and my heart warmed.',
      },
      // Chapter 5 (conclusion)
      {
        chapter_id: 'ch-1-5',
        story_id: story1.story_id,
        chapter_number: 5,
        depth_level: 4,
        parent_chapter_id: 'ch-1-4',
        content: '東京での最初の一日が終わりました。少し疲れましたが、とても充実した時間でした。明日から日本語学校が始まります。新しい友達ができるといいなと思いながら、眠りにつきました。',
        content_with_ruby: '<ruby>東京<rt>とうきょう</rt></ruby>での<ruby>最初<rt>さいしょ</rt></ruby>の<ruby>一日<rt>いちにち</rt></ruby>が<ruby>終<rt>お</rt></ruby>わりました。<ruby>少<rt>すこ</rt></ruby>し<ruby>疲<rt>つか</rt></ruby>れましたが、とても<ruby>充実<rt>じゅうじつ</rt></ruby>した<ruby>時間<rt>じかん</rt></ruby>でした。<ruby>明日<rt>あした</rt></ruby>から<ruby>日本語<rt>にほんご</rt></ruby><ruby>学校<rt>がっこう</rt></ruby>が<ruby>始<rt>はじ</rt></ruby>まります。<ruby>新<rt>あたら</rt></ruby>しい<ruby>友達<rt>ともだち</rt></ruby>ができるといいなと<ruby>思<rt>おも</rt></ruby>いながら、<ruby>眠<rt>ねむ</rt></ruby>りにつきました。',
        translation: 'My first day in Tokyo is over. I was a little tired, but it was a very fulfilling time. Japanese language school starts tomorrow. I fell asleep hoping to make new friends.',
      },
    ],
  });

  // Add choices for chapter 2 variants to chapter 3 variants
  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-1-2a-to-3a',
        chapter_id: 'ch-1-2a',
        choice_text: '次へ進む',
        choice_description: 'ストーリーを続けます。',
        next_chapter_id: 'ch-1-3a',
        display_order: 1,
      },
      {
        choice_id: 'choice-1-2b-to-3b',
        chapter_id: 'ch-1-2b',
        choice_text: '次へ進む',
        choice_description: 'ストーリーを続けます。',
        next_chapter_id: 'ch-1-3b',
        display_order: 1,
      },
      {
        choice_id: 'choice-1-2c-to-3c',
        chapter_id: 'ch-1-2c',
        choice_text: '次へ進む',
        choice_description: 'ストーリーを続けます。',
        next_chapter_id: 'ch-1-3c',
        display_order: 1,
      },
    ],
  });

  // Add choices for chapter 3 variants to chapter 4 (convergence)
  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-1-3a-to-4',
        chapter_id: 'ch-1-3a',
        choice_text: '次へ進む',
        choice_description: 'ストーリーを続けます。',
        next_chapter_id: 'ch-1-4',
        display_order: 1,
      },
      {
        choice_id: 'choice-1-3b-to-4',
        chapter_id: 'ch-1-3b',
        choice_text: '次へ進む',
        choice_description: 'ストーリーを続けます。',
        next_chapter_id: 'ch-1-4',
        display_order: 1,
      },
      {
        choice_id: 'choice-1-3c-to-4',
        chapter_id: 'ch-1-3c',
        choice_text: '次へ進む',
        choice_description: 'ストーリーを続けます。',
        next_chapter_id: 'ch-1-4',
        display_order: 1,
      },
    ],
  });

  // Add choice from chapter 4 to chapter 5
  await prisma.choice.create({
    data: {
      choice_id: 'choice-1-4-to-5',
      chapter_id: 'ch-1-4',
      choice_text: '次へ進む',
      choice_description: 'ストーリーを完結させます。',
      next_chapter_id: 'ch-1-5',
      display_order: 1,
    },
  });

  console.log('Created Story 1 (東京での新しい生活) with 5 chapters and branching structure');

  // ============================================================
  // Story 2: カフェでの出会い (N4/A2) - 5 Chapters with Branching
  // ============================================================
  const story2 = await prisma.story.create({
    data: {
      story_id: '2',
      title: 'カフェでの出会い',
      description: '偶然入ったカフェで始まる、心温まる友情のストーリー。',
      level_jlpt: 'N4',
      level_cefr: 'A2',
      estimated_time: 8,
      root_chapter_id: 'ch-2-1',
    },
  });

  const chapter2_1 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-2-1',
      story_id: story2.story_id,
      chapter_number: 1,
      depth_level: 0,
      content: '雨の日、私は小さなカフェに入りました。中は暖かくて、コーヒーのいい香りがしました。席に座ると、隣のテーブルに同じくらいの年齢の人が座っていました。どうしますか？',
      content_with_ruby: '<ruby>雨<rt>あめ</rt></ruby>の<ruby>日<rt>ひ</rt></ruby>、<ruby>私<rt>わたし</rt></ruby>は<ruby>小<rt>ちい</rt></ruby>さなカフェに<ruby>入<rt>はい</rt></ruby>りました。<ruby>中<rt>なか</rt></ruby>は<ruby>暖<rt>あたた</rt></ruby>かくて、コーヒーのいい<ruby>香<rt>かお</rt></ruby>りがしました。<ruby>席<rt>せき</rt></ruby>に<ruby>座<rt>すわ</rt></ruby>ると、<ruby>隣<rt>となり</rt></ruby>のテーブルに<ruby>同<rt>おな</rt></ruby>じくらいの<ruby>年齢<rt>ねんれい</rt></ruby>の<ruby>人<rt>ひと</rt></ruby>が<ruby>座<rt>すわ</rt></ruby>っていました。どうしますか？',
      translation: 'On a rainy day, I entered a small cafe. Inside was warm and smelled of good coffee. When I sat down, there was a person about the same age sitting at the next table. What will you do?',
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-2-1-a',
        chapter_id: chapter2_1.chapter_id,
        choice_text: '話しかける',
        choice_description: '勇気を出して、隣の人に話しかけてみます。',
        next_chapter_id: 'ch-2-2a',
        display_order: 1,
      },
      {
        choice_id: 'choice-2-1-b',
        chapter_id: chapter2_1.chapter_id,
        choice_text: '本を読む',
        choice_description: '静かに自分の時間を楽しみます。持ってきた本を読みます。',
        next_chapter_id: 'ch-2-2b',
        display_order: 2,
      },
      {
        choice_id: 'choice-2-1-c',
        chapter_id: chapter2_1.chapter_id,
        choice_text: 'スマホを見る',
        choice_description: 'スマホで日本語のニュースを読んで、勉強します。',
        next_chapter_id: 'ch-2-2c',
        display_order: 3,
      },
    ],
  });

  await prisma.chapter.createMany({
    data: [
      // Chapter 2 variants
      {
        chapter_id: 'ch-2-2a',
        story_id: story2.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter2_1.chapter_id,
        content: 'その人は日本語の教科書を読んでいました。「日本語を勉強していますか？」と話しかけると、笑顔で「はい、でも難しいです」と答えました。私たちは日本語の勉強について話し始めました。',
        content_with_ruby: 'その<ruby>人<rt>ひと</rt></ruby>は<ruby>日本語<rt>にほんご</rt></ruby>の<ruby>教科書<rt>きょうかしょ</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んでいました。「<ruby>日本語<rt>にほんご</rt></ruby>を<ruby>勉強<rt>べんきょう</rt></ruby>していますか？」と<ruby>話<rt>はな</rt></ruby>しかけると、<ruby>笑顔<rt>えがお</rt></ruby>で「はい、でも<ruby>難<rt>むずか</rt></ruby>しいです」と<ruby>答<rt>こた</rt></ruby>えました。<ruby>私<rt>わたし</rt></ruby>たちは<ruby>日本語<rt>にほんご</rt></ruby>の<ruby>勉強<rt>べんきょう</rt></ruby>について<ruby>話<rt>はな</rt></ruby>し<ruby>始<rt>はじ</rt></ruby>めました。',
        translation: 'That person was reading a Japanese textbook. When I spoke to them saying "Are you studying Japanese?", they answered with a smile "Yes, but it\'s difficult." We started talking about studying Japanese.',
      },
      {
        chapter_id: 'ch-2-2b',
        story_id: story2.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter2_1.chapter_id,
        content: '本を開いて読み始めました。村上春樹の小説です。少し難しいですが、とても面白いです。30分くらい読んでいると、隣の人が「それ、面白いですか？」と聞いてきました。',
        content_with_ruby: '<ruby>本<rt>ほん</rt></ruby>を<ruby>開<rt>ひら</rt></ruby>いて<ruby>読<rt>よ</rt></ruby>み<ruby>始<rt>はじ</rt></ruby>めました。<ruby>村上春樹<rt>むらかみはるき</rt></ruby>の<ruby>小説<rt>しょうせつ</rt></ruby>です。<ruby>少<rt>すこ</rt></ruby>し<ruby>難<rt>むずか</rt></ruby>しいですが、とても<ruby>面白<rt>おもしろ</rt></ruby>いです。30<ruby>分<rt>ぷん</rt></ruby>くらい<ruby>読<rt>よ</rt></ruby>んでいると、<ruby>隣<rt>となり</rt></ruby>の<ruby>人<rt>ひと</rt></ruby>が「それ、<ruby>面白<rt>おもしろ</rt></ruby>いですか？」と<ruby>聞<rt>き</rt></ruby>いてきました。',
        translation: 'I opened the book and started reading. It\'s a Haruki Murakami novel. It\'s a little difficult, but very interesting. After reading for about 30 minutes, the person next to me asked, "Is that interesting?"',
      },
      {
        chapter_id: 'ch-2-2c',
        story_id: story2.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter2_1.chapter_id,
        content: 'スマホでニュースを読んでいると、隣の人が「すみません、Wi-Fiのパスワードを知っていますか？」と聞いてきました。店員さんに聞いて教えてあげると、「ありがとうございます」と感謝されました。',
        content_with_ruby: 'スマホでニュースを<ruby>読<rt>よ</rt></ruby>んでいると、<ruby>隣<rt>となり</rt></ruby>の<ruby>人<rt>ひと</rt></ruby>が「すみません、Wi-Fiのパスワードを<ruby>知<rt>し</rt></ruby>っていますか？」と<ruby>聞<rt>き</rt></ruby>いてきました。<ruby>店員<rt>てんいん</rt></ruby>さんに<ruby>聞<rt>き</rt></ruby>いて<ruby>教<rt>おし</rt></ruby>えてあげると、「ありがとうございます」と<ruby>感謝<rt>かんしゃ</rt></ruby>されました。',
        translation: 'While reading news on my smartphone, the person next to me asked, "Excuse me, do you know the Wi-Fi password?" When I asked the staff and told them, they thanked me saying "Thank you very much."',
      },
      // Chapter 3 variants
      {
        chapter_id: 'ch-2-3a',
        story_id: story2.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-2-2a',
        content: '相手はマリアさんというフィリピンの留学生でした。お互いに日本語学習の大変さを話し合いました。「一緒に勉強しませんか？」と誘うと、「ぜひ！」と嬉しそうに答えてくれました。連絡先を交換しました。',
        content_with_ruby: '<ruby>相手<rt>あいて</rt></ruby>はマリアさんというフィリピンの<ruby>留学生<rt>りゅうがくせい</rt></ruby>でした。お<ruby>互<rt>たが</rt></ruby>いに<ruby>日本語<rt>にほんご</rt></ruby><ruby>学習<rt>がくしゅう</rt></ruby>の<ruby>大変<rt>たいへん</rt></ruby>さを<ruby>話<rt>はな</rt></ruby>し<ruby>合<rt>あ</rt></ruby>いました。「<ruby>一緒<rt>いっしょ</rt></ruby>に<ruby>勉強<rt>べんきょう</rt></ruby>しませんか？」と<ruby>誘<rt>さそ</rt></ruby>うと、「ぜひ！」と<ruby>嬉<rt>うれ</rt></ruby>しそうに<ruby>答<rt>こた</rt></ruby>えてくれました。<ruby>連絡先<rt>れんらくさき</rt></ruby>を<ruby>交換<rt>こうかん</rt></ruby>しました。',
        translation: 'The other person was Maria, an exchange student from the Philippines. We talked to each other about the difficulties of learning Japanese. When I invited her saying "Shall we study together?", she happily answered "Yes!" We exchanged contact information.',
      },
      {
        chapter_id: 'ch-2-3b',
        story_id: story2.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-2-2b',
        content: '私は「とても面白いですよ。日本文学に興味がありますか？」と答えました。その人も文学が好きで、話が盛り上がりました。気づいたら2時間も話していました。名前はケンさんという日本人でした。',
        content_with_ruby: '<ruby>私<rt>わたし</rt></ruby>は「とても<ruby>面白<rt>おもしろ</rt></ruby>いですよ。<ruby>日本<rt>にほん</rt></ruby><ruby>文学<rt>ぶんがく</rt></ruby>に<ruby>興味<rt>きょうみ</rt></ruby>がありますか？」と<ruby>答<rt>こた</rt></ruby>えました。その<ruby>人<rt>ひと</rt></ruby>も<ruby>文学<rt>ぶんがく</rt></ruby>が<ruby>好<rt>す</rt></ruby>きで、<ruby>話<rt>はなし</rt></ruby>が<ruby>盛<rt>も</rt></ruby>り<ruby>上<rt>あ</rt></ruby>がりました。<ruby>気<rt>き</rt></ruby>づいたら2<ruby>時間<rt>じかん</rt></ruby>も<ruby>話<rt>はな</rt></ruby>していました。<ruby>名前<rt>なまえ</rt></ruby>はケンさんという<ruby>日本人<rt>にほんじん</rt></ruby>でした。',
        translation: 'I answered, "It\'s very interesting. Are you interested in Japanese literature?" That person also liked literature, and the conversation became lively. Before I knew it, we had been talking for two hours. His name was Ken, a Japanese person.',
      },
      {
        chapter_id: 'ch-2-3c',
        story_id: story2.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-2-2c',
        content: 'その人はサラさんというアメリカ人でした。日本に来て3ヶ月だそうです。「この辺りで美味しいレストランを知っていますか？」と聞かれました。知っている店を教えてあげると、とても喜んでくれました。',
        content_with_ruby: 'その<ruby>人<rt>ひと</rt></ruby>はサラさんというアメリカ<ruby>人<rt>じん</rt></ruby>でした。<ruby>日本<rt>にほん</rt></ruby>に<ruby>来<rt>き</rt></ruby>て3ヶ<ruby>月<rt>げつ</rt></ruby>だそうです。「この<ruby>辺<rt>へん</rt></ruby>りで<ruby>美味<rt>おい</rt></ruby>しいレストランを<ruby>知<rt>し</rt></ruby>っていますか？」と<ruby>聞<rt>き</rt></ruby>かれました。<ruby>知<rt>し</rt></ruby>っている<ruby>店<rt>みせ</rt></ruby>を<ruby>教<rt>おし</rt></ruby>えてあげると、とても<ruby>喜<rt>よろこ</rt></ruby>んでくれました。',
        translation: 'That person was Sarah, an American. She said she had been in Japan for 3 months. She asked me, "Do you know any good restaurants around here?" When I told her about a restaurant I knew, she was very pleased.',
      },
      // Chapter 4 (convergence)
      {
        chapter_id: 'ch-2-4',
        story_id: story2.story_id,
        chapter_number: 4,
        depth_level: 3,
        parent_chapter_id: 'ch-2-3a',
        content: '雨が止んで、外に出ることにしました。「また会いましょう」と約束して別れました。新しい友達ができて、心が温かくなりました。一人で来たカフェでしたが、素敵な出会いがありました。',
        content_with_ruby: '<ruby>雨<rt>あめ</rt></ruby>が<ruby>止<rt>や</rt></ruby>んで、<ruby>外<rt>そと</rt></ruby>に<ruby>出<rt>で</rt></ruby>ることにしました。「また<ruby>会<rt>あ</rt></ruby>いましょう」と<ruby>約束<rt>やくそく</rt></ruby>して<ruby>別<rt>わか</rt></ruby>れました。<ruby>新<rt>あたら</rt></ruby>しい<ruby>友達<rt>ともだち</rt></ruby>ができて、<ruby>心<rt>こころ</rt></ruby>が<ruby>温<rt>あたた</rt></ruby>かくなりました。<ruby>一人<rt>ひとり</rt></ruby>で<ruby>来<rt>き</rt></ruby>たカフェでしたが、<ruby>素敵<rt>すてき</rt></ruby>な<ruby>出会<rt>であ</rt></ruby>いがありました。',
        translation: 'The rain stopped and we decided to go outside. We promised to meet again and parted ways. I made a new friend and my heart warmed. I came to the cafe alone, but had a wonderful encounter.',
      },
      // Chapter 5 (conclusion)
      {
        chapter_id: 'ch-2-5',
        story_id: story2.story_id,
        chapter_number: 5,
        depth_level: 4,
        parent_chapter_id: 'ch-2-4',
        content: '家に帰る道、今日のことを思い出しながら歩きました。雨の日に偶然入ったカフェで、素晴らしい友達ができました。これからもこの友情を大切にしたいと思います。日本での生活が、もっと楽しくなりそうです。',
        content_with_ruby: '<ruby>家<rt>いえ</rt></ruby>に<ruby>帰<rt>かえ</rt></ruby>る<ruby>道<rt>みち</rt></ruby>、<ruby>今日<rt>きょう</rt></ruby>のことを<ruby>思<rt>おも</rt></ruby>い<ruby>出<rt>だ</rt></ruby>しながら<ruby>歩<rt>ある</rt></ruby>きました。<ruby>雨<rt>あめ</rt></ruby>の<ruby>日<rt>ひ</rt></ruby>に<ruby>偶然<rt>ぐうぜん</rt></ruby><ruby>入<rt>はい</rt></ruby>ったカフェで、<ruby>素晴<rt>すば</rt></ruby>らしい<ruby>友達<rt>ともだち</rt></ruby>ができました。これからもこの<ruby>友情<rt>ゆうじょう</rt></ruby>を<ruby>大切<rt>たいせつ</rt></ruby>にしたいと<ruby>思<rt>おも</rt></ruby>います。<ruby>日本<rt>にほん</rt></ruby>での<ruby>生活<rt>せいかつ</rt></ruby>が、もっと<ruby>楽<rt>たの</rt></ruby>しくなりそうです。',
        translation: 'On my way home, I walked while remembering today\'s events. At the cafe I entered by chance on a rainy day, I made a wonderful friend. I want to cherish this friendship from now on. Life in Japan seems to be getting more fun.',
      },
    ],
  });

  // Add choices for Story 2
  await prisma.choice.createMany({
    data: [
      // Chapter 2 to 3
      {
        choice_id: 'choice-2-2a-to-3a',
        chapter_id: 'ch-2-2a',
        choice_text: '次へ進む',
        choice_description: 'ストーリーを続けます。',
        next_chapter_id: 'ch-2-3a',
        display_order: 1,
      },
      {
        choice_id: 'choice-2-2b-to-3b',
        chapter_id: 'ch-2-2b',
        choice_text: '次へ進む',
        choice_description: 'ストーリーを続けます。',
        next_chapter_id: 'ch-2-3b',
        display_order: 1,
      },
      {
        choice_id: 'choice-2-2c-to-3c',
        chapter_id: 'ch-2-2c',
        choice_text: '次へ進む',
        choice_description: 'ストーリーを続けます。',
        next_chapter_id: 'ch-2-3c',
        display_order: 1,
      },
      // Chapter 3 to 4
      {
        choice_id: 'choice-2-3a-to-4',
        chapter_id: 'ch-2-3a',
        choice_text: '次へ進む',
        choice_description: 'ストーリーを続けます。',
        next_chapter_id: 'ch-2-4',
        display_order: 1,
      },
      {
        choice_id: 'choice-2-3b-to-4',
        chapter_id: 'ch-2-3b',
        choice_text: '次へ進む',
        choice_description: 'ストーリーを続けます。',
        next_chapter_id: 'ch-2-4',
        display_order: 1,
      },
      {
        choice_id: 'choice-2-3c-to-4',
        chapter_id: 'ch-2-3c',
        choice_text: '次へ進む',
        choice_description: 'ストーリーを続けます。',
        next_chapter_id: 'ch-2-4',
        display_order: 1,
      },
      // Chapter 4 to 5
      {
        choice_id: 'choice-2-4-to-5',
        chapter_id: 'ch-2-4',
        choice_text: '次へ進む',
        choice_description: 'ストーリーを完結させます。',
        next_chapter_id: 'ch-2-5',
        display_order: 1,
      },
    ],
  });

  console.log('Created Story 2 (カフェでの出会い) with 5 chapters and branching structure');

  // ============================================================
  // Story 3: 初めてのコンビニ (N5/A1) - 5 Chapters with Branching
  // ============================================================
  const story3 = await prisma.story.create({
    data: {
      story_id: '3',
      title: '初めてのコンビニ',
      description: '初めて日本のコンビニで買い物をする体験。便利な日本のコンビニ文化を学びます。',
      level_jlpt: 'N5',
      level_cefr: 'A1',
      estimated_time: 6,
      root_chapter_id: 'ch-3-1',
    },
  });

  const chapter3_1 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-3-1',
      story_id: story3.story_id,
      chapter_number: 1,
      depth_level: 0,
      content: '今日、初めてコンビニに行きます。コンビニの中には、たくさんの物があります。おにぎり、飲み物、お菓子、何でもあります。何を見ますか？',
      content_with_ruby: '<ruby>今日<rt>きょう</rt></ruby>、<ruby>初<rt>はじ</rt></ruby>めてコンビニに<ruby>行<rt>い</rt></ruby>きます。コンビニの<ruby>中<rt>なか</rt></ruby>には、たくさんの<ruby>物<rt>もの</rt></ruby>があります。おにぎり、<ruby>飲<rt>の</rt></ruby>み<ruby>物<rt>もの</rt></ruby>、お<ruby>菓子<rt>かし</rt></ruby>、<ruby>何<rt>なん</rt></ruby>でもあります。<ruby>何<rt>なに</rt></ruby>を<ruby>見<rt>み</rt></ruby>ますか？',
      translation: 'Today, I am going to a convenience store for the first time. Inside the convenience store, there are many things. Rice balls, drinks, snacks, everything. What will you look at?',
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-3-1-a',
        chapter_id: chapter3_1.chapter_id,
        choice_text: 'おにぎりを見る',
        choice_description: 'おにぎりのコーナーに行きます。いろいろな種類があります。',
        next_chapter_id: 'ch-3-2a',
        display_order: 1,
      },
      {
        choice_id: 'choice-3-1-b',
        chapter_id: chapter3_1.chapter_id,
        choice_text: '飲み物を見る',
        choice_description: '飲み物のコーナーに行きます。お茶やジュースがあります。',
        next_chapter_id: 'ch-3-2b',
        display_order: 2,
      },
      {
        choice_id: 'choice-3-1-c',
        chapter_id: chapter3_1.chapter_id,
        choice_text: 'お菓子を見る',
        choice_description: 'お菓子のコーナーに行きます。ポテトチップスやチョコレートがあります。',
        next_chapter_id: 'ch-3-2c',
        display_order: 3,
      },
    ],
  });

  await prisma.chapter.createMany({
    data: [
      {
        chapter_id: 'ch-3-2a',
        story_id: story3.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter3_1.chapter_id,
        content: 'おにぎりのコーナーに来ました。ツナマヨ、梅、鮭、いろいろな種類があります。全部美味しそうです。どれを選びますか？',
        content_with_ruby: 'おにぎりのコーナーに<ruby>来<rt>き</rt></ruby>ました。ツナマヨ、<ruby>梅<rt>うめ</rt></ruby>、<ruby>鮭<rt>さけ</rt></ruby>、いろいろな<ruby>種類<rt>しゅるい</rt></ruby>があります。<ruby>全部<rt>ぜんぶ</rt></ruby><ruby>美味<rt>おい</rt></ruby>しそうです。どれを<ruby>選<rt>えら</rt></ruby>びますか？',
        translation: 'I came to the rice ball corner. There are tuna mayo, pickled plum, salmon, various types. They all look delicious. Which one will you choose?',
      },
      {
        chapter_id: 'ch-3-2b',
        story_id: story3.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter3_1.chapter_id,
        content: '飲み物のコーナーに来ました。冷蔵庫にたくさんの飲み物があります。緑茶、麦茶、ジュース、コーヒー、たくさんあります。のどが渇きました。何を買いますか？',
        content_with_ruby: '<ruby>飲<rt>の</rt></ruby>み<ruby>物<rt>もの</rt></ruby>のコーナーに<ruby>来<rt>き</rt></ruby>ました。<ruby>冷蔵庫<rt>れいぞうこ</rt></ruby>にたくさんの<ruby>飲<rt>の</rt></ruby>み<ruby>物<rt>もの</rt></ruby>があります。<ruby>緑茶<rt>りょくちゃ</rt></ruby>、<ruby>麦茶<rt>むぎちゃ</rt></ruby>、ジュース、コーヒー、たくさんあります。のどが<ruby>渇<rt>かわ</rt></ruby>きました。<ruby>何<rt>なに</rt></ruby>を<ruby>買<rt>か</rt></ruby>いますか？',
        translation: 'I came to the drink corner. There are many drinks in the refrigerator. Green tea, barley tea, juice, coffee, there are many. I am thirsty. What will you buy?',
      },
      {
        chapter_id: 'ch-3-2c',
        story_id: story3.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter3_1.chapter_id,
        content: 'お菓子のコーナーに来ました。棚にはポテトチップス、チョコレート、クッキー、飴、たくさんのお菓子があります。どれも美味しそうです。何を選びますか？',
        content_with_ruby: 'お<ruby>菓子<rt>かし</rt></ruby>のコーナーに<ruby>来<rt>き</rt></ruby>ました。<ruby>棚<rt>たな</rt></ruby>にはポテトチップス、チョコレート、クッキー、<ruby>飴<rt>あめ</rt></ruby>、たくさんのお<ruby>菓子<rt>かし</rt></ruby>があります。どれも<ruby>美味<rt>おい</rt></ruby>しそうです。<ruby>何<rt>なに</rt></ruby>を<ruby>選<rt>えら</rt></ruby>びますか？',
        translation: 'I came to the snack corner. On the shelves are potato chips, chocolate, cookies, candy, many snacks. They all look delicious. What will you choose?',
      },
      {
        chapter_id: 'ch-3-3a',
        story_id: story3.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-3-2a',
        content: 'ツナマヨのおにぎりを選びました。一つ120円です。安いです。レジに持って行きます。',
        content_with_ruby: 'ツナマヨのおにぎりを<ruby>選<rt>えら</rt></ruby>びました。<ruby>一<rt>ひと</rt></ruby>つ120<ruby>円<rt>えん</rt></ruby>です。<ruby>安<rt>やす</rt></ruby>いです。レジに<ruby>持<rt>も</rt></ruby>って<ruby>行<rt>い</rt></ruby>きます。',
        translation: 'I chose a tuna mayo rice ball. One is 120 yen. It is cheap. I will take it to the register.',
      },
      {
        chapter_id: 'ch-3-3b',
        story_id: story3.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-3-2b',
        content: '緑茶を選びました。ペットボトルで150円です。日本の緑茶は美味しいと聞きました。楽しみです。レジに持って行きます。',
        content_with_ruby: '<ruby>緑茶<rt>りょくちゃ</rt></ruby>を<ruby>選<rt>えら</rt></ruby>びました。ペットボトルで150<ruby>円<rt>えん</rt></ruby>です。<ruby>日本<rt>にほん</rt></ruby>の<ruby>緑茶<rt>りょくちゃ</rt></ruby>は<ruby>美味<rt>おい</rt></ruby>しいと<ruby>聞<rt>き</rt></ruby>きました。<ruby>楽<rt>たの</rt></ruby>しみです。レジに<ruby>持<rt>も</rt></ruby>って<ruby>行<rt>い</rt></ruby>きます。',
        translation: 'I chose green tea. It is 150 yen in a plastic bottle. I heard that Japanese green tea is delicious. I am looking forward to it. I will take it to the register.',
      },
      {
        chapter_id: 'ch-3-3c',
        story_id: story3.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-3-2c',
        content: 'ポテトチップスを選びました。コンソメ味です。100円です。安くて嬉しいです。レジに持って行きます。',
        content_with_ruby: 'ポテトチップスを<ruby>選<rt>えら</rt></ruby>びました。コンソメ<ruby>味<rt>あじ</rt></ruby>です。100<ruby>円<rt>えん</rt></ruby>です。<ruby>安<rt>やす</rt></ruby>くて<ruby>嬉<rt>うれ</rt></ruby>しいです。レジに<ruby>持<rt>も</rt></ruby>って<ruby>行<rt>い</rt></ruby>きます。',
        translation: 'I chose potato chips. It is consomme flavor. It is 100 yen. I am happy that it is cheap. I will take it to the register.',
      },
      {
        chapter_id: 'ch-3-4',
        story_id: story3.story_id,
        chapter_number: 4,
        depth_level: 3,
        parent_chapter_id: 'ch-3-3a',
        content: 'レジに来ました。店員さんが「いらっしゃいませ」と言いました。お金を払います。店員さんが「お箸はお付けしますか？」と聞きました。日本語で答えます。「はい、お願いします」と言いました。',
        content_with_ruby: 'レジに<ruby>来<rt>き</rt></ruby>ました。<ruby>店員<rt>てんいん</rt></ruby>さんが「いらっしゃいませ」と<ruby>言<rt>い</rt></ruby>いました。お<ruby>金<rt>かね</rt></ruby>を<ruby>払<rt>はら</rt></ruby>います。<ruby>店員<rt>てんいん</rt></ruby>さんが「お<ruby>箸<rt>はし</rt></ruby>はお<ruby>付<rt>つ</rt></ruby>けしますか？」と<ruby>聞<rt>き</rt></ruby>きました。<ruby>日本語<rt>にほんご</rt></ruby>で<ruby>答<rt>こた</rt></ruby>えます。「はい、お<ruby>願<rt>ねが</rt></ruby>いします」と<ruby>言<rt>い</rt></ruby>いました。',
        translation: 'I came to the register. The staff said "Welcome." I pay the money. The staff asked "Would you like chopsticks?" I answer in Japanese. I said "Yes, please."',
      },
      {
        chapter_id: 'ch-3-5',
        story_id: story3.story_id,
        chapter_number: 5,
        depth_level: 4,
        parent_chapter_id: 'ch-3-4',
        content: '家に帰りました。買った物を食べます。とても美味しいです。コンビニはとても便利です。24時間開いています。また来たいです。',
        content_with_ruby: '<ruby>家<rt>いえ</rt></ruby>に<ruby>帰<rt>かえ</rt></ruby>りました。<ruby>買<rt>か</rt></ruby>った<ruby>物<rt>もの</rt></ruby>を<ruby>食<rt>た</rt></ruby>べます。とても<ruby>美味<rt>おい</rt></ruby>しいです。コンビニはとても<ruby>便利<rt>べんり</rt></ruby>です。24<ruby>時間<rt>じかん</rt></ruby><ruby>開<rt>あ</rt></ruby>いています。また<ruby>来<rt>き</rt></ruby>たいです。',
        translation: 'I went home. I eat what I bought. It is very delicious. Convenience stores are very convenient. They are open 24 hours. I want to come again.',
      },
    ],
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-3-2a-to-3a', chapter_id: 'ch-3-2a', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-3-3a', display_order: 1 },
      { choice_id: 'choice-3-2b-to-3b', chapter_id: 'ch-3-2b', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-3-3b', display_order: 1 },
      { choice_id: 'choice-3-2c-to-3c', chapter_id: 'ch-3-2c', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-3-3c', display_order: 1 },
      { choice_id: 'choice-3-3a-to-4', chapter_id: 'ch-3-3a', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-3-4', display_order: 1 },
      { choice_id: 'choice-3-3b-to-4', chapter_id: 'ch-3-3b', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-3-4', display_order: 1 },
      { choice_id: 'choice-3-3c-to-4', chapter_id: 'ch-3-3c', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-3-4', display_order: 1 },
      { choice_id: 'choice-3-4-to-5', chapter_id: 'ch-3-4', choice_text: '次へ進む', choice_description: 'ストーリーを完結させます。', next_chapter_id: 'ch-3-5', display_order: 1 },
    ],
  });

  console.log('Created Story 3 (初めてのコンビニ) with 5 chapters and branching structure');

  // ============================================================
  // Story 4: 駅での待ち合わせ (N4/A2) - 5 Chapters with Branching
  // ============================================================
  const story4 = await prisma.story.create({
    data: {
      story_id: '4',
      title: '駅での待ち合わせ',
      description: '新宿駅で友達と待ち合わせ。日本の大きな駅での体験を学びます。',
      level_jlpt: 'N4',
      level_cefr: 'A2',
      estimated_time: 8,
      root_chapter_id: 'ch-4-1',
    },
  });

  const chapter4_1 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-4-1',
      story_id: story4.story_id,
      chapter_number: 1,
      depth_level: 0,
      content: '今日は友達と新宿駅で待ち合わせです。新宿駅はとても大きくて、たくさんの人がいます。東口、西口、南口、いろいろな出口があります。友達は「改札の近くで待っている」と言いました。どこで待ちますか？',
      content_with_ruby: '<ruby>今日<rt>きょう</rt></ruby>は<ruby>友達<rt>ともだち</rt></ruby>と<ruby>新宿駅<rt>しんじゅくえき</rt></ruby>で<ruby>待<rt>ま</rt></ruby>ち<ruby>合<rt>あ</rt></ruby>わせです。<ruby>新宿駅<rt>しんじゅくえき</rt></ruby>はとても<ruby>大<rt>おお</rt></ruby>きくて、たくさんの<ruby>人<rt>ひと</rt></ruby>がいます。<ruby>東口<rt>ひがしぐち</rt></ruby>、<ruby>西口<rt>にしぐち</rt></ruby>、<ruby>南口<rt>みなみぐち</rt></ruby>、いろいろな<ruby>出口<rt>でぐち</rt></ruby>があります。<ruby>友達<rt>ともだち</rt></ruby>は「<ruby>改札<rt>かいさつ</rt></ruby>の<ruby>近<rt>ちか</rt></ruby>くで<ruby>待<rt>ま</rt></ruby>っている」と<ruby>言<rt>い</rt></ruby>いました。どこで<ruby>待<rt>ま</rt></ruby>ちますか？',
      translation: 'Today I have a meeting with a friend at Shinjuku Station. Shinjuku Station is very big and there are many people. East exit, west exit, south exit, there are various exits. My friend said "I will wait near the ticket gate." Where will you wait?',
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-4-1-a',
        chapter_id: chapter4_1.chapter_id,
        choice_text: '東口で待つ',
        choice_description: '東口の改札で待ちます。一番有名な出口です。',
        next_chapter_id: 'ch-4-2a',
        display_order: 1,
      },
      {
        choice_id: 'choice-4-1-b',
        chapter_id: chapter4_1.chapter_id,
        choice_text: '西口で待つ',
        choice_description: '西口の改札で待ちます。比較的空いています。',
        next_chapter_id: 'ch-4-2b',
        display_order: 2,
      },
      {
        choice_id: 'choice-4-1-c',
        chapter_id: chapter4_1.chapter_id,
        choice_text: '中央改札で待つ',
        choice_description: '中央の改札で待ちます。わかりやすい場所です。',
        next_chapter_id: 'ch-4-2c',
        display_order: 3,
      },
    ],
  });

  await prisma.chapter.createMany({
    data: [
      {
        chapter_id: 'ch-4-2a',
        story_id: story4.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter4_1.chapter_id,
        content: '東口に来ました。人がとても多いです。みんな急いでいます。スマホを見ながら歩いている人もいます。15分待ちましたが、友達が来ません。どうしますか？',
        content_with_ruby: '<ruby>東口<rt>ひがしぐち</rt></ruby>に<ruby>来<rt>き</rt></ruby>ました。<ruby>人<rt>ひと</rt></ruby>がとても<ruby>多<rt>おお</rt></ruby>いです。みんな<ruby>急<rt>いそ</rt></ruby>いでいます。スマホを<ruby>見<rt>み</rt></ruby>ながら<ruby>歩<rt>ある</rt></ruby>いている<ruby>人<rt>ひと</rt></ruby>もいます。15<ruby>分<rt>ぷん</rt></ruby><ruby>待<rt>ま</rt></ruby>ちましたが、<ruby>友達<rt>ともだち</rt></ruby>が<ruby>来<rt>き</rt></ruby>ません。どうしますか？',
        translation: 'I came to the east exit. There are so many people. Everyone is in a hurry. Some people are walking while looking at their smartphones. I waited for 15 minutes, but my friend did not come. What will you do?',
      },
      {
        chapter_id: 'ch-4-2b',
        story_id: story4.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter4_1.chapter_id,
        content: '西口に来ました。東口より人が少ないです。待ちやすい場所です。10分くらい待っていると、友達が来ました。でも、友達は少し疲れた顔をしています。',
        content_with_ruby: '<ruby>西口<rt>にしぐち</rt></ruby>に<ruby>来<rt>き</rt></ruby>ました。<ruby>東口<rt>ひがしぐち</rt></ruby>より<ruby>人<rt>ひと</rt></ruby>が<ruby>少<rt>すく</rt></ruby>ないです。<ruby>待<rt>ま</rt></ruby>ちやすい<ruby>場所<rt>ばしょ</rt></ruby>です。10<ruby>分<rt>ぷん</rt></ruby>くらい<ruby>待<rt>ま</rt></ruby>っていると、<ruby>友達<rt>ともだち</rt></ruby>が<ruby>来<rt>き</rt></ruby>ました。でも、<ruby>友達<rt>ともだち</rt></ruby>は<ruby>少<rt>すこ</rt></ruby>し<ruby>疲<rt>つか</rt></ruby>れた<ruby>顔<rt>かお</rt></ruby>をしています。',
        translation: 'I came to the west exit. There are fewer people than the east exit. It is an easy place to wait. After waiting for about 10 minutes, my friend came. But my friend looks a little tired.',
      },
      {
        chapter_id: 'ch-4-2c',
        story_id: story4.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter4_1.chapter_id,
        content: '中央改札に来ました。ここはとてもわかりやすい場所です。待ち合わせをしている人がたくさんいます。時計を見ます。約束の時間を5分過ぎました。',
        content_with_ruby: '<ruby>中央<rt>ちゅうおう</rt></ruby><ruby>改札<rt>かいさつ</rt></ruby>に<ruby>来<rt>き</rt></ruby>ました。ここはとてもわかりやすい<ruby>場所<rt>ばしょ</rt></ruby>です。<ruby>待<rt>ま</rt></ruby>ち<ruby>合<rt>あ</rt></ruby>わせをしている<ruby>人<rt>ひと</rt></ruby>がたくさんいます。<ruby>時計<rt>とけい</rt></ruby>を<ruby>見<rt>み</rt></ruby>ます。<ruby>約束<rt>やくそく</rt></ruby>の<ruby>時間<rt>じかん</rt></ruby>を5<ruby>分<rt>ぷん</rt></ruby><ruby>過<rt>す</rt></ruby>ぎました。',
        translation: 'I came to the central ticket gate. This is a very easy-to-understand place. There are many people meeting up. I look at the clock. It is 5 minutes past the promised time.',
      },
      {
        chapter_id: 'ch-4-3a',
        story_id: story4.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-4-2a',
        content: 'スマホで友達に電話をしました。友達が「ごめん！電車が遅れてしまった。今、駅に着いたよ。どこにいる？」と言いました。「東口にいるよ」と答えました。5分後、友達が来ました。',
        content_with_ruby: 'スマホで<ruby>友達<rt>ともだち</rt></ruby>に<ruby>電話<rt>でんわ</rt></ruby>をしました。<ruby>友達<rt>ともだち</rt></ruby>が「ごめん！<ruby>電車<rt>でんしゃ</rt></ruby>が<ruby>遅<rt>おく</rt></ruby>れてしまった。<ruby>今<rt>いま</rt></ruby>、<ruby>駅<rt>えき</rt></ruby>に<ruby>着<rt>つ</rt></ruby>いたよ。どこにいる？」と<ruby>言<rt>い</rt></ruby>いました。「<ruby>東口<rt>ひがしぐち</rt></ruby>にいるよ」と<ruby>答<rt>こた</rt></ruby>えました。5<ruby>分後<rt>ふんご</rt></ruby>、<ruby>友達<rt>ともだち</rt></ruby>が<ruby>来<rt>き</rt></ruby>ました。',
        translation: 'I called my friend on my smartphone. My friend said "Sorry! The train was delayed. I just arrived at the station. Where are you?" I answered "I am at the east exit." After 5 minutes, my friend came.',
      },
      {
        chapter_id: 'ch-4-3b',
        story_id: story4.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-4-2b',
        content: '友達が「ごめんね、ちょっと遅れちゃった。電車が混んでいて大変だった」と言いました。「大丈夫だよ。無事に会えてよかった」と答えました。友達は笑顔になりました。',
        content_with_ruby: '<ruby>友達<rt>ともだち</rt></ruby>が「ごめんね、ちょっと<ruby>遅<rt>おく</rt></ruby>れちゃった。<ruby>電車<rt>でんしゃ</rt></ruby>が<ruby>混<rt>こ</rt></ruby>んでいて<ruby>大変<rt>たいへん</rt></ruby>だった」と<ruby>言<rt>い</rt></ruby>いました。「<ruby>大丈夫<rt>だいじょうぶ</rt></ruby>だよ。<ruby>無事<rt>ぶじ</rt></ruby>に<ruby>会<rt>あ</rt></ruby>えてよかった」と<ruby>答<rt>こた</rt></ruby>えました。<ruby>友達<rt>ともだち</rt></ruby>は<ruby>笑顔<rt>えがお</rt></ruby>になりました。',
        translation: 'My friend said "Sorry, I was a little late. The train was crowded and it was tough." I answered "It\'s okay. I\'m glad we could meet safely." My friend smiled.',
      },
      {
        chapter_id: 'ch-4-3c',
        story_id: story4.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-4-2c',
        content: 'メッセージが来ました。「ごめん！道に迷っちゃった。今どこにいるの？」と書いてありました。「中央改札だよ。ここで待ってる」と返信しました。すぐに友達が来ました。',
        content_with_ruby: 'メッセージが<ruby>来<rt>き</rt></ruby>ました。「ごめん！<ruby>道<rt>みち</rt></ruby>に<ruby>迷<rt>まよ</rt></ruby>っちゃった。<ruby>今<rt>いま</rt></ruby>どこにいるの？」と<ruby>書<rt>か</rt></ruby>いてありました。「<ruby>中央<rt>ちゅうおう</rt></ruby><ruby>改札<rt>かいさつ</rt></ruby>だよ。ここで<ruby>待<rt>ま</rt></ruby>ってる」と<ruby>返信<rt>へんしん</rt></ruby>しました。すぐに<ruby>友達<rt>ともだち</rt></ruby>が<ruby>来<rt>き</rt></ruby>ました。',
        translation: 'A message came. It said "Sorry! I got lost. Where are you now?" I replied "I am at the central ticket gate. I am waiting here." My friend came immediately.',
      },
      {
        chapter_id: 'ch-4-4',
        story_id: story4.story_id,
        chapter_number: 4,
        depth_level: 3,
        parent_chapter_id: 'ch-4-3a',
        content: '友達と一緒に、どこに行くか相談しました。「映画を見に行こうか？」「それとも、買い物する？」いろいろな選択肢があります。最後に「カフェでゆっくり話そう」と決めました。',
        content_with_ruby: '<ruby>友達<rt>ともだち</rt></ruby>と<ruby>一緒<rt>いっしょ</rt></ruby>に、どこに<ruby>行<rt>い</rt></ruby>くか<ruby>相談<rt>そうだん</rt></ruby>しました。「<ruby>映画<rt>えいが</rt></ruby>を<ruby>見<rt>み</rt></ruby>に<ruby>行<rt>い</rt></ruby>こうか？」「それとも、<ruby>買<rt>か</rt></ruby>い<ruby>物<rt>もの</rt></ruby>する？」いろいろな<ruby>選択肢<rt>せんたくし</rt></ruby>があります。<ruby>最後<rt>さいご</rt></ruby>に「カフェでゆっくり<ruby>話<rt>はな</rt></ruby>そう」と<ruby>決<rt>き</rt></ruby>めました。',
        translation: 'Together with my friend, we discussed where to go. "Shall we go see a movie?" "Or shall we go shopping?" There are various options. Finally we decided "Let\'s talk slowly at a cafe."',
      },
      {
        chapter_id: 'ch-4-5',
        story_id: story4.story_id,
        chapter_number: 5,
        depth_level: 4,
        parent_chapter_id: 'ch-4-4',
        content: '電車に乗って、一緒に出かけました。新宿駅は大きくて複雑ですが、なんとか会えました。日本の駅での待ち合わせは難しいですが、スマホがあれば大丈夫です。とても楽しい一日になりました。',
        content_with_ruby: '<ruby>電車<rt>でんしゃ</rt></ruby>に<ruby>乗<rt>の</rt></ruby>って、<ruby>一緒<rt>いっしょ</rt></ruby>に<ruby>出<rt>で</rt></ruby>かけました。<ruby>新宿駅<rt>しんじゅくえき</rt></ruby>は<ruby>大<rt>おお</rt></ruby>きくて<ruby>複雑<rt>ふくざつ</rt></ruby>ですが、なんとか<ruby>会<rt>あ</rt></ruby>えました。<ruby>日本<rt>にほん</rt></ruby>の<ruby>駅<rt>えき</rt></ruby>での<ruby>待<rt>ま</rt></ruby>ち<ruby>合<rt>あ</rt></ruby>わせは<ruby>難<rt>むずか</rt></ruby>しいですが、スマホがあれば<ruby>大丈夫<rt>だいじょうぶ</rt></ruby>です。とても<ruby>楽<rt>たの</rt></ruby>しい<ruby>一日<rt>いちにち</rt></ruby>になりました。',
        translation: 'We took the train and went out together. Shinjuku Station is large and complicated, but we managed to meet. Meeting at a Japanese station is difficult, but if you have a smartphone it is okay. It became a very fun day.',
      },
    ],
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-4-2a-to-3a', chapter_id: 'ch-4-2a', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-4-3a', display_order: 1 },
      { choice_id: 'choice-4-2b-to-3b', chapter_id: 'ch-4-2b', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-4-3b', display_order: 1 },
      { choice_id: 'choice-4-2c-to-3c', chapter_id: 'ch-4-2c', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-4-3c', display_order: 1 },
      { choice_id: 'choice-4-3a-to-4', chapter_id: 'ch-4-3a', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-4-4', display_order: 1 },
      { choice_id: 'choice-4-3b-to-4', chapter_id: 'ch-4-3b', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-4-4', display_order: 1 },
      { choice_id: 'choice-4-3c-to-4', chapter_id: 'ch-4-3c', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-4-4', display_order: 1 },
      { choice_id: 'choice-4-4-to-5', chapter_id: 'ch-4-4', choice_text: '次へ進む', choice_description: 'ストーリーを完結させます。', next_chapter_id: 'ch-4-5', display_order: 1 },
    ],
  });

  console.log('Created Story 4 (駅での待ち合わせ) with 5 chapters and branching structure');

  // ============================================================
  // Story 5: 居酒屋での夜 (N3/B1) - 5 Chapters with Branching
  // ============================================================
  const story5 = await prisma.story.create({
    data: {
      story_id: '5',
      title: '居酒屋での夜',
      description: '会社の同僚と居酒屋へ。日本の飲み会文化を体験します。',
      level_jlpt: 'N3',
      level_cefr: 'B1',
      estimated_time: 10,
      root_chapter_id: 'ch-5-1',
    },
  });

  const chapter5_1 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-5-1',
      story_id: story5.story_id,
      chapter_number: 1,
      depth_level: 0,
      content: '仕事が終わった後、同僚の田中さんが「今日、居酒屋に行きませんか？」と誘ってくれました。日本の居酒屋に行くのは初めてです。少し緊張しますが、とても楽しみです。居酒屋に着きました。まず何を注文しますか？',
      content_with_ruby: '<ruby>仕事<rt>しごと</rt></ruby>が<ruby>終<rt>お</rt></ruby>わった<ruby>後<rt>あと</rt></ruby>、<ruby>同僚<rt>どうりょう</rt></ruby>の<ruby>田中<rt>たなか</rt></ruby>さんが「<ruby>今日<rt>きょう</rt></ruby>、<ruby>居酒屋<rt>いざかや</rt></ruby>に<ruby>行<rt>い</rt></ruby>きませんか？」と<ruby>誘<rt>さそ</rt></ruby>ってくれました。<ruby>日本<rt>にほん</rt></ruby>の<ruby>居酒屋<rt>いざかや</rt></ruby>に<ruby>行<rt>い</rt></ruby>くのは<ruby>初<rt>はじ</rt></ruby>めてです。<ruby>少<rt>すこ</rt></ruby>し<ruby>緊張<rt>きんちょう</rt></ruby>しますが、とても<ruby>楽<rt>たの</rt></ruby>しみです。<ruby>居酒屋<rt>いざかや</rt></ruby>に<ruby>着<rt>つ</rt></ruby>きました。まず<ruby>何<rt>なに</rt></ruby>を<ruby>注文<rt>ちゅうもん</rt></ruby>しますか？',
      translation: 'After work, my colleague Tanaka invited me saying "Would you like to go to an izakaya today?" It is my first time going to a Japanese izakaya. I am a little nervous, but very excited. We arrived at the izakaya. What will you order first?',
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-5-1-a',
        chapter_id: chapter5_1.chapter_id,
        choice_text: 'ビールを注文する',
        choice_description: 'みんなと同じように、まずビールを注文します。',
        next_chapter_id: 'ch-5-2a',
        display_order: 1,
      },
      {
        choice_id: 'choice-5-1-b',
        chapter_id: chapter5_1.chapter_id,
        choice_text: 'ウーロン茶を注文する',
        choice_description: 'お酒は苦手なので、ウーロン茶を注文します。',
        next_chapter_id: 'ch-5-2b',
        display_order: 2,
      },
      {
        choice_id: 'choice-5-1-c',
        chapter_id: chapter5_1.chapter_id,
        choice_text: '日本酒を注文する',
        choice_description: '日本の居酒屋なので、日本酒を試してみたいです。',
        next_chapter_id: 'ch-5-2c',
        display_order: 3,
      },
    ],
  });

  await prisma.chapter.createMany({
    data: [
      {
        chapter_id: 'ch-5-2a',
        story_id: story5.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter5_1.chapter_id,
        content: 'ビールが来ました。田中さんが「じゃあ、乾杯しましょう！」と言いました。みんなで「乾杯！」と言ってグラスを合わせました。ビールは冷たくて美味しいです。次に料理を注文します。何を食べますか？',
        content_with_ruby: 'ビールが<ruby>来<rt>き</rt></ruby>ました。<ruby>田中<rt>たなか</rt></ruby>さんが「じゃあ、<ruby>乾杯<rt>かんぱい</rt></ruby>しましょう！」と<ruby>言<rt>い</rt></ruby>いました。みんなで「<ruby>乾杯<rt>かんぱい</rt></ruby>！」と<ruby>言<rt>い</rt></ruby>ってグラスを<ruby>合<rt>あ</rt></ruby>わせました。ビールは<ruby>冷<rt>つめ</rt></ruby>たくて<ruby>美味<rt>おい</rt></ruby>しいです。<ruby>次<rt>つぎ</rt></ruby>に<ruby>料理<rt>りょうり</rt></ruby>を<ruby>注文<rt>ちゅうもん</rt></ruby>します。<ruby>何<rt>なに</rt></ruby>を<ruby>食<rt>た</rt></ruby>べますか？',
        translation: 'The beer came. Tanaka said "Well, let\'s toast!" Everyone said "Cheers!" and clinked glasses. The beer is cold and delicious. Next we will order food. What will you eat?',
      },
      {
        chapter_id: 'ch-5-2b',
        story_id: story5.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter5_1.chapter_id,
        content: 'ウーロン茶が来ました。田中さんが「お酒が飲めないんですか？」と聞きました。「はい、少し苦手で」と答えました。田中さんは「全然大丈夫ですよ！無理に飲む必要はありません」と優しく言ってくれました。料理を注文します。',
        content_with_ruby: 'ウーロン<ruby>茶<rt>ちゃ</rt></ruby>が<ruby>来<rt>き</rt></ruby>ました。<ruby>田中<rt>たなか</rt></ruby>さんが「お<ruby>酒<rt>さけ</rt></ruby>が<ruby>飲<rt>の</rt></ruby>めないんですか？」と<ruby>聞<rt>き</rt></ruby>きました。「はい、<ruby>少<rt>すこ</rt></ruby>し<ruby>苦手<rt>にがて</rt></ruby>で」と<ruby>答<rt>こた</rt></ruby>えました。<ruby>田中<rt>たなか</rt></ruby>さんは「<ruby>全然<rt>ぜんぜん</rt></ruby><ruby>大丈夫<rt>だいじょうぶ</rt></ruby>ですよ！<ruby>無理<rt>むり</rt></ruby>に<ruby>飲<rt>の</rt></ruby>む<ruby>必要<rt>ひつよう</rt></ruby>はありません」と<ruby>優<rt>やさ</rt></ruby>しく<ruby>言<rt>い</rt></ruby>ってくれました。<ruby>料理<rt>りょうり</rt></ruby>を<ruby>注文<rt>ちゅうもん</rt></ruby>します。',
        translation: 'The oolong tea came. Tanaka asked "Can\'t you drink alcohol?" I answered "Yes, I am a little bad at it." Tanaka kindly said "It is totally fine! You do not need to force yourself to drink." We order food.',
      },
      {
        chapter_id: 'ch-5-2c',
        story_id: story5.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter5_1.chapter_id,
        content: '日本酒が来ました。小さな器に入っています。田中さんが「おお！日本酒を飲むんですね。どうぞ、ゆっくり味わってください」と言いました。少し飲んでみると、思ったより飲みやすいです。さて、料理を注文しましょう。',
        content_with_ruby: '<ruby>日本酒<rt>にほんしゅ</rt></ruby>が<ruby>来<rt>き</rt></ruby>ました。<ruby>小<rt>ちい</rt></ruby>さな<ruby>器<rt>うつわ</rt></ruby>に<ruby>入<rt>はい</rt></ruby>っています。<ruby>田中<rt>たなか</rt></ruby>さんが「おお！<ruby>日本酒<rt>にほんしゅ</rt></ruby>を<ruby>飲<rt>の</rt></ruby>むんですね。どうぞ、ゆっくり<ruby>味<rt>あじ</rt></ruby>わってください」と<ruby>言<rt>い</rt></ruby>いました。<ruby>少<rt>すこ</rt></ruby>し<ruby>飲<rt>の</rt></ruby>んでみると、<ruby>思<rt>おも</rt></ruby>ったより<ruby>飲<rt>の</rt></ruby>みやすいです。さて、<ruby>料理<rt>りょうり</rt></ruby>を<ruby>注文<rt>ちゅうもん</rt></ruby>しましょう。',
        translation: 'The sake came. It is in a small vessel. Tanaka said "Oh! You drink sake. Please, slowly savor it." When I try drinking a little, it is easier to drink than I thought. Now, let\'s order food.',
      },
      {
        chapter_id: 'ch-5-3a',
        story_id: story5.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-5-2a',
        content: '焼き鳥を注文しました。タレと塩、両方あります。熱々の焼き鳥が来ました。一口食べると、とても美味しいです。ビールによく合います。同僚たちとの会話も弾みます。',
        content_with_ruby: '<ruby>焼<rt>や</rt></ruby>き<ruby>鳥<rt>とり</rt></ruby>を<ruby>注文<rt>ちゅうもん</rt></ruby>しました。タレと<ruby>塩<rt>しお</rt></ruby>、<ruby>両方<rt>りょうほう</rt></ruby>あります。<ruby>熱々<rt>あつあつ</rt></ruby>の<ruby>焼<rt>や</rt></ruby>き<ruby>鳥<rt>とり</rt></ruby>が<ruby>来<rt>き</rt></ruby>ました。<ruby>一口<rt>ひとくち</rt></ruby><ruby>食<rt>た</rt></ruby>べると、とても<ruby>美味<rt>おい</rt></ruby>しいです。ビールによく<ruby>合<rt>あ</rt></ruby>います。<ruby>同僚<rt>どうりょう</rt></ruby>たちとの<ruby>会話<rt>かいわ</rt></ruby>も<ruby>弾<rt>はず</rt></ruby>みます。',
        translation: 'I ordered yakitori. There is both sauce and salt. The piping hot yakitori came. When I eat one bite, it is very delicious. It goes well with beer. The conversation with colleagues also becomes lively.',
      },
      {
        chapter_id: 'ch-5-3b',
        story_id: story5.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-5-2b',
        content: '枝豆と冷奴を注文しました。健康的な料理です。枝豆は塩味で美味しいです。冷奴には醤油とネギがかかっています。さっぱりしていて、とても良いです。',
        content_with_ruby: '<ruby>枝豆<rt>えだまめ</rt></ruby>と<ruby>冷奴<rt>ひややっこ</rt></ruby>を<ruby>注文<rt>ちゅうもん</rt></ruby>しました。<ruby>健康的<rt>けんこうてき</rt></ruby>な<ruby>料理<rt>りょうり</rt></ruby>です。<ruby>枝豆<rt>えだまめ</rt></ruby>は<ruby>塩味<rt>しおあじ</rt></ruby>で<ruby>美味<rt>おい</rt></ruby>しいです。<ruby>冷奴<rt>ひややっこ</rt></ruby>には<ruby>醤油<rt>しょうゆ</rt></ruby>とネギがかかっています。さっぱりしていて、とても<ruby>良<rt>よ</rt></ruby>いです。',
        translation: 'I ordered edamame and cold tofu. They are healthy dishes. The edamame has a salty taste and is delicious. The cold tofu has soy sauce and green onion on it. It is refreshing and very good.',
      },
      {
        chapter_id: 'ch-5-3c',
        story_id: story5.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-5-2c',
        content: '刺身の盛り合わせを注文しました。マグロ、サーモン、イカ、いろいろな種類があります。新鮮で美味しいです。日本酒と刺身の組み合わせは最高です。これが日本の居酒屋の醍醐味ですね。',
        content_with_ruby: '<ruby>刺身<rt>さしみ</rt></ruby>の<ruby>盛<rt>も</rt></ruby>り<ruby>合<rt>あ</rt></ruby>わせを<ruby>注文<rt>ちゅうもん</rt></ruby>しました。マグロ、サーモン、イカ、いろいろな<ruby>種類<rt>しゅるい</rt></ruby>があります。<ruby>新鮮<rt>しんせん</rt></ruby>で<ruby>美味<rt>おい</rt></ruby>しいです。<ruby>日本酒<rt>にほんしゅ</rt></ruby>と<ruby>刺身<rt>さしみ</rt></ruby>の<ruby>組<rt>く</rt></ruby>み<ruby>合<rt>あ</rt></ruby>わせは<ruby>最高<rt>さいこう</rt></ruby>です。これが<ruby>日本<rt>にほん</rt></ruby>の<ruby>居酒屋<rt>いざかや</rt></ruby>の<ruby>醍醐味<rt>だいごみ</rt></ruby>ですね。',
        translation: 'I ordered an assorted sashimi platter. There are various types including tuna, salmon, and squid. It is fresh and delicious. The combination of sake and sashimi is the best. This is the real pleasure of a Japanese izakaya.',
      },
      {
        chapter_id: 'ch-5-4',
        story_id: story5.story_id,
        chapter_number: 4,
        depth_level: 3,
        parent_chapter_id: 'ch-5-3a',
        content: '楽しく食べていると、田中さんが「この店は飲み放題もあるんですよ」と教えてくれました。飲み放題は2時間で2500円だそうです。日本の飲み会文化について、いろいろ教えてもらいました。',
        content_with_ruby: '<ruby>楽<rt>たの</rt></ruby>しく<ruby>食<rt>た</rt></ruby>べていると、<ruby>田中<rt>たなか</rt></ruby>さんが「この<ruby>店<rt>みせ</rt></ruby>は<ruby>飲<rt>の</rt></ruby>み<ruby>放題<rt>ほうだい</rt></ruby>もあるんですよ」と<ruby>教<rt>おし</rt></ruby>えてくれました。<ruby>飲<rt>の</rt></ruby>み<ruby>放題<rt>ほうだい</rt></ruby>は2<ruby>時間<rt>じかん</rt></ruby>で2500<ruby>円<rt>えん</rt></ruby>だそうです。<ruby>日本<rt>にほん</rt></ruby>の<ruby>飲<rt>の</rt></ruby>み<ruby>会<rt>かい</rt></ruby><ruby>文化<rt>ぶんか</rt></ruby>について、いろいろ<ruby>教<rt>おし</rt></ruby>えてもらいました。',
        translation: 'While enjoying eating, Tanaka told me "This restaurant also has all-you-can-drink." The all-you-can-drink is 2500 yen for 2 hours. I learned various things about Japanese drinking party culture.',
      },
      {
        chapter_id: 'ch-5-5',
        story_id: story5.story_id,
        chapter_number: 5,
        depth_level: 4,
        parent_chapter_id: 'ch-5-4',
        content: '最後に会計をしました。一人3000円くらいでした。みんなで割り勘にしました。居酒屋はとても楽しかったです。同僚たちともっと仲良くなれました。これからも一緒に来たいです。',
        content_with_ruby: '<ruby>最後<rt>さいご</rt></ruby>に<ruby>会計<rt>かいけい</rt></ruby>をしました。<ruby>一人<rt>ひとり</rt></ruby>3000<ruby>円<rt>えん</rt></ruby>くらいでした。みんなで<ruby>割<rt>わ</rt></ruby>り<ruby>勘<rt>かん</rt></ruby>にしました。<ruby>居酒屋<rt>いざかや</rt></ruby>はとても<ruby>楽<rt>たの</rt></ruby>しかったです。<ruby>同僚<rt>どうりょう</rt></ruby>たちともっと<ruby>仲良<rt>なかよ</rt></ruby>くなれました。これからも<ruby>一緒<rt>いっしょ</rt></ruby>に<ruby>来<rt>き</rt></ruby>たいです。',
        translation: 'At the end we paid the bill. It was about 3000 yen per person. We split the bill. The izakaya was very fun. I became closer with my colleagues. I want to come together again.',
      },
    ],
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-5-2a-to-3a', chapter_id: 'ch-5-2a', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-5-3a', display_order: 1 },
      { choice_id: 'choice-5-2b-to-3b', chapter_id: 'ch-5-2b', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-5-3b', display_order: 1 },
      { choice_id: 'choice-5-2c-to-3c', chapter_id: 'ch-5-2c', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-5-3c', display_order: 1 },
      { choice_id: 'choice-5-3a-to-4', chapter_id: 'ch-5-3a', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-5-4', display_order: 1 },
      { choice_id: 'choice-5-3b-to-4', chapter_id: 'ch-5-3b', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-5-4', display_order: 1 },
      { choice_id: 'choice-5-3c-to-4', chapter_id: 'ch-5-3c', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-5-4', display_order: 1 },
      { choice_id: 'choice-5-4-to-5', chapter_id: 'ch-5-4', choice_text: '次へ進む', choice_description: 'ストーリーを完結させます。', next_chapter_id: 'ch-5-5', display_order: 1 },
    ],
  });

  console.log('Created Story 5 (居酒屋での夜) with 5 chapters and branching structure');

  // ============================================================
  // Story 6: 温泉旅行 (N2/B2) - 5 Chapters with Branching
  // ============================================================
  const story6 = await prisma.story.create({
    data: {
      story_id: '6',
      title: '温泉旅行',
      description: '週末の温泉旅行。日本の伝統的な旅館文化と温泉マナーを学びます。',
      level_jlpt: 'N2',
      level_cefr: 'B2',
      estimated_time: 12,
      root_chapter_id: 'ch-6-1',
    },
  });

  const chapter6_1 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-6-1',
      story_id: story6.story_id,
      chapter_number: 1,
      depth_level: 0,
      content: '週末、箱根の温泉旅館に来ました。伝統的な日本建築の美しい旅館です。玄関で靴を脱ぎ、仲居さんが部屋まで案内してくれました。部屋からは山の景色が見えます。これから何をしますか？',
      content_with_ruby: '<ruby>週末<rt>しゅうまつ</rt></ruby>、<ruby>箱根<rt>はこね</rt></ruby>の<ruby>温泉<rt>おんせん</rt></ruby><ruby>旅館<rt>りょかん</rt></ruby>に<ruby>来<rt>き</rt></ruby>ました。<ruby>伝統的<rt>でんとうてき</rt></ruby>な<ruby>日本<rt>にほん</rt></ruby><ruby>建築<rt>けんちく</rt></ruby>の<ruby>美<rt>うつく</rt></ruby>しい<ruby>旅館<rt>りょかん</rt></ruby>です。<ruby>玄関<rt>げんかん</rt></ruby>で<ruby>靴<rt>くつ</rt></ruby>を<ruby>脱<rt>ぬ</rt></ruby>ぎ、<ruby>仲居<rt>なかい</rt></ruby>さんが<ruby>部屋<rt>へや</rt></ruby>まで<ruby>案内<rt>あんない</rt></ruby>してくれました。<ruby>部屋<rt>へや</rt></ruby>からは<ruby>山<rt>やま</rt></ruby>の<ruby>景色<rt>けしき</rt></ruby>が<ruby>見<rt>み</rt></ruby>えます。これから<ruby>何<rt>なに</rt></ruby>をしますか？',
      translation: 'On the weekend, I came to a hot spring inn in Hakone. It is a beautiful inn with traditional Japanese architecture. I took off my shoes at the entrance, and the attendant guided me to my room. I can see the mountain scenery from the room. What will you do now?',
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-6-1-a',
        chapter_id: chapter6_1.chapter_id,
        choice_text: 'すぐに露天風呂に行く',
        choice_description: '到着したばかりですが、山の景色を見ながら温泉に入りたいです。',
        next_chapter_id: 'ch-6-2a',
        display_order: 1,
      },
      {
        choice_id: 'choice-6-1-b',
        chapter_id: chapter6_1.chapter_id,
        choice_text: '部屋でゆっくり休む',
        choice_description: '旅の疲れを癒すため、まず部屋でお茶を飲んで休憩します。',
        next_chapter_id: 'ch-6-2b',
        display_order: 2,
      },
      {
        choice_id: 'choice-6-1-c',
        chapter_id: chapter6_1.chapter_id,
        choice_text: '温泉街を散歩する',
        choice_description: '周辺の温泉街を散策して、雰囲気を楽しみたいです。',
        next_chapter_id: 'ch-6-2c',
        display_order: 3,
      },
    ],
  });

  await prisma.chapter.createMany({
    data: [
      {
        chapter_id: 'ch-6-2a',
        story_id: story6.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter6_1.chapter_id,
        content: '浴衣に着替えて、露天風呂に向かいました。脱衣所で服を脱ぎ、タオルを持って入浴します。露天風呂からは雄大な山々が一望できます。温かいお湯に浸かりながら、自然の美しさに感動しました。これこそが日本の温泉文化の魅力です。',
        content_with_ruby: '<ruby>浴衣<rt>ゆかた</rt></ruby>に<ruby>着替<rt>きが</rt></ruby>えて、<ruby>露天風呂<rt>ろてんぶろ</rt></ruby>に<ruby>向<rt>む</rt></ruby>かいました。<ruby>脱衣所<rt>だついじょ</rt></ruby>で<ruby>服<rt>ふく</rt></ruby>を<ruby>脱<rt>ぬ</rt></ruby>ぎ、タオルを<ruby>持<rt>も</rt></ruby>って<ruby>入浴<rt>にゅうよく</rt></ruby>します。<ruby>露天風呂<rt>ろてんぶろ</rt></ruby>からは<ruby>雄大<rt>ゆうだい</rt></ruby>な<ruby>山々<rt>やまやま</rt></ruby>が<ruby>一望<rt>いちぼう</rt></ruby>できます。<ruby>温<rt>あたた</rt></ruby>かいお<ruby>湯<rt>ゆ</rt></ruby>に<ruby>浸<rt>つ</rt></ruby>かりながら、<ruby>自然<rt>しぜん</rt></ruby>の<ruby>美<rt>うつく</rt></ruby>しさに<ruby>感動<rt>かんどう</rt></ruby>しました。これこそが<ruby>日本<rt>にほん</rt></ruby>の<ruby>温泉<rt>おんせん</rt></ruby><ruby>文化<rt>ぶんか</rt></ruby>の<ruby>魅力<rt>みりょく</rt></ruby>です。',
        translation: 'I changed into a yukata and headed to the outdoor bath. I took off my clothes in the changing room and entered with a towel. From the outdoor bath, I can see the magnificent mountains. While soaking in the warm water, I was moved by the beauty of nature. This is the charm of Japanese hot spring culture.',
      },
      {
        chapter_id: 'ch-6-2b',
        story_id: story6.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter6_1.chapter_id,
        content: '部屋には畳が敷いてあり、真ん中に低いテーブルがあります。お茶とお菓子が用意されていました。窓を開けると、涼しい山の風が入ってきます。浴衣に着替えて、のんびりとお茶を飲みました。都会の喧騒から離れた、静かで贅沢な時間です。',
        content_with_ruby: '<ruby>部屋<rt>へや</rt></ruby>には<ruby>畳<rt>たたみ</rt></ruby>が<ruby>敷<rt>し</rt></ruby>いてあり、<ruby>真<rt>ま</rt></ruby>ん<ruby>中<rt>なか</rt></ruby>に<ruby>低<rt>ひく</rt></ruby>いテーブルがあります。お<ruby>茶<rt>ちゃ</rt></ruby>とお<ruby>菓子<rt>かし</rt></ruby>が<ruby>用意<rt>ようい</rt></ruby>されていました。<ruby>窓<rt>まど</rt></ruby>を<ruby>開<rt>あ</rt></ruby>けると、<ruby>涼<rt>すず</rt></ruby>しい<ruby>山<rt>やま</rt></ruby>の<ruby>風<rt>かぜ</rt></ruby>が<ruby>入<rt>はい</rt></ruby>ってきます。<ruby>浴衣<rt>ゆかた</rt></ruby>に<ruby>着替<rt>きが</rt></ruby>えて、のんびりとお<ruby>茶<rt>ちゃ</rt></ruby>を<ruby>飲<rt>の</rt></ruby>みました。<ruby>都会<rt>とかい</rt></ruby>の<ruby>喧騒<rt>けんそう</rt></ruby>から<ruby>離<rt>はな</rt></ruby>れた、<ruby>静<rt>しず</rt></ruby>かで<ruby>贅沢<rt>ぜいたく</rt></ruby>な<ruby>時間<rt>じかん</rt></ruby>です。',
        translation: 'The room has tatami mats, with a low table in the middle. Tea and sweets were prepared. When I open the window, the cool mountain breeze comes in. I changed into a yukata and leisurely drank tea. It is a quiet and luxurious time away from the hustle and bustle of the city.',
      },
      {
        chapter_id: 'ch-6-2c',
        story_id: story6.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter6_1.chapter_id,
        content: '浴衣に着替えて、下駄を履いて外に出ました。温泉街には土産物屋や足湯があります。カランコロンという下駄の音が風情を感じさせます。足湯に座って温まりながら、地元のおばあさんと少し話をしました。「温泉はゆっくり入ってね」とアドバイスをもらいました。',
        content_with_ruby: '<ruby>浴衣<rt>ゆかた</rt></ruby>に<ruby>着替<rt>きが</rt></ruby>えて、<ruby>下駄<rt>げた</rt></ruby>を<ruby>履<rt>は</rt></ruby>いて<ruby>外<rt>そと</rt></ruby>に<ruby>出<rt>で</rt></ruby>ました。<ruby>温泉街<rt>おんせんがい</rt></ruby>には<ruby>土産物屋<rt>みやげものや</rt></ruby>や<ruby>足湯<rt>あしゆ</rt></ruby>があります。カランコロンという<ruby>下駄<rt>げた</rt></ruby>の<ruby>音<rt>おと</rt></ruby>が<ruby>風情<rt>ふぜい</rt></ruby>を<ruby>感<rt>かん</rt></ruby>じさせます。<ruby>足湯<rt>あしゆ</rt></ruby>に<ruby>座<rt>すわ</rt></ruby>って<ruby>温<rt>あたた</rt></ruby>まりながら、<ruby>地元<rt>じもと</rt></ruby>のおばあさんと<ruby>少<rt>すこ</rt></ruby>し<ruby>話<rt>はなし</rt></ruby>をしました。「<ruby>温泉<rt>おんせん</rt></ruby>はゆっくり<ruby>入<rt>はい</rt></ruby>ってね」とアドバイスをもらいました。',
        translation: 'I changed into a yukata, put on geta, and went outside. The hot spring town has souvenir shops and foot baths. The clacking sound of geta creates an atmosphere. While sitting and warming up in the foot bath, I talked a little with a local elderly woman. She gave me advice saying "Take your time in the hot spring."',
      },
      {
        chapter_id: 'ch-6-3a',
        story_id: story6.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-6-2a',
        content: '温泉から上がった後、湯上がり処で冷たいお茶を飲みました。体がぽかぽかして、とても気持ちがいいです。温泉の効能について書かれた掲示を読みました。この温泉は肩こりや疲労回復に効果があるそうです。',
        content_with_ruby: '<ruby>温泉<rt>おんせん</rt></ruby>から<ruby>上<rt>あ</rt></ruby>がった<ruby>後<rt>あと</rt></ruby>、<ruby>湯上<rt>ゆあ</rt></ruby>がり<ruby>処<rt>どころ</rt></ruby>で<ruby>冷<rt>つめ</rt></ruby>たいお<ruby>茶<rt>ちゃ</rt></ruby>を<ruby>飲<rt>の</rt></ruby>みました。<ruby>体<rt>からだ</rt></ruby>がぽかぽかして、とても<ruby>気持<rt>きも</rt></ruby>ちがいいです。<ruby>温泉<rt>おんせん</rt></ruby>の<ruby>効能<rt>こうのう</rt></ruby>について<ruby>書<rt>か</rt></ruby>かれた<ruby>掲示<rt>けいじ</rt></ruby>を<ruby>読<rt>よ</rt></ruby>みました。この<ruby>温泉<rt>おんせん</rt></ruby>は<ruby>肩<rt>かた</rt></ruby>こりや<ruby>疲労<rt>ひろう</rt></ruby><ruby>回復<rt>かいふく</rt></ruby>に<ruby>効果<rt>こうか</rt></ruby>があるそうです。',
        translation: 'After getting out of the hot spring, I drank cold tea at the after-bath lounge. My body is warm and feels very good. I read the notice written about the effects of the hot spring. This hot spring is said to be effective for stiff shoulders and fatigue recovery.',
      },
      {
        chapter_id: 'ch-6-3b',
        story_id: story6.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-6-2b',
        content: 'ゆっくり休んだ後、温泉に入ることにしました。内湯には檜風呂があり、木の香りがとても良いです。ゆっくりと湯船に浸かり、一日の疲れが溶けていくようです。温泉療養の文化が日本で大切にされている理由がわかりました。',
        content_with_ruby: 'ゆっくり<ruby>休<rt>やす</rt></ruby>んだ<ruby>後<rt>あと</rt></ruby>、<ruby>温泉<rt>おんせん</rt></ruby>に<ruby>入<rt>はい</rt></ruby>ることにしました。<ruby>内湯<rt>うちゆ</rt></ruby>には<ruby>檜風呂<rt>ひのきぶろ</rt></ruby>があり、<ruby>木<rt>き</rt></ruby>の<ruby>香<rt>かお</rt></ruby>りがとても<ruby>良<rt>よ</rt></ruby>いです。ゆっくりと<ruby>湯船<rt>ゆぶね</rt></ruby>に<ruby>浸<rt>つ</rt></ruby>かり、<ruby>一日<rt>いちにち</rt></ruby>の<ruby>疲<rt>つか</rt></ruby>れが<ruby>溶<rt>と</rt></ruby>けていくようです。<ruby>温泉<rt>おんせん</rt></ruby><ruby>療養<rt>りょうよう</rt></ruby>の<ruby>文化<rt>ぶんか</rt></ruby>が<ruby>日本<rt>にほん</rt></ruby>で<ruby>大切<rt>たいせつ</rt></ruby>にされている<ruby>理由<rt>りゆう</rt></ruby>がわかりました。',
        translation: 'After resting slowly, I decided to enter the hot spring. The indoor bath has a cypress bath, and the wooden scent is very good. Slowly soaking in the bathtub, it seems like the fatigue of the day is melting away. I understood why the culture of hot spring therapy is cherished in Japan.',
      },
      {
        chapter_id: 'ch-6-3c',
        story_id: story6.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-6-2c',
        content: '旅館に戻り、大浴場に入りました。広い浴槽には乳白色のお湯が満ちています。硫黄の香りが漂い、本格的な温泉を感じます。他の宿泊客と少し会話をしながら、リラックスした時間を過ごしました。',
        content_with_ruby: '<ruby>旅館<rt>りょかん</rt></ruby>に<ruby>戻<rt>もど</rt></ruby>り、<ruby>大浴場<rt>だいよくじょう</rt></ruby>に<ruby>入<rt>はい</rt></ruby>りました。<ruby>広<rt>ひろ</rt></ruby>い<ruby>浴槽<rt>よくそう</rt></ruby>には<ruby>乳白色<rt>にゅうはくしょく</rt></ruby>のお<ruby>湯<rt>ゆ</rt></ruby>が<ruby>満<rt>み</rt></ruby>ちています。<ruby>硫黄<rt>いおう</rt></ruby>の<ruby>香<rt>かお</rt></ruby>りが<ruby>漂<rt>ただよ</rt></ruby>い、<ruby>本格的<rt>ほんかくてき</rt></ruby>な<ruby>温泉<rt>おんせん</rt></ruby>を<ruby>感<rt>かん</rt></ruby>じます。<ruby>他<rt>ほか</rt></ruby>の<ruby>宿泊客<rt>しゅくはくきゃく</rt></ruby>と<ruby>少<rt>すこ</rt></ruby>し<ruby>会話<rt>かいわ</rt></ruby>をしながら、リラックスした<ruby>時間<rt>じかん</rt></ruby>を<ruby>過<rt>す</rt></ruby>ごしました。',
        translation: 'I returned to the inn and entered the large public bath. The wide bathtub is filled with milky white water. The scent of sulfur drifts, and I feel the authentic hot spring. I spent a relaxing time while having a little conversation with other guests.',
      },
      {
        chapter_id: 'ch-6-4',
        story_id: story6.story_id,
        chapter_number: 4,
        depth_level: 3,
        parent_chapter_id: 'ch-6-3a',
        content: '夕食の時間になりました。部屋に懐石料理が運ばれてきました。地元の山の幸、川の幸を使った料理が美しく並んでいます。一品一品に季節感があり、目でも舌でも楽しめます。仲居さんが料理の説明をしてくれました。これが日本の「おもてなし」の心だと感じました。',
        content_with_ruby: '<ruby>夕食<rt>ゆうしょく</rt></ruby>の<ruby>時間<rt>じかん</rt></ruby>になりました。<ruby>部屋<rt>へや</rt></ruby>に<ruby>懐石<rt>かいせき</rt></ruby><ruby>料理<rt>りょうり</rt></ruby>が<ruby>運<rt>はこ</rt></ruby>ばれてきました。<ruby>地元<rt>じもと</rt></ruby>の<ruby>山<rt>やま</rt></ruby>の<ruby>幸<rt>さち</rt></ruby>、<ruby>川<rt>かわ</rt></ruby>の<ruby>幸<rt>さち</rt></ruby>を<ruby>使<rt>つか</rt></ruby>った<ruby>料理<rt>りょうり</rt></ruby>が<ruby>美<rt>うつく</rt></ruby>しく<ruby>並<rt>なら</rt></ruby>んでいます。<ruby>一品<rt>いっぴん</rt></ruby><ruby>一品<rt>いっぴん</rt></ruby>に<ruby>季節感<rt>きせつかん</rt></ruby>があり、<ruby>目<rt>め</rt></ruby>でも<ruby>舌<rt>した</rt></ruby>でも<ruby>楽<rt>たの</rt></ruby>しめます。<ruby>仲居<rt>なかい</rt></ruby>さんが<ruby>料理<rt>りょうり</rt></ruby>の<ruby>説明<rt>せつめい</rt></ruby>をしてくれました。これが<ruby>日本<rt>にほん</rt></ruby>の「おもてなし」の<ruby>心<rt>こころ</rt></ruby>だと<ruby>感<rt>かん</rt></ruby>じました。',
        translation: 'It was time for dinner. Kaiseki cuisine was brought to the room. Dishes using local mountain delicacies and river delicacies are beautifully arranged. Each dish has a sense of season, and can be enjoyed both visually and tastefully. The attendant explained the dishes. I felt this was the spirit of Japanese "omotenashi" hospitality.',
      },
      {
        chapter_id: 'ch-6-5',
        story_id: story6.story_id,
        chapter_number: 5,
        depth_level: 4,
        parent_chapter_id: 'ch-6-4',
        content: '夜、もう一度温泉に入りました。夜の露天風呂は昼とは違う雰囲気で、星空を見ながら入浴できます。日本の温泉文化の素晴らしさを実感しました。温泉旅行は、心身ともに癒される最高の体験でした。明日の朝も温泉に入って、ゆっくりチェックアウトしたいと思います。',
        content_with_ruby: '<ruby>夜<rt>よる</rt></ruby>、もう<ruby>一度<rt>いちど</rt></ruby><ruby>温泉<rt>おんせん</rt></ruby>に<ruby>入<rt>はい</rt></ruby>りました。<ruby>夜<rt>よる</rt></ruby>の<ruby>露天風呂<rt>ろてんぶろ</rt></ruby>は<ruby>昼<rt>ひる</rt></ruby>とは<ruby>違<rt>ちが</rt></ruby>う<ruby>雰囲気<rt>ふんいき</rt></ruby>で、<ruby>星空<rt>ほしぞら</rt></ruby>を<ruby>見<rt>み</rt></ruby>ながら<ruby>入浴<rt>にゅうよく</rt></ruby>できます。<ruby>日本<rt>にほん</rt></ruby>の<ruby>温泉<rt>おんせん</rt></ruby><ruby>文化<rt>ぶんか</rt></ruby>の<ruby>素晴<rt>すば</rt></ruby>らしさを<ruby>実感<rt>じっかん</rt></ruby>しました。<ruby>温泉<rt>おんせん</rt></ruby><ruby>旅行<rt>りょこう</rt></ruby>は、<ruby>心身<rt>しんしん</rt></ruby>ともに<ruby>癒<rt>いや</rt></ruby>される<ruby>最高<rt>さいこう</rt></ruby>の<ruby>体験<rt>たいけん</rt></ruby>でした。<ruby>明日<rt>あした</rt></ruby>の<ruby>朝<rt>あさ</rt></ruby>も<ruby>温泉<rt>おんせん</rt></ruby>に<ruby>入<rt>はい</rt></ruby>って、ゆっくりチェックアウトしたいと<ruby>思<rt>おも</rt></ruby>います。',
        translation: 'At night, I entered the hot spring once more. The night outdoor bath has a different atmosphere from the daytime, and you can bathe while looking at the starry sky. I realized the wonderfulness of Japanese hot spring culture. The hot spring trip was the best experience that heals both mind and body. Tomorrow morning I also want to enter the hot spring and check out slowly.',
      },
    ],
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-6-2a-to-3a', chapter_id: 'ch-6-2a', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-6-3a', display_order: 1 },
      { choice_id: 'choice-6-2b-to-3b', chapter_id: 'ch-6-2b', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-6-3b', display_order: 1 },
      { choice_id: 'choice-6-2c-to-3c', chapter_id: 'ch-6-2c', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-6-3c', display_order: 1 },
      { choice_id: 'choice-6-3a-to-4', chapter_id: 'ch-6-3a', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-6-4', display_order: 1 },
      { choice_id: 'choice-6-3b-to-4', chapter_id: 'ch-6-3b', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-6-4', display_order: 1 },
      { choice_id: 'choice-6-3c-to-4', chapter_id: 'ch-6-3c', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-6-4', display_order: 1 },
      { choice_id: 'choice-6-4-to-5', chapter_id: 'ch-6-4', choice_text: '次へ進む', choice_description: 'ストーリーを完結させます。', next_chapter_id: 'ch-6-5', display_order: 1 },
    ],
  });

  console.log('Created Story 6 (温泉旅行) with 5 chapters and branching structure');

  // ============================================================
  // Story 7: 日本企業での面接 (N2/B2) - 5 Chapters with Branching
  // ============================================================
  const story7 = await prisma.story.create({
    data: {
      story_id: '7',
      title: '日本企業での面接',
      description: '日本の会社での就職面接。ビジネスマナーと面接の準備を体験します。',
      level_jlpt: 'N2',
      level_cefr: 'B2',
      estimated_time: 12,
      root_chapter_id: 'ch-7-1',
    },
  });

  const chapter7_1 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-7-1',
      story_id: story7.story_id,
      chapter_number: 1,
      depth_level: 0,
      content: '今日は大手IT企業の面接です。オフィスビルの前に着きました。スーツを着て、履歴書を持っています。とても緊張していますが、このチャンスを逃したくありません。面接まであと30分あります。どうしますか？',
      content_with_ruby: '<ruby>今日<rt>きょう</rt></ruby>は<ruby>大手<rt>おおて</rt></ruby>IT<ruby>企業<rt>きぎょう</rt></ruby>の<ruby>面接<rt>めんせつ</rt></ruby>です。オフィスビルの<ruby>前<rt>まえ</rt></ruby>に<ruby>着<rt>つ</rt></ruby>きました。スーツを<ruby>着<rt>き</rt></ruby>て、<ruby>履歴書<rt>りれきしょ</rt></ruby>を<ruby>持<rt>も</rt></ruby>っています。とても<ruby>緊張<rt>きんちょう</rt></ruby>していますが、このチャンスを<ruby>逃<rt>のが</rt></ruby>したくありません。<ruby>面接<rt>めんせつ</rt></ruby>まであと30<ruby>分<rt>ぷん</rt></ruby>あります。どうしますか？',
      translation: 'Today is an interview with a major IT company. I arrived in front of the office building. I am wearing a suit and holding my resume. I am very nervous, but I do not want to miss this chance. There are 30 minutes left until the interview. What will you do?',
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-7-1-a',
        chapter_id: chapter7_1.chapter_id,
        choice_text: '面接の準備をもう一度確認',
        choice_description: 'カフェで履歴書と想定質問を最終確認します。',
        next_chapter_id: 'ch-7-2a',
        display_order: 1,
      },
      {
        choice_id: 'choice-7-1-b',
        chapter_id: chapter7_1.chapter_id,
        choice_text: '深呼吸して心を落ち着ける',
        choice_description: '近くの公園で深呼吸をして、リラックスします。',
        next_chapter_id: 'ch-7-2b',
        display_order: 2,
      },
      {
        choice_id: 'choice-7-1-c',
        chapter_id: chapter7_1.chapter_id,
        choice_text: '他の応募者を観察する',
        choice_description: 'ロビーで待っている他の候補者を見て、雰囲気を掴みます。',
        next_chapter_id: 'ch-7-2c',
        display_order: 3,
      },
    ],
  });

  await prisma.chapter.createMany({
    data: [
      {
        chapter_id: 'ch-7-2a',
        story_id: story7.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter7_1.chapter_id,
        content: '近くのカフェで最終確認をしました。志望動機、自己PR、キャリアプランを頭の中で整理しました。日本語で自然に話せるよう、何度も練習しました。準備は完璧です。自信を持って面接に臨めそうです。',
        content_with_ruby: '<ruby>近<rt>ちか</rt></ruby>くのカフェで<ruby>最終<rt>さいしゅう</rt></ruby><ruby>確認<rt>かくにん</rt></ruby>をしました。<ruby>志望<rt>しぼう</rt></ruby><ruby>動機<rt>どうき</rt></ruby>、<ruby>自己<rt>じこ</rt></ruby>PR、キャリアプランを<ruby>頭<rt>あたま</rt></ruby>の<ruby>中<rt>なか</rt></ruby>で<ruby>整理<rt>せいり</rt></ruby>しました。<ruby>日本語<rt>にほんご</rt></ruby>で<ruby>自然<rt>しぜん</rt></ruby>に<ruby>話<rt>はな</rt></ruby>せるよう、<ruby>何度<rt>なんど</rt></ruby>も<ruby>練習<rt>れんしゅう</rt></ruby>しました。<ruby>準備<rt>じゅんび</rt></ruby>は<ruby>完璧<rt>かんぺき</rt></ruby>です。<ruby>自信<rt>じしん</rt></ruby>を<ruby>持<rt>も</rt></ruby>って<ruby>面接<rt>めんせつ</rt></ruby>に<ruby>臨<rt>のぞ</rt></ruby>めそうです。',
        translation: 'I did a final check at a nearby cafe. I organized my motivation, self-PR, and career plan in my head. I practiced many times so I could speak naturally in Japanese. The preparation is perfect. I seem to be able to face the interview with confidence.',
      },
      {
        chapter_id: 'ch-7-2b',
        story_id: story7.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter7_1.chapter_id,
        content: '小さな公園のベンチに座りました。目を閉じて、ゆっくりと深呼吸をします。吸って、吐いて。緊張が少しずつほぐれていきます。「大丈夫、今までの経験と準備を信じよう」と自分に言い聞かせました。心が落ち着いてきました。',
        content_with_ruby: '<ruby>小<rt>ちい</rt></ruby>さな<ruby>公園<rt>こうえん</rt></ruby>のベンチに<ruby>座<rt>すわ</rt></ruby>りました。<ruby>目<rt>め</rt></ruby>を<ruby>閉<rt>と</rt></ruby>じて、ゆっくりと<ruby>深呼吸<rt>しんこきゅう</rt></ruby>をします。<ruby>吸<rt>す</rt></ruby>って、<ruby>吐<rt>は</rt></ruby>いて。<ruby>緊張<rt>きんちょう</rt></ruby>が<ruby>少<rt>すこ</rt></ruby>しずつほぐれていきます。「<ruby>大丈夫<rt>だいじょうぶ</rt></ruby>、<ruby>今<rt>いま</rt></ruby>までの<ruby>経験<rt>けいけん</rt></ruby>と<ruby>準備<rt>じゅんび</rt></ruby>を<ruby>信<rt>しん</rt></ruby>じよう」と<ruby>自分<rt>じぶん</rt></ruby>に<ruby>言<rt>い</rt></ruby>い<ruby>聞<rt>き</rt></ruby>かせました。<ruby>心<rt>こころ</rt></ruby>が<ruby>落<rt>お</rt></ruby>ち<ruby>着<rt>つ</rt></ruby>いてきました。',
        translation: 'I sat on a bench in a small park. I closed my eyes and took deep breaths slowly. Inhale, exhale. The tension gradually loosens. I told myself "It\'s okay, believe in my experience and preparation so far." My mind has calmed down.',
      },
      {
        chapter_id: 'ch-7-2c',
        story_id: story7.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter7_1.chapter_id,
        content: 'ビルのロビーに入りました。何人かの応募者が待っています。みんな真剣な表情をしています。受付で名前を伝えると、待合室に案内されました。緊張感が高まりますが、ここまで来たからには全力を尽くすだけです。',
        content_with_ruby: 'ビルのロビーに<ruby>入<rt>はい</rt></ruby>りました。<ruby>何人<rt>なんにん</rt></ruby>かの<ruby>応募者<rt>おうぼしゃ</rt></ruby>が<ruby>待<rt>ま</rt></ruby>っています。みんな<ruby>真剣<rt>しんけん</rt></ruby>な<ruby>表情<rt>ひょうじょう</rt></ruby>をしています。<ruby>受付<rt>うけつけ</rt></ruby>で<ruby>名前<rt>なまえ</rt></ruby>を<ruby>伝<rt>つた</rt></ruby>えると、<ruby>待合室<rt>まちあいしつ</rt></ruby>に<ruby>案内<rt>あんない</rt></ruby>されました。<ruby>緊張感<rt>きんちょうかん</rt></ruby>が<ruby>高<rt>たか</rt></ruby>まりますが、ここまで<ruby>来<rt>き</rt></ruby>たからには<ruby>全力<rt>ぜんりょく</rt></ruby>を<ruby>尽<rt>つ</rt></ruby>くすだけです。',
        translation: 'I entered the building lobby. Several applicants are waiting. Everyone has a serious expression. When I gave my name at the reception, I was guided to the waiting room. The tension rises, but since I came this far, I just have to do my best.',
      },
      {
        chapter_id: 'ch-7-3a',
        story_id: story7.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-7-2a',
        content: '面接室に入りました。3人の面接官がいます。「お座りください」と言われ、椅子に座りました。まず志望動機を聞かれました。「御社のグローバルな事業展開と技術力に魅力を感じ、ぜひ貢献したいと思いました」と答えました。面接官は頷いて、メモを取っています。',
        content_with_ruby: '<ruby>面接室<rt>めんせつしつ</rt></ruby>に<ruby>入<rt>はい</rt></ruby>りました。3<ruby>人<rt>にん</rt></ruby>の<ruby>面接官<rt>めんせつかん</rt></ruby>がいます。「お<ruby>座<rt>すわ</rt></ruby>りください」と<ruby>言<rt>い</rt></ruby>われ、<ruby>椅子<rt>いす</rt></ruby>に<ruby>座<rt>すわ</rt></ruby>りました。まず<ruby>志望<rt>しぼう</rt></ruby><ruby>動機<rt>どうき</rt></ruby>を<ruby>聞<rt>き</rt></ruby>かれました。「<ruby>御社<rt>おんしゃ</rt></ruby>のグローバルな<ruby>事業<rt>じぎょう</rt></ruby><ruby>展開<rt>てんかい</rt></ruby>と<ruby>技術力<rt>ぎじゅつりょく</rt></ruby>に<ruby>魅力<rt>みりょく</rt></ruby>を<ruby>感<rt>かん</rt></ruby>じ、ぜひ<ruby>貢献<rt>こうけん</rt></ruby>したいと<ruby>思<rt>おも</rt></ruby>いました」と<ruby>答<rt>こた</rt></ruby>えました。<ruby>面接官<rt>めんせつかん</rt></ruby>は<ruby>頷<rt>うなず</rt></ruby>いて、メモを<ruby>取<rt>と</rt></ruby>っています。',
        translation: 'I entered the interview room. There are three interviewers. I was told "Please sit down" and sat on a chair. First I was asked about my motivation. I answered "I was attracted by your company\'s global business development and technical capabilities, and I definitely wanted to contribute." The interviewers nodded and are taking notes.',
      },
      {
        chapter_id: 'ch-7-3b',
        story_id: story7.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-7-2b',
        content: '面接が始まりました。リラックスしているおかげで、自然に話すことができます。「あなたの強みと弱みを教えてください」と聞かれました。「強みは問題解決能力です。弱みは細かいことに気を取られすぎることですが、優先順位をつけることで改善しています」と答えました。',
        content_with_ruby: '<ruby>面接<rt>めんせつ</rt></ruby>が<ruby>始<rt>はじ</rt></ruby>まりました。リラックスしているおかげで、<ruby>自然<rt>しぜん</rt></ruby>に<ruby>話<rt>はな</rt></ruby>すことができます。「あなたの<ruby>強<rt>つよ</rt></ruby>みと<ruby>弱<rt>よわ</rt></ruby>みを<ruby>教<rt>おし</rt></ruby>えてください」と<ruby>聞<rt>き</rt></ruby>かれました。「<ruby>強<rt>つよ</rt></ruby>みは<ruby>問題<rt>もんだい</rt></ruby><ruby>解決<rt>かいけつ</rt></ruby><ruby>能力<rt>のうりょく</rt></ruby>です。<ruby>弱<rt>よわ</rt></ruby>みは<ruby>細<rt>こま</rt></ruby>かいことに<ruby>気<rt>き</rt></ruby>を<ruby>取<rt>と</rt></ruby>られすぎることですが、<ruby>優先<rt>ゆうせん</rt></ruby><ruby>順位<rt>じゅんい</rt></ruby>をつけることで<ruby>改善<rt>かいぜん</rt></ruby>しています」と<ruby>答<rt>こた</rt></ruby>えました。',
        translation: 'The interview started. Thanks to being relaxed, I can speak naturally. I was asked "Please tell me your strengths and weaknesses." I answered "My strength is problem-solving ability. My weakness is being too distracted by details, but I am improving by setting priorities."',
      },
      {
        chapter_id: 'ch-7-3c',
        story_id: story7.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-7-2c',
        content: '名前を呼ばれ、面接室に入りました。他の応募者を見ていたので、流れがわかります。「5年後、どのようなキャリアを描いていますか？」と聞かれました。「チームリーダーとして、プロジェクトをマネジメントしながら、技術面でも会社に貢献したいです」と答えました。',
        content_with_ruby: '<ruby>名前<rt>なまえ</rt></ruby>を<ruby>呼<rt>よ</rt></ruby>ばれ、<ruby>面接室<rt>めんせつしつ</rt></ruby>に<ruby>入<rt>はい</rt></ruby>りました。<ruby>他<rt>ほか</rt></ruby>の<ruby>応募者<rt>おうぼしゃ</rt></ruby>を<ruby>見<rt>み</rt></ruby>ていたので、<ruby>流<rt>なが</rt></ruby>れがわかります。「5<ruby>年後<rt>ねんご</rt></ruby>、どのようなキャリアを<ruby>描<rt>えが</rt></ruby>いていますか？」と<ruby>聞<rt>き</rt></ruby>かれました。「チームリーダーとして、プロジェクトをマネジメントしながら、<ruby>技術面<rt>ぎじゅつめん</rt></ruby>でも<ruby>会社<rt>かいしゃ</rt></ruby>に<ruby>貢献<rt>こうけん</rt></ruby>したいです」と<ruby>答<rt>こた</rt></ruby>えました。',
        translation: 'My name was called and I entered the interview room. Since I watched other applicants, I understand the flow. I was asked "What kind of career do you envision in 5 years?" I answered "As a team leader, I want to contribute to the company both in management of projects and technically."',
      },
      {
        chapter_id: 'ch-7-4',
        story_id: story7.story_id,
        chapter_number: 4,
        depth_level: 3,
        parent_chapter_id: 'ch-7-3a',
        content: '面接官が「日本の企業文化に適応できると思いますか？」と聞きました。これは重要な質問です。「はい。チームワークを大切にする姿勢や、報告・連絡・相談の文化を理解しています。前職でも日本人の同僚と働いた経験があり、柔軟に適応できる自信があります」と答えました。面接官たちは満足そうな表情を見せました。',
        content_with_ruby: '<ruby>面接官<rt>めんせつかん</rt></ruby>が「<ruby>日本<rt>にほん</rt></ruby>の<ruby>企業<rt>きぎょう</rt></ruby><ruby>文化<rt>ぶんか</rt></ruby>に<ruby>適応<rt>てきおう</rt></ruby>できると<ruby>思<rt>おも</rt></ruby>いますか？」と<ruby>聞<rt>き</rt></ruby>きました。これは<ruby>重要<rt>じゅうよう</rt></ruby>な<ruby>質問<rt>しつもん</rt></ruby>です。「はい。チームワークを<ruby>大切<rt>たいせつ</rt></ruby>にする<ruby>姿勢<rt>しせい</rt></ruby>や、<ruby>報告<rt>ほうこく</rt></ruby>・<ruby>連絡<rt>れんらく</rt></ruby>・<ruby>相談<rt>そうだん</rt></ruby>の<ruby>文化<rt>ぶんか</rt></ruby>を<ruby>理解<rt>りかい</rt></ruby>しています。<ruby>前職<rt>ぜんしょく</rt></ruby>でも<ruby>日本人<rt>にほんじん</rt></ruby>の<ruby>同僚<rt>どうりょう</rt></ruby>と<ruby>働<rt>はたら</rt></ruby>いた<ruby>経験<rt>けいけん</rt></ruby>があり、<ruby>柔軟<rt>じゅうなん</rt></ruby>に<ruby>適応<rt>てきおう</rt></ruby>できる<ruby>自信<rt>じしん</rt></ruby>があります」と<ruby>答<rt>こた</rt></ruby>えました。<ruby>面接官<rt>めんせつかん</rt></ruby>たちは<ruby>満足<rt>まんぞく</rt></ruby>そうな<ruby>表情<rt>ひょうじょう</rt></ruby>を<ruby>見<rt>み</rt></ruby>せました。',
        translation: 'The interviewer asked "Do you think you can adapt to Japanese corporate culture?" This is an important question. I answered "Yes. I understand the attitude of valuing teamwork and the culture of reporting, communicating, and consulting. I have experience working with Japanese colleagues at my previous job, and I am confident I can adapt flexibly." The interviewers showed satisfied expressions.',
      },
      {
        chapter_id: 'ch-7-5',
        story_id: story7.story_id,
        chapter_number: 5,
        depth_level: 4,
        parent_chapter_id: 'ch-7-4',
        content: '面接が終わりました。「結果は一週間以内にご連絡します」と言われました。面接室を出て、深く一礼しました。全力を尽くしました。日本での就職活動は大変でしたが、良い経験になりました。結果を待つ間、次の準備も始めようと思います。日本で働くという夢に、また一歩近づいたような気がします。',
        content_with_ruby: '<ruby>面接<rt>めんせつ</rt></ruby>が<ruby>終<rt>お</rt></ruby>わりました。「<ruby>結果<rt>けっか</rt></ruby>は<ruby>一<rt>いっ</rt></ruby><ruby>週間<rt>しゅうかん</rt></ruby><ruby>以内<rt>いない</rt></ruby>にご<ruby>連絡<rt>れんらく</rt></ruby>します」と<ruby>言<rt>い</rt></ruby>われました。<ruby>面接室<rt>めんせつしつ</rt></ruby>を<ruby>出<rt>で</rt></ruby>て、<ruby>深<rt>ふか</rt></ruby>く<ruby>一礼<rt>いちれい</rt></ruby>しました。<ruby>全力<rt>ぜんりょく</rt></ruby>を<ruby>尽<rt>つ</rt></ruby>くしました。<ruby>日本<rt>にほん</rt></ruby>での<ruby>就職<rt>しゅうしょく</rt></ruby><ruby>活動<rt>かつどう</rt></ruby>は<ruby>大変<rt>たいへん</rt></ruby>でしたが、<ruby>良<rt>よ</rt></ruby>い<ruby>経験<rt>けいけん</rt></ruby>になりました。<ruby>結果<rt>けっか</rt></ruby>を<ruby>待<rt>ま</rt></ruby>つ<ruby>間<rt>あいだ</rt></ruby>、<ruby>次<rt>つぎ</rt></ruby>の<ruby>準備<rt>じゅんび</rt></ruby>も<ruby>始<rt>はじ</rt></ruby>めようと<ruby>思<rt>おも</rt></ruby>います。<ruby>日本<rt>にほん</rt></ruby>で<ruby>働<rt>はたら</rt></ruby>くという<ruby>夢<rt>ゆめ</rt></ruby>に、また<ruby>一歩<rt>いっぽ</rt></ruby><ruby>近<rt>ちか</rt></ruby>づいたような<ruby>気<rt>き</rt></ruby>がします。',
        translation: 'The interview ended. I was told "We will contact you within one week with the results." I left the interview room and bowed deeply. I did my best. Job hunting in Japan was tough, but it became a good experience. While waiting for the results, I think I will also start preparing for the next one. I feel I have taken another step closer to my dream of working in Japan.',
      },
    ],
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-7-2a-to-3a', chapter_id: 'ch-7-2a', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-7-3a', display_order: 1 },
      { choice_id: 'choice-7-2b-to-3b', chapter_id: 'ch-7-2b', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-7-3b', display_order: 1 },
      { choice_id: 'choice-7-2c-to-3c', chapter_id: 'ch-7-2c', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-7-3c', display_order: 1 },
      { choice_id: 'choice-7-3a-to-4', chapter_id: 'ch-7-3a', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-7-4', display_order: 1 },
      { choice_id: 'choice-7-3b-to-4', chapter_id: 'ch-7-3b', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-7-4', display_order: 1 },
      { choice_id: 'choice-7-3c-to-4', chapter_id: 'ch-7-3c', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-7-4', display_order: 1 },
      { choice_id: 'choice-7-4-to-5', chapter_id: 'ch-7-4', choice_text: '次へ進む', choice_description: 'ストーリーを完結させます。', next_chapter_id: 'ch-7-5', display_order: 1 },
    ],
  });

  console.log('Created Story 7 (日本企業での面接) with 5 chapters and branching structure');

  // ============================================================
  // Story 8: 京都の古寺巡り (N1/C1) - 5 Chapters with Branching
  // ============================================================
  const story8 = await prisma.story.create({
    data: {
      story_id: '8',
      title: '京都の古寺巡り',
      description: '古都京都で日本の精神性と美学を探求する旅。禅の思想と伝統文化を深く学びます。',
      level_jlpt: 'N1',
      level_cefr: 'C1',
      estimated_time: 15,
      root_chapter_id: 'ch-8-1',
    },
  });

  const chapter8_1 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-8-1',
      story_id: story8.story_id,
      chapter_number: 1,
      depth_level: 0,
      content: '早朝、清水寺に到着しました。観光客が少ない静かな時間です。朝靄の中、木造の本堂が荘厳な雰囲気を醸し出しています。清水の舞台から京都の街を一望できます。ここから、どのように寺院を巡りますか？',
      content_with_ruby: '<ruby>早朝<rt>そうちょう</rt></ruby>、<ruby>清水寺<rt>きよみずでら</rt></ruby>に<ruby>到着<rt>とうちゃく</rt></ruby>しました。<ruby>観光客<rt>かんこうきゃく</rt></ruby>が<ruby>少<rt>すく</rt></ruby>ない<ruby>静<rt>しず</rt></ruby>かな<ruby>時間<rt>じかん</rt></ruby>です。<ruby>朝靄<rt>あさもや</rt></ruby>の<ruby>中<rt>なか</rt></ruby>、<ruby>木造<rt>もくぞう</rt></ruby>の<ruby>本堂<rt>ほんどう</rt></ruby>が<ruby>荘厳<rt>そうごん</rt></ruby>な<ruby>雰囲気<rt>ふんいき</rt></ruby>を<ruby>醸<rt>かも</rt></ruby>し<ruby>出<rt>だ</rt></ruby>しています。<ruby>清水<rt>きよみず</rt></ruby>の<ruby>舞台<rt>ぶたい</rt></ruby>から<ruby>京都<rt>きょうと</rt></ruby>の<ruby>街<rt>まち</rt></ruby>を<ruby>一望<rt>いちぼう</rt></ruby>できます。ここから、どのように<ruby>寺院<rt>じいん</rt></ruby>を<ruby>巡<rt>めぐ</rt></ruby>りますか？',
      translation: 'In the early morning, I arrived at Kiyomizu-dera Temple. It is a quiet time with few tourists. In the morning mist, the wooden main hall exudes a solemn atmosphere. From the Kiyomizu stage, you can see the entire Kyoto city. From here, how will you tour the temple?',
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-8-1-a',
        chapter_id: chapter8_1.chapter_id,
        choice_text: '建築を鑑賞する',
        choice_description: '寺院の建築様式や歴史的価値について深く観察します。',
        next_chapter_id: 'ch-8-2a',
        display_order: 1,
      },
      {
        choice_id: 'choice-8-1-b',
        chapter_id: chapter8_1.chapter_id,
        choice_text: '由緒書を読む',
        choice_description: '寺院の歴史や仏教の教えについて学びます。',
        next_chapter_id: 'ch-8-2b',
        display_order: 2,
      },
      {
        choice_id: 'choice-8-1-c',
        chapter_id: chapter8_1.chapter_id,
        choice_text: '僧侶と話す',
        choice_description: '偶然出会った僧侶に、仏教について質問します。',
        next_chapter_id: 'ch-8-2c',
        display_order: 3,
      },
    ],
  });

  await prisma.chapter.createMany({
    data: [
      {
        chapter_id: 'ch-8-2a',
        story_id: story8.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter8_1.chapter_id,
        content: '本堂の構造を詳しく観察しました。釘を一本も使わない伝統的な組み木の技法が使われています。平安時代から続く建築技術の粋を感じます。日本の職人たちが何世代にもわたって磨いてきた技術の結晶です。このような建築物が千年以上も維持されてきたことに、深い感銘を受けました。',
        content_with_ruby: '<ruby>本堂<rt>ほんどう</rt></ruby>の<ruby>構造<rt>こうぞう</rt></ruby>を<ruby>詳<rt>くわ</rt></ruby>しく<ruby>観察<rt>かんさつ</rt></ruby>しました。<ruby>釘<rt>くぎ</rt></ruby>を<ruby>一本<rt>いっぽん</rt></ruby>も<ruby>使<rt>つか</rt></ruby>わない<ruby>伝統的<rt>でんとうてき</rt></ruby>な<ruby>組<rt>く</rt></ruby>み<ruby>木<rt>き</rt></ruby>の<ruby>技法<rt>ぎほう</rt></ruby>が<ruby>使<rt>つか</rt></ruby>われています。<ruby>平安<rt>へいあん</rt></ruby><ruby>時代<rt>じだい</rt></ruby>から<ruby>続<rt>つづ</rt></ruby>く<ruby>建築<rt>けんちく</rt></ruby><ruby>技術<rt>ぎじゅつ</rt></ruby>の<ruby>粋<rt>すい</rt></ruby>を<ruby>感<rt>かん</rt></ruby>じます。<ruby>日本<rt>にほん</rt></ruby>の<ruby>職人<rt>しょくにん</rt></ruby>たちが<ruby>何<rt>なん</rt></ruby><ruby>世代<rt>せだい</rt></ruby>にもわたって<ruby>磨<rt>みが</rt></ruby>いてきた<ruby>技術<rt>ぎじゅつ</rt></ruby>の<ruby>結晶<rt>けっしょう</rt></ruby>です。このような<ruby>建築物<rt>けんちくぶつ</rt></ruby>が<ruby>千年<rt>せんねん</rt></ruby><ruby>以上<rt>いじょう</rt></ruby>も<ruby>維持<rt>いじ</rt></ruby>されてきたことに、<ruby>深<rt>ふか</rt></ruby>い<ruby>感銘<rt>かんめい</rt></ruby>を<ruby>受<rt>う</rt></ruby>けました。',
        translation: 'I observed the structure of the main hall in detail. Traditional joinery techniques without using a single nail are employed. I feel the essence of architectural technology that has continued since the Heian period. It is the crystallization of skills that Japanese craftsmen have polished over many generations. I was deeply impressed that such architecture has been maintained for over a thousand years.',
      },
      {
        chapter_id: 'ch-8-2b',
        story_id: story8.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter8_1.chapter_id,
        content: '境内の由緒書を読みました。清水寺は778年に開山され、観音菩薩を本尊としています。「諸行無常」という仏教の根本思想について書かれていました。全てのものは変化し、永遠に続くものは何もない。この教えは、日本人の美意識である「もののあはれ」の根底にある考え方です。桜の花が散る美しさを愛でる心も、この思想から生まれています。',
        content_with_ruby: '<ruby>境内<rt>けいだい</rt></ruby>の<ruby>由緒書<rt>ゆいしょがき</rt></ruby>を<ruby>読<rt>よ</rt></ruby>みました。<ruby>清水寺<rt>きよみずでら</rt></ruby>は778<ruby>年<rt>ねん</rt></ruby>に<ruby>開山<rt>かいさん</rt></ruby>され、<ruby>観音<rt>かんのん</rt></ruby><ruby>菩薩<rt>ぼさつ</rt></ruby>を<ruby>本尊<rt>ほんぞん</rt></ruby>としています。「<ruby>諸行<rt>しょぎょう</rt></ruby><ruby>無常<rt>むじょう</rt></ruby>」という<ruby>仏教<rt>ぶっきょう</rt></ruby>の<ruby>根本<rt>こんぽん</rt></ruby><ruby>思想<rt>しそう</rt></ruby>について<ruby>書<rt>か</rt></ruby>かれていました。<ruby>全<rt>すべ</rt></ruby>てのものは<ruby>変化<rt>へんか</rt></ruby>し、<ruby>永遠<rt>えいえん</rt></ruby>に<ruby>続<rt>つづ</rt></ruby>くものは<ruby>何<rt>なに</rt></ruby>もない。この<ruby>教<rt>おし</rt></ruby>えは、<ruby>日本人<rt>にほんじん</rt></ruby>の<ruby>美意識<rt>びいしき</rt></ruby>である「もののあはれ」の<ruby>根底<rt>こんてい</rt></ruby>にある<ruby>考<rt>かんが</rt></ruby>え<ruby>方<rt>かた</rt></ruby>です。<ruby>桜<rt>さくら</rt></ruby>の<ruby>花<rt>はな</rt></ruby>が<ruby>散<rt>ち</rt></ruby>る<ruby>美<rt>うつく</rt></ruby>しさを<ruby>愛<rt>め</rt></ruby>でる<ruby>心<rt>こころ</rt></ruby>も、この<ruby>思想<rt>しそう</rt></ruby>から<ruby>生<rt>う</rt></ruby>まれています。',
        translation: 'I read the historical record in the precinct. Kiyomizu-dera was founded in 778 and enshrines Kannon Bodhisattva as the principal image. It was written about "impermanence," a fundamental Buddhist philosophy. All things change, and nothing lasts forever. This teaching is the underlying concept of "mono no aware," the Japanese aesthetic sense. The heart that appreciates the beauty of falling cherry blossoms is also born from this philosophy.',
      },
      {
        chapter_id: 'ch-8-2c',
        story_id: story8.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter8_1.chapter_id,
        content: '境内を歩いていると、若い僧侶に出会いました。勇気を出して、仏教について質問しました。「禅とは何ですか？」と尋ねると、僧侶は微笑んで答えました。「禅は言葉では説明できません。座禅を組んで、自分の心と向き合うことです。今この瞬間に集中し、雑念を払うことで、本当の自分に気づくのです」。その言葉は、私の心に深く響きました。',
        content_with_ruby: '<ruby>境内<rt>けいだい</rt></ruby>を<ruby>歩<rt>ある</rt></ruby>いていると、<ruby>若<rt>わか</rt></ruby>い<ruby>僧侶<rt>そうりょ</rt></ruby>に<ruby>出会<rt>であ</rt></ruby>いました。<ruby>勇気<rt>ゆうき</rt></ruby>を<ruby>出<rt>だ</rt></ruby>して、<ruby>仏教<rt>ぶっきょう</rt></ruby>について<ruby>質問<rt>しつもん</rt></ruby>しました。「<ruby>禅<rt>ぜん</rt></ruby>とは<ruby>何<rt>なん</rt></ruby>ですか？」と<ruby>尋<rt>たず</rt></ruby>ねると、<ruby>僧侶<rt>そうりょ</rt></ruby>は<ruby>微笑<rt>ほほえ</rt></ruby>んで<ruby>答<rt>こた</rt></ruby>えました。「<ruby>禅<rt>ぜん</rt></ruby>は<ruby>言葉<rt>ことば</rt></ruby>では<ruby>説明<rt>せつめい</rt></ruby>できません。<ruby>座禅<rt>ざぜん</rt></ruby>を<ruby>組<rt>く</rt></ruby>んで、<ruby>自分<rt>じぶん</rt></ruby>の<ruby>心<rt>こころ</rt></ruby>と<ruby>向<rt>む</rt></ruby>き<ruby>合<rt>あ</rt></ruby>うことです。<ruby>今<rt>いま</rt></ruby>この<ruby>瞬間<rt>しゅんかん</rt></ruby>に<ruby>集中<rt>しゅうちゅう</rt></ruby>し、<ruby>雑念<rt>ざつねん</rt></ruby>を<ruby>払<rt>はら</rt></ruby>うことで、<ruby>本当<rt>ほんとう</rt></ruby>の<ruby>自分<rt>じぶん</rt></ruby>に<ruby>気<rt>き</rt></ruby>づくのです」。その<ruby>言葉<rt>ことば</rt></ruby>は、<ruby>私<rt>わたし</rt></ruby>の<ruby>心<rt>こころ</rt></ruby>に<ruby>深<rt>ふか</rt></ruby>く<ruby>響<rt>ひび</rt></ruby>きました。',
        translation: 'While walking through the precinct, I met a young monk. I gathered courage and asked about Buddhism. When I asked "What is Zen?", the monk smiled and answered. "Zen cannot be explained in words. It is to sit in zazen and face your own heart. By concentrating on this moment now and dispelling distracting thoughts, you realize your true self." Those words resonated deeply in my heart.',
      },
      {
        chapter_id: 'ch-8-3a',
        story_id: story8.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-8-2a',
        content: '建築の美しさに感動した後、日本の美学について深く考えました。簡素でありながら洗練された美しさ。装飾を削ぎ落とし、本質だけを残す。これが「侘寂」という日本独特の美意識です。完璧ではないものの中に、かえって深い美しさを見出す。この哲学は、茶道、華道、庭園、そして日常生活の全てに浸透しています。',
        content_with_ruby: '<ruby>建築<rt>けんちく</rt></ruby>の<ruby>美<rt>うつく</rt></ruby>しさに<ruby>感動<rt>かんどう</rt></ruby>した<ruby>後<rt>あと</rt></ruby>、<ruby>日本<rt>にほん</rt></ruby>の<ruby>美学<rt>びがく</rt></ruby>について<ruby>深<rt>ふか</rt></ruby>く<ruby>考<rt>かんが</rt></ruby>えました。<ruby>簡素<rt>かんそ</rt></ruby>でありながら<ruby>洗練<rt>せんれん</rt></ruby>された<ruby>美<rt>うつく</rt></ruby>しさ。<ruby>装飾<rt>そうしょく</rt></ruby>を<ruby>削<rt>そ</rt></ruby>ぎ<ruby>落<rt>お</rt></ruby>とし、<ruby>本質<rt>ほんしつ</rt></ruby>だけを<ruby>残<rt>のこ</rt></ruby>す。これが「<ruby>侘寂<rt>わびさび</rt></ruby>」という<ruby>日本<rt>にほん</rt></ruby><ruby>独特<rt>どくとく</rt></ruby>の<ruby>美意識<rt>びいしき</rt></ruby>です。<ruby>完璧<rt>かんぺき</rt></ruby>ではないものの<ruby>中<rt>なか</rt></ruby>に、かえって<ruby>深<rt>ふか</rt></ruby>い<ruby>美<rt>うつく</rt></ruby>しさを<ruby>見出<rt>みいだ</rt></ruby>す。この<ruby>哲学<rt>てつがく</rt></ruby>は、<ruby>茶道<rt>さどう</rt></ruby>、<ruby>華道<rt>かどう</rt></ruby>、<ruby>庭園<rt>ていえん</rt></ruby>、そして<ruby>日常<rt>にちじょう</rt></ruby><ruby>生活<rt>せいかつ</rt></ruby>の<ruby>全<rt>すべ</rt></ruby>てに<ruby>浸透<rt>しんとう</rt></ruby>しています。',
        translation: 'After being moved by the beauty of the architecture, I thought deeply about Japanese aesthetics. Simple yet refined beauty. Stripping away decorations and leaving only the essence. This is "wabi-sabi," a uniquely Japanese aesthetic sense. Finding deep beauty in things that are not perfect. This philosophy permeates everything: tea ceremony, flower arrangement, gardens, and daily life.',
      },
      {
        chapter_id: 'ch-8-3b',
        story_id: story8.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-8-2b',
        content: '無常の概念について瞑想しました。全てのものは移ろいゆく。だからこそ、今この瞬間が貴重なのです。永遠に続くものがないからこそ、儚い美しさに価値がある。日本人が季節の移ろいを大切にし、満開の桜よりも散りゆく花びらに美を見出すのは、この思想が根底にあるからです。人生もまた同じ。変化を恐れるのではなく、受け入れることで、より豊かな人生を送ることができる。',
        content_with_ruby: '<ruby>無常<rt>むじょう</rt></ruby>の<ruby>概念<rt>がいねん</rt></ruby>について<ruby>瞑想<rt>めいそう</rt></ruby>しました。<ruby>全<rt>すべ</rt></ruby>てのものは<ruby>移<rt>うつ</rt></ruby>ろいゆく。だからこそ、<ruby>今<rt>いま</rt></ruby>この<ruby>瞬間<rt>しゅんかん</rt></ruby>が<ruby>貴重<rt>きちょう</rt></ruby>なのです。<ruby>永遠<rt>えいえん</rt></ruby>に<ruby>続<rt>つづ</rt></ruby>くものがないからこそ、<ruby>儚<rt>はかな</rt></ruby>い<ruby>美<rt>うつく</rt></ruby>しさに<ruby>価値<rt>かち</rt></ruby>がある。<ruby>日本人<rt>にほんじん</rt></ruby>が<ruby>季節<rt>きせつ</rt></ruby>の<ruby>移<rt>うつ</rt></ruby>ろいを<ruby>大切<rt>たいせつ</rt></ruby>にし、<ruby>満開<rt>まんかい</rt></ruby>の<ruby>桜<rt>さくら</rt></ruby>よりも<ruby>散<rt>ち</rt></ruby>りゆく<ruby>花<rt>はな</rt></ruby>びらに<ruby>美<rt>び</rt></ruby>を<ruby>見出<rt>みいだ</rt></ruby>すのは、この<ruby>思想<rt>しそう</rt></ruby>が<ruby>根底<rt>こんてい</rt></ruby>にあるからです。<ruby>人生<rt>じんせい</rt></ruby>もまた<ruby>同<rt>おな</rt></ruby>じ。<ruby>変化<rt>へんか</rt></ruby>を<ruby>恐<rt>おそ</rt></ruby>れるのではなく、<ruby>受<rt>う</rt></ruby>け<ruby>入<rt>い</rt></ruby>れることで、より<ruby>豊<rt>ゆた</rt></ruby>かな<ruby>人生<rt>じんせい</rt></ruby>を<ruby>送<rt>おく</rt></ruby>ることができる。',
        translation: 'I meditated on the concept of impermanence. All things pass away. That is why this moment now is precious. Because nothing lasts forever, fleeting beauty has value. The reason Japanese people cherish the changing seasons and find beauty in falling petals rather than cherry blossoms in full bloom is that this philosophy is at the foundation. Life is also the same. By accepting change rather than fearing it, you can live a richer life.',
      },
      {
        chapter_id: 'ch-8-3c',
        story_id: story8.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-8-2c',
        content: '禅の教えについてさらに学びたくなりました。僧侶が「坐禅体験をしてみませんか」と誘ってくれました。静かな禅堂で、他の参加者と共に座禅を組みました。最初は雑念だらけでしたが、呼吸に集中するうちに、心が静まっていきました。思考を手放し、ただ「今ここにいる」ことを感じる。これが禅の第一歩だと理解しました。',
        content_with_ruby: '<ruby>禅<rt>ぜん</rt></ruby>の<ruby>教<rt>おし</rt></ruby>えについてさらに<ruby>学<rt>まな</rt></ruby>びたくなりました。<ruby>僧侶<rt>そうりょ</rt></ruby>が「<ruby>坐禅<rt>ざぜん</rt></ruby><ruby>体験<rt>たいけん</rt></ruby>をしてみませんか」と<ruby>誘<rt>さそ</rt></ruby>ってくれました。<ruby>静<rt>しず</rt></ruby>かな<ruby>禅堂<rt>ぜんどう</rt></ruby>で、<ruby>他<rt>ほか</rt></ruby>の<ruby>参加者<rt>さんかしゃ</rt></ruby>と<ruby>共<rt>とも</rt></ruby>に<ruby>座禅<rt>ざぜん</rt></ruby>を<ruby>組<rt>く</rt></ruby>みました。<ruby>最初<rt>さいしょ</rt></ruby>は<ruby>雑念<rt>ざつねん</rt></ruby>だらけでしたが、<ruby>呼吸<rt>こきゅう</rt></ruby>に<ruby>集中<rt>しゅうちゅう</rt></ruby>するうちに、<ruby>心<rt>こころ</rt></ruby>が<ruby>静<rt>しず</rt></ruby>まっていきました。<ruby>思考<rt>しこう</rt></ruby>を<ruby>手放<rt>てばな</rt></ruby>し、ただ「<ruby>今<rt>いま</rt></ruby>ここにいる」ことを<ruby>感<rt>かん</rt></ruby>じる。これが<ruby>禅<rt>ぜん</rt></ruby>の<ruby>第一歩<rt>だいいっぽ</rt></ruby>だと<ruby>理解<rt>りかい</rt></ruby>しました。',
        translation: 'I wanted to learn more about Zen teachings. The monk invited me saying "Would you like to try a zazen experience?" In a quiet zen hall, I sat in zazen together with other participants. At first it was full of distracting thoughts, but as I concentrated on breathing, my mind calmed down. Letting go of thoughts and just feeling "being here now." I understood this was the first step of Zen.',
      },
      {
        chapter_id: 'ch-8-4',
        story_id: story8.story_id,
        chapter_number: 4,
        depth_level: 3,
        parent_chapter_id: 'ch-8-3a',
        content: '午後、伏見稲荷大社を訪れました。千本鳥居が続く参道は圧巻です。朱色の鳥居のトンネルをくぐりながら、山頂を目指しました。鳥居一つ一つは、願いを込めて奉納されたものです。日本の信仰心の深さを感じます。神道と仏教が共存する日本の宗教観は、寛容で調和を重んじる文化を生み出しました。',
        content_with_ruby: '<ruby>午後<rt>ごご</rt></ruby>、<ruby>伏見<rt>ふしみ</rt></ruby><ruby>稲荷<rt>いなり</rt></ruby><ruby>大社<rt>たいしゃ</rt></ruby>を<ruby>訪<rt>おとず</rt></ruby>れました。<ruby>千本<rt>せんぼん</rt></ruby><ruby>鳥居<rt>とりい</rt></ruby>が<ruby>続<rt>つづ</rt></ruby>く<ruby>参道<rt>さんどう</rt></ruby>は<ruby>圧巻<rt>あっかん</rt></ruby>です。<ruby>朱色<rt>しゅいろ</rt></ruby>の<ruby>鳥居<rt>とりい</rt></ruby>のトンネルをくぐりながら、<ruby>山頂<rt>さんちょう</rt></ruby>を<ruby>目指<rt>めざ</rt></ruby>しました。<ruby>鳥居<rt>とりい</rt></ruby><ruby>一<rt>ひと</rt></ruby>つ<ruby>一<rt>ひと</rt></ruby>つは、<ruby>願<rt>ねが</rt></ruby>いを<ruby>込<rt>こ</rt></ruby>めて<ruby>奉納<rt>ほうのう</rt></ruby>されたものです。<ruby>日本<rt>にほん</rt></ruby>の<ruby>信仰心<rt>しんこうしん</rt></ruby>の<ruby>深<rt>ふか</rt></ruby>さを<ruby>感<rt>かん</rt></ruby>じます。<ruby>神道<rt>しんとう</rt></ruby>と<ruby>仏教<rt>ぶっきょう</rt></ruby>が<ruby>共存<rt>きょうそん</rt></ruby>する<ruby>日本<rt>にほん</rt></ruby>の<ruby>宗教観<rt>しゅうきょうかん</rt></ruby>は、<ruby>寛容<rt>かんよう</rt></ruby>で<ruby>調和<rt>ちょうわ</rt></ruby>を<ruby>重<rt>おも</rt></ruby>んじる<ruby>文化<rt>ぶんか</rt></ruby>を<ruby>生<rt>う</rt></ruby>み<ruby>出<rt>だ</rt></ruby>しました。',
        translation: 'In the afternoon, I visited Fushimi Inari Taisha. The approach with thousands of torii gates is spectacular. While passing through the tunnel of vermilion torii gates, I aimed for the mountaintop. Each torii gate was dedicated with wishes. I feel the depth of Japanese faith. Japan\'s religious view where Shintoism and Buddhism coexist has created a culture that values tolerance and harmony.',
      },
      {
        chapter_id: 'ch-8-5',
        story_id: story8.story_id,
        chapter_number: 5,
        depth_level: 4,
        parent_chapter_id: 'ch-8-4',
        content: '京都での一日が終わりました。古寺を巡ることで、日本文化の精神的な深さを理解できました。禅の思想、無常の美学、侘寂の美意識。これらは全て、日本人の生き方や価値観の根底にあります。表面的な観光では決して味わえない、日本の心に触れることができました。この経験は、私の人生観を変えるほど深いものでした。京都の古寺は、単なる歴史的建造物ではなく、生きた哲学であり、精神性の宝庫です。',
        content_with_ruby: '<ruby>京都<rt>きょうと</rt></ruby>での<ruby>一日<rt>いちにち</rt></ruby>が<ruby>終<rt>お</rt></ruby>わりました。<ruby>古寺<rt>こじ</rt></ruby>を<ruby>巡<rt>めぐ</rt></ruby>ることで、<ruby>日本<rt>にほん</rt></ruby><ruby>文化<rt>ぶんか</rt></ruby>の<ruby>精神的<rt>せいしんてき</rt></ruby>な<ruby>深<rt>ふか</rt></ruby>さを<ruby>理解<rt>りかい</rt></ruby>できました。<ruby>禅<rt>ぜん</rt></ruby>の<ruby>思想<rt>しそう</rt></ruby>、<ruby>無常<rt>むじょう</rt></ruby>の<ruby>美学<rt>びがく</rt></ruby>、<ruby>侘寂<rt>わびさび</rt></ruby>の<ruby>美意識<rt>びいしき</rt></ruby>。これらは<ruby>全<rt>すべ</rt></ruby>て、<ruby>日本人<rt>にほんじん</rt></ruby>の<ruby>生<rt>い</rt></ruby>き<ruby>方<rt>かた</rt></ruby>や<ruby>価値観<rt>かちかん</rt></ruby>の<ruby>根底<rt>こんてい</rt></ruby>にあります。<ruby>表面的<rt>ひょうめんてき</rt></ruby>な<ruby>観光<rt>かんこう</rt></ruby>では<ruby>決<rt>けっ</rt></ruby>して<ruby>味<rt>あじ</rt></ruby>わえない、<ruby>日本<rt>にほん</rt></ruby>の<ruby>心<rt>こころ</rt></ruby>に<ruby>触<rt>ふ</rt></ruby>れることができました。この<ruby>経験<rt>けいけん</rt></ruby>は、<ruby>私<rt>わたし</rt></ruby>の<ruby>人生観<rt>じんせいかん</rt></ruby>を<ruby>変<rt>か</rt></ruby>えるほど<ruby>深<rt>ふか</rt></ruby>いものでした。<ruby>京都<rt>きょうと</rt></ruby>の<ruby>古寺<rt>こじ</rt></ruby>は、<ruby>単<rt>たん</rt></ruby>なる<ruby>歴史的<rt>れきしてき</rt></ruby><ruby>建造物<rt>けんぞうぶつ</rt></ruby>ではなく、<ruby>生<rt>い</rt></ruby>きた<ruby>哲学<rt>てつがく</rt></ruby>であり、<ruby>精神性<rt>せいしんせい</rt></ruby>の<ruby>宝庫<rt>ほうこ</rt></ruby>です。',
        translation: 'The day in Kyoto ended. By visiting ancient temples, I could understand the spiritual depth of Japanese culture. Zen philosophy, the aesthetics of impermanence, the sense of wabi-sabi. All of these are at the foundation of Japanese ways of life and values. I was able to touch the heart of Japan, which can never be tasted through superficial tourism. This experience was deep enough to change my view of life. The ancient temples of Kyoto are not mere historical buildings, but living philosophy and a treasure house of spirituality.',
      },
    ],
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-8-2a-to-3a', chapter_id: 'ch-8-2a', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-8-3a', display_order: 1 },
      { choice_id: 'choice-8-2b-to-3b', chapter_id: 'ch-8-2b', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-8-3b', display_order: 1 },
      { choice_id: 'choice-8-2c-to-3c', chapter_id: 'ch-8-2c', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-8-3c', display_order: 1 },
      { choice_id: 'choice-8-3a-to-4', chapter_id: 'ch-8-3a', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-8-4', display_order: 1 },
      { choice_id: 'choice-8-3b-to-4', chapter_id: 'ch-8-3b', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-8-4', display_order: 1 },
      { choice_id: 'choice-8-3c-to-4', chapter_id: 'ch-8-3c', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-8-4', display_order: 1 },
      { choice_id: 'choice-8-4-to-5', chapter_id: 'ch-8-4', choice_text: '次へ進む', choice_description: 'ストーリーを完結させます。', next_chapter_id: 'ch-8-5', display_order: 1 },
    ],
  });

  console.log('Created Story 8 (京都の古寺巡り) with 5 chapters and branching structure');

  // ============================================================
  // Story 9: ビジネス交渉 (N1/C1) - 5 Chapters with Branching
  // ============================================================
  const story9 = await prisma.story.create({
    data: {
      story_id: '9',
      title: 'ビジネス交渉',
      description: '日本企業との重要な商談。高度なビジネス日本語と交渉術を学びます。',
      level_jlpt: 'N1',
      level_cefr: 'C1',
      estimated_time: 15,
      root_chapter_id: 'ch-9-1',
    },
  });

  const chapter9_1 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-9-1',
      story_id: story9.story_id,
      chapter_number: 1,
      depth_level: 0,
      content: '大手企業との重要な商談の日です。会議室に入ると、相手企業の役員3名が待っていました。まず名刺交換から始まります。名刺は両手で丁寧に渡し、相手の名刺も両手で受け取ります。日本のビジネスマナーでは、名刺交換は極めて重要な儀式です。どのように交渉を始めますか？',
      content_with_ruby: '<ruby>大手<rt>おおて</rt></ruby><ruby>企業<rt>きぎょう</rt></ruby>との<ruby>重要<rt>じゅうよう</rt></ruby>な<ruby>商談<rt>しょうだん</rt></ruby>の<ruby>日<rt>ひ</rt></ruby>です。<ruby>会議室<rt>かいぎしつ</rt></ruby>に<ruby>入<rt>はい</rt></ruby>ると、<ruby>相手<rt>あいて</rt></ruby><ruby>企業<rt>きぎょう</rt></ruby>の<ruby>役員<rt>やくいん</rt></ruby>3<ruby>名<rt>めい</rt></ruby>が<ruby>待<rt>ま</rt></ruby>っていました。まず<ruby>名刺<rt>めいし</rt></ruby><ruby>交換<rt>こうかん</rt></ruby>から<ruby>始<rt>はじ</rt></ruby>まります。<ruby>名刺<rt>めいし</rt></ruby>は<ruby>両手<rt>りょうて</rt></ruby>で<ruby>丁寧<rt>ていねい</rt></ruby>に<ruby>渡<rt>わた</rt></ruby>し、<ruby>相手<rt>あいて</rt></ruby>の<ruby>名刺<rt>めいし</rt></ruby>も<ruby>両手<rt>りょうて</rt></ruby>で<ruby>受<rt>う</rt></ruby>け<ruby>取<rt>と</rt></ruby>ります。<ruby>日本<rt>にほん</rt></ruby>のビジネスマナーでは、<ruby>名刺<rt>めいし</rt></ruby><ruby>交換<rt>こうかん</rt></ruby>は<ruby>極<rt>きわ</rt></ruby>めて<ruby>重要<rt>じゅうよう</rt></ruby>な<ruby>儀式<rt>ぎしき</rt></ruby>です。どのように<ruby>交渉<rt>こうしょう</rt></ruby>を<ruby>始<rt>はじ</rt></ruby>めますか？',
      translation: 'It is the day of an important business meeting with a major company. When I entered the conference room, three executives from the other company were waiting. It starts with business card exchange. Business cards are handed with both hands politely, and the other person\'s business card is also received with both hands. In Japanese business etiquette, business card exchange is an extremely important ritual. How will you start the negotiation?',
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-9-1-a',
        chapter_id: chapter9_1.chapter_id,
        choice_text: '直接提案を始める',
        choice_description: '時間を効率的に使うため、すぐに本題に入ります。',
        next_chapter_id: 'ch-9-2a',
        display_order: 1,
      },
      {
        choice_id: 'choice-9-1-b',
        chapter_id: chapter9_1.chapter_id,
        choice_text: 'まず雑談で関係構築',
        choice_description: '日本式に、まずは雑談で雰囲気を和らげます。',
        next_chapter_id: 'ch-9-2b',
        display_order: 2,
      },
      {
        choice_id: 'choice-9-1-c',
        chapter_id: chapter9_1.chapter_id,
        choice_text: '相手の意見を先に聞く',
        choice_description: '謙虚な姿勢を示すため、相手の考えを先に伺います。',
        next_chapter_id: 'ch-9-2c',
        display_order: 3,
      },
    ],
  });

  await prisma.chapter.createMany({
    data: [
      {
        chapter_id: 'ch-9-2a',
        story_id: story9.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter9_1.chapter_id,
        content: 'すぐに提案書を開いて説明を始めました。しかし、相手の表情が少し硬いように感じます。日本のビジネス文化では、いきなり本題に入るのは性急と見なされることがあります。相手はまず人間関係を築きたいと思っているようです。少し焦りを感じました。',
        content_with_ruby: 'すぐに<ruby>提案書<rt>ていあんしょ</rt></ruby>を<ruby>開<rt>ひら</rt></ruby>いて<ruby>説明<rt>せつめい</rt></ruby>を<ruby>始<rt>はじ</rt></ruby>めました。しかし、<ruby>相手<rt>あいて</rt></ruby>の<ruby>表情<rt>ひょうじょう</rt></ruby>が<ruby>少<rt>すこ</rt></ruby>し<ruby>硬<rt>かた</rt></ruby>いように<ruby>感<rt>かん</rt></ruby>じます。<ruby>日本<rt>にほん</rt></ruby>のビジネス<ruby>文化<rt>ぶんか</rt></ruby>では、いきなり<ruby>本題<rt>ほんだい</rt></ruby>に<ruby>入<rt>はい</rt></ruby>るのは<ruby>性急<rt>せいきゅう</rt></ruby>と<ruby>見<rt>み</rt></ruby>なされることがあります。<ruby>相手<rt>あいて</rt></ruby>はまず<ruby>人間<rt>にんげん</rt></ruby><ruby>関係<rt>かんけい</rt></ruby>を<ruby>築<rt>きず</rt></ruby>きたいと<ruby>思<rt>おも</rt></ruby>っているようです。<ruby>少<rt>すこ</rt></ruby>し<ruby>焦<rt>あせ</rt></ruby>りを<ruby>感<rt>かん</rt></ruby>じました。',
        translation: 'I immediately opened the proposal and started explaining. However, I feel that the other party\'s expression is a little stiff. In Japanese business culture, jumping straight to the point can sometimes be seen as hasty. It seems the other party wants to build human relationships first. I felt a little anxious.',
      },
      {
        chapter_id: 'ch-9-2b',
        story_id: story9.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter9_1.chapter_id,
        content: '「今日は良い天気ですね」「御社のオフィスは素晴らしいですね」と、軽い会話から始めました。相手の表情が和らぎ、「ありがとうございます。先月リノベーションしたんですよ」と答えてくれました。この「アイスブレーキング」は、日本のビジネスでは非常に重要です。信頼関係を築くことが、交渉成功の鍵となります。',
        content_with_ruby: '「<ruby>今日<rt>きょう</rt></ruby>は<ruby>良<rt>よ</rt></ruby>い<ruby>天気<rt>てんき</rt></ruby>ですね」「<ruby>御社<rt>おんしゃ</rt></ruby>のオフィスは<ruby>素晴<rt>すば</rt></ruby>らしいですね」と、<ruby>軽<rt>かる</rt></ruby>い<ruby>会話<rt>かいわ</rt></ruby>から<ruby>始<rt>はじ</rt></ruby>めました。<ruby>相手<rt>あいて</rt></ruby>の<ruby>表情<rt>ひょうじょう</rt></ruby>が<ruby>和<rt>やわ</rt></ruby>らぎ、「ありがとうございます。<ruby>先月<rt>せんげつ</rt></ruby>リノベーションしたんですよ」と<ruby>答<rt>こた</rt></ruby>えてくれました。この「アイスブレーキング」は、<ruby>日本<rt>にほん</rt></ruby>のビジネスでは<ruby>非常<rt>ひじょう</rt></ruby>に<ruby>重要<rt>じゅうよう</rt></ruby>です。<ruby>信頼<rt>しんらい</rt></ruby><ruby>関係<rt>かんけい</rt></ruby>を<ruby>築<rt>きず</rt></ruby>くことが、<ruby>交渉<rt>こうしょう</rt></ruby><ruby>成功<rt>せいこう</rt></ruby>の<ruby>鍵<rt>かぎ</rt></ruby>となります。',
        translation: '"It\'s nice weather today" "Your company\'s office is wonderful" I started with light conversation. The other party\'s expression softened, and they answered "Thank you. We renovated it last month." This "ice breaking" is very important in Japanese business. Building trust is the key to successful negotiation.',
      },
      {
        chapter_id: 'ch-9-2c',
        story_id: story9.story_id,
        chapter_number: 2,
        depth_level: 1,
        parent_chapter_id: chapter9_1.chapter_id,
        content: '「本日はお時間をいただき、ありがとうございます。まず、御社のご意見やご要望をお聞かせいただけますでしょうか」と丁寧に聞きました。相手は「そうですね。実は私たちも、この分野での新しいパートナーを探していたんです」と話し始めました。傾聴の姿勢を示すことで、相手の本音を引き出すことができました。',
        content_with_ruby: '「<ruby>本日<rt>ほんじつ</rt></ruby>はお<ruby>時間<rt>じかん</rt></ruby>をいただき、ありがとうございます。まず、<ruby>御社<rt>おんしゃ</rt></ruby>のご<ruby>意見<rt>いけん</rt></ruby>やご<ruby>要望<rt>ようぼう</rt></ruby>をお<ruby>聞<rt>き</rt></ruby>かせいただけますでしょうか」と<ruby>丁寧<rt>ていねい</rt></ruby>に<ruby>聞<rt>き</rt></ruby>きました。<ruby>相手<rt>あいて</rt></ruby>は「そうですね。<ruby>実<rt>じつ</rt></ruby>は<ruby>私<rt>わたし</rt></ruby>たちも、この<ruby>分野<rt>ぶんや</rt></ruby>での<ruby>新<rt>あたら</rt></ruby>しいパートナーを<ruby>探<rt>さが</rt></ruby>していたんです」と<ruby>話<rt>はな</rt></ruby>し<ruby>始<rt>はじ</rt></ruby>めました。<ruby>傾聴<rt>けいちょう</rt></ruby>の<ruby>姿勢<rt>しせい</rt></ruby>を<ruby>示<rt>しめ</rt></ruby>すことで、<ruby>相手<rt>あいて</rt></ruby>の<ruby>本音<rt>ほんね</rt></ruby>を<ruby>引<rt>ひ</rt></ruby>き<ruby>出<rt>だ</rt></ruby>すことができました。',
        translation: '"Thank you for your time today. First, could you please let us hear your opinions and requests?" I asked politely. The other party started talking, "Well, actually we were also looking for a new partner in this field." By showing an attitude of listening, I was able to draw out the other party\'s true feelings.',
      },
      {
        chapter_id: 'ch-9-3a',
        story_id: story9.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-9-2a',
        content: '相手が「価格について懸念があります」と言いました。これは重要な局面です。日本のビジネスでは、直接的な拒否よりも、婉曲的な表現を使います。「懸念がある」「検討させていただきたい」は、実質的な反対意見を意味することが多いのです。慎重に対応する必要があります。',
        content_with_ruby: '<ruby>相手<rt>あいて</rt></ruby>が「<ruby>価格<rt>かかく</rt></ruby>について<ruby>懸念<rt>けねん</rt></ruby>があります」と<ruby>言<rt>い</rt></ruby>いました。これは<ruby>重要<rt>じゅうよう</rt></ruby>な<ruby>局面<rt>きょくめん</rt></ruby>です。<ruby>日本<rt>にほん</rt></ruby>のビジネスでは、<ruby>直接的<rt>ちょくせつてき</rt></ruby>な<ruby>拒否<rt>きょひ</rt></ruby>よりも、<ruby>婉曲的<rt>えんきょくてき</rt></ruby>な<ruby>表現<rt>ひょうげん</rt></ruby>を<ruby>使<rt>つか</rt></ruby>います。「<ruby>懸念<rt>けねん</rt></ruby>がある」「<ruby>検討<rt>けんとう</rt></ruby>させていただきたい」は、<ruby>実質的<rt>じっしつてき</rt></ruby>な<ruby>反対<rt>はんたい</rt></ruby><ruby>意見<rt>いけん</rt></ruby>を<ruby>意味<rt>いみ</rt></ruby>することが<ruby>多<rt>おお</rt></ruby>いのです。<ruby>慎重<rt>しんちょう</rt></ruby>に<ruby>対応<rt>たいおう</rt></ruby>する<ruby>必要<rt>ひつよう</rt></ruby>があります。',
        translation: 'The other party said "We have concerns about the price." This is an important phase. In Japanese business, euphemistic expressions are used rather than direct refusals. "Having concerns" and "We would like to consider" often mean substantial opposition. There is a need to respond carefully.',
      },
      {
        chapter_id: 'ch-9-3b',
        story_id: story9.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-9-2b',
        content: '良い雰囲気の中、提案の説明を始めました。相手は興味深そうに聞いています。「実施スケジュールについて、もう少し詳しく教えていただけますか」と質問がありました。具体的な質問は、興味を持っている証拠です。丁寧に、しかし自信を持って答えました。',
        content_with_ruby: '<ruby>良<rt>よ</rt></ruby>い<ruby>雰囲気<rt>ふんいき</rt></ruby>の<ruby>中<rt>なか</rt></ruby>、<ruby>提案<rt>ていあん</rt></ruby>の<ruby>説明<rt>せつめい</rt></ruby>を<ruby>始<rt>はじ</rt></ruby>めました。<ruby>相手<rt>あいて</rt></ruby>は<ruby>興味深<rt>きょうみぶか</rt></ruby>そうに<ruby>聞<rt>き</rt></ruby>いています。「<ruby>実施<rt>じっし</rt></ruby>スケジュールについて、もう<ruby>少<rt>すこ</rt></ruby>し<ruby>詳<rt>くわ</rt></ruby>しく<ruby>教<rt>おし</rt></ruby>えていただけますか」と<ruby>質問<rt>しつもん</rt></ruby>がありました。<ruby>具体的<rt>ぐたいてき</rt></ruby>な<ruby>質問<rt>しつもん</rt></ruby>は、<ruby>興味<rt>きょうみ</rt></ruby>を<ruby>持<rt>も</rt></ruby>っている<ruby>証拠<rt>しょうこ</rt></ruby>です。<ruby>丁寧<rt>ていねい</rt></ruby>に、しかし<ruby>自信<rt>じしん</rt></ruby>を<ruby>持<rt>も</rt></ruby>って<ruby>答<rt>こた</rt></ruby>えました。',
        translation: 'In a good atmosphere, I started explaining the proposal. The other party is listening with interest. There was a question "Could you tell us a little more about the implementation schedule?" Specific questions are evidence of interest. I answered politely but confidently.',
      },
      {
        chapter_id: 'ch-9-3c',
        story_id: story9.story_id,
        chapter_number: 3,
        depth_level: 2,
        parent_chapter_id: 'ch-9-2c',
        content: '相手のニーズを理解した上で、それに合わせた提案を行いました。「御社の課題を解決するために、このような形でサポートさせていただけると考えております」と説明しました。相手は何度も頷きながら聞いています。カスタマイズされた提案は、相手の心に響いているようです。',
        content_with_ruby: '<ruby>相手<rt>あいて</rt></ruby>のニーズを<ruby>理解<rt>りかい</rt></ruby>した<ruby>上<rt>うえ</rt></ruby>で、それに<ruby>合<rt>あ</rt></ruby>わせた<ruby>提案<rt>ていあん</rt></ruby>を<ruby>行<rt>おこな</rt></ruby>いました。「<ruby>御社<rt>おんしゃ</rt></ruby>の<ruby>課題<rt>かだい</rt></ruby>を<ruby>解決<rt>かいけつ</rt></ruby>するために、このような<ruby>形<rt>かたち</rt></ruby>でサポートさせていただけると<ruby>考<rt>かんが</rt></ruby>えております」と<ruby>説明<rt>せつめい</rt></ruby>しました。<ruby>相手<rt>あいて</rt></ruby>は<ruby>何度<rt>なんど</rt></ruby>も<ruby>頷<rt>うなず</rt></ruby>きながら<ruby>聞<rt>き</rt></ruby>いています。カスタマイズされた<ruby>提案<rt>ていあん</rt></ruby>は、<ruby>相手<rt>あいて</rt></ruby>の<ruby>心<rt>こころ</rt></ruby>に<ruby>響<rt>ひび</rt></ruby>いているようです。',
        translation: 'After understanding the other party\'s needs, I made a proposal tailored to them. I explained "To solve your company\'s issues, we think we can support you in this way." The other party is listening while nodding many times. The customized proposal seems to resonate with the other party\'s heart.',
      },
      {
        chapter_id: 'ch-9-4',
        story_id: story9.story_id,
        chapter_number: 4,
        depth_level: 3,
        parent_chapter_id: 'ch-9-3a',
        content: 'ここで「根回し」の重要性を思い出しました。日本企業では、正式な会議の前に、非公式に関係者の合意を取り付けることが一般的です。「もしよろしければ、一度御社の関係部署の方々とも個別にお話しする機会をいただけませんでしょうか」と提案しました。相手は「それは良いアイデアですね。調整させていただきます」と答えました。段階的なアプローチが功を奏しそうです。',
        content_with_ruby: 'ここで「<ruby>根回<rt>ねまわ</rt></ruby>し」の<ruby>重要性<rt>じゅうようせい</rt></ruby>を<ruby>思<rt>おも</rt></ruby>い<ruby>出<rt>だ</rt></ruby>しました。<ruby>日本<rt>にほん</rt></ruby><ruby>企業<rt>きぎょう</rt></ruby>では、<ruby>正式<rt>せいしき</rt></ruby>な<ruby>会議<rt>かいぎ</rt></ruby>の<ruby>前<rt>まえ</rt></ruby>に、<ruby>非公式<rt>ひこうしき</rt></ruby>に<ruby>関係者<rt>かんけいしゃ</rt></ruby>の<ruby>合意<rt>ごうい</rt></ruby>を<ruby>取<rt>と</rt></ruby>り<ruby>付<rt>つ</rt></ruby>けることが<ruby>一般的<rt>いっぱんてき</rt></ruby>です。「もしよろしければ、<ruby>一度<rt>いちど</rt></ruby><ruby>御社<rt>おんしゃ</rt></ruby>の<ruby>関係<rt>かんけい</rt></ruby><ruby>部署<rt>ぶしょ</rt></ruby>の<ruby>方々<rt>かたがた</rt></ruby>とも<ruby>個別<rt>こべつ</rt></ruby>にお<ruby>話<rt>はなし</rt></ruby>しする<ruby>機会<rt>きかい</rt></ruby>をいただけませんでしょうか」と<ruby>提案<rt>ていあん</rt></ruby>しました。<ruby>相手<rt>あいて</rt></ruby>は「それは<ruby>良<rt>よ</rt></ruby>いアイデアですね。<ruby>調整<rt>ちょうせい</rt></ruby>させていただきます」と<ruby>答<rt>こた</rt></ruby>えました。<ruby>段階的<rt>だんかいてき</rt></ruby>なアプローチが<ruby>功<rt>こう</rt></ruby>を<ruby>奏<rt>そう</rt></ruby>しそうです。',
        translation: 'Here I remembered the importance of "nemawashi" (behind-the-scenes consensus building). In Japanese companies, it is common to obtain informal agreement from stakeholders before formal meetings. I suggested "If it is alright with you, could we have an opportunity to speak individually with people from your related departments once?" The other party answered "That is a good idea. We will arrange it." A gradual approach seems to be working.',
      },
      {
        chapter_id: 'ch-9-5',
        story_id: story9.story_id,
        chapter_number: 5,
        depth_level: 4,
        parent_chapter_id: 'ch-9-4',
        content: '交渉が終わりました。「本日は貴重なお時間をいただき、誠にありがとうございました。前向きにご検討いただけますと幸いです」と丁寧にお礼を述べました。相手は「こちらこそ、ありがとうございました。社内で検討して、来週中にはご連絡させていただきます」と答えました。日本のビジネス交渉は、時間がかかりますが、丁寧な関係構築と相互尊重が何より大切です。この経験を通じて、日本のビジネス文化の深さを理解できました。',
        content_with_ruby: '<ruby>交渉<rt>こうしょう</rt></ruby>が<ruby>終<rt>お</rt></ruby>わりました。「<ruby>本日<rt>ほんじつ</rt></ruby>は<ruby>貴重<rt>きちょう</rt></ruby>なお<ruby>時間<rt>じかん</rt></ruby>をいただき、<ruby>誠<rt>まこと</rt></ruby>にありがとうございました。<ruby>前向<rt>まえむ</rt></ruby>きにご<ruby>検討<rt>けんとう</rt></ruby>いただけますと<ruby>幸<rt>さいわ</rt></ruby>いです」と<ruby>丁寧<rt>ていねい</rt></ruby>にお<ruby>礼<rt>れい</rt></ruby>を<ruby>述<rt>の</rt></ruby>べました。<ruby>相手<rt>あいて</rt></ruby>は「こちらこそ、ありがとうございました。<ruby>社内<rt>しゃない</rt></ruby>で<ruby>検討<rt>けんとう</rt></ruby>して、<ruby>来週<rt>らいしゅう</rt></ruby><ruby>中<rt>ちゅう</rt></ruby>にはご<ruby>連絡<rt>れんらく</rt></ruby>させていただきます」と<ruby>答<rt>こた</rt></ruby>えました。<ruby>日本<rt>にほん</rt></ruby>のビジネス<ruby>交渉<rt>こうしょう</rt></ruby>は、<ruby>時間<rt>じかん</rt></ruby>がかかりますが、<ruby>丁寧<rt>ていねい</rt></ruby>な<ruby>関係<rt>かんけい</rt></ruby><ruby>構築<rt>こうちく</rt></ruby>と<ruby>相互<rt>そうご</rt></ruby><ruby>尊重<rt>そんちょう</rt></ruby>が<ruby>何<rt>なに</rt></ruby>より<ruby>大切<rt>たいせつ</rt></ruby>です。この<ruby>経験<rt>けいけん</rt></ruby>を<ruby>通<rt>とお</rt></ruby>じて、<ruby>日本<rt>にほん</rt></ruby>のビジネス<ruby>文化<rt>ぶんか</rt></ruby>の<ruby>深<rt>ふか</rt></ruby>さを<ruby>理解<rt>りかい</rt></ruby>できました。',
        translation: 'The negotiation ended. I politely thanked them saying "Thank you very much for your valuable time today. We would appreciate it if you could consider it positively." The other party answered "Thank you as well. We will consider it internally and contact you within next week." Japanese business negotiations take time, but polite relationship building and mutual respect are most important. Through this experience, I could understand the depth of Japanese business culture.',
      },
    ],
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-9-2a-to-3a', chapter_id: 'ch-9-2a', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-9-3a', display_order: 1 },
      { choice_id: 'choice-9-2b-to-3b', chapter_id: 'ch-9-2b', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-9-3b', display_order: 1 },
      { choice_id: 'choice-9-2c-to-3c', chapter_id: 'ch-9-2c', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-9-3c', display_order: 1 },
      { choice_id: 'choice-9-3a-to-4', chapter_id: 'ch-9-3a', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-9-4', display_order: 1 },
      { choice_id: 'choice-9-3b-to-4', chapter_id: 'ch-9-3b', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-9-4', display_order: 1 },
      { choice_id: 'choice-9-3c-to-4', chapter_id: 'ch-9-3c', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-9-4', display_order: 1 },
      { choice_id: 'choice-9-4-to-5', chapter_id: 'ch-9-4', choice_text: '次へ進む', choice_description: 'ストーリーを完結させます。', next_chapter_id: 'ch-9-5', display_order: 1 },
    ],
  });

  console.log('Created Story 9 (ビジネス交渉) with 5 chapters and branching structure');

  // ============================================================
  // Quizzes - 3 per story (27 total)
  // ============================================================

  const quizData = [
    // Story 1 quizzes
    {
      quiz_id: 'quiz-1-1',
      story_id: '1',
      question_text: '主人公は渋谷に着いて、何に驚きましたか？',
      question_type: '読解',
      difficulty_level: 'N3',
      is_ai_generated: false,
      source_text: '渋谷の駅に着いて、人の多さに驚きました',
      choices: [
        { choice_text: '建物の高さ', is_correct: false, explanation: '不正解です。建物については触れていません。' },
        { choice_text: '人の多さ', is_correct: true, explanation: '正解です。「人の多さに驚きました」と書いてあります。' },
        { choice_text: '電車の速さ', is_correct: false, explanation: '不正解です。電車については触れていません。' },
        { choice_text: '天気の悪さ', is_correct: false, explanation: '不正解です。天気については触れていません。' },
      ],
    },
    {
      quiz_id: 'quiz-1-2',
      story_id: '1',
      question_text: '主人公が選んだ定食は何ですか？',
      question_type: '読解',
      difficulty_level: 'N3',
      is_ai_generated: false,
      source_text: '生姜焼き定食を注文すると、とても美味しくて感動しました',
      choices: [
        { choice_text: 'カレーライス', is_correct: false, explanation: '不正解です。カレーは出てきません。' },
        { choice_text: '寿司', is_correct: false, explanation: '不正解です。寿司は出てきません。' },
        { choice_text: '生姜焼き定食', is_correct: true, explanation: '正解です。「生姜焼き定食を注文すると」と書いてあります。' },
        { choice_text: 'ラーメン', is_correct: false, explanation: '不正解です。ラーメンは出てきません。' },
      ],
    },
    {
      quiz_id: 'quiz-1-3',
      story_id: '1',
      question_text: '明日から何が始まりますか？',
      question_type: '読解',
      difficulty_level: 'N3',
      is_ai_generated: false,
      source_text: '明日から日本語学校が始まります',
      choices: [
        { choice_text: 'アルバイト', is_correct: false, explanation: '不正解です。アルバイトについては触れていません。' },
        { choice_text: '旅行', is_correct: false, explanation: '不正解です。旅行については触れていません。' },
        { choice_text: '会社', is_correct: false, explanation: '不正解です。会社については触れていません。' },
        { choice_text: '日本語学校', is_correct: true, explanation: '正解です。「明日から日本語学校が始まります」と書いてあります。' },
      ],
    },
    // Story 2 quizzes
    {
      quiz_id: 'quiz-2-1',
      story_id: '2',
      question_text: 'カフェに入った日の天気はどうでしたか？',
      question_type: '読解',
      difficulty_level: 'N4',
      is_ai_generated: false,
      source_text: '雨の日、私は小さなカフェに入りました',
      choices: [
        { choice_text: '晴れ', is_correct: false, explanation: '不正解です。晴れではありません。' },
        { choice_text: '雨', is_correct: true, explanation: '正解です。「雨の日」と書いてあります。' },
        { choice_text: '曇り', is_correct: false, explanation: '不正解です。曇りではありません。' },
        { choice_text: '雪', is_correct: false, explanation: '不正解です。雪ではありません。' },
      ],
    },
    {
      quiz_id: 'quiz-2-2',
      story_id: '2',
      question_text: 'カフェで新しい友達と何を交換しましたか？',
      question_type: '読解',
      difficulty_level: 'N4',
      is_ai_generated: false,
      source_text: '連絡先を交換しました',
      choices: [
        { choice_text: '本', is_correct: false, explanation: '不正解です。本は交換していません。' },
        { choice_text: 'プレゼント', is_correct: false, explanation: '不正解です。プレゼントは交換していません。' },
        { choice_text: '連絡先', is_correct: true, explanation: '正解です。「連絡先を交換しました」と書いてあります。' },
        { choice_text: '名刺', is_correct: false, explanation: '不正解です。名刺については触れていません。' },
      ],
    },
    {
      quiz_id: 'quiz-2-3',
      story_id: '2',
      question_text: '主人公の気持ちはどうなりましたか？',
      question_type: '読解',
      difficulty_level: 'N4',
      is_ai_generated: false,
      source_text: '新しい友達ができて、心が温かくなりました',
      choices: [
        { choice_text: '悲しくなった', is_correct: false, explanation: '不正解です。悲しくなっていません。' },
        { choice_text: '怒った', is_correct: false, explanation: '不正解です。怒っていません。' },
        { choice_text: '心配になった', is_correct: false, explanation: '不正解です。心配していません。' },
        { choice_text: '心が温かくなった', is_correct: true, explanation: '正解です。「心が温かくなりました」と書いてあります。' },
      ],
    },
    // Story 3 quizzes (初めてのコンビニ - N5)
    {
      quiz_id: 'quiz-3-1',
      story_id: '3',
      question_text: 'コンビニで何を買いましたか？',
      question_type: '読解',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: 'おにぎり、お茶、お菓子のどれかを買った',
      choices: [
        { choice_text: '洋服', is_correct: false, explanation: '不正解です。服は買っていません。' },
        { choice_text: '食べ物や飲み物', is_correct: true, explanation: '正解です。おにぎり、お茶、またはお菓子を買いました。' },
        { choice_text: '本', is_correct: false, explanation: '不正解です。本は買っていません。' },
        { choice_text: '電気製品', is_correct: false, explanation: '不正解です。電気製品は買っていません。' },
      ],
    },
    {
      quiz_id: 'quiz-3-2',
      story_id: '3',
      question_text: '店員さんは何を聞きましたか？',
      question_type: '読解',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: 'お箸はご利用ですか？',
      choices: [
        { choice_text: '袋が必要か', is_correct: false, explanation: '不正解です。袋については聞いていません。' },
        { choice_text: '温めるか', is_correct: false, explanation: '不正解です。温めについては聞いていません。' },
        { choice_text: 'カードで払うか', is_correct: false, explanation: '不正解です。支払い方法は聞いていません。' },
        { choice_text: 'お箸が必要か', is_correct: true, explanation: '正解です。「お箸はご利用ですか？」と聞きました。' },
      ],
    },
    {
      quiz_id: 'quiz-3-3',
      story_id: '3',
      question_text: '主人公はどう思いましたか？',
      question_type: '読解',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: '日本のコンビニは本当に便利だと思いました',
      choices: [
        { choice_text: 'コンビニは高い', is_correct: false, explanation: '不正解です。値段については触れていません。' },
        { choice_text: 'コンビニは便利だ', is_correct: true, explanation: '正解です。「本当に便利だ」と思いました。' },
        { choice_text: 'コンビニは遠い', is_correct: false, explanation: '不正解です。距離については触れていません。' },
        { choice_text: 'コンビニは難しい', is_correct: false, explanation: '不正解です。難しいとは思っていません。' },
      ],
    },
    // Story 4 quizzes (駅での待ち合わせ - N4)
    {
      quiz_id: 'quiz-4-1',
      story_id: '4',
      question_text: 'どこで待ち合わせをしましたか？',
      question_type: '読解',
      difficulty_level: 'N4',
      is_ai_generated: false,
      source_text: '新宿駅で待ち合わせをしました',
      choices: [
        { choice_text: '渋谷駅', is_correct: false, explanation: '不正解です。渋谷ではありません。' },
        { choice_text: '東京駅', is_correct: false, explanation: '不正解です。東京駅ではありません。' },
        { choice_text: '新宿駅', is_correct: true, explanation: '正解です。「新宿駅」で待ち合わせをしました。' },
        { choice_text: '品川駅', is_correct: false, explanation: '不正解です。品川駅ではありません。' },
      ],
    },
    {
      quiz_id: 'quiz-4-2',
      story_id: '4',
      question_text: '新宿駅はどんな駅ですか？',
      question_type: '読解',
      difficulty_level: 'N4',
      is_ai_generated: false,
      source_text: '世界で最も混雑する駅の一つ',
      choices: [
        { choice_text: '小さくて静か', is_correct: false, explanation: '不正解です。混雑している大きな駅です。' },
        { choice_text: 'とても混雑している', is_correct: true, explanation: '正解です。「世界で最も混雑する駅の一つ」です。' },
        { choice_text: '新しい駅', is_correct: false, explanation: '不正解です。新しさについては触れていません。' },
        { choice_text: '地下にない', is_correct: false, explanation: '不正解です。地下も地上もあります。' },
      ],
    },
    {
      quiz_id: 'quiz-4-3',
      story_id: '4',
      question_text: '二人はどこへ行きましたか？',
      question_type: '読解',
      difficulty_level: 'N4',
      is_ai_generated: false,
      source_text: '一緒に電車に乗って出かけました',
      choices: [
        { choice_text: 'バスで行った', is_correct: false, explanation: '不正解です。電車で出かけました。' },
        { choice_text: 'タクシーで行った', is_correct: false, explanation: '不正解です。電車で出かけました。' },
        { choice_text: '駅で別れた', is_correct: false, explanation: '不正解です。一緒に出かけました。' },
        { choice_text: '電車で出かけた', is_correct: true, explanation: '正解です。「一緒に電車に乗って」出かけました。' },
      ],
    },
    // Story 5 quizzes (居酒屋での夜 - N3)
    {
      quiz_id: 'quiz-5-1',
      story_id: '5',
      question_text: '居酒屋に誰と行きましたか？',
      question_type: '読解',
      difficulty_level: 'N3',
      is_ai_generated: false,
      source_text: '仕事の同僚たちと居酒屋に行きました',
      choices: [
        { choice_text: '家族', is_correct: false, explanation: '不正解です。家族ではありません。' },
        { choice_text: '恋人', is_correct: false, explanation: '不正解です。恋人ではありません。' },
        { choice_text: '会社の同僚', is_correct: true, explanation: '正解です。「仕事の同僚たちと」行きました。' },
        { choice_text: '一人で', is_correct: false, explanation: '不正解です。同僚と一緒に行きました。' },
      ],
    },
    {
      quiz_id: 'quiz-5-2',
      story_id: '5',
      question_text: '「飲み放題」とは何ですか？',
      question_type: '語彙',
      difficulty_level: 'N3',
      is_ai_generated: false,
      source_text: '決まった時間内、決まった料金で好きなだけお酒が飲めるシステム',
      choices: [
        { choice_text: '無料で飲めること', is_correct: false, explanation: '不正解です。無料ではありません。' },
        { choice_text: '時間内に好きなだけ飲めること', is_correct: true, explanation: '正解です。「飲み放題」は時間制限内で飲み放題のシステムです。' },
        { choice_text: '一杯だけ飲めること', is_correct: false, explanation: '不正解です。好きなだけ飲めます。' },
        { choice_text: '家で飲むこと', is_correct: false, explanation: '不正解です。店で飲むシステムです。' },
      ],
    },
    {
      quiz_id: 'quiz-5-3',
      story_id: '5',
      question_text: '「割り勘」とは何ですか？',
      question_type: '語彙',
      difficulty_level: 'N3',
      is_ai_generated: false,
      source_text: '参加者全員で料金を均等に分けること',
      choices: [
        { choice_text: '一人が全部払うこと', is_correct: false, explanation: '不正解です。全員で分けます。' },
        { choice_text: '値引きしてもらうこと', is_correct: false, explanation: '不正解です。分割払いのことです。' },
        { choice_text: 'カードで払うこと', is_correct: false, explanation: '不正解です。支払い方法ではありません。' },
        { choice_text: '費用を皆で分けること', is_correct: true, explanation: '正解です。「割り勘」は費用を全員で分けることです。' },
      ],
    },
    // Story 6 quizzes (温泉旅行 - N2)
    {
      quiz_id: 'quiz-6-1',
      story_id: '6',
      question_text: '旅館に着いてすぐ何をしましたか？',
      question_type: '読解',
      difficulty_level: 'N2',
      is_ai_generated: false,
      source_text: 'ストーリーの選択によって異なる行動をとった',
      choices: [
        { choice_text: 'すぐに帰った', is_correct: false, explanation: '不正解です。旅館に泊まりました。' },
        { choice_text: '温泉、部屋で休憩、または街の散策', is_correct: true, explanation: '正解です。選択肢によって異なる行動をとりました。' },
        { choice_text: '別の旅館に行った', is_correct: false, explanation: '不正解です。そこに泊まりました。' },
        { choice_text: 'ずっと寝ていた', is_correct: false, explanation: '不正解です。色々な活動をしました。' },
      ],
    },
    {
      quiz_id: 'quiz-6-2',
      story_id: '6',
      question_text: '「懐石料理」とは何ですか？',
      question_type: '語彙',
      difficulty_level: 'N2',
      is_ai_generated: false,
      source_text: '伝統的な日本料理のコース料理',
      choices: [
        { choice_text: 'ファーストフード', is_correct: false, explanation: '不正解です。伝統的な高級料理です。' },
        { choice_text: '一品料理', is_correct: false, explanation: '不正解です。コース料理です。' },
        { choice_text: '伝統的な日本のコース料理', is_correct: true, explanation: '正解です。「懐石料理」は伝統的なコース料理です。' },
        { choice_text: '中華料理', is_correct: false, explanation: '不正解です。日本料理です。' },
      ],
    },
    {
      quiz_id: 'quiz-6-3',
      story_id: '6',
      question_text: '「おもてなし」とは何ですか？',
      question_type: '語彙',
      difficulty_level: 'N2',
      is_ai_generated: false,
      source_text: '心からの温かいもてなし',
      choices: [
        { choice_text: '高い料金', is_correct: false, explanation: '不正解です。料金ではなく精神です。' },
        { choice_text: '厳しい規則', is_correct: false, explanation: '不正解です。温かいもてなしです。' },
        { choice_text: '食事の名前', is_correct: false, explanation: '不正解です。もてなしの概念です。' },
        { choice_text: '心からのもてなしの精神', is_correct: true, explanation: '正解です。「おもてなし」は日本の伝統的なもてなしの精神です。' },
      ],
    },
    // Story 7 quizzes (日本企業での面接 - N2)
    {
      quiz_id: 'quiz-7-1',
      story_id: '7',
      question_text: '面接前にどんな気持ちでしたか？',
      question_type: '読解',
      difficulty_level: 'N2',
      is_ai_generated: false,
      source_text: 'とても緊張していました',
      choices: [
        { choice_text: 'リラックスしていた', is_correct: false, explanation: '不正解です。緊張していました。' },
        { choice_text: 'とても緊張していた', is_correct: true, explanation: '正解です。「とても緊張していた」と書いてあります。' },
        { choice_text: '眠かった', is_correct: false, explanation: '不正解です。緊張していました。' },
        { choice_text: '怒っていた', is_correct: false, explanation: '不正解です。緊張していました。' },
      ],
    },
    {
      quiz_id: 'quiz-7-2',
      story_id: '7',
      question_text: '「報連相」とは何ですか？',
      question_type: '語彙',
      difficulty_level: 'N2',
      is_ai_generated: false,
      source_text: '報告・連絡・相談の略',
      choices: [
        { choice_text: '会社の名前', is_correct: false, explanation: '不正解です。ビジネス用語です。' },
        { choice_text: '食事の種類', is_correct: false, explanation: '不正解です。コミュニケーション用語です。' },
        { choice_text: '報告・連絡・相談のこと', is_correct: true, explanation: '正解です。「報連相」は報告・連絡・相談の略です。' },
        { choice_text: '休憩時間', is_correct: false, explanation: '不正解です。仕事の基本原則です。' },
      ],
    },
    {
      quiz_id: 'quiz-7-3',
      story_id: '7',
      question_text: '面接が終わってどう思いましたか？',
      question_type: '読解',
      difficulty_level: 'N2',
      is_ai_generated: false,
      source_text: '達成感を感じました',
      choices: [
        { choice_text: '失敗したと思った', is_correct: false, explanation: '不正解です。達成感を感じました。' },
        { choice_text: 'もう一度やり直したい', is_correct: false, explanation: '不正解です。満足していました。' },
        { choice_text: '疲れただけだった', is_correct: false, explanation: '不正解です。達成感を感じました。' },
        { choice_text: '達成感を感じた', is_correct: true, explanation: '正解です。「達成感を感じました」と書いてあります。' },
      ],
    },
    // Story 8 quizzes (京都の古寺巡り - N1)
    {
      quiz_id: 'quiz-8-1',
      story_id: '8',
      question_text: '最初に訪れた寺はどこですか？',
      question_type: '読解',
      difficulty_level: 'N1',
      is_ai_generated: false,
      source_text: '清水寺から始まりました',
      choices: [
        { choice_text: '金閣寺', is_correct: false, explanation: '不正解です。清水寺です。' },
        { choice_text: '清水寺', is_correct: true, explanation: '正解です。「清水寺」から始まりました。' },
        { choice_text: '銀閣寺', is_correct: false, explanation: '不正解です。清水寺です。' },
        { choice_text: '東寺', is_correct: false, explanation: '不正解です。清水寺です。' },
      ],
    },
    {
      quiz_id: 'quiz-8-2',
      story_id: '8',
      question_text: '「侘寂（わびさび）」とは何を表す概念ですか？',
      question_type: '語彙',
      difficulty_level: 'N1',
      is_ai_generated: false,
      source_text: '不完全さや無常の中に見出す美',
      choices: [
        { choice_text: '豪華絢爛な美しさ', is_correct: false, explanation: '不正解です。質素な美です。' },
        { choice_text: '最新の流行', is_correct: false, explanation: '不正解です。伝統的な美意識です。' },
        { choice_text: '不完全さの中に美を見出す日本の美意識', is_correct: true, explanation: '正解です。「侘寂」は不完全さや質素さの中に美を見出す概念です。' },
        { choice_text: '完璧さの追求', is_correct: false, explanation: '不正解です。不完全さを受け入れる美です。' },
      ],
    },
    {
      quiz_id: 'quiz-8-3',
      story_id: '8',
      question_text: '伏見稲荷神社の特徴は何ですか？',
      question_type: '読解',
      difficulty_level: 'N1',
      is_ai_generated: false,
      source_text: '千本鳥居が有名',
      choices: [
        { choice_text: '金色の建物がある', is_correct: false, explanation: '不正解です。鳥居が特徴です。' },
        { choice_text: '温泉がある', is_correct: false, explanation: '不正解です。神社です。' },
        { choice_text: '海の近くにある', is_correct: false, explanation: '不正解です。山にあります。' },
        { choice_text: '千本の鳥居が並んでいる', is_correct: true, explanation: '正解です。「千本鳥居」が有名です。' },
      ],
    },
    // Story 9 quizzes (ビジネス交渉 - N1)
    {
      quiz_id: 'quiz-9-1',
      story_id: '9',
      question_text: '会議の最初に何をしましたか？',
      question_type: '読解',
      difficulty_level: 'N1',
      is_ai_generated: false,
      source_text: '名刺交換をしました',
      choices: [
        { choice_text: '握手', is_correct: false, explanation: '不正解です。日本では名刺交換が先です。' },
        { choice_text: '名刺交換', is_correct: true, explanation: '正解です。最初に「名刺交換」をしました。' },
        { choice_text: 'すぐに議題に入った', is_correct: false, explanation: '不正解です。まず名刺交換をしました。' },
        { choice_text: '食事をした', is_correct: false, explanation: '不正解です。会議から始まりました。' },
      ],
    },
    {
      quiz_id: 'quiz-9-2',
      story_id: '9',
      question_text: '「根回し」とは何ですか？',
      question_type: '語彙',
      difficulty_level: 'N1',
      is_ai_generated: false,
      source_text: '正式な会議の前に関係者の了解を得ること',
      choices: [
        { choice_text: '木の根を切ること', is_correct: false, explanation: '不正解です。ビジネス用語です。' },
        { choice_text: '会議で強く主張すること', is_correct: false, explanation: '不正解です。事前調整のことです。' },
        { choice_text: '契約書に署名すること', is_correct: false, explanation: '不正解です。事前の調整活動です。' },
        { choice_text: '事前に関係者と調整して合意を形成すること', is_correct: true, explanation: '正解です。「根回し」は事前の調整と合意形成です。' },
      ],
    },
    {
      quiz_id: 'quiz-9-3',
      story_id: '9',
      question_text: '交渉はどうなりましたか？',
      question_type: '読解',
      difficulty_level: 'N1',
      is_ai_generated: false,
      source_text: '相互の尊重を持って合意に達しました',
      choices: [
        { choice_text: '決裂した', is_correct: false, explanation: '不正解です。成功しました。' },
        { choice_text: '成功して合意に達した', is_correct: true, explanation: '正解です。「相互の尊重を持って合意に達した」と書いてあります。' },
        { choice_text: '延期された', is_correct: false, explanation: '不正解です。合意しました。' },
        { choice_text: '中止になった', is_correct: false, explanation: '不正解です。成功しました。' },
      ],
    },
  ];

  // Create quizzes and quiz choices
  for (const quiz of quizData) {
    const createdQuiz = await prisma.quiz.create({
      data: {
        quiz_id: quiz.quiz_id,
        story_id: quiz.story_id,
        question_text: quiz.question_text,
        question_type: quiz.question_type,
        difficulty_level: quiz.difficulty_level,
        is_ai_generated: quiz.is_ai_generated,
        source_text: quiz.source_text,
      },
    });

    await prisma.quizChoice.createMany({
      data: quiz.choices.map((choice, index) => ({
        choice_id: `${quiz.quiz_id}-choice-${index + 1}`,
        quiz_id: createdQuiz.quiz_id,
        choice_text: choice.choice_text,
        is_correct: choice.is_correct,
        explanation: choice.explanation,
      })),
    });
  }

  console.log('Created 27 quizzes (3 per story) with choices');
  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
