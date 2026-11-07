/**
 * C-9 — ĐẦU VÀO MÁY CŨNG PHẢI SONG NGỮ.
 *
 * Người dùng bác phán quyết "prompt gửi AI giữ tiếng Trung vì là đầu vào máy": họ cần đọc
 * hiểu thứ mình gửi. Prompt nay sống ở lib/i18n/ai-prompts.ts dưới dạng cặp zh/vi, và
 * ui-phrase-coverage.test.ts đã XÓA 26 dòng EXCLUDE + 1 dòng TEMPLATE_OK tương ứng.
 * File này thay thế chỗ miễn trừ đó: chứng minh đầu vào máy THỰC SỰ có hai vế, chứ không
 * chỉ chứng minh nó không nằm trần trong component.
 *
 * Bất biến:
 *  1. Mọi BiLine: zh chứa chữ Hán, vi KHÔNG chứa chữ Hán (đối chiếu thuần, không trộn),
 *     cả hai khác rỗng và khác nhau.
 *  2. Phủ đủ 6 topic và đủ 12 cung LÚC CHẠY của engine (đo bằng lá số thật, không phải
 *     PALACE_NAMES_ORDER — đó là thứ tự hiển thị, dùng nó đã khiến bảng role khóa sai và
 *     prompt cung crash trên /chart). Thiếu một cung thì `role.zh` ném TypeError.
 *  3. Mọi tên sao engine có thể sinh (SCHOOL_STAR_ID_TO_NAME) × 4 hóa × 2 nhãn thời gian
 *     khi đưa qua builder phải cho vế Việt KHÔNG còn chữ Hán — tức bảng thuật ngữ phủ đủ,
 *     builder không âm thầm rơi về chữ Hán (biTerm trả vi===zh khi missing).
 *  4. Hình thức đầu ra: quy ước 2 dòng, lead 2 dòng, rồi mỗi mục 3 dòng (tiêu đề song ngữ,
 *     thân Hán, thân Việt). Tiêu đề vẫn khớp regex AiContent của InsightPanel.
 *  5. Không sót placeholder nội suy (`${` hoặc `{name}`) trong chuỗi gửi đi.
 *
 * Vòng lặp phủ (hàng nghìn prompt) chỉ đếm lỗi rồi in một dòng kết quả — không spam stdout.
 */
import {
  PROMPT_NOTE, TOPIC_PROMPTS, PALACE_ROLES,
  buildTopicPrompt, buildPalacePrompt, buildSiHuaPrompt,
  type BiLine, type TopicKey,
} from '../../lib/i18n/ai-prompts';
import { PALACE_NAMES_ORDER } from '../../lib/ziwei/constants';
import { SCHOOL_STAR_ID_TO_NAME } from '../../lib/ziwei/school-data';
import { TOPIC_PALACE_NAME } from '../../lib/ziwei/db-analysis';
import { generateChart } from '../../lib/ziwei/algorithm';

let failed = 0;
const ok = (c: boolean, m: string) => { if (!c) { failed++; console.error('  ✗ ' + m); } else console.log('  ✓ ' + m); };

/** Bộ đếm lỗi im lặng cho vòng lặp phủ; trả số lỗi để ok() in một dòng duy nhất. */
let silent = 0;
const need = (c: boolean, m: string) => { if (!c) { silent++; if (silent <= 20) console.error('    · ' + m); } };

const CJK = /[\u4e00-\u9fff]/;
const TOPIC_KEYS: TopicKey[] = ['overview', 'love', 'career', 'wealth', 'health', 'personality'];
const SIHUA = ['禄', '权', '科', '忌'];
/** Regex AiContent dùng nhận diện tiêu đề mục (components/InsightPanel.tsx). */
const AI_TITLE = /^\*\*【(.+?)】\*\*$/;
const TITLE_PAIR = /^\*\*【([^】]+)】\/【([^】]+)】\*\*$/;

function checkLine(l: BiLine, where: string): void {
  need(!!l && typeof l.zh === 'string' && l.zh.trim().length > 0, `${where}: vế Hán rỗng`);
  need(!!l && typeof l.vi === 'string' && l.vi.trim().length > 0, `${where}: vế Việt rỗng`);
  if (!l) return;
  need(CJK.test(l.zh), `${where}: vế Hán không chứa chữ Hán`);
  need(!CJK.test(l.vi), `${where}: vế Việt trộn chữ Hán → ${l.vi}`);
  need(l.zh !== l.vi, `${where}: hai vế giống nhau (bản sao chưa dịch)`);
}

