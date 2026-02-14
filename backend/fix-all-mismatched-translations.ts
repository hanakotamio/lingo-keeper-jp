/**
 * Fix All Mismatched Translations
 *
 * This script fixes the 9 chapters with incorrect English translations:
 * - Story 3: ビジネスメールの作成 (Business Email Writing) - 4 chapters
 * - Story 10: 友達との約束 (Promise with Friend) - 1 chapter
 * - Story 25: 電車での通学 (Commuting by Train) - 4 chapters
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Translation {
  chapterId: string;
  correctTranslation: string;
}

async function fixAllMismatches(): Promise<void> {
  console.log('🔧 Fixing all mismatched translations...\n');

  const fixes: Translation[] = [
    // Story 3: ビジネスメールの作成 (N2 - Business Level)
    {
      chapterId: 'ch-17-1',
      correctTranslation: `Six months have passed since I joined the company. Recently, my supervisor has been increasingly instructing me to "send emails to business partners." Unlike my student days, business emails require strict etiquette.

Today, I must write an email to send a product catalog to Company A, a new business partner. First, I referred to a senior colleague's email to confirm the basic structure.

The subject line should be concise and clear. I wrote "Product Catalog Submission."

The greeting is also important. I wrote "Dear Company A" followed by a seasonal greeting.

Next comes the main content. "Thank you very much for your continued patronage. As per your request, we are sending you our latest product catalog." I carefully chose each word.`
    },
    {
      chapterId: 'ch-17-3',
      correctTranslation: `The closing greeting is also important. I wrote "We look forward to your continued support and cooperation."

Finally, I right-aligned "Respectfully yours" and added my signature.

"XX Corporation, Sales Department, Taro Yamada, Phone: 03-1234-5678, Email: yamada@example.com"

After finishing writing, I reviewed the content. I checked for typos and awkward phrasing.

I also confirmed that the attached file was correct. The latest catalog PDF file was attached.

The email appeared nearly complete. However, I was a bit anxious since this was my first time.`
    },
    {
      chapterId: 'ch-17-4',
      correctTranslation: `Before sending, I checked one more time. Is the recipient's email address correct? Should I CC my supervisor?

When I checked with my supervisor, they said "Please CC me." I added my supervisor's address to the CC field.

I did a final check of the subject, body, attachments, recipient, and CC. Everything seemed fine.

As I was about to click the "Send" button, I hesitated. I decided to have my senior colleague check it one more time.

"Excuse me, could you please check this email before I send it?" I asked my senior colleague.

The senior colleague readily agreed. "Sure, let me take a look."`
    },
    {
      chapterId: 'ch-17-5',
      correctTranslation: `My senior colleague looked at the screen and immediately gave feedback. "You should add a line break after the seasonal greeting. Also, 'I will send' sounds more natural than 'I will be sending.'"

I see. Attention to such details is necessary.

I made corrections according to my senior colleague's advice. "Perfect now. You can send it," my senior colleague said.

"Thank you very much!" I expressed my gratitude and clicked the send button.

The email was successfully sent. The first business email was completed without issues.

Through this experience, I realized the importance of business email etiquette. I want to continue learning many things.`
    },

    // Story 10: 友達との約束 (N4 - Intermediate Level)
    {
      chapterId: 'ch-8-1',
      correctTranslation: `Yesterday, I received a message from my friend Tanaka. The message said "Would you like to watch a movie together tomorrow?"

I like movies. I replied "That sounds good. What time shall we meet?"

Tanaka said "How about 2 PM? Let's meet at the movie theater in front of the station." "Okay. I'll be waiting in front of the station at 2," I replied.

This morning, I woke up early. Today I'm meeting Tanaka.

I ate breakfast and got ready. I chose clothes that are easy to move in.`
    },

    // Story 25: 電車での通学 (N4 - Intermediate Level)
    {
      chapterId: 'ch-9-2',
      correctTranslation: `On the train, I always look at my smartphone. I read the news and listen to music.

Sometimes I read books too. But when it's crowded, it's difficult to read books.

The train stops at three stations. At big stations, many people get off. And many people get on.

When I look out the window, I can see various scenery. There are buildings, houses, parks, rivers, and more.

After 30 minutes, I arrive at my destination station. Many people get off together.`
    },
    {
      chapterId: 'ch-9-3',
      correctTranslation: `It takes 10 minutes to walk from the station to school. In the morning, many students are walking.

There's a convenience store on the way. Sometimes I buy drinks there. Today I bought tea.

While walking, I sometimes meet friends. We greet each other saying "Good morning" and walk to school together.

Today I met my friend Suzuki. "Good morning. It was crowded today too," Suzuki said.

"Yes, it's always crowded," I replied. We walked toward school together.`
    },
    {
      chapterId: 'ch-9-4',
      correctTranslation: `I arrived at school. I'll be fine if I get there by 9 AM. It's 8:50 now.

"What's your first class?" Suzuki asked. "English. What about you, Suzuki?" I answered.

"I have English too. We're in the same class," Suzuki said. I'm happy we're in the same class.

We entered the classroom. The teacher hasn't arrived yet. I sat down and took out my textbook.

It became 9 o'clock. The teacher came and class started. "Good morning. Today we'll study new grammar," the teacher said.`
    },
    {
      chapterId: 'ch-9-5',
      correctTranslation: `The class is 90 minutes long. I had English class until 11 AM. Next is math class.

Lunch is from 12 PM. I eat at the school cafeteria. What should I eat today?

All classes end at 4 PM. After that, I'll study at the library for a while.

I leave school around 6 PM. The train home is also crowded. But it's a little less crowded than in the morning.

I arrive home at 7 PM. I say "I'm home" and enter the house. I worked hard today too. Tomorrow I'll go to school by train again.`
    }
  ];

  console.log(`📊 Total fixes to apply: ${fixes.length}\n`);

  let fixedCount = 0;

  for (const fix of fixes) {
    try {
      // Get chapter info first
      const chapter = await prisma.chapter.findUnique({
        where: { chapter_id: fix.chapterId },
        include: {
          story: true
        }
      });

      if (!chapter) {
        console.log(`❌ Chapter ${fix.chapterId} not found - skipping`);
        continue;
      }

      console.log(`\n${'='.repeat(80)}`);
      console.log(`📝 Fixing Chapter ${fix.chapterId}`);
      console.log(`   Story: ${chapter.story.title} (${chapter.story.level_jlpt || 'N/A'})`);
      console.log(`   Chapter ${chapter.chapter_number}: ${chapter.title}`);

      console.log(`\n   ❌ OLD (WRONG):`);
      console.log(`   ${chapter.content_en?.substring(0, 150)}...`);

      console.log(`\n   ✅ NEW (CORRECT):`);
      console.log(`   ${fix.correctTranslation.substring(0, 150)}...`);

      // Update the translation
      await prisma.chapter.update({
        where: { chapter_id: fix.chapterId },
        data: { content_en: fix.correctTranslation }
      });

      fixedCount++;
      console.log(`\n   ✅ Updated successfully! (${fixedCount}/${fixes.length})`);

    } catch (error) {
      console.log(`   ❌ Error fixing chapter ${fix.chapterId}:`, error);
    }
  }

  console.log(`\n\n${'='.repeat(80)}`);
  console.log(`🎉 FIXING COMPLETE`);
  console.log(`${'='.repeat(80)}`);
  console.log(`Total fixes attempted: ${fixes.length}`);
  console.log(`Successfully fixed: ${fixedCount}`);
  console.log(`Failed: ${fixes.length - fixedCount}`);
  console.log(`${'='.repeat(80)}\n`);

  await prisma.$disconnect();
}

fixAllMismatches();
