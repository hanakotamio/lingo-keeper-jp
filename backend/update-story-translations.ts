import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Updating story translations...');

  const translations = [
    {
      story_id: '1',
      title_en: 'A New Life in Tokyo',
      description_en: 'Experience the first day of an international student in Tokyo. Your choices in Shibuya will change your story.',
    },
    {
      story_id: '2',
      title_en: 'Meeting at a Cafe',
      description_en: 'A heartwarming story of friendship that begins at a cafe you entered by chance.',
    },
    {
      story_id: '3',
      title_en: 'First Time at a Convenience Store',
      description_en: 'Experience shopping at a Japanese convenience store for the first time. Learn about the convenient convenience store culture of Japan.',
    },
    {
      story_id: '4',
      title_en: 'Meeting at the Station',
      description_en: 'Meeting a friend at Shinjuku Station. Learn about experiences at large Japanese train stations.',
    },
    {
      story_id: '5',
      title_en: 'Night at an Izakaya',
      description_en: 'Going to an izakaya with work colleagues. Experience Japanese drinking party culture.',
    },
    {
      story_id: '6',
      title_en: 'Hot Spring Trip',
      description_en: 'A weekend trip to a hot spring. Learn about traditional Japanese ryokan culture and hot spring etiquette.',
    },
    {
      story_id: '7',
      title_en: 'Job Interview at a Japanese Company',
      description_en: 'Job interview at a Japanese company. Experience business etiquette and interview preparation.',
    },
    {
      story_id: '8',
      title_en: 'Visiting Ancient Temples in Kyoto',
      description_en: 'A journey to explore Japanese spirituality and aesthetics in the ancient capital of Kyoto. Deeply learn about Zen philosophy and traditional culture.',
    },
    {
      story_id: '9',
      title_en: 'Business Negotiation',
      description_en: 'An important business meeting with a Japanese company. Learn advanced business Japanese and negotiation skills.',
    },
  ];

  for (const translation of translations) {
    await prisma.story.update({
      where: { story_id: translation.story_id },
      data: {
        title_en: translation.title_en,
        description_en: translation.description_en,
      },
    });
    console.log(`Updated story ${translation.story_id}: ${translation.title_en}`);
  }

  console.log('All translations updated successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
