import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixStory6() {
  console.log('=== Story 6「公園での散歩」の内容を修正 ===\n');

  // Get Story 6
  const story = await prisma.story.findFirst({
    where: { title: '公園での散歩' }
  });

  if (!story) {
    console.log('❌ Story 6 not found!');
    return;
  }

  // Update chapter contents to be about a park walk
  const chapters = [
    {
      num: 1,
      content: `きょうは　いい　てんきです。わたしは　こうえんに　いきます。

こうえんには　きれいな　はなが　たくさん　あります。あかい　はな、きいろい　はな、しろい　はなが　さいています。

とりも　います。ちいさい　とりが　うたを　うたっています。とても　きれいな　こえです。`,
      vocabulary: {
        "こうえん": "park",
        "はな": "flower",
        "さく": "to bloom",
        "とり": "bird",
        "うた": "song"
      }
    },
    {
      num: 2,
      content: `こうえんを　あるきます。みちの　よこに　おおきな　きが　あります。

きの　したで　すこし　やすみます。かぜが　きもちいいです。

こどもたちが　あそんでいます。ボールで　あそんでいます。たのしそうです。`,
      vocabulary: {
        "あるく": "to walk",
        "き": "tree",
        "やすむ": "to rest",
        "かぜ": "wind",
        "あそぶ": "to play"
      }
    },
    {
      num: 3,
      content: `いけが　あります。いけには　さかなが　います。

おおきい　さかなと　ちいさい　さかなが　およいでいます。

ベンチに　すわって　みます。とても　しずかで　いいです。`,
      vocabulary: {
        "いけ": "pond",
        "さかな": "fish",
        "およぐ": "to swim",
        "ベンチ": "bench",
        "しずか": "quiet"
      }
    },
    {
      num: 4,
      content: `こうえんに　ねこが　います。しろい　ねこです。

ねこに　ちかづきます。ねこは　にげません。

ねこを　なでます。ねこは　よろこんでいます。かわいいです。`,
      vocabulary: {
        "ねこ": "cat",
        "ちかづく": "to approach",
        "にげる": "to run away",
        "なでる": "to pet",
        "かわいい": "cute"
      }
    },
    {
      num: 5,
      content: `もう　ゆうがたです。そらが　あかくなりました。

こうえんの　さんぽは　おわりです。とても　たのしかったです。

また　あした　きます。さようなら、こうえん。`,
      vocabulary: {
        "ゆうがた": "evening",
        "そら": "sky",
        "さんぽ": "walk",
        "たのしい": "fun",
        "また": "again"
      }
    }
  ];

  for (const chapterData of chapters) {
    const chapterId = `ch-${story.story_id}-${chapterData.num}`;

    await prisma.chapter.update({
      where: { chapter_id: chapterId },
      data: {
        content: chapterData.content,
        vocabulary: chapterData.vocabulary
      }
    });

    console.log(`✅ Updated Chapter ${chapterData.num}`);
  }

  console.log('\n✅ Story 6 content has been fixed to be about a park walk!');
  await prisma.$disconnect();
}

fixStory6().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
