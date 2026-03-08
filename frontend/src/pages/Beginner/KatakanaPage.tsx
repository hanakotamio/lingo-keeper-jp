import { KATAKANA_SEION, KATAKANA_DAKUTEN } from '@/data/katakana';
import { KanaTablePage } from './KanaTablePage';

export function KatakanaPage() {
  return (
    <KanaTablePage
      title="Katakana Chart"
      titleJp="カタカナ五十音表"
      seion={KATAKANA_SEION}
      dakuten={KATAKANA_DAKUTEN}
      storageKey="lingo_keeper_katakana_learned"
    />
  );
}
