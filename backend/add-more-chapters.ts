import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addMoreChapters() {
  console.log('=== 入門ストーリーにチャプター3-5を追加 ===\n');

  try {
    // Story 11: 自己紹介
    console.log('Story 11「自己紹介」にチャプターを追加中...');

    const ch11_3 = await prisma.chapter.findUnique({ where: { chapter_id: 'ch-11-3' } });
    if (!ch11_3) {
      await prisma.chapter.create({
        data: {
          chapter_id: 'ch-11-3',
          story_id: '11',
          parent_chapter_id: 'ch-11-2',
          chapter_number: 3,
          depth_level: 2,
          content: 'わたしは　学生です。大学で　日本語を　勉強します。日本が　好きです。',
          content_with_ruby: 'わたしは　<ruby>学生<rt>がくせい</rt></ruby>です。<ruby>大学<rt>だいがく</rt></ruby>で　<ruby>日本語<rt>にほんご</rt></ruby>を　<ruby>勉強<rt>べんきょう</rt></ruby>します。<ruby>日本<rt>にほん</rt></ruby>が　<ruby>好<rt>す</rt></ruby>きです。',
          translation: 'I am a student. I study Japanese at university. I like Japan.'
        }
      });
    }

    const ch11_4 = await prisma.chapter.findUnique({ where: { chapter_id: 'ch-11-4' } });
    if (!ch11_4) {
      await prisma.chapter.create({
        data: {
          chapter_id: 'ch-11-4',
          story_id: '11',
          parent_chapter_id: 'ch-11-3',
          chapter_number: 4,
          depth_level: 3,
          content: 'あなたの　趣味は　何ですか？　わたしの　趣味は　音楽です。ギターを　弾きます。',
          content_with_ruby: 'あなたの　<ruby>趣味<rt>しゅみ</rt></ruby>は　<ruby>何<rt>なん</rt></ruby>ですか？　わたしの　<ruby>趣味<rt>しゅみ</rt></ruby>は　<ruby>音楽<rt>おんがく</rt></ruby>です。ギターを　<ruby>弾<rt>ひ</rt></ruby>きます。',
          translation: 'What is your hobby? My hobby is music. I play the guitar.'
        }
      });
    }

    const ch11_5 = await prisma.chapter.findUnique({ where: { chapter_id: 'ch-11-5' } });
    if (!ch11_5) {
      await prisma.chapter.create({
        data: {
          chapter_id: 'ch-11-5',
          story_id: '11',
          parent_chapter_id: 'ch-11-4',
          chapter_number: 5,
          depth_level: 4,
          content: '今日は　ありがとう　ございました。また　会いましょう。さようなら。',
          content_with_ruby: '<ruby>今日<rt>きょう</rt></ruby>は　ありがとう　ございました。また　<ruby>会<rt>あ</rt></ruby>いましょう。さようなら。',
          translation: 'Thank you for today. Let\'s meet again. Goodbye.'
        }
      });
    }

    console.log('✅ Story 11完成\n');

    // Story 13: 数字を数える
    console.log('Story 13「数字を数える」にチャプターを追加中...');

    const ch13_3 = await prisma.chapter.findUnique({ where: { chapter_id: 'ch-13-3' } });
    if (!ch13_3) {
      await prisma.chapter.create({
        data: {
          chapter_id: 'ch-13-3',
          story_id: '13',
          parent_chapter_id: 'ch-13-2',
          chapter_number: 3,
          depth_level: 2,
          content: '１０から　２０まで　数えます。じゅう、じゅういち、じゅうに、じゅうさん。',
          content_with_ruby: '１０から　２０まで　<ruby>数<rt>かぞ</rt></ruby>えます。じゅう、じゅういち、じゅうに、じゅうさん。',
          translation: 'Count from 10 to 20. Ten, eleven, twelve, thirteen.'
        }
      });
    }

    const ch13_4 = await prisma.chapter.findUnique({ where: { chapter_id: 'ch-13-4' } });
    if (!ch13_4) {
      await prisma.chapter.create({
        data: {
          chapter_id: 'ch-13-4',
          story_id: '13',
          parent_chapter_id: 'ch-13-3',
          chapter_number: 4,
          depth_level: 3,
          content: 'これは　いくらですか？　１００円です。安いですね。',
          content_with_ruby: 'これは　いくらですか？　１００<ruby>円<rt>えん</rt></ruby>です。<ruby>安<rt>やす</rt></ruby>いですね。',
          translation: 'How much is this? It\'s 100 yen. That\'s cheap.'
        }
      });
    }

    const ch13_5 = await prisma.chapter.findUnique({ where: { chapter_id: 'ch-13-5' } });
    if (!ch13_5) {
      await prisma.chapter.create({
        data: {
          chapter_id: 'ch-13-5',
          story_id: '13',
          parent_chapter_id: 'ch-13-4',
          chapter_number: 5,
          depth_level: 4,
          content: 'お金を　数えます。１００円、２００円、３００円。ぜんぶで　３００円です。',
          content_with_ruby: 'お<ruby>金<rt>かね</rt></ruby>を　<ruby>数<rt>かぞ</rt></ruby>えます。１００<ruby>円<rt>えん</rt></ruby>、２００<ruby>円<rt>えん</rt></ruby>、３００<ruby>円<rt>えん</rt></ruby>。ぜんぶで　３００<ruby>円<rt>えん</rt></ruby>です。',
          translation: 'Count the money. 100 yen, 200 yen, 300 yen. In total, it\'s 300 yen.'
        }
      });
    }

    console.log('✅ Story 13完成\n');

    // Story 14: 色を覚える
    console.log('Story 14「色を覚える」にチャプターを追加中...');

    const ch14_3 = await prisma.chapter.findUnique({ where: { chapter_id: 'ch-14-3' } });
    if (!ch14_3) {
      await prisma.chapter.create({
        data: {
          chapter_id: 'ch-14-3',
          story_id: '14',
          parent_chapter_id: 'ch-14-2',
          chapter_number: 3,
          depth_level: 2,
          content: '身の　回りの　色を　見ます。木は　緑です。花は　ピンクです。きれいですね。',
          content_with_ruby: '<ruby>身<rt>み</rt></ruby>の　<ruby>回<rt>まわ</rt></ruby>りの　<ruby>色<rt>いろ</rt></ruby>を　<ruby>見<rt>み</rt></ruby>ます。<ruby>木<rt>き</rt></ruby>は　<ruby>緑<rt>みどり</rt></ruby>です。<ruby>花<rt>はな</rt></ruby>は　ピンクです。きれいですね。',
          translation: 'Look at the colors around you. Trees are green. Flowers are pink. They are beautiful.'
        }
      });
    }

    const ch14_4 = await prisma.chapter.findUnique({ where: { chapter_id: 'ch-14-4' } });
    if (!ch14_4) {
      await prisma.chapter.create({
        data: {
          chapter_id: 'ch-14-4',
          story_id: '14',
          parent_chapter_id: 'ch-14-3',
          chapter_number: 4,
          depth_level: 3,
          content: '友達に　聞きます。「好きな　色は　何ですか？」「赤が　好きです」と　言いました。',
          content_with_ruby: '<ruby>友達<rt>ともだち</rt></ruby>に　<ruby>聞<rt>き</rt></ruby>きます。「<ruby>好<rt>す</rt></ruby>きな　<ruby>色<rt>いろ</rt></ruby>は　<ruby>何<rt>なん</rt></ruby>ですか？」「<ruby>赤<rt>あか</rt></ruby>が　<ruby>好<rt>す</rt></ruby>きです」と　<ruby>言<rt>い</rt></ruby>いました。',
          translation: 'Ask your friend. "What is your favorite color?" They said "I like red."'
        }
      });
    }

    const ch14_5 = await prisma.chapter.findUnique({ where: { chapter_id: 'ch-14-5' } });
    if (!ch14_5) {
      await prisma.chapter.create({
        data: {
          chapter_id: 'ch-14-5',
          story_id: '14',
          parent_chapter_id: 'ch-14-4',
          chapter_number: 5,
          depth_level: 4,
          content: '色の　勉強は　楽しいです。赤と　青で　紫に　なります。色は　おもしろいです。',
          content_with_ruby: '<ruby>色<rt>いろ</rt></ruby>の　<ruby>勉強<rt>べんきょう</rt></ruby>は　<ruby>楽<rt>たの</rt></ruby>しいです。<ruby>赤<rt>あか</rt></ruby>と　<ruby>青<rt>あお</rt></ruby>で　<ruby>紫<rt>むらさき</rt></ruby>に　なります。<ruby>色<rt>いろ</rt></ruby>は　おもしろいです。',
          translation: 'Studying colors is fun. Red and blue make purple. Colors are interesting.'
        }
      });
    }

    console.log('✅ Story 14完成\n');

    // Story 15: 家族を紹介する
    console.log('Story 15「家族を紹介する」にチャプターを追加中...');

    const ch15_3 = await prisma.chapter.findUnique({ where: { chapter_id: 'ch-15-3' } });
    if (!ch15_3) {
      await prisma.chapter.create({
        data: {
          chapter_id: 'ch-15-3',
          story_id: '15',
          parent_chapter_id: 'ch-15-2',
          chapter_number: 3,
          depth_level: 2,
          content: '父は　５０歳です。母は　４８歳です。兄は　２２歳です。わたしは　２０歳です。',
          content_with_ruby: '<ruby>父<rt>ちち</rt></ruby>は　５０<ruby>歳<rt>さい</rt></ruby>です。<ruby>母<rt>はは</rt></ruby>は　４８<ruby>歳<rt>さい</rt></ruby>です。<ruby>兄<rt>あに</rt></ruby>は　２２<ruby>歳<rt>さい</rt></ruby>です。わたしは　２０<ruby>歳<rt>さい</rt></ruby>です。',
          translation: 'My father is 50 years old. My mother is 48 years old. My older brother is 22 years old. I am 20 years old.'
        }
      });
    }

    const ch15_4 = await prisma.chapter.findUnique({ where: { chapter_id: 'ch-15-4' } });
    if (!ch15_4) {
      await prisma.chapter.create({
        data: {
          chapter_id: 'ch-15-4',
          story_id: '15',
          parent_chapter_id: 'ch-15-3',
          chapter_number: 4,
          depth_level: 3,
          content: '母は　料理が　好きです。父は　サッカーが　好きです。兄は　ゲームが　好きです。',
          content_with_ruby: '<ruby>母<rt>はは</rt></ruby>は　<ruby>料理<rt>りょうり</rt></ruby>が　<ruby>好<rt>す</rt></ruby>きです。<ruby>父<rt>ちち</rt></ruby>は　サッカーが　<ruby>好<rt>す</rt></ruby>きです。<ruby>兄<rt>あに</rt></ruby>は　ゲームが　<ruby>好<rt>す</rt></ruby>きです。',
          translation: 'My mother likes cooking. My father likes soccer. My older brother likes games.'
        }
      });
    }

    const ch15_5 = await prisma.chapter.findUnique({ where: { chapter_id: 'ch-15-5' } });
    if (!ch15_5) {
      await prisma.chapter.create({
        data: {
          chapter_id: 'ch-15-5',
          story_id: '15',
          parent_chapter_id: 'ch-15-4',
          chapter_number: 5,
          depth_level: 4,
          content: '家族の　写真を　見せます。「これは　わたしの　家族です」。みんな　笑って　います。',
          content_with_ruby: '<ruby>家族<rt>かぞく</rt></ruby>の　<ruby>写真<rt>しゃしん</rt></ruby>を　<ruby>見<rt>み</rt></ruby>せます。「これは　わたしの　<ruby>家族<rt>かぞく</rt></ruby>です」。みんな　<ruby>笑<rt>わら</rt></ruby>って　います。',
          translation: 'Show a family photo. "This is my family." Everyone is smiling.'
        }
      });
    }

    console.log('✅ Story 15完成\n');

    // Story 16: 簡単な買い物
    console.log('Story 16「簡単な買い物」にチャプターを追加中...');

    const ch16_3 = await prisma.chapter.findUnique({ where: { chapter_id: 'ch-16-3' } });
    if (!ch16_3) {
      await prisma.chapter.create({
        data: {
          chapter_id: 'ch-16-3',
          story_id: '16',
          parent_chapter_id: 'ch-16-2',
          chapter_number: 3,
          depth_level: 2,
          content: 'りんごの　値段を　聞きます。「これは　いくらですか？」「１個　１００円です」と　店員さんが　言いました。',
          content_with_ruby: 'りんごの　<ruby>値段<rt>ねだん</rt></ruby>を　<ruby>聞<rt>き</rt></ruby>きます。「これは　いくらですか？」「１<ruby>個<rt>こ</rt></ruby>　１００<ruby>円<rt>えん</rt></ruby>です」と　<ruby>店員<rt>てんいん</rt></ruby>さんが　<ruby>言<rt>い</rt></ruby>いました。',
          translation: 'Ask the price of the apple. "How much is this?" The clerk said "It\'s 100 yen each."'
        }
      });
    }

    const ch16_4 = await prisma.chapter.findUnique({ where: { chapter_id: 'ch-16-4' } });
    if (!ch16_4) {
      await prisma.chapter.create({
        data: {
          chapter_id: 'ch-16-4',
          story_id: '16',
          parent_chapter_id: 'ch-16-3',
          chapter_number: 4,
          depth_level: 3,
          content: 'レジで　お金を　払います。１００円を　出します。店員さんが　「ありがとう　ございます」と　言いました。',
          content_with_ruby: 'レジで　お<ruby>金<rt>かね</rt></ruby>を　<ruby>払<rt>はら</rt></ruby>います。１００<ruby>円<rt>えん</rt></ruby>を　<ruby>出<rt>だ</rt></ruby>します。<ruby>店員<rt>てんいん</rt></ruby>さんが　「ありがとう　ございます」と　<ruby>言<rt>い</rt></ruby>いました。',
          translation: 'Pay at the register. Give 100 yen. The clerk said "Thank you very much."'
        }
      });
    }

    const ch16_5 = await prisma.chapter.findUnique({ where: { chapter_id: 'ch-16-5' } });
    if (!ch16_5) {
      await prisma.chapter.create({
        data: {
          chapter_id: 'ch-16-5',
          story_id: '16',
          parent_chapter_id: 'ch-16-4',
          chapter_number: 5,
          depth_level: 4,
          content: '買い物が　できました。りんごを　もらって　うれしいです。また　来ます。',
          content_with_ruby: '<ruby>買<rt>か</rt></ruby>い<ruby>物<rt>もの</rt></ruby>が　できました。りんごを　もらって　うれしいです。また　<ruby>来<rt>き</rt></ruby>ます。',
          translation: 'Shopping is done. I am happy to get the apple. I will come again.'
        }
      });
    }

    console.log('✅ Story 16完成\n');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addMoreChapters()
  .then(() => {
    console.log('=== すべてのチャプターを追加しました ===');
    process.exit(0);
  })
  .catch((error) => {
    console.error('追加に失敗しました:', error);
    process.exit(1);
  });
