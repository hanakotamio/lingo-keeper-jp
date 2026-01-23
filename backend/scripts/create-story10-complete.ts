import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createStory10() {
  console.log('Creating Story 10 with chapters and quizzes...');

  try {
    // Check if story exists
    const existingStory = await prisma.story.findUnique({ where: { story_id: '10' } });

    if (!existingStory) {
      // Create the story
      await prisma.story.create({
        data: {
          story_id: '10',
          title: '朝のあいさつ',
          description: '学校での朝のあいさつを学びます。友達や先生との自然な会話を体験しましょう。',
          level_jlpt: 'N5',
          level_cefr: 'A1',
          estimated_time: 5,
          root_chapter_id: 'ch-10-1',
        },
      });
      console.log('✓ Created Story 10');
    } else {
      console.log('✓ Story 10 already exists');
    }

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

    // Quiz 1
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
          explanation: '「おはよう」は朝のあいさつです。(Ohayou is a morning greeting.)',
        },
        {
          choice_id: 'quiz-10-1-choice-2',
          quiz_id: 'quiz-10-1',
          choice_text: '昼',
          is_correct: false,
          explanation: '昼は「こんにちは」を使います。(Use konnichiwa in the afternoon.)',
        },
        {
          choice_id: 'quiz-10-1-choice-3',
          quiz_id: 'quiz-10-1',
          choice_text: '夜',
          is_correct: false,
          explanation: '夜は「こんばんは」を使います。(Use konbanwa in the evening.)',
        },
        {
          choice_id: 'quiz-10-1-choice-4',
          quiz_id: 'quiz-10-1',
          choice_text: '寝る前',
          is_correct: false,
          explanation: '寝る前は「おやすみなさい」を使います。(Say oyasuminasai before bed.)',
        },
      ],
    });

    console.log('✓ Created Quiz 1');

    // Quiz 2
    await prisma.quiz.create({
      data: {
        quiz_id: 'quiz-10-2',
        story_id: '10',
        question_text: '「いい天気ですね」の意味はどれですか？',
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
          choice_text: 'いい天気ですね',
          is_correct: true,
          explanation: '「いい天気ですね」は"Nice weather, isn\'t it?"という意味です。',
        },
        {
          choice_id: 'quiz-10-2-choice-2',
          quiz_id: 'quiz-10-2',
          choice_text: '暑いですね',
          is_correct: false,
          explanation: '「暑い」は"hot"です。天気の話ではありますが、違います。',
        },
        {
          choice_id: 'quiz-10-2-choice-3',
          quiz_id: 'quiz-10-2',
          choice_text: '今日は何曜日ですか',
          is_correct: false,
          explanation: 'これは"What day is it today?"という意味です。',
        },
        {
          choice_id: 'quiz-10-2-choice-4',
          quiz_id: 'quiz-10-2',
          choice_text: '時間がありますか',
          is_correct: false,
          explanation: 'これは"Do you have time?"という意味です。',
        },
      ],
    });

    console.log('✓ Created Quiz 2');

    // Quiz 3
    await prisma.quiz.create({
      data: {
        quiz_id: 'quiz-10-3',
        story_id: '10',
        question_text: '「いい天気ですね」の「ですね」は何のために使いますか？',
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
          choice_text: '相手に同意を求めるため',
          is_correct: true,
          explanation:
            '「ですね」は相手に同意を求める表現です。英語の"isn\'t it?"や"right?"に似ています。',
        },
        {
          choice_id: 'quiz-10-3-choice-2',
          quiz_id: 'quiz-10-3',
          choice_text: '質問するため',
          is_correct: false,
          explanation: '質問には「ですか」を使います。「ですね」は質問ではありません。',
        },
        {
          choice_id: 'quiz-10-3-choice-3',
          quiz_id: 'quiz-10-3',
          choice_text: '命令するため',
          is_correct: false,
          explanation: '命令には「てください」などを使います。',
        },
        {
          choice_id: 'quiz-10-3-choice-4',
          quiz_id: 'quiz-10-3',
          choice_text: '丁寧に話すため',
          is_correct: false,
          explanation: '丁寧語ではありますが、主な目的は同意を求めることです。',
        },
      ],
    });

    console.log('✓ Created Quiz 3');

    // Quiz 4
    await prisma.quiz.create({
      data: {
        quiz_id: 'quiz-10-4',
        story_id: '10',
        question_text: '田中さんが「元気ないね」と言いました。どういう意味ですか？',
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
          choice_text: '元気がなさそうだ',
          is_correct: true,
          explanation:
            '「元気ない」は"You don\'t seem energetic"という意味です。心配して声をかけています。',
        },
        {
          choice_id: 'quiz-10-4-choice-2',
          quiz_id: 'quiz-10-4',
          choice_text: 'とても元気だ',
          is_correct: false,
          explanation: '「元気ない」は元気がない、疲れているという意味です。',
        },
        {
          choice_id: 'quiz-10-4-choice-3',
          quiz_id: 'quiz-10-4',
          choice_text: '怒っている',
          is_correct: false,
          explanation: '怒っているは「怒っている」です。元気とは違います。',
        },
        {
          choice_id: 'quiz-10-4-choice-4',
          quiz_id: 'quiz-10-4',
          choice_text: '遅刻している',
          is_correct: false,
          explanation: '遅刻は「遅れている」です。時間の話ではありません。',
        },
      ],
    });

    console.log('✓ Created Quiz 4');

    // Quiz 5
    await prisma.quiz.create({
      data: {
        quiz_id: 'quiz-10-5',
        story_id: '10',
        question_text: '先生が「がんばりましょう」と言いました。この言葉はどんな時に使いますか？',
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
          choice_text: 'みんなを励ます時',
          is_correct: true,
          explanation:
            '「がんばりましょう」は"Let\'s do our best!"という意味で、みんなを励ます時に使います。日本の学校でよく使われる表現です。',
        },
        {
          choice_id: 'quiz-10-5-choice-2',
          quiz_id: 'quiz-10-5',
          choice_text: '別れる時',
          is_correct: false,
          explanation: '別れる時は「さようなら」や「またね」を使います。',
        },
        {
          choice_id: 'quiz-10-5-choice-3',
          quiz_id: 'quiz-10-5',
          choice_text: '食事の前',
          is_correct: false,
          explanation: '食事の前は「いただきます」を使います。',
        },
        {
          choice_id: 'quiz-10-5-choice-4',
          quiz_id: 'quiz-10-5',
          choice_text: '謝る時',
          is_correct: false,
          explanation: '謝る時は「すみません」や「ごめんなさい」を使います。',
        },
      ],
    });

    console.log('✓ Created Quiz 5');

    console.log('\n✅ Story 10 with quizzes created successfully!');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

createStory10()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
