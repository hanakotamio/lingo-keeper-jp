import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createStories1to9() {
  console.log('Creating Stories 1-9 with chapters and quizzes...\n');

  try {
    // Story 1: N5 - Convenience Store Shopping
    await createStory1();

    // Story 2: N5 - Self Introduction
    await createStory2();

    // Story 3: N4 - Restaurant Order
    await createStory3();

    // Story 4: N4 - Making Plans with Friends
    await createStory4();

    // Story 5: N3 - Job Interview
    await createStory5();

    // Story 6: N3 - Cultural Festival
    await createStory6();

    // Story 7: N2 - Business Meeting
    await createStory7();

    // Story 8: N2 - Apartment Hunting
    await createStory8();

    // Story 9: N1 - Environmental Discussion
    await createStory9();

    console.log('\n✅ All Stories 1-9 created successfully!');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function createStory1() {
  console.log('Creating Story 1: Convenience Store Shopping (N5)...');

  const existingStory = await prisma.story.findUnique({ where: { story_id: '1' } });

  if (!existingStory) {
    await prisma.story.create({
      data: {
        story_id: '1',
        title: 'コンビニで買い物',
        description: 'コンビニで買い物をする日常会話を学びます。商品を探したり、支払いをしたりする基本的な表現を練習しましょう。',
        level_jlpt: 'N5',
        level_cefr: 'A1',
        estimated_time: 5,
        root_chapter_id: 'ch-1-1',
      },
    });
    console.log('✓ Created Story 1');
  } else {
    console.log('✓ Story 1 already exists');
  }

  // Delete existing quizzes
  await prisma.quizChoice.deleteMany({
    where: { quiz_id: { in: ['quiz-1-1', 'quiz-1-2', 'quiz-1-3'] } },
  });
  await prisma.quiz.deleteMany({ where: { story_id: '1' } });

  // Quiz 1
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-1-1',
      story_id: '1',
      question_text: 'コンビニで「これをください」と言います。どういう意味ですか？',
      question_type: '語彙',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: 'コンビニで買い物',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-1-1-choice-1',
        quiz_id: 'quiz-1-1',
        choice_text: 'I would like this',
        is_correct: true,
        explanation: '「これをください」は"I would like this"という意味です。買い物で使う基本的な表現です。',
      },
      {
        choice_id: 'quiz-1-1-choice-2',
        quiz_id: 'quiz-1-1',
        choice_text: 'How much is this?',
        is_correct: false,
        explanation: '「いくらですか」は"How much is this?"です。',
      },
      {
        choice_id: 'quiz-1-1-choice-3',
        quiz_id: 'quiz-1-1',
        choice_text: 'Where is this?',
        is_correct: false,
        explanation: '「これはどこですか」は"Where is this?"です。',
      },
      {
        choice_id: 'quiz-1-1-choice-4',
        quiz_id: 'quiz-1-1',
        choice_text: 'What is this?',
        is_correct: false,
        explanation: '「これは何ですか」は"What is this?"です。',
      },
    ],
  });

  // Quiz 2
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-1-2',
      story_id: '1',
      question_text: '「お弁当はどこですか」の正しい答えはどれですか？',
      question_type: '文法',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: 'コンビニで買い物',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-1-2-choice-1',
        quiz_id: 'quiz-1-2',
        choice_text: 'あそこです',
        is_correct: true,
        explanation: '「あそこです」は場所を指す正しい答えです。"It\'s over there"という意味です。',
      },
      {
        choice_id: 'quiz-1-2-choice-2',
        quiz_id: 'quiz-1-2',
        choice_text: '300円です',
        is_correct: false,
        explanation: 'これは値段の答えです。場所を聞いているので間違いです。',
      },
      {
        choice_id: 'quiz-1-2-choice-3',
        quiz_id: 'quiz-1-2',
        choice_text: '美味しいです',
        is_correct: false,
        explanation: 'これは味の答えです。場所を聞いているので間違いです。',
      },
      {
        choice_id: 'quiz-1-2-choice-4',
        quiz_id: 'quiz-1-2',
        choice_text: 'はい、そうです',
        is_correct: false,
        explanation: 'これはyes/noの答えです。場所を聞いているので間違いです。',
      },
    ],
  });

  // Quiz 3
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-1-3',
      story_id: '1',
      question_text: '日本のコンビニで買えないものはどれですか？',
      question_type: '文化',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: 'コンビニで買い物',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-1-3-choice-1',
        quiz_id: 'quiz-1-3',
        choice_text: '新鮮な魚',
        is_correct: true,
        explanation: '日本のコンビニでは新鮮な魚は売っていません。スーパーで買います。',
      },
      {
        choice_id: 'quiz-1-3-choice-2',
        quiz_id: 'quiz-1-3',
        choice_text: 'お弁当',
        is_correct: false,
        explanation: 'コンビニでお弁当は買えます。とても人気です。',
      },
      {
        choice_id: 'quiz-1-3-choice-3',
        quiz_id: 'quiz-1-3',
        choice_text: 'おにぎり',
        is_correct: false,
        explanation: 'コンビニでおにぎりは買えます。定番商品です。',
      },
      {
        choice_id: 'quiz-1-3-choice-4',
        quiz_id: 'quiz-1-3',
        choice_text: '雑誌',
        is_correct: false,
        explanation: 'コンビニで雑誌は買えます。種類も豊富です。',
      },
    ],
  });

  console.log('✓ Created Story 1 with 3 quizzes\n');
}

