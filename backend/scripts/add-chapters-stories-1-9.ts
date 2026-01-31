import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addChapters() {
  console.log('Adding chapters to Stories 1-9...\n');

  try {
    await addChaptersStory1();
    await addChaptersStory2();
    await addChaptersStory3();
    await addChaptersStory4();
    await addChaptersStory5();
    await addChaptersStory6();
    await addChaptersStory7();
    await addChaptersStory8();
    await addChaptersStory9();

    console.log('\n✅ All chapters added successfully!');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function addChaptersStory1() {
  console.log('Adding chapters for Story 1: コンビニで買い物...');

  // Chapter 1 (root)
  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-1-1',
      story_id: '1',
      chapter_number: 1,
      depth_level: 0,
      content: 'コンビニに入りました。何を買いますか？',
      content_with_ruby: '<ruby>コンビニ</ruby>に<ruby>入<rt>はい</rt></ruby>りました。<ruby>何<rt>なに</rt></ruby>を<ruby>買<rt>か</rt></ruby>いますか？',
      translation: 'You entered a convenience store. What will you buy?',
      vocabulary: {
        create: [
          { word: 'コンビニ', reading: 'こんびに', meanings: { en: 'convenience store' }, example: 'コンビニで買い物をします。' },
          { word: '買う', reading: 'かう', meanings: { en: 'to buy' }, example: '本を買います。' },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-1-1-a', chapter_id: 'ch-1-1', choice_text: 'お弁当を買う', choice_description: 'ランチにお弁当を探す', next_chapter_id: 'ch-1-2', display_order: 1 },
      { choice_id: 'choice-1-1-b', chapter_id: 'ch-1-1', choice_text: 'おにぎりを買う', choice_description: '軽食におにぎりを選ぶ', next_chapter_id: 'ch-1-3', display_order: 2 },
    ],
  });

  // Chapter 2
  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-1-2',
      story_id: '1',
      parent_chapter_id: 'ch-1-1',
      chapter_number: 2,
      depth_level: 1,
      content: '店員：いらっしゃいませ。お弁当はあそこです。',
      content_with_ruby: '<ruby>店員<rt>てんいん</rt></ruby>：いらっしゃいませ。<ruby>お弁当<rt>おべんとう</rt></ruby>はあそこです。',
      translation: 'Staff: Welcome. The bento boxes are over there.',
      vocabulary: {
        create: [
          { word: 'お弁当', reading: 'おべんとう', meanings: { en: 'bento box, lunch box' }, example: 'お弁当を食べます。' },
          { word: 'あそこ', reading: 'あそこ', meanings: { en: 'over there' }, example: 'あそこに学校があります。' },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-1-2-a', chapter_id: 'ch-1-2', choice_text: 'ありがとうございます', choice_description: 'お礼を言う', next_chapter_id: 'ch-1-4', display_order: 1 },
      { choice_id: 'choice-1-2-b', chapter_id: 'ch-1-2', choice_text: 'すみません、お弁当はいくらですか？', choice_description: '値段を聞く', next_chapter_id: 'ch-1-4', display_order: 2 },
    ],
  });

  // Chapter 3
  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-1-3',
      story_id: '1',
      parent_chapter_id: 'ch-1-1',
      chapter_number: 3,
      depth_level: 1,
      content: 'おにぎりがたくさんあります。どれにしますか？',
      content_with_ruby: 'おにぎりがたくさんあります。どれにしますか？',
      translation: 'There are many rice balls. Which one will you choose?',
      vocabulary: {
        create: [
          { word: 'たくさん', reading: 'たくさん', meanings: { en: 'many, a lot' }, example: '本がたくさんあります。' },
          { word: 'どれ', reading: 'どれ', meanings: { en: 'which one' }, example: 'どれがいいですか。' },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-1-3-a', chapter_id: 'ch-1-3', choice_text: 'これをください', choice_description: 'おにぎりを選ぶ', next_chapter_id: 'ch-1-4', display_order: 1 },
    ],
  });

  // Chapter 4 (final)
  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-1-4',
      story_id: '1',
      chapter_number: 4,
      depth_level: 2,
      content: 'レジで支払いをしました。300円です。ありがとうございました！',
      content_with_ruby: 'レジで<ruby>支払<rt>しはら</rt></ruby>いをしました。300<ruby>円<rt>えん</rt></ruby>です。ありがとうございました！',
      translation: 'You paid at the register. It is 300 yen. Thank you!',
      vocabulary: {
        create: [
          { word: '支払い', reading: 'しはらい', meanings: { en: 'payment' }, example: '支払いをお願いします。' },
          { word: '円', reading: 'えん', meanings: { en: 'yen' }, example: '100円です。' },
        ],
      },
    },
  });

  console.log('✓ Story 1 chapters created');
}

