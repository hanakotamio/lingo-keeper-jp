import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addQuizzes() {
  console.log('Adding quiz-1-1 and quiz-1-2 to Story 1...\n');

  const quiz1 = await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-1-1',
      story_id: '1',
      question_text: '主人公は渋谷に着いて、何に驚きましたか？',
      question_type: '読解',
      difficulty_level: 'N3',
      is_ai_generated: false,
      source_text: '渋谷の駅に着いて、人の多さに驚きました',
    },
  });

  await prisma.quizChoice.createMany({
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

  const quiz2 = await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-1-2',
      story_id: '1',
      question_text: '主人公が選んだ定食は何ですか？',
      question_type: '読解',
      difficulty_level: 'N3',
      is_ai_generated: false,
      source_text: '生姜焼き定食を注文すると、とても美味しくて感動しました',
    },
  });

  await prisma.quizChoice.createMany({
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

  console.log('✅ Added quiz-1-1 and quiz-1-2 to Story 1');

  const total = await prisma.quiz.count({ where: { story_id: '1' } });
  console.log(`\n📊 Total quizzes for Story 1: ${total}/5`);

  await prisma.$disconnect();
}

addQuizzes().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
