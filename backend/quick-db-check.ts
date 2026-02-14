import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function quickCheck() {
  // Check the 3 stories that were fixed
  const storiesToCheck = [
    { id: '17', name: 'ビジネスメールの作成' },
    { id: '8', name: '友達との約束' },
    { id: '9', name: '電車での通学' }
  ];

  console.log('🔍 Quick Database Verification\n');

  for (const story of storiesToCheck) {
    const chapters = await prisma.chapter.findMany({
      where: { story_id: story.id },
      orderBy: { chapter_number: 'asc' },
      select: {
        chapter_id: true,
        chapter_number: true,
        content_en: true
      }
    });

    console.log(`\n📖 ${story.name} (Story ID: ${story.id})`);
    
    for (const chapter of chapters) {
      const hasTranslation = chapter.content_en && chapter.content_en.length > 0;
      const status = hasTranslation ? '✅' : '❌';
      const preview = chapter.content_en?.substring(0, 60) || 'NULL';
      
      console.log(`   ${status} Chapter ${chapter.chapter_number}: ${preview}...`);
    }
  }

  console.log('\n✅ Database check complete!\n');
  await prisma.$disconnect();
}

quickCheck();
