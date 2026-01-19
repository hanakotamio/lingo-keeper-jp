import { PrismaClient } from '@prisma/client';
import { openaiService } from './openai.service';

const prisma = new PrismaClient();

/**
 * Story Generation Service
 * Automatically generates stories using OpenAI GPT-4
 */
export class StoryGenerationService {
  /**
   * Map level names to JLPT and CEFR standards
   */
  private mapLevel(level: string): { jlpt: string; cefr: string } {
    const levelMap: Record<string, { jlpt: string; cefr: string }> = {
      'Pre-N5': { jlpt: 'N5', cefr: 'A1' },
      'N5入門': { jlpt: 'N5', cefr: 'A1' },
      'N5': { jlpt: 'N5', cefr: 'A1' },
      'N4': { jlpt: 'N4', cefr: 'A2' },
      'N3': { jlpt: 'N3', cefr: 'B1' },
      'N2': { jlpt: 'N2', cefr: 'B2' },
      'N1': { jlpt: 'N1', cefr: 'C1' },
    };

    return levelMap[level] || { jlpt: 'N5', cefr: 'A1' };
  }

  /**
   * Generate a complete story with chapters and quizzes
   */
  async generateStory(params: {
    level: string;
    theme: string;
    chapterCount?: number;
  }): Promise<any> {
    const { level, theme, chapterCount = 5 } = params;

    console.log(`Generating story: Level=${level}, Theme=${theme}, Chapters=${chapterCount}`);

    // Generate story content using OpenAI
    const generatedContent = await openaiService.generateStoryContent({
      level,
      theme,
      chapterCount,
    });

    // Map level to JLPT/CEFR
    const { jlpt, cefr } = this.mapLevel(level);

    // Generate unique story ID
    const storyCount = await prisma.story.count();
    const storyId = `${storyCount + 1}`;
    const rootChapterId = `ch-${storyId}-1`;

    // Create story in database
    const story = await prisma.story.create({
      data: {
        story_id: storyId,
        title: generatedContent.title,
        description: generatedContent.description,
        level_jlpt: jlpt,
        level_cefr: cefr,
        estimated_time: generatedContent.estimated_time || chapterCount * 2,
        root_chapter_id: rootChapterId,
      },
    });

    console.log(`Created story: ${story.story_id} - ${story.title}`);

    // Create chapters
    const chapterMap: Record<number, string> = {};

    for (const chapterData of generatedContent.chapters) {
      const chapterNumber = chapterData.chapter_number;
      const chapterId = `ch-${storyId}-${chapterNumber}`;
      chapterMap[chapterNumber] = chapterId;

      // Determine parent chapter
      let parentChapterId = null;
      if (chapterNumber > 1) {
        // Find which chapter leads to this one
        for (const prevChapter of generatedContent.chapters) {
          if (prevChapter.chapter_number < chapterNumber) {
            const hasChoice = prevChapter.choices?.some(
              (c: any) => c.leads_to_chapter === chapterNumber
            );
            if (hasChoice) {
              parentChapterId = `ch-${storyId}-${prevChapter.chapter_number}`;
              break;
            }
          }
        }
      }

      const chapter = await prisma.chapter.create({
        data: {
          chapter_id: chapterId,
          story_id: storyId,
          parent_chapter_id: parentChapterId,
          chapter_number: chapterNumber,
          depth_level: chapterNumber === 1 ? 0 : 1,
          content: chapterData.content,
          content_with_ruby: chapterData.content_with_ruby,
          translation: chapterData.translation,
          vocabulary: chapterData.vocabulary || [],
        },
      });

      console.log(`Created chapter: ${chapter.chapter_id}`);

      // Create choices for this chapter
      if (chapterData.choices && chapterData.choices.length > 0) {
        const choices = chapterData.choices.map((choice: any, index: number) => ({
          choice_id: `choice-${storyId}-${chapterNumber}-${String.fromCharCode(97 + index)}`,
          chapter_id: chapterId,
          choice_text: choice.choice_text,
          choice_description: choice.choice_description || '',
          next_chapter_id: `ch-${storyId}-${choice.leads_to_chapter}`,
          display_order: index + 1,
        }));

        await prisma.choice.createMany({
          data: choices,
        });

        console.log(`Created ${choices.length} choices for chapter ${chapterNumber}`);
      }
    }

    // Create quizzes
    if (generatedContent.quizzes && generatedContent.quizzes.length > 0) {
      for (let i = 0; i < generatedContent.quizzes.length; i++) {
        const quizData = generatedContent.quizzes[i];
        const quizId = `quiz-${storyId}-${i + 1}`;

        await prisma.quiz.create({
          data: {
            quiz_id: quizId,
            story_id: storyId,
            question_text: quizData.question_text,
            question_type: quizData.question_type,
            difficulty_level: jlpt,
            is_ai_generated: true,
            source_text: generatedContent.title,
          },
        });

        // Create quiz choices
        const quizChoices = quizData.choices.map((choice: any, index: number) => ({
          choice_id: `${quizId}-choice-${index + 1}`,
          quiz_id: quizId,
          choice_text: choice.choice_text,
          is_correct: choice.is_correct,
          explanation: choice.explanation || '',
        }));

        await prisma.quizChoice.createMany({
          data: quizChoices,
        });

        console.log(`Created quiz: ${quizId} with ${quizChoices.length} choices`);
      }
    }

    // Return created story with full data
    const fullStory = await prisma.story.findUnique({
      where: { story_id: storyId },
      include: {
        chapters: {
          include: {
            choices: true,
          },
        },
        quizzes: {
          include: {
            quiz_choices: true,
          },
        },
      },
    });

    return fullStory;
  }

  /**
   * Generate multiple stories in batch
   */
  async generateBatch(params: {
    level: string;
    themes: string[];
    chapterCount?: number;
  }): Promise<any[]> {
    const { level, themes, chapterCount = 5 } = params;
    const results = [];

    for (const theme of themes) {
      try {
        console.log(`\nGenerating story ${results.length + 1}/${themes.length}...`);
        const story = await this.generateStory({
          level,
          theme,
          chapterCount,
        });
        results.push(story);

        // Wait 1 second between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to generate story for theme "${theme}":`, error);
        results.push({ error: (error as Error).message, theme });
      }
    }

    return results;
  }
}

export const storyGenerationService = new StoryGenerationService();