async function createStory2() {
  console.log('Creating Story 2: Self Introduction (N5)...');

  const existingStory = await prisma.story.findUnique({ where: { story_id: '2' } });

  if (!existingStory) {
    await prisma.story.create({
      data: {
        story_id: '2',
        title: '自己紹介',
        description: '新しい友達に自己紹介をします。名前、出身、趣味などを話す基本表現を学びましょう。',
        level_jlpt: 'N5',
        level_cefr: 'A1',
        estimated_time: 5,
        root_chapter_id: 'ch-2-1',
      },
    });
    console.log('✓ Created Story 2');
  } else {
    console.log('✓ Story 2 already exists');
  }

  await prisma.quizChoice.deleteMany({
    where: { quiz_id: { in: ['quiz-2-1', 'quiz-2-2', 'quiz-2-3'] } },
  });
  await prisma.quiz.deleteMany({ where: { story_id: '2' } });

  // Quiz 1
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-2-1',
      story_id: '2',
      question_text: '「はじめまして」はいつ使いますか？',
      question_type: '語彙',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: '自己紹介',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-2-1-choice-1',
        quiz_id: 'quiz-2-1',
        choice_text: '初めて会った時',
        is_correct: true,
        explanation: '「はじめまして」は初めて会った時に使います。"Nice to meet you"という意味です。',
      },
      {
        choice_id: 'quiz-2-1-choice-2',
        quiz_id: 'quiz-2-1',
        choice_text: '別れる時',
        is_correct: false,
        explanation: '別れる時は「さようなら」を使います。',
      },
      {
        choice_id: 'quiz-2-1-choice-3',
        quiz_id: 'quiz-2-1',
        choice_text: '朝',
        is_correct: false,
        explanation: '朝は「おはよう」を使います。',
      },
      {
        choice_id: 'quiz-2-1-choice-4',
        quiz_id: 'quiz-2-1',
        choice_text: '夜',
        is_correct: false,
        explanation: '夜は「こんばんは」を使います。',
      },
    ],
  });

  // Quiz 2
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-2-2',
      story_id: '2',
      question_text: '「私はアメリカから来ました」の「から」は何を表しますか？',
      question_type: '文法',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: '自己紹介',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-2-2-choice-1',
        quiz_id: 'quiz-2-2',
        choice_text: '出発点',
        is_correct: true,
        explanation: '「から」は出発点を表します。"from"という意味です。',
      },
      {
        choice_id: 'quiz-2-2-choice-2',
        quiz_id: 'quiz-2-2',
        choice_text: '目的地',
        is_correct: false,
        explanation: '目的地は「に」や「へ」を使います。',
      },
      {
        choice_id: 'quiz-2-2-choice-3',
        quiz_id: 'quiz-2-2',
        choice_text: '場所',
        is_correct: false,
        explanation: '場所は「で」を使います。',
      },
      {
        choice_id: 'quiz-2-2-choice-4',
        quiz_id: 'quiz-2-2',
        choice_text: '時間',
        is_correct: false,
        explanation: '時間は「に」を使います。',
      },
    ],
  });

  // Quiz 3
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-2-3',
      story_id: '2',
      question_text: '日本で自己紹介の最後に何と言いますか？',
      question_type: '文化',
      difficulty_level: 'N5',
      is_ai_generated: false,
      source_text: '自己紹介',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-2-3-choice-1',
        quiz_id: 'quiz-2-3',
        choice_text: 'よろしくお願いします',
        is_correct: true,
        explanation: '自己紹介の最後は「よろしくお願いします」と言います。"Please treat me well"という意味です。',
      },
      {
        choice_id: 'quiz-2-3-choice-2',
        quiz_id: 'quiz-2-3',
        choice_text: 'ありがとうございます',
        is_correct: false,
        explanation: 'これは感謝の言葉です。自己紹介の最後には使いません。',
      },
      {
        choice_id: 'quiz-2-3-choice-3',
        quiz_id: 'quiz-2-3',
        choice_text: 'さようなら',
        is_correct: false,
        explanation: 'これは別れの言葉です。自己紹介の最後には使いません。',
      },
      {
        choice_id: 'quiz-2-3-choice-4',
        quiz_id: 'quiz-2-3',
        choice_text: 'いただきます',
        is_correct: false,
        explanation: 'これは食事の前に使う言葉です。',
      },
    ],
  });

  console.log('✓ Created Story 2 with 3 quizzes\n');
}

