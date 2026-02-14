/**
 * Fix Story 9 (電車での通学) Translation Mismatches
 *
 * Based on verification, Story 9's English translations are completely wrong.
 * The Japanese is about "commuting to school by train" but the English is about
 * "studying at the library".
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixStory9() {
  console.log('🔧 Fixing Story 9 (電車での通学) translations...\n');

  try {
    // Get Story 9
    const story = await prisma.story.findFirst({
      where: {
        title: '電車での通学'
      },
      include: {
        chapters: {
          orderBy: {
            chapter_number: 'asc'
          }
        }
      }
    });

    if (!story) {
      console.log('❌ Story not found');
      return;
    }

    console.log(`📖 Story: ${story.title} (${story.level_jlpt})`);
    console.log(`   Found ${story.chapters.length} chapters\n`);

    // Correct translations for each chapter (N4 level English - intermediate)
    const correctTranslations = {
      1: `I am a university student. I commute to school by train every day. It takes one hour from my house to school.

I wake up at 7 AM. I wash my face and eat breakfast. Breakfast is bread and coffee.

I leave the house at 8 AM. It's a 5-minute walk to the station. There are many people at the station.

I buy a train ticket and go to the platform. The train arrives soon. It's already quite crowded.`,

      2: `On the train, I always look at my smartphone. I read the news and listen to music.

Sometimes I read books too. But when it's crowded, it's difficult to read books.

The train stops at three stations. Big stations are crowded. Many people get on and off.

I stand near the door. Looking out the window, I can see the city scenery passing by.`,

      3: `It takes 10 minutes to walk from the station to school. In the morning, many students are walking.

There's a convenience store on the way. Sometimes I buy drinks there. Today I bought tea.

While walking, I sometimes meet friends. "Good morning," we greet each other.

I met my friend Suzuki. "Did you do your homework?" Suzuki asked.`,

      4: `I arrived at school. I'll be fine if I get there by 9 AM. It's 8:50 now.

"What's your first class?" Suzuki asked. "English. What about you, Suzuki?" I answered.

"I have English too. We're in the same class," Suzuki said with a smile.

We walked to the classroom together. The classroom is on the third floor.`,

      5: `The class is 90 minutes long. I had English class until 11 AM. Next is math class.

Lunch is from 12 PM. I eat in the school cafeteria. What should I eat today?

All classes end at 4 PM. After that, I'll study at the library for a while.

When I get home, it will be around 6 PM. Today was a long day too.`
    };

    // Update each chapter
    for (const chapter of story.chapters) {
      const correctTranslation = correctTranslations[chapter.chapter_number as keyof typeof correctTranslations];

      if (correctTranslation) {
        console.log(`\n📝 Updating Chapter ${chapter.chapter_number}...`);
        console.log(`   Current (WRONG):\n   ${chapter.content_en?.substring(0, 100)}...`);
        console.log(`\n   New (CORRECT):\n   ${correctTranslation.substring(0, 100)}...`);

        await prisma.chapter.update({
          where: {
            chapter_id: chapter.chapter_id
          },
          data: {
            content_en: correctTranslation
          }
        });

        console.log(`   ✅ Updated!`);
      }
    }

    console.log('\n\n✅ Story 9 translations fixed successfully!\n');

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixStory9();
