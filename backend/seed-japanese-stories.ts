/**
 * Seed Japanese learning stories for English speakers
 * Story content is in Japanese with English translations
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env.local' });
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with Japanese learning stories...\n');

  // Story 1: Shopping at the Supermarket (N5/A1)
  await prisma.story.create({
    data: {
      story_id: '1',
      title: 'Shopping at the Supermarket',
      description: 'Learn basic shopping vocabulary and expressions in Japanese.',
      category: 'daily_life',
      difficulty_level: 'N5',
      level_jlpt: 'N5',
      level_cefr: 'A1',
      estimated_time: 10,
      estimated_duration_minutes: 10,
      root_chapter_id: 'chapter-1-1',
      is_active: true,
    },
  });

  await prisma.chapter.create({
    data: {
      chapter_id: 'chapter-1-1',
      story_id: '1',
      chapter_number: 1,
      title: 'At the Supermarket',
      content: 'あなたはスーパーマーケットにいます。今日は何を買いたいですか？\n\n(You are at the supermarket. What do you want to buy today?)',
      audio_url: null,
      learning_points: {
        points: [
          'Basic question form: 何を〜ますか (What do you...?)',
          'Shopping locations vocabulary',
          'Expressing wants with 〜たい'
        ]
      },
      vocabulary: {
        words: [
          { word: 'スーパーマーケット', reading: 'すーぱーまーけっと', meaning: 'supermarket' },
          { word: '今日', reading: 'きょう', meaning: 'today' },
          { word: '何', reading: 'なに', meaning: 'what' },
          { word: '買う', reading: 'かう', meaning: 'to buy' }
        ]
      },
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        chapter_id: 'chapter-1-1',
        choice_text: 'くだものと野菜を買います (Buy fruits and vegetables)',
        next_chapter_id: 'chapter-1-2',
        difficulty_adjustment: 0,
        ending_type: null,
      },
      {
        chapter_id: 'chapter-1-1',
        choice_text: '肉と魚を買います (Buy meat and fish)',
        next_chapter_id: 'chapter-1-3',
        difficulty_adjustment: 0,
        ending_type: null,
      },
    ],
  });

  await prisma.chapter.create({
    data: {
      chapter_id: 'chapter-1-2',
      story_id: '1',
      chapter_number: 2,
      title: 'Produce Section',
      content: '新鮮なくだものと野菜がたくさんあります。りんごとトマトを選びました。\n\n(There are many fresh fruits and vegetables. You chose apples and tomatoes.)',
      audio_url: null,
      learning_points: {
        points: [
          'Adjectives: 新鮮な (fresh)',
          'Quantity: たくさん (many/a lot)',
          'Basic food vocabulary'
        ]
      },
      vocabulary: {
        words: [
          { word: '新鮮', reading: 'しんせん', meaning: 'fresh' },
          { word: 'くだもの', reading: 'くだもの', meaning: 'fruit' },
          { word: '野菜', reading: 'やさい', meaning: 'vegetables' },
          { word: 'りんご', reading: 'りんご', meaning: 'apple' },
          { word: 'トマト', reading: 'とまと', meaning: 'tomato' }
        ]
      },
    },
  });

  await prisma.chapter.create({
    data: {
      chapter_id: 'chapter-1-3',
      story_id: '1',
      chapter_number: 3,
      title: 'Meat and Fish Section',
      content: '肉と魚のコーナーに来ました。鶏肉とサーモンを買います。\n\n(You came to the meat and fish section. You will buy chicken and salmon.)',
      audio_url: null,
      learning_points: {
        points: [
          'Location particle: に (to/at)',
          'Food types vocabulary',
          'Verb: 来る (to come)'
        ]
      },
      vocabulary: {
        words: [
          { word: '肉', reading: 'にく', meaning: 'meat' },
          { word: '魚', reading: 'さかな', meaning: 'fish' },
          { word: '鶏肉', reading: 'とりにく', meaning: 'chicken' },
          { word: 'サーモン', reading: 'さーもん', meaning: 'salmon' },
          { word: 'コーナー', reading: 'こーなー', meaning: 'section/corner' }
        ]
      },
    },
  });

  await prisma.chapter.createMany({
    data: [
      {
        chapter_id: 'chapter-1-4',
        story_id: '1',
        chapter_number: 4,
        title: 'Checkout',
        content: 'レジで支払いをしました。ありがとうございました！\n\n(You paid at the register. Thank you!)',
        audio_url: null,
        learning_points: {
          points: [
            'Past tense: 〜ました (did)',
            'Polite expressions: ありがとうございました',
            'Shopping completion'
          ]
        },
        vocabulary: {
          words: [
            { word: 'レジ', reading: 'れじ', meaning: 'cash register' },
            { word: '支払い', reading: 'しはらい', meaning: 'payment' },
            { word: 'ありがとうございました', reading: 'ありがとうございました', meaning: 'thank you (past)' }
          ]
        },
      },
      {
        chapter_id: 'chapter-1-5',
        story_id: '1',
        chapter_number: 5,
        title: 'Checkout',
        content: 'レジで支払いをしました。ありがとうございました！\n\n(You paid at the register. Thank you!)',
        audio_url: null,
        learning_points: {
          points: [
            'Past tense: 〜ました (did)',
            'Polite expressions: ありがとうございました',
            'Shopping completion'
          ]
        },
        vocabulary: {
          words: [
            { word: 'レジ', reading: 'れじ', meaning: 'cash register' },
            { word: '支払い', reading: 'しはらい', meaning: 'payment' }
          ]
        },
      },
    ],
  });

  console.log('✅ Story 1 created: Shopping at the Supermarket');

  // Story 2: Morning Routine (N5/A1)
  await prisma.story.create({
    data: {
      story_id: '2',
      title: 'My Morning Routine',
      description: 'Learn daily routine vocabulary and time expressions.',
      category: 'daily_life',
      difficulty_level: 'N5',
      level_jlpt: 'N5',
      level_cefr: 'A1',
      estimated_time: 8,
      estimated_duration_minutes: 8,
      root_chapter_id: 'chapter-2-1',
      is_active: true,
    },
  });

  await prisma.chapter.createMany({
    data: [
      {
        chapter_id: 'chapter-2-1',
        story_id: '2',
        chapter_number: 1,
        title: 'Waking Up',
        content: 'おはようございます！朝の七時です。今日も一日、がんばりましょう。\n\n(Good morning! It\'s 7 AM. Let\'s do our best today too.)',
        audio_url: null,
        learning_points: {
          points: [
            'Morning greeting: おはようございます',
            'Time expressions: 七時 (7 o\'clock)',
            'Encouragement: がんばりましょう'
          ]
        },
        vocabulary: {
          words: [
            { word: 'おはようございます', reading: 'おはようございます', meaning: 'good morning (polite)' },
            { word: '朝', reading: 'あさ', meaning: 'morning' },
            { word: '七時', reading: 'しちじ', meaning: '7 o\'clock' },
            { word: '今日', reading: 'きょう', meaning: 'today' },
            { word: '一日', reading: 'いちにち', meaning: 'one day/all day' },
            { word: 'がんばる', reading: 'がんばる', meaning: 'to do one\'s best' }
          ]
        },
      },
      {
        chapter_id: 'chapter-2-2',
        story_id: '2',
        chapter_number: 2,
        title: 'Start the Day',
        content: '朝ごはんを食べました。いってきます！\n\n(I ate breakfast. I\'m leaving!)',
        audio_url: null,
        learning_points: {
          points: [
            'Past tense: 食べました (ate)',
            'Leaving home phrase: いってきます',
            'Meal vocabulary'
          ]
        },
        vocabulary: {
          words: [
            { word: '朝ごはん', reading: 'あさごはん', meaning: 'breakfast' },
            { word: '食べる', reading: 'たべる', meaning: 'to eat' },
            { word: 'いってきます', reading: 'いってきます', meaning: 'I\'m leaving (said when leaving home)' }
          ]
        },
      },
    ],
  });

  console.log('✅ Story 2 created: My Morning Routine');

  // Story 3: At a Restaurant (N5/A1)
  await prisma.story.create({
    data: {
      story_id: '3',
      title: 'Eating at a Restaurant',
      description: 'Learn how to order food and interact at restaurants.',
      category: 'daily_life',
      difficulty_level: 'N5',
      level_jlpt: 'N5',
      level_cefr: 'A1',
      estimated_time: 12,
      estimated_duration_minutes: 12,
      root_chapter_id: 'chapter-3-1',
      is_active: true,
    },
  });

  await prisma.chapter.createMany({
    data: [
      {
        chapter_id: 'chapter-3-1',
        story_id: '3',
        chapter_number: 1,
        title: 'Entering',
        content: 'いらっしゃいませ！何名様ですか？\n\n(Welcome! How many people?)',
        audio_url: null,
        learning_points: {
          points: [
            'Restaurant greeting: いらっしゃいませ',
            'Counter for people: 〜名様',
            'Question forms'
          ]
        },
        vocabulary: {
          words: [
            { word: 'いらっしゃいませ', reading: 'いらっしゃいませ', meaning: 'welcome (to a store)' },
            { word: '何名様', reading: 'なんめいさま', meaning: 'how many people (polite)' }
          ]
        },
      },
      {
        chapter_id: 'chapter-3-2',
        story_id: '3',
        chapter_number: 2,
        title: 'Ordering',
        content: 'メニューを見ます。ラーメンとギョーザを注文します。\n\n(Look at the menu. You order ramen and gyoza.)',
        audio_url: null,
        learning_points: {
          points: [
            'Object particle: を (marks direct object)',
            'Verbs: 見る (to look), 注文する (to order)',
            'Food vocabulary'
          ]
        },
        vocabulary: {
          words: [
            { word: 'メニュー', reading: 'めにゅー', meaning: 'menu' },
            { word: '見る', reading: 'みる', meaning: 'to look/see' },
            { word: 'ラーメン', reading: 'らーめん', meaning: 'ramen' },
            { word: 'ギョーザ', reading: 'ぎょーざ', meaning: 'gyoza/dumplings' },
            { word: '注文', reading: 'ちゅうもん', meaning: 'order' }
          ]
        },
      },
    ],
  });

  console.log('✅ Story 3 created: Eating at a Restaurant');

  // Story 4: Taking the Train (N5/A1)
  await prisma.story.create({
    data: {
      story_id: '4',
      title: 'Taking the Train',
      description: 'Navigate the train system with Japanese vocabulary.',
      category: 'transportation',
      difficulty_level: 'N5',
      level_jlpt: 'N5',
      level_cefr: 'A1',
      estimated_time: 10,
      estimated_duration_minutes: 10,
      root_chapter_id: 'chapter-4-1',
      is_active: true,
    },
  });

  await prisma.chapter.createMany({
    data: [
      {
        chapter_id: 'chapter-4-1',
        story_id: '4',
        chapter_number: 1,
        title: 'At the Station',
        content: '駅に着きました。切符を買います。\n\n(Arrived at the station. Buy a ticket.)',
        audio_url: null,
        learning_points: {
          points: [
            'Location particle: に (at/to)',
            'Past tense: 着きました (arrived)',
            'Transportation vocabulary'
          ]
        },
        vocabulary: {
          words: [
            { word: '駅', reading: 'えき', meaning: 'station' },
            { word: '着く', reading: 'つく', meaning: 'to arrive' },
            { word: '切符', reading: 'きっぷ', meaning: 'ticket' },
            { word: '買う', reading: 'かう', meaning: 'to buy' }
          ]
        },
      },
      {
        chapter_id: 'chapter-4-2',
        story_id: '4',
        chapter_number: 2,
        title: 'On the Platform',
        content: 'ホームで電車を待っています。もうすぐ来ます。\n\n(Waiting for the train on the platform. It will come soon.)',
        audio_url: null,
        learning_points: {
          points: [
            'Progressive form: 〜ています (is doing)',
            'Time expression: もうすぐ (soon)',
            'Verb: 待つ (to wait)'
          ]
        },
        vocabulary: {
          words: [
            { word: 'ホーム', reading: 'ほーむ', meaning: 'platform' },
            { word: '電車', reading: 'でんしゃ', meaning: 'train' },
            { word: '待つ', reading: 'まつ', meaning: 'to wait' },
            { word: 'もうすぐ', reading: 'もうすぐ', meaning: 'soon' },
            { word: '来る', reading: 'くる', meaning: 'to come' }
          ]
        },
      },
    ],
  });

  console.log('✅ Story 4 created: Taking the Train');

  // Story 5: Convenience Store (N5/A1)
  await prisma.story.create({
    data: {
      story_id: '5',
      title: 'Convenience Store Visit',
      description: 'Shop at a Japanese convenience store (konbini).',
      category: 'daily_life',
      difficulty_level: 'N5',
      level_jlpt: 'N5',
      level_cefr: 'A1',
      estimated_time: 8,
      estimated_duration_minutes: 8,
      root_chapter_id: 'chapter-5-1',
      is_active: true,
    },
  });

  await prisma.chapter.createMany({
    data: [
      {
        chapter_id: 'chapter-5-1',
        story_id: '5',
        chapter_number: 1,
        title: 'Inside the Konbini',
        content: 'コンビニに入りました。おにぎりと飲み物を買います。\n\n(Entered the convenience store. Buy rice balls and drinks.)',
        audio_url: null,
        learning_points: {
          points: [
            'Past tense: 入りました (entered)',
            'Convenience store vocabulary',
            'Common food items'
          ]
        },
        vocabulary: {
          words: [
            { word: 'コンビニ', reading: 'こんびに', meaning: 'convenience store' },
            { word: '入る', reading: 'はいる', meaning: 'to enter' },
            { word: 'おにぎり', reading: 'おにぎり', meaning: 'rice ball' },
            { word: '飲み物', reading: 'のみもの', meaning: 'drink/beverage' }
          ]
        },
      },
      {
        chapter_id: 'chapter-5-2',
        story_id: '5',
        chapter_number: 2,
        title: 'At the Register',
        content: 'レジに行きます。五百円です。\n\n(Go to the register. It\'s 500 yen.)',
        audio_url: null,
        learning_points: {
          points: [
            'Numbers in Japanese: 五百 (500)',
            'Currency: 円 (yen)',
            'Location particle: に (to)'
          ]
        },
        vocabulary: {
          words: [
            { word: 'レジ', reading: 'れじ', meaning: 'cash register' },
            { word: '行く', reading: 'いく', meaning: 'to go' },
            { word: '五百円', reading: 'ごひゃくえん', meaning: '500 yen' }
          ]
        },
      },
    ],
  });

  console.log('✅ Story 5 created: Convenience Store Visit');

  console.log('\n📊 Seeding Summary:');
  const storiesCount = await prisma.story.count();
  const chaptersCount = await prisma.chapter.count();
  const choicesCount = await prisma.choice.count();

  console.log(`  - Stories: ${storiesCount}`);
  console.log(`  - Chapters: ${chaptersCount}`);
  console.log(`  - Choices: ${choicesCount}`);

  console.log('\n✅ Database seeded successfully with Japanese learning content!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
