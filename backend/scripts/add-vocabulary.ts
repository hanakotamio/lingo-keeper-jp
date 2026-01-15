import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 語彙ヘルプデータの構造
 */
interface VocabularyItem {
  word: string; // 日本語の単語
  reading: string; // ひらがな読み
  meanings: {
    [languageCode: string]: string; // 言語コード → 意味
  };
  example?: string; // 使用例（日本語）
}

/**
 * サンプル語彙データ（N5レベル）
 */
const sampleVocabularyN5: VocabularyItem[] = [
  {
    word: '友達',
    reading: 'ともだち',
    meanings: {
      en: 'friend',
      zh: '朋友',
      ko: '친구',
      es: 'amigo',
      fr: 'ami',
      de: 'Freund',
      pt: 'amigo',
      ru: 'друг',
      ar: 'صديق',
      hi: 'दोस्त',
    },
    example: '新しい友達ができました。',
  },
  {
    word: '会う',
    reading: 'あう',
    meanings: {
      en: 'to meet',
      zh: '见面',
      ko: '만나다',
      es: 'encontrar',
      fr: 'rencontrer',
      de: 'treffen',
      pt: 'encontrar',
      ru: 'встречаться',
      ar: 'يلتقي',
      hi: 'मिलना',
    },
    example: '明日、友達に会います。',
  },
  {
    word: '行く',
    reading: 'いく',
    meanings: {
      en: 'to go',
      zh: '去',
      ko: '가다',
      es: 'ir',
      fr: 'aller',
      de: 'gehen',
      pt: 'ir',
      ru: 'идти',
      ar: 'يذهب',
      hi: 'जाना',
    },
    example: '学校に行きます。',
  },
  {
    word: '食べる',
    reading: 'たべる',
    meanings: {
      en: 'to eat',
      zh: '吃',
      ko: '먹다',
      es: 'comer',
      fr: 'manger',
      de: 'essen',
      pt: 'comer',
      ru: 'есть',
      ar: 'يأكل',
      hi: 'खाना',
    },
    example: 'ご飯を食べます。',
  },
];

/**
 * サンプル語彙データ（N4レベル）
 */
const sampleVocabularyN4: VocabularyItem[] = [
  {
    word: '困る',
    reading: 'こまる',
    meanings: {
      en: 'to be troubled',
      zh: '困扰',
      ko: '곤란하다',
      es: 'tener problemas',
      fr: 'être embarrassé',
      de: 'in Schwierigkeiten sein',
      pt: 'estar com problemas',
      ru: 'быть в затруднении',
      ar: 'يواجه صعوبة',
      hi: 'परेशान होना',
    },
    example: 'お金がなくて困っています。',
  },
  {
    word: '決める',
    reading: 'きめる',
    meanings: {
      en: 'to decide',
      zh: '决定',
      ko: '결정하다',
      es: 'decidir',
      fr: 'décider',
      de: 'entscheiden',
      pt: 'decidir',
      ru: 'решать',
      ar: 'يقرر',
      hi: 'तय करना',
    },
    example: '進路を決めなければなりません。',
  },
];

/**
 * サンプル語彙データ（N3レベル）
 */
const sampleVocabularyN3: VocabularyItem[] = [
  {
    word: '環境',
    reading: 'かんきょう',
    meanings: {
      en: 'environment',
      zh: '环境',
      ko: '환경',
      es: 'medio ambiente',
      fr: 'environnement',
      de: 'Umwelt',
      pt: 'ambiente',
      ru: 'окружающая среда',
      ar: 'بيئة',
      hi: 'पर्यावरण',
    },
    example: '環境問題について考えましょう。',
  },
  {
    word: '守る',
    reading: 'まもる',
    meanings: {
      en: 'to protect',
      zh: '保护',
      ko: '지키다',
      es: 'proteger',
      fr: 'protéger',
      de: 'schützen',
      pt: 'proteger',
      ru: 'защищать',
      ar: 'يحمي',
      hi: 'रक्षा करना',
    },
    example: '自然を守ることが大切です。',
  },
];

async function main() {
  console.log('Starting vocabulary data insertion...');

  try {
    // すべてのチャプターを取得
    const chapters = await prisma.chapter.findMany({
      include: {
        story: true,
      },
    });

    console.log(`Found ${chapters.length} chapters`);

    let updateCount = 0;

    for (const chapter of chapters) {
      // ストーリーのレベルに基づいて適切な語彙データを選択
      let vocabularyData: VocabularyItem[];

      if (chapter.story.level_jlpt === 'N5') {
        vocabularyData = sampleVocabularyN5;
      } else if (chapter.story.level_jlpt === 'N4') {
        vocabularyData = sampleVocabularyN4;
      } else if (chapter.story.level_jlpt === 'N3') {
        vocabularyData = sampleVocabularyN3;
      } else {
        // N2/N1は語彙データなし（後で追加）
        continue;
      }

      // 各チャプターに語彙データを設定
      await prisma.chapter.update({
        where: { chapter_id: chapter.chapter_id },
        data: {
          vocabulary: vocabularyData,
        },
      });

      updateCount++;
      console.log(
        `Updated chapter ${chapter.chapter_number} of story "${chapter.story.title}" (${chapter.story.level_jlpt})`
      );
    }

    console.log(`\n✅ Successfully updated ${updateCount} chapters with vocabulary data`);
  } catch (error) {
    console.error('Error updating chapters:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('Vocabulary data insertion completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed to insert vocabulary data:', error);
    process.exit(1);
  });
