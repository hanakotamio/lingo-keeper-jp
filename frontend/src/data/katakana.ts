import type { KanaRow } from './hiragana';

export const KATAKANA_SEION: KanaRow[] = [
  { label: 'ア行', chars: [{ char: 'ア', romaji: 'a' }, { char: 'イ', romaji: 'i' }, { char: 'ウ', romaji: 'u' }, { char: 'エ', romaji: 'e' }, { char: 'オ', romaji: 'o' }] },
  { label: 'カ行', chars: [{ char: 'カ', romaji: 'ka' }, { char: 'キ', romaji: 'ki' }, { char: 'ク', romaji: 'ku' }, { char: 'ケ', romaji: 'ke' }, { char: 'コ', romaji: 'ko' }] },
  { label: 'サ行', chars: [{ char: 'サ', romaji: 'sa' }, { char: 'シ', romaji: 'shi' }, { char: 'ス', romaji: 'su' }, { char: 'セ', romaji: 'se' }, { char: 'ソ', romaji: 'so' }] },
  { label: 'タ行', chars: [{ char: 'タ', romaji: 'ta' }, { char: 'チ', romaji: 'chi' }, { char: 'ツ', romaji: 'tsu' }, { char: 'テ', romaji: 'te' }, { char: 'ト', romaji: 'to' }] },
  { label: 'ナ行', chars: [{ char: 'ナ', romaji: 'na' }, { char: 'ニ', romaji: 'ni' }, { char: 'ヌ', romaji: 'nu' }, { char: 'ネ', romaji: 'ne' }, { char: 'ノ', romaji: 'no' }] },
  { label: 'ハ行', chars: [{ char: 'ハ', romaji: 'ha' }, { char: 'ヒ', romaji: 'hi' }, { char: 'フ', romaji: 'fu' }, { char: 'ヘ', romaji: 'he' }, { char: 'ホ', romaji: 'ho' }] },
  { label: 'マ行', chars: [{ char: 'マ', romaji: 'ma' }, { char: 'ミ', romaji: 'mi' }, { char: 'ム', romaji: 'mu' }, { char: 'メ', romaji: 'me' }, { char: 'モ', romaji: 'mo' }] },
  { label: 'ヤ行', chars: [{ char: 'ヤ', romaji: 'ya' }, null, { char: 'ユ', romaji: 'yu' }, null, { char: 'ヨ', romaji: 'yo' }] },
  { label: 'ラ行', chars: [{ char: 'ラ', romaji: 'ra' }, { char: 'リ', romaji: 'ri' }, { char: 'ル', romaji: 'ru' }, { char: 'レ', romaji: 're' }, { char: 'ロ', romaji: 'ro' }] },
  { label: 'ワ行', chars: [{ char: 'ワ', romaji: 'wa' }, null, null, null, { char: 'ヲ', romaji: 'wo' }] },
  { label: 'ン', chars: [{ char: 'ン', romaji: 'n' }, null, null, null, null] },
];

export const KATAKANA_DAKUTEN: KanaRow[] = [
  { label: 'ガ行', chars: [{ char: 'ガ', romaji: 'ga' }, { char: 'ギ', romaji: 'gi' }, { char: 'グ', romaji: 'gu' }, { char: 'ゲ', romaji: 'ge' }, { char: 'ゴ', romaji: 'go' }] },
  { label: 'ザ行', chars: [{ char: 'ザ', romaji: 'za' }, { char: 'ジ', romaji: 'ji' }, { char: 'ズ', romaji: 'zu' }, { char: 'ゼ', romaji: 'ze' }, { char: 'ゾ', romaji: 'zo' }] },
  { label: 'ダ行', chars: [{ char: 'ダ', romaji: 'da' }, { char: 'ヂ', romaji: 'di' }, { char: 'ヅ', romaji: 'du' }, { char: 'デ', romaji: 'de' }, { char: 'ド', romaji: 'do' }] },
  { label: 'バ行', chars: [{ char: 'バ', romaji: 'ba' }, { char: 'ビ', romaji: 'bi' }, { char: 'ブ', romaji: 'bu' }, { char: 'ベ', romaji: 'be' }, { char: 'ボ', romaji: 'bo' }] },
  { label: 'パ行', chars: [{ char: 'パ', romaji: 'pa' }, { char: 'ピ', romaji: 'pi' }, { char: 'プ', romaji: 'pu' }, { char: 'ペ', romaji: 'pe' }, { char: 'ポ', romaji: 'po' }] },
];
