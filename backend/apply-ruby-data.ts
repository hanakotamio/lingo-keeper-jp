import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * OpenAI GPT-4を使って日本語テキストにrubyタグを追加する
 */
async function generateRubyText(text: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `あなたは日本語テキストにHTMLのrubyタグでふりがなを追加するアシスタントです。
以下のルールに従ってください：
1. 漢字（漢字のみ、または漢字+仮名の熟語）にrubyタグを付ける
2. 形式: <ruby>漢字<rt>ふりがな</rt></ruby>
3. ひらがな・カタカナ・記号・数字・英字はそのまま出力する
4. テキストの内容・順序・改行を変えない
5. タグ以外の文字を追加・削除しない
6. 送り仮名は漢字部分のみにrubyタグを付ける（例: <ruby>食<rt>た</rt></ruby>べる）`
      },
      {
        role: 'user',
        content: text
      }
    ],
    temperature: 0,
    max_tokens: 2000,
  });
  return response.choices[0].message.content || text;
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main(): Promise<void> {
  console.log('🚀 ルビデータ追加スクリプト開始...');
  console.log('');

  // 全チャプターを取得（kuroshiroデータをOpenAIで上書き）
  const chapters = await prisma.chapter.findMany({
    select: { chapter_id: true, content: true, story_id: true },
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
      const rubyContent = await generateRubyText(chapter.content);

      await prisma.chapter.update({
        where: { chapter_id: chapter.chapter_id },
        data: { content_ruby: rubyContent },
      });

      console.log(`  ✅ 完了`);
      successCount++;

      // レート制限対策: 1秒待機
      if (i < chapters.length - 1) {
        await sleep(1000);
      }
    } catch (error) {
      console.error(`  ❌ エラー: ${error instanceof Error ? error.message : String(error)}`);
      errorCount++;
      // エラーの場合は2秒待機してから次へ
      await sleep(2000);
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
