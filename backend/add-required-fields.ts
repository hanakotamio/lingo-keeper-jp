import * as fs from 'fs';

const content = fs.readFileSync('prisma/seed_restored.ts', 'utf-8');

// Story field updates (add required fields after existing fields)
const storyUpdates = [
  {
    search: /story_id: '1',\s+title: '東京での新しい生活',\s+description: '初めて東京に来た留学生の1日を追体験。渋谷での選択があなたの物語を変えます。',\s+level_jlpt: 'N3',\s+level_cefr: 'B1',\s+estimated_time: 10,\s+root_chapter_id: 'ch-1-1',/,
    replace: `story_id: '1',
      title: '東京での新しい生活',
      title_en: 'A New Life in Tokyo',
      description: '初めて東京に来た留学生の1日を追体験。渋谷での選択があなたの物語を変えます。',
      description_en: 'Experience the first day of an international student in Tokyo. Your choices in Shibuya will change your story.',
      category: 'daily_life',
      difficulty_level: 'intermediate',
      level_jlpt: 'N3',
      level_cefr: 'B1',
      estimated_time: 10,
      estimated_duration_minutes: 10,
      is_active: true,
      root_chapter_id: 'ch-1-1',`
  },
  {
    search: /story_id: '2',\s+title: 'カフェでの出会い',\s+description: '偶然入ったカフェで始まる、心温まる友情のストーリー。',\s+level_jlpt: 'N4',\s+level_cefr: 'A2',\s+estimated_time: 8,\s+root_chapter_id: 'ch-2-1',/,
    replace: `story_id: '2',
      title: 'カフェでの出会い',
      title_en: 'Meeting at a Cafe',
      description: '偶然入ったカフェで始まる、心温まる友情のストーリー。',
      description_en: 'A heartwarming story of friendship that begins at a cafe you entered by chance.',
      category: 'social',
      difficulty_level: 'beginner',
      level_jlpt: 'N4',
      level_cefr: 'A2',
      estimated_time: 8,
      estimated_duration_minutes: 8,
      is_active: true,
      root_chapter_id: 'ch-2-1',`
  },
  {
    search: /story_id: '3',\s+title: '初めてのコンビニ',\s+description: '初めて日本のコンビニで買い物をする体験。便利な日本のコンビニ文化を学びます。',\s+level_jlpt: 'N5',\s+level_cefr: 'A1',\s+estimated_time: 6,\s+root_chapter_id: 'ch-3-1',/,
    replace: `story_id: '3',
      title: '初めてのコンビニ',
      title_en: 'First Time at a Convenience Store',
      description: '初めて日本のコンビニで買い物をする体験。便利な日本のコンビニ文化を学びます。',
      description_en: 'Experience shopping at a Japanese convenience store for the first time. Learn about the convenient convenience store culture of Japan.',
      category: 'daily_life',
      difficulty_level: 'beginner',
      level_jlpt: 'N5',
      level_cefr: 'A1',
      estimated_time: 6,
      estimated_duration_minutes: 6,
      is_active: true,
      root_chapter_id: 'ch-3-1',`
  },
  {
    search: /story_id: '4',\s+title: '駅での待ち合わせ',\s+description: '新宿駅で友達と待ち合わせ。日本の大きな駅での体験を学びます。',\s+level_jlpt: 'N4',\s+level_cefr: 'A2',\s+estimated_time: 8,\s+root_chapter_id: 'ch-4-1',/,
    replace: `story_id: '4',
      title: '駅での待ち合わせ',
      title_en: 'Meeting at the Station',
      description: '新宿駅で友達と待ち合わせ。日本の大きな駅での体験を学びます。',
      description_en: 'Meeting a friend at Shinjuku Station. Learn about experiences at large Japanese train stations.',
      category: 'daily_life',
      difficulty_level: 'beginner',
      level_jlpt: 'N4',
      level_cefr: 'A2',
      estimated_time: 8,
      estimated_duration_minutes: 8,
      is_active: true,
      root_chapter_id: 'ch-4-1',`
  },
  {
    search: /story_id: '5',\s+title: '居酒屋での夜',\s+description: '会社の同僚と居酒屋へ。日本の飲み会文化を体験します。',\s+level_jlpt: 'N3',\s+level_cefr: 'B1',\s+estimated_time: 10,\s+root_chapter_id: 'ch-5-1',/,
    replace: `story_id: '5',
      title: '居酒屋での夜',
      title_en: 'Night at an Izakaya',
      description: '会社の同僚と居酒屋へ。日本の飲み会文化を体験します。',
      description_en: 'Going to an izakaya with work colleagues. Experience Japanese drinking party culture.',
      category: 'social',
      difficulty_level: 'intermediate',
      level_jlpt: 'N3',
      level_cefr: 'B1',
      estimated_time: 10,
      estimated_duration_minutes: 10,
      is_active: true,
      root_chapter_id: 'ch-5-1',`
  },
  {
    search: /story_id: '6',\s+title: '温泉旅行',\s+description: '週末の温泉旅行。日本の伝統的な旅館文化と温泉マナーを学びます。',\s+level_jlpt: 'N2',\s+level_cefr: 'B2',\s+estimated_time: 12,\s+root_chapter_id: 'ch-6-1',/,
    replace: `story_id: '6',
      title: '温泉旅行',
      title_en: 'Hot Spring Trip',
      description: '週末の温泉旅行。日本の伝統的な旅館文化と温泉マナーを学びます。',
      description_en: 'A weekend trip to a hot spring. Learn about traditional Japanese ryokan culture and hot spring etiquette.',
      category: 'culture',
      difficulty_level: 'intermediate',
      level_jlpt: 'N2',
      level_cefr: 'B2',
      estimated_time: 12,
      estimated_duration_minutes: 12,
      is_active: true,
      root_chapter_id: 'ch-6-1',`
  },
  {
    search: /story_id: '7',\s+title: '日本企業での面接',\s+description: '日本の会社での就職面接。ビジネスマナーと面接の準備を体験します。',\s+level_jlpt: 'N2',\s+level_cefr: 'B2',\s+estimated_time: 12,\s+root_chapter_id: 'ch-7-1',/,
    replace: `story_id: '7',
      title: '日本企業での面接',
      title_en: 'Job Interview at a Japanese Company',
      description: '日本の会社での就職面接。ビジネスマナーと面接の準備を体験します。',
      description_en: 'Job interview at a Japanese company. Experience business etiquette and interview preparation.',
      category: 'business',
      difficulty_level: 'advanced',
      level_jlpt: 'N2',
      level_cefr: 'B2',
      estimated_time: 12,
      estimated_duration_minutes: 12,
      is_active: true,
      root_chapter_id: 'ch-7-1',`
  },
  {
    search: /story_id: '8',\s+title: '京都の古寺巡り',\s+description: '古都京都で日本の精神性と美学を探求する旅。禅の思想と伝統文化を深く学びます。',\s+level_jlpt: 'N1',\s+level_cefr: 'C1',\s+estimated_time: 15,\s+root_chapter_id: 'ch-8-1',/,
    replace: `story_id: '8',
      title: '京都の古寺巡り',
      title_en: 'Visiting Ancient Temples in Kyoto',
      description: '古都京都で日本の精神性と美学を探求する旅。禅の思想と伝統文化を深く学びます。',
      description_en: 'A journey to explore Japanese spirituality and aesthetics in the ancient capital of Kyoto. Deeply learn about Zen philosophy and traditional culture.',
      category: 'culture',
      difficulty_level: 'advanced',
      level_jlpt: 'N1',
      level_cefr: 'C1',
      estimated_time: 15,
      estimated_duration_minutes: 15,
      is_active: true,
      root_chapter_id: 'ch-8-1',`
  },
  {
    search: /story_id: '9',\s+title: 'ビジネス交渉',\s+description: '日本企業との重要な商談。高度なビジネス日本語と交渉術を学びます。',\s+level_jlpt: 'N1',\s+level_cefr: 'C1',\s+estimated_time: 15,\s+root_chapter_id: 'ch-9-1',/,
    replace: `story_id: '9',
      title: 'ビジネス交渉',
      title_en: 'Business Negotiation',
      description: '日本企業との重要な商談。高度なビジネス日本語と交渉術を学びます。',
      description_en: 'An important business meeting with a Japanese company. Learn advanced business Japanese and negotiation skills.',
      category: 'business',
      difficulty_level: 'advanced',
      level_jlpt: 'N1',
      level_cefr: 'C1',
      estimated_time: 15,
      estimated_duration_minutes: 15,
      is_active: true,
      root_chapter_id: 'ch-9-1',`
  },
];

let updatedContent = content;

// Apply all updates
for (const update of storyUpdates) {
  updatedContent = updatedContent.replace(update.search, update.replace);
}

// Write final seed file
fs.writeFileSync('prisma/seed.ts', updatedContent, 'utf-8');

console.log('Updated seed.ts with all required fields and translations for all 9 stories');
