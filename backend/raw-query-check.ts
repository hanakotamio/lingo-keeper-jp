import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function rawCheck() {
  try {
    const result: any = await prisma.$queryRaw`
      SELECT s.story_id, s.title, COUNT(c.chapter_id) as chapter_count
      FROM stories s
      LEFT JOIN chapters c ON s.story_id = c.story_id
      WHERE s.title IN ('初めての挨拶', '家族の紹介', 'コンビニで買い物', '好きな食べ物', '公園での散歩')
      GROUP BY s.story_id, s.title
      ORDER BY s.title
    `;

    console.log('Stories and Chapter Counts:');
    result.forEach((row: any) => {
      console.log(`${row.title}: ${row.chapter_count} chapters (ID: ${row.story_id})`);
    });

    // Check specific chapters for one story
    const parkChapters: any = await prisma.$queryRaw`
      SELECT c.chapter_id, c.chapter_number, c.title, LEFT(c.content, 50) as content_preview
      FROM chapters c
      JOIN stories s ON c.story_id = s.story_id
      WHERE s.title = '公園での散歩'
      ORDER BY c.chapter_number
      LIMIT 5
    `;

    console.log('\n公園での散歩 - Chapters:');
    parkChapters.forEach((ch: any) => {
      console.log(`  Ch${ch.chapter_number}: ${ch.title} (${ch.content_preview}...)`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

rawCheck();
