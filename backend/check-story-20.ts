import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const story = await prisma.story.findUnique({
    where: { story_id: '20' },
    include: {
      chapters: {
        orderBy: { chapter_number: 'asc' },
        include: { choices: { orderBy: { display_order: 'asc' } } }
      },
      quizzes: true
    }
  });

  if (!story) {
    console.log('Story 20 not found');
    return;
  }

  console.log(`\n=== ${story.title} ===`);
  console.log(`Chapters: ${story.chapters.length}`);

  story.chapters.forEach(ch => {
    console.log(`\nChapter ${ch.chapter_number} (${ch.chapter_id}):`);
    console.log(`  Parent: ${ch.parent_chapter_id || 'ROOT'}`);
    console.log(`  Content: ${ch.content.substring(0, 60)}...`);
    console.log(`  Choices: ${ch.choices.length}`);
    ch.choices.forEach(choice => {
      console.log(`    - ${choice.choice_text} → ${choice.next_chapter_id || 'END'}`);
    });
  });

  console.log(`\n\nQuizzes: ${story.quizzes.length}`);
  story.quizzes.forEach((quiz, i) => {
    console.log(`  Quiz ${i+1}: ${quiz.question_text.substring(0, 60)}...`);
  });
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
