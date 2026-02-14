import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixChapter() {
  const correctTranslation = `I started writing "Dear Sir/Madam, in this early summer season, I sincerely hope your company is prospering."

Seasonal greetings need to be changed according to the season. Since it's May now, I used "early summer season."

Next, I move to the main topic. "Regarding the products of our company that you inquired about recently, we are sending the catalog you requested."

I paid attention to polite language. I properly used humble and respectful language such as "inquire," "receive," "our company," "regarding," "request," and "send."

"Please check the attached file, and if you have any questions, please feel free to contact us," I continued.`;

  await prisma.chapter.update({
    where: { chapter_id: 'ch-17-2' },
    data: { content_en: correctTranslation }
  });

  console.log('✅ Fixed Story 17, Chapter 2');
  console.log('\nNew translation:');
  console.log(correctTranslation);

  await prisma.$disconnect();
}

fixChapter();
