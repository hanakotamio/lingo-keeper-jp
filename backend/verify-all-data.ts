import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_9zkXoHEsC8PQ@ep-morning-sky-a1dv4mjd-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    }
  }
});

async function verifyAllData() {
  console.log('=== Production Database - Final Verification ===\n');

  try {
    // Get all stories
    const stories = await prisma.story.findMany({
      orderBy: { story_id: 'asc' }
    });

    console.log(`Total Stories: ${stories.length}\n`);

    // Group by JLPT level
    const byLevel: Record<string, number> = {};
    stories.forEach(story => {
      const level = story.level_jlpt || 'Unknown';
      byLevel[level] = (byLevel[level] || 0) + 1;
    });

    console.log('Stories by JLPT Level:');
    Object.keys(byLevel).sort().forEach(level => {
      console.log(`  ${level}: ${byLevel[level]} stories`);
    });
    console.log();

    // Check chapters and choices
    let totalChapters = 0;
    let totalChoices = 0;
    let storiesWithIssues: string[] = [];

    console.log('Detailed Story Verification:\n');

    for (const story of stories) {
      const chapters = await prisma.chapter.findMany({
        where: { story_id: story.story_id },
        orderBy: { chapter_number: 'asc' },
        include: {
          choices: true
        }
      });

      totalChapters += chapters.length;

      let storyChoices = 0;
      chapters.forEach(ch => {
        storyChoices += ch.choices.length;
      });
      totalChoices += storyChoices;

      const status = chapters.length === 5 && storyChoices === 10 ? '✅' : '⚠️';

      console.log(`${status} Story ${story.story_id.padStart(2, ' ')}: "${story.title}" (${story.level_jlpt})`);
      console.log(`   Chapters: ${chapters.length}/5, Choices: ${storyChoices}/10`);

      if (chapters.length !== 5 || storyChoices !== 10) {
        storiesWithIssues.push(`Story ${story.story_id}: ${chapters.length} chapters, ${storyChoices} choices`);
      }

      // Show chapter linkage
      if (chapters.length > 0) {
        const firstChapter = chapters[0];
        const lastChapter = chapters[chapters.length - 1];

        console.log(`   First: ${firstChapter.chapter_id} → Choices: ${firstChapter.choices.map(c => c.next_chapter_id).join(', ')}`);
        console.log(`   Last:  ${lastChapter.chapter_id} → Choices: ${lastChapter.choices.map(c => c.next_chapter_id || 'END').join(', ')}`);
      }
      console.log();
    }

    console.log('\n=== Summary ===');
    console.log(`📊 Total Stories: ${stories.length}`);
    console.log(`📊 Total Chapters: ${totalChapters} (Expected: ${stories.length * 5})`);
    console.log(`📊 Total Choices: ${totalChoices} (Expected: ${stories.length * 10})`);

    if (storiesWithIssues.length > 0) {
      console.log('\n⚠️ Stories with Issues:');
      storiesWithIssues.forEach(issue => console.log(`  - ${issue}`));
    } else {
      console.log('\n🎉 All stories have exactly 5 chapters with proper choices!');
    }

    // Sample chapter content
    console.log('\n=== Sample Chapter Content ===\n');

    const sampleStories = [2, 7, 12, 17, 22]; // One from each level

    for (const storyId of sampleStories) {
      const story = stories.find(s => s.story_id === String(storyId));
      if (!story) continue;

      const chapter = await prisma.chapter.findUnique({
        where: { chapter_id: `ch-${storyId}-1` },
        include: { choices: true }
      });

      if (chapter) {
        console.log(`Story ${storyId} (${story.level_jlpt}): "${story.title}"`);
        console.log(`  Chapter 1 Content: ${chapter.content.substring(0, 100)}...`);
        console.log(`  Vocabulary items: ${Array.isArray(chapter.vocabulary) ? chapter.vocabulary.length : 0}`);
        console.log(`  Learning points: ${Array.isArray(chapter.learning_points) ? chapter.learning_points.length : 0}`);
        console.log(`  Choices: ${chapter.choices.length}`);
        console.log();
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyAllData();
