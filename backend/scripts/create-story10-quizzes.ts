import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create quizzes for Story 10: 朝のあいさつ
 */
async function createQuizzes() {
  console.log('Creating quizzes for Story 10: 朝のあいさつ...');

  // Quiz 1: Vocabulary - おはよう
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-10-1',
      story_id: '10',
      question_text: '「おはよう」はいつ使いますか？',
      question_type: '語彙',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: '朝のあいさつ',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-10-1-choice-1',
        quiz_id: 'quiz-10-1',
        choice_text: '朝',
        is_correct: true,
        explanation: '「おはよう」は朝のあいさつです。',
      },
      {
        choice_id: 'quiz-10-1-choice-2',
        quiz_id: 'quiz-10-1',
        choice_text: '昼',
        is_correct: false,
        explanation: '昼は「こんにちは」を使います。',
      },
      {
        choice_id: 'quiz-10-1-choice-3',
        quiz_id: 'quiz-10-1',
        choice_text: '夜',
        is_correct: false,
        explanation: '夜は「こんばんは」を使います。',
      },
      {
        choice_id: 'quiz-10-1-choice-4',
        quiz_id: 'quiz-10-1',
        choice_text: '寝る前',
        is_correct: false,
        explanation: '寝る前は「おやすみなさい」を使います。',
      },
    ],
  });

  console.log('✓ Created Quiz 1: おはよう');

  // Quiz 2: Vocabulary - 天気
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-10-2',
      story_id: '10',
      question_text: '「いい天気ですね」の「天気」の意味は？',
      question_type: '語彙',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: '朝のあいさつ',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-10-2-choice-1',
        quiz_id: 'quiz-10-2',
        choice_text: 'weather',
        is_correct: true,
        explanation: '「天気」は weather の意味です。',
      },
      {
        choice_id: 'quiz-10-2-choice-2',
        quiz_id: 'quiz-10-2',
        choice_text: 'temperature',
        is_correct: false,
        explanation: 'temperature は「温度」です。',
      },
      {
        choice_id: 'quiz-10-2-choice-3',
        quiz_id: 'quiz-10-2',
        choice_text: 'time',
        is_correct: false,
        explanation: 'time は「時間」です。',
      },
      {
        choice_id: 'quiz-10-2-choice-4',
        quiz_id: 'quiz-10-2',
        choice_text: 'place',
        is_correct: false,
        explanation: 'place は「場所」です。',
      },
    ],
  });

  console.log('✓ Created Quiz 2: 天気');

  // Quiz 3: Grammar - ～ですね
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-10-3',
      story_id: '10',
      question_text: '「いい天気ですね」の「ですね」は何を表しますか？',
      question_type: '文法',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: '朝のあいさつ',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-10-3-choice-1',
        quiz_id: 'quiz-10-3',
        choice_text: '同意を求める／確認する',
        is_correct: true,
        explanation: '「ですね」は相手に同意を求めたり、確認したりする表現です。',
      },
      {
        choice_id: 'quiz-10-3-choice-2',
        quiz_id: 'quiz-10-3',
        choice_text: '質問する',
        is_correct: false,
        explanation: '質問は「ですか」を使います。',
      },
      {
        choice_id: 'quiz-10-3-choice-3',
        quiz_id: 'quiz-10-3',
        choice_text: '命令する',
        is_correct: false,
        explanation: '命令は「てください」などを使います。',
      },
      {
        choice_id: 'quiz-10-3-choice-4',
        quiz_id: 'quiz-10-3',
        choice_text: '否定する',
        is_correct: false,
        explanation: '否定は「ではありません」などを使います。',
      },
    ],
  });

  console.log('✓ Created Quiz 3: ～ですね');

  // Quiz 4: Comprehension - 元気
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-10-4',
      story_id: '10',
      question_text: 'ストーリーで、田中さんは「元気ないね」と言いました。どういう意味ですか？',
      question_type: '読解',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: '朝のあいさつ',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-10-4-choice-1',
        quiz_id: 'quiz-10-4',
        choice_text: 'You don\'t seem energetic / healthy',
        is_correct: true,
        explanation: '「元気ない」は元気がない、つまり疲れているように見えるという意味です。',
      },
      {
        choice_id: 'quiz-10-4-choice-2',
        quiz_id: 'quiz-10-4',
        choice_text: 'You are very happy',
        is_correct: false,
        explanation: '「元気ない」は happy の意味ではありません。',
      },
      {
        choice_id: 'quiz-10-4-choice-3',
        quiz_id: 'quiz-10-4',
        choice_text: 'You are angry',
        is_correct: false,
        explanation: 'angry は「怒っている」です。',
      },
      {
        choice_id: 'quiz-10-4-choice-4',
        quiz_id: 'quiz-10-4',
        choice_text: 'You are late',
        is_correct: false,
        explanation: 'late は「遅れている」です。',
      },
    ],
  });

  console.log('✓ Created Quiz 4: 元気');

  // Quiz 5: Cultural - がんばりましょう
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-10-5',
      story_id: '10',
      question_text: '先生が「がんばりましょう」と言いました。この言葉はいつ使いますか？',
      question_type: '文化',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: '朝のあいさつ',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-10-5-choice-1',
        quiz_id: 'quiz-10-5',
        choice_text: '励ます時 / To encourage',
        is_correct: true,
        explanation:
          '「がんばりましょう」は一緒に頑張ろうという励ましの言葉です。日本の学校でよく使われます。',
      },
      {
        choice_id: 'quiz-10-5-choice-2',
        quiz_id: 'quiz-10-5',
        choice_text: '別れる時 / When saying goodbye',
        is_correct: false,
        explanation: '別れる時は「さようなら」などを使います。',
      },
      {
        choice_id: 'quiz-10-5-choice-3',
        quiz_id: 'quiz-10-5',
        choice_text: '食べる前 / Before eating',
        is_correct: false,
        explanation: '食べる前は「いただきます」を使います。',
      },
      {
        choice_id: 'quiz-10-5-choice-4',
        quiz_id: 'quiz-10-5',
        choice_text: '謝る時 / When apologizing',
        is_correct: false,
        explanation: '謝る時は「すみません」や「ごめんなさい」を使います。',
      },
    ],
  });

  console.log('✓ Created Quiz 5: がんばりましょう');

  console.log('\n✅ All quizzes created for Story 10!');
}

// Execute
createQuizzes()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
