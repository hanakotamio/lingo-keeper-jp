import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Adding beginner level stories...');

  // ============================================================
  // Beginner Story 1: 初めての挨拶 (A0)
  // ============================================================
  const story10 = await prisma.story.create({
    data: {
      story_id: '20',
      title: '初めての挨拶',
      description: '日本語の基本的な挨拶を学びましょう。こんにちは、ありがとう、さようならなど日常で使う表現を練習します。',
      level_jlpt: 'N5',
      level_cefr: 'A1',
      estimated_time: 5,
      root_chapter_id: 'ch-20-1',
    },
  });

  const chapter10_1 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-20-1',
      story_id: story10.story_id,
      chapter_number: 1,
      depth_level: 0,
      content: '朝、学校に来ました。先生に会いました。何と言いますか？',
      content_with_ruby: '<ruby>朝<rt>あさ</rt></ruby>、<ruby>学校<rt>がっこう</rt></ruby>に<ruby>来<rt>き</rt></ruby>ました。<ruby>先生<rt>せんせい</rt></ruby>に<ruby>会<rt>あ</rt></ruby>いました。<ruby>何<rt>なん</rt></ruby>と<ruby>言<rt>い</rt></ruby>いますか？',
      translation: 'You came to school in the morning. You met your teacher. What do you say?',
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-20-1-a',
        chapter_id: chapter10_1.chapter_id,
        choice_text: 'おはようございます',
        choice_description: '朝の挨拶です。丁寧な言い方です。',
        next_chapter_id: 'ch-20-2',
        display_order: 1,
      },
      {
        choice_id: 'choice-20-1-b',
        chapter_id: chapter10_1.chapter_id,
        choice_text: 'こんにちは',
        choice_description: '昼の挨拶です。',
        next_chapter_id: 'ch-20-2',
        display_order: 2,
      },
    ],
  });

  const chapter10_2 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-20-2',
      story_id: story10.story_id,
      parent_chapter_id: chapter10_1.chapter_id,
      chapter_number: 2,
      depth_level: 1,
      content: '先生が「おはよう」と言いました。友達が消しゴムを貸してくれました。何と言いますか？',
      content_with_ruby: '<ruby>先生<rt>せんせい</rt></ruby>が「おはよう」と<ruby>言<rt>い</rt></ruby>いました。<ruby>友達<rt>ともだち</rt></ruby>が<ruby>消<rt>け</rt></ruby>しゴムを<ruby>貸<rt>か</rt></ruby>してくれました。<ruby>何<rt>なん</rt></ruby>と<ruby>言<rt>い</rt></ruby>いますか？',
      translation: 'The teacher said "Good morning." A friend lent you an eraser. What do you say?',
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-20-2-a',
        chapter_id: chapter10_2.chapter_id,
        choice_text: 'ありがとう',
        choice_description: 'お礼を言います。',
        next_chapter_id: 'ch-20-3',
        display_order: 1,
      },
      {
        choice_id: 'choice-20-2-b',
        chapter_id: chapter10_2.chapter_id,
        choice_text: 'ありがとうございます',
        choice_description: '丁寧なお礼の言い方です。',
        next_chapter_id: 'ch-20-3',
        display_order: 2,
      },
    ],
  });

  const chapter10_3 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-20-3',
      story_id: story10.story_id,
      parent_chapter_id: chapter10_2.chapter_id,
      chapter_number: 3,
      depth_level: 2,
      content: '学校が終わりました。先生と友達に何と言いますか？',
      content_with_ruby: '<ruby>学校<rt>がっこう</rt></ruby>が<ruby>終<rt>お</rt></ruby>わりました。<ruby>先生<rt>せんせい</rt></ruby>と<ruby>友達<rt>ともだち</rt></ruby>に<ruby>何<rt>なん</rt></ruby>と<ruby>言<rt>い</rt></ruby>いますか？',
      translation: 'School is over. What do you say to the teacher and friends?',
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-20-3-a',
        chapter_id: chapter10_3.chapter_id,
        choice_text: 'さようなら',
        choice_description: '別れの挨拶です。',
        next_chapter_id: null,
        display_order: 1,
      },
      {
        choice_id: 'choice-20-3-b',
        chapter_id: chapter10_3.chapter_id,
        choice_text: 'じゃあね / またね',
        choice_description: 'カジュアルな別れの言葉です。',
        next_chapter_id: null,
        display_order: 2,
      },
    ],
  });

  console.log('Created Story 20: 初めての挨拶');

  // ============================================================
  // Beginner Story 2: 自己紹介をしよう (A0)
  // ============================================================
  const story11 = await prisma.story.create({
    data: {
      story_id: '21',
      title: '自己紹介をしよう',
      description: '名前、年齢、出身を伝える基本的な自己紹介を学びます。初対面の人と話すときに使える表現です。',
      level_jlpt: 'N5',
      level_cefr: 'A1',
      estimated_time: 5,
      root_chapter_id: 'ch-21-1',
    },
  });

  const chapter11_1 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-21-1',
      story_id: story11.story_id,
      chapter_number: 1,
      depth_level: 0,
      content: '新しいクラスの初日です。みんなの前で自己紹介をします。まず何と言いますか？',
      content_with_ruby: '<ruby>新<rt>あたら</rt></ruby>しいクラスの<ruby>初日<rt>しょにち</rt></ruby>です。みんなの<ruby>前<rt>まえ</rt></ruby>で<ruby>自己紹介<rt>じこしょうかい</rt></ruby>をします。まず<ruby>何<rt>なん</rt></ruby>と<ruby>言<rt>い</rt></ruby>いますか？',
      translation: "It's the first day of a new class. You will introduce yourself in front of everyone. What do you say first?",
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-21-1-a',
        chapter_id: chapter11_1.chapter_id,
        choice_text: 'はじめまして',
        choice_description: '初めて会う人への挨拶です。',
        next_chapter_id: 'ch-21-2',
        display_order: 1,
      },
      {
        choice_id: 'choice-21-1-b',
        chapter_id: chapter11_1.chapter_id,
        choice_text: 'こんにちは',
        choice_description: '一般的な挨拶です。',
        next_chapter_id: 'ch-21-2',
        display_order: 2,
      },
    ],
  });

  const chapter11_2 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-21-2',
      story_id: story11.story_id,
      parent_chapter_id: chapter11_1.chapter_id,
      chapter_number: 2,
      depth_level: 1,
      content: '次に名前を伝えます。どう言いますか？',
      content_with_ruby: '<ruby>次<rt>つぎ</rt></ruby>に<ruby>名前<rt>なまえ</rt></ruby>を<ruby>伝<rt>つた</rt></ruby>えます。どう<ruby>言<rt>い</rt></ruby>いますか？',
      translation: 'Next, you tell your name. What do you say?',
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-21-2-a',
        chapter_id: chapter11_2.chapter_id,
        choice_text: '私の名前は〇〇です',
        choice_description: '丁寧な名前の伝え方です。',
        next_chapter_id: 'ch-21-3',
        display_order: 1,
      },
      {
        choice_id: 'choice-21-2-b',
        chapter_id: chapter11_2.chapter_id,
        choice_text: '〇〇と申します',
        choice_description: 'とても丁寧な言い方です。',
        next_chapter_id: 'ch-21-3',
        display_order: 2,
      },
    ],
  });

  const chapter11_3 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-21-3',
      story_id: story11.story_id,
      parent_chapter_id: chapter11_2.chapter_id,
      chapter_number: 3,
      depth_level: 2,
      content: '最後に出身を伝えます。どう言いますか？',
      content_with_ruby: '<ruby>最後<rt>さいご</rt></ruby>に<ruby>出身<rt>しゅっしん</rt></ruby>を<ruby>伝<rt>つた</rt></ruby>えます。どう<ruby>言<rt>い</rt></ruby>いますか？',
      translation: 'Finally, you tell where you are from. What do you say?',
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-21-3-a',
        chapter_id: chapter11_3.chapter_id,
        choice_text: '〇〇から来ました',
        choice_description: '出身地の伝え方です。',
        next_chapter_id: null,
        display_order: 1,
      },
      {
        choice_id: 'choice-21-3-b',
        chapter_id: chapter11_3.chapter_id,
        choice_text: '〇〇出身です',
        choice_description: 'より簡潔な言い方です。',
        next_chapter_id: null,
        display_order: 2,
      },
    ],
  });

  console.log('Created Story 21: 自己紹介をしよう');

  // ============================================================
  // Beginner Story 3: 数を数えよう (A0)
  // ============================================================
  const story12 = await prisma.story.create({
    data: {
      story_id: '22',
      title: '数を数えよう',
      description: '日本語で1から10までの数字を学びます。お店での買い物や日常生活で必要な基本的な数の表現です。',
      level_jlpt: 'N5',
      level_cefr: 'A1',
      estimated_time: 5,
      root_chapter_id: 'ch-22-1',
    },
  });

  const chapter12_1 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-22-1',
      story_id: story12.story_id,
      chapter_number: 1,
      depth_level: 0,
      content: 'コンビニでりんごを買います。店員さんが「いくつですか？」と聞きました。りんごを3つ買いたいです。何と言いますか？',
      content_with_ruby: 'コンビニでりんごを<ruby>買<rt>か</rt></ruby>います。<ruby>店員<rt>てんいん</rt></ruby>さんが「いくつですか？」と<ruby>聞<rt>き</rt></ruby>きました。りんごを3つ<ruby>買<rt>か</rt></ruby>いたいです。<ruby>何<rt>なん</rt></ruby>と<ruby>言<rt>い</rt></ruby>いますか？',
      translation: 'You are buying apples at a convenience store. The clerk asked "How many?" You want to buy 3 apples. What do you say?',
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-22-1-a',
        chapter_id: chapter12_1.chapter_id,
        choice_text: '三つください',
        choice_description: '3つをお願いする言い方です。',
        next_chapter_id: 'ch-22-2',
        display_order: 1,
      },
      {
        choice_id: 'choice-22-1-b',
        chapter_id: chapter12_1.chapter_id,
        choice_text: '3個ください',
        choice_description: '個数を伝える別の言い方です。',
        next_chapter_id: 'ch-22-2',
        display_order: 2,
      },
    ],
  });

  const chapter12_2 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-22-2',
      story_id: story12.story_id,
      parent_chapter_id: chapter12_1.chapter_id,
      chapter_number: 2,
      depth_level: 1,
      content: 'レジで会計します。店員さんが「全部で500円です」と言いました。500円はいくらですか？',
      content_with_ruby: 'レジで<ruby>会計<rt>かいけい</rt></ruby>します。<ruby>店員<rt>てんいん</rt></ruby>さんが「<ruby>全部<rt>ぜんぶ</rt></ruby>で500<ruby>円<rt>えん</rt></ruby>です」と<ruby>言<rt>い</rt></ruby>いました。500<ruby>円<rt>えん</rt></ruby>はいくらですか？',
      translation: 'You pay at the register. The clerk said "It\'s 500 yen in total." How much is 500 yen?',
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-22-2-a',
        chapter_id: chapter12_2.chapter_id,
        choice_text: 'ごひゃくえん',
        choice_description: '500円の読み方です。',
        next_chapter_id: 'ch-22-3',
        display_order: 1,
      },
      {
        choice_id: 'choice-22-2-b',
        chapter_id: chapter12_2.chapter_id,
        choice_text: 'ごせんえん',
        choice_description: 'これは5000円の読み方です。',
        next_chapter_id: 'ch-22-3',
        display_order: 2,
      },
    ],
  });

  const chapter12_3 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-22-3',
      story_id: story12.story_id,
      parent_chapter_id: chapter12_2.chapter_id,
      chapter_number: 3,
      depth_level: 2,
      content: '1000円を出しました。おつりはいくらですか？（1000円 - 500円 = ?）',
      content_with_ruby: '1000<ruby>円<rt>えん</rt></ruby>を<ruby>出<rt>だ</rt></ruby>しました。おつりはいくらですか？（1000<ruby>円<rt>えん</rt></ruby> - 500<ruby>円<rt>えん</rt></ruby> = ?）',
      translation: 'You gave 1000 yen. How much is the change? (1000 yen - 500 yen = ?)',
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-22-3-a',
        chapter_id: chapter12_3.chapter_id,
        choice_text: '500円（ごひゃくえん）',
        choice_description: '正解です！おつりは500円です。',
        next_chapter_id: null,
        display_order: 1,
      },
      {
        choice_id: 'choice-22-3-b',
        chapter_id: chapter12_3.chapter_id,
        choice_text: '1500円（せんごひゃくえん）',
        choice_description: 'これは足し算の答えです。',
        next_chapter_id: null,
        display_order: 2,
      },
    ],
  });

  console.log('Created Story 22: 数を数えよう');

  // ============================================================
  // Beginner Story 4: 家族を紹介しよう (A0)
  // ============================================================
  const story13 = await prisma.story.create({
    data: {
      story_id: '23',
      title: '家族を紹介しよう',
      description: '家族の呼び方を学びます。父、母、兄弟など、家族について話すときに使う基本的な単語を練習します。',
      level_jlpt: 'N5',
      level_cefr: 'A1',
      estimated_time: 5,
      root_chapter_id: 'ch-23-1',
    },
  });

  const chapter13_1 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-23-1',
      story_id: story13.story_id,
      chapter_number: 1,
      depth_level: 0,
      content: '友達が「家族は何人ですか？」と聞きました。あなたの家族は4人です。父、母、兄、あなたです。何と答えますか？',
      content_with_ruby: '<ruby>友達<rt>ともだち</rt></ruby>が「<ruby>家族<rt>かぞく</rt></ruby>は<ruby>何人<rt>なんにん</rt></ruby>ですか？」と<ruby>聞<rt>き</rt></ruby>きました。あなたの<ruby>家族<rt>かぞく</rt></ruby>は4<ruby>人<rt>にん</rt></ruby>です。<ruby>父<rt>ちち</rt></ruby>、<ruby>母<rt>はは</rt></ruby>、<ruby>兄<rt>あに</rt></ruby>、あなたです。<ruby>何<rt>なん</rt></ruby>と<ruby>答<rt>こた</rt></ruby>えますか？',
      translation: 'A friend asked "How many people are in your family?" Your family has 4 people: father, mother, older brother, and you. What do you answer?',
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-23-1-a',
        chapter_id: chapter13_1.chapter_id,
        choice_text: '4人です',
        choice_description: '家族の人数を答えます。',
        next_chapter_id: 'ch-23-2',
        display_order: 1,
      },
      {
        choice_id: 'choice-23-1-b',
        chapter_id: chapter13_1.chapter_id,
        choice_text: '四人家族です',
        choice_description: 'より詳しい答え方です。',
        next_chapter_id: 'ch-23-2',
        display_order: 2,
      },
    ],
  });

  const chapter13_2 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-23-2',
      story_id: story13.story_id,
      parent_chapter_id: chapter13_1.chapter_id,
      chapter_number: 2,
      depth_level: 1,
      content: '友達が「お父さんは何の仕事をしていますか？」と聞きました。父は会社員です。何と答えますか？',
      content_with_ruby: '<ruby>友達<rt>ともだち</rt></ruby>が「お<ruby>父<rt>とう</rt></ruby>さんは<ruby>何<rt>なん</rt></ruby>の<ruby>仕事<rt>しごと</rt></ruby>をしていますか？」と<ruby>聞<rt>き</rt></ruby>きました。<ruby>父<rt>ちち</rt></ruby>は<ruby>会社員<rt>かいしゃいん</rt></ruby>です。<ruby>何<rt>なん</rt></ruby>と<ruby>答<rt>こた</rt></ruby>えますか？',
      translation: 'A friend asked "What does your father do?" Your father is an office worker. What do you answer?',
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-23-2-a',
        chapter_id: chapter13_2.chapter_id,
        choice_text: '父は会社員です',
        choice_description: '自分の父親について話すときは「父」を使います。',
        next_chapter_id: 'ch-23-3',
        display_order: 1,
      },
      {
        choice_id: 'choice-23-2-b',
        chapter_id: chapter13_2.chapter_id,
        choice_text: '会社で働いています',
        choice_description: '職場を伝える言い方です。',
        next_chapter_id: 'ch-23-3',
        display_order: 2,
      },
    ],
  });

  const chapter13_3 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-23-3',
      story_id: story13.story_id,
      parent_chapter_id: chapter13_2.chapter_id,
      chapter_number: 3,
      depth_level: 2,
      content: '「お兄さんは学生ですか？」と聞かれました。兄は大学生です。何と答えますか？',
      content_with_ruby: '「お<ruby>兄<rt>にい</rt></ruby>さんは<ruby>学生<rt>がくせい</rt></ruby>ですか？」と<ruby>聞<rt>き</rt></ruby>かれました。<ruby>兄<rt>あに</rt></ruby>は<ruby>大学生<rt>だいがくせい</rt></ruby>です。<ruby>何<rt>なん</rt></ruby>と<ruby>答<rt>こた</rt></ruby>えますか？',
      translation: 'You were asked "Is your older brother a student?" Your older brother is a university student. What do you answer?',
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-23-3-a',
        chapter_id: chapter13_3.chapter_id,
        choice_text: 'はい、兄は大学生です',
        choice_description: '自分の兄について話すときは「兄」を使います。',
        next_chapter_id: null,
        display_order: 1,
      },
      {
        choice_id: 'choice-23-3-b',
        chapter_id: chapter13_3.chapter_id,
        choice_text: '大学で勉強しています',
        choice_description: '何をしているかを伝える言い方です。',
        next_chapter_id: null,
        display_order: 2,
      },
    ],
  });

  console.log('Created Story 23: 家族を紹介しよう');

  // ============================================================
  // Beginner Story 5: 好きな食べ物 (A0)
  // ============================================================
  const story14 = await prisma.story.create({
    data: {
      story_id: '24',
      title: '好きな食べ物',
      description: '好きな食べ物について話す表現を学びます。寿司、ラーメン、カレーなど日本の代表的な食べ物の名前も覚えましょう。',
      level_jlpt: 'N5',
      level_cefr: 'A1',
      estimated_time: 5,
      root_chapter_id: 'ch-24-1',
    },
  });

  const chapter14_1 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-24-1',
      story_id: story14.story_id,
      chapter_number: 1,
      depth_level: 0,
      content: 'レストランに来ました。友達が「何が好きですか？」と聞きました。あなたは寿司が好きです。何と答えますか？',
      content_with_ruby: 'レストランに<ruby>来<rt>き</rt></ruby>ました。<ruby>友達<rt>ともだち</rt></ruby>が「<ruby>何<rt>なに</rt></ruby>が<ruby>好<rt>す</rt></ruby>きですか？」と<ruby>聞<rt>き</rt></ruby>きました。あなたは<ruby>寿司<rt>すし</rt></ruby>が<ruby>好<rt>す</rt></ruby>きです。<ruby>何<rt>なん</rt></ruby>と<ruby>答<rt>こた</rt></ruby>えますか？',
      translation: 'You came to a restaurant. A friend asked "What do you like?" You like sushi. What do you answer?',
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-24-1-a',
        chapter_id: chapter14_1.chapter_id,
        choice_text: '寿司が好きです',
        choice_description: '好きなものを伝える基本的な言い方です。',
        next_chapter_id: 'ch-24-2',
        display_order: 1,
      },
      {
        choice_id: 'choice-24-1-b',
        chapter_id: chapter14_1.chapter_id,
        choice_text: '私は寿司が好きです',
        choice_description: '主語を付けた言い方です。',
        next_chapter_id: 'ch-24-2',
        display_order: 2,
      },
    ],
  });

  const chapter14_2 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-24-2',
      story_id: story14.story_id,
      parent_chapter_id: chapter14_1.chapter_id,
      chapter_number: 2,
      depth_level: 1,
      content: 'メニューを見ています。ラーメンとカレーがあります。今日はラーメンが食べたいです。何と言いますか？',
      content_with_ruby: 'メニューを<ruby>見<rt>み</rt></ruby>ています。ラーメンとカレーがあります。<ruby>今日<rt>きょう</rt></ruby>はラーメンが<ruby>食<rt>た</rt></ruby>べたいです。<ruby>何<rt>なん</rt></ruby>と<ruby>言<rt>い</rt></ruby>いますか？',
      translation: 'You are looking at the menu. There are ramen and curry. You want to eat ramen today. What do you say?',
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-24-2-a',
        chapter_id: chapter14_2.chapter_id,
        choice_text: 'ラーメンをください',
        choice_description: '注文するときの言い方です。',
        next_chapter_id: 'ch-24-3',
        display_order: 1,
      },
      {
        choice_id: 'choice-24-2-b',
        chapter_id: chapter14_2.chapter_id,
        choice_text: 'ラーメンにします',
        choice_description: '選択を伝える言い方です。',
        next_chapter_id: 'ch-24-3',
        display_order: 2,
      },
    ],
  });

  const chapter14_3 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-24-3',
      story_id: story14.story_id,
      parent_chapter_id: chapter14_2.chapter_id,
      chapter_number: 3,
      depth_level: 2,
      content: 'ラーメンが来ました。とても美味しいです。友達に何と言いますか？',
      content_with_ruby: 'ラーメンが<ruby>来<rt>き</rt></ruby>ました。とても<ruby>美味<rt>おい</rt></ruby>しいです。<ruby>友達<rt>ともだち</rt></ruby>に<ruby>何<rt>なん</rt></ruby>と<ruby>言<rt>い</rt></ruby>いますか？',
      translation: 'The ramen arrived. It is very delicious. What do you say to your friend?',
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-24-3-a',
        chapter_id: chapter14_3.chapter_id,
        choice_text: 'おいしいです',
        choice_description: '美味しいことを伝えます。',
        next_chapter_id: null,
        display_order: 1,
      },
      {
        choice_id: 'choice-24-3-b',
        chapter_id: chapter14_3.chapter_id,
        choice_text: 'とてもおいしいです',
        choice_description: 'より強調した言い方です。',
        next_chapter_id: null,
        display_order: 2,
      },
    ],
  });

  console.log('Created Story 24: 好きな食べ物');

  // Create quizzes for beginner stories
  console.log('Creating quizzes for beginner stories...');

  // Quiz for Story 20
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-20-1',
      story_id: story10.story_id,
      question_text: '朝、先生に会ったとき、何と言いますか？',
      question_type: 'multiple_choice',
      difficulty_level: 'easy',
      is_ai_generated: false,
      source_text: '基本的な挨拶',
      quiz_choices: {
        create: [
          { choice_text: 'おはようございます', is_correct: true, explanation: '朝の丁寧な挨拶です。' },
          { choice_text: 'こんばんは', is_correct: false, explanation: 'これは夜の挨拶です。' },
          { choice_text: 'おやすみなさい', is_correct: false, explanation: 'これは寝る前の挨拶です。' },
        ],
      },
    },
  });

  // Quiz for Story 21
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-21-1',
      story_id: story11.story_id,
      question_text: '初めて会う人に、自分の名前を伝えるとき、何と言いますか？',
      question_type: 'multiple_choice',
      difficulty_level: 'easy',
      is_ai_generated: false,
      source_text: '自己紹介',
      quiz_choices: {
        create: [
          { choice_text: '私の名前は〇〇です', is_correct: true, explanation: '名前を伝える基本的な表現です。' },
          { choice_text: '〇〇が好きです', is_correct: false, explanation: 'これは好きなものを伝える表現です。' },
          { choice_text: '〇〇に住んでいます', is_correct: false, explanation: 'これは住所を伝える表現です。' },
        ],
      },
    },
  });

  // Quiz for Story 22
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-22-1',
      story_id: story12.story_id,
      question_text: '「300円」は日本語で何と読みますか？',
      question_type: 'multiple_choice',
      difficulty_level: 'easy',
      is_ai_generated: false,
      source_text: '数字の読み方',
      quiz_choices: {
        create: [
          { choice_text: 'さんびゃくえん', is_correct: true, explanation: '300円の正しい読み方です。' },
          { choice_text: 'さんじゅうえん', is_correct: false, explanation: 'これは30円の読み方です。' },
          { choice_text: 'さんぜんえん', is_correct: false, explanation: 'これは3000円の読み方です。' },
        ],
      },
    },
  });

  // Quiz for Story 23
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-23-1',
      story_id: story13.story_id,
      question_text: '他の人に自分の父親のことを話すとき、何と言いますか？',
      question_type: 'multiple_choice',
      difficulty_level: 'easy',
      is_ai_generated: false,
      source_text: '家族の呼び方',
      quiz_choices: {
        create: [
          { choice_text: '父', is_correct: true, explanation: '自分の父親を他人に話すときは「父」を使います。' },
          { choice_text: 'お父さん', is_correct: false, explanation: '「お父さん」は相手の父親や自分の父親を呼ぶときに使います。' },
          { choice_text: 'パパ', is_correct: false, explanation: 'カジュアルすぎます。' },
        ],
      },
    },
  });

  // Quiz for Story 24
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-24-1',
      story_id: story14.story_id,
      question_text: 'レストランで食べ物を注文するとき、何と言いますか？',
      question_type: 'multiple_choice',
      difficulty_level: 'easy',
      is_ai_generated: false,
      source_text: '注文の仕方',
      quiz_choices: {
        create: [
          { choice_text: '〇〇をください', is_correct: true, explanation: '注文するときの基本的な表現です。' },
          { choice_text: '〇〇が好きです', is_correct: false, explanation: 'これは好みを伝える表現です。' },
          { choice_text: '〇〇があります', is_correct: false, explanation: 'これは存在を表す表現です。' },
        ],
      },
    },
  });

  console.log('✅ All 5 beginner stories created successfully!');
  console.log('Stories: 10-初めての挨拶, 11-自己紹介をしよう, 12-数を数えよう, 13-家族を紹介しよう, 14-好きな食べ物');
  console.log('Quizzes: 5 quizzes created');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
