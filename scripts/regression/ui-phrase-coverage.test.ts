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
 *
 * R29 — JSX text da dong: vong JSX_TEXT truoc day chay TUNG DONG nen `>…<` bat buoc
 * cung dong; literal nam mot minh tren dong cua no ( mutation <h1>\n 紫微斗数排盘\n</h1>,
 * hay xoa <Bi> khoi JSX child o app/chart/page.tsx:55) lot luoi. extractor gio chay
 * tren toan bo file text (comment bi xoa trang truoc khi scan), nen `>…<` duoc phep
 * bao newline. Quy tac R28 (a)/(b) giu nguyen.
 */
import { readFileSync } from 'node:fs';
import { UI_VI, UI_FMT_VI } from '../../lib/i18n/ui-phrases';
import { hasTerm } from '../../lib/i18n/resolve';

const CJK = /[\u4e00-\u9fff]/;

/** Danh sách file đã convert. Task 7/8/9 lần lượt thêm file của mình vào đây. */
export const ADOPTED: string[] = [
  'app/chart/page.tsx',
  'components/PalaceCell.tsx',
  'components/ChartBoard.tsx',
  'components/BirthForm.tsx',
];

/** Literal được bỏ qua có chủ đích, kèm lý do. Không có cơ chế pattern — nếu có,
 *  test sẽ âm thầm cho qua đúng thứ nó nên bắt. */
const EXCLUDE = new Set<string>([
  // '《骨髓赋》', // ly do: ten tac pham, giu nguyen van
  // R6 (khai ở Task 5, CÓ HIỆU LỰC từ Task 7 khi PalaceCell vào ADOPTED):
  // PalaceCell.tsx:135 và :138 render hai badge đơn tự '命' và '身' trong ô 7px cạnh tên cung.
  // Dịch ra 'M'/'T' thì không đọc được, mà badge vốn chỉ trang trí (không mang dữ liệu),
  // nên giữ nguyên Hán có chủ đích. Đây là hai literal DUY NHẤT được miễn và Task 7 đã đo
  // chúng THỰC SỰ mang tải: xóa hai dòng dưới khỏi EXCLUDE thì ratchet báo ngay
  // `components/PalaceCell.tsx:135: '命' → render TRAN` và :138 cho '身' (biên bản 2 chiều
  // trong task-7-report.md). Mọi chuỗi dài hơn chứa hai chữ này (ví dụ '查看命盘') vẫn bị bắt
  // như thường, vì EXCLUDE khớp từng chuỗi nguyên văn, không khớp theo mẫu.
  '命', // ly do: badge 7px trang tri o PalaceCell.tsx:135 (R6) - giu nguyen van
  '身', // ly do: badge 7px trang tri o PalaceCell.tsx:138 (R6) - giu nguyen van
  // '限' và '年' KHÔNG cần ở đây: cả hai là THUẬT NGỮ trong terms.override.ts (đã kiểm chứng:
  // hasTerm('限')=true → 'Hạn', hasTerm('年')=true → 'Niên'; R19 bỏ 'Lưu niên' hai âm vì đo
  // trên /chart thấy nó làm badge overlay vỡ hàng phụ tinh). Từ Task 7, call site
  // ChartBoard.tsx:81-85 dựng thẳng <Bi mode="term" zh="限"|"年"> nên (a) literal nằm TRONG một
  // lời dịch và (b) có bản dịch. Xóa <Bi> ở call site HOẶC xóa override '年' → ratchet lập tức
  // báo, đúng chiều mong muốn: không còn đường tắt "chuỗi nằm trong bảng là được tính là convert".
  // Bốn key màu SIHUA_STYLES (PalaceCell.tsx:41-44) và bốn chuỗi chú giải
  // 化禄/化权/化科/化忌 (ChartBoard.tsx:315-318) cũng KHÔNG ở đây: Task 7 viết chúng qua
  // biTerm(..).zh — .zh là đồng nhất nên key/label vẫn là đúng ký tự Hán để so khớp với engine,
  // còn literal thì nằm trong một lời dịch thay vì xin miễn trừ dù nó chẳng phải nhãn UI.
  //
  // R30 (Task 8) — 12 địa chi trong mảng SHICHEN_NAMES (BirthForm.tsx:33). Đây là KHÔNG GIAN
  // KEY/GIÁ TRỊ của biểu mẫu (index theo canh giờ, giá trị gửi đi phải là Hán tự), không phải
  // nhãn UI: khai báo mảng là dữ liệu, còn MỌI điểm nó được in ra đều đi qua bảng thuật ngữ —
  // BirthForm.tsx:117 `biTerm(SHICHEN_NAMES[branch] + '时', 'hour').vi` và :368
  // `<Bi mode="term" zh={SHICHEN_NAMES[branch] + '时'} kind="hour" />` → '子' hiển thị 'Giờ Tý'.
  // Thêm 12 dòng UI_VI cho chúng sẽ VI PHẠM R12 (ký tự trần đã là thuật ngữ:
  // terms.generated.ts '子'='Tý'…; guard ui-phrases.test.ts:45 `UI_VI ∩ hasTerm = ∅` báo ngay),
  // nên miễn trừ khai báo tường minh từng ký tự, không mẫu regex.
  // Đo trước khi miễn: grep 12 ký tự trong 4 file ADOPTED chỉ ra BirthForm.tsx:33 + một COMMENT
  // ở app/chart/page.tsx:27 (comment bị blankComments xóa nên vô hình với extractor) — nghĩa là
  // không có chỗ nào khác hiện in ký tự trần, nên phần miễn trừ này không che lỗi thật của file
  // khác. Giới hạn còn lại (ghi chú cho Task 10/11): EXCLUDE khớp theo ký tự, nên sau này một
  // file ADOPTED mới in trần '午' thì ratchet làm thinh — muốn bắt case đó thì thêm render test,
  // đừng mở rộng EXCLUDE.
  '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥',
]);

