-- Add ruby text and English translations to Story 1 choices (Sample Data)
-- Story: 東京での新しい生活 (A New Life in Tokyo)
-- Date: 2026-03-10

-- Chapter 1: Main story choices (3 options)

-- Choice 1: カフェで休憩する
UPDATE choices
SET
  choice_text_ruby = 'カフェで<ruby>休憩<rt>きゅうけい</rt></ruby>する',
  choice_text_en = 'Take a break at a cafe'
WHERE choice_id = 'choice-1-1-a';

-- Choice 2: 観光スポットを探す
UPDATE choices
SET
  choice_text_ruby = '<ruby>観光<rt>かんこう</rt></ruby>スポットを<ruby>探<rt>さが</rt></ruby>す',
  choice_text_en = 'Look for tourist spots'
WHERE choice_id = 'choice-1-1-b';

-- Choice 3: アパートへ直行する
UPDATE choices
SET
  choice_text_ruby = 'アパートへ<ruby>直行<rt>ちょっこう</rt></ruby>する',
  choice_text_en = 'Go straight to the apartment'
WHERE choice_id = 'choice-1-1-c';

-- Progression choices: 次へ進む (Continue/Next)
UPDATE choices
SET
  choice_text_ruby = '<ruby>次<rt>つぎ</rt></ruby>へ<ruby>進<rt>すす</rt></ruby>む',
  choice_text_en = 'Continue'
WHERE choice_id IN (
  'choice-1-2a-to-3a',
  'choice-1-2b-to-3b',
  'choice-1-2c-to-3c',
  'choice-1-3c-to-4',
  'choice-1-3a-to-4',
  'choice-1-3b-to-4',
  'choice-1-4-to-5'
);

-- Verify updates
SELECT
  choice_id,
  choice_text AS japanese,
  choice_text_ruby AS ruby,
  choice_text_en AS english
FROM choices
WHERE chapter_id IN (
  SELECT chapter_id FROM chapters WHERE story_id = '1'
)
ORDER BY chapter_id, display_order;