const bodyLines = (prompt: string): string[] => prompt.split('\n').filter(l => l.trim() !== '');

/** Cấu trúc renderPrompt: [note.zh, note.vi, lead.zh, lead.vi, (title, body.zh, body.vi)*]. */
function checkShape(prompt: string, where: string): void {
  const lines = bodyLines(prompt);
  need(lines[0] === PROMPT_NOTE.zh, `${where}: dòng 1 phải là quy ước vế Hán`);
  need(lines[1] === PROMPT_NOTE.vi, `${where}: dòng 2 phải là quy ước vế Việt`);
  need(lines.length >= 7, `${where}: prompt quá ngắn (${lines.length} dòng)`);
  if (lines.length < 7) return;
  need(CJK.test(lines[2]), `${where}: lead Hán không chứa chữ Hán`);
  need(!CJK.test(lines[3]), `${where}: lead Việt trộn chữ Hán → ${lines[3]}`);
  need(!lines.some(l => l.includes('undefined') || l.includes('NaN')), `${where}: sót undefined/NaN`);
  need(!prompt.includes('${') && !/\{\w+\}/.test(prompt), `${where}: sót placeholder nội suy`);
  let sections = 0;
  for (let i = 4; i < lines.length; i += 3) {
    const title = lines[i];
    const m = title?.match(TITLE_PAIR);
    need(!!m, `${where}: dòng ${i} không phải tiêu đề 【Hán】/【Việt】 → ${title}`);
    if (!m) return;
    need(AI_TITLE.test(title), `${where}: tiêu đề không khớp regex AiContent`);
    need(CJK.test(m[1]) && !CJK.test(m[2]), `${where}: tiêu đề trộn ngôn ngữ → ${title}`);
    need(i + 2 < lines.length, `${where}: mục '${m[1]}' thiếu thân mục`);
    if (i + 2 >= lines.length) return;
    need(CJK.test(lines[i + 1]), `${where}: thân Hán của '${m[1]}' không chứa chữ Hán`);
    need(!CJK.test(lines[i + 2]), `${where}: thân Việt của '${m[1]}' trộn chữ Hán → ${lines[i + 2]}`);
    sections++;
  }
  need(sections >= 4, `${where}: chỉ có ${sections} mục (cần >= 4)`);
}

// ── 1. Bảng chỉ dẫn ───────────────────────────────────────────────────────────
console.log('\n[1] Bảng prompt song ngữ (lib/i18n/ai-prompts.ts)');
silent = 0;
checkLine(PROMPT_NOTE, 'PROMPT_NOTE');
for (const key of TOPIC_KEYS) {
  const spec = TOPIC_PROMPTS[key];
  need(!!spec, `topic '${key}' không tồn tại`);
  if (!spec) continue;
  checkLine(spec.lead, `topic ${key} lead`);
  need(spec.sections.length >= 4, `topic ${key}: ${spec.sections.length} mục (cần >= 4)`);
  const seen = new Set<string>();
  for (const [i, s] of spec.sections.entries()) {
    checkLine(s.title, `topic ${key} title#${i}`);
    checkLine(s.body, `topic ${key} body#${i}`);
    need(!seen.has(s.title.zh), `topic ${key}: tiêu đề '${s.title.zh}' lặp`);
    seen.add(s.title.zh);
  }
}
ok(silent === 0, `6 topic × (lead + các mục): mọi dòng chỉ dẫn có đủ hai vế sạch (${silent} lỗi)`);
ok(Object.keys(TOPIC_PROMPTS).length === TOPIC_KEYS.length, 'không topic thừa ngoài 6 khóa đã khai');

// ── 2. Phủ không gian tên của engine ──────────────────────────────────────────
console.log('\n[2] Phủ tên cung / tên sao engine');
const starNames = [...new Set(Object.values(SCHOOL_STAR_ID_TO_NAME))];
ok(starNames.length >= 61, `SCHOOL_STAR_ID_TO_NAME: ${starNames.length} tên sao (>= 61)`);

/**
 * Không gian tên cung LÚC CHẠY. iztro chỉ giữ chữ 宫 cho 命宫, các cung khác mất hậu tố,
 * và cung bạn bè là 仆役 chứ không phải 交友 (lib/ziwei/db-analysis.ts:17).
 * PALACE_NAMES_ORDER của constants.ts là thứ tự HIỂN THỊ — dùng nó để đo độ phủ đã khiến
 * bảng role khóa sai và prompt cung crash trên /chart. Ở đây đo bằng lá số THẬT.
 */
