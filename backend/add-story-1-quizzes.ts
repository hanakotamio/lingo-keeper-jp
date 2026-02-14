import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addQuizzes() {
  console.log('Adding 2 quizzes to Story 1...\n');

  const quiz4 = await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-1-4',
      story_id: '1',
      question_text: '「〜てしまう」の文法的な意味として最も適切なものはどれですか。',
      question_type: '文法',
      difficulty_level: 'N3',
      is_ai_generated: false,
      source_text: '補助動詞「〜てしまう」の用法',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-1-4-choice-1',
        quiz_id: quiz4.quiz_id,
        choice_text: '動作の完了や残念な気持ちを表す',
        is_correct: true,
        explanation: '正解です。「〜てしまう」は動作の完了を表したり、話し手の残念な気持ちや後悔を表現します。',
      },
      {
        choice_id: 'quiz-1-4-choice-2',
        quiz_id: quiz4.quiz_id,
        choice_text: '動作の継続を表す',
        is_correct: false,
        explanation: '継続は「〜ている」で表現します。「〜てしまう」は完了を表します。',
      },
      {
        choice_id: 'quiz-1-4-choice-3',
        quiz_id: quiz4.quiz_id,
        choice_text: '可能性を表す',
        is_correct: false,
        explanation: '可能性は「〜かもしれない」などで表現します。',
      },
      {
        choice_id: 'quiz-1-4-choice-4',
        quiz_id: quiz4.quiz_id,
        choice_text: '義務を表す',
        is_correct: false,
        explanation: '義務は「〜なければならない」などで表現します。',
      },
    ],
  });

  const quiz5 = await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-1-5',
      story_id: '1',
      question_text: '「手続き」という言葉の意味として最も適切なものはどれですか。',
      question_type: '語彙',
      difficulty_level: 'N3',
      is_ai_generated: false,
      source_text: '行政・生活関連の語彙',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-1-5-choice-1',
        quiz_id: quiz5.quiz_id,
        choice_text: '何かを達成するために必要な一連のプロセスや手順',
        is_correct: true,
        explanation: '正解です。「手続き」は公的な登録や申請などに必要な一連の処理を指します。',
      },
      {
        choice_id: 'quiz-1-5-choice-2',
        quiz_id: quiz5.quiz_id,
        choice_text: '手で何かを作ること',
        is_correct: false,
        explanation: 'それは「手作り」です。「手続き」は事務的なプロセスを指します。',
      },
      {
        choice_id: 'quiz-1-5-choice-3',
        quiz_id: quiz5.quiz_id,
        choice_text: '約束を守ること',
        is_correct: false,
        explanation: 'それは「約束を守る」や「信義を守る」などで表現します。',
      },
      {
        choice_id: 'quiz-1-5-choice-4',
        quiz_id: quiz5.quiz_id,
        choice_text: '手紙を書くこと',
        is_correct: false,
        explanation: 'それは「手紙を書く」です。「手続き」は公式的な処理を指します。',
      },
    ],
  });

  console.log('✅ Added 2 quizzes to Story 1');

  const total = await prisma.quiz.count();
  console.log(`\n📊 Total quizzes in database: ${total}`);

  await prisma.$disconnect();
}

addQuizzes().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
