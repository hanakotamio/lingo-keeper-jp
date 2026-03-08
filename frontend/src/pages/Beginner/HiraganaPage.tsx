import { HIRAGANA_SEION, HIRAGANA_DAKUTEN } from '@/data/hiragana';
import { KanaTablePage } from './KanaTablePage';

export function HiraganaPage() {
  return (
    <KanaTablePage
      title="Hiragana Chart"
      titleJp="ひらがな五十音表"
      seion={HIRAGANA_SEION}
      dakuten={HIRAGANA_DAKUTEN}
      storageKey="lingo_keeper_hiragana_learned"
    />
  );
}