/**
 * Template literal có ${} chứa chữ Hán KHÔNG thể tra bằng key trần, nên phải được
 * khai báo tường minh ở đây (đúng nguyên văn source) sau khi đã chuyển sang biFmt.
 * Không khai báo = vi phạm. Đây là cách bịt lỗ hổng "template lọt lưới ratchet".
 *
 * LUU Y (R7) — ChartBoard.tsx tung viet `{dx.startAge}–{dx.endAge}岁` duoi dang JSX text
 * chen bieu thuc nen extractor khong nhin thay gi ca (diem mu R29a, KHONG phai "da duoc mien").
 * Hai duong cho Task 7:
 *  (a) goi biFmt('{n1}–{n2}岁', ...) = chuoi tran, khong co `$` → khong can TEMPLATE_OK,
 *      chi can them key '{n1}–{n2}岁' vao UI_FMT_VI (R7); hoac
 *  (b) giu source la template literal thi phai them dong
 *      '${dx.startAge}–${dx.endAge}岁'  (bat dau bang `$`) vao TEMPLATE_OK ben duoi.
 * Khai bao sai dang so voi source = van bi báo vi pham, khong lo.
 *
 * TASK 7 CHON DUONG (a): ChartBoard.tsx:211 viet
 *   <Bi mode="fmt" template="{n1}–{n2}岁" args={{ n1: dx.startAge, n2: dx.endAge }} compact />
 * nen literal '{n1}–{n2}岁' duoc extractCjkLiterals nhin thay, nam trong span <Bi> (R28 a) va
 * co key trong UI_FMT_VI (R28 b). TEMPLATE_OK vi the VAN RONG — dung them dong nao vao day cho
 * nui nay nua.
 *
 * R28 KHONG ap yeu cau "phai nam trong loi dich" cho nhanh template: template ${} khong
 * the tra bang theo key tran (R14 khop tuyet doi) nen duong (b) cua R7 van duoc mo, va
 * no duoc bao chinh bang khai bao TEMPLATE_OK nguyen van — cung la co che "khai bao
 * tuong minh tung chuoi" nhu EXCLUDE, khong phai o han cua R28.
 */
const TEMPLATE_OK = new Set<string>([
  // Rat: Task 7 ve duong (a) (Bi mode="fmt" + key UI_FMT_VI) nen khong dong nao o day.
]);

/**
 * [chuoi, laTemplateCo${}, offset dau, offset sau, so dong 1-based].
 * Ba truong cuoi la moi theo R28: offset de doi chieu literal voi pham vi loi dich,
 * dong de in vi tri khi bao. Kieu tuple nen doc 2 thanh phan dau van nhu cu (cu luan
 * `const [lit, isTemplate] of ...` khong phai sua).
 */
type Hit = [string, boolean, number, number, number];

const QUOTED = /'([^'\\\n]*)'|"([^"\\\n]*)"|`([^`\\\n]*)`/g;
/**
 * R29: BỎ `\n` khỏi lớp phủ định. Task 5 chạy extractor TUNG DONG, nen `>` va `<`
 * bat buoc nam cung mot dong — dua text JSX ra khoi tam ngam khi literal nam mot
 * minh tren dong cua no (dang pho bien nhat khi format/prettier tach the):
 *   <h1>\n  紫微斗数排盘\n</h1>          (mutation A)
 *   <button …>\n  ← 重新起盘\n</button>   (mutation B: xoa <Bi> khoi JSX child)
 * Chay tren TOAN BO file (da xoa comment) thi `>…<` duoc phep bao newline, va hai
 * mutation tren bi bat: group duoc trim, ket qua toan khoang trang bi loai, con lai
 * van tinh la literal thuong (khong phai template).
 */
