import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fixing pronunciation issues...');

  // Fix Story 3, Chapter 4
  await prisma.chapter.update({
    where: { chapter_id: 'ch-3-4' },
    data: {
      content: 'レジに来ました。店員さんが「いらっしゃいませ」と言いました。お金をはらいます。店員さんが「お箸はお付けしますか？」と聞きました。日本語で答えます。「はい、お願いします」と言いました。',
    },
  });

  console.log('✅ Fixed ch-3-4: 払います → はらいます');

  // Fix Story 8, Chapter 2c
  await prisma.chapter.update({
    where: { chapter_id: 'ch-8-2c' },
    data: {
      content: '境内を歩いていると、若い僧侶に出会いました。勇気を出して、仏教について質問しました。「禅とは何ですか？」と尋ねると、僧侶は微笑んで答えました。「禅は言葉では説明できません。座禅を組んで、自分の心と向き合うことです。今この瞬間に集中し、雑念をはらうことで、本当の自分に気づくのです」。その言葉は、私の心に深く響きました。',
    },
  });

  console.log('✅ Fixed ch-8-2c: 払う → はらう');

  console.log('\n✅ All pronunciation issues fixed!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
