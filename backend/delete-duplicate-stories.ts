import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Deleting duplicate beginner stories...');
  
  // Delete stories with IDs 10, 15-19
  const duplicateIds = ['10', '15', '16', '17', '18', '19'];
  
  for (const id of duplicateIds) {
    try {
      await prisma.story.delete({
        where: { story_id: id }
      });
      console.log(`✅ Deleted story ${id}`);
    } catch (error) {
      console.log(`⚠️ Story ${id} not found or already deleted`);
    }
  }
  
  console.log('✅ Cleanup completed');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