async function addChaptersStory2() {
  console.log('Adding chapters for Story 2: 自己紹介...');

  // Chapter 1 (root)
  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-2-1',
      story_id: '2',
      chapter_number: 1,
      depth_level: 0,
      content: '新しいクラスで自己紹介をします。',
      content_with_ruby: '<ruby>新<rt>あたら</rt></ruby>しいクラスで<ruby>自己紹介<rt>じこしょうかい</rt></ruby>をします。',
      translation: 'You will introduce yourself in your new class.',
      vocabulary: {
        create: [
          { word: '自己紹介', reading: 'じこしょうかい', meanings: { en: 'self-introduction' }, example: '自己紹介をします。' },
          { word: '新しい', reading: 'あたらしい', meanings: { en: 'new' }, example: '新しい本を買いました。' },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-2-1-a', chapter_id: 'ch-2-1', choice_text: 'はじめまして！', choice_description: '元気に始める', next_chapter_id: 'ch-2-2', display_order: 1 },
      { choice_id: 'choice-2-1-b', chapter_id: 'ch-2-1', choice_text: 'あの...こんにちは', choice_description: '少し緊張している', next_chapter_id: 'ch-2-3', display_order: 2 },
    ],
  });

  // Chapter 2
  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-2-2',
      story_id: '2',
      parent_chapter_id: 'ch-2-1',
      chapter_number: 2,
      depth_level: 1,
      content: '私はジョンです。アメリカから来ました。',
      content_with_ruby: '<ruby>私<rt>わたし</rt></ruby>はジョンです。アメリカから<ruby>来<rt>き</rt></ruby>ました。',
      translation: 'I am John. I came from America.',
      vocabulary: {
        create: [
          { word: '私', reading: 'わたし', meanings: { en: 'I, me' }, example: '私は学生です。' },
          { word: '来る', reading: 'くる', meanings: { en: 'to come' }, example: '友達が来ます。' },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-2-2-a', chapter_id: 'ch-2-2', choice_text: '趣味は音楽です', choice_description: '趣味を話す', next_chapter_id: 'ch-2-4', display_order: 1 },
      { choice_id: 'choice-2-2-b', chapter_id: 'ch-2-2', choice_text: '日本語を勉強しています', choice_description: '勉強のことを話す', next_chapter_id: 'ch-2-4', display_order: 2 },
    ],
  });

  // Chapter 3
  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-2-3',
      story_id: '2',
      parent_chapter_id: 'ch-2-1',
      chapter_number: 3,
      depth_level: 1,
      content: '私の名前はジョンです。よろしくお願いします。',
      content_with_ruby: '<ruby>私<rt>わたし</rt></ruby>の<ruby>名前<rt>なまえ</rt></ruby>はジョンです。よろしくお<ruby>願<rt>ねが</rt></ruby>いします。',
      translation: 'My name is John. Nice to meet you.',
      vocabulary: {
        create: [
          { word: '名前', reading: 'なまえ', meanings: { en: 'name' }, example: '名前は何ですか。' },
          { word: 'よろしく', reading: 'よろしく', meanings: { en: 'please (be kind)' }, example: 'よろしくお願いします。' },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-2-3-a', chapter_id: 'ch-2-3', choice_text: '日本が好きです', choice_description: '日本の話をする', next_chapter_id: 'ch-2-4', display_order: 1 },
    ],
  });

  // Chapter 4 (final)
  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-2-4',
      story_id: '2',
      chapter_number: 4,
      depth_level: 2,
      content: 'クラスメイト：よろしくね！一緒に頑張ろう！\n\nあなたは自己紹介ができました。',
      content_with_ruby: 'クラスメイト：よろしくね！<ruby>一緒<rt>いっしょ</rt></ruby>に<ruby>頑張<rt>がんば</rt></ruby>ろう！\n\nあなたは<ruby>自己紹介<rt>じこしょうかい</rt></ruby>ができました。',
      translation: "Classmate: Nice to meet you! Let's do our best together!\n\nYou completed your self-introduction.",
      vocabulary: {
        create: [
          { word: '一緒', reading: 'いっしょ', meanings: { en: 'together' }, example: '一緒に行きましょう。' },
          { word: '頑張る', reading: 'がんばる', meanings: { en: "to do one's best" }, example: '明日も頑張ります。' },
        ],
      },
    },
  });

  console.log('✓ Story 2 chapters created');
}

