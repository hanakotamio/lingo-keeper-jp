import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fix() {
  const correctTranslation = `I am a university student. I commute to school by train every day. It takes one hour from my house to school.

I wake up at 7 AM. I wash my face and eat breakfast. Breakfast is bread and coffee.

I leave the house at 8 AM. It's a 5-minute walk to the station. The station is always crowded.

I take the 8:10 train. This train is an express, so it arrives at my destination station in 30 minutes.

The train is very crowded. I often can't find a seat. Standing for the trip is a bit tiring.`;

  await prisma.chapter.update({
    where: { chapter_id: 'ch-9-1' },
    data: { content_en: correctTranslation }
  });

  console.log('✅ Fixed Story 9, Chapter 1\n');
  console.log('New translation:');
  console.log(correctTranslation);

  await prisma.$disconnect();
}

fix();
