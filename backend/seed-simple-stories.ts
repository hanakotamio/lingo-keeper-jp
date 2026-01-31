/**
 * Simple seed script to create basic stories
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load environment variables - try multiple paths
dotenv.config({ path: '../.env.local' });
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with simple stories...\n');

  // Story 1: Shopping at the Supermarket (N5/A1)
  const story1 = await prisma.story.create({
    data: {
      story_id: '1',
      title: 'Shopping at the Supermarket',
      description: 'A simple story about shopping for groceries.',
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

  const chapter1_1 = await prisma.chapter.create({
    data: {
      chapter_id: 'chapter-1-1',
      story_id: '1',
      chapter_number: 1,
      title: 'At the Supermarket Entrance',
      content: 'You are at the supermarket. What do you want to buy today? (あなたはスーパーマーケットにいます。今日は何を買いたいですか？)',
      audio_url: null,
      learning_points: { points: ['Shopping vocabulary', 'Asking questions in Japanese'] },
      vocabulary: { words: [{ word: 'supermarket', reading: 'スーパーマーケット', meaning: 'grocery store' }] },
    },
  });

  await prisma.choice.createMany({
    data: [
      {
        chapter_id: 'chapter-1-1',
        choice_text: 'Buy fruits and vegetables - Visit the produce section',
        next_chapter_id: 'chapter-1-2',
        difficulty_adjustment: 0,
        ending_type: null,
      },
      {
        chapter_id: 'chapter-1-1',
        choice_text: 'Buy meat and fish - Visit the meat and seafood section',
        next_chapter_id: 'chapter-1-3',
        difficulty_adjustment: 0,
        ending_type: null,
      },
    ],
  });

  const chapter1_2 = await prisma.chapter.create({
    data: {
      chapter_id: 'chapter-1-2',
      story_id: '1',
      chapter_number: 2,
      title: 'Produce Section',
      content: 'You chose fresh fruits and vegetables. Good choice for a healthy meal! (新鮮な果物と野菜を選びました。健康的な食事に良い選択です！)',
      audio_url: null,
      learning_points: { points: ['Fruit and vegetable names', 'Healthy eating expressions'] },
      vocabulary: { words: [{ word: 'fruits', reading: 'くだもの', meaning: 'fruits' }, { word: 'vegetables', reading: 'やさい', meaning: 'vegetables' }] },
    },
  });

  const chapter1_3 = await prisma.chapter.create({
    data: {
      chapter_id: 'chapter-1-3',
      story_id: '1',
      chapter_number: 3,
      title: 'Meat and Fish Section',
      content: 'You chose meat and fish. Great for a protein-rich meal! (肉と魚を選びました。タンパク質豊富な食事に最適です！)',
      audio_url: null,
      learning_points: { points: ['Meat and fish vocabulary', 'Nutrition expressions'] },
      vocabulary: { words: [{ word: 'meat', reading: 'にく', meaning: 'meat' }, { word: 'fish', reading: 'さかな', meaning: 'fish' }] },
    },
  });

  // Add final chapters
  await prisma.chapter.createMany({
    data: [
      {
        chapter_id: 'chapter-1-4',
        story_id: '1',
        chapter_number: 4,
        title: 'Checkout (From Produce)',
        content: 'You paid at the cashier and went home. Story complete! (レジで支払いを済ませて家に帰りました。ストーリー完了！)',
        audio_url: null,
        learning_points: { points: ['Payment vocabulary', 'Completing a task'] },
        vocabulary: { words: [{ word: 'cashier', reading: 'レジ', meaning: 'checkout counter' }] },
      },
      {
        chapter_id: 'chapter-1-5',
        story_id: '1',
        chapter_number: 5,
        title: 'Checkout (From Meat/Fish)',
        content: 'You paid at the cashier and went home. Story complete! (レジで支払いを済ませて家に帰りました。ストーリー完了！)',
        audio_url: null,
        learning_points: { points: ['Payment vocabulary', 'Completing a task'] },
        vocabulary: { words: [{ word: 'cashier', reading: 'レジ', meaning: 'checkout counter' }] },
      },
    ],
  });

  console.log('✅ Story 1 created: Shopping at the Supermarket');

  // Story 2: Morning Routine (N5/A1)
  const story2 = await prisma.story.create({
    data: {
      story_id: '2',
      title: 'Morning Routine',
      description: 'Your typical morning routine.',
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
        title: 'Morning Wake Up',
        content: 'Good morning! What do you do first? (おはようございます！最初に何をしますか？)',
        audio_url: null,
        learning_points: { points: ['Morning greetings', 'Daily routine vocabulary'] },
        vocabulary: { words: [{ word: 'good morning', reading: 'おはよう', meaning: 'morning greeting' }] },
      },
      {
        chapter_id: 'chapter-2-2',
        story_id: '2',
        chapter_number: 2,
        title: 'Start Your Day',
        content: 'You started your day. Have a great day! (一日を始めました。良い一日を！)',
        audio_url: null,
        learning_points: { points: ['Daily routine completion', 'Well-wishing expressions'] },
        vocabulary: { words: [{ word: 'great day', reading: 'よいいちにち', meaning: 'good day' }] },
      },
    ],
  });

  console.log('✅ Story 2 created: Morning Routine');

  console.log('\n📊 Seeding Summary:');
  const storiesCount = await prisma.story.count();
  const chaptersCount = await prisma.chapter.count();
  const choicesCount = await prisma.choice.count();

  console.log(`  - Stories: ${storiesCount}`);
  console.log(`  - Chapters: ${chaptersCount}`);
  console.log(`  - Choices: ${choicesCount}`);

  console.log('\n✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
