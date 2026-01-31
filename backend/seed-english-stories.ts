/**
 * Seed English-only stories for English-speaking learners
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env.local' });
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with English stories...\n');

  // Story 1: Shopping at the Supermarket (N5/A1)
  const story1 = await prisma.story.create({
    data: {
      story_id: '1',
      title: 'Shopping at the Supermarket',
      description: 'Learn basic Japanese shopping vocabulary through a supermarket visit.',
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
      title: 'At the Supermarket Entrance',
      content: 'You are at the supermarket entrance. What section do you want to visit first?',
      audio_url: null,
      learning_points: { points: ['Shopping vocabulary', 'Making choices', 'Basic directions'] },
      vocabulary: { words: [
        { word: 'supermarket', reading: 'スーパーマーケット', meaning: 'grocery store' },
        { word: 'entrance', reading: 'いりぐち', meaning: 'entrance' }
      ]},
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        chapter_id: 'chapter-1-1',
        choice_text: 'Go to the produce section',
        next_chapter_id: 'chapter-1-2',
        difficulty_adjustment: 0,
        ending_type: null,
      },
      {
        chapter_id: 'chapter-1-1',
        choice_text: 'Go to the meat and fish section',
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
      content: 'You see fresh fruits and vegetables. An employee asks: "May I help you?" (いらっしゃいませ)',
      audio_url: null,
      learning_points: { points: ['Fruit names', 'Vegetable names', 'Customer service phrases'] },
      vocabulary: { words: [
        { word: 'fruits', reading: 'くだもの', meaning: 'fruits' },
        { word: 'vegetables', reading: 'やさい', meaning: 'vegetables' },
        { word: 'irasshaimase', reading: 'いらっしゃいませ', meaning: 'welcome (shop greeting)' }
      ]},
    },
  });

  await prisma.chapter.create({
    data: {
      chapter_id: 'chapter-1-3',
      story_id: '1',
      chapter_number: 3,
      title: 'Meat and Fish Section',
      content: 'Fresh meat and seafood are displayed. The butcher greets you: "What would you like today?"',
      audio_url: null,
      learning_points: { points: ['Meat vocabulary', 'Fish vocabulary', 'Asking for quantities'] },
      vocabulary: { words: [
        { word: 'meat', reading: 'にく', meaning: 'meat' },
        { word: 'fish', reading: 'さかな', meaning: 'fish' },
        { word: 'fresh', reading: 'しんせん', meaning: 'fresh' }
      ]},
    },
  });

  await prisma.chapter.createMany({
    data: [
      {
        chapter_id: 'chapter-1-4',
        story_id: '1',
        chapter_number: 4,
        title: 'Checkout',
        content: 'You completed your shopping! The cashier says "Thank you!" (ありがとうございます)',
        audio_url: null,
        learning_points: { points: ['Payment vocabulary', 'Thanking phrases', 'Shopping completion'] },
        vocabulary: { words: [
          { word: 'arigatou gozaimasu', reading: 'ありがとうございます', meaning: 'thank you (polite)' },
          { word: 'checkout', reading: 'レジ', meaning: 'cash register' }
        ]},
      },
      {
        chapter_id: 'chapter-1-5',
        story_id: '1',
        chapter_number: 5,
        title: 'Checkout',
        content: 'You completed your shopping! The cashier says "Thank you!" (ありがとうございます)',
        audio_url: null,
        learning_points: { points: ['Payment vocabulary', 'Thanking phrases', 'Shopping completion'] },
        vocabulary: { words: [
          { word: 'arigatou gozaimasu', reading: 'ありがとうございます', meaning: 'thank you (polite)' }
        ]},
      },
    ],
  });

  console.log('✅ Story 1 created: Shopping at the Supermarket');

  // Story 2: Morning Routine (N5/A1)
  await prisma.story.create({
    data: {
      story_id: '2',
      title: 'My Morning Routine',
      description: 'Learn daily routine vocabulary through a typical Japanese morning.',
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
        content: 'Good morning! The alarm rings at 7:00 AM. Time to start your day!',
        audio_url: null,
        learning_points: { points: ['Morning greetings', 'Time expressions', 'Daily actions'] },
        vocabulary: { words: [
          { word: 'good morning', reading: 'おはよう', meaning: 'good morning' },
          { word: 'alarm', reading: 'めざまし', meaning: 'alarm clock' }
        ]},
      },
      {
        chapter_id: 'chapter-2-2',
        story_id: '2',
        chapter_number: 2,
        title: 'Ready for the Day',
        content: 'You finished getting ready. Have a great day! (いってきます)',
        audio_url: null,
        learning_points: { points: ['Leaving home phrases', 'Daily routine completion'] },
        vocabulary: { words: [
          { word: 'ittekimasu', reading: 'いってきます', meaning: "I'm leaving (said when leaving home)" }
        ]},
      },
    ],
  });

  console.log('✅ Story 2 created: My Morning Routine');

  // Story 3: At a Restaurant (N5/A1)
  await prisma.story.create({
    data: {
      story_id: '3',
      title: 'Eating at a Restaurant',
      description: 'Order food and interact with restaurant staff in Japanese.',
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
        title: 'Entering the Restaurant',
        content: 'Welcome to the restaurant! A waiter greets you: "Welcome! How many people?"',
        audio_url: null,
        learning_points: { points: ['Restaurant greetings', 'Numbers', 'Seating requests'] },
        vocabulary: { words: [
          { word: 'restaurant', reading: 'レストラン', meaning: 'restaurant' },
          { word: 'waiter', reading: 'ウェイター', meaning: 'waiter/waitress' }
        ]},
      },
      {
        chapter_id: 'chapter-3-2',
        story_id: '3',
        chapter_number: 2,
        title: 'Ordering Food',
        content: 'You look at the menu. The waiter asks: "Are you ready to order?"',
        audio_url: null,
        learning_points: { points: ['Food vocabulary', 'Ordering phrases', 'Menu reading'] },
        vocabulary: { words: [
          { word: 'menu', reading: 'メニュー', meaning: 'menu' },
          { word: 'order', reading: 'ちゅうもん', meaning: 'order' }
        ]},
      },
    ],
  });

  console.log('✅ Story 3 created: Eating at a Restaurant');

  // Story 4: Taking the Train (N5/A1)
  await prisma.story.create({
    data: {
      story_id: '4',
      title: 'Taking the Train',
      description: 'Navigate the Japanese train system and learn transportation vocabulary.',
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
        content: 'You arrive at the train station. Where do you want to go today?',
        audio_url: null,
        learning_points: { points: ['Station vocabulary', 'Directions', 'Ticket purchasing'] },
        vocabulary: { words: [
          { word: 'train', reading: 'でんしゃ', meaning: 'train' },
          { word: 'station', reading: 'えき', meaning: 'station' },
          { word: 'ticket', reading: 'きっぷ', meaning: 'ticket' }
        ]},
      },
      {
        chapter_id: 'chapter-4-2',
        story_id: '4',
        chapter_number: 2,
        title: 'On the Platform',
        content: 'You are waiting on the platform. The train is arriving soon!',
        audio_url: null,
        learning_points: { points: ['Platform vocabulary', 'Train announcements', 'Safety'] },
        vocabulary: { words: [
          { word: 'platform', reading: 'ホーム', meaning: 'platform' },
          { word: 'arriving', reading: 'とうちゃく', meaning: 'arrival' }
        ]},
      },
    ],
  });

  console.log('✅ Story 4 created: Taking the Train');

  // Story 5: At a Convenience Store (N5/A1)
  await prisma.story.create({
    data: {
      story_id: '5',
      title: 'Convenience Store Visit',
      description: 'Shop at a Japanese convenience store (konbini) and learn common items.',
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
        content: 'You enter a convenience store. What do you need to buy?',
        audio_url: null,
        learning_points: { points: ['Convenience store items', 'Shopping basics', 'Common products'] },
        vocabulary: { words: [
          { word: 'konbini', reading: 'コンビニ', meaning: 'convenience store' },
          { word: 'onigiri', reading: 'おにぎり', meaning: 'rice ball' },
          { word: 'drink', reading: 'のみもの', meaning: 'drink' }
        ]},
      },
      {
        chapter_id: 'chapter-5-2',
        story_id: '5',
        chapter_number: 2,
        title: 'At the Register',
        content: 'You are ready to pay. The clerk says: "That will be 500 yen, please."',
        audio_url: null,
        learning_points: { points: ['Money vocabulary', 'Payment phrases', 'Numbers'] },
        vocabulary: { words: [
          { word: 'yen', reading: 'えん', meaning: 'yen (Japanese currency)' },
          { word: 'register', reading: 'レジ', meaning: 'cash register' }
        ]},
      },
    ],
  });

  console.log('✅ Story 5 created: Convenience Store Visit');

  // Story 6: Meeting a Friend (N5/A1)
  await prisma.story.create({
    data: {
      story_id: '6',
      title: 'Meeting a Friend',
      description: 'Practice greetings and casual conversation with a friend.',
      category: 'social',
      difficulty_level: 'N5',
      level_jlpt: 'N5',
      level_cefr: 'A1',
      estimated_time: 10,
      estimated_duration_minutes: 10,
      root_chapter_id: 'chapter-6-1',
      is_active: true,
    },
  });

  await prisma.chapter.createMany({
    data: [
      {
        chapter_id: 'chapter-6-1',
        story_id: '6',
        chapter_number: 1,
        title: 'Saying Hello',
        content: 'You see your friend at the park. You wave and say hello!',
        audio_url: null,
        learning_points: { points: ['Casual greetings', 'Friend vocabulary', 'Social interactions'] },
        vocabulary: { words: [
          { word: 'friend', reading: 'ともだち', meaning: 'friend' },
          { word: 'hello (casual)', reading: 'やあ', meaning: 'hey/hi' },
          { word: 'genki', reading: 'げんき', meaning: 'healthy/energetic' }
        ]},
      },
      {
        chapter_id: 'chapter-6-2',
        story_id: '6',
        chapter_number: 2,
        title: 'Chatting',
        content: 'You and your friend chat about your day. What a nice conversation!',
        audio_url: null,
        learning_points: { points: ['Casual conversation', 'Daily activities', 'Expressing feelings'] },
        vocabulary: { words: [
          { word: 'today', reading: 'きょう', meaning: 'today' },
          { word: 'fun', reading: 'たのしい', meaning: 'fun/enjoyable' }
        ]},
      },
    ],
  });

  console.log('✅ Story 6 created: Meeting a Friend');

  // Story 7: At the Post Office (N5/A1)
  await prisma.story.create({
    data: {
      story_id: '7',
      title: 'Sending a Letter',
      description: 'Learn how to send mail and packages at a Japanese post office.',
      category: 'daily_life',
      difficulty_level: 'N5',
      level_jlpt: 'N5',
      level_cefr: 'A1',
      estimated_time: 9,
      estimated_duration_minutes: 9,
      root_chapter_id: 'chapter-7-1',
      is_active: true,
    },
  });

  await prisma.chapter.createMany({
    data: [
      {
        chapter_id: 'chapter-7-1',
        story_id: '7',
        chapter_number: 1,
        title: 'At the Counter',
        content: 'You are at the post office counter. The clerk asks: "How may I help you?"',
        audio_url: null,
        learning_points: { points: ['Post office vocabulary', 'Mailing items', 'Service requests'] },
        vocabulary: { words: [
          { word: 'post office', reading: 'ゆうびんきょく', meaning: 'post office' },
          { word: 'letter', reading: 'てがみ', meaning: 'letter' },
          { word: 'stamp', reading: 'きって', meaning: 'stamp' }
        ]},
      },
      {
        chapter_id: 'chapter-7-2',
        story_id: '7',
        chapter_number: 2,
        title: 'Mailing Complete',
        content: 'Your letter is sent! The clerk says: "It will arrive in 2-3 days."',
        audio_url: null,
        learning_points: { points: ['Time expressions', 'Completion phrases', 'Delivery vocabulary'] },
        vocabulary: { words: [
          { word: 'arrive', reading: 'とどく', meaning: 'to arrive/reach' },
          { word: 'day', reading: 'にち', meaning: 'day' }
        ]},
      },
    ],
  });

  console.log('✅ Story 7 created: Sending a Letter');

  // Story 8: At a Cafe (N5/A1)
  await prisma.story.create({
    data: {
      story_id: '8',
      title: 'Coffee Shop Visit',
      description: 'Order drinks and snacks at a Japanese cafe.',
      category: 'daily_life',
      difficulty_level: 'N5',
      level_jlpt: 'N5',
      level_cefr: 'A1',
      estimated_time: 11,
      estimated_duration_minutes: 11,
      root_chapter_id: 'chapter-8-1',
      is_active: true,
    },
  });

  await prisma.chapter.createMany({
    data: [
      {
        chapter_id: 'chapter-8-1',
        story_id: '8',
        chapter_number: 1,
        title: 'Ordering Coffee',
        content: 'Welcome to the cafe! The barista asks: "What can I get for you today?"',
        audio_url: null,
        learning_points: { points: ['Cafe vocabulary', 'Drink names', 'Ordering food'] },
        vocabulary: { words: [
          { word: 'coffee', reading: 'コーヒー', meaning: 'coffee' },
          { word: 'cafe', reading: 'カフェ', meaning: 'cafe' },
          { word: 'hot', reading: 'あつい', meaning: 'hot' },
          { word: 'cold', reading: 'つめたい', meaning: 'cold' }
        ]},
      },
      {
        chapter_id: 'chapter-8-2',
        story_id: '8',
        chapter_number: 2,
        title: 'Enjoying Your Drink',
        content: 'Your drink is ready! You sit down and relax. Delicious!',
        audio_url: null,
        learning_points: { points: ['Taste vocabulary', 'Relaxation phrases', 'Enjoyment expressions'] },
        vocabulary: { words: [
          { word: 'oishii', reading: 'おいしい', meaning: 'delicious' },
          { word: 'relax', reading: 'リラックス', meaning: 'relax' }
        ]},
      },
    ],
  });

  console.log('✅ Story 8 created: Coffee Shop Visit');

  // Story 9: Shopping for Clothes (N5/A1)
  await prisma.story.create({
    data: {
      story_id: '9',
      title: 'Buying New Clothes',
      description: 'Shop for clothing and learn fashion vocabulary in Japanese.',
      category: 'shopping',
      difficulty_level: 'N5',
      level_jlpt: 'N5',
      level_cefr: 'A1',
      estimated_time: 10,
      estimated_duration_minutes: 10,
      root_chapter_id: 'chapter-9-1',
      is_active: true,
    },
  });

  await prisma.chapter.createMany({
    data: [
      {
        chapter_id: 'chapter-9-1',
        story_id: '9',
        chapter_number: 1,
        title: 'In the Clothing Store',
        content: 'You are looking for new clothes. A staff member asks: "What are you looking for?"',
        audio_url: null,
        learning_points: { points: ['Clothing vocabulary', 'Colors', 'Sizes'] },
        vocabulary: { words: [
          { word: 'clothes', reading: 'ふく', meaning: 'clothes' },
          { word: 'shirt', reading: 'シャツ', meaning: 'shirt' },
          { word: 'size', reading: 'サイズ', meaning: 'size' }
        ]},
      },
      {
        chapter_id: 'chapter-9-2',
        story_id: '9',
        chapter_number: 2,
        title: 'Trying Things On',
        content: 'You found something you like! The staff says: "Please try it on!"',
        audio_url: null,
        learning_points: { points: ['Fitting room vocabulary', 'Size expressions', 'Purchasing'] },
        vocabulary: { words: [
          { word: 'try on', reading: 'きる', meaning: 'to wear/try on' },
          { word: 'fitting room', reading: 'しちゃくしつ', meaning: 'fitting room' }
        ]},
      },
    ],
  });

  console.log('✅ Story 9 created: Buying New Clothes');

  console.log('\n📊 Seeding Summary:');
  const storiesCount = await prisma.story.count();
  const chaptersCount = await prisma.chapter.count();
  const choicesCount = await prisma.choice.count();

  console.log(`  - Stories: ${storiesCount}`);
  console.log(`  - Chapters: ${chaptersCount}`);
  console.log(`  - Choices: ${choicesCount}`);

  console.log('\n✅ Database seeded successfully with English-only content!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