async function addChaptersStory3() {
  console.log('Adding chapters for Story 3: レストランで注文...');

  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-3-1',
      story_id: '3',
      chapter_number: 1,
      depth_level: 0,
      content: 'レストランに入りました。メニューを見ています。',
      content_with_ruby: 'レストランに<ruby>入<rt>はい</rt></ruby>りました。メニューを<ruby>見<rt>み</rt></ruby>ています。',
      translation: 'You entered a restaurant. You are looking at the menu.',
      vocabulary: {
        create: [
          { word: 'メニュー', reading: 'めにゅー', meanings: { en: 'menu' }, example: 'メニューを見ます。' },
          { word: '見る', reading: 'みる', meanings: { en: 'to see, to look' }, example: 'テレビを見ます。' },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-3-1-a', chapter_id: 'ch-3-1', choice_text: 'ラーメンを注文する', choice_description: 'ラーメンにする', next_chapter_id: 'ch-3-2', display_order: 1 },
      { choice_id: 'choice-3-1-b', chapter_id: 'ch-3-1', choice_text: '定食を注文する', choice_description: '定食セットを選ぶ', next_chapter_id: 'ch-3-2', display_order: 2 },
    ],
  });

  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-3-2',
      story_id: '3',
      parent_chapter_id: 'ch-3-1',
      chapter_number: 2,
      depth_level: 1,
      content: '店員：ご注文はお決まりですか？',
      content_with_ruby: '<ruby>店員<rt>てんいん</rt></ruby>：ご<ruby>注文<rt>ちゅうもん</rt></ruby>はお<ruby>決<rt>き</rt></ruby>まりですか？',
      translation: 'Staff: Have you decided on your order?',
      vocabulary: {
        create: [
          { word: '注文', reading: 'ちゅうもん', meanings: { en: 'order' }, example: '注文をお願いします。' },
          { word: '決まる', reading: 'きまる', meanings: { en: 'to be decided' }, example: '予定が決まりました。' },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-3-2-a', chapter_id: 'ch-3-2', choice_text: 'これをお願いします', choice_description: '注文する', next_chapter_id: 'ch-3-3', display_order: 1 },
      { choice_id: 'choice-3-2-b', chapter_id: 'ch-3-2', choice_text: 'もう少し待ってください', choice_description: 'まだ決めていない', next_chapter_id: 'ch-3-3', display_order: 2 },
    ],
  });

  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-3-3',
      story_id: '3',
      chapter_number: 3,
      depth_level: 2,
      content: '料理が来ました。いただきます！\n\nあなたはレストランで注文ができました。',
      content_with_ruby: '<ruby>料理<rt>りょうり</rt></ruby>が<ruby>来<rt>き</rt></ruby>ました。いただきます！\n\nあなたはレストランで<ruby>注文<rt>ちゅうもん</rt></ruby>ができました。',
      translation: 'The food arrived. Let\'s eat!\n\nYou successfully ordered at a restaurant.',
      vocabulary: {
        create: [
          { word: '料理', reading: 'りょうり', meanings: { en: 'cooking, dish' }, example: '料理を作ります。' },
          { word: 'いただきます', reading: 'いただきます', meanings: { en: 'expression before meal' }, example: 'いただきます。' },
        ],
      },
    },
  });

  console.log('✓ Story 3 chapters created');
}

