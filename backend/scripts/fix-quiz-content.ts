import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('クイズ内容を自然な日本語に修正中...\n');

  try {
    // ストーリー3（初めてのコンビニ）のクイズを修正

    // クイズ2を修正：「お箸が必要か」→「袋が必要か」に変更
    // これはどの商品を買っても自然な質問
    await prisma.quiz.update({
      where: { quiz_id: 'quiz-3-2' },
      data: {
        question_text: '店員さんは何を聞きましたか？',
      },
    });

    // クイズ2の選択肢を修正
    await prisma.quizChoice.updateMany({
      where: {
        quiz_id: 'quiz-3-2',
        choice_text: '袋が必要か'
      },
      data: {
        is_correct: true,
        explanation: '正解です。日本のコンビニでは「袋はご利用ですか？」とよく聞かれます。',
      },
    });

    await prisma.quizChoice.updateMany({
      where: {
        quiz_id: 'quiz-3-2',
        choice_text: 'お箸が必要か'
      },
      data: {
        is_correct: false,
        explanation: '不正解です。お箸はおにぎりやお弁当を買った時に聞かれます。',
      },
    });

    await prisma.quizChoice.updateMany({
      where: {
        quiz_id: 'quiz-3-2',
        choice_text: '温めるか'
      },
      data: {
        explanation: '不正解です。温めるのはお弁当やおにぎりを買った時です。',
      },
    });

    await prisma.quizChoice.updateMany({
      where: {
        quiz_id: 'quiz-3-2',
        choice_text: 'カードで払うか'
      },
      data: {
        explanation: '不正解です。支払い方法は自分から伝えます。',
      },
    });

    console.log('✅ クイズ3-2を修正しました');

    // 他のストーリーのクイズも確認
    const allQuizzes = await prisma.quiz.findMany({
      include: {
        quiz_choices: true,
      },
      orderBy: {
        quiz_id: 'asc',
      },
    });

    console.log(`\n📊 全クイズ確認完了（${allQuizzes.length}個）`);

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('\n✅ クイズ修正完了！');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ 修正失敗:', error);
    process.exit(1);
  });
