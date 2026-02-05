import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Starting test data seeding...');

  // TRANSACTION: Atomic story and quiz creation
  // If any operation fails, all changes will be rolled back
  await prisma.$transaction(async (tx) => {
    // Create a test story
    const story = await tx.story.create({
      data: {
        story_id: '1',
        title: '東京での新しい生活',
        description: '初めて東京に来た留学生の1日を追体験。',
        category: '日常生活',
        difficulty_level: 'intermediate',
        level_jlpt: 'N3',
        level_cefr: 'B1',
        estimated_time: 10,
        estimated_duration_minutes: 10,
        root_chapter_id: 'ch-1-1',
        is_active: true,
      },
    });

    console.log('Created test story:', story.title);

    // Create test quizzes
    const quiz1 = await tx.quiz.create({
      data: {
        quiz_id: 'quiz-1-1',
        story_id: story.story_id,
        question_text: '主人公は渋谷に着いて、何に驚きましたか？',
        question_type: '読解',
        difficulty_level: 'N3',
        is_ai_generated: false,
        source_text: '渋谷の駅に着いて、人の多さに驚きました',
      },
    });

    await tx.quizChoice.createMany({
      data: [
      {
        choice_id: 'quiz-1-1-choice-1',
        quiz_id: quiz1.quiz_id,
        choice_text: '建物の高さ',
        is_correct: false,
        explanation: '不正解です。建物については触れていません。',
      },
      {
        choice_id: 'quiz-1-1-choice-2',
        quiz_id: quiz1.quiz_id,
        choice_text: '人の多さ',
        is_correct: true,
        explanation: '正解です。「人の多さに驚きました」と書いてあります。',
      },
      {
        choice_id: 'quiz-1-1-choice-3',
        quiz_id: quiz1.quiz_id,
        choice_text: '電車の速さ',
        is_correct: false,
        explanation: '不正解です。電車については触れていません。',
      },
      {
        choice_id: 'quiz-1-1-choice-4',
        quiz_id: quiz1.quiz_id,
        choice_text: '天気の悪さ',
        is_correct: false,
        explanation: '不正解です。天気については触れていません。',
      },
    ],
  });

    console.log('Created test quiz:', quiz1.question_text);

    const quiz2 = await tx.quiz.create({
      data: {
        quiz_id: 'quiz-1-2',
        story_id: story.story_id,
        question_text: '主人公が選んだ定食は何ですか？',
        question_type: '読解',
        difficulty_level: 'N3',
        is_ai_generated: false,
        source_text: '生姜焼き定食を注文すると、とても美味しくて感動しました',
      },
    });

    await tx.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-1-2-choice-1',
        quiz_id: quiz2.quiz_id,
        choice_text: 'カレーライス',
        is_correct: false,
        explanation: '不正解です。カレーは出てきません。',
      },
      {
        choice_id: 'quiz-1-2-choice-2',
        quiz_id: quiz2.quiz_id,
        choice_text: '寿司',
        is_correct: false,
        explanation: '不正解です。寿司は出てきません。',
      },
      {
        choice_id: 'quiz-1-2-choice-3',
        quiz_id: quiz2.quiz_id,
        choice_text: '生姜焼き定食',
        is_correct: true,
        explanation: '正解です。「生姜焼き定食を注文すると」と書いてあります。',
      },
      {
        choice_id: 'quiz-1-2-choice-4',
        quiz_id: quiz2.quiz_id,
        choice_text: 'ラーメン',
        is_correct: false,
        explanation: '不正解です。ラーメンは出てきません。',
      },
      ],
    });

    console.log('Created test quiz:', quiz2.question_text);
  });

  console.log('✅ Transaction completed successfully!');
  console.log('Test data seeding completed successfully!');
  console.log('\nYou can now test the quiz API:');
  console.log('GET /api/quizzes?story_id=1');
  console.log('GET /api/quizzes/quiz-1-1');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