async function addChaptersStory4() {
  console.log('Adding chapters for Story 4: 友達と約束...');

  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-4-1',
      story_id: '4',
      chapter_number: 1,
      depth_level: 0,
      content: '友達から電話がかかってきました。',
      content_with_ruby: '<ruby>友達<rt>ともだち</rt></ruby>から<ruby>電話<rt>でんわ</rt></ruby>がかかってきました。',
      translation: 'Your friend called you.',
      vocabulary: {
        create: [
          { word: '電話', reading: 'でんわ', meanings: { en: 'phone, telephone' }, example: '電話をかけます。' },
          { word: 'かかる', reading: 'かかる', meanings: { en: 'to call (phone)' }, example: '電話がかかってきました。' },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-4-1-a', chapter_id: 'ch-4-1', choice_text: 'もしもし！', choice_description: '電話に出る', next_chapter_id: 'ch-4-2', display_order: 1 },
    ],
  });

  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-4-2',
      story_id: '4',
      parent_chapter_id: 'ch-4-1',
      chapter_number: 2,
      depth_level: 1,
      content: '友達：週末、映画を見に行かない？',
      content_with_ruby: '<ruby>友達<rt>ともだち</rt></ruby>：<ruby>週末<rt>しゅうまつ</rt></ruby>、<ruby>映画<rt>えいが</rt></ruby>を<ruby>見<rt>み</rt></ruby>に<ruby>行<rt>い</rt></ruby>かない？',
      translation: 'Friend: Want to go see a movie this weekend?',
      vocabulary: {
        create: [
          { word: '週末', reading: 'しゅうまつ', meanings: { en: 'weekend' }, example: '週末は休みです。' },
          { word: '映画', reading: 'えいが', meanings: { en: 'movie' }, example: '映画を見ます。' },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-4-2-a', chapter_id: 'ch-4-2', choice_text: 'いいね！行こう！', choice_description: '誘いを受ける', next_chapter_id: 'ch-4-3', display_order: 1 },
      { choice_id: 'choice-4-2-b', chapter_id: 'ch-4-2', choice_text: 'ごめん、用事があるんだ', choice_description: '丁寧に断る', next_chapter_id: 'ch-4-4', display_order: 2 },
    ],
  });

  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-4-3',
      story_id: '4',
      parent_chapter_id: 'ch-4-2',
      chapter_number: 3,
      depth_level: 2,
      content: '友達：じゃあ、土曜日の3時に駅で会おう！\n\nあなたは友達と約束ができました。',
      content_with_ruby: '<ruby>友達<rt>ともだち</rt></ruby>：じゃあ、<ruby>土曜日<rt>どようび</rt></ruby>の3<ruby>時<rt>じ</rt></ruby>に<ruby>駅<rt>えき</rt></ruby>で<ruby>会<rt>あ</rt></ruby>おう！\n\nあなたは<ruby>友達<rt>ともだち</rt></ruby>と<ruby>約束<rt>やくそく</rt></ruby>ができました。',
      translation: "Friend: Then let's meet at the station at 3pm on Saturday!\n\nYou made plans with your friend.",
      vocabulary: {
        create: [
          { word: '土曜日', reading: 'どようび', meanings: { en: 'Saturday' }, example: '土曜日に会いましょう。' },
          { word: '駅', reading: 'えき', meanings: { en: 'station' }, example: '駅で待っています。' },
        ],
      },
    },
  });

  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-4-4',
      story_id: '4',
      parent_chapter_id: 'ch-4-2',
      chapter_number: 4,
      depth_level: 2,
      content: '友達：そっか。また今度誘うね！\n\nあなたは丁寧に断ることができました。',
      content_with_ruby: '<ruby>友達<rt>ともだち</rt></ruby>：そっか。また<ruby>今度<rt>こんど</rt></ruby><ruby>誘<rt>さそ</rt></ruby>うね！\n\nあなたは<ruby>丁寧<rt>ていねい</rt></ruby>に<ruby>断<rt>ことわ</rt></ruby>ることができました。',
      translation: 'Friend: I see. I\'ll invite you again next time!\n\nYou politely declined.',
      vocabulary: {
        create: [
          { word: '今度', reading: 'こんど', meanings: { en: 'next time' }, example: '今度会いましょう。' },
          { word: '誘う', reading: 'さそう', meanings: { en: 'to invite' }, example: '友達を誘います。' },
        ],
      },
    },
  });

  console.log('✓ Story 4 chapters created');
}