async function createStory3() {
  console.log('Creating Story 3: Restaurant Order (N4)...');

  const existingStory = await prisma.story.findUnique({ where: { story_id: '3' } });

  if (!existingStory) {
    await prisma.story.create({
      data: {
        story_id: '3',
        title: 'レストランで注文',
        description: 'レストランで食事を注文する場面を学びます。メニューの読み方、注文の仕方、支払い方法などを練習しましょう。',
        level_jlpt: 'N4',
        level_cefr: 'A2',
        estimated_time: 7,
        root_chapter_id: 'ch-3-1',
      },
    });
    console.log('✓ Created Story 3');
  } else {
    console.log('✓ Story 3 already exists');
  }

  await prisma.quizChoice.deleteMany({
    where: { quiz_id: { in: ['quiz-3-1', 'quiz-3-2', 'quiz-3-3'] } },
  });
  await prisma.quiz.deleteMany({ where: { story_id: '3' } });

  // Quiz 1
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-3-1',
      story_id: '3',
      question_text: '「ご注文はお決まりですか」という店員の質問に、まだ決めていない時は何と答えますか？',
      question_type: '読解',
      difficulty_level: 'N4',
      is_ai_generated: false,
      source_text: 'レストランで注文',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-3-1-choice-1',
        quiz_id: 'quiz-3-1',
        choice_text: 'もう少し待ってください',
        is_correct: true,
        explanation: 'まだ決めていない時は「もう少し待ってください」と言います。丁寧な表現です。',
      },
      {
        choice_id: 'quiz-3-1-choice-2',
        quiz_id: 'quiz-3-1',
        choice_text: 'これをください',
        is_correct: false,
        explanation: 'これは決まった時の表現です。',
      },
      {
        choice_id: 'quiz-3-1-choice-3',
        quiz_id: 'quiz-3-1',
        choice_text: 'お会計お願いします',
        is_correct: false,
        explanation: 'これは支払いの時の表現です。',
      },
      {
        choice_id: 'quiz-3-1-choice-4',
        quiz_id: 'quiz-3-1',
        choice_text: 'ごちそうさまでした',
        is_correct: false,
        explanation: 'これは食事の後の表現です。',
      },
    ],
  });

  // Quiz 2
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-3-2',
      story_id: '3',
      question_text: '「お飲み物は何になさいますか」の「なさる」は何の敬語ですか？',
      question_type: '文法',
      difficulty_level: 'N4',
      is_ai_generated: false,
      source_text: 'レストランで注文',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-3-2-choice-1',
        quiz_id: 'quiz-3-2',
        choice_text: '「する」の尊敬語',
        is_correct: true,
        explanation: '「なさる」は「する」の尊敬語です。相手の行動を敬う表現です。',
      },
      {
        choice_id: 'quiz-3-2-choice-2',
        quiz_id: 'quiz-3-2',
        choice_text: '「する」の謙譲語',
        is_correct: false,
        explanation: '謙譲語は「いたす」です。',
      },
      {
        choice_id: 'quiz-3-2-choice-3',
        quiz_id: 'quiz-3-2',
        choice_text: '「飲む」の尊敬語',
        is_correct: false,
        explanation: '「飲む」の尊敬語は「召し上がる」です。',
      },
      {
        choice_id: 'quiz-3-2-choice-4',
        quiz_id: 'quiz-3-2',
        choice_text: '「食べる」の尊敬語',
        is_correct: false,
        explanation: '「食べる」の尊敬語は「召し上がる」です。',
      },
    ],
  });

  // Quiz 3
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-3-3',
      story_id: '3',
      question_text: '日本のレストランで食事の後、何と言いますか？',
      question_type: '文化',
      difficulty_level: 'N4',
      is_ai_generated: false,
      source_text: 'レストランで注文',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-3-3-choice-1',
        quiz_id: 'quiz-3-3',
        choice_text: 'ごちそうさまでした',
        is_correct: true,
        explanation: '食事の後は「ごちそうさまでした」と言います。感謝の気持ちを表します。',
      },
      {
        choice_id: 'quiz-3-3-choice-2',
        quiz_id: 'quiz-3-3',
        choice_text: 'いただきます',
        is_correct: false,
        explanation: 'これは食事の前に言います。',
      },
      {
        choice_id: 'quiz-3-3-choice-3',
        quiz_id: 'quiz-3-3',
        choice_text: 'おはようございます',
        is_correct: false,
        explanation: 'これは朝の挨拶です。',
      },
      {
        choice_id: 'quiz-3-3-choice-4',
        quiz_id: 'quiz-3-3',
        choice_text: 'お疲れ様でした',
        is_correct: false,
        explanation: 'これは仕事の後などに使います。',
      },
    ],
  });

  console.log('✓ Created Story 3 with 3 quizzes\n');
}

