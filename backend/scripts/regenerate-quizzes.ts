import { PrismaClient } from '@prisma/client';
import { openaiService } from '../src/services/openai.service';

const prisma = new PrismaClient();

/**
 * Regenerate quizzes for existing stories
 * This script deletes old quizzes and generates new, improved ones
 */
async function regenerateQuizzes() {
  console.log('Starting quiz regeneration...\n');

  try {
    // Get stories 11-20 (the beginner stories)
    const stories = await prisma.story.findMany({
      where: {
        story_id: {
          in: ['11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
        },
      },
      include: {
        chapters: {
          where: {
            chapter_number: 1, // Only use chapter 1 for quiz generation
          },
          include: {
            choices: true,
          },
        },
      },
    });

    console.log(`Found ${stories.length} stories to regenerate quizzes for\n`);

    for (const story of stories) {
      console.log(`\n=== Processing Story ${story.story_id}: ${story.title} ===`);

      // Delete existing quizzes
      const deletedQuizzes = await prisma.quiz.deleteMany({
        where: {
          story_id: story.story_id,
          is_ai_generated: true,
        },
      });
      console.log(`Deleted ${deletedQuizzes.count} old quizzes`);

      // Get chapter 1 content (all users see this)
      const chapter1 = story.chapters[0];
      if (!chapter1) {
        console.log(`⚠️  No chapter 1 found for story ${story.story_id}, skipping...`);
        continue;
      }

      // Prepare story content for quiz generation
      const storyContent = `
Story Title: ${story.title}
Level: ${story.level_jlpt} (JLPT) / ${story.level_cefr} (CEFR)

Chapter 1 Content:
Japanese: ${chapter1.content}
English: ${chapter1.translation}

Vocabulary from Chapter 1:
${chapter1.vocabulary.map((v: any) => `- ${v.word} (${v.reading}): ${v.meaning}`).join('\n')}
`;

      console.log('Generating new quizzes...');

      // Generate new quizzes using improved prompt
      const generatedQuizzes = await openaiService.generateQuizQuestions({
        storyContent,
        level: story.level_jlpt,
        count: 3,
      });

      // Create quizzes in database
      for (let i = 0; i < generatedQuizzes.quizzes.length; i++) {
        const quizData = generatedQuizzes.quizzes[i];
        const quizId = `quiz-${story.story_id}-${i + 1}`;

        await prisma.quiz.create({
          data: {
            quiz_id: quizId,
            story_id: story.story_id,
            question_text: quizData.question_text,
            question_type: quizData.question_type,
            difficulty_level: story.level_jlpt,
            is_ai_generated: true,
            source_text: story.title,
          },
        });

        // Create quiz choices
        const quizChoices = quizData.choices.map((choice: any, index: number) => ({
          choice_id: `${quizId}-choice-${index + 1}`,
          quiz_id: quizId,
          choice_text: choice.choice_text,
          is_correct: choice.is_correct,
          explanation: choice.explanation || '',
        }));

        await prisma.quizChoice.createMany({
          data: quizChoices,
        });

        console.log(`  ✓ Created quiz ${i + 1}/${generatedQuizzes.quizzes.length}: ${quizData.question_text}`);
        console.log(`    Type: ${quizData.question_type}`);
        console.log(`    Correct answer: ${quizChoices.find((c: any) => c.is_correct)?.choice_text}`);
      }

      console.log(`✓ Completed story ${story.story_id}`);

      // Wait 1 second to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log('\n\n✅ Quiz regeneration completed successfully!');
    console.log(`Total stories processed: ${stories.length}`);
  } catch (error) {
    console.error('❌ Error during quiz regeneration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
regenerateQuizzes()
  .then(() => {
    console.log('\n✓ Script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