async function addChaptersStory5() {
  console.log('Adding chapters for Story 5: 就職面接...');

  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-5-1',
      story_id: '5',
      chapter_number: 1,
      depth_level: 0,
      content: '面接会場に到着しました。受付で名前を伝えます。',
      content_with_ruby: '<ruby>面接<rt>めんせつ</rt></ruby><ruby>会場<rt>かいじょう</rt></ruby>に<ruby>到着<rt>とうちゃく</rt></ruby>しました。<ruby>受付<rt>うけつけ</rt></ruby>で<ruby>名前<rt>なまえ</rt></ruby>を<ruby>伝<rt>つた</rt></ruby>えます。',
      translation: 'You arrived at the interview venue. You tell your name at the reception.',
      vocabulary: {
        create: [
          { word: '面接', reading: 'めんせつ', meanings: { en: 'interview' }, example: '面接を受けます。' },
          { word: '受付', reading: 'うけつけ', meanings: { en: 'reception' }, example: '受付で待っています。' },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-5-1-a', chapter_id: 'ch-5-1', choice_text: '本日面接をお願いしているジョンです', choice_description: '丁寧に挨拶', next_chapter_id: 'ch-5-2', display_order: 1 },
    ],
  });

  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-5-2',
      story_id: '5',
      parent_chapter_id: 'ch-5-1',
      chapter_number: 2,
      depth_level: 1,
      content: '面接官：志望動機を教えていただけますか？',
      content_with_ruby: '<ruby>面接官<rt>めんせつかん</rt></ruby>：<ruby>志望動機<rt>しぼうどうき</rt></ruby>を<ruby>教<rt>おし</rt></ruby>えていただけますか？',
      translation: 'Interviewer: Could you tell us your motivation for applying?',
      vocabulary: {
        create: [
          { word: '志望動機', reading: 'しぼうどうき', meanings: { en: 'reason for application' }, example: '志望動機を書きます。' },
          { word: '教える', reading: 'おしえる', meanings: { en: 'to tell, to teach' }, example: '道を教えます。' },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-5-2-a', chapter_id: 'ch-5-2', choice_text: '御社の理念に共感しました', choice_description: '会社の理念について話す', next_chapter_id: 'ch-5-3', display_order: 1 },
      { choice_id: 'choice-5-2-b', chapter_id: 'ch-5-2', choice_text: '成長できる環境だと思いました', choice_description: '成長について話す', next_chapter_id: 'ch-5-3', display_order: 2 },
    ],
  });

  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-5-3',
      story_id: '5',
      chapter_number: 3,
      depth_level: 2,
      content: '面接官：ありがとうございます。本日はこれで終わります。\n\nあなたは面接を完了しました。',
      content_with_ruby: '<ruby>面接官<rt>めんせつかん</rt></ruby>：ありがとうございます。<ruby>本日<rt>ほんじつ</rt></ruby>はこれで<ruby>終<rt>お</rt></ruby>わります。\n\nあなたは<ruby>面接<rt>めんせつ</rt></ruby>を<ruby>完了<rt>かんりょう</rt></ruby>しました。',
      translation: 'Interviewer: Thank you. That concludes today\'s interview.\n\nYou completed the interview.',
      vocabulary: {
        create: [
          { word: '本日', reading: 'ほんじつ', meanings: { en: 'today (formal)' }, example: '本日はありがとうございます。' },
          { word: '終わる', reading: 'おわる', meanings: { en: 'to end' }, example: '授業が終わりました。' },
        ],
      },
    },
  });

  console.log('✓ Story 5 chapters created');
}

