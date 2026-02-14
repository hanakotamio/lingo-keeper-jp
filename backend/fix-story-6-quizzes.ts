import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixStory6Quizzes() {
  console.log('=== Story 6のクイズを更新 ===\n');

  // Get Story 6
  const story = await prisma.story.findFirst({
    where: { title: '公園での散歩' }
  });

  if (!story) {
    console.log('❌ Story 6 not found!');
    return;
  }

  // Delete existing quiz choices first, then quizzes
  const existingQuizzes = await prisma.quiz.findMany({
    where: { story_id: story.story_id },
    select: { quiz_id: true }
  });

  for (const quiz of existingQuizzes) {
    await prisma.quizChoice.deleteMany({ where: { quiz_id: quiz.quiz_id } });
  }

  await prisma.quiz.deleteMany({ where: { story_id: story.story_id } });
  console.log('✅ Deleted old quizzes and choices\n');

  // Create new story-specific quizzes
  const quizzes = [
    {
      id: 'quiz-6-1',
      question: 'こうえんには　なにが　ありますか。',
      type: '読解',
      choices: [
        { text: 'きれいな　はな', correct: true, explanation: 'せいかいです。こうえんには　きれいな　はなが　あります。' },
        { text: 'おおきい　いえ', correct: false, explanation: 'ちがいます。ストーリーには　ありません。' },
        { text: 'くるま', correct: false, explanation: 'ちがいます。ストーリーには　ありません。' },
        { text: 'がっこう', correct: false, explanation: 'ちがいます。ストーリーには　ありません。' },
      ]
    },
    {
      id: 'quiz-6-2',
      question: 'いけには　なにが　いますか。',
      type: '読解',
      choices: [
        { text: 'さかな', correct: true, explanation: 'せいかいです。いけには　さかなが　います。' },
        { text: 'とり', correct: false, explanation: 'とりは　きに　います。いけには　いません。' },
        { text: 'ねこ', correct: false, explanation: 'ねこは　こうえんに　いますが、いけには　いません。' },
        { text: 'いぬ', correct: false, explanation: 'ちがいます。ストーリーには　ありません。' },
      ]
    },
    {
      id: 'quiz-6-3',
      question: '「かぜ」の　いみは　なんですか。',
      type: '語彙',
      choices: [
        { text: 'wind', correct: true, explanation: 'せいかいです。「かぜ」は　wind です。' },
        { text: 'cold (illness)', correct: false, explanation: 'それは「かぜ（風邪）」です。このストーリーの「かぜ」は　wind です。' },
        { text: 'water', correct: false, explanation: 'ちがいます。water は「みず」です。' },
        { text: 'tree', correct: false, explanation: 'ちがいます。tree は「き」です。' },
      ]
    },
    {
      id: 'quiz-6-4',
      question: 'ねこは　なにいろですか。',
      type: '読解',
      choices: [
        { text: 'しろい', correct: true, explanation: 'せいかいです。しろい　ねこです。' },
        { text: 'くろい', correct: false, explanation: 'ちがいます。ストーリーには　しろい　ねこが　います。' },
        { text: 'ちゃいろい', correct: false, explanation: 'ちがいます。ストーリーには　しろい　ねこが　います。' },
        { text: 'あかい', correct: false, explanation: 'ちがいます。ストーリーには　しろい　ねこが　います。' },
      ]
    },
    {
      id: 'quiz-6-5',
      question: 'ストーリーは　いつ　おわりますか。',
      type: '読解',
      choices: [
        { text: 'ゆうがた', correct: true, explanation: 'せいかいです。ゆうがたに　おわります。' },
        { text: 'あさ', correct: false, explanation: 'ちがいます。ゆうがたに　おわります。' },
        { text: 'ひる', correct: false, explanation: 'ちがいます。ゆうがたに　おわります。' },
        { text: 'よる', correct: false, explanation: 'ちがいます。ゆうがたに　おわります。' },
      ]
    },
  ];

  for (const quizData of quizzes) {
    const quiz = await prisma.quiz.create({
      data: {
        quiz_id: quizData.id,
        question_text: quizData.question,
        question_type: quizData.type,
        difficulty_level: 'N5',
        is_ai_generated: false,
        source_text: '公園での散歩から',
        story: {
          connect: { story_id: story.story_id }
        }
      },
    });

    for (let i = 0; i < quizData.choices.length; i++) {
      await prisma.quizChoice.create({
        data: {
          choice_id: `${quizData.id}-choice-${i + 1}`,
          quiz_id: quiz.quiz_id,
          choice_text: quizData.choices[i].text,
          is_correct: quizData.choices[i].correct,
          explanation: quizData.choices[i].explanation,
        },
      });
    }

    console.log(`✅ Created ${quizData.id}: ${quizData.question}`);
  }

  console.log('\n✅ Story 6 quizzes updated successfully!');
  await prisma.$disconnect();
}

fixStory6Quizzes().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