async function createStory4() {
  console.log('Creating Story 4: Making Plans with Friends (N4)...');

  const existingStory = await prisma.story.findUnique({ where: { story_id: '4' } });

  if (!existingStory) {
    await prisma.story.create({
      data: {
        story_id: '4',
        title: '友達と約束',
        description: '友達と週末の予定を立てます。誘い方、断り方、提案の仕方などを学びましょう。',
        level_jlpt: 'N4',
        level_cefr: 'A2',
        estimated_time: 7,
        root_chapter_id: 'ch-4-1',
      },
    });
    console.log('✓ Created Story 4');
  } else {
    console.log('✓ Story 4 already exists');
  }

  await prisma.quizChoice.deleteMany({
    where: { quiz_id: { in: ['quiz-4-1', 'quiz-4-2', 'quiz-4-3'] } },
  });
  await prisma.quiz.deleteMany({ where: { story_id: '4' } });

  // Quiz 1
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-4-1',
      story_id: '4',
      question_text: '「映画を見に行きませんか」と誘われました。行きたくない時、丁寧に断るには何と言いますか？',
      question_type: '読解',
      difficulty_level: 'N4',
      is_ai_generated: false,
      source_text: '友達と約束',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-4-1-choice-1',
        quiz_id: 'quiz-4-1',
        choice_text: 'すみません、ちょっと都合が悪いです',
        is_correct: true,
        explanation: '「すみません、ちょっと都合が悪いです」は丁寧な断り方です。理由を言わずに断れます。',
      },
      {
        choice_id: 'quiz-4-1-choice-2',
        quiz_id: 'quiz-4-1',
        choice_text: 'いいえ、行きません',
        is_correct: false,
        explanation: 'これは直接的すぎて、少し失礼です。',
      },
      {
        choice_id: 'quiz-4-1-choice-3',
        quiz_id: 'quiz-4-1',
        choice_text: '行きたくないです',
        is_correct: false,
        explanation: 'これは正直ですが、相手を傷つける可能性があります。',
      },
      {
        choice_id: 'quiz-4-1-choice-4',
        quiz_id: 'quiz-4-1',
        choice_text: '映画は嫌いです',
        is_correct: false,
        explanation: 'これも直接的すぎます。',
      },
    ],
  });

  // Quiz 2
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-4-2',
      story_id: '4',
      question_text: '「土曜日は忙しいから、日曜日はどう？」の「から」は何を表しますか？',
      question_type: '文法',
      difficulty_level: 'N4',
      is_ai_generated: false,
      source_text: '友達と約束',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-4-2-choice-1',
        quiz_id: 'quiz-4-2',
        choice_text: '理由',
        is_correct: true,
        explanation: 'この「から」は理由を表します。"because"という意味です。',
      },
      {
        choice_id: 'quiz-4-2-choice-2',
        quiz_id: 'quiz-4-2',
        choice_text: '出発点',
        is_correct: false,
        explanation: '場所の出発点を表す「から」とは違います。',
      },
      {
        choice_id: 'quiz-4-2-choice-3',
        quiz_id: 'quiz-4-2',
        choice_text: '時間の始まり',
        is_correct: false,
        explanation: '時間を表す「から」とは違います。',
      },
      {
        choice_id: 'quiz-4-2-choice-4',
        quiz_id: 'quiz-4-2',
        choice_text: '方法',
        is_correct: false,
        explanation: '方法は「で」を使います。',
      },
    ],
  });

  // Quiz 3
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-4-3',
      story_id: '4',
      question_text: '日本で友達を誘う時、よく使う表現はどれですか？',
      question_type: '文化',
      difficulty_level: 'N4',
      is_ai_generated: false,
      source_text: '友達と約束',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-4-3-choice-1',
        quiz_id: 'quiz-4-3',
        choice_text: '〜しませんか',
        is_correct: true,
        explanation: '「〜しませんか」は丁寧な誘いの表現です。カジュアルな場面でも使えます。',
      },
      {
        choice_id: 'quiz-4-3-choice-2',
        quiz_id: 'quiz-4-3',
        choice_text: '〜してください',
        is_correct: false,
        explanation: 'これは依頼や命令の表現です。誘いには使いません。',
      },
      {
        choice_id: 'quiz-4-3-choice-3',
        quiz_id: 'quiz-4-3',
        choice_text: '〜しますか',
        is_correct: false,
        explanation: 'これは単なる質問です。誘いのニュアンスはありません。',
      },
      {
        choice_id: 'quiz-4-3-choice-4',
        quiz_id: 'quiz-4-3',
        choice_text: '〜しましょうか',
        is_correct: false,
        explanation: 'これは申し出の表現です。誘いとは少し違います。',
      },
    ],
  });

  console.log('✓ Created Story 4 with 3 quizzes\n');
}

async function createStory5() {
  console.log('Creating Story 5: Job Interview (N3)...');

  const existingStory = await prisma.story.findUnique({ where: { story_id: '5' } });

  if (!existingStory) {
    await prisma.story.create({
      data: {
        story_id: '5',
        title: '就職面接',
        description: 'アルバイトの面接を受けます。自己PR、志望動機、質問への答え方など、ビジネス場面での基本を学びましょう。',
        level_jlpt: 'N3',
        level_cefr: 'B1',
        estimated_time: 10,
        root_chapter_id: 'ch-5-1',
      },
    });
    console.log('✓ Created Story 5');
  } else {
    console.log('✓ Story 5 already exists');
  }

  await prisma.quizChoice.deleteMany({
    where: { quiz_id: { in: ['quiz-5-1', 'quiz-5-2', 'quiz-5-3'] } },
  });
  await prisma.quiz.deleteMany({ where: { story_id: '5' } });

  // Quiz 1
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-5-1',
      story_id: '5',
      question_text: '面接官が「志望動機を教えていただけますか」と聞きました。この質問の意図は何ですか？',
      question_type: '読解',
      difficulty_level: 'N3',
      is_ai_generated: false,
      source_text: '就職面接',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-5-1-choice-1',
        quiz_id: 'quiz-5-1',
        choice_text: 'なぜこの会社で働きたいのか知りたい',
        is_correct: true,
        explanation: '志望動機は「なぜこの会社を選んだのか」を聞く質問です。面接の基本的な質問です。',
      },
      {
        choice_id: 'quiz-5-1-choice-2',
        quiz_id: 'quiz-5-1',
        choice_text: '趣味について知りたい',
        is_correct: false,
        explanation: '趣味は別の質問です。志望動機とは関係ありません。',
      },
      {
        choice_id: 'quiz-5-1-choice-3',
        quiz_id: 'quiz-5-1',
        choice_text: '家族について知りたい',
        is_correct: false,
        explanation: '家族の話は志望動機ではありません。',
      },
      {
        choice_id: 'quiz-5-1-choice-4',
        quiz_id: 'quiz-5-1',
        choice_text: '出身地について知りたい',
        is_correct: false,
        explanation: '出身地の話は志望動機ではありません。',
      },
    ],
  });

  // Quiz 2
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-5-2',
      story_id: '5',
      question_text: '「御社」と「貴社」の違いは何ですか？',
      question_type: '文法',
      difficulty_level: 'N3',
      is_ai_generated: false,
      source_text: '就職面接',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-5-2-choice-1',
        quiz_id: 'quiz-5-2',
        choice_text: '「御社」は話し言葉、「貴社」は書き言葉',
        is_correct: true,
        explanation: '面接では「御社」、履歴書では「貴社」を使います。どちらも「your company」の敬語です。',
      },
      {
        choice_id: 'quiz-5-2-choice-2',
        quiz_id: 'quiz-5-2',
        choice_text: '「御社」の方が丁寧',
        is_correct: false,
        explanation: '丁寧さは同じです。使う場面が違います。',
      },
      {
        choice_id: 'quiz-5-2-choice-3',
        quiz_id: 'quiz-5-2',
        choice_text: '「貴社」の方が丁寧',
        is_correct: false,
        explanation: '丁寧さは同じです。使う場面が違います。',
      },
      {
        choice_id: 'quiz-5-2-choice-4',
        quiz_id: 'quiz-5-2',
        choice_text: '違いはない',
        is_correct: false,
        explanation: '使う場面に明確な違いがあります。',
      },
    ],
  });

  // Quiz 3
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-5-3',
      story_id: '5',
      question_text: '日本の面接で避けるべき服装はどれですか？',
      question_type: '文化',
      difficulty_level: 'N3',
      is_ai_generated: false,
      source_text: '就職面接',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-5-3-choice-1',
        quiz_id: 'quiz-5-3',
        choice_text: '派手な色のスーツ',
        is_correct: true,
        explanation: '日本の面接では黒や紺など落ち着いた色のスーツが基本です。派手な色は避けましょう。',
      },
      {
        choice_id: 'quiz-5-3-choice-2',
        quiz_id: 'quiz-5-3',
        choice_text: '黒のスーツ',
        is_correct: false,
        explanation: '黒のスーツは面接の定番です。',
      },
      {
        choice_id: 'quiz-5-3-choice-3',
        quiz_id: 'quiz-5-3',
        choice_text: '白いシャツ',
        is_correct: false,
        explanation: '白いシャツは面接の基本です。',
      },
      {
        choice_id: 'quiz-5-3-choice-4',
        quiz_id: 'quiz-5-3',
        choice_text: '革靴',
        is_correct: false,
        explanation: '革靴は面接に適しています。',
      },
    ],
  });

  console.log('✓ Created Story 5 with 3 quizzes\n');
}