const SAMPLES: Array<[number, number, number, number]> = [
  [1990, 6, 15, 6], [1985, 1, 20, 0], [2000, 2, 29, 11], [1976, 12, 31, 5],
  [1948, 3, 1, 2], [2026, 7, 24, 8], [1994, 8, 9, 10], [1969, 4, 4, 3],
  [2012, 9, 10, 7], [1937, 11, 22, 1], [2023, 5, 6, 4], [1959, 10, 1, 9],
];
const charts = SAMPLES.flatMap(([y, m, d, h]) =>
  (['male', 'female'] as const).map(g => generateChart({ year: y, month: m, day: d, hour: h, gender: g })));
const runtimePalaces = [...new Set(charts.flatMap(c => c.palaces.map(p => p.name)))];
const mappedPalaces = [...new Set(Object.values(TOPIC_PALACE_NAME))];

silent = 0;
for (const p of runtimePalaces) {
  need(!!PALACE_ROLES[p], `PALACE_ROLES thiếu cung lúc chạy '${p}'`);
  if (PALACE_ROLES[p]) checkLine(PALACE_ROLES[p], `role ${p}`);
}
ok(silent === 0, `PALACE_ROLES phủ ${runtimePalaces.length} cung của ${charts.length} lá số thật, mỗi cung một cặp song ngữ (${silent} lỗi)`);
ok(runtimePalaces.length === 12 && mappedPalaces.every(p => runtimePalaces.includes(p)),
  'không gian tên cung lúc chạy khớp TOPIC_PALACE_NAME của engine (12 cung)');
ok(Object.keys(PALACE_ROLES).length === runtimePalaces.length && Object.keys(PALACE_ROLES).every(k => runtimePalaces.includes(k)),
  'PALACE_ROLES không có khóa thừa (khóa dạng 夫妻宫 không bao giờ khớp lúc chạy)');
ok(!runtimePalaces.some(p => PALACE_NAMES_ORDER.includes(p) && p !== '命宫'),
  'đã chốt: palace.name lúc chạy không phải PALACE_NAMES_ORDER (trừ 命宫)');

// ── 3. Prompt topic đã render ─────────────────────────────────────────────────
console.log('\n[3] Prompt topic render ra đúng hình thức đối chiếu');
silent = 0;
for (const key of TOPIC_KEYS) checkShape(buildTopicPrompt(key), `topic ${key}`);
ok(silent === 0, `6 topic: quy ước → lead → từng mục (tiêu đề song ngữ, thân Hán, thân Việt) (${silent} lỗi)`);

// ── 4. Prompt cung vị ─────────────────────────────────────────────────────────
console.log('\n[4] Prompt cung vị');
const palacePrompt = buildPalacePrompt('夫妻', [{ name: '武曲', siHua: '禄' }, { name: '七杀' }]);
silent = 0;
checkShape(palacePrompt, 'cung Phu Thê');
ok(silent === 0, `prompt cung: hình thức đối chiếu đúng (${silent} lỗi)`);
ok(palacePrompt.includes('武曲化禄、七杀'), 'vế Hán ghép tên sao + hóa, nối bằng 、');
ok(palacePrompt.includes('Vũ Khúc Hóa Lộc, Thất Sát'), 'vế Việt ghép bản dịch thuật ngữ');
ok(palacePrompt.includes('【夫妻】') && palacePrompt.includes('cung Phu Thê'), 'tên cung có cả hai vế');
ok(palacePrompt.includes(PALACE_ROLES['夫妻'].zh) && palacePrompt.includes(PALACE_ROLES['夫妻'].vi),
  'chủ quản của cung có cả hai vế');

const emptyPrompt = buildPalacePrompt('命宫', []);
silent = 0;
checkShape(emptyPrompt, 'cung trống');
ok(silent === 0, `cung không có chính tinh: hình thức vẫn đúng (${silent} lỗi)`);
ok(emptyPrompt.includes('空宫（借对宫）') && emptyPrompt.includes('Cung trống (mượn cung đối diện)'),
  'nhãn cung trống song ngữ');

