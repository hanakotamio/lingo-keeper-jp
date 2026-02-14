import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkStories() {
  try {
    // Get all stories
    const allStories: any = await prisma.$queryRaw`
      SELECT story_id, title, level_jlpt, level_cefr, category, is_active
      FROM stories
      ORDER BY title
    `;

    console.log(`📚 Total Stories: ${allStories.length}\n`);

    // Group by language (Japanese vs English titles)
    const japaneseStories = allStories.filter((s: any) => /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(s.title));
    const englishStories = allStories.filter((s: any) => !/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(s.title));

    console.log(`🇯🇵 Japanese titled stories: ${japaneseStories.length}`);
    japaneseStories.forEach((s: any, i: number) => {
      console.log(`  ${i + 1}. ${s.title} (${s.level_jlpt || 'no level'})`);
    });

    console.log(`\n🇬🇧 English titled stories: ${englishStories.length}`);
    englishStories.forEach((s: any, i: number) => {
      console.log(`  ${i + 1}. ${s.title} (${s.level_cefr || 'no level'})`);
    });

    // Check which have chapters
    console.log('\n\n📊 Chapter Distribution:');
    for (const story of allStories) {
      const count: any = await prisma.$queryRaw`
        SELECT COUNT(*) as cnt FROM chapters WHERE story_id = ${story.story_id}
      `;
      if (count[0].cnt > 0) {
        console.log(`  ${story.title}: ${count[0].cnt} chapters`);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStories();