async function addChaptersStory6() {
  console.log('Adding chapters for Story 6: 文化祭の準備...');

  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-6-1',
      story_id: '6',
      chapter_number: 1,
      depth_level: 0,
      content: '文化祭でクラスの出店を準備しています。何をしますか？',
      content_with_ruby: '<ruby>文化祭<rt>ぶんかさい</rt></ruby>でクラスの<ruby>出店<rt>でみせ</rt></ruby>を<ruby>準備<rt>じゅんび</rt></ruby>しています。<ruby>何<rt>なに</rt></ruby>をしますか？',
      translation: 'You are preparing your class booth for the cultural festival. What will you do?',
      vocabulary: {
        create: [
          { word: '文化祭', reading: 'ぶんかさい', meanings: { en: 'cultural festival' }, example: '文化祭で出店を出します。' },
          { word: '準備', reading: 'じゅんび', meanings: { en: 'preparation' }, example: '準備をします。' },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-6-1-a', chapter_id: 'ch-6-1', choice_text: '買い物を担当する', choice_description: '材料を買いに行く', next_chapter_id: 'ch-6-2', display_order: 1 },
      { choice_id: 'choice-6-1-b', chapter_id: 'ch-6-1', choice_text: '装飾を担当する', choice_description: '教室を飾る', next_chapter_id: 'ch-6-2', display_order: 2 },
    ],
  });

  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-6-2',
      story_id: '6',
      parent_chapter_id: 'ch-6-1',
      chapter_number: 2,
      depth_level: 1,
      content: 'クラスメイト：役割分担を決めておいた方がいいと思います。',
      content_with_ruby: 'クラスメイト：<ruby>役割分担<rt>やくわりぶんたん</rt></ruby>を<ruby>決<rt>き</rt></ruby>めておいた<ruby>方<rt>ほう</rt></ruby>がいいと<ruby>思<rt>おも</rt></ruby>います。',
      translation: 'Classmate: I think we should decide on role assignments.',
      vocabulary: {
        create: [
          { word: '役割', reading: 'やくわり', meanings: { en: 'role, duty' }, example: '役割を決めます。' },
          { word: '決める', reading: 'きめる', meanings: { en: 'to decide' }, example: '予定を決めます。' },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-6-2-a', chapter_id: 'ch-6-2', choice_text: 'そうですね、その方が効率的ですね', choice_description: '賛成する', next_chapter_id: 'ch-6-3', display_order: 1 },
    ],
  });

  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-6-3',
      story_id: '6',
      chapter_number: 3,
      depth_level: 2,
      content: 'みんなで協力して準備を進めました。文化祭が楽しみです！\n\nあなたは文化祭の準備を完了しました。',
      content_with_ruby: 'みんなで<ruby>協力<rt>きょうりょく</rt></ruby>して<ruby>準備<rt>じゅんび</rt></ruby>を<ruby>進<rt>すす</rt></ruby>めました。<ruby>文化祭<rt>ぶんかさい</rt></ruby>が<ruby>楽<rt>たの</rt></ruby>しみです！\n\nあなたは<ruby>文化祭<rt>ぶんかさい</rt></ruby>の<ruby>準備<rt>じゅんび</rt></ruby>を<ruby>完了<rt>かんりょう</rt></ruby>しました。',
      translation: 'Everyone cooperated to prepare. Looking forward to the festival!\n\nYou completed the cultural festival preparation.',
      vocabulary: {
        create: [
          { word: '協力', reading: 'きょうりょく', meanings: { en: 'cooperation' }, example: '協力してください。' },
          { word: '楽しみ', reading: 'たのしみ', meanings: { en: 'looking forward to' }, example: '明日が楽しみです。' },
        ],
      },
    },
  });

  console.log('✓ Story 6 chapters created');
}

async function addChaptersStory7() {
  console.log('Adding chapters for Story 7: ビジネス会議...');

  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-7-1',
      story_id: '7',
      chapter_number: 1,
      depth_level: 0,
      content: '新製品の企画会議に参加しています。',
      content_with_ruby: '<ruby>新製品<rt>しんせいひん</rt></ruby>の<ruby>企画会議<rt>きかくかいぎ</rt></ruby>に<ruby>参加<rt>さんか</rt></ruby>しています。',
      translation: 'You are participating in a new product planning meeting.',
      vocabulary: {
        create: [
          { word: '新製品', reading: 'しんせいひん', meanings: { en: 'new product' }, example: '新製品を発表します。' },
          { word: '企画', reading: 'きかく', meanings: { en: 'planning' }, example: '企画を立てます。' },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-7-1-a', chapter_id: 'ch-7-1', choice_text: '意見を述べる', choice_description: '積極的に発言', next_chapter_id: 'ch-7-2', display_order: 1 },
      { choice_id: 'choice-7-1-b', chapter_id: 'ch-7-1', choice_text: 'まず聞く', choice_description: '他の人の意見を聞く', next_chapter_id: 'ch-7-2', display_order: 2 },
    ],
  });

  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-7-2',
      story_id: '7',
      parent_chapter_id: 'ch-7-1',
      chapter_number: 2,
      depth_level: 1,
      content: '上司：この企画について、ご意見をお聞かせください。',
      content_with_ruby: '<ruby>上司<rt>じょうし</rt></ruby>：この<ruby>企画<rt>きかく</rt></ruby>について、ご<ruby>意見<rt>いけん</rt></ruby>をお<ruby>聞<rt>き</rt></ruby>かせください。',
      translation: 'Boss: Please share your opinions on this plan.',
      vocabulary: {
        create: [
          { word: '上司', reading: 'じょうし', meanings: { en: 'boss, superior' }, example: '上司に報告します。' },
          { word: '意見', reading: 'いけん', meanings: { en: 'opinion' }, example: '意見を言います。' },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-7-2-a', chapter_id: 'ch-7-2', choice_text: '恐れ入りますが、再考していただけないでしょうか', choice_description: '丁寧に提案', next_chapter_id: 'ch-7-3', display_order: 1 },
    ],
  });

  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-7-3',
      story_id: '7',
      chapter_number: 3,
      depth_level: 2,
      content: '上司：なるほど、貴重なご意見ありがとうございます。\n\nあなたはビジネス会議で意見を述べることができました。',
      content_with_ruby: '<ruby>上司<rt>じょうし</rt></ruby>：なるほど、<ruby>貴重<rt>きちょう</rt></ruby>なご<ruby>意見<rt>いけん</rt></ruby>ありがとうございます。\n\nあなたはビジネス<ruby>会議<rt>かいぎ</rt></ruby>で<ruby>意見<rt>いけん</rt></ruby>を<ruby>述<rt>の</rt></ruby>べることができました。',
      translation: 'Boss: I see, thank you for your valuable opinion.\n\nYou successfully expressed your opinion in a business meeting.',
      vocabulary: {
        create: [
          { word: '貴重', reading: 'きちょう', meanings: { en: 'valuable, precious' }, example: '貴重な時間をありがとうございます。' },
          { word: '述べる', reading: 'のべる', meanings: { en: 'to state, to express' }, example: '意見を述べます。' },
        ],
      },
    },
  });

  console.log('✓ Story 7 chapters created');
}