const JSX_TEXT = />([^<>{}]*[\u4e00-\u9fff][^<>{}]*)</g;

/**
 * Xoa noi dung comment bang khoang trang, GIU NGUYEN do dai va newline de moi offset
 * van doi chieu duoc với translationSpans (source goc).
 *
 * May trang thai chay tren toan bo file va chi coi `//` hay mo dau `/*` (cap ket thuc
 * star-slash) la comment khi con tro NGOAI chuoi, nen 'https://…' hay `//` trong template
 * literal khong bi cat nham.
 * Thu tu duyet cung dam nguoc lai: `//` trong comment (ke ca dau nhac don tieng Anh nhu
 * "Don't") da bi trang hoa TRUOC khi may nhin thay no, nen khong mo chuoi ma.
 * Dau nhac ket thuc som (khong dong ngoac) duoc coi la khong phai chuoi de khong
 * "an" phan con lai cua file.
 */
export function blankComments(src: string): string {
  const n = src.length;
  /** i → j (khong ke j) thay bang khoang trang, GIU newline de so dong khong doi. */
  const blank = (i: number, j: number): string => {
    let s = '';
    for (let k = i; k < j; k++) s += src[k] === '\n' ? '\n' : ' ';
    return s;
  };
  const parts: string[] = [];
  let i = 0;
  let copy = 0; // doan code thuong dang sao chep lien tuc [copy, i)
  while (i < n) {
    const c = src[i];
    const d = src[i + 1];
    const isLine = c === '/' && d === '/';
    const isBlock = c === '/' && d === '*';
    const isQuote = c === '"' || c === "'" || c === '`';
    if (!isLine && !isBlock && !isQuote) { i++; continue; }
    if (copy < i) parts.push(src.slice(copy, i));
    if (isLine) {
      let j = i;
      while (j < n && src[j] !== '\n') j++;
      parts.push(blank(i, j));
      i = copy = j;
      continue;
    }
    if (isBlock) {
      let j = i + 2;
      while (j < n && !(src[j] === '*' && src[j + 1] === '/')) j++;
      j = Math.min(n, j + 2);
      parts.push(blank(i, j));
      i = copy = j;
      continue;
    }
    const end = skipString(src, i);
    if (end >= n && src[n - 1] !== c) {
      parts.push(c); // dau nhac loang: khong mo chuoi, de phan sau van duoc xem comment
      i++;
      copy = i;
      continue;
    }
    parts.push(src.slice(i, end)); // chuoi giu nguyen: `//` BEN TRONG khong phai comment
    i = copy = end;
  }
  if (copy < n) parts.push(src.slice(copy, n));
  return parts.join('');
}

/** So dong 1-based cua mot offset (danh sach offset dau dong + binary search). */
function lineFinder(src: string): (at: number) => number {
  const starts = [0];
  for (let i = 0; i < src.length; i++) if (src[i] === '\n') starts.push(i + 1);
  return (at: number) => {
    let lo = 0;
    let hi = starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (starts[mid] <= at) lo = mid;
      else hi = mid - 1;
    }
    return lo + 1;
  };
}

/** Lay moi chuoi literal chua chu Han, bo comment. Trả về [chuoi, laTemplate, offsets, dong]. */
export function extractCjkLiterals(source: string): Hit[] {
  const out: Hit[] = [];
  const src = blankComments(source);
  const lineOf = lineFinder(src);
  for (const m of src.matchAll(QUOTED)) {
    const s = m[1] ?? m[2] ?? m[3];
    if (!s || !CJK.test(s)) continue;
    const isTemplate = m[3] !== undefined && s.includes('${');
    const at = m.index;
    out.push([s, isTemplate, at, at + m[0].length, lineOf(at)]);
  }
  // R24 + R29: JSX text thuan (<h1>紫微斗数排盘</h1> va ban in nhieu dong cua no) la
  // dang pho bien nhat cua text UI trong repo va hoan toan vo hinh voi pattern chuoi.
  // Doan text giua `>` va `<` tren toan bo file duoc bat o day va báo nhu literal
  // thuong (khong phai template); `at` tro vao ky tu dau tieen KHONG phai khoang trang
  // de pham vi doi chieu wiring dung cho ca JSX viet nhieu dong.
  for (const m of src.matchAll(JSX_TEXT)) {
    const inner = m[1];
    const s = inner.trim();
    if (!s) continue;
    const lead = inner.length - inner.replace(/^\s+/, '').length;
    const at = m.index + 1 + lead;
    out.push([s, false, at, at + s.length, lineOf(at)]);
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
