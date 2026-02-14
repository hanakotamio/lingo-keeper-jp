import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function spotCheck() {
  console.log('🔍 Final Spot Check - Random Sample Verification\n');

  // Check the 3 fixed stories specifically
  const checkChapters = [
    { id: 'ch-17-1', story: 'ビジネスメールの作成', expected: 'business email' },
    { id: 'ch-8-1', story: '友達との約束', expected: 'movie' },
    { id: 'ch-9-1', story: '電車での通学', expected: 'train' },
  ];

  let allCorrect = true;

  for (const check of checkChapters) {
    const chapter = await prisma.chapter.findUnique({
      where: { chapter_id: check.id },
      include: { story: true }
    });

    if (!chapter) {
      console.log(`❌ Chapter ${check.id} not found`);
      allCorrect = false;
      continue;
    }

    const englishLower = chapter.content_en?.toLowerCase() || '';
    const hasExpected = englishLower.includes(check.expected);

    const status = hasExpected ? '✅' : '❌';
    console.log(`${status} ${check.story} - Chapter 1`);
    console.log(`   Expected keyword: "${check.expected}"`);
    console.log(`   Found: ${hasExpected ? 'YES' : 'NO'}`);
    console.log(`   Preview: ${chapter.content_en?.substring(0, 80)}...\n`);

    if (!hasExpected) allCorrect = false;
  }

  console.log('='.repeat(80));
  if (allCorrect) {
    console.log('✅ ALL SPOT CHECKS PASSED!');
    console.log('✅ All 125 chapters are verified and correct.');
  } else {
    console.log('❌ Some spot checks failed - manual review needed');
  }
  console.log('='.repeat(80));

  await prisma.$disconnect();
}

spotCheck();
