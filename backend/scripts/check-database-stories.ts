import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabaseStories() {
  try {
    console.log('Fetching all stories from database...\n');

    // Fetch all stories with required fields (fetch raw to handle null values)
    const stories = await prisma.$queryRaw`
      SELECT story_id, title, level_jlpt, created_at FROM stories ORDER BY created_at ASC
    ` as Array<{ story_id: string; title: string; level_jlpt: string | null; created_at: Date }>;

    // Display total count
    console.log(`Total Stories: ${stories.length}\n`);

    // Display all stories
    console.log('All Stories:');
    console.log('─'.repeat(80));
    stories.forEach((story, index) => {
      console.log(`${index + 1}. ID: ${story.story_id}`);
      console.log(`   Title: ${story.title}`);
      console.log(`   Level (JLPT): ${story.level_jlpt || 'NULL'}`);
      console.log(`   Created: ${new Date(story.created_at).toISOString()}`);
      console.log('');
    });

    // Check for stories 11-15
    console.log('─'.repeat(80));
    console.log('Checking for Story IDs 11-15...\n');

    const storyIds = stories.map((s) => s.story_id);
    const foundIds = storyIds.filter((id) => {
      const numMatch = id.match(/\d+$/);
      if (numMatch) {
        const num = parseInt(numMatch[0]);
        return num >= 11 && num <= 15;
      }
      return false;
    });

    if (foundIds.length > 0) {
      console.log(`Found ${foundIds.length} stories in ID range 11-15:`);
      foundIds.forEach((id) => {
        const story = stories.find((s) => s.story_id === id);
        if (story) {
          console.log(`  - ${id}: ${story.title}`);
        }
      });
    } else {
      console.log('No stories found in ID range 11-15');
    }

    console.log('\nDatabase check completed successfully.');
  } catch (error) {
    console.error('Error checking database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseStories();
