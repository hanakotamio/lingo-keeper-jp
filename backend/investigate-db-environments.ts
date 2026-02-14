#!/usr/bin/env tsx
/**
 * Database Environment Investigation Script
 *
 * Investigates the current state of databases across different environments
 * to identify discrepancies in story counts and data consistency.
 */

import { PrismaClient } from '@prisma/client';

interface EnvironmentStats {
  environment: string;
  databaseUrl: string;
  stories: number;
  chapters: number;
  quizzes: number;
  choices: number;
  connected: boolean;
  error?: string;
}

async function investigateEnvironment(
  envName: string,
  databaseUrl: string
): Promise<EnvironmentStats> {
  const stats: EnvironmentStats = {
    environment: envName,
    databaseUrl: databaseUrl.replace(/:[^@]+@/, ':***@'), // Mask password
    stories: 0,
    chapters: 0,
    quizzes: 0,
    choices: 0,
    connected: false,
  };

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

  try {
    // Test connection
    await prisma.$connect();
    stats.connected = true;

    // Count stories
    stats.stories = await prisma.story.count();

    // Count chapters
    stats.chapters = await prisma.chapter.count();

    // Count quizzes
    stats.quizzes = await prisma.quiz.count();

    // Count choices
    stats.choices = await prisma.choice.count();

    // Get sample story IDs
    const sampleStories = await prisma.story.findMany({
      select: {
        story_id: true,
        title: true,
        level_jlpt: true,
      },
      take: 5,
      orderBy: {
        story_id: 'asc',
      },
    });

    console.log(`\n📊 ${envName} Environment:`);
    console.log(`   Stories: ${stats.stories}`);
    console.log(`   Chapters: ${stats.chapters}`);
    console.log(`   Quizzes: ${stats.quizzes}`);
    console.log(`   Choices: ${stats.choices}`);
    console.log(`\n   Sample Stories:`);
    sampleStories.forEach((story) => {
      console.log(`   - ${story.story_id}: ${story.title} (${story.level_jlpt})`);
    });

  } catch (error) {
    stats.connected = false;
    stats.error = error instanceof Error ? error.message : String(error);
    console.error(`\n❌ ${envName} Environment: Connection failed`);
    console.error(`   Error: ${stats.error}`);
  } finally {
    await prisma.$disconnect();
  }

  return stats;
}

async function main() {
  console.log('🔍 Database Environment Investigation');
  console.log('=====================================\n');

  const environments: Array<{ name: string; url: string | undefined }> = [
    {
      name: 'Development (.env.local)',
      url: process.env.DATABASE_URL_LOCAL,
    },
    {
      name: 'Production (.env.production)',
      url: process.env.DATABASE_URL_PRODUCTION,
    },
  ];

  const results: EnvironmentStats[] = [];

  for (const env of environments) {
    if (!env.url) {
      console.log(`\n⚠️  ${env.name}: No DATABASE_URL configured`);
      continue;
    }

    const stats = await investigateEnvironment(env.name, env.url);
    results.push(stats);
  }

  // Summary
  console.log('\n\n📋 Summary');
  console.log('===========\n');

  const table = results.map((r) => ({
    Environment: r.environment,
    Connected: r.connected ? '✅' : '❌',
    Stories: r.stories,
    Chapters: r.chapters,
    Quizzes: r.quizzes,
    Choices: r.choices,
  }));

  console.table(table);

  // Check for discrepancies
  if (results.length >= 2 && results.every((r) => r.connected)) {
    const [dev, prod] = results;

    console.log('\n🔍 Discrepancy Analysis:');

    if (dev.stories !== prod.stories) {
      console.log(`   ⚠️  Story count mismatch: Dev(${dev.stories}) vs Prod(${prod.stories})`);
    } else {
      console.log(`   ✅ Story counts match: ${dev.stories}`);
    }

    if (dev.chapters !== prod.chapters) {
      console.log(`   ⚠️  Chapter count mismatch: Dev(${dev.chapters}) vs Prod(${prod.chapters})`);
    } else {
      console.log(`   ✅ Chapter counts match: ${dev.chapters}`);
    }

    if (dev.quizzes !== prod.quizzes) {
      console.log(`   ⚠️  Quiz count mismatch: Dev(${dev.quizzes}) vs Prod(${prod.quizzes})`);
    } else {
      console.log(`   ✅ Quiz counts match: ${dev.quizzes}`);
    }
  }

  console.log('\n✅ Investigation complete\n');
}

main().catch(console.error);
