/**
 * Test phủ thuật ngữ: mọi tên tiếng Trung mà engine CÓ THỂ sinh ra phải có bản Việt.
 * Fail sẽ in đúng danh sách thiếu — đó là "danh sách từ cần xử lý" mà spec mục 3.4 hứa.
 */
import { generateChart } from '../../lib/ziwei/algorithm';
import { hasTerm, viPillar } from '../../lib/i18n/resolve';
import { SCHOOL_STAR_ID_TO_NAME } from '../../lib/ziwei/school-data';
import { STEMS, BRANCHES, SHICHEN, PALACE_NAMES_ORDER, JU_NAMES, STAR_DESCRIPTIONS } from '../../lib/ziwei/constants';
import type { ZiweiChart } from '../../lib/ziwei/types';

/**
 * Interface đã hứa với Task 10 (báo cáo từ khó): gom MỌI nhãn Hán một lá số phát ra.
 * Không gồm fourPillars/fourPillarsLunar — can chi ghép 60 tổ hợp không phải từ bảng,
 * bên quét dưới chạy qua viPillar (tách can+chi), đưa vào đây sẽ đòi 60 dòng bảng giả.
 */
export function collectChartNames(chart: ZiweiChart): string[] {
  const out: string[] = [];
  const push = (n: string | undefined) => { if (n) out.push(n); };
  push(chart.wuxingJuName);
  push(chart.mingZhu);
  push(chart.shenZhu);
  push(chart.yinYangGender);
  for (const p of chart.palaces) {
    push(p.name);
    push(p.borrowedFromName);
    for (const s of p.stars) {
      push(s.name);
      push(s.brightnessRaw);
      push(s.siHua);
    }
  }
  for (const dx of chart.daXians) push(dx.palaceName);
  return out;
}

const missing = new Set<string>();
const check = (name: string | undefined, where: string) => {
  if (!name) return;
  if (!hasTerm(name)) missing.add(`${name}  (${where})`);
};
// Thiếu nửa can/chi của một trụ → sửa ở bảng STEMS/BRANCHES (already scanned ở mục 2),
// không phải thêm 60 dòng trụ vào terms.override.ts.
const checkPillar = (zh: string | undefined, where: string) => {
  if (!zh) return;
  if (viPillar(zh).missing) missing.add(`${zh}  (${where}) — một nửa can/chi chưa có bản Việt`);
};

// 1. Ten trong bang tinh ye cua repo (61 ID sao trong school-data.ts)
for (const id of Object.keys(SCHOOL_STAR_ID_TO_NAME)) {
  check(SCHOOL_STAR_ID_TO_NAME[Number(id)], `school-data id ${id}`);
}

// 2. Cang, chi, canh, cung, cuc — cac bang hien thi trong constants.ts
for (const s of STEMS) check(s, 'STEMS');
for (const b of BRANCHES) check(b, 'BRANCHES');
for (const sc of SHICHEN) check(sc.name, 'SHICHEN.name');
for (const p of PALACE_NAMES_ORDER) check(p, 'PALACE_NAMES_ORDER');
for (const ju of Object.values(JU_NAMES)) check(ju, 'JU_NAMES');
for (const star of Object.keys(STAR_DESCRIPTIONS)) check(star, 'STAR_DESCRIPTIONS key');

// 3. Brightness: StarBrightness co 9 bac (types.ts:42), iztro chi co 7
for (const b of ['庙', '旺', '得', '利', '平', '不', '闲', '地', '陷']) check(b, 'StarBrightness');
// 4. Tu hoa
for (const h of ['禄', '权', '科', '忌']) check(h, 'SiHua');

// 5. Ten THAT ma 24 ban sinh khac nhau sinh ra
const SAMPLES: Array<[number, number, number, number]> = [
  [1990, 6, 15, 6], [1985, 1, 20, 0], [2000, 2, 29, 11], [1976, 12, 31, 5],
  [1948, 3, 1, 2], [2026, 7, 24, 8], [1994, 8, 9, 10], [1969, 4, 4, 3],
  [2012, 9, 10, 7], [1937, 11, 22, 1], [2023, 5, 6, 4], [1959, 10, 1, 9],
  [1971, 6, 18, 11], [2008, 1, 1, 0], [1988, 7, 7, 6], [1999, 12, 25, 2],
  [2019, 2, 5, 10], [1945, 8, 15, 4], [2030, 6, 1, 8], [1954, 4, 12, 0],
  [1982, 3, 13, 5], [2004, 11, 30, 11], [1966, 9, 9, 3], [2021, 1, 3, 7],
];
const seen = new Set<string>();
for (const [y, m, d, h] of SAMPLES) {
  for (const g of ['male', 'female'] as const) {
    const chart = generateChart({ year: y, month: m, day: d, hour: h, gender: g });
    const where = `${y}-${m}-${d} ${g}`;
    // collectChartNames: trường vô danh — nhãn nào thiếu thì dòng missing tự nói tên nó.
    for (const n of collectChartNames(chart)) check(n, `${where} chart field`);
    for (const p of chart.lunarInfo.fourPillars ?? []) checkPillar(p, `${where} fourPillars`);
    for (const p of chart.lunarInfo.fourPillarsLunar ?? []) checkPillar(p, `${where} fourPillarsLunar`);
    // seen giữ đúng nghĩa "tên SAO" cho con số in ra cuối test.
    for (const p of chart.palaces) for (const s of p.stars) seen.add(s.name);
  }
}

// San_floor: nếu algorithm đổi shape (palaces rỗng, stars mất tên…) thì quét bên trên chạy
// trên không-thống — coverage "pass" mà không phủ gì cả. 48 lá số thật đo được 70 tên sao
// phân biệt; thấp hơn sàn nghĩa là shape regression, không phải may.
if (seen.size < 70) {
  console.error(`✗ Shape regression: chỉ gom được ${seen.size} tên sao từ 48 lá số (san 70) — ` +
                `coverage quét khoảng trống, không được tính là đạt.`);
  process.exit(1);
}

if (missing.size) {
  console.error(`✗ ${missing.size} thuật ngữ engine sinh ra mà chưa có bản Việt:`);
  for (const line of [...missing].sort()) console.error('  ' + line);
  console.error(`\n→ thêm vào lib/i18n/terms.override.ts kèm note, rồi chạy lại test này.`);
  console.error(`→ đã kiểm chứng được ${seen.size} tên sao khác nhau từ 48 lá số.`);
  process.exit(1);
}
console.log(`✅ chart-name-coverage: ${seen.size} tên sao thực tế + fourPillars (ghép can/chi qua viPillar) + toàn bộ bảng constants/school-data đều có bản Việt.`);
