const https = require('https');
const fs = require('fs');
const path = require('path');

const DICT_PATH = path.join(__dirname, '../src/data/dictionary.json');
const OUT_DIR   = path.join(__dirname, '../public/kanji-svg');
const MISSING_PATH = path.join(OUT_DIR, 'missing.json');
const ATTR_PATH    = path.join(OUT_DIR, 'ATTRIBUTION.txt');
const BASE_URL = 'https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/';
const DELAY_MS = 120;

function toHex(kanji) {
  return (kanji.codePointAt(0) ?? 0).toString(16).padStart(5, '0');
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Write attribution
  fs.writeFileSync(ATTR_PATH, [
    'KanjiVG stroke order SVG data',
    'Copyright (C) 2009-2023 Ulrich Apel',
    'Licensed under Creative Commons Attribution Share-Alike 3.0',
    'https://kanjivg.tagaini.net',
    'https://github.com/KanjiVG/kanjivg',
  ].join('\n') + '\n');

  const dict = JSON.parse(fs.readFileSync(DICT_PATH, 'utf8'));
  const kanjis = [...new Set(dict.map((e) => e.kanji))];
  console.log(`${kanjis.length} 字をダウンロードします…`);

  const missing = [];
  let ok = 0;
  let skipped = 0;

  for (let i = 0; i < kanjis.length; i++) {
    const kanji = kanjis[i];
    const hex = toHex(kanji);
    const dest = path.join(OUT_DIR, `${hex}.svg`);

    if (fs.existsSync(dest)) {
      skipped++;
      continue;
    }

    const url = `${BASE_URL}${hex}.svg`;
    try {
      await download(url, dest);
      ok++;
      if ((ok + skipped) % 50 === 0 || i === kanjis.length - 1) {
        console.log(`  ${i + 1}/${kanjis.length} 完了（新規: ${ok}, スキップ: ${skipped}, 失敗: ${missing.length}）`);
      }
    } catch (err) {
      missing.push({ kanji, hex, error: err.message });
      console.warn(`  ✗ ${kanji} (${hex}): ${err.message}`);
    }

    await sleep(DELAY_MS);
  }

  fs.writeFileSync(MISSING_PATH, JSON.stringify(missing, null, 2), 'utf8');
  console.log(`\n完了: 新規 ${ok} 件, スキップ ${skipped} 件, 失敗 ${missing.length} 件`);
  if (missing.length > 0) {
    console.log(`失敗リスト: ${MISSING_PATH}`);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
