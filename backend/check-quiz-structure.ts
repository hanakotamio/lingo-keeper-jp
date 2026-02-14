import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkQuizStructure() {
  try {
    // Check quiz_questions table structure
    const result: any = await prisma.$queryRaw`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'quiz_questions'
      ORDER BY ordinal_position;
    `;

    console.log('📋 quiz_questions table structure:');
    result.forEach((col: any) => {
      console.log(`  ${col.column_name}: ${col.data_type}`);
    });

    // Get a sample quiz question
    const sampleQuiz: any = await prisma.$queryRaw`
      SELECT * FROM quiz_questions LIMIT 1;
    `;

    console.log('\n📝 Sample quiz_question:');
    console.log(sampleQuiz[0]);

    // Count total quiz questions
    const count: any = await prisma.$queryRaw`
      SELECT COUNT(*) as total FROM quiz_questions;
    `;

    console.log(`\n📊 Total quiz_questions: ${count[0].total}`);

    // Get chapters info
    const chapterCount: any = await prisma.$queryRaw`
      SELECT COUNT(*) as total FROM chapters;
    `;

    console.log(`📊 Total chapters: ${chapterCount[0].total}`);

    // Check if chapters have quiz_questions
    const chaptersWithQuizzes: any = await prisma.$queryRaw`
      SELECT c.chapter_id, c.title, COUNT(qq.question_id) as quiz_count
      FROM chapters c
      LEFT JOIN quiz_questions qq ON c.chapter_id = qq.chapter_id
      GROUP BY c.chapter_id, c.title
      HAVING COUNT(qq.question_id) > 0
      LIMIT 5;
    `;

    console.log('\n📖 Sample chapters with quizzes:');
    chaptersWithQuizzes.forEach((ch: any) => {
      console.log(`  ${ch.title}: ${ch.quiz_count} quizzes`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkQuizStructure();
