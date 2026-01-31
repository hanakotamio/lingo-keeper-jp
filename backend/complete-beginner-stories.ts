import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function completeBeginnerStories() {
  console.log('=== 入門ストーリーの完成開始 ===\n');

  try {
    // Story 11: 自己紹介 - チャプターは既に存在するため、クイズのみ追加
    console.log('Story 11「自己紹介」にクイズを追加中...');

    // Story 11用のクイズを作成
    const quiz11_1 = await prisma.quiz.findUnique({ where: { quiz_id: 'quiz-11-1' } });
    if (!quiz11_1) {
      await prisma.quiz.create({
        data: {
          quiz_id: 'quiz-11-1',
          story_id: '11',
          question_text: 'マリアは　どこから　来ましたか？',
          question_type: '読解',
          difficulty_level: 'N5',
          is_ai_generated: false,
          source_text: 'アメリカから　来ました',
          quiz_choices: {
            create: [
              { choice_id: 'quiz-11-1-choice-1', choice_text: '日本', is_correct: false, explanation: '不正解です。日本ではありません。' },
              { choice_id: 'quiz-11-1-choice-2', choice_text: 'アメリカ', is_correct: true, explanation: '正解です。マリアはアメリカから来ました。' },
              { choice_id: 'quiz-11-1-choice-3', choice_text: 'イギリス', is_correct: false, explanation: '不正解です。イギリスではありません。' }
            ]
          }
        }
      });
    }

    const quiz11_2 = await prisma.quiz.findUnique({ where: { quiz_id: 'quiz-11-2' } });
    if (!quiz11_2) {
      await prisma.quiz.create({
        data: {
          quiz_id: 'quiz-11-2',
          story_id: '11',
          question_text: '「こんにちは」は　英語で　何ですか？',
          question_type: '語彙',
          difficulty_level: 'N5',
          is_ai_generated: false,
          source_text: 'こんにちは',
          quiz_choices: {
            create: [
              { choice_id: 'quiz-11-2-choice-1', choice_text: 'Hello', is_correct: true, explanation: '正解です。「こんにちは」はHelloです。' },
              { choice_id: 'quiz-11-2-choice-2', choice_text: 'Goodbye', is_correct: false, explanation: '不正解です。Goodbyeは「さようなら」です。' },
              { choice_id: 'quiz-11-2-choice-3', choice_text: 'Thank you', is_correct: false, explanation: '不正解です。Thank youは「ありがとう」です。' }
            ]
          }
        }
      });
    }

    console.log('✅ Story 11完成\n');

    // Story 13: 数字を数える - チャプター追加
    console.log('Story 13「数字を数える」にチャプターとクイズを追加中...');

    const ch13_2 = await prisma.chapter.findUnique({ where: { chapter_id: 'ch-13-2' } });
    if (!ch13_2) {
      await prisma.chapter.create({
        data: {
          chapter_id: 'ch-13-2',
          story_id: '13',
          parent_chapter_id: 'ch-13-1',
          chapter_number: 2,
          depth_level: 1,
          content: 'みかんが　いくつ　ありますか？　ご　つ　あります。りんごは？　さん　つ　あります。ぜんぶで　はち　つ　あります。',
          content_with_ruby: 'みかんが　いくつ　ありますか？　ご　つ　あります。りんごは？　さん　つ　あります。ぜんぶで　はち　つ　あります。',
          translation: 'How many oranges are there? There are five. And apples? There are three. In total, there are eight.'
        }
      });
    }

    // Story 13用のクイズ
    const quiz13_1 = await prisma.quiz.findUnique({ where: { quiz_id: 'quiz-13-1' } });
    if (!quiz13_1) {
      await prisma.quiz.create({
        data: {
          quiz_id: 'quiz-13-1',
          story_id: '13',
          question_text: 'りんごは　いくつ　ありますか？',
          question_type: '読解',
          difficulty_level: 'N5',
          is_ai_generated: false,
          source_text: 'りんごが　3つ　あります',
          quiz_choices: {
            create: [
              { choice_id: 'quiz-13-1-choice-1', choice_text: '2つ', is_correct: false, explanation: '不正解です。2つではありません。' },
              { choice_id: 'quiz-13-1-choice-2', choice_text: '3つ', is_correct: true, explanation: '正解です。りんごは3つあります。' },
              { choice_id: 'quiz-13-1-choice-3', choice_text: '5つ', is_correct: false, explanation: '不正解です。5つはみかんです。' }
            ]
          }
        }
      });
    }

    const quiz13_2 = await prisma.quiz.findUnique({ where: { quiz_id: 'quiz-13-2' } });
    if (!quiz13_2) {
      await prisma.quiz.create({
        data: {
          quiz_id: 'quiz-13-2',
          story_id: '13',
          question_text: '「5」は　日本語で　何ですか？',
          question_type: '語彙',
          difficulty_level: 'N5',
          is_ai_generated: false,
          source_text: '数字',
          quiz_choices: {
            create: [
              { choice_id: 'quiz-13-2-choice-1', choice_text: 'し', is_correct: false, explanation: '不正解です。「し」は4です。' },
              { choice_id: 'quiz-13-2-choice-2', choice_text: 'ご', is_correct: true, explanation: '正解です。5は「ご」です。' },
              { choice_id: 'quiz-13-2-choice-3', choice_text: 'ろく', is_correct: false, explanation: '不正解です。「ろく」は6です。' }
            ]
          }
        }
      });
    }

    console.log('✅ Story 13完成\n');

    // Story 14: 色を覚える - チャプター追加
    console.log('Story 14「色を覚える」にチャプターとクイズを追加中...');

    const ch14_2 = await prisma.chapter.findUnique({ where: { chapter_id: 'ch-14-2' } });
    if (!ch14_2) {
      await prisma.chapter.create({
        data: {
          chapter_id: 'ch-14-2',
          story_id: '14',
          parent_chapter_id: 'ch-14-1',
          chapter_number: 2,
          depth_level: 1,
          content: 'あなたの　好きな　色は　何ですか？　わたしは　青が　好きです。そらの　色だから　好きです。',
          content_with_ruby: 'あなたの　<ruby>好<rt>す</rt></ruby>きな　<ruby>色<rt>いろ</rt></ruby>は　<ruby>何<rt>なん</rt></ruby>ですか？　わたしは　<ruby>青<rt>あお</rt></ruby>が　<ruby>好<rt>す</rt></ruby>きです。そらの　<ruby>色<rt>いろ</rt></ruby>だから　<ruby>好<rt>す</rt></ruby>きです。',
          translation: 'What is your favorite color? I like blue. Because it is the color of the sky.'
        }
      });
    }

    // Story 14用のクイズ
    const quiz14_1 = await prisma.quiz.findUnique({ where: { quiz_id: 'quiz-14-1' } });
    if (!quiz14_1) {
      await prisma.quiz.create({
        data: {
          quiz_id: 'quiz-14-1',
          story_id: '14',
          question_text: 'りんごは　何色ですか？',
          question_type: '読解',
          difficulty_level: 'N5',
          is_ai_generated: false,
          source_text: 'りんごは　赤いです',
          quiz_choices: {
            create: [
              { choice_id: 'quiz-14-1-choice-1', choice_text: '赤', is_correct: true, explanation: '正解です。りんごは赤いです。' },
              { choice_id: 'quiz-14-1-choice-2', choice_text: '青', is_correct: false, explanation: '不正解です。青はそらです。' },
              { choice_id: 'quiz-14-1-choice-3', choice_text: '黄色', is_correct: false, explanation: '不正解です。黄色はバナナです。' }
            ]
          }
        }
      });
    }

    const quiz14_2 = await prisma.quiz.findUnique({ where: { quiz_id: 'quiz-14-2' } });
    if (!quiz14_2) {
      await prisma.quiz.create({
        data: {
          quiz_id: 'quiz-14-2',
          story_id: '14',
          question_text: '「green」は　日本語で　何ですか？',
          question_type: '語彙',
          difficulty_level: 'N5',
          is_ai_generated: false,
          source_text: '色',
          quiz_choices: {
            create: [
              { choice_id: 'quiz-14-2-choice-1', choice_text: '緑', is_correct: true, explanation: '正解です。greenは「緑」です。' },
              { choice_id: 'quiz-14-2-choice-2', choice_text: '青', is_correct: false, explanation: '不正解です。「青」はblueです。' },
              { choice_id: 'quiz-14-2-choice-3', choice_text: '黒', is_correct: false, explanation: '不正解です。「黒」はblackです。' }
            ]
          }
        }
      });
    }

    console.log('✅ Story 14完成\n');

    // Story 15: 家族を紹介する - チャプター追加
    console.log('Story 15「家族を紹介する」にチャプターとクイズを追加中...');

    const ch15_2 = await prisma.chapter.findUnique({ where: { chapter_id: 'ch-15-2' } });
    if (!ch15_2) {
      await prisma.chapter.create({
        data: {
          chapter_id: 'ch-15-2',
          story_id: '15',
          parent_chapter_id: 'ch-15-1',
          chapter_number: 2,
          depth_level: 1,
          content: 'あなたの　家族は　何人ですか？　わたしの　家族は　4人です。父と　母と　兄と　わたしです。',
          content_with_ruby: 'あなたの　<ruby>家族<rt>かぞく</rt></ruby>は　<ruby>何人<rt>なんにん</rt></ruby>ですか？　わたしの　<ruby>家族<rt>かぞく</rt></ruby>は　4<ruby>人<rt>にん</rt></ruby>です。<ruby>父<rt>ちち</rt></ruby>と　<ruby>母<rt>はは</rt></ruby>と　<ruby>兄<rt>あに</rt></ruby>と　わたしです。',
          translation: 'How many people are in your family? There are 4 people in my family. My father, mother, older brother, and me.'
        }
      });
    }

    // Story 15用のクイズ
    const quiz15_1 = await prisma.quiz.findUnique({ where: { quiz_id: 'quiz-15-1' } });
    if (!quiz15_1) {
      await prisma.quiz.create({
        data: {
          quiz_id: 'quiz-15-1',
          story_id: '15',
          question_text: '父は　何の　仕事を　していますか？',
          question_type: '読解',
          difficulty_level: 'N5',
          is_ai_generated: false,
          source_text: '父は　会社員です',
          quiz_choices: {
            create: [
              { choice_id: 'quiz-15-1-choice-1', choice_text: '会社員', is_correct: true, explanation: '正解です。父は会社員です。' },
              { choice_id: 'quiz-15-1-choice-2', choice_text: '先生', is_correct: false, explanation: '不正解です。先生は母です。' },
              { choice_id: 'quiz-15-1-choice-3', choice_text: '大学生', is_correct: false, explanation: '不正解です。大学生は兄です。' }
            ]
          }
        }
      });
    }

    const quiz15_2 = await prisma.quiz.findUnique({ where: { quiz_id: 'quiz-15-2' } });
    if (!quiz15_2) {
      await prisma.quiz.create({
        data: {
          quiz_id: 'quiz-15-2',
          story_id: '15',
          question_text: '「mother」は　日本語で　何ですか？',
          question_type: '語彙',
          difficulty_level: 'N5',
          is_ai_generated: false,
          source_text: '家族',
          quiz_choices: {
            create: [
              { choice_id: 'quiz-15-2-choice-1', choice_text: '父', is_correct: false, explanation: '不正解です。「父」はfatherです。' },
              { choice_id: 'quiz-15-2-choice-2', choice_text: '母', is_correct: true, explanation: '正解です。motherは「母」です。' },
              { choice_id: 'quiz-15-2-choice-3', choice_text: '兄', is_correct: false, explanation: '不正解です。「兄」はolder brotherです。' }
            ]
          }
        }
      });
    }

    console.log('✅ Story 15完成\n');

    // Story 16: 簡単な買い物 - チャプター追加
    console.log('Story 16「簡単な買い物」にチャプターとクイズを追加中...');

    const ch16_2 = await prisma.chapter.findUnique({ where: { chapter_id: 'ch-16-2' } });
    if (!ch16_2) {
      await prisma.chapter.create({
        data: {
          chapter_id: 'ch-16-2',
          story_id: '16',
          parent_chapter_id: 'ch-16-1',
          chapter_number: 2,
          depth_level: 1,
          content: 'お金を　払いました。りんごを　もらいました。「ありがとう　ございました」と　言いました。お店を　出ました。りんごを　食べます。おいしいです。',
          content_with_ruby: 'お<ruby>金<rt>かね</rt></ruby>を　<ruby>払<rt>はら</rt></ruby>いました。りんごを　もらいました。「ありがとう　ございました」と　<ruby>言<rt>い</rt></ruby>いました。お<ruby>店<rt>みせ</rt></ruby>を　<ruby>出<rt>で</rt></ruby>ました。りんごを　<ruby>食<rt>た</rt></ruby>べます。おいしいです。',
          translation: 'I paid the money. I received the apple. I said "Thank you very much." I left the shop. I eat the apple. It is delicious.'
        }
      });
    }

    // Story 16用のクイズ
    const quiz16_1 = await prisma.quiz.findUnique({ where: { quiz_id: 'quiz-16-1' } });
    if (!quiz16_1) {
      await prisma.quiz.create({
        data: {
          quiz_id: 'quiz-16-1',
          story_id: '16',
          question_text: '何を　買いましたか？',
          question_type: '読解',
          difficulty_level: 'N5',
          is_ai_generated: false,
          source_text: 'りんごを　見ます',
          quiz_choices: {
            create: [
              { choice_id: 'quiz-16-1-choice-1', choice_text: 'りんご', is_correct: true, explanation: '正解です。りんごを買いました。' },
              { choice_id: 'quiz-16-1-choice-2', choice_text: 'みかん', is_correct: false, explanation: '不正解です。みかんではありません。' },
              { choice_id: 'quiz-16-1-choice-3', choice_text: 'バナナ', is_correct: false, explanation: '不正解です。バナナではありません。' }
            ]
          }
        }
      });
    }

    const quiz16_2 = await prisma.quiz.findUnique({ where: { quiz_id: 'quiz-16-2' } });
    if (!quiz16_2) {
      await prisma.quiz.create({
        data: {
          quiz_id: 'quiz-16-2',
          story_id: '16',
          question_text: '「これ　ください」は　英語で　何ですか？',
          question_type: '語彙',
          difficulty_level: 'N5',
          is_ai_generated: false,
          source_text: '買い物',
          quiz_choices: {
            create: [
              { choice_id: 'quiz-16-2-choice-1', choice_text: 'This, please', is_correct: true, explanation: '正解です。「これ　ください」はThis, pleaseです。' },
              { choice_id: 'quiz-16-2-choice-2', choice_text: 'How much?', is_correct: false, explanation: '不正解です。How much?は「いくらですか？」です。' },
              { choice_id: 'quiz-16-2-choice-3', choice_text: 'Thank you', is_correct: false, explanation: '不正解です。Thank youは「ありがとう」です。' }
            ]
          }
        }
      });
    }

    console.log('✅ Story 16完成\n');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

completeBeginnerStories()
  .then(() => {
    console.log('=== すべての入門ストーリーを完成させました ===');
    process.exit(0);
  })
  .catch((error) => {
    console.error('完成に失敗しました:', error);
    process.exit(1);
  });
