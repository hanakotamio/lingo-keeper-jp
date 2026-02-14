import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fixing Quiz 4-3: Updating choices...');

  // Delete old choices
  await prisma.quizChoice.deleteMany({
    where: { quiz_id: 'quiz-4-3' }
  });

  // Create new choices with correct answer
  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-4-3-choice-1',
        quiz_id: 'quiz-4-3',
        choice_text: 'バスで行った',
        is_correct: false,
        explanation: '不正解です。二人はカフェに行くことに決めました。',
      },
      {
        choice_id: 'quiz-4-3-choice-2',
        quiz_id: 'quiz-4-3',
        choice_text: 'カフェに行った',
        is_correct: true,
        explanation: '正解です。二人は「カフェでゆっくり話そう」と決めました。',
      },
      {
        choice_id: 'quiz-4-3-choice-3',
        quiz_id: 'quiz-4-3',
        choice_text: '駅で別れた',
        is_correct: false,
        explanation: '不正解です。二人は一緒に出かけました。',
      },
      {
        choice_id: 'quiz-4-3-choice-4',
        quiz_id: 'quiz-4-3',
        choice_text: '映画館に行った',
        is_correct: false,
        explanation: '不正解です。映画の提案もありましたが、カフェに行くことに決めました。',
      },
    ],
  });

  // Update quiz source_text
  await prisma.quiz.update({
    where: { quiz_id: 'quiz-4-3' },
    data: {
      source_text: '「カフェでゆっくり話そう」と決めました',
    },
  });

  console.log('Quiz 4-3 fixed successfully!');

  // Verify the update
  const updatedQuiz = await prisma.quiz.findUnique({
    where: { quiz_id: 'quiz-4-3' },
    include: { choices: true },
  });

  console.log('\nUpdated Quiz:');
  console.log(JSON.stringify(updatedQuiz, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
