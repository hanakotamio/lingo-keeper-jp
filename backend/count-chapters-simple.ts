import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function countChapters() {
  const chapters = await prisma.$queryRaw<Array<{ story_id: string; title: string; level_jlpt: string; chapter_count: bigint }>>`
    SELECT s.story_id, s.title, s.level_jlpt, COUNT(c.chapter_id) as chapter_count
    FROM "stories" s
    LEFT JOIN "chapters" c ON s.story_id = c.story_id
    GROUP BY s.story_id, s.title, s.level_jlpt
    ORDER BY s.story_id::int
  `;

  console.log('=== CHAPTERS PER STORY ===\n');

  const byLevel: Record<string, Array<{id: string, title: string, count: number}>> = {};

  for (const row of chapters) {
    const level = row.level_jlpt || 'Unknown';
    if (!byLevel[level]) byLevel[level] = [];
    byLevel[level].push({
      id: row.story_id,
      title: row.title,
      count: Number(row.chapter_count)
    });
  }

  for (const [level, stories] of Object.entries(byLevel)) {
    console.log(`${level}:`);
    for (const s of stories) {
      const needed = Math.max(0, 5 - s.count);
      console.log(`  [Story ${s.id}] ${s.title}: ${s.count}/5 chapters ${needed > 0 ? `⚠️ Need ${needed} more` : '✅'}`);
    }
    console.log();
  }

  await prisma.$disconnect();
}

countChapters();
