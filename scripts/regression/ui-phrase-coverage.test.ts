/**
 * Ratchet: file đã chuyển sang <Bi> không được còn literal tiếng Trung trần.
 * Muon mo rong = them file vao ADOPTED sau khi task convert xong file do.
 *
 * R28 — ĐẢO NGƯỢC TIÊU CHI (sửa khiếm khuyết của Task 5): "chuỗi đã có trong bảng"
 * (known.has(lit) || hasTerm(lit)) là điều kiện CẦN, không phải ĐỦ: nó thưởng cho
 * việc thêm key vào UI_VI, không thưởng cho việc UI thật sự render qua <Bi>. That
 * nghiem da do: app/chart/page.tsx van in <h1>紫微斗数排盘</h1> tran ma ratchet XANH,
 * vi Task 3 dat chuoi nay vao UI_VI tu truoc. Tu R28, mot literal trong file ADOPTED
 * chi qua khi:
 *   (a) nam TRONG pham vi mot loi dich: <Bi .../>, biText(, biFmt(, biTerm(, viTerm(,
 *       viPillar( hoac mot `.vi` access din vao bieu thuc chua no; hoac
 *   (b) duoc khai bao tuong minh trong EXCLUDE kem ly do.
 * Vi vay extractor phai tra ca OFFSET cua tung literal de doi chieu voi pham vi loi
 * dich (translationSpans), khong chi tra ban than chuoi nhu Task 5.
 */
import { readFileSync } from 'node:fs';
import { UI_VI, UI_FMT_VI } from '../../lib/i18n/ui-phrases';
import { hasTerm } from '../../lib/i18n/resolve';

const CJK = /[\u4e00-\u9fff]/;

/** Danh sách file đã convert. Task 7/8/9 lần lượt thêm file của mình vào đây. */
export const ADOPTED: string[] = ['app/chart/page.tsx'];

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
  // terms.override.ts (đã kiểm chứng: hasTerm('限')=true → 'Hạn', hasTerm('年')=true →
  // 'Lưu niên'). Nhung tu R28 con them mot dieu kien wiring nua: source :75 viet
  // `timeView === 'daxian' ? '限' : timeView === 'liunian' ? '年' : ''` roi duoc render
  // qua <Bi mode="term"> o Task 7 → pass vi (a) nam trong mot loi dich + (b) co trong
  // bang. Xoa <Bi> khoi call site HOAC xoa hai override do → ratchet lap tuc bao, dung
  // chieu mong muon: khong con duong tat "chuoi nam trong bang la duoc tinh la convert".
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
 *
 * R28 KHONG ap yeu cau "phai nam trong loi dich" cho nhanh template: template ${} khong
 * the tra bang theo key tran (R14 khop tuyet doi) nen duong (b) cua R7 van duoc mo, va
 * no duoc bao chinh bang khai bao TEMPLATE_OK nguyen van — cung la co che "khai bao
 * tuong minh tung chuoi" nhu EXCLUDE, khong phai o han cua R28.
 */
const TEMPLATE_OK = new Set<string>([
  // '{dx.startAge}–{dx.endAge}岁', // ChartBoard.tsx:175 — đã về biFmt ở Task 7 Step 4
]);

/**
 * [chuoi, laTemplateCo${}, offset dau, offset sau, so dong 1-based].
 * Ba truong cuoi la moi theo R28: offset de doi chieu literal voi pham vi loi dich,
 * dong de in vi tri khi bao. Kieu tuple nen doc 2 thanh phan dau van nhu cu (cu luan
 * `const [lit, isTemplate] of ...` khong phai sua).
 */
type Hit = [string, boolean, number, number, number];

const QUOTED = /'([^'\\\n]*)'|"([^"\\\n]*)"|`([^`\\\n]*)`/g;
const JSX_TEXT = />([^<>{}\n]*[\u4e00-\u9fff][^<>{}\n]*)</g;