async function createStory6() {
  console.log('Creating Story 6: Cultural Festival (N3)...');

  const existingStory = await prisma.story.findUnique({ where: { story_id: '6' } });

  if (!existingStory) {
    await prisma.story.create({
      data: {
        story_id: '6',
        title: '文化祭の準備',
        description: '学校の文化祭で出店を準備します。グループでの話し合い、役割分担、協力して作業する場面を体験しましょう。',
        level_jlpt: 'N3',
        level_cefr: 'B1',
        estimated_time: 10,
        root_chapter_id: 'ch-6-1',
      },
    });
    console.log('✓ Created Story 6');
  } else {
    console.log('✓ Story 6 already exists');
  }

  await prisma.quizChoice.deleteMany({
    where: { quiz_id: { in: ['quiz-6-1', 'quiz-6-2', 'quiz-6-3'] } },
  });
  await prisma.quiz.deleteMany({ where: { story_id: '6' } });

  // Quiz 1
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-6-1',
      story_id: '6',
      question_text: '「役割分担を決めておいた方がいいと思います」という提案に対して、賛成する返答はどれですか？',
      question_type: '読解',
      difficulty_level: 'N3',
      is_ai_generated: false,
      source_text: '文化祭の準備',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-6-1-choice-1',
        quiz_id: 'quiz-6-1',
        choice_text: 'そうですね、その方が効率的ですね',
        is_correct: true,
        explanation: '提案に同意し、さらに理由を加えています。自然な賛成の表現です。',
      },
      {
        choice_id: 'quiz-6-1-choice-2',
        quiz_id: 'quiz-6-1',
        choice_text: 'いや、そんなことないと思います',
        is_correct: false,
        explanation: 'これは反対の表現です。',
      },
      {
        choice_id: 'quiz-6-1-choice-3',
        quiz_id: 'quiz-6-1',
        choice_text: 'どうでもいいです',
        is_correct: false,
        explanation: 'これは無関心を示す表現で、協力的ではありません。',
      },
      {
        choice_id: 'quiz-6-1-choice-4',
        quiz_id: 'quiz-6-1',
        choice_text: '分かりません',
        is_correct: false,
        explanation: 'これは賛成でも反対でもありません。',
      },
    ],
  });

  // Quiz 2
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-6-2',
      story_id: '6',
      question_text: '「買い物は私がやっておきます」の「ておく」は何を表しますか？',
      question_type: '文法',
      difficulty_level: 'N3',
      is_ai_generated: false,
      source_text: '文化祭の準備',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-6-2-choice-1',
        quiz_id: 'quiz-6-2',
        choice_text: '準備・用意',
        is_correct: true,
        explanation: '「ておく」は前もって準備する、という意味です。未来のために行動することを表します。',
      },
      {
        choice_id: 'quiz-6-2-choice-2',
        quiz_id: 'quiz-6-2',
        choice_text: '完了',
        is_correct: false,
        explanation: '完了は「てしまう」を使います。',
      },
      {
        choice_id: 'quiz-6-2-choice-3',
        quiz_id: 'quiz-6-2',
        choice_text: '継続',
        is_correct: false,
        explanation: '継続は「ている」を使います。',
      },
      {
        choice_id: 'quiz-6-2-choice-4',
        quiz_id: 'quiz-6-2',
        choice_text: '試し',
        is_correct: false,
        explanation: '試しは「てみる」を使います。',
      },
    ],
  });

  // Quiz 3
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-6-3',
      story_id: '6',
      question_text: '日本の文化祭でよく見られる出店はどれですか？',
      question_type: '文化',
      difficulty_level: 'N3',
      is_ai_generated: false,
      source_text: '文化祭の準備',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-6-3-choice-1',
        quiz_id: 'quiz-6-3',
        choice_text: 'たこ焼き屋',
        is_correct: true,
        explanation: 'たこ焼き屋は文化祭の定番です。他にも焼きそば、お化け屋敷などが人気です。',
      },
      {
        choice_id: 'quiz-6-3-choice-2',
        quiz_id: 'quiz-6-3',
        choice_text: 'ブランド品の販売',
        is_correct: false,
        explanation: 'ブランド品の販売は文化祭では見られません。',
      },
      {
        choice_id: 'quiz-6-3-choice-3',
        quiz_id: 'quiz-6-3',
        choice_text: '不動産の紹介',
        is_correct: false,
        explanation: '不動産の紹介は文化祭には関係ありません。',
      },
      {
        choice_id: 'quiz-6-3-choice-4',
        quiz_id: 'quiz-6-3',
        choice_text: '車の展示',
        is_correct: false,
        explanation: '車の展示は文化祭では見られません。',
      },
    ],
  });

  console.log('✓ Created Story 6 with 3 quizzes\n');
}

