import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addQuizzes() {
  console.log('Adding quizzes to all stories...\n');

  const stories = await prisma.story.findMany({
    orderBy: { story_id: 'asc' }
  });

  let totalAdded = 0;

  for (const story of stories) {
    console.log(`Adding quizzes for Story ${story.story_id}: ${story.title}`);

    // Create 3 simple quizzes per story
    for (let i = 1; i <= 3; i++) {
      const quiz = await prisma.quiz.create({
        data: {
          quiz_id: `quiz-${story.story_id}-${i}`,
          story_id: story.story_id,
          question_text: `このストーリーの内容に関する質問${i}です。`,
          question_type: i === 1 ? '読解' : i === 2 ? '語彙' : '文法',
          difficulty_level: story.level_jlpt || 'N5',
          is_ai_generated: false,
          source_text: 'Story content',
        },
      });

      // Add 4 choices per quiz
      const choices = [
        { text: '正解の選択肢です。', correct: true, explanation: '正解です。' },
        { text: '不正解の選択肢1です。', correct: false, explanation: '不正解です。' },
        { text: '不正解の選択肢2です。', correct: false, explanation: '不正解です。' },
        { text: '不正解の選択肢3です。', correct: false, explanation: '不正解です。' },
      ];

      for (let j = 0; j < 4; j++) {
        await prisma.quizChoice.create({
          data: {
            choice_id: `${quiz.quiz_id}-choice-${j + 1}`,
            quiz_id: quiz.quiz_id,
            choice_text: choices[j].text,
            is_correct: choices[j].correct,
            explanation: choices[j].explanation,
          },
        });
      }

      totalAdded++;
    }
  }

  console.log(`\n✅ Added ${totalAdded} quizzes across ${stories.length} stories!`);
  await prisma.$disconnect();
}

addQuizzes();
