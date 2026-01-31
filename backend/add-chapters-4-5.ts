import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Adding chapters 4 and 5 to beginner stories...');

  // Story 20: 初めての挨拶
  const chapter20_4 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-20-4',
      story_id: '20',
      parent_chapter_id: 'ch-20-2',
      chapter_number: 4,
      depth_level: 2,
      content: 'お昼になりました。友達に会いました。「こんにちは！」と元気に挨拶しました。友達も笑顔で返してくれました。',
      content_with_ruby: '<ruby>昼<rt>ひる</rt></ruby>になりました。<ruby>友達<rt>ともだち</rt></ruby>に<ruby>会<rt>あ</rt></ruby>いました。「こんにちは！」と<ruby>元気<rt>げんき</rt></ruby>に<ruby>挨拶<rt>あいさつ</rt></ruby>しました。<ruby>友達<rt>ともだち</rt></ruby>も<ruby>笑顔<rt>えがお</rt></ruby>で<ruby>返<rt>かえ</rt></ruby>してくれました。',
      translation: 'It became noon. You met your friend. You greeted energetically, "Hello!" Your friend also responded with a smile.',
    }
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-20-4-a',
        chapter_id: chapter20_4.chapter_id,
        choice_text: '一緒に昼ご飯を食べる',
        choice_description: 'Have lunch together',
        next_chapter_id: 'ch-20-5',
        display_order: 1
      },
      {
        choice_id: 'choice-20-4-b',
        chapter_id: chapter20_4.chapter_id,
        choice_text: '教室に戻る',
        choice_description: 'Return to classroom',
        next_chapter_id: 'ch-20-5',
        display_order: 2
      }
    ]
  });

  // Update chapter 3 choices to point to chapter 4
  await prisma.choice.updateMany({
    where: { chapter_id: 'ch-20-3' },
    data: { next_chapter_id: 'ch-20-4' }
  });

  const chapter20_5 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-20-5',
      story_id: '20',
      parent_chapter_id: 'ch-20-4',
      chapter_number: 5,
      depth_level: 3,
      content: '帰る時間になりました。「さようなら、また明日ね！」と言って、みんなと別れました。楽しい一日でした。',
      content_with_ruby: '<ruby>帰<rt>かえ</rt></ruby>る<ruby>時間<rt>じかん</rt></ruby>になりました。「さようなら、また<ruby>明日<rt>あした</rt></ruby>ね！」と<ruby>言<rt>い</rt></ruby>って、みんなと<ruby>別<rt>わか</rt></ruby>れました。<ruby>楽<rt>たの</rt></ruby>しい<ruby>一日<rt>いちにち</rt></ruby>でした。',
      translation: 'It was time to go home. You said "Goodbye, see you tomorrow!" and parted with everyone. It was a fun day.',
    }
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-20-5-a',
        chapter_id: chapter20_5.chapter_id,
        choice_text: 'ストーリー完了',
        choice_description: 'Complete story',
        next_chapter_id: '',
        display_order: 1
      }
    ]
  });

  console.log('✅ Story 20: Added chapters 4 and 5');

  // Story 21: 自己紹介をしよう
  const chapter21_4 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-21-4',
      story_id: '21',
      parent_chapter_id: 'ch-21-2',
      chapter_number: 4,
      depth_level: 2,
      content: 'みんなの前で自己紹介をしました。「私の趣味は音楽を聞くことです。好きなアーティストはたくさんいます。」と言いました。',
      content_with_ruby: 'みんなの<ruby>前<rt>まえ</rt></ruby>で<ruby>自己紹介<rt>じこしょうかい</rt></ruby>をしました。「<ruby>私<rt>わたし</rt></ruby>の<ruby>趣味<rt>しゅみ</rt></ruby>は<ruby>音楽<rt>おんがく</rt></ruby>を<ruby>聞<rt>き</rt></ruby>くことです。<ruby>好<rt>す</rt></ruby>きなアーティストはたくさんいます。」と<ruby>言<rt>い</rt></ruby>いました。',
      translation: 'You introduced yourself in front of everyone. "My hobby is listening to music. I have many favorite artists," you said.',
    }
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-21-4-a',
        chapter_id: chapter21_4.chapter_id,
        choice_text: '好きな歌について話す',
        choice_description: 'Talk about favorite songs',
        next_chapter_id: 'ch-21-5',
        display_order: 1
      },
      {
        choice_id: 'choice-21-4-b',
        chapter_id: chapter21_4.chapter_id,
        choice_text: '他の趣味も紹介する',
        choice_description: 'Introduce other hobbies',
        next_chapter_id: 'ch-21-5',
        display_order: 2
      }
    ]
  });

  await prisma.choice.updateMany({
    where: { chapter_id: 'ch-21-3' },
    data: { next_chapter_id: 'ch-21-4' }
  });

  const chapter21_5 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-21-5',
      story_id: '21',
      parent_chapter_id: 'ch-21-4',
      chapter_number: 5,
      depth_level: 3,
      content: '自己紹介が終わりました。クラスメイトから「よろしくお願いします！」と言われました。新しい友達ができそうです。',
      content_with_ruby: '<ruby>自己紹介<rt>じこしょうかい</rt></ruby>が<ruby>終<rt>お</rt></ruby>わりました。クラスメイトから「よろしくお<ruby>願<rt>ねが</rt></ruby>いします！」と<ruby>言<rt>い</rt></ruby>われました。<ruby>新<rt>あたら</rt></ruby>しい<ruby>友達<rt>ともだち</rt></ruby>ができそうです。',
      translation: 'Your self-introduction is finished. Your classmates said "Nice to meet you!" It looks like you will make new friends.',
    }
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-21-5-a',
        chapter_id: chapter21_5.chapter_id,
        choice_text: 'ストーリー完了',
        choice_description: 'Complete story',
        next_chapter_id: '',
        display_order: 1
      }
    ]
  });

  console.log('✅ Story 21: Added chapters 4 and 5');

  // Story 22: 数を数えよう
  const chapter22_4 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-22-4',
      story_id: '22',
      parent_chapter_id: 'ch-22-2',
      chapter_number: 4,
      depth_level: 2,
      content: '先生が質問しました。「ここに鉛筆が何本ありますか？」「七本です！」と答えました。「正解です！」',
      content_with_ruby: '<ruby>先生<rt>せんせい</rt></ruby>が<ruby>質問<rt>しつもん</rt></ruby>しました。「ここに<ruby>鉛筆<rt>えんぴつ</rt></ruby>が<ruby>何本<rt>なんぼん</rt></ruby>ありますか？」「<ruby>七本<rt>ななほん</rt></ruby>です！」と<ruby>答<rt>こた</rt></ruby>えました。「<ruby>正解<rt>せいかい</rt></ruby>です！」',
      translation: 'The teacher asked a question. "How many pencils are here?" You answered, "Seven!" "Correct!"',
    }
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-22-4-a',
        chapter_id: chapter22_4.chapter_id,
        choice_text: '次の問題に挑戦する',
        choice_description: 'Try the next problem',
        next_chapter_id: 'ch-22-5',
        display_order: 1
      },
      {
        choice_id: 'choice-22-4-b',
        chapter_id: chapter22_4.chapter_id,
        choice_text: '他の数え方を学ぶ',
        choice_description: 'Learn other counting methods',
        next_chapter_id: 'ch-22-5',
        display_order: 2
      }
    ]
  });

  await prisma.choice.updateMany({
    where: { chapter_id: 'ch-22-3' },
    data: { next_chapter_id: 'ch-22-4' }
  });

  const chapter22_5 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-22-5',
      story_id: '22',
      parent_chapter_id: 'ch-22-4',
      chapter_number: 5,
      depth_level: 3,
      content: '今日は一から十までの数字を覚えました。これで買い物や電話番号を言うことができます。とても役に立ちます！',
      content_with_ruby: '<ruby>今日<rt>きょう</rt></ruby>は<ruby>一<rt>いち</rt></ruby>から<ruby>十<rt>じゅう</rt></ruby>までの<ruby>数字<rt>すうじ</rt></ruby>を<ruby>覚<rt>おぼ</rt></ruby>えました。これで<ruby>買<rt>か</rt></ruby>い<ruby>物<rt>もの</rt></ruby>や<ruby>電話番号<rt>でんわばんごう</rt></ruby>を<ruby>言<rt>い</rt></ruby>うことができます。とても<ruby>役<rt>やく</rt></ruby>に<ruby>立<rt>た</rt></ruby>ちます！',
      translation: 'Today you learned numbers from one to ten. Now you can use them for shopping and saying phone numbers. Very useful!',
    }
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-22-5-a',
        chapter_id: chapter22_5.chapter_id,
        choice_text: 'ストーリー完了',
        choice_description: 'Complete story',
        next_chapter_id: '',
        display_order: 1
      }
    ]
  });

  console.log('✅ Story 22: Added chapters 4 and 5');

  // Story 23: 家族を紹介しよう
  const chapter23_4 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-23-4',
      story_id: '23',
      parent_chapter_id: 'ch-23-2',
      chapter_number: 4,
      depth_level: 2,
      content: '「父は会社員です。母は先生です。」と家族の仕事について話しました。みんな興味を持って聞いてくれました。',
      content_with_ruby: '「<ruby>父<rt>ちち</rt></ruby>は<ruby>会社員<rt>かいしゃいん</rt></ruby>です。<ruby>母<rt>はは</rt></ruby>は<ruby>先生<rt>せんせい</rt></ruby>です。」と<ruby>家族<rt>かぞく</rt></ruby>の<ruby>仕事<rt>しごと</rt></ruby>について<ruby>話<rt>はな</rt></ruby>しました。みんな<ruby>興味<rt>きょうみ</rt></ruby>を<ruby>持<rt>も</rt></ruby>って<ruby>聞<rt>き</rt></ruby>いてくれました。',
      translation: '"My father is a company employee. My mother is a teacher," you talked about your family\'s jobs. Everyone listened with interest.',
    }
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-23-4-a',
        chapter_id: chapter23_4.chapter_id,
        choice_text: 'ペットについて話す',
        choice_description: 'Talk about pets',
        next_chapter_id: 'ch-23-5',
        display_order: 1
      },
      {
        choice_id: 'choice-23-4-b',
        chapter_id: chapter23_4.chapter_id,
        choice_text: '兄弟について詳しく話す',
        choice_description: 'Talk more about siblings',
        next_chapter_id: 'ch-23-5',
        display_order: 2
      }
    ]
  });

  await prisma.choice.updateMany({
    where: { chapter_id: 'ch-23-3' },
    data: { next_chapter_id: 'ch-23-4' }
  });

  const chapter23_5 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-23-5',
      story_id: '23',
      parent_chapter_id: 'ch-23-4',
      chapter_number: 5,
      depth_level: 3,
      content: '家族の紹介が終わりました。友達も自分の家族について話してくれました。お互いのことがよくわかりました。',
      content_with_ruby: '<ruby>家族<rt>かぞく</rt></ruby>の<ruby>紹介<rt>しょうかい</rt></ruby>が<ruby>終<rt>お</rt></ruby>わりました。<ruby>友達<rt>ともだち</rt></ruby>も<ruby>自分<rt>じぶん</rt></ruby>の<ruby>家族<rt>かぞく</rt></ruby>について<ruby>話<rt>はな</rt></ruby>してくれました。お<ruby>互<rt>たが</rt></ruby>いのことがよくわかりました。',
      translation: 'Your family introduction is finished. Your friends also talked about their families. You understood each other well.',
    }
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-23-5-a',
        chapter_id: chapter23_5.chapter_id,
        choice_text: 'ストーリー完了',
        choice_description: 'Complete story',
        next_chapter_id: '',
        display_order: 1
      }
    ]
  });

  console.log('✅ Story 23: Added chapters 4 and 5');

  // Story 24: 好きな食べ物
  const chapter24_4 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-24-4',
      story_id: '24',
      parent_chapter_id: 'ch-24-2',
      chapter_number: 4,
      depth_level: 2,
      content: '「デザートは何が好きですか？」と聞かれました。「アイスクリームが大好きです！特にチョコレート味が好きです。」',
      content_with_ruby: '「デザートは<ruby>何<rt>なに</rt></ruby>が<ruby>好<rt>す</rt></ruby>きですか？」と<ruby>聞<rt>き</rt></ruby>かれました。「アイスクリームが<ruby>大好<rt>だいす</rt></ruby>きです！<ruby>特<rt>とく</rt></ruby>にチョコレート<ruby>味<rt>あじ</rt></ruby>が<ruby>好<rt>す</rt></ruby>きです。」',
      translation: '"What dessert do you like?" you were asked. "I love ice cream! I especially like chocolate flavor."',
    }
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-24-4-a',
        chapter_id: chapter24_4.chapter_id,
        choice_text: '好きな飲み物について話す',
        choice_description: 'Talk about favorite drinks',
        next_chapter_id: 'ch-24-5',
        display_order: 1
      },
      {
        choice_id: 'choice-24-4-b',
        chapter_id: chapter24_4.chapter_id,
        choice_text: '嫌いな食べ物を聞かれる',
        choice_description: 'Asked about disliked foods',
        next_chapter_id: 'ch-24-5',
        display_order: 2
      }
    ]
  });

  await prisma.choice.updateMany({
    where: { chapter_id: 'ch-24-3' },
    data: { next_chapter_id: 'ch-24-4' }
  });

  const chapter24_5 = await prisma.chapter.create({
    data: {
      chapter_id: 'ch-24-5',
      story_id: '24',
      parent_chapter_id: 'ch-24-4',
      chapter_number: 5,
      depth_level: 3,
      content: '食べ物の話で盛り上がりました。「今度、一緒にレストランに行きましょう！」と友達が言いました。楽しみです！',
      content_with_ruby: '<ruby>食<rt>た</rt></ruby>べ<ruby>物<rt>もの</rt></ruby>の<ruby>話<rt>はなし</rt></ruby>で<ruby>盛<rt>も</rt></ruby>り<ruby>上<rt>あ</rt></ruby>がりました。「<ruby>今度<rt>こんど</rt></ruby>、<ruby>一緒<rt>いっしょ</rt></ruby>にレストランに<ruby>行<rt>い</rt></ruby>きましょう！」と<ruby>友達<rt>ともだち</rt></ruby>が<ruby>言<rt>い</rt></ruby>いました。<ruby>楽<rt>たの</rt></ruby>しみです！',
      translation: 'The food conversation was lively. "Let\'s go to a restaurant together next time!" your friend said. Looking forward to it!',
    }
  });

  await prisma.choice.createMany({
    data: [
      {
        choice_id: 'choice-24-5-a',
        chapter_id: chapter24_5.chapter_id,
        choice_text: 'ストーリー完了',
        choice_description: 'Complete story',
        next_chapter_id: '',
        display_order: 1
      }
    ]
  });

  console.log('✅ Story 24: Added chapters 4 and 5');

  // Verify all stories now have 5 chapters
  console.log('\n=== Verification ===');
  for (let i = 20; i <= 24; i++) {
    const chapters = await prisma.chapter.findMany({
      where: { story_id: String(i) },
      orderBy: { chapter_number: 'asc' }
    });
    console.log(`Story ${i}: ${chapters.length} chapters`);
  }
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
