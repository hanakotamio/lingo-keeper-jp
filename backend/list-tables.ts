import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listTables() {
  try {
    // List all tables
    const result: any = await prisma.$queryRaw`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `;

    console.log('📋 Database Tables:');
    result.forEach((row: any, index: number) => {
      console.log(`  ${index + 1}. ${row.tablename}`);
    });

    // Check if our main tables exist
    const tableNames = result.map((r: any) => r.tablename);
    const requiredTables = ['stories', 'chapters', 'choices', 'quizzes', 'quiz_choices'];

    console.log('\n✅ Required Tables Status:');
    requiredTables.forEach(table => {
      const exists = tableNames.includes(table);
      console.log(`  ${exists ? '✓' : '✗'} ${table}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listTables();
