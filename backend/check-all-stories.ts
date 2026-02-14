import prisma from './src/lib/db.js';

async function checkAllStories() {
  const stories = await prisma.story.findMany({
    orderBy: [
      { level_jlpt: 'desc' },
      { created_at: 'asc' }
    ]
  });

  console.log('=== ALL STORIES IN DATABASE ===');
  console.log('Total stories:', stories.length);
  console.log('');

  const byLevel: Record<string, any[]> = {};
  for (const story of stories) {
    const level = `${story.level_jlpt}-${story.level_cefr}`;
    if (!byLevel[level]) byLevel[level] = [];
    byLevel[level].push(story);
  }

  console.log('Stories by level:');
  for (const [level, storyList] of Object.entries(byLevel)) {
    console.log(`  ${level}: ${storyList.length} stories`);
  }

  console.log('');
  console.log('All stories:');
  for (const story of stories) {
    console.log(`- [${story.level_jlpt}/${story.level_cefr}] ${story.title}`);
  }

  await prisma.$disconnect();
}

checkAllStories();