// Quét LÁ SỐ THẬT: đây là chỗ đáng lẽ phải bắt lỗi khóa sai ở trên. Mỗi cung của mỗi lá số
// được đưa qua builder với đúng chính tinh của nó — crash vì role undefined sẽ nổ tại đây.
silent = 0;
let realPalaces = 0;
for (const c of charts) {
  for (const p of c.palaces) {
    checkShape(buildPalacePrompt(p.name, p.stars.filter(s => s.type === 'major')), `${p.name} (${c.birthInfo.year})`);
    realPalaces++;
  }
}
ok(silent === 0, `${realPalaces} cung của ${charts.length} lá số thật: prompt dựng được, vế Việt sạch chữ Hán (${silent} lỗi)`);

silent = 0;
for (const p of runtimePalaces) {
  checkShape(buildPalacePrompt(p, starNames.map(n => ({ name: n }))), `cung ${p} × ${starNames.length} sao`);
}
ok(silent === 0, `${runtimePalaces.length} cung × ${starNames.length} sao: không vế Việt nào rơi về chữ Hán (${silent} lỗi)`);

// ── 5. Prompt tứ hóa phi hóa ──────────────────────────────────────────────────
console.log('\n[5] Prompt tứ hóa phi hóa');
const daxian = buildSiHuaPrompt({ starName: '武曲', siHua: '禄', viewLabel: 'daxian', palaceName: '财帛' });
silent = 0;
checkShape(daxian, 'tứ hóa đại hạn');
ok(silent === 0, `prompt tứ hóa: hình thức đối chiếu đúng (${silent} lỗi)`);
ok(daxian.includes('【大限武曲化禄】'), 'vế Hán: nhãn đại hạn + sao + hóa');
ok(daxian.includes('【Đại hạn Vũ Khúc Hóa Lộc】'), 'vế Việt: nhãn đại hạn + sao + hóa');
ok(daxian.includes('【财帛】') && daxian.includes('cung Tài Bạch'), 'cung giáng xuống có cả hai vế');

const liunian = buildSiHuaPrompt({ starName: '廉贞', siHua: '忌', viewLabel: 'other', palaceName: '命宫' });
ok(liunian.includes('【流年廉贞化忌】') && liunian.includes('【Lưu niên Liêm Trinh Hóa Kỵ】'),
  "viewLabel khác 'daxian' → 流年／Lưu niên (giữ hành vi cũ của InsightPanel)");

const orphan = buildSiHuaPrompt({ starName: '紫微', siHua: '科', viewLabel: 'daxian' });
silent = 0;
checkShape(orphan, 'tứ hóa không tìm thấy cung');
ok(silent === 0, `không tìm thấy cung chứa sao: hình thức vẫn đúng (${silent} lỗi)`);
ok(orphan.includes('未知宫位') && orphan.includes('Cung không xác định'),
  'nhãn cung dự phòng song ngữ, không in undefined');

silent = 0;
for (const star of starNames) {
  for (const h of SIHUA) {
    for (const viewLabel of ['daxian', 'other'] as const) {
      checkShape(buildSiHuaPrompt({ starName: star, siHua: h, viewLabel, palaceName: '命宫' }),
        `${star}化${h}/${viewLabel}`);
    }
  }
}
const combos = starNames.length * SIHUA.length * 2;
ok(silent === 0, `${combos} tổ hợp sao × hóa × nhãn thời gian: vế Việt sạch chữ Hán (${silent} lỗi)`);

silent = 0;
for (const p of runtimePalaces) {
  for (const h of SIHUA) checkShape(buildSiHuaPrompt({ starName: '武曲', siHua: h, viewLabel: 'daxian', palaceName: p }), `hóa ${h} nhập ${p}`);
}
ok(silent === 0, `${runtimePalaces.length} cung lúc chạy × 4 hóa: nhãn cung giáng xuống có đủ hai vế (${silent} lỗi)`);

// Đường đi THẬT của InsightPanel: sao có hóa trong lá số + cung chứa sao đó.
silent = 0;
let realSiHua = 0;
for (const c of charts) {
  for (const p of c.palaces) {
    for (const s of p.stars) {
      if (!s.siHua) continue;
      checkShape(buildSiHuaPrompt({ starName: s.name, siHua: s.siHua, viewLabel: 'daxian', palaceName: p.name }),
        `${s.name}化${s.siHua} nhập ${p.name}`);
      realSiHua++;
    }
  }
}
ok(silent === 0, `${realSiHua} tứ hóa thật trong ${charts.length} lá số: prompt dựng được, không rơi về chữ Hán (${silent} lỗi)`);

console.log(failed ? `\n✗ ai-prompt-bilingual: ${failed} lỗi` : '\n✅ ai-prompt-bilingual: đạt');
process.exit(failed ? 1 : 0);