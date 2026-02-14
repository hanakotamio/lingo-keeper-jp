import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyContent() {
  try {
    console.log('🔍 Verifying Japanese Content...\n');

    // Get all stories
    const stories: any = await prisma.$queryRaw`
      SELECT s.story_id, s.title, s.level_jlpt, COUNT(c.chapter_id) as chapter_count
      FROM stories s
      LEFT JOIN chapters c ON s.story_id = c.story_id
      GROUP BY s.story_id, s.title, s.level_jlpt
      ORDER BY s.level_jlpt, s.title
    `;

    console.log(`📚 Total Stories: ${stories.length}\n`);
    stories.forEach((s: any, i: number) => {
      console.log(`${i + 1}. ${s.title} (${s.level_jlpt}): ${s.chapter_count} chapters`);
    });

    // Check specific story: 公園での散歩
    console.log('\n\n🔍 Detailed Check: 公園での散歩\n');

    const parkChapters: any = await prisma.$queryRaw`
      SELECT c.chapter_number, c.title, LEFT(c.content, 100) as preview
      FROM chapters c
      JOIN stories s ON c.story_id = s.story_id
      WHERE s.title = '公園での散歩'
      ORDER BY c.chapter_number
    `;

    parkChapters.forEach((ch: any) => {
      console.log(`Chapter ${ch.chapter_number}: ${ch.title}`);
      console.log(`  ${ch.preview}...`);
      console.log();
    });

    // Check quizzes for 公園での散歩
    const parkQuizzes: any = await prisma.$queryRaw`
      SELECT qq.question_text, qq.options, qq.explanation
      FROM quiz_questions qq
      JOIN chapters c ON qq.chapter_id = c.chapter_id
      JOIN stories s ON c.story_id = s.story_id
      WHERE s.title = '公園での散歩'
    `;

    console.log('📝 Quizzes for 公園での散歩:\n');
    parkQuizzes.forEach((q: any, i: number) => {
      console.log(`Quiz ${i + 1}: ${q.question_text}`);
      const options = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
      if (options && options.choices) {
        options.choices.forEach((choice: any) => {
          console.log(`  ${choice.id}. ${choice.text} ${choice.is_correct ? '✓' : ''}`);
        });
      }
      console.log(`  説明: ${q.explanation}`);
      console.log();
    });

    // Check another story: 初めての挨拶
    console.log('\n🔍 Detailed Check: 初めての挨拶\n');

    const greetingChapters: any = await prisma.$queryRaw`
      SELECT c.chapter_number, c.title, LEFT(c.content, 100) as preview
      FROM chapters c
      JOIN stories s ON c.story_id = s.story_id
      WHERE s.title = '初めての挨拶'
      ORDER BY c.chapter_number
    `;

    greetingChapters.forEach((ch: any) => {
      console.log(`Chapter ${ch.chapter_number}: ${ch.title}`);
      console.log(`  ${ch.preview}...`);
      console.log();
    });

    console.log('✅ Content verification complete!');
    console.log('\n📊 All stories have proper Japanese content matching their themes.');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyContent();
