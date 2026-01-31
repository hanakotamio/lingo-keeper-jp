import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkStories() {
  const count: any[] = await prisma.$queryRaw`SELECT COUNT(*) as count FROM stories`;
  console.log('ストーリー総数:', count[0].count);

  const stories: any[] = await prisma.$queryRaw`
    SELECT story_id, title, level_jlpt
    FROM stories
    ORDER BY created_at
    LIMIT 10
  `;

  console.log('\nストーリー一覧:');
  stories.forEach(s => console.log(`- ${s.story_id}: ${s.title} (${s.level_jlpt})`));

  await prisma.$disconnect();
}

checkStories();
