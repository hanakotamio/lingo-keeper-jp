import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to create story choices
async function createStoryChoices(storyNum: number, ch1Id: string) {
  return prisma.choice.createMany({
    data: [
      {
        choice_id: `choice-${storyNum}-1-a`,
        chapter_id: ch1Id,
        choice_text: getChoice1Text(storyNum),
        choice_description: getChoice1Desc(storyNum),
        next_chapter_id: `ch-${storyNum}-2a`,
        display_order: 1,
      },
      {
        choice_id: `choice-${storyNum}-1-b`,
        chapter_id: ch1Id,
        choice_text: getChoice2Text(storyNum),
        choice_description: getChoice2Desc(storyNum),
        next_chapter_id: `ch-${storyNum}-2b`,
        display_order: 2,
      },
      {
        choice_id: `choice-${storyNum}-1-c`,
        chapter_id: ch1Id,
        choice_text: getChoice3Text(storyNum),
        choice_description: getChoice3Desc(storyNum),
        next_chapter_id: `ch-${storyNum}-2c`,
        display_order: 3,
      },
    ],
  });
}

// Helper functions for choice texts (to keep the code DRY)
function getChoice1Text(num: number): string {
  const texts: Record<number, string> = {
    1: 'カフェで休憩する',
    2: '話しかける',
    3: '和食を選ぶ',
    4: '電車で行く',
    5: '日本人の友達と話す',
    6: '図書館で勉強する',
    7: '伝統的な部屋を選ぶ',
    8: '日本語で質問する',
    9: '茶道を体験する',
  };
  return texts[num] || '選択肢A';
}

function getChoice1Desc(num: number): string {
  const descs: Record<number, string> = {
    1: '疲れたので、近くのカフェで一休みして、ゆっくり考えましょう。',
    2: '勇気を出して、隣の人に話しかけてみます。',
    3: '伝統的な和食を食べてみたいです。',
    4: '電車で移動して、途中の景色を楽しみます。',
    5: '日本人の友達と日本語で会話を楽しみます。',
    6: '静かな図書館で集中して勉強します。',
    7: '和室の伝統的な雰囲気を体験したいです。',
    8: '日本語の練習のために日本語で話します。',
    9: '日本の伝統文化を体験します。',
  };
  return descs[num] || '選択肢Aの説明';
}

function getChoice2Text(num: number): string {
  const texts: Record<number, string> = {
    1: '観光スポットを探す',
    2: '本を読む',
    3: '洋食を選ぶ',
    4: 'タクシーで行く',
    5: 'メールで連絡する',
    6: 'カフェで勉強する',
    7: '現代的な部屋を選ぶ',
    8: '英語で質問する',
    9: '料理教室に参加する',
  };
  return texts[num] || '選択肢B';
}

function getChoice2Desc(num: number): string {
  const descs: Record<number, string> = {
    1: 'せっかく渋谷に来たので、有名な観光地を訪れてみたいです。',
    2: '静かに自分の時間を楽しみます。持ってきた本を読みます。',
    3: '洋食も美味しそうです。',
    4: 'タクシーで快適に移動します。',
    5: 'メールで丁寧に連絡します。',
    6: 'カフェでリラックスしながら勉強します。',
    7: '現代的で快適な部屋が良いです。',
    8: '確実に伝わるように英語を使います。',
    9: '日本料理の作り方を学びます。',
  };
  return descs[num] || '選択肢Bの説明';
}

function getChoice3Text(num: number): string {
  const texts: Record<number, string> = {
    1: 'アパートへ直行する',
    2: 'スマホを見る',
    3: 'イタリアンを選ぶ',
    4: 'バスで行く',
    5: '直接会いに行く',
    6: '公園で勉強する',
    7: '和洋室を選ぶ',
    8: 'ジェスチャーで伝える',
    9: '着物を着る',
  };
  return texts[num] || '選択肢C';
}

function getChoice3Desc(num: number): string {
  const descs: Record<number, string> = {
    1: '荷物が重いので、まず新しいアパートに向かって荷物を置きたいです。',
    2: 'スマホで日本語のニュースを読んで、勉強します。',
    3: 'イタリアンも食べたいです。',
    4: 'バスでゆっくり移動します。',
    5: '直接会って話をします。',
    6: '自然の中でリフレッシュしながら勉強します。',
    7: '両方の良さを楽しめる部屋にします。',
    8: '身振り手振りでコミュニケーションします。',
    9: '伝統的な日本の衣装を体験します。',
  };
  return descs[num] || '選択肢Cの説明';
}

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

  await createStoryChoices(1, chapter1_1.chapter_id);

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

  // Add choices for Story 1
  await prisma.choice.createMany({
    data: [
      // Ch2 to Ch3
      { choice_id: 'choice-1-2a-to-3a', chapter_id: 'ch-1-2a', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-1-3a', display_order: 1 },
      { choice_id: 'choice-1-2b-to-3b', chapter_id: 'ch-1-2b', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-1-3b', display_order: 1 },
      { choice_id: 'choice-1-2c-to-3c', chapter_id: 'ch-1-2c', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-1-3c', display_order: 1 },
      // Ch3 to Ch4
      { choice_id: 'choice-1-3a-to-4', chapter_id: 'ch-1-3a', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-1-4', display_order: 1 },
      { choice_id: 'choice-1-3b-to-4', chapter_id: 'ch-1-3b', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-1-4', display_order: 1 },
      { choice_id: 'choice-1-3c-to-4', chapter_id: 'ch-1-3c', choice_text: '次へ進む', choice_description: 'ストーリーを続けます。', next_chapter_id: 'ch-1-4', display_order: 1 },
      // Ch4 to Ch5
      { choice_id: 'choice-1-4-to-5', chapter_id: 'ch-1-4', choice_text: '次へ進む', choice_description: 'ストーリーを完結させます。', next_chapter_id: 'ch-1-5', display_order: 1 },
    ],
  });

  console.log('Created Story 1 (東京での新しい生活) with 5 chapters and branching structure');

  console.log('Database seeding completed successfully!');
  console.log('Note: This is a template file. Complete stories 2-9 following the same pattern.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
