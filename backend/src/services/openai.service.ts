import OpenAI from 'openai';

/**
 * OpenAI Service
 * Handles all OpenAI API interactions
 */
export class OpenAIService {
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    this.client = new OpenAI({
      apiKey,
    });
  }

  /**
   * Generate story content using GPT-4
   */
  async generateStoryContent(params: {
    level: string;
    theme: string;
    chapterCount?: number;
  }): Promise<any> {
    const { level, theme, chapterCount = 5 } = params;

    const prompt = `You are a Japanese language learning content creator. Generate a branching story for ${level} level learners.

Theme: ${theme}
Number of chapters: ${chapterCount}
Target level: ${level}

Requirements:
1. Create ${chapterCount} chapters with branching choices
2. Each chapter should have Japanese text with furigana (ruby) markup
3. Include English translation for each chapter
4. Add 3-5 vocabulary items per chapter with English meanings
5. Create 3 comprehension quiz questions with 4 choices each
6. Keep the story engaging and culturally relevant
7. Use appropriate grammar and vocabulary for ${level} level

For Pre-N5 or N5 levels:
- Use very simple grammar and vocabulary (100-400 words)
- Keep sentences short (5-10 words)
- Use hiragana/katakana primarily, minimal kanji
- All kanji must have furigana

Format the response as valid JSON with this exact structure:
{
  "title": "Story title in Japanese",
  "description": "Brief description in Japanese",
  "estimated_time": number (in minutes),
  "chapters": [
    {
      "chapter_number": 1,
      "content": "Japanese text without ruby",
      "content_with_ruby": "Japanese text with <ruby>漢字<rt>かんじ</rt></ruby> markup",
      "translation": "English translation",
      "vocabulary": [
        {
          "word": "Japanese word",
          "reading": "hiragana reading",
          "meaning": "English meaning",
          "example": "Example sentence in Japanese"
        }
      ],
      "choices": [
        {
          "choice_text": "Choice text in Japanese",
          "choice_description": "Brief description of this choice",
          "leads_to_chapter": 2
        }
      ]
    }
  ],
  "quizzes": [
    {
      "question_text": "Question in Japanese",
      "question_type": "読解" or "語彙" or "文法",
      "choices": [
        {
          "choice_text": "Answer option in Japanese",
          "is_correct": true or false,
          "explanation": "Explanation in English"
        }
      ]
    }
  ]
}`;

    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert Japanese language teacher and content creator. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content generated from OpenAI');
    }

    return JSON.parse(content);
  }

  /**
   * Generate quiz questions for existing story
   */
  async generateQuizQuestions(params: {
    storyContent: string;
    level: string;
    count?: number;
  }): Promise<any> {
    const { storyContent, level, count = 3 } = params;

    const prompt = `Generate ${count} comprehension quiz questions for the following Japanese story.

Story content:
${storyContent}

Target level: ${level}

Requirements:
1. Create ${count} questions that test comprehension
2. Each question should have 4 answer choices
3. Mark the correct answer
4. Provide explanations in English
5. Mix question types: 読解 (reading comprehension), 語彙 (vocabulary), 文法 (grammar)

Format as valid JSON:
{
  "quizzes": [
    {
      "question_text": "Question in Japanese",
      "question_type": "読解" or "語彙" or "文法",
      "choices": [
        {
          "choice_text": "Answer in Japanese",
          "is_correct": true or false,
          "explanation": "Explanation in English"
        }
      ]
    }
  ]
}`;

    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert Japanese language teacher. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content generated from OpenAI');
    }

    return JSON.parse(content);
  }
}

export const openaiService = new OpenAIService();