async function createStory7() {
  console.log('Creating Story 7: Business Meeting (N2)...');

  const existingStory = await prisma.story.findUnique({ where: { story_id: '7' } });

  if (!existingStory) {
    await prisma.story.create({
      data: {
        story_id: '7',
        title: 'ビジネス会議',
        description: '新製品の企画会議に参加します。意見の述べ方、反対意見の伝え方、ビジネス敬語などを学びましょう。',
        level_jlpt: 'N2',
        level_cefr: 'B2',
        estimated_time: 12,
        root_chapter_id: 'ch-7-1',
      },
    });
    console.log('✓ Created Story 7');
  } else {
    console.log('✓ Story 7 already exists');
  }

  await prisma.quizChoice.deleteMany({
    where: { quiz_id: { in: ['quiz-7-1', 'quiz-7-2', 'quiz-7-3'] } },
  });
  await prisma.quiz.deleteMany({ where: { story_id: '7' } });

  // Quiz 1
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-7-1',
      story_id: '7',
      question_text: '「恐れ入りますが、その点について再考していただけないでしょうか」この発言の意図は何ですか？',
      question_type: '読解',
      difficulty_level: 'N2',
      is_ai_generated: false,
      source_text: 'ビジネス会議',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-7-1-choice-1',
        quiz_id: 'quiz-7-1',
        choice_text: '丁寧に再検討を依頼している',
        is_correct: true,
        explanation: '「恐れ入りますが」で謙遜し、「いただけないでしょうか」で丁寧に依頼しています。ビジネスで使う丁寧な表現です。',
      },
      {
        choice_id: 'quiz-7-1-choice-2',
        quiz_id: 'quiz-7-1',
        choice_text: '強く反対している',
        is_correct: false,
        explanation: '表現は丁寧で、強い反対ではありません。',
      },
      {
        choice_id: 'quiz-7-1-choice-3',
        quiz_id: 'quiz-7-1',
        choice_text: '完全に同意している',
        is_correct: false,
        explanation: '再考を求めているので、同意ではありません。',
      },
      {
        choice_id: 'quiz-7-1-choice-4',
        quiz_id: 'quiz-7-1',
        choice_text: '関心がないことを示している',
        is_correct: false,
        explanation: '再考を求めているので、関心があります。',
      },
    ],
  });

  // Quiz 2
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-7-2',
      story_id: '7',
      question_text: '「〜にもかかわらず」と「〜のに」の違いは何ですか？',
      question_type: '文法',
      difficulty_level: 'N2',
      is_ai_generated: false,
      source_text: 'ビジネス会議',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-7-2-choice-1',
        quiz_id: 'quiz-7-2',
        choice_text: '「にもかかわらず」の方がフォーマル',
        is_correct: true,
        explanation: '「にもかかわらず」は書き言葉・フォーマル、「のに」は話し言葉・カジュアルです。意味は同じです。',
      },
      {
        choice_id: 'quiz-7-2-choice-2',
        quiz_id: 'quiz-7-2',
        choice_text: '意味が全く違う',
        is_correct: false,
        explanation: '意味は同じで、フォーマル度が違います。',
      },
      {
        choice_id: 'quiz-7-2-choice-3',
        quiz_id: 'quiz-7-2',
        choice_text: '「のに」の方がフォーマル',
        is_correct: false,
        explanation: '逆です。「にもかかわらず」の方がフォーマルです。',
      },
      {
        choice_id: 'quiz-7-2-choice-4',
        quiz_id: 'quiz-7-2',
        choice_text: '使う場面に違いはない',
        is_correct: false,
        explanation: 'フォーマル度に明確な違いがあります。',
      },
    ],
  });

  // Quiz 3
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-7-3',
      story_id: '7',
      question_text: '日本のビジネス会議で避けるべき行動はどれですか？',
      question_type: '文化',
      difficulty_level: 'N2',
      is_ai_generated: false,
      source_text: 'ビジネス会議',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-7-3-choice-1',
        quiz_id: 'quiz-7-3',
        choice_text: '上司の意見に即座に反対する',
        is_correct: true,
        explanation: '日本のビジネス文化では、上司に直接反対するのは避けるべきです。丁寧に意見を述べることが重要です。',
      },
      {
        choice_id: 'quiz-7-3-choice-2',
        quiz_id: 'quiz-7-3',
        choice_text: 'メモを取る',
        is_correct: false,
        explanation: 'メモを取ることは良い習慣です。',
      },
      {
        choice_id: 'quiz-7-3-choice-3',
        quiz_id: 'quiz-7-3',
        choice_text: '質問をする',
        is_correct: false,
        explanation: '適切な質問は歓迎されます。',
      },
      {
        choice_id: 'quiz-7-3-choice-4',
        quiz_id: 'quiz-7-3',
        choice_text: '提案をする',
        is_correct: false,
        explanation: '建設的な提案は良いことです。',
      },
    ],
  });

  console.log('✓ Created Story 7 with 3 quizzes\n');
}