/** Lay moi chuoi literal chua chu Han, bo comment. Trả về [chuoi, laTemplate, offsets, dong]. */
export function extractCjkLiterals(source: string): Hit[] {
  const out: Hit[] = [];
  let lineStart = 0;
  let lineNo = 0;
  for (const rawLine of source.split('\n')) {
    lineNo++;
    const trimmed = rawLine.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) {
      lineStart += rawLine.length + 1;
      continue;
    }
    // bỏ comment cuối dòng khi nó nằm ngoài chuỗi (đơn giản: chỉ cắt khi có // sau một ' hoặc " hoặc đầu dòng)
    const line = trimmed.replace(/^(\/\/|\*).*$/, '');
    // `lead` quy chieu index tren `line` (da trim trai+phai) ve offset tuyet doi trong source.
    const lead = trimmed.length === 0 ? 0 : rawLine.indexOf(trimmed);
    const base = lineStart + lead;
    for (const m of line.matchAll(QUOTED)) {
      const s = m[1] ?? m[2] ?? m[3];
      if (!s || !CJK.test(s)) continue;
      const isTemplate = m[3] !== undefined && s.includes('${');
      const at = base + m.index;
      out.push([s, isTemplate, at, at + m[0].length, lineNo]);
    }
    // R24: JSX text thuan (<h1>紫微斗数排盘</h1>) la dang pho bien nhat cua text UI trong repo
    // va hoan toan vo hinh voi pattern chuoi tro ben tren. Doan text nam giua `>` va `<` tren
    // cung mot dong duoc bat o day va báo nhu literal thuong (khong phai template).
    for (const m of line.matchAll(JSX_TEXT)) {
      const s = m[1].trim();
      if (!s) continue;
      const at = base + m.index + 1 + (m[1].length - m[1].replace(/^\s+/, '').length);
      out.push([s, false, at, at + s.length, lineNo]);
    }
    lineStart += rawLine.length + 1;
  }
  return out;
}

/** Pham vi mot loi dich: [start, end) + no tra bang thuat ngu (viaTerm) hay bang cau. */
type Wiring = { start: number; end: number; viaTerm: boolean };

