import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Adding additional quizzes to beginner stories...');

  // Story 20: 初めての挨拶
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-20-2',
      story_id: '20',
      question_text: 'What is the correct greeting to use in the morning?',
      question_type: '語彙',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: 'Morning greetings vocabulary',
      quiz_choices: {
        create: [
          {
            choice_id: 'quiz-20-2-a',
            choice_text: 'おはようございます',
            is_correct: true,
            explanation: 'This is the polite morning greeting used from early morning until around 10-11 AM.'
          },
          {
            choice_id: 'quiz-20-2-b',
            choice_text: 'こんにちは',
            is_correct: false,
            explanation: 'This is used during the day, not in the morning.'
          },
          {
            choice_id: 'quiz-20-2-c',
            choice_text: 'こんばんは',
            is_correct: false,
            explanation: 'This is used in the evening, not in the morning.'
          }
        ]
      }
    }
  });

  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-20-3',
      story_id: '20',
      question_text: 'Which phrase means "goodbye"?',
      question_type: '語彙',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: 'Farewell expressions',
      quiz_choices: {
        create: [
          {
            choice_id: 'quiz-20-3-a',
            choice_text: 'さようなら',
            is_correct: true,
            explanation: 'This is the standard word for "goodbye" in Japanese.'
          },
          {
            choice_id: 'quiz-20-3-b',
            choice_text: 'おはよう',
            is_correct: false,
            explanation: 'This means "good morning", not "goodbye".'
          },
          {
            choice_id: 'quiz-20-3-c',
            choice_text: 'ありがとう',
            is_correct: false,
            explanation: 'This means "thank you", not "goodbye".'
          }
        ]
      }
    }
  });

  // Story 21: 自己紹介をしよう
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-21-2',
      story_id: '21',
      question_text: 'How do you say "I am a student" in Japanese?',
      question_type: '文法',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: 'Self-introduction grammar',
      quiz_choices: {
        create: [
          {
            choice_id: 'quiz-21-2-a',
            choice_text: '私は学生です',
            is_correct: true,
            explanation: 'Correct! This uses the pattern [noun] は [noun] です to state identity.'
          },
          {
            choice_id: 'quiz-21-2-b',
            choice_text: '私が学生です',
            is_correct: false,
            explanation: 'Using が instead of は changes the emphasis and is not natural for basic self-introduction.'
          },
          {
            choice_id: 'quiz-21-2-c',
            choice_text: '学生は私です',
            is_correct: false,
            explanation: 'This word order means "The student is me", which is unnatural in this context.'
          }
        ]
      }
    }
  });

  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-21-3',
      story_id: '21',
      question_text: 'What does "どうぞよろしく" mean?',
      question_type: '読解',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: 'Polite expressions',
      quiz_choices: {
        create: [
          {
            choice_id: 'quiz-21-3-a',
            choice_text: 'Nice to meet you / Please treat me well',
            is_correct: true,
            explanation: 'This is a polite expression used when meeting someone for the first time.'
          },
          {
            choice_id: 'quiz-21-3-b',
            choice_text: 'Goodbye',
            is_correct: false,
            explanation: 'This is not a farewell expression.'
          },
          {
            choice_id: 'quiz-21-3-c',
            choice_text: 'Thank you',
            is_correct: false,
            explanation: 'This is not used to express gratitude.'
          }
        ]
      }
    }
  });

  // Story 22: 数を数えよう
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-22-2',
      story_id: '22',
      question_text: 'How do you say "seven" in Japanese?',
      question_type: '語彙',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: 'Number vocabulary',
      quiz_choices: {
        create: [
          {
            choice_id: 'quiz-22-2-a',
            choice_text: 'なな (or しち)',
            is_correct: true,
            explanation: 'Seven can be pronounced as "nana" or "shichi" in Japanese.'
          },
          {
            choice_id: 'quiz-22-2-b',
            choice_text: 'ろく',
            is_correct: false,
            explanation: 'This means "six", not "seven".'
          },
          {
            choice_id: 'quiz-22-2-c',
            choice_text: 'はち',
            is_correct: false,
            explanation: 'This means "eight", not "seven".'
          }
        ]
      }
    }
  });

  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-22-3',
      story_id: '22',
      question_text: 'What counter is commonly used for small objects like apples?',
      question_type: '文法',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: 'Counter words',
      quiz_choices: {
        create: [
          {
            choice_id: 'quiz-22-3-a',
            choice_text: '〜つ',
            is_correct: true,
            explanation: 'The counter つ is used for general small objects, including apples.'
          },
          {
            choice_id: 'quiz-22-3-b',
            choice_text: '〜人',
            is_correct: false,
            explanation: 'This counter is used for people, not objects.'
          },
          {
            choice_id: 'quiz-22-3-c',
            choice_text: '〜枚',
            is_correct: false,
            explanation: 'This counter is used for flat, thin objects like paper, not round objects.'
          }
        ]
      }
    }
  });

  // Story 23: 家族を紹介しよう
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-23-2',
      story_id: '23',
      question_text: 'How do you say "older brother" when talking about your own family?',
      question_type: '語彙',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: 'Family terms',
      quiz_choices: {
        create: [
          {
            choice_id: 'quiz-23-2-a',
            choice_text: '兄 (あに)',
            is_correct: true,
            explanation: 'When talking about your own older brother to others, use 兄 (ani).'
          },
          {
            choice_id: 'quiz-23-2-b',
            choice_text: 'お兄さん',
            is_correct: false,
            explanation: 'This is used when talking about someone else\'s older brother, not your own.'
          },
          {
            choice_id: 'quiz-23-2-c',
            choice_text: '弟 (おとうと)',
            is_correct: false,
            explanation: 'This means "younger brother", not "older brother".'
          }
        ]
      }
    }
  });

  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-23-3',
      story_id: '23',
      question_text: 'What is the respectful term for "mother" when referring to someone else\'s mother?',
      question_type: '語彙',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: 'Family honorifics',
      quiz_choices: {
        create: [
          {
            choice_id: 'quiz-23-3-a',
            choice_text: 'お母さん',
            is_correct: true,
            explanation: 'Use お母さん (okaasan) when talking about someone else\'s mother respectfully.'
          },
          {
            choice_id: 'quiz-23-3-b',
            choice_text: '母 (はは)',
            is_correct: false,
            explanation: 'This humble form is used only for your own mother when talking to others.'
          },
          {
            choice_id: 'quiz-23-3-c',
            choice_text: 'お父さん',
            is_correct: false,
            explanation: 'This refers to "father", not "mother".'
          }
        ]
      }
    }
  });

  // Story 24: 好きな食べ物
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-24-2',
      story_id: '24',
      question_text: 'How do you say "I like sushi" in Japanese?',
      question_type: '文法',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: 'Expressing likes',
      quiz_choices: {
        create: [
          {
            choice_id: 'quiz-24-2-a',
            choice_text: '私は寿司が好きです',
            is_correct: true,
            explanation: 'Correct! Use the pattern [topic] は [object] が好きです to express likes.'
          },
          {
            choice_id: 'quiz-24-2-b',
            choice_text: '私は寿司を好きです',
            is_correct: false,
            explanation: 'With 好き, you should use が not を to mark the object.'
          },
          {
            choice_id: 'quiz-24-2-c',
            choice_text: '寿司は私が好きです',
            is_correct: false,
            explanation: 'This word order means "Sushi likes me", which is incorrect.'
          }
        ]
      }
    }
  });

  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-24-3',
      story_id: '24',
      question_text: 'What does "あまり好きじゃない" mean?',
      question_type: '読解',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: 'Negative expressions',
      quiz_choices: {
        create: [
          {
            choice_id: 'quiz-24-3-a',
            choice_text: 'I don\'t like it very much',
            is_correct: true,
            explanation: 'あまり + negative form means "not very much" or "not particularly".'
          },
          {
            choice_id: 'quiz-24-3-b',
            choice_text: 'I really like it',
            is_correct: false,
            explanation: 'This phrase expresses a negative feeling, not a positive one.'
          },
          {
            choice_id: 'quiz-24-3-c',
            choice_text: 'I hate it',
            is_correct: false,
            explanation: 'This is milder than "hate" - it means "don\'t particularly like".'
          }
        ]
      }
    }
  });

  console.log('✅ Added 10 quizzes (2 per story, 5 stories)');

  // Verify counts
  for (let i = 20; i <= 24; i++) {
    const count = await prisma.quiz.count({
      where: { story_id: String(i) }
    });
    console.log(`Story ${i}: ${count} quizzes`);
  }
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