async function addChaptersStory8() {
  console.log('Adding chapters for Story 8: 部屋探し...');

  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-8-1',
      story_id: '8',
      chapter_number: 1,
      depth_level: 0,
      content: '不動産屋に来ました。希望の条件を伝えます。',
      content_with_ruby: '<ruby>不動産屋<rt>ふどうさんや</rt></ruby>に<ruby>来<rt>き</rt></ruby>ました。<ruby>希望<rt>きぼう</rt></ruby>の<ruby>条件<rt>じょうけん</rt></ruby>を<ruby>伝<rt>つた</rt></ruby>えます。',
      translation: 'You came to a real estate agency. You will tell them your desired conditions.',
      vocabulary: {
        create: [
          { word: '不動産', reading: 'ふどうさん', meanings: { en: 'real estate' }, example: '不動産屋で物件を探します。' },
          { word: '希望', reading: 'きぼう', meanings: { en: 'hope, desire' }, example: '希望を伝えます。' },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-8-1-a', chapter_id: 'ch-8-1', choice_text: '駅から近い物件を探しています', choice_description: '立地を重視', next_chapter_id: 'ch-8-2', display_order: 1 },
      { choice_id: 'choice-8-1-b', chapter_id: 'ch-8-1', choice_text: '安い物件を探しています', choice_description: '家賃を重視', next_chapter_id: 'ch-8-2', display_order: 2 },
    ],
  });

  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-8-2',
      story_id: '8',
      parent_chapter_id: 'ch-8-1',
      chapter_number: 2,
      depth_level: 1,
      content: '不動産屋：駅から徒歩5分圏内でいかがでしょうか？',
      content_with_ruby: '<ruby>不動産屋<rt>ふどうさんや</rt></ruby>：<ruby>駅<rt>えき</rt></ruby>から<ruby>徒歩<rt>とほ</rt></ruby>5<ruby>分圏内<rt>ふんけんない</rt></ruby>でいかがでしょうか？',
      translation: 'Real estate agent: How about within 5 minutes walk from the station?',
      vocabulary: {
        create: [
          { word: '徒歩', reading: 'とほ', meanings: { en: 'on foot, walking' }, example: '徒歩で行きます。' },
          { word: '圏内', reading: 'けんない', meanings: { en: 'within range' }, example: '圏内に住んでいます。' },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-8-2-a', chapter_id: 'ch-8-2', choice_text: 'はい、それでお願いします', choice_description: '条件を受け入れる', next_chapter_id: 'ch-8-3', display_order: 1 },
    ],
  });

  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-8-3',
      story_id: '8',
      chapter_number: 3,
      depth_level: 2,
      content: 'いい物件が見つかりました。契約を進めます。\n\nあなたは部屋探しを完了しました。',
      content_with_ruby: 'いい<ruby>物件<rt>ぶっけん</rt></ruby>が<ruby>見<rt>み</rt></ruby>つかりました。<ruby>契約<rt>けいやく</rt></ruby>を<ruby>進<rt>すす</rt></ruby>めます。\n\nあなたは<ruby>部屋探<rt>へやさが</rt></ruby>しを<ruby>完了<rt>かんりょう</rt></ruby>しました。',
      translation: 'You found a good property. You will proceed with the contract.\n\nYou completed apartment hunting.',
      vocabulary: {
        create: [
          { word: '物件', reading: 'ぶっけん', meanings: { en: 'property' }, example: '物件を探します。' },
          { word: '契約', reading: 'けいやく', meanings: { en: 'contract' }, example: '契約を結びます。' },
        ],
      },
    },
  });

  console.log('✓ Story 8 chapters created');
}