const TEXT_CALL = /(?<![\w.$])(?:biText|biFmt)\s*\(/g;
const TERM_CALL = /(?<![\w.$])(?:biTerm|viTerm|viPillar)\s*\(/g;

/** Bo qua mot chuoi bat dau tai i (i tro vao ' " hoac `) → index SAU dau dong dong lai. */
function skipString(src: string, i: number): number {
  const q = src[i];
  for (let j = i + 1; j < src.length; j++) {
    if (src[j] === '\\') { j++; continue; }
    if (src[j] === q) return j + 1;
  }
  return src.length;
}

/** Tu `{` mo dau mot attribute JSX dang bieu thuc → index sau `}` dong cung cap. */
function skipBraces(src: string, i: number): number {
  let depth = 0;
  for (let j = i; j < src.length; j++) {
    const c = src[j];
    if (c === '"' || c === "'" || c === '`') { j = skipString(src, j) - 1; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return j + 1; }
  }
  return src.length;
}

/** Tu dau `(` cua mot loi goi dich → index sau `)` dong cung cap (-1 neu khong dong). */
function closeCall(src: string, open: number): number {
  let depth = 0;
  for (let j = open; j < src.length; j++) {
    const c = src[j];
    if (c === '"' || c === "'" || c === '`') { j = skipString(src, j) - 1; continue; }
    if (c === '(') depth++;
    else if (c === ')') { depth--; if (depth === 0) return j + 1; }
  }
  return -1;
}

/** Tu `<Bi` → index sau `/>` (tu dong) hoac sau `</Bi>` (-1 neu khong dong). */
function closeBiElement(src: string, lt: number): number {
  for (let j = lt + 1; j < src.length; j++) {
    const c = src[j];
    if (c === '"' || c === "'" || c === '`') { j = skipString(src, j) - 1; continue; }
    if (c === '{') { j = skipBraces(src, j) - 1; continue; }
    if (c !== '>') continue;
    if (src[j - 1] === '/') return j + 1;
    const k = src.indexOf('</Bi', j + 1);
    if (k === -1) return -1;
    const g = src.indexOf('>', k);
    return g === -1 ? -1 : g + 1;
  }
  return -1;
}

/** Moi pham vi loi dich trong source — "day noi" ma R28 bat literal phai nam trong. */
export function translationSpans(src: string): Wiring[] {
  const spans: Wiring[] = [];
  for (const m of src.matchAll(/<Bi\b/g)) {
    const end = closeBiElement(src, m.index);
    if (end > 0) {
      const tag = src.slice(m.index, end);
      spans.push({ start: m.index, end, viaTerm: /mode\s*=\s*["'{\s]*term/.test(tag) });
    }
  }
  for (const [re, viaTerm] of [[TEXT_CALL, false], [TERM_CALL, true]] as const) {
    for (const m of src.matchAll(re)) {
      const end = closeCall(src, m.index + m[0].length - 1);
      if (end > 0) spans.push({ start: m.index, end, viaTerm });
    }
  }
  return spans;
}

/** Literal [at, after) nam trong loi dich nao? Ron = UI con render chuoi Han tran. */
function wirings(spans: Wiring[], at: number, after: number, src: string): Wiring[] {
  const covered = spans.filter((s) => s.start <= at && after <= s.end);
  if (covered.length) return covered;
  // `.vi` access duoc tinh khi no din TRUC TIEP vao bieu thuc chua literal:
  // biText('…').vi / UI_VI['…'].vi — dang dung o <option> va message validate (Task 8).
  // '…'.vi tran (khong co ngoac dong) KHONG duoc tinh — va cung la loi type.
  return /^\s*[)\]]\s*\.\s*vi\b/.test(src.slice(after))
    ? [{ start: at, end: after, viaTerm: false }]
    : [];
}

const known = new Set([...Object.keys(UI_VI), ...Object.keys(UI_FMT_VI)]);
const violations: string[] = [];

for (const file of ADOPTED) {
  const src = readFileSync(file, 'utf8');
  const spans = translationSpans(src);
  for (const [lit, isTemplate, at, after, line] of extractCjkLiterals(src)) {
    if (isTemplate) {
      if (TEMPLATE_OK.has(lit)) continue;
      violations.push(`${file}:${line}: TEMPLATE '${lit}' → dùng biFmt + khai báo TEMPLATE_OK`);
      continue;
    }
    if (EXCLUDE.has(lit)) continue;
    const w = wirings(spans, at, after, src);
    // (a) DIEU KIEN DU theo R28: literal phai duoc render qua mot loi dich.
    if (!w.length) {
      violations.push(
        `${file}:${line}: '${lit}' → render TRAN, chua nam trong <Bi .../> / biText( / biFmt( / ` +
        `biTerm( / viTerm( / .vi (R28). Co trong UI_VI moi la dieu kien CAN, khong phai DU.`);
      continue;
    }
    // (b) DIEU KIEN CAN: loi dich phai tra duoc ban dich, neu khong <Bi> roi nhanh
    // missing (Bi.tsx:27) va van in dung chuoi Han. Mien cho kieu term
    // (<Bi mode="term">, biTerm/viTerm/viPillar): thuat ngu duoc ghep luc chay
    // (viPillar('庚午'), BirthForm `biTerm(zh + '时')`) nen key tran khong the co trong
    // bang, va lop do da co chart-name-coverage.test.ts + terms-resolve.test.ts giu.
    if (w.every((x) => x.viaTerm)) continue;
    if (!known.has(lit) && !hasTerm(lit)) {
      violations.push(
        `${file}:${line}: '${lit}' → da boc loi dich nhung UI_VI/UI_FMT_VI khong co key va ` +
        `hasTerm=false: <Bi> thieu ban dich thi van in chuoi Han. Them key vao ui-phrases.ts.`);
    }
  }
}

if (violations.length) {
  console.error(`✗ ${violations.length} literal tiếng Trung chưa render qua lớp dịch trong file đã convert:`);
  for (const v of [...new Set(violations)].slice(0, 40)) console.error('  ' + v);
  console.error(`\n→ bọc bằng <Bi mode="text" zh="…" /> (hoặc biText/biFmt/….vi) VÀ bảo đảm chuỗi có bản`);
  console.error(`  dịch trong lib/i18n/ui-phrases.ts / terms.override.ts; nếu giữ nguyên văn CÓ CHỦ ĐÍCH`);
  console.error(`  thì thêm vào EXCLUDE kèm lý do.`);
  process.exit(1);
}
console.log(`✅ ui-phrase-coverage: ${ADOPTED.length} file đã convert sạch (${known.size} câu trong bảng; R28: moi literal render qua loi dich).`);
