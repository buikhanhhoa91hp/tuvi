/**
 * Sinh lib/i18n/terms.generated.ts từ bảng locale vi-VN / zh-CN của iztro.
 *
 * Chạy: npm run terms:sync   (khi iztro lên bản mới, hoặc khi cần nạp lại)
 *
 * Hai bảng locale được key bằng ID tiếng Anh (ziweiMaj, miao, jiaHeavenly...),
 * trùng nhau tuyệt đối giữa zh-CN và vi-VN — nên ta ghép theo key để ra cặp Hán→Việt.
 *
 * Chỉ dùng lúc build. KHÔNG import module này trong app: nó đọc file trong node_modules.
 */
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';

const require = createRequire(import.meta.url);
const BASE = 'iztro/lib/i18n/locales';
const OUT = 'lib/i18n/terms.generated.ts';
const CJK = /[\u4e00-\u9fff]/;

const NAMESPACE_TO_KIND: Record<string, string> = {
  star: 'star', palace: 'palace', brightness: 'brightness', mutagen: 'mutagen',
  heavenlyStem: 'stem', earthlyBranch: 'branch', fiveElementsClass: 'element', gender: 'gender',
};
const NAMESPACES = Object.keys(NAMESPACE_TO_KIND);

const table = new Map<string, string>();
const conflictMap = new Map<string, { key: string; vi: string }[]>();
let skippedNoCjk = 0;

for (const ns of NAMESPACES) {
  const zh = require(`${BASE}/zh-CN/${ns}.js`).default as Record<string, string>;
  const vi = require(`${BASE}/vi-VN/${ns}.js`).default as Record<string, string>;
  for (const key of Object.keys(zh)) {
    const zhVal = zh[key];
    const viVal = vi[key];
    if (viVal === undefined) throw new Error(`iztro: key ${key} có ở zh-CN nhưng thiếu ở vi-VN (ns=${ns})`);
    if (!CJK.test(zhVal) || CJK.test(viVal)) { skippedNoCjk++; continue; }
    const existing = table.get(zhVal);
    if (existing !== undefined && existing !== viVal) {
      if (!conflictMap.has(zhVal)) conflictMap.set(zhVal, [{ key: `${ns}:${key}→${existing}`, vi: existing }]);
      conflictMap.get(zhVal)!.push({ key: `${ns}:${key}→${viVal}`, vi: viVal });
      continue; // giữ lần gặp đầu; xung đột sẽ hiện trong báo cáo để quyết định bằng override
    }
    table.set(zhVal, viVal);
  }
}

// Biến thể có hậu tố: dữ liệu repo dùng dạng đầy đủ, iztro dùng dạng ngắn.
// 兄弟 (iztro) nhưng constants.ts:25 lại là '兄弟宫'.  子 (iztro) nhưng SHICHEN là '子时'.
let suffixVariants = 0;
const palaces = require(`${BASE}/zh-CN/palace.js`).default as Record<string, string>;
const palaceVi = require(`${BASE}/vi-VN/palace.js`).default as Record<string, string>;
for (const key of Object.keys(palaces)) {
  const zhVal = palaces[key];
  const viVal = palaceVi[key];
  // Guard giống vòng chính: khóa Hán phải có chữ Hán, giá trị Việt phải là Latin.
  if (!CJK.test(zhVal) || CJK.test(viVal)) continue;
  const full = zhVal.endsWith('宫') ? zhVal : zhVal + '宫';
  if (full !== zhVal && !table.has(full)) { table.set(full, viVal); suffixVariants++; }
}
const branches = require(`${BASE}/zh-CN/earthlyBranch.js`).default as Record<string, string>;
const branchVi = require(`${BASE}/vi-VN/earthlyBranch.js`).default as Record<string, string>;
for (const key of Object.keys(branches)) {
  const zhVal = branches[key];
  const hour = zhVal + '时';
  if (!table.has(hour)) { table.set(hour, `Giờ ${branchVi[key]}`); suffixVariants++; }
}

const conflicts = [...conflictMap.entries()].map(([zh, winners]) => ({ zh, winners }));
const sorted = [...table.entries()].sort((a, b) => a[0].localeCompare(b[0], 'zh-Hans-CN'));

if (!existsSync('lib/i18n')) mkdirSync('lib/i18n', { recursive: true });
const body = sorted.map(([zh, vi]) => `  '${zh}': '${vi}',`).join('\n');
writeFileSync(OUT, `/**
 * AUTO-GENERATED bởi scripts/i18n/sync-terms.ts — KHÔNG SỬA TAY.
 * Nguồn: iztro/lib/i18n/locales/{zh-CN,vi-VN} (MIT).
 * Muốn đổi một bản dịch: sửa lib/i18n/terms.override.ts (override thắng bảng này).
 * Chạy lại: npm run terms:sync
 *
 * ${sorted.length} mục (${suffixVariants} biến thể có hậu tố do script thêm vào).
 */
export const GENERATED_TERMS: Record<string, string> = {
${body}
};
`, 'utf8');

console.log(`✓ ${OUT}: ${sorted.length} mục, ${suffixVariants} biến thể hậu tố, bỏ ${skippedNoCjk} mục Việt còn chữ Hán`);
if (conflicts.length) {
  console.log(`! ${conflicts.length} xung đột cùng khóa Hán (đã giữ lần gặp đầu, cần quyết định trong terms.override.ts):`);
  for (const c of conflicts.slice(0, 12)) console.log(`    ${c.zh}: ${c.winners.map((w) => w.key).join(' | ')}`);
}
