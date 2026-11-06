/**
 * Test phủ thuật ngữ: mọi tên tiếng Trung mà engine CÓ THỂ sinh ra phải có bản Việt.
 * Fail sẽ in đúng danh sách thiếu — đó là "danh sách từ cần xử lý" mà spec mục 3.4 hứa.
 */
import { generateChart } from '../../lib/ziwei/algorithm';
import { hasTerm } from '../../lib/i18n/resolve';
import { SCHOOL_STAR_ID_TO_NAME } from '../../lib/ziwei/school-data';
import { STEMS, BRANCHES, SHICHEN, PALACE_NAMES_ORDER, JU_NAMES, STAR_DESCRIPTIONS } from '../../lib/ziwei/constants';

const missing = new Set<string>();
const check = (name: string | undefined, where: string) => {
  if (!name) return;
  if (!hasTerm(name)) missing.add(`${name}  (${where})`);
};

// 1. Ten trong bang tinh ye cua repo (85 ID sao trong school-data.ts)
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
    check(chart.wuxingJuName, `${y}-${m}-${d} wuxingJuName`);
    check(chart.mingZhu, `${y}-${m}-${d} mingZhu`);
    check(chart.shenZhu, `${y}-${m}-${d} shenZhu`);
    for (const p of chart.palaces) {
      check(p.name, `${y}-${m}-${d} palace.name`);
      check(p.borrowedFromName, `${y}-${m}-${d} borrowedFromName`);
      for (const s of p.stars) {
        check(s.name, `${y}-${m}-${d} star.name`);
        if (s.brightnessRaw) check(s.brightnessRaw, `${y}-${m}-${d} brightnessRaw`);
        if (s.siHua) check(s.siHua, `${y}-${m}-${d} siHua`);
        seen.add(s.name);
      }
    }
    for (const dx of chart.daXians) check(dx.palaceName, `${y}-${m}-${d} daXian.palaceName`);
  }
}

if (missing.size) {
  console.error(`✗ ${missing.size} thuật ngữ engine sinh ra mà chưa có bản Việt:`);
  for (const line of [...missing].sort()) console.error('  ' + line);
  console.error(`\n→ thêm vào lib/i18n/terms.override.ts kèm note, rồi chạy lại test này.`);
  console.error(`→ đã kiểm chứng được ${seen.size} tên sao khác nhau từ 48 lá số.`);
  process.exit(1);
}
console.log(`✅ chart-name-coverage: ${seen.size} tên sao thực tế + toàn bộ bảng constants/school-data đều có bản Việt.`);