async function createStory8() {
  console.log('Creating Story 8: Apartment Hunting (N2)...');

  const existingStory = await prisma.story.findUnique({ where: { story_id: '8' } });

  if (!existingStory) {
    await prisma.story.create({
      data: {
        story_id: '8',
        title: '部屋探し',
        description: '不動産屋で新しいアパートを探します。条件の伝え方、契約の注意点、日本の賃貸システムを学びましょう。',
        level_jlpt: 'N2',
        level_cefr: 'B2',
        estimated_time: 12,
        root_chapter_id: 'ch-8-1',
      },
    });
    console.log('✓ Created Story 8');
  } else {
    console.log('✓ Story 8 already exists');
  }

  await prisma.quizChoice.deleteMany({
    where: { quiz_id: { in: ['quiz-8-1', 'quiz-8-2', 'quiz-8-3'] } },
  });
  await prisma.quiz.deleteMany({ where: { story_id: '8' } });

  // Quiz 1
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-8-1',
      story_id: '8',
      question_text: '不動産屋が「駅から徒歩5分圏内でいかがでしょうか」と提案しました。この表現の意味は何ですか？',
      question_type: '読解',
      difficulty_level: 'N2',
      is_ai_generated: false,
      source_text: '部屋探し',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-8-1-choice-1',
        quiz_id: 'quiz-8-1',
        choice_text: '駅から歩いて5分以内の物件を提案している',
        is_correct: true,
        explanation: '「徒歩5分圏内」は駅から歩いて5分以内の範囲という意味です。「いかがでしょうか」は丁寧な提案の表現です。',
      },
      {
        choice_id: 'quiz-8-1-choice-2',
        quiz_id: 'quiz-8-1',
        choice_text: '駅から車で5分の物件を提案している',
        is_correct: false,
        explanation: '「徒歩」は歩くことを意味します。',
      },
      {
        choice_id: 'quiz-8-1-choice-3',
        quiz_id: 'quiz-8-1',
        choice_text: '駅から自転車で5分の物件を提案している',
        is_correct: false,
        explanation: '「徒歩」は歩くことを意味します。',
      },
      {
        choice_id: 'quiz-8-1-choice-4',
        quiz_id: 'quiz-8-1',
        choice_text: '駅から電車で5分の物件を提案している',
        is_correct: false,
        explanation: '「徒歩」は歩くことを意味します。',
      },
    ],
  });

  // Quiz 2
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-8-2',
      story_id: '8',
      question_text: '「ペット可の物件をお探しとのことですが」の「とのこと」は何を表しますか？',
      question_type: '文法',
      difficulty_level: 'N2',
      is_ai_generated: false,
      source_text: '部屋探し',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-8-2-choice-1',
        quiz_id: 'quiz-8-2',
        choice_text: '伝聞（聞いた情報）',
        is_correct: true,
        explanation: '「とのこと」は伝聞を表します。事前に聞いた情報を確認する丁寧な表現です。',
      },
      {
        choice_id: 'quiz-8-2-choice-2',
        quiz_id: 'quiz-8-2',
        choice_text: '推量',
        is_correct: false,
        explanation: '推量は「だろう」「でしょう」などを使います。',
      },
      {
        choice_id: 'quiz-8-2-choice-3',
        quiz_id: 'quiz-8-2',
        choice_text: '命令',
        is_correct: false,
        explanation: '命令ではありません。情報の確認です。',
      },
      {
        choice_id: 'quiz-8-2-choice-4',
        quiz_id: 'quiz-8-2',
        choice_text: '願望',
        is_correct: false,
        explanation: '願望は「たい」などを使います。',
      },
    ],
  });

  // Quiz 3
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-8-3',
      story_id: '8',
      question_text: '日本の賃貸契約で一般的に必要な費用はどれですか？',
      question_type: '文化',
      difficulty_level: 'N2',
      is_ai_generated: false,
      source_text: '部屋探し',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-8-3-choice-1',
        quiz_id: 'quiz-8-3',
        choice_text: '敷金・礼金',
        is_correct: true,
        explanation: '敷金（保証金）と礼金（お礼金）は日本の賃貸契約で一般的な初期費用です。最近は減る傾向にあります。',
      },
      {
        choice_id: 'quiz-8-3-choice-2',
        quiz_id: 'quiz-8-3',
        choice_text: '入学金',
        is_correct: false,
        explanation: '入学金は学校で使う言葉です。',
      },
      {
        choice_id: 'quiz-8-3-choice-3',
        quiz_id: 'quiz-8-3',
        choice_text: '会費',
        is_correct: false,
        explanation: '会費はクラブなどで使う言葉です。',
      },
      {
        choice_id: 'quiz-8-3-choice-4',
        quiz_id: 'quiz-8-3',
        choice_text: '授業料',
        is_correct: false,
        explanation: '授業料は学校で使う言葉です。',
      },
    ],
  });

  console.log('✓ Created Story 8 with 3 quizzes\n');
}

