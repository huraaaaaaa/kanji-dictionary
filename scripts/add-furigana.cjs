const Kuroshiro = require('kuroshiro').default;
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('kuroshiro を初期化中...');
  const kuroshiro = new Kuroshiro();
  await kuroshiro.init(new KuromojiAnalyzer());
  console.log('初期化完了。辞典データを処理中...');

  const dictPath = path.join(__dirname, '../src/data/dictionary.json');
  const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

  for (let i = 0; i < dict.length; i++) {
    const entry = dict[i];
    if (i % 100 === 0) console.log(`  ${i}/${dict.length} 件処理済み`);

    entry.originFurigana = await kuroshiro.convert(entry.origin, { mode: 'furigana', to: 'hiragana' });

    for (const vocab of entry.vocabulary) {
      vocab.meaningFurigana = await kuroshiro.convert(vocab.meaning, { mode: 'furigana', to: 'hiragana' });
      vocab.exampleFurigana = await kuroshiro.convert(vocab.example, { mode: 'furigana', to: 'hiragana' });
    }
  }

  fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2), 'utf8');
  console.log(`完了: ${dict.length} 件にふりがなフィールドを追記しました。`);
}

main().catch((err) => { console.error(err); process.exit(1); });
