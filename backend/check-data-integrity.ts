import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDataIntegrity() {
  console.log('=== Database Integrity Check ===\n');

  // 1. Basic counts
  const storiesCount = await prisma.story.count();
  const chaptersCount = await prisma.chapter.count();
  const choicesCount = await prisma.choice.count();
  const quizzesCount = await prisma.quiz.count();
  const quizChoicesCount = await prisma.quizChoice.count();

  console.log('Total Records:');
  console.log(`  Stories: ${storiesCount}`);
  console.log(`  Chapters: ${chaptersCount}`);
  console.log(`  Choices: ${choicesCount}`);
  console.log(`  Quizzes: ${quizzesCount}`);
  console.log(`  Quiz Choices: ${quizChoicesCount}\n`);

  // 2. Check stories with chapter/quiz counts
  const stories = await prisma.story.findMany({
    select: {
      story_id: true,
      title: true,
      level_jlpt: true,
      _count: {
        select: {
          chapters: true,
          quizzes: true,
        },
      },
    },
    orderBy: { story_id: 'asc' },
  });

  console.log('Story Details:');
  stories.forEach((story) => {
    console.log(
      `  Story ${story.story_id} (${story.level_jlpt}): ${story.title}`
    );
    console.log(`    Chapters: ${story._count.chapters}, Quizzes: ${story._count.quizzes}`);
  });
  console.log();

  // 3. Check for missing English translations
  const chapters = await prisma.chapter.findMany({
    select: {
      chapter_id: true,
      story_id: true,
      chapter_number: true,
      content_en: true,
    },
    orderBy: [{ story_id: 'asc' }, { chapter_number: 'asc' }],
  });

  const missingTranslations = chapters.filter(
    (ch) => !ch.content_en || ch.content_en.length < 10
  );

  console.log(`Translation Status:`);
  console.log(`  Total chapters: ${chapters.length}`);
  console.log(`  Missing English translations: ${missingTranslations.length}`);
  if (missingTranslations.length > 0) {
    console.log('  Chapters without proper translation:');
    missingTranslations.slice(0, 20).forEach((ch) => {
      console.log(
        `    Story ${ch.story_id}, Chapter ${ch.chapter_number} (${ch.chapter_id})`
      );
    });
    if (missingTranslations.length > 20) {
      console.log(`    ... and ${missingTranslations.length - 20} more`);
    }
  }
  console.log();

  // 4. Validate quiz structure
  const quizzes = await prisma.quiz.findMany({
    select: {
      quiz_id: true,
      story_id: true,
      question_text: true,
      _count: {
        select: {
          choices: true,
        },
      },
    },
    orderBy: { story_id: 'asc' },
  });

  const invalidQuizzes = quizzes.filter((q) => q._count.choices !== 4);

  console.log(`Quiz Structure Validation:`);
  console.log(`  Total quizzes: ${quizzes.length}`);
  console.log(`  Quizzes with incorrect choice count: ${invalidQuizzes.length}`);
  if (invalidQuizzes.length > 0) {
    console.log('  Invalid quizzes:');
    invalidQuizzes.forEach((q) => {
      console.log(
        `    Quiz ${q.quiz_id} (Story ${q.story_id}): ${q._count.choices} choices`
      );
    });
  }
  console.log();

  // 5. Check for correct answers in quizzes
  const quizzesWithChoices = await prisma.quiz.findMany({
    include: {
      choices: {
        select: {
          choice_id: true,
          is_correct: true,
        },
      },
    },
  });

  const quizzesWithoutCorrectAnswer = quizzesWithChoices.filter(
    (q) => !q.choices.some((c) => c.is_correct)
  );
  const quizzesWithMultipleCorrectAnswers = quizzesWithChoices.filter(
    (q) => q.choices.filter((c) => c.is_correct).length > 1
  );

  console.log(`Quiz Answer Validation:`);
  console.log(
    `  Quizzes without correct answer: ${quizzesWithoutCorrectAnswer.length}`
  );
  console.log(
    `  Quizzes with multiple correct answers: ${quizzesWithMultipleCorrectAnswers.length}`
  );
  if (quizzesWithoutCorrectAnswer.length > 0) {
    console.log('  Quizzes without correct answer:');
    quizzesWithoutCorrectAnswer.slice(0, 10).forEach((q) => {
      console.log(`    Quiz ${q.quiz_id} (Story ${q.story_id})`);
    });
  }
  console.log();

  // 6. Check chapter choices linkage
  const choicesData = await prisma.choice.findMany({
    select: {
      choice_id: true,
      chapter_id: true,
      next_chapter_id: true,
    },
  });

  const orphanedChoices = [];
  for (const choice of choicesData) {
    if (choice.next_chapter_id) {
      const nextChapter = await prisma.chapter.findUnique({
        where: { chapter_id: choice.next_chapter_id },
      });
      if (!nextChapter) {
        orphanedChoices.push(choice);
      }
    }
  }

  console.log(`Choice Linkage Validation:`);
  console.log(`  Total choices: ${choicesData.length}`);
  console.log(`  Orphaned choices (pointing to non-existent chapters): ${orphanedChoices.length}`);
  if (orphanedChoices.length > 0) {
    console.log('  Orphaned choices:');
    orphanedChoices.slice(0, 10).forEach((c) => {
      console.log(
        `    Choice ${c.choice_id} -> non-existent chapter ${c.next_chapter_id}`
      );
    });
  }
  console.log();

  // 7. Summary
  console.log('=== Summary ===');
  const issues = [];
  if (missingTranslations.length > 0)
    issues.push(`${missingTranslations.length} chapters without English translation`);
  if (invalidQuizzes.length > 0)
    issues.push(`${invalidQuizzes.length} quizzes with incorrect choice count`);
  if (quizzesWithoutCorrectAnswer.length > 0)
    issues.push(`${quizzesWithoutCorrectAnswer.length} quizzes without correct answer`);
  if (quizzesWithMultipleCorrectAnswers.length > 0)
    issues.push(`${quizzesWithMultipleCorrectAnswers.length} quizzes with multiple correct answers`);
  if (orphanedChoices.length > 0)
    issues.push(`${orphanedChoices.length} orphaned choices`);

  if (issues.length === 0) {
    console.log('✅ No data integrity issues found!');
  } else {
    console.log(`⚠️  Found ${issues.length} issues:`);
    issues.forEach((issue) => console.log(`  - ${issue}`));
  }

  await prisma.$disconnect();
}

checkDataIntegrity().catch((error) => {
  console.error('Error:', error);
  prisma.$disconnect();
  process.exit(1);
});
