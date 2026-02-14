import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function showTranslationExamples() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('           ENGLISH TRANSLATION EXAMPLES');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Get one example from each JLPT level
  const levels = [
    { level: 'N5', storyId: '2' },  // 初めての挨拶
    { level: 'N4', storyId: '7' },  // レストランでの注文
    { level: 'N3', storyId: '1' },  // 東京での新しい生活
    { level: 'N2', storyId: '20' }, // 環境問題について
    { level: 'N1', storyId: '25' }  // 伝統文化の継承
  ];

  for (const { level, storyId } of levels) {
    const story = await prisma.story.findFirst({
      where: { story_id: storyId },
      include: {
        chapters: {
          orderBy: { chapter_number: 'asc' },
          take: 1
        }
      }
    });

    if (!story || story.chapters.length === 0) {
      console.log(`❌ Story ${storyId} not found\n`);
      continue;
    }

    const chapter = story.chapters[0];

    console.log(`┌─────────────────────────────────────────────────────────────┐`);
    console.log(`│ ${level} - ${story.title}`);
    console.log(`│ Chapter ${chapter.chapter_number}: ${chapter.title}`);
    console.log(`└─────────────────────────────────────────────────────────────┘`);
    console.log('');
    console.log('📝 JAPANESE CONTENT:');
    console.log('─────────────────────────────────────────────────────────────');
    console.log(wrapText(chapter.content, 60));
    console.log('');
    console.log('🌐 ENGLISH TRANSLATION:');
    console.log('─────────────────────────────────────────────────────────────');
    console.log(wrapText(chapter.content_en || 'No translation available', 60));
    console.log('');
    console.log('📊 STATISTICS:');
    console.log(`   Japanese: ${chapter.content.length} characters`);
    console.log(`   English:  ${chapter.content_en?.length || 0} characters`);
    console.log(`   Ratio:    ${chapter.content_en ? (chapter.content_en.length / chapter.content.length).toFixed(2) : '0.00'}x`);
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════\n');
  }

  await prisma.$disconnect();
}

function wrapText(text: string, width: number): string {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + word).length <= width) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);

  return lines.join('\n');
}

showTranslationExamples().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
