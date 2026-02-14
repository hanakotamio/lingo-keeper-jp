import prisma from './src/lib/db.js';

async function checkChapters() {
  const stories = await prisma.story.findMany({
    include: {
      chapters: {
        select: {
          chapter_id: true,
          chapter_number: true,
          title: true,
        },
        orderBy: { chapter_number: 'asc' }
      }
    },
    orderBy: { story_id: 'asc' }
  });

  console.log('=== CHAPTERS PER STORY ===\n');

  const byLevel: Record<string, any[]> = {};
  for (const story of stories) {
    const level = `${story.level_jlpt}/${story.level_cefr}`;
    if (!byLevel[level]) byLevel[level] = [];
    byLevel[level].push({
      id: story.story_id,
      title: story.title,
      chaptersCount: story.chapters.length,
      chapters: story.chapters
    });
  }

  for (const [level, storyList] of Object.entries(byLevel)) {
    console.log(`${level}:`);
    for (const s of storyList) {
      console.log(`  [Story ${s.id}] ${s.title}: ${s.chaptersCount} chapters`);
      if (s.chaptersCount < 5) {
        console.log(`    ⚠️  Need ${5 - s.chaptersCount} more chapters`);
      }
    }
    console.log();
  }

  await prisma.$disconnect();
}

checkChapters();