async function addChaptersStory9() {
  console.log('Adding chapters for Story 9: 環境問題についての討論...');

  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-9-1',
      story_id: '9',
      chapter_number: 1,
      depth_level: 0,
      content: 'ゼミで環境問題について討論しています。',
      content_with_ruby: 'ゼミで<ruby>環境問題<rt>かんきょうもんだい</rt></ruby>について<ruby>討論<rt>とうろん</rt></ruby>しています。',
      translation: 'You are debating environmental issues in your seminar.',
      vocabulary: {
        create: [
          { word: '環境', reading: 'かんきょう', meanings: { en: 'environment' }, example: '環境を守ります。' },
          { word: '討論', reading: 'とうろん', meanings: { en: 'debate, discussion' }, example: '討論に参加します。' },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-9-1-a', chapter_id: 'ch-9-1', choice_text: '意見を述べる', choice_description: '積極的に参加', next_chapter_id: 'ch-9-2', display_order: 1 },
    ],
  });

  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-9-2',
      story_id: '9',
      parent_chapter_id: 'ch-9-1',
      chapter_number: 2,
      depth_level: 1,
      content: '教授：環境保護と経済発展は両立し得るものと考えられるが、いかがお考えでしょうか？',
      content_with_ruby: '<ruby>教授<rt>きょうじゅ</rt></ruby>：<ruby>環境保護<rt>かんきょうほご</rt></ruby>と<ruby>経済発展<rt>けいざいはってん</rt></ruby>は<ruby>両立<rt>りょうりつ</rt></ruby>し<ruby>得<rt>う</rt></ruby>るものと<ruby>考<rt>かんが</rt></ruby>えられるが、いかがお<ruby>考<rt>かんが</rt></ruby>えでしょうか？',
      translation: 'Professor: Environmental protection and economic development are thought to be compatible, but what do you think?',
      vocabulary: {
        create: [
          { word: '両立', reading: 'りょうりつ', meanings: { en: 'compatibility, coexistence' }, example: '仕事と家庭を両立します。' },
          { word: '得る', reading: 'うる', meanings: { en: 'can, be possible' }, example: 'あり得ることです。' },
        ],
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      { choice_id: 'choice-9-2-a', chapter_id: 'ch-9-2', choice_text: '技術革新により可能だと思います', choice_description: '肯定的な意見', next_chapter_id: 'ch-9-3', display_order: 1 },
      { choice_id: 'choice-9-2-b', chapter_id: 'ch-9-2', choice_text: '困難ではありますが、努力すべきです', choice_description: '慎重な意見', next_chapter_id: 'ch-9-3', display_order: 2 },
    ],
  });

  await prisma.chapter.create({
    data: {
      chapter_id: 'ch-9-3',
      story_id: '9',
      chapter_number: 3,
      depth_level: 2,
      content: '教授：素晴らしい意見ですね。このような議論を続けることが重要です。\n\nあなたは学術的な討論に参加できました。',
      content_with_ruby: '<ruby>教授<rt>きょうじゅ</rt></ruby>：<ruby>素晴らしい<rt>すばらしい</rt></ruby><ruby>意見<rt>いけん</rt></ruby>ですね。このような<ruby>議論<rt>ぎろん</rt></ruby>を<ruby>続<rt>つづ</rt></ruby>けることが<ruby>重要<rt>じゅうよう</rt></ruby>です。\n\nあなたは<ruby>学術的<rt>がくじゅつてき</rt></ruby>な<ruby>討論<rt>とうろん</rt></ruby>に<ruby>参加<rt>さんか</rt></ruby>できました。',
      translation: 'Professor: Excellent opinion. It is important to continue such discussions.\n\nYou successfully participated in an academic debate.',
      vocabulary: {
        create: [
          { word: '素晴らしい', reading: 'すばらしい', meanings: { en: 'wonderful, excellent' }, example: '素晴らしい意見です。' },
          { word: '重要', reading: 'じゅうよう', meanings: { en: 'important' }, example: 'これは重要です。' },
        ],
      },
    },
  });

  console.log('✓ Story 9 chapters created');
}

addChapters()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
