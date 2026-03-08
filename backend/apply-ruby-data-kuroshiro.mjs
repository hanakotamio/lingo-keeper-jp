/**
 * kuroshiroを使って日本語チャプターにルビ（ふりがな）を追加するスクリプト
 * OpenAI APIの代わりにローカルで処理（無料）
 */

import { PrismaClient } from '@prisma/client';
import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';

// CJS/ESM互換
const KuroshiroClass = Kuroshiro.default || Kuroshiro;
const AnalyzerClass = KuromojiAnalyzer.default || KuromojiAnalyzer;

const prisma = new PrismaClient();

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('🚀 kuroshiro ルビデータ追加スクリプト開始...');
  console.log('');

  // kuroshiro 初期化
  console.log('📦 kuroshiro を初期化中...');
  const kuroshiro = new KuroshiroClass();
  const analyzer = new AnalyzerClass();
  await kuroshiro.init(analyzer);
  console.log('✅ kuroshiro 初期化完了');
  console.log('');

  // content_rubyがNULLのチャプターを全て取得
  const chapters = await prisma.chapter.findMany({
    where: { content_ruby: null },
    select: { chapter_id: true, content: true, story_id: true, chapter_number: true },
    orderBy: [{ story_id: 'asc' }, { chapter_number: 'asc' }],
  });

  console.log(`📊 更新対象チャプター数: ${chapters.length}`);
  console.log('');

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];
    console.log(`[${i + 1}/${chapters.length}] story_id=${chapter.story_id}, chapter_id=${chapter.chapter_id}`);

    try {
      // kuroshiroでふりがな付きHTMLを生成
      const rubyContent = await kuroshiro.convert(chapter.content, {
        mode: 'furigana',
        to: 'hiragana',
      });

      await prisma.chapter.update({
        where: { chapter_id: chapter.chapter_id },
        data: { content_ruby: rubyContent },
      });

      console.log(`  ✅ 完了`);
      successCount++;
    } catch (error) {
      console.error(`  ❌ エラー: ${error instanceof Error ? error.message : String(error)}`);
      errorCount++;
      await sleep(500);
    }
  }

  console.log('');
  console.log('=== 完了 ===');
  console.log(`✅ 成功: ${successCount}チャプター`);
  console.log(`❌ エラー: ${errorCount}チャプター`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
