/**
 * Ratchet: file đã chuyển sang <Bi> không được còn literal tiếng Trung trần.
 * Muon mo rong = them file vao ADOPTED sau khi task convert xong file do.
 */
import { readFileSync } from 'node:fs';
import { UI_VI, UI_FMT_VI } from '../../lib/i18n/ui-phrases';
import { hasTerm } from '../../lib/i18n/resolve';

const CJK = /[\u4e00-\u9fff]/;

/** Danh sách file đã convert. Task 7/8/9 lần lượt thêm file của mình vào đây. */
export const ADOPTED: string[] = [];

/** Literal được bỏ qua có chủ đích, kèm lý do. Không có cơ chế pattern — nếu có,
 *  test sẽ âm thầm cho qua đúng thứ nó nên bắt. */
const EXCLUDE = new Set<string>([
  // '《骨髓赋》', // ly do: ten tac pham, giu nguyen van
  // R6 (Task 5, trước khi Task 7 khai báo PalaceCell vào ADOPTED):
  // PalaceCell.tsx:117-120 render hai badge đơn tự '命' và '身' trong ô chữ 7px.
  // Dịch ra 'M'/'T' thì không đọc được, mà badge vốn chỉ trang trí (không mang dữ liệu),
  // nên giữ nguyên Hán có chủ đích. Đây là hai literal đơn tự DUY NHẤT được miễn;
  // mọi chuỗi dài hơn chứa hai chữ này (ví dụ '查看命盘') vẫn bị bắt như thường,
  // vì EXCLUDE khớp từng chuỗi nguyên văn, không khớp theo mẫu.
  '命', // ly do: badge 7px trang tri o PalaceCell.tsx:116 (R6) - giu nguyen van
  '身', // ly do: badge 7px trang tri o PalaceCell.tsx:119 (R6) - giu nguyen van
  // '限' và '年' (ChartBoard.tsx:75) KHÔNG cần ở đây: cả hai là THUẬT NGỮ trong
  // terms.override.ts nên nhánh `hasTerm(lit)` bên dưới đã chấp nhận. Đã kiểm chứng
  // (hasTerm('限')=true → 'Hạn', hasTerm('年')=true → 'Lưu niên'); nếu ai đó xóa hai
  // override đó thì ratchet lập tức báo, đúng chiều mong muốn.
]);

/**
 * Template literal có ${} chứa chữ Hán KHÔNG thể tra bằng key trần, nên phải được
 * khai báo tường minh ở đây (đúng nguyên văn source) sau khi đã chuyển sang biFmt.
 * Không khai báo = vi phạm. Đây là cách bịt lỗ hổng "template lọt lưới ratchet".
 *
 * LUU Y cho Task 7 (R7): chuoi khai bao o day PHAI trung dung nguyen van cau ma
 * extractCjkLiterals bat duoc, tuc la giu ca ky tu `$` trong template literal cua source.
 * Hien tai ChartBoard.tsx:175 viet `{dx.startAge}–{dx.endAge}岁` duoi dang JSX text
 * (khong phai chuoi) nen extractor khong nhin thay gi ca — day la diem mu cua extractor,
 * khong phai "da duoc mien". Hai duong cho Task 7:
 *  (a) goi biFmt('{n1}–{n2}岁', ...) = chuoi tran, khong co `$` → khong can TEMPLATE_OK,
 *      chi can them key '{n1}–{n2}岁' vao UI_FMT_VI (R7); hoac
 *  (b) giu source la template literal thi phai them dong
 *      '${dx.startAge}–${dx.endAge}岁'  (bat dau bang `$`) vao TEMPLATE_OK ben duoi.
 * Khai bao sai dang so voi source = van bi báo vi pham, khong lo.
 */
const TEMPLATE_OK = new Set<string>([
  // '{dx.startAge}–{dx.endAge}岁', // ChartBoard.tsx:175 — đã về biFmt ở Task 7 Step 4
]);

/** Lay moi chuoi literal chua chu Han, bo comment. Trả về [chuoi, laTemplate]. */
export function extractCjkLiterals(source: string): Array<[string, boolean]> {
  const out: Array<[string, boolean]> = [];
  for (const rawLine of source.split('\n')) {
    const trimmed = rawLine.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue;
    // bỏ comment cuối dòng khi nó nằm ngoài chuỗi (đơn giản: chỉ cắt khi có // sau một ' hoặc " hoặc đầu dòng)
    const line = trimmed.replace(/^(\/\/|\*).*$/, '');
    for (const m of line.matchAll(/'([^'\\\n]*)'|"([^"\\\n]*)"|`([^`\\\n]*)`/g)) {
      const s = m[1] ?? m[2] ?? m[3];
      if (!s || !CJK.test(s)) continue;
      const isTemplate = m[3] !== undefined && s.includes('${');
      out.push([s, isTemplate]);
    }
  }
  return out;
}

const known = new Set([...Object.keys(UI_VI), ...Object.keys(UI_FMT_VI)]);
const violations: string[] = [];

for (const file of ADOPTED) {
  const src = readFileSync(file, 'utf8');
  for (const [lit, isTemplate] of extractCjkLiterals(src)) {
    if (isTemplate) {
      if (TEMPLATE_OK.has(lit)) continue;
      violations.push(`${file}: TEMPLATE '${lit}' → dùng biFmt + khai báo TEMPLATE_OK`);
      continue;
    }
    if (EXCLUDE.has(lit)) continue;
    if (known.has(lit) || hasTerm(lit)) continue;
    violations.push(`${file}: '${lit}'`);
  }
}

if (violations.length) {
  console.error(`✗ ${violations.length} literal tiếng Trung chưa có bản dịch trong file đã convert:`);
  for (const v of [...new Set(violations)].slice(0, 40)) console.error('  ' + v);
  console.error(`\n→ thêm vào lib/i18n/ui-phrases.ts (câu) hoặc terms.override.ts (thuật ngữ), hoặc bọc bằng <Bi>.`);
  process.exit(1);
}
console.log(`✅ ui-phrase-coverage: ${ADOPTED.length} file đã convert sạch (${known.size} câu trong bảng).`);