async function createStory9() {
  console.log('Creating Story 9: Environmental Discussion (N1)...');

  const existingStory = await prisma.story.findUnique({ where: { story_id: '9' } });

  if (!existingStory) {
    await prisma.story.create({
      data: {
        story_id: '9',
        title: '環境問題についての討論',
        description: '大学のゼミで環境問題について討論します。高度な議論の展開、抽象的な概念の表現、論理的な主張の方法を学びましょう。',
        level_jlpt: 'N1',
        level_cefr: 'C1',
        estimated_time: 15,
        root_chapter_id: 'ch-9-1',
      },
    });
    console.log('✓ Created Story 9');
  } else {
    console.log('✓ Story 9 already exists');
  }

  await prisma.quizChoice.deleteMany({
    where: { quiz_id: { in: ['quiz-9-1', 'quiz-9-2', 'quiz-9-3'] } },
  });
  await prisma.quiz.deleteMany({ where: { story_id: '9' } });

  // Quiz 1
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-9-1',
      story_id: '9',
      question_text: '「環境保護と経済発展は両立し得るものと考えられるが、いかがお考えでしょうか」この発言の論理構造を説明してください。',
      question_type: '読解',
      difficulty_level: 'N1',
      is_ai_generated: false,
      source_text: '環境問題についての討論',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-9-1-choice-1',
        quiz_id: 'quiz-9-1',
        choice_text: '前提を提示してから相手の意見を求めている',
        is_correct: true,
        explanation: '「〜と考えられるが」で自分の立場を示し、「いかがお考えでしょうか」で相手の意見を丁寧に求めています。学術的な議論の典型的な展開です。',
      },
      {
        choice_id: 'quiz-9-1-choice-2',
        quiz_id: 'quiz-9-1',
        choice_text: '強く主張して同意を求めている',
        is_correct: false,
        explanation: '「考えられる」という柔らかい表現を使い、意見を求めているので、強い主張ではありません。',
      },
      {
        choice_id: 'quiz-9-1-choice-3',
        quiz_id: 'quiz-9-1',
        choice_text: '反対意見を述べている',
        is_correct: false,
        explanation: '反対ではなく、可能性を示して意見を求めています。',
      },
      {
        choice_id: 'quiz-9-1-choice-4',
        quiz_id: 'quiz-9-1',
        choice_text: '結論を先延ばしにしている',
        is_correct: false,
        explanation: '議論を深めるための質問であり、先延ばしではありません。',
      },
    ],
  });

  // Quiz 2
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-9-2',
      story_id: '9',
      question_text: '「〜ざるを得ない」と「〜しかない」の違いは何ですか？',
      question_type: '文法',
      difficulty_level: 'N1',
      is_ai_generated: false,
      source_text: '環境問題についての討論',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-9-2-choice-1',
        quiz_id: 'quiz-9-2',
        choice_text: '「ざるを得ない」は不本意ながら仕方なく、「しかない」は唯一の選択',
        is_correct: true,
        explanation: '「ざるを得ない」は望まないが仕方なく選択するニュアンス、「しかない」は他に選択肢がないことを表します。前者の方がよりフォーマルです。',
      },
      {
        choice_id: 'quiz-9-2-choice-2',
        quiz_id: 'quiz-9-2',
        choice_text: '意味は全く同じ',
        is_correct: false,
        explanation: 'ニュアンスとフォーマル度に違いがあります。',
      },
      {
        choice_id: 'quiz-9-2-choice-3',
        quiz_id: 'quiz-9-2',
        choice_text: '「しかない」の方がフォーマル',
        is_correct: false,
        explanation: '逆です。「ざるを得ない」の方がフォーマルです。',
      },
      {
        choice_id: 'quiz-9-2-choice-4',
        quiz_id: 'quiz-9-2',
        choice_text: '使い分ける必要はない',
        is_correct: false,
        explanation: 'ニュアンスが異なるため、使い分けが必要です。',
      },
    ],
  });

  // Quiz 3
  await prisma.quiz.create({
    data: {
      quiz_id: 'quiz-9-3',
      story_id: '9',
      question_text: '日本の学術的な討論で重視されることはどれですか？',
      question_type: '文化',
      difficulty_level: 'N1',
      is_ai_generated: false,
      source_text: '環境問題についての討論',
    },
  });

  await prisma.quizChoice.createMany({
    data: [
      {
        choice_id: 'quiz-9-3-choice-1',
        quiz_id: 'quiz-9-3',
        choice_text: '相手の意見を尊重しながら論理的に議論を展開する',
        is_correct: true,
        explanation: '日本の学術文化では、相手を尊重しつつ論理的に議論することが重要です。直接的な批判よりも建設的な対話が好まれます。',
      },
      {
        choice_id: 'quiz-9-3-choice-2',
        quiz_id: 'quiz-9-3',
        choice_text: '相手の意見を強く否定する',
        is_correct: false,
        explanation: '強い否定は避けられます。',
      },
      {
        choice_id: 'quiz-9-3-choice-3',
        quiz_id: 'quiz-9-3',
        choice_text: '自分の意見だけを主張する',
        is_correct: false,
        explanation: '対話と相互理解が重視されます。',
      },
      {
        choice_id: 'quiz-9-3-choice-4',
        quiz_id: 'quiz-9-3',
        choice_text: '声の大きさで勝つ',
        is_correct: false,
        explanation: '論理と礼儀が重視されます。',
      },
    ],
  });

  console.log('✓ Created Story 9 with 3 quizzes\n');
}

createStories1to9()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
