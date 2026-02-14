import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fixing unnatural chopsticks question...');

  // Fix Story 3, Chapter 4
  await prisma.chapter.update({
    where: { chapter_id: 'ch-3-4' },
    data: {
      content: 'レジに来ました。店員さんが「いらっしゃいませ」と言いました。お金をはらいます。店員さんが「袋はいりますか？」と聞きました。日本語で答えます。「はい、お願いします」と言いました。',
      content_en: 'I came to the register. The staff said "Welcome." I pay the money. The staff asked "Would you like a bag?" I answer in Japanese. I said "Yes, please."',
    },
  });

  console.log('✅ Fixed ch-3-4: お箸はお付けしますか？ → 袋はいりますか？');
  console.log('✅ Fixed translation: Would you like chopsticks? → Would you like a bag?');

  console.log('\n✅ All fixes completed!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
