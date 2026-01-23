import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Update quizzes for Story 10: 朝のあいさつ
 * Convert to English questions for English-speaking learners
 */
async function updateQuizzes() {
  console.log('Updating quizzes for Story 10 to English...');

  try {
    // Delete existing quizzes and choices
    await prisma.quizChoice.deleteMany({
      where: {
        quiz_id: {
          in: ['quiz-10-1', 'quiz-10-2', 'quiz-10-3', 'quiz-10-4', 'quiz-10-5'],
        },
      },
    });

    await prisma.quiz.deleteMany({
      where: {
        story_id: '10',
      },
    });

    console.log('✓ Deleted old quizzes');

    // Quiz 1: When to use おはよう
    await prisma.quiz.create({
      data: {
        quiz_id: 'quiz-10-1',
        story_id: '10',
        question_text: 'When do you use "おはよう" (ohayou)?',
        question_type: 'Vocabulary',
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
          choice_text: 'In the morning',
          is_correct: true,
          explanation: '"おはよう" is a morning greeting, like "Good morning."',
        },
        {
          choice_id: 'quiz-10-1-choice-2',
          quiz_id: 'quiz-10-1',
          choice_text: 'In the afternoon',
          is_correct: false,
          explanation: 'In the afternoon, use "こんにちは" (konnichiwa).',
        },
        {
          choice_id: 'quiz-10-1-choice-3',
          quiz_id: 'quiz-10-1',
          choice_text: 'In the evening',
          is_correct: false,
          explanation: 'In the evening, use "こんばんは" (konbanwa).',
        },
        {
          choice_id: 'quiz-10-1-choice-4',
          quiz_id: 'quiz-10-1',
          choice_text: 'Before going to bed',
          is_correct: false,
          explanation: 'Before bed, use "おやすみなさい" (oyasuminasai).',
        },
      ],
    });

    console.log('✓ Created Quiz 1: When to use おはよう');

    // Quiz 2: Meaning of 天気
    await prisma.quiz.create({
      data: {
        quiz_id: 'quiz-10-2',
        story_id: '10',
        question_text: 'What does "天気" (tenki) mean in "いい天気ですね"?',
        question_type: 'Vocabulary',
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
          choice_text: 'Weather',
          is_correct: true,
          explanation: '"天気" means "weather." The phrase means "Nice weather, isn\'t it?"',
        },
        {
          choice_id: 'quiz-10-2-choice-2',
          quiz_id: 'quiz-10-2',
          choice_text: 'Temperature',
          is_correct: false,
          explanation: 'Temperature is "温度" (ondo) in Japanese.',
        },
        {
          choice_id: 'quiz-10-2-choice-3',
          quiz_id: 'quiz-10-2',
          choice_text: 'Time',
          is_correct: false,
          explanation: 'Time is "時間" (jikan) in Japanese.',
        },
        {
          choice_id: 'quiz-10-2-choice-4',
          quiz_id: 'quiz-10-2',
          choice_text: 'Place',
          is_correct: false,
          explanation: 'Place is "場所" (basho) in Japanese.',
        },
      ],
    });

    console.log('✓ Created Quiz 2: Meaning of 天気');

    // Quiz 3: Function of ～ですね
    await prisma.quiz.create({
      data: {
        quiz_id: 'quiz-10-3',
        story_id: '10',
        question_text: 'What is the function of "ですね" in "いい天気ですね"?',
        question_type: 'Grammar',
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
          choice_text: 'Seeking agreement / Confirmation',
          is_correct: true,
          explanation:
            '"ですね" is used to seek agreement or confirm something. Like "isn\'t it?" or "right?"',
        },
        {
          choice_id: 'quiz-10-3-choice-2',
          quiz_id: 'quiz-10-3',
          choice_text: 'Asking a question',
          is_correct: false,
          explanation: 'For questions, use "ですか" instead of "ですね."',
        },
        {
          choice_id: 'quiz-10-3-choice-3',
          quiz_id: 'quiz-10-3',
          choice_text: 'Giving a command',
          is_correct: false,
          explanation: 'Commands use forms like "てください" (te kudasai).',
        },
        {
          choice_id: 'quiz-10-3-choice-4',
          quiz_id: 'quiz-10-3',
          choice_text: 'Making a negative statement',
          is_correct: false,
          explanation: 'Negative statements use "ではありません" or similar forms.',
        },
      ],
    });

    console.log('✓ Created Quiz 3: Function of ～ですね');

    // Quiz 4: Comprehension - 元気ない
    await prisma.quiz.create({
      data: {
        quiz_id: 'quiz-10-4',
        story_id: '10',
        question_text: 'In the story, Tanaka says "元気ないね" (genki nai ne). What does this mean?',
        question_type: 'Reading Comprehension',
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
          explanation:
            '"元気ない" means lacking energy or not looking well. It\'s a casual way to show concern.',
        },
        {
          choice_id: 'quiz-10-4-choice-2',
          quiz_id: 'quiz-10-4',
          choice_text: 'You are very happy',
          is_correct: false,
          explanation: '"元気ない" has the opposite meaning - it means lacking energy.',
        },
        {
          choice_id: 'quiz-10-4-choice-3',
          quiz_id: 'quiz-10-4',
          choice_text: 'You are angry',
          is_correct: false,
          explanation: 'Angry would be "怒っている" (okotteiru) in Japanese.',
        },
        {
          choice_id: 'quiz-10-4-choice-4',
          quiz_id: 'quiz-10-4',
          choice_text: 'You are late',
          is_correct: false,
          explanation: 'Late would be "遅れている" (okureteiru) in Japanese.',
        },
      ],
    });

    console.log('✓ Created Quiz 4: Comprehension - 元気ない');

    // Quiz 5: Cultural - がんばりましょう
    await prisma.quiz.create({
      data: {
        quiz_id: 'quiz-10-5',
        story_id: '10',
        question_text:
          'The teacher says "がんばりましょう" (ganbarimashō). When is this expression used?',
        question_type: 'Culture',
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
          choice_text: 'To encourage / motivate',
          is_correct: true,
          explanation:
            '"がんばりましょう" means "Let\'s do our best!" It\'s commonly used in Japanese schools and workplaces to encourage effort.',
        },
        {
          choice_id: 'quiz-10-5-choice-2',
          quiz_id: 'quiz-10-5',
          choice_text: 'When saying goodbye',
          is_correct: false,
          explanation: 'For goodbye, use "さようなら" (sayōnara) or "またね" (mata ne).',
        },
        {
          choice_id: 'quiz-10-5-choice-3',
          quiz_id: 'quiz-10-5',
          choice_text: 'Before eating',
          is_correct: false,
          explanation: 'Before eating, say "いただきます" (itadakimasu).',
        },
        {
          choice_id: 'quiz-10-5-choice-4',
          quiz_id: 'quiz-10-5',
          choice_text: 'When apologizing',
          is_correct: false,
          explanation: 'For apologies, use "すみません" (sumimasen) or "ごめんなさい" (gomen nasai).',
        },
      ],
    });

    console.log('✓ Created Quiz 5: Cultural - がんばりましょう');

    console.log('\n✅ All quizzes updated to English for Story 10!');
  } catch (error) {
    console.error('Error updating quizzes:', error);
    throw error;
  }
}

// Execute
updateQuizzes()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
