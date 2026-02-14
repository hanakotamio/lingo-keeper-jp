import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Update all chapter choices to Japanese
 * - N5/N4: Hiragana-based choices
 * - N3+: Regular Japanese with kanji
 */
async function updateChoicesToJapanese() {
  console.log('Updating all chapter choices to Japanese...\n');

  // Get all stories with their level
  const stories = await prisma.story.findMany({
    select: { story_id: true, level_jlpt: true },
    orderBy: { story_id: 'asc' }
  });

  let totalUpdated = 0;

  for (const story of stories) {
    const level = story.level_jlpt;

    // Get all chapters for this story
    const chapters = await prisma.chapter.findMany({
      where: { story_id: story.story_id },
      include: { choices: true },
      orderBy: { chapter_number: 'asc' }
    });

    console.log(`Story ${story.story_id} (${level}): ${chapters.length} chapters`);

    for (const chapter of chapters) {
      const isLastChapter = chapter.chapter_number === 5;

      for (let i = 0; i < chapter.choices.length; i++) {
        const choice = chapter.choices[i];
        let newText = '';

        if (isLastChapter) {
          // Final chapter choices
          if (level === 'N5' || level === 'N4') {
            newText = i === 0 ? 'おわり' : 'ふりかえる';
          } else {
            newText = i === 0 ? '物語を完了する' : '物語を振り返る';
          }
        } else {
          // Mid-chapter choices
          if (level === 'N5' || level === 'N4') {
            newText = i === 0 ? 'つづける' : 'ちがうみちをえらぶ';
          } else if (level === 'N3') {
            newText = i === 0 ? '続ける' : '違う道を選ぶ';
          } else {
            newText = i === 0 ? '物語を続ける' : '別の選択をする';
          }
        }

        await prisma.choice.update({
          where: { choice_id: choice.choice_id },
          data: { choice_text: newText }
        });

        totalUpdated++;
      }
    }
  }

  console.log(`\n✅ Updated ${totalUpdated} choices to Japanese!`);
  await prisma.$disconnect();
}

updateChoicesToJapanese().catch((error) => {
  console.error('Error updating choices:', error);
  process.exit(1);
});
