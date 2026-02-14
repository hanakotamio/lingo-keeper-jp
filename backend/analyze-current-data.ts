import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function analyzeData() {
  try {
    // Get all stories with chapter counts
    const storiesWithCounts: any = await prisma.$queryRaw`
      SELECT s.story_id, s.title, s.level_jlpt, COUNT(c.chapter_id) as chapter_count
      FROM stories s
      LEFT JOIN chapters c ON s.story_id = c.story_id
      GROUP BY s.story_id, s.title, s.level_jlpt
      ORDER BY s.level_jlpt, s.title
    `;

    console.log('📚 Stories with Chapter Counts:\n');
    storiesWithCounts.forEach((story: any) => {
      console.log(`${story.title} (${story.level_jlpt}): ${story.chapter_count} chapters`);
    });

    // Check specific N5 stories
    console.log('\n\n🔍 Checking N5 Story Content:\n');

    const n5Stories = ['初めての挨拶', '家族の紹介', 'コンビニで買い物', '好きな食べ物', '公園での散歩'];

    for (const storyTitle of n5Stories) {
      const chapters: any = await prisma.$queryRaw`
        SELECT c.chapter_id, c.chapter_number, c.title, LEFT(c.content, 100) as preview
        FROM chapters c
        JOIN stories s ON c.story_id = s.story_id
        WHERE s.title = ${storyTitle}
        ORDER BY c.chapter_number
        LIMIT 3
      `;

      console.log(`\n📖 ${storyTitle}:`);
      if (chapters.length > 0) {
        chapters.forEach((ch: any) => {
          console.log(`  Ch${ch.chapter_number}: ${ch.title}`);
          console.log(`    ${ch.preview}...`);
        });
      } else {
        console.log(`  ❌ No chapters found`);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeData();
