import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixStory8() {
  const fixes = [
    {
      chapterId: 'ch-8-2',
      translation: `"Hello! Did you wait long?" I asked. "No, I just arrived too," Tanaka answered.

We entered the movie theater. There were many movie posters. "Which movie do you want to see?" Tanaka asked.

I said "How about the new anime movie?" "That sounds good. I wanted to see that too," Tanaka said.

We bought tickets. They were 1,800 yen each. "The next showing is at 2:30 or 3:30," the staff said.

We chose the 2:30 showing. We still have 30 minutes until the movie starts.`
    },
    {
      chapterId: 'ch-8-3',
      translation: `We ordered coffee at a cafe. Tanaka ordered tea.

"Have you been busy lately?" Tanaka asked. "Yes, I have a lot of work. But I'm happy because today is my day off," I answered.

"I see. I'm the same. I want to rest and refresh sometimes," Tanaka said.

While drinking coffee, we talked about various things. We talked about work, hobbies, family, and more.

Time passed quickly. "It's almost time for the movie. Let's go," Tanaka said.`
    },
    {
      chapterId: 'ch-8-4',
      translation: `We entered the theater hall. There were many people. Our seats were good seats in the middle.

The movie started. It was very interesting. There were funny parts and moving parts.

The movie was two hours long. It ended in no time. "It was really good," Tanaka said. "It was really interesting," I said too.

When we left the theater, it was already 4:30. "I'm hungry. Shall we eat something?" Tanaka said. "Yes, let's eat," I answered.`
    },
    {
      chapterId: 'ch-8-5',
      translation: `We entered a ramen shop. It was warm and smelled good.

"What kind of ramen will you have?" Tanaka asked. "I'll have miso ramen," I answered. "I'll have soy sauce ramen," Tanaka said.

The ramen arrived. It looked hot and delicious. We said "Itadakimasu" and started eating.

"It's delicious," Tanaka said. "Yes it is. The ramen here is really delicious," I answered.

We finished eating ramen. "Today was fun. Thank you," I said. "Me too. Let's go out together again," Tanaka said. Today was a wonderful day.`
    }
  ];

  console.log('🔧 Fixing Story 8 (友達との約束) remaining chapters...\n');

  for (const fix of fixes) {
    await prisma.chapter.update({
      where: { chapter_id: fix.chapterId },
      data: { content_en: fix.translation }
    });

    console.log(`✅ Fixed ${fix.chapterId}`);
  }

  console.log('\n✅ All Story 8 chapters fixed!\n');
  await prisma.$disconnect();
}

fixStory8();
