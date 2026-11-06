# Lớp hiển thị song ngữ Trung–Việt — Đợt A (A0 + A1) — Kế hoạch triển khai

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render mọi tên sao/cung/độ sáng/tứ hóa và nhãn UI trên trang `/chart` bằng tiếng Việt, đặt cạnh nguyên văn tiếng Trung, mà không sửa bất kỳ dòng nào trong engine排盘.

**Architecture:** Tiếng Trung là khóa nội bộ, bất biến. Một lớp tra từ (`lib/i18n/`) dịch sang Việt **tại thời điểm render**, keyed bằng chính literal tiếng Trung đã có sẵn trong source — nên không phải đổi prop của component. Bảng thuật ngữ được seed tự động từ locale `vi-VN` của iztro (`terms.generated.ts`) và ghi đè bằng bảng tay (`terms.override.ts`), nên iztro lên bản mới không làm mất quyết định của ta.

**Tech Stack:** Next.js 16.4.3 (App Router, Turbopack), React 19, TypeScript 5 strict, Tailwind 3.4, iztro 2.5.8 (`createRequire` để đọc bảng locale CJS), test là script `tsx` độc lập (repo không có vitest/jest).

**Spec:** `docs/superpowers/specs/2026-11-05-vi-bilingual-ui-design.md` — đọc mục 2 (ràng buộc đã xác minh), 3 (kiến trúc), 7 (kiểm thử). Plan này chỉ phủ **đợt A**; đợt B (`patterns.ts`, `STAR_DESCRIPTIONS`) và đợt C (landing, SEO, chú giải classics) cần plan riêng vì khối lượng dịch văn của chúng không thể viết thành task mà không có chỗ trống.

## Global Constraints

Mọi task đều phải tuân thủ, values copy nguyên từ spec:

- **Không sửa** `lib/ziwei/algorithm.ts`, `lib/ziwei/school-data.ts`, `lib/ziwei/school-tables.generated.ts`, `lib/ziwei/constants.ts`, và không đổi `astro.bySolar(..., 'zh-CN')`. Lý do: `algorithm.ts:575` so sánh `p.name === '命宫'`, `:626` tìm `s.name === '紫微'`, và 22 assertion trong `scripts/regression/` kiểm định bằng chữ Hán.
- **Không import** `setLanguage` hay bất kỳ thứ gì từ `iztro/lib/i18n` ở code chạy trong app — đó là i18next singleton state toàn cục, sẽ rò ngôn ngữ giữa các request đồng thời. Chỉ được đọc bảng locale bằng `createRequire` trong **script build-time**.
- **`npm test` phải xanh sau từng task.** Chuỗi test hiện tại kết thúc bằng `... && tsx scripts/regression/patterns-sihua-bonus.test.ts`; test mới nối vào cuối chuỗi.
- **`npm run typecheck` phải sạch sau từng task** (`tsc --noEmit`, `strict: true`).
- File mới phải pass `scripts/regression/neutral-naming.test.ts`: cấm tên và拼音 của phần mềm排盘 thứ ba trong **mọi file được git theo dõi**, kể cả `.md` và `.json`.
- Tiếng Việt dùng **thuật ngữ Hán Việt** chuẩn ngành (Mệnh, Tài Bạch, Quan Lộc, Nô Bộc, Vũ Khúc, Kình Dương), không dùng nghĩa dịch đen.
- Không thêm dependency nào vào `package.json` ngoài các script.
- Commit message tiếng Việt không dấu (an toàn encoding trên Windows); commit từng task, không dồn.
- Working tree hiện có 2 file modified **không thuộc plan**: `tsconfig.json`, `next-env.d.ts` (Next dev tự sinh). **Không commit chúng.**

## Bản cấu trúc file

| File | Trách nhiệm | Thao tác |
|---|---|---|
| `lib/i18n/terms.types.ts` | `TermKind`, `OverrideEntry`, `BiPair` | Create |
| `scripts/i18n/sync-terms.ts` | Ghép bảng `zh-CN`/`vi-VN` của iztro → sinh `terms.generated.ts` | Create |
| `lib/i18n/terms.generated.ts` | 216 cặp thuật ngữ + biến thể có hậu tố, **machine-generated** | Create (bởi script) |
| `lib/i18n/terms.override.ts` | Quyết định tay: mục iztro thiếu, mục sai, xung đột, biến thể repo | Create |
| `lib/i18n/resolve.ts` | `viTerm` / `biTerm` / `biText` / `biFmt` — API tra duy nhất, không state | Create |
| `lib/i18n/ui-phrases.ts` | Câu/label UI: literal Hán → Việt | Create |
| `components/Bi.tsx` | Component hiển thị song ngữ duy nhất | Create |
| `app/globals.css` | Fallback font CJK + class `.bi*` | Modify `:8` |
| `components/PalaceCell.tsx` | Tên cung `:113`, tên sao `:143` `:169` `:193` | Modify |
| `components/ChartBoard.tsx` | Tiêu đề `:111`, giữa bàn `:161-165`, đại hạn `:174-176`, lunar `:182` | Modify |
| `components/BirthForm.tsx` | Nhãn `:224,238,287,342`, message `:92-97`, `SHICHEN_NAMES:33`, `:324` `:334` | Modify |
| `app/chart/page.tsx` | Headings `:30,32,34,52` | Modify |
| `app/layout.tsx` | `lang="zh-CN"` `:41` | Modify |
| `scripts/regression/terms-sync.test.ts` | Sync sinh ra bảng đúng | Create |
| `scripts/regression/terms-resolve.test.ts` | Precedence + fallback + biến thể | Create |
| `scripts/regression/chart-name-coverage.test.ts` | **Mọi tên mà engine có thể sinh ra đều có bản Việt** | Create |
| `scripts/regression/ui-phrase-coverage.test.ts` | Ratchet: file đã chuyển đổi không được còn literal Hán trần | Create |
| `scripts/i18n/report-terms.ts` | Sinh `docs/TERMINOLOGY-REVIEW.md` | Create |
| `package.json` | Script `terms:sync`, `terms:report`, nối test mới vào `test` | Modify `:5-10` |

Thứ tự dependency: Task 1 → 2 → 3 → 4/5 → 6 → 7/8/9 → 10 → 11. Không làm song song 1 và 2.

---

## Task 1: Kiểu dữ liệu + script sync + bảng thuật ngữ generated

**Files:**
- Create: `lib/i18n/terms.types.ts`
- Create: `scripts/i18n/sync-terms.ts`
- Create: `lib/i18n/terms.generated.ts` (do script sinh)
- Modify: `package.json` (thêm `scripts["terms:sync"]`)
- Test: `scripts/regression/terms-sync.test.ts`

**Interfaces:**
- Consumes: không (task đầu tiên)
- Produces:
  - `type TermKind = 'star' | 'palace' | 'brightness' | 'mutagen' | 'stem' | 'branch' | 'hour' | 'element' | 'gender' | 'zodiac' | 'pattern' | 'misc'`
  - `interface OverrideEntry { zh: string; vi: string; kind: TermKind; note: string }`
  - `interface BiPair { zh: string; vi: string; missing: boolean }`
  - `const GENERATED_TERMS: Record<string, string>` — khóa là chuỗi Hán, giá trị là tiếng Việt

- [ ] **Step 1: Viết test fail**

Tạo `scripts/regression/terms-sync.test.ts`:

```ts
/**
 * Test bảng thuật ngữ do sync-terms sinh ra.
 * Chạy: npx tsx scripts/regression/terms-sync.test.ts
 */
import { readFileSync, existsSync } from 'node:fs';

const CJK = /[\u4e00-\u9fff]/;
const FILE = 'lib/i18n/terms.generated.ts';
let failed = 0;
const ok = (cond: boolean, msg: string) => {
  if (!cond) { failed++; console.error('  ✗ ' + msg); } else console.log('  ✓ ' + msg);
};

if (!existsSync(FILE)) {
  console.error(`✗ ${FILE} chưa tồn tại — chạy "npm run terms:sync" để sinh`);
  process.exit(1);
}

const src = readFileSync(FILE, 'utf8');
const pairs = [...src.matchAll(/^\s{2}'([^']+)': '([^']*)',?$/gm)];
ok(pairs.length >= 216, `số cặp thuật ngữ >= 216 (thực tế: ${pairs.length})`);

const map = new Map(pairs.map((m) => [m[1], m[2]]));
for (const [zh, vi] of [['紫微', 'Tử Vi'], ['天机', 'Thiên Cơ'], ['武曲', 'Vũ Khúc'],
  ['命宫', 'Mệnh'], ['财帛', 'Tài Bạch'], ['庙', 'Miếu'], ['陷', 'Hạn'],
  ['禄', 'Lộc'], ['忌', 'Kỵ'], ['甲', 'Giáp'], ['子', 'Tý'],
  ['水二局', 'Thủy Nhị Cục'], ['男', 'Nam'], ['女', 'Nữ']] as const) {
  ok(map.get(zh) === vi, `${zh} → ${vi} (thực tế: ${JSON.stringify(map.get(zh))})`);
}

const giaTriKhongRong = pairs.filter(([, , vi]) => vi.trim() === '');
ok(giaTriKhongRong.length === 0, `không có giá trị Việt rỗng (${giaTriKhongRong.length} cái)`);

const conCJK = pairs.filter(([, , vi]) => CJK.test(vi));
ok(conCJK.length === 0, `giá trị Việt không còn chữ Hán (${conCJK.length} cái còn)`);

ok(src.includes('AUTO-GENERATED'), 'file có header AUTO-GENERATED để không sửa tay');

console.log(failed ? `\n✗ terms-sync: ${failed} lỗi` : '\n✅ terms-sync: đạt');
process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Chạy test, xác nhận fail đúng lý do**

Run: `npx tsx scripts/regression/terms-sync.test.ts`
Expected: `✗ lib/i18n/terms.generated.ts chưa tồn tại — chạy "npm run terms:sync" để sinh`, exit code 1.

- [ ] **Step 3: Tạo `lib/i18n/terms.types.ts`**

```ts
export type TermKind =
  | 'star' | 'palace' | 'brightness' | 'mutagen'
  | 'stem' | 'branch' | 'hour' | 'element' | 'gender'
  | 'zodiac' | 'pattern' | 'misc';

export interface OverrideEntry {
  /** Khóa: nguyên văn tiếng Trung như nó xuất hiện trong dữ liệu engine */
  zh: string;
  vi: string;
  kind: TermKind;
  /** Bắt buộc: nguồn hoặc lý do. Không có note thì coi như chưa nghiên cứu. */
  note: string;
}

export interface BiPair {
  zh: string;
  vi: string;
  /** true khi không tìm được bản dịch — vi === zh, UI chỉ hiện chữ Hán */
  missing: boolean;
}

```

- [ ] **Step 4: Tạo `scripts/i18n/sync-terms.ts`**

```ts
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
  if (!CJK.test(viVal)) continue;
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
```

- [ ] **Step 5: Nối script vào `package.json`**

Trong `package.json`, `scripts`, thêm ngay trước `"dev"`:

```json
    "terms:sync": "tsx scripts/i18n/sync-terms.ts",
```

- [ ] **Step 6: Sinh bảng**

Run: `npm run terms:sync`
Expected: `✓ lib/i18n/terms.generated.ts: 240 mục, 24 biến thể hậu tố, bỏ 0 mục Việt còn chữ Hán` — số mục thực tế có thể lệch; con số `xung đột` in ra là đầu vào cho Step 7.

- [ ] **Step 7: Chạy test tới khi đạt**

Run: `npx tsx scripts/regression/terms-sync.test.ts`
Expected: `✅ terms-sync: đạt`. Test này kiểm tra **iztro nói gì**, không kiểm tra thuật ngữ nào đúng — nên nếu lệch, chỉnh kỳ vọng theo `terms.generated.ts`, tuyệt đối không chỉnh bảng. Cái 陷→`'Hạn'` của iztro thật ra đáng ngờ (trùng với 限→`'Hạn'`); nó nằm ở Task 2, không phải ở đây.

- [ ] **Step 8: Typecheck rồi commit**

Run: `npm run typecheck`
Expected: sạch.

```bash
git add lib/i18n/terms.types.ts lib/i18n/terms.generated.ts scripts/i18n/sync-terms.ts scripts/regression/terms-sync.test.ts package.json
git commit -m "feat(i18n): sinh bang thuat ngu Han-Viet tu locale iztro"
```

---

## Task 2: Bảng override + API tra `resolve.ts`

**Files:**
- Create: `lib/i18n/terms.override.ts`
- Create: `lib/i18n/resolve.ts`
- Test: `scripts/regression/terms-resolve.test.ts`

**Interfaces:**
- Consumes: `GENERATED_TERMS` (Task 1), `TermKind`/`OverrideEntry`/`BiPair` (Task 1)
- Produces:
  - `const OVERRIDE_TERMS: OverrideEntry[]`
  - `viTerm(zh: string, kind?: TermKind): string | undefined`
  - `biTerm(zh: string, kind?: TermKind): BiPair`
  - `hasTerm(zh: string): boolean`
  - `allTermsZh(): string[]` — danh sách mọi khóa có bản dịch, dùng cho report (Task 10) và test (Task 4)

- [ ] **Step 1: Viết test fail**

Tạo `scripts/regression/terms-resolve.test.ts`:

```ts
import { viTerm, biTerm, hasTerm } from '../../lib/i18n/resolve';
import { GENERATED_TERMS } from '../../lib/i18n/terms.generated';

let failed = 0;
const ok = (c: boolean, m: string) => { if (!c) { failed++; console.error('  ✗ ' + m); } else console.log('  ✓ ' + m); };

// 1. Tra được từ generated
ok(viTerm('紫微') === 'Tử Vi', "viTerm('紫微') === 'Tử Vi'");
ok(viTerm('财帛') === 'Tài Bạch', "viTerm('财帛') === 'Tài Bạch'");

// 2. Override thắng generated
//    '仆役' tới từ iztro = 'Nô Bộc'; repo dùng '交友宫' (constants.ts:25) — iztro không có mục này.
ok(viTerm('交友宫') === 'Nô Bộc', "bien the repo '交友宫' -> 'Nô Bộc' (override)");
ok(viTerm('子时') === 'Giờ Tý', "dien the '子时' -> 'Giờ Tý'");

// 3. Brightness ngoai 7 bac cua iztro: StarBrightness con '闲' va '地' (types.ts:42)
ok(viTerm('闲') === 'Nhàn', "StarBrightness '闲' -> 'Nhàn'");
ok(viTerm('地') === 'Địa', "StarBrightness '地' -> 'Địa'");

// 3b. Override THANG generated — ıztro dịch 陷='Hạn' trùng với 限='Hạn'; Việt chuẩn ngành là 'Hãm'
ok(viTerm('限') === 'Hạn', '限 vẫn là Hạn (không bị override)');
ok(viTerm('陷') === 'Hãm', "陷 -> 'Hãm' nhờ override, dù generated nói 'Hạn'");
ok(GENERATED_TERMS['陷'] === 'Hạn', 'generated vẫn giữ nguyên giá trị iztro (không sửa tay)');

// 4. Thieu ban dich -> khong throw, tra ve missing:true va vi === zh (UI van chay)
const m = biTerm('不存在的东西');
ok(m.missing === true && m.vi === '不存在的东西', 'thieu muc: missing=true, vi===zh, khong crash');
ok(hasTerm('不存在的东西') === false, 'hasTerm false khi chua co');

// 5. kind chi ưu tiên chọn mục override cùng kind, không được làm mất kết quả
ok(viTerm('紫微', 'star') === 'Tử Vi', 'kind=star vẫn ra Tử Vi');
ok(viTerm('紫微') === viTerm('紫微', 'misc'), 'kind lạ không làm hỏng kết quả');

console.log(failed ? `\n✗ terms-resolve: ${failed} loi` : '\n✅ terms-resolve: đạt');
process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Chạy test, xác nhận fail**

Run: `npx tsx scripts/regression/terms-resolve.test.ts`
Expected: lỗi module không tìm thấy `../../lib/i18n/resolve`.

- [ ] **Step 3: Tạo `lib/i18n/terms.override.ts`**

```ts
import type { OverrideEntry } from './terms.types';

/**
 * Quyết định của ta, thắng GENERATED_TERMS.
 * Thêm vào đây khi: (a) iztro không có mục; (b) bản Việt của iztro sai/dịch máy;
 * (c) hai iztro key cùng một chữ Hán nhưng khác bản Việt; (d) biến thể riêng của repo.
 *
 * note là BẮT BUỘC — nó là bằng chứng đã nghiên cứu, và là thứ người đọc
 * docs/TERMINOLOGY-REVIEW.md cần để quyết định thay ta.
 */
export const OVERRIDE_TERMS: OverrideEntry[] = [
  // ── (d) biến thể riêng của repo ──
  { zh: '交友宫', vi: 'Nô Bộc', kind: 'palace',
    note: "constants.ts:25 PALACE_NAMES_ORDER dùng 交友宫; iztro palace.js dùng 仆役→'Nô Bộc'. Cùng một cung." },
  { zh: '交友', vi: 'Nô Bộc', kind: 'palace',
    note: 'Dạng ngắn của mục trên.' },

  // ── (a) iztro thiếu: StarBrightness có 9 bậc, locale chỉ có 7 ──
  { zh: '闲', vi: 'Nhàn', kind: 'brightness',
    note: "types.ts:42 StarBrightness có '闲'/'地' ngoài 7 bậc 庙旺得利平不陷 của iztro. Nhàn = trung bình khá, gần Bình." },
  { zh: '地', vi: 'Địa', kind: 'brightness',
    note: "types.ts:42. Chữ dùng trong bảng sáng độ của một số流派; giữ Hán Việt sát nghĩa." },

  // ── (b) iztro dịch đạt nhưng trùng từ: 陷 và 限 đều ra 'Hạn' ──
  // 'Hạn' trong Tử Vi Việt = 限 (đại hạn/lưu hạn), còn 陷 phải là 'Hãm' (hãm địa).
  // Để nguyên 'Hạn' thì bàn lá số sẽ ghi 'Hạn' cạnh cung hạn — người đọc không phân biệt được.
  { zh: '陷', vi: 'Hãm', kind: 'brightness',
    note: "iztro brightness.js xian='Hạn' trùng với mutagen/限='Hạn'. Việt chuẩn: 陷 địa = Hãm địa. Override này THẮNG generated — xem test mục 3b." },

  // ── (a) thập nhị canh chố dưới dạng 时 ──
  // (sync đã sinh '子时'..'亥时' từ earthlyBranch; giữ override cho 早/晚 子时 vì
  //  app/chart và algorithm phân biệt giờ Tý sớm/muộn)
  { zh: '早子时', vi: 'Giờ Tý sớm', kind: 'hour', note: 'common.json vi-VN: earlyRatHour' },
  { zh: '晚子时', vi: 'Giờ Tý muộn', kind: 'hour', note: 'common.json vi-VN: lateRatHour' },

  // ── (b) mục iztro dịch lỗi, ghi lại để người dùng biết mà soát ──
  { zh: '童年', vi: 'Đồng Hạn', kind: 'misc',
    note: "iztro common.json: childhood → 'đứa trẻ Hạn' (trật từ sai, rõ là máy dịch). 'Đồng Hạn' là thuật ngữ Việt cho 童限/童年." },
];

/** Tra theo kind: chỉ mục cùng kind mới được xét tới. */
export const OVERRIDE_BY_ZH = new Map<string, OverrideEntry[]>();
for (const e of OVERRIDE_TERMS) {
  const list = OVERRIDE_BY_ZH.get(e.zh);
  if (list) list.push(e); else OVERRIDE_BY_ZH.set(e.zh, [e]);
}
```

- [ ] **Step 4: Tạo `lib/i18n/resolve.ts`**

```ts
import { GENERATED_TERMS } from './terms.generated';
import { OVERRIDE_BY_ZH } from './terms.override';
import type { BiPair, TermKind } from './terms.types';

/**
 * API tra thuật ngữ. Không có mutable state cấp module: mọi hàm là pure,
 * nên an toàn khi nhiều request server rendering chạy đồng thời.
 * (Đây chính là lý do không dùng iztro/lib/i18n setLanguage — xem spec mục 2, ý 3.)
 */
export function viTerm(zh: string, kind?: TermKind): string | undefined {
  if (!zh) return undefined;
  const overrides = OVERRIDE_BY_ZH.get(zh);
  if (overrides) {
    const exact = kind ? overrides.find((o) => o.kind === kind) : undefined;
    const vi = (exact ?? overrides[0]).vi;
    if (vi) return vi;
  }
  const gen = GENERATED_TERMS[zh];
  if (gen) return gen;
  // Cắt hậu tố 宫/星 rồi thử lại: '兄弟宫' → '兄弟', '火星' vẫn ra 'Hỏa Tinh'
  const stripped = zh.length > 1 ? zh.replace(/[宫星]$/, '') : undefined;
  if (stripped && stripped !== zh) {
    const g = GENERATED_TERMS[stripped];
    if (g) return kind === 'star' ? g : g;
  }
  return undefined;
}

export function biTerm(zh: string, kind?: TermKind): BiPair {
  const vi = viTerm(zh, kind);
  return vi ? { zh, vi, missing: false } : { zh, vi: zh, missing: true };
}

export function hasTerm(zh: string): boolean {
  return viTerm(zh) !== undefined;
}

/** Mọi khóa Hán đã có bản dịch — dùng cho coverage test và báo cáo thuật ngữ. */
export function allTermsZh(): string[] {
  return [...new Set([...Object.keys(GENERATED_TERMS), ...OVERRIDE_BY_ZH.keys()])];
}
```

- [ ] **Step 5: Chạy test tới khi đạt**

Run: `npx tsx scripts/regression/terms-resolve.test.ts`
Expected: `✅ terms-resolve: đạt`. **Toàn bộ** assertion phải xanh mà không cần sửa test; nếu phải sửa test để xanh thì implementation đang sai — quay lại Step 3/4. Riêng mục 3b là bằng chứng cơ chế override hoạt động: `generated` vẫn nói `Hạn`, `viTerm` phải trả `Hãm`.

- [ ] **Step 6: Typecheck, nối test vào `npm test`, commit**

Run: `npm run typecheck` → sạch.

Trong `package.json` `scripts.test`, nối vào cuối chuỗi (sau `...patterns-sihua-bonus.test.ts`):

```
 && tsx scripts/regression/terms-sync.test.ts && tsx scripts/regression/terms-resolve.test.ts
```

Run: `npm test` → Expected: toàn bộ xanh, kể cả 17 bộ cũ.

```bash
git add lib/i18n/terms.override.ts lib/i18n/resolve.ts scripts/regression/terms-resolve.test.ts package.json
git commit -m "feat(i18n): bang override va API tra thuat ngu khong state"
```

---

## Task 3: Bảng câu UI + `biText` / `biFmt`

Thuật ngữ tra bằng bảng, nhưng câu (`请选择出生年份`, `命宫`) phải tra cả câu. Key là **chính literal tiếng Trung trong source**, nên không phải đặt tên key và không phải luồn prop.

**Files:**
- Create: `lib/i18n/ui-phrases.ts`
- Modify: `lib/i18n/resolve.ts` (thêm `biText`, `biFmt`)
- Test: `scripts/regression/ui-phrases.test.ts`

**Interfaces:**
- Consumes: `BiPair` (Task 1)
- Produces:
  - `const UI_VI: Record<string, string>` — câu/label, key là literal Hán
  - `const UI_FMT_VI: Record<string, string>` — câu có placeholder `{name}`
  - `biText(zh: string): BiPair`
  - `biFmt(template: string, args: Record<string, string | number>): BiPair`
  - `hasPhrase(zh: string): boolean`

- [ ] **Step 1: Viết test fail**

Tạo `scripts/regression/ui-phrases.test.ts`:

```ts
import { biText, biFmt, hasPhrase } from '../../lib/i18n/resolve';
import { UI_VI, UI_FMT_VI } from '../../lib/i18n/ui-phrases';

let failed = 0;
const ok = (c: boolean, m: string) => { if (!c) { failed++; console.error('  ✗ ' + m); } else console.log('  ✓ ' + m); };

// Câu thật, copy nguyên từ components/BirthForm.tsx:92-97
ok(biText('请选择出生年份').vi === 'Vui lòng chọn năm sinh', 'message validate năm sinh');
ok(biText('请选择月份').vi === 'Vui lòng chọn tháng', 'message validate tháng');
ok(biText('姓名（可选）').vi === 'Họ tên (không bắt buộc)', 'nhãn họ tên');

// Khong co ban dich -> missing, khong crash
const m = biText('这是一句不存在的话');
ok(m.missing === true && m.vi === m.zh, 'thieu cau: missing=true, vi===zh');

// Câu nội suy: BirthForm.tsx:115 ghép `${y}年${m}月${d}日`
const f = biFmt('{y}年{m}月{d}日', { y: 1990, m: 6, d: 15 });
ok(f.vi === '15/06/1990', `noi suy → date VN (thực tế: ${f.vi})`);
ok(f.zh === '1990年6月15日', `noi suy → giu nguyen van Han (thực tế: ${f.zh})`);
ok(f.missing === false, 'biFmt tim thay key');

// Placeholder phai trung nhau giu 2 bange
ok(biFmt('{m}月没有{d}日', { m: 2, d: 30 }).vi === 'Ngày 30 không có trong tháng 2', 'câu ngày không tồn tại');

// Placeholder khong co trong args -> giữ nguyên {x}, không ném
ok(biFmt('{a}月', { b: 1 }).missing === false, 'thieu arg khong crash');

// Moi key trong UI_VI khong duoc trung voi mot thuat ngu don le
ok(Object.keys(UI_VI).length > 0, `UI_VI có ${Object.keys(UI_VI).length} mục`);
ok(hasPhrase('请选择月份'), 'hasPhrase');

console.log(failed ? `\n✗ ui-phrases: ${failed} loi` : '\n✅ ui-phrases: đạt');
process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Chạy test, xác nhận fail**

Run: `npx tsx scripts/regression/ui-phrases.test.ts`
Expected: `Cannot find module '../../lib/i18n/ui-phrases'`.

- [ ] **Step 3: Tạo `lib/i18n/ui-phrases.ts`**

Mỗi mục phải là chuỗi **copy nguyên văn** từ source, kèm chú giải vị trí để người sau sửa được.

```ts
/**
 * Câu và nhãn UI — key là đúng literal tiếng Trung trong source.
 * Chỉ chứa CÂU. Thuật ngữ một từ (武曲, 命宫) để ở terms.generated/terms.override,
 * vì UI hiển thị thuật ngữ qua <Bi mode="term"> chứ không qua bảng này.
 */
export const UI_VI: Record<string, string> = {
  // ── components/BirthForm.tsx — nhãn ──
  '姓名（可选）': 'Họ tên (không bắt buộc)',                       // :224
  '出生日期（公历）': 'Ngày sinh (dương lịch)',                     // :238
  '出生地点（用于真太阳时校正）': 'Nơi sinh (để hiệu chỉnh giờ thật–mặt trời)', // :287
  '出生时间（北京时间）': 'Giờ sinh (giờ Bắc Kinh)',                 // :342
  '（请选择城市）': '(chọn thành phố)',                             // :324
  '倪海厦批命用真太阳时，建议填写出生地以自动校正时辰':
    'Ni Hải Hạ luận mệnh dùng giờ thật–mặt trời, nên điền nơi sinh để tự hiệu chỉnh canh giờ', // :334

  // ── components/BirthForm.tsx:92-97 — message validate ──
  '请选择出生年份': 'Vui lòng chọn năm sinh',
  '请选择月份': 'Vui lòng chọn tháng',
  '请选择日期': 'Vui lòng chọn ngày',
  '年份范围：1900–2026': 'Năm phải trong khoảng 1900–2026',

  // ── components/ChartBoard.tsx ──
  '紫微斗数命盘': 'Lá số Tử Vi',                                   // :111
  '紫微斗数': 'Tử Vi đẩu số',                                       // :161
  '当前大限': 'Đại hạn hiện tại',                                    // :174
  '限': 'Hạn',                                                      // :75 overlayLabel
  '年': 'Lưu niên',                                                 // :75 overlayLabel
  '闰': 'nhuận',                                                    // :182

  // ── app/chart/page.tsx ──
  '紫微斗数排盘': 'Lập lá số Tử Vi',                                 // :30
  '输入出生年月日时，开源排盘引擎即时生成命盘。':
    'Nhập ngày giờ sinh — engine lập lá số mã nguồn mở tạo bàn ngay tức thì.',               // :32
  '（本页为引擎 Demo，完整商业版界面不在开源范围；排盘内核完全开放。）':
    '(Trang này là bản demo engine; giao diện thương mại đầy đủ không nằm trong bản open-source, còn nhân thuật toán thì mở hoàn toàn.)', // :34
  '← 重新起盘': '← Lập lại',                                        // :52
};

/**
 * Câu có nội suy. Placeholder BẮT BUỘC có tên, không dùng vị trí, vì trật tự từ
 * Việt khác Hán (ví dụ 1990年6月15日 → 15/06/1990, đảo cả ba thành phần).
 */
export const UI_FMT_VI: Record<string, string> = {
  '{y}年{m}月{d}日': '{d}/{m}/{y}',                    // BirthForm.tsx:115
  '{m}月没有{d}日': 'Ngày {d} không có trong tháng {m}', // BirthForm.tsx:97
  '{n}岁': '{n} tuổi',
};
```

- [ ] **Step 4: Thêm `biText` / `biFmt` vào `lib/i18n/resolve.ts`**

Nối vào cuối file:

```ts
import { UI_VI, UI_FMT_VI } from './ui-phrases';

function fill(template: string, args: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (whole, name: string) =>
    Object.prototype.hasOwnProperty.call(args, name) ? String(args[name]) : whole);
}

/** Tra một câu UI theo đúng literal tiếng Trung. */
export function biText(zh: string): BiPair {
  const vi = UI_VI[zh];
  return vi ? { zh, vi, missing: false } : { zh, vi: zh, missing: true };
}

/**
 * Câu có nội suy. `template` phải là chuỗi gốc chứa {placeholder}, key của
 * UI_FMT_VI cũng phải dùng đúng dạng đó.
 */
export function biFmt(template: string, args: Record<string, string | number>): BiPair {
  const viTpl = UI_FMT_VI[template];
  if (!viTpl) return { zh: fill(template, args), vi: fill(template, args), missing: true };
  return { zh: fill(template, args), vi: fill(viTpl, args), missing: false };
}

export function hasPhrase(zh: string): boolean {
  return UI_VI[zh] !== undefined || UI_FMT_VI[zh] !== undefined;
}
```

- [ ] **Step 5: Chạy test tới khi đạt**

Run: `npx tsx scripts/regression/ui-phrases.test.ts`
Expected: `✅ ui-phrases: đạt`.

- [ ] **Step 6: Typecheck, nối test, commit**

```bash
git add lib/i18n/ui-phrases.ts lib/i18n/resolve.ts scripts/regression/ui-phrases.test.ts package.json
git commit -m "feat(i18n): bang cau UI va biText/biFmt"
```

---

## Task 4: Test phủ tên — mọi tên engine sinh ra phải có bản Việt

Đây là chốt an toàn mạnh nhất của đợt A, và nó chạy hoàn toàn bằng logic (không cần browser): với mỗi ngày giờ mẫu, lấy **tất cả** tên từ `generateChart` rồi assert `viTerm` trả về chuỗi không rỗng.

**Files:**
- Create: `scripts/regression/chart-name-coverage.test.ts`
- Modify: `package.json` (nối test)

**Interfaces:**
- Consumes: `generateChart` từ `lib/ziwei/algorithm` (chỉ gọi, không sửa), `viTerm`/`hasTerm` (Task 2), `SCHOOL_STAR_ID_TO_NAME` từ `lib/ziwei/school-data`, các bảng trong `lib/ziwei/constants`
- Produces: `collectChartNames(chart): string[]` — dùng lại ở Task 10

- [ ] **Step 1: Viết test**

Tạo `scripts/regression/chart-name-coverage.test.ts`:

```ts
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
```

- [ ] **Step 2: Chạy test, xem danh sách thiếu thật**

Run: `npx tsx scripts/regression/chart-name-coverage.test.ts`
Expected: **FAIL**, in ra danh sách thiếu. Ghi lại số lượng — đây là con số mà spec mục 9 nói "đo ở A0, không đoán". Nếu fail ngay ở `import SCHOOL_STAR_ID_TO_NAME` vì export không tồn tại, chạy `grep -n "SCHOOL_STAR_ID_TO_NAME" lib/ziwei/school-data.ts` để lấy đúng tên export rồi sửa import — **không sửa file dữ liệu**.

- [ ] **Step 3: Bổ sung `terms.override.ts` cho tới khi đạt**

Với từng mục trong danh sách thiếu, tra nghĩa và thêm entry có `note` nêu nguồn. Quy tắc:
- Tên sao杂曜 → Hán Việt của đúng chữ (例: `台輔` → `Thai Phụ`, `解神` → `Giải Thần`, `天哭` → `Thiên Khốc`, `天虚` → `Thiên Hư`). Nếu iztro đã có mục cho cùng chữ Hán trong `terms.generated.ts` thì **không** thêm override — nó đã tự phủ.
- Chỉ thêm override khi iztro thiếu, hoặc bản của iztro sai.
- Không được "dịch thoát" bằng cách bỏ mục khỏi `seen` — không được sửa test để nó xanh.

Run lại tới khi: `✅ chart-name-coverage: N tên sao thực tế + toàn bộ bảng constants/school-data đều có bản Việt.`

- [ ] **Step 4: Xác nhận engine vẫn nguyên vẹn, commit**

```bash
git diff --stat lib/ziwei/
```
Expected: **rỗng** — không một file dữ liệu/algorithm nào bị sửa. Nếu có output, hoàn tác file đó (`git checkout -- lib/ziwei/<file>` rồi làm lại bằng override).

```bash
npm test
```
Expected: xanh, gồm 17 bộ cũ + 4 bộ mới.

```bash
git add scripts/regression/chart-name-coverage.test.ts lib/i18n/terms.override.ts package.json
git commit -m "test(i18n): pho dem moi ten engine sinh ra deu co ban dich Viet"
```

---

## Task 5: Test ratchet cho literal UI trong file đã chuyển đổi

Không thể quét toàn `app/**` + `components/**` ngay: ~940 literal chưa dịch sẽ fail hết. Cơ chế đúng là **ratchet**: test chỉ quét danh sách file đã chuyển, mỗi task A1 thêm file của nó vào danh sách. Vì vậy test vừa là chốt an toàn vừa là bảng tiến độ, và không cho phép "quên" một file đã convert.

**Files:**
- Create: `scripts/regression/ui-phrase-coverage.test.ts`

**Interfaces:**
- Consumes: `UI_VI`/`UI_FMT_VI` (Task 3), `hasTerm` (Task 2)
- Produces: `extractCjkLiterals(source: string): Array<[string, boolean]>` — `[literal, làTemplateCóNộiSuy]`

- [ ] **Step 1: Viết test (ban đầu xanh vì danh sách file còn trống)**

Tạo `scripts/regression/ui-phrase-coverage.test.ts`:

```ts
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
]);

/**
 * Template literal có ${} chứa chữ Hán KHÔNG thể tra bằng key trần, nên phải được
 * khai báo tường minh ở đây (đúng nguyên văn source) sau khi đã chuyển sang biFmt.
 * Không khai báo = vi phạm. Đây là cách bịt lỗ hổng "template lọt lưới ratchet".
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
```

- [ ] **Step 2: Chạy test**

Run: `npx tsx scripts/regression/ui-phrase-coverage.test.ts`
Expected: `✅ ui-phrase-coverage: 0 file đã convert (N câu trong bảng).` — xanh với danh sách rỗng, và **sẽ fail ngay khi Task 7–9 khai báo file mà còn sót literal**. Đó là mục đích của ratchet.

- [ ] **Step 3: Nối vào `npm test` và commit**

```bash
git add scripts/regression/ui-phrase-coverage.test.ts package.json
git commit -m "test(i18n): ratchet bat chuoi Han con sot trong file da convert"
```

---

## Task 6: Component `<Bi>` + CSS + font fallback

**Files:**
- Create: `components/Bi.tsx`
- Modify: `app/globals.css:8` (`--font`) và thêm khối `.bi*`
- Modify: `package.json` (không đổi test; chỉ đảm bảo typecheck)

**Interfaces:**
- Consumes: `biTerm`, `biText`, `biFmt`, `BiPair`, `TermKind`
- Produces: `export default function Bi(props: BiProps): JSX.Element`, với
  ```ts
  export type BiProps =
    | { mode: 'term'; zh: string; kind?: TermKind; className?: string; compact?: boolean }
    | { mode: 'text'; zh: string; className?: string; compact?: boolean }
    | { mode: 'fmt'; template: string; args: Record<string, string | number>; className?: string; compact?: boolean }
    | { mode: 'pair'; zh: string; vi: string; className?: string; compact?: boolean };
  ```

- [ ] **Step 1: Thêm font fallback vào `app/globals.css:8`**

Thay dòng `--font:` hiện tại bằng:

```css
  /* Latin font đứng TRƯỚC để tiếng Việt dùng Segoe UI/PingFang (có dấu đầy đủ);
     CJK chỉ được dùng khi glyph Latin không tồn tại. Nếu để PingFang đứng đầu,
     trên Windows nó không tồn tại nên mọi thứ rơi về Segoe UI, còn trên iOS
     PingFang render dấu Việt kém hơn system font. */
  --font: -apple-system, 'Segoe UI', 'Helvetica Neue', 'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
```

Giữ nguyên `--font-mono` ở `:9`.

- [ ] **Step 2: Thêm class hiển thị song ngữ**

Nối vào cuối `app/globals.css`:

```css
/* ─── Song ngữ Trung–Việt: Việt là chính, Hán là phụ ─────────────────── */
.bi { display: inline-flex; flex-direction: column; align-items: center; line-height: 1.25; }
.bi-vi { white-space: nowrap; }
.bi-zh { font-size: 0.68em; opacity: 0.5; letter-spacing: 0.02em; white-space: nowrap; }
/* Ô lá số rất hẹp: ẩn bớt chữ Hán dưới 640px để không tràn ô */
@media (max-width: 640px) { .bi-compact .bi-zh { display: none; } }
```

- [ ] **Step 3: Tạo `components/Bi.tsx`**

```tsx
import type { TermKind } from '@/lib/i18n/terms.types';
import { biFmt, biTerm, biText } from '@/lib/i18n/resolve';

/**
 * Điểm DUY NHẤT in bản dịch ra màn hình.
 * Muốn tắt hẳn lớp Việt hoặc thêm ngôn ngữ thứ ba: sửa file này, không sửa từng component.
 *
 * Khong co side effect va khong doc module state → an toàn trong server rendering.
 */
export type BiProps =
  | { mode: 'term'; zh: string; kind?: TermKind; className?: string; compact?: boolean }
  | { mode: 'text'; zh: string; className?: string; compact?: boolean }
  | { mode: 'fmt'; template: string; args: Record<string, string | number>; className?: string; compact?: boolean }
  | { mode: 'pair'; zh: string; vi: string; className?: string; compact?: boolean };

export default function Bi(props: BiProps) {
  let pair: { zh: string; vi: string };
  if (props.mode === 'term') pair = biTerm(props.zh, props.kind);
  else if (props.mode === 'text') pair = biText(props.zh);
  else if (props.mode === 'fmt') pair = biFmt(props.template, props.args);
  else pair = { zh: props.zh, vi: props.vi };

  const cls = ['bi', props.compact ? 'bi-compact' : '', props.className ?? '']
    .filter(Boolean).join(' ');

  // Thiếu bản dịch: chỉ hiện chữ Hán, không hiện trùng hai dòng
  if (pair.vi === pair.zh) return <span className={cls}>{pair.zh}</span>;

  return (
    <span className={cls}>
      <span className="bi-vi">{pair.vi}</span>
      <span className="bi-zh" lang="zh-Hans">{pair.zh}</span>
    </span>
  );
}
```

- [ ] **Step 4: Typecheck + smoke render**

Run: `npm run typecheck` → Expected: sạch.
Run: `curl -s http://localhost:3000/chart | grep -c "Lập lá số Tử Vi"` → Expected: `0` (chưa convert — task này chỉ dựng hạ tầng). Nếu dev server chưa chạy: `npm run dev` ở background, chờ `✓ Ready`.

- [ ] **Step 5: Commit**

```bash
git add components/Bi.tsx app/globals.css
git commit -m "feat(i18n): component Bi hien thi song ngu + font fallback CJK"
```

---

## Task 7: Áp dụng `<Bi>` vào lá số (`PalaceCell` + `ChartBoard`)

**Files:**
- Modify: `components/PalaceCell.tsx:113` (tên cung), `:143`, `:169`, `:193` (tên sao), badge tứ hóa
- Modify: `components/ChartBoard.tsx:111`, `:161`, `:163-165`, `:174-176`, `:182`
- Modify: `scripts/regression/ui-phrase-coverage.test.ts` (`ADOPTED`)

**Interfaces:**
- Consumes: `<Bi>` (Task 6), các key trong `UI_VI` (Task 3)
- Produces: bàn lá số song ngữ

- [ ] **Step 1: Import và thay ở `PalaceCell.tsx`**

Đầu file, thêm: `import Bi from './Bi';`

Thay 4 chỗ render tên:

```tsx
// :113 — tên cung
<Bi mode="term" zh={name} kind="palace" compact />

// :143 — chính tinh
<Bi mode="term" zh={star.name} kind="star" />

// :169 — phụ tinh (trong span className="... text-sky-500/70")
<Bi mode="term" zh={s.name} kind="star" />

// :193 — sao煞 (giữ SiHuaBadge phía sau nguyên vẹn)
<Bi mode="term" zh={s.name} kind="star" />{s.siHua && <SiHuaBadge siHua={s.siHua} />}
```

**Không đổi** `key={star.name}`, `overlayStarSiHua?.[star.name]`, `onSiHuaClick?.(star.name, ...)` — mọi thứ va vào engine vẫn dùng chữ Hán.

- [ ] **Step 2: Badge tứ hóa**

Trong `PalaceCell.tsx` tìm `SiHuaBadge` (component render `'禄'`/`'权'`/`'科'`/`'忌'`). Đổi chữ bên trong thành:

```tsx
<Bi mode="term" zh={siHua} kind="mutagen" />
```

Giữ nguyên logic chọn màu theo `siHua` (vẫn so sánh với ký tự Hán).

- [ ] **Step 3: `ChartBoard.tsx`**

Thêm `import Bi from './Bi';`, rồi:

```tsx
// :111 tiêu đề — giữ nguyên phần tên người, chỉ bọc cụm từ cố định
{chart.birthInfo.name ? `${chart.birthInfo.name} · ` : ''}
<Bi mode="text" zh="紫微斗数命盘" />

// :161 紫微斗数
<Bi mode="text" zh="紫微斗数" />

// :163-164 — nhãn Mệnh/Thân là THUẬT NGỮ cung, đi qua mode="term" để trùng cách gọi với PalaceCell
//   ('命宫' → 'Mệnh', không phải 'Mệnh cung')
<Bi mode="term" zh="命宫" kind="palace" /> <Bi mode="term" zh={BRANCHES[chart.mingGongBranch]} kind="branch" />
<Bi mode="term" zh="身宫" kind="palace" /> <Bi mode="term" zh={BRANCHES[chart.shenGongBranch]} kind="branch" />

// :165 wuxingJuName (vd '水二局')
<Bi mode="term" zh={chart.wuxingJuName} kind="element" />

// :174-176 dai hạn
<Bi mode="text" zh="当前大限" />
// :175 `{dx.startAge}–{dx.endAge}岁` → <Bi mode="fmt" template="{n1}岁" .../> : xem Step 4
// :176 palaceName
<Bi mode="term" zh={dx.palaceName} kind="palace" />

// :182 闰
{chart.lunarInfo.isLeapMonth ? <Bi mode="text" zh="闰" /> : ''}
```

- [ ] **Step 4: Xử lý `岁` ở `:175`**

Chỗ đó là `{dx.startAge}–{dx.endAge}岁` (template literal có nội suy). Thay bằng:

```tsx
<Bi mode="fmt" template={'{n1}–{n2}岁'} args={{ n1: dx.startAge, n2: dx.endAge }} />
```

và thêm vào `UI_FMT_VI` (file `lib/i18n/ui-phrases.ts`):

```ts
  '{n1}–{n2}岁': '{n1}–{n2} tuổi',
```

- [ ] **Step 5: Khai báo 2 file vào ratchet**

Trong `scripts/regression/ui-phrase-coverage.test.ts`, sửa `ADOPTED`:

```ts
export const ADOPTED: string[] = [
  'components/PalaceCell.tsx',
  'components/ChartBoard.tsx',
];
```

- [ ] **Step 6: Chạy bộ test**

Run: `npx tsx scripts/regression/ui-phrase-coverage.test.ts`
Expected: có thể **FAIL** và in ra literal còn sót (ví dụ comment chuỗi, tên sách). Với mỗi mục: hay thêm vào `UI_VI`, hay thêm vào `EXCLUDE` kèm lý do. Không được xóa file khỏi `ADOPTED` để qua test.

Run: `npm test && npm run typecheck` → Expected: xanh + sạch.

- [ ] **Step 7: Commit**

```bash
git add components/PalaceCell.tsx components/ChartBoard.tsx lib/i18n/ui-phrases.ts scripts/regression/ui-phrase-coverage.test.ts
git commit -m "feat(i18n): la so hien thi Viet chen ke chu Han"
```

---

## Task 8: Áp dụng `<Bi>` vào biểu mẫu (`BirthForm`)

**Files:**
- Modify: `components/BirthForm.tsx` — `:33` `SHICHEN_NAMES`, `:92-97` validate, `:115` summary chip, `:224`, `:238`, `:287`, `:324`, `:334`, `:342`, giới tính ♂/♀
- Modify: `scripts/regression/ui-phrase-coverage.test.ts` (`ADOPTED`)

**Interfaces:**
- Consumes: `<Bi>` (Task 6), `biText`/`biFmt`/`biTerm` (Task 2–3)

- [ ] **Step 1: Nhãn tĩnh**

Thêm `import Bi from './Bi';`, thay các `<label>` (`:224`, `:238`, `:287`, `:342`) — giữ nguyên `style` của label, chỉ bọc chữ bên trong:

```tsx
<label style={{ display: 'block', fontSize: '11px', color: labelClr, marginBottom: '6px', letterSpacing: '0.05em' }}>
  <Bi mode="text" zh="姓名（可选）" />
</label>
```

Làm tương tự với `出生日期（公历）`, `出生地点（用于真太阳时校正）`, `出生时间（北京时间）`.

- [ ] **Step 2: Message validate (`:92-97`)**

`errors` là object chuỗi, render ở dạng text bên dưới field. Đổi giá trị sang `biText`:

```tsx
year: !form.year ? biText('请选择出生年份').vi
  : y < 1900 || y > 2026 ? biText('年份范围：1900–2026').vi
  : '',
month: !form.month ? biText('请选择月份').vi : '',
day: !form.day ? biText('请选择日期').vi
  : form.year && form.month && !isValidDate(y, m, d) ? biFmt('{m}月没有{d}日', { m, d }).vi : '',
```

Ở đây dùng `.vi` (chỉ một dòng) vì message validate là chỗ người dùng đọc khi lỗi — hiện cả Hán lẫn Việt ở ô nhỏ sẽ loãng. Đây là ngoại lệ có chủ đích, ghi note trong PR.

- [ ] **Step 3: Summary chip (`:115`)**

```tsx
// {`${y}年${m}月${d}日`} →
biFmt('{y}年{m}月{d}日', { y, m: String(m).padStart(2, '0'), d: String(d).padStart(2, '0') }).vi
```

- [ ] **Step 4: Danh sách giờ canh (`:33`) và nơi sinh (`:324`)**

`SHICHEN_NAMES` giữ nguyên mảng Hán (nó là khóa hiển thị của `select`), nhưng đổi chỗ render `<option>`:

```tsx
{SHICHEN_NAMES.map((zh, i) => (
  <option key={zh} value={zh}>
    {biTerm(zh + '时', 'hour').vi}  {/* '子' → 'Giờ Tý' */}
    <span style={{ opacity: 0.55, fontSize: '0.85em' }}> {zh}</span>
  </option>
))}
```

`<option>` không nhận phần tử con trong HTML, nên không dùng `<Bi>` ở đây — đó là lý do dùng `.vi` + span nội tuyến. `:324` thay `{form.city || '（请选择城市）'}` bằng `{form.city || biText('（请选择城市）').vi}`; `:334` bọc `<Bi mode="text" zh="倪海厦批命用真太阳时，建议填写出生地以自动校正时辰" />`.

- [ ] **Step 5: Khai báo vào ratchet + chạy test**

```ts
export const ADOPTED: string[] = [
  'components/PalaceCell.tsx',
  'components/ChartBoard.tsx',
  'components/BirthForm.tsx',
];
```

Run: `npx tsx scripts/regression/ui-phrase-coverage.test.ts` — xử lý hết mục nó in ra.
Run: `npm test && npm run typecheck` → xanh + sạch.

- [ ] **Step 6: Commit**

```bash
git add components/BirthForm.tsx scripts/regression/ui-phrase-coverage.test.ts
git commit -m "feat(i18n): bieu mau nhap sinh hien tieng Viet"
```

---

## Task 9: Trang `/chart` + `lang` của document

**Files:**
- Modify: `app/chart/page.tsx:30`, `:32`, `:34`, `:52`
- Modify: `app/layout.tsx:41` (`lang="zh-CN"` → `lang="vi"`)
- Modify: `scripts/regression/ui-phrase-coverage.test.ts` (`ADOPTED`)

- [ ] **Step 1: Bọc 4 chỗ trong `app/chart/page.tsx`**

```tsx
import Bi from '@/components/Bi';

// :30  <h1 ...><Bi mode="text" zh="紫微斗数排盘" /></h1>
// :32  <Bi mode="text" zh="输入出生年月日时，开源排盘引擎即时生成命盘。" />
// :34  <Bi mode="text" zh="（本页为引擎 Demo，完整商业版界面不在开源范围；排盘内核完全开放。）" />
// :52  <Bi mode="text" zh="← 重新起盘" />
```

- [ ] **Step 2: `app/layout.tsx:41`**

```tsx
<html lang="vi" suppressHydrationWarning>
```

`metadata.locale` (`:21`, `'zh_CN'`) **để nguyên trong đợt A** — đổi sang `vi_VN` thuộc đợt C vì nó kéo theo SEO metadata (title/description) phải dịch đồng loạt, không đổi một mình được.

- [ ] **Step 3: Ratchet + test + typecheck**

```ts
export const ADOPTED: string[] = [
  'components/PalaceCell.tsx',
  'components/ChartBoard.tsx',
  'components/BirthForm.tsx',
  'app/chart/page.tsx',
];
```

Run: `npm test && npm run typecheck` → xanh + sạch.
Run: `npm run neutral-naming` không tồn tại; test đó đã nằm trong `npm test` — xác nhận nó vẫn pass với 4 file mới sửa.

- [ ] **Step 4: Commit**

```bash
git add app/chart/page.tsx app/layout.tsx scripts/regression/ui-phrase-coverage.test.ts
git commit -m "feat(i18n): trang chart dung tieng Viet, doc set lang=vi"
```

---

## Task 10: Báo cáo thuật ngữ để bạn nghiên cứu sau

Không chặn gì cả. Mục đích: biến những chỗ còn nghi thành một file dễ đọc, có ngữ cảnh "xuất hiện ở màn hình nào".

**Files:**
- Create: `scripts/i18n/report-terms.ts`
- Create (do script sinh): `docs/TERMINOLOGY-REVIEW.md`
- Modify: `package.json` (`scripts["terms:report"]`)

- [ ] **Step 1: Tạo `scripts/i18n/report-terms.ts`**

```ts
/**
 * Sinh docs/TERMINOLOGY-REVIEW.md — báo cáo thuật ngữ cho người không chuyên duyệt.
 * Chạy: npm run terms:report
 */
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { GENERATED_TERMS } from '../../lib/i18n/terms.generated';
import { OVERRIDE_TERMS } from '../../lib/i18n/terms.override';

const require = createRequire(import.meta.url);
const BASE = 'iztro/lib/i18n/locales';
const commonZh = require(`${BASE}/zh-CN/common.json`) as Record<string, string>;
const commonVi = require(`${BASE}/vi-VN/common.json`) as Record<string, string>;

const CJK = /[\u4e00-\u9fff]/;
const overrideZh = new Set(OVERRIDE_TERMS.map((o) => o.zh));

// Bảng 1: iztro common.json mà bản Việt vẫn còn chữ Hán, hoặc trật từ可疑
const suspicious = Object.keys(commonZh)
  .filter((k) => CJK.test(commonVi[k] ?? '') || /^(?:đứa trẻ|cái|con) /.test(commonVi[k] ?? ''))
  .map((k) => ({ zh: commonZh[k], vi: commonVi[k], key: k }));

// Bảng 2: mục ta tự quyết (override) — cần người có chuyên môn nhìn lại
const ours = [...OVERRIDE_TERMS].sort((a, b) => a.kind.localeCompare(b.kind));

// Bảng 3: những gì iztro phủ
const iztroCount = Object.keys(GENERATED_TERMS).length;

const md = `# Danh sách thuật ngữ cần xem lại

Sinh bởi \`npm run terms:report\`. **Không sửa file này** — sửa \`lib/i18n/terms.override.ts\` rồi chạy lại.
Đổi một dòng trong override là bản dịch đổi everywhere, vì mọi UI đi qua \`<Bi>\`.

## 1. Đã chốt từ iztro (${iztroCount} mục) — khỏi xem

Bảng \`lib/i18n/terms.generated.ts\`, nguồn MIT, thuật ngữ Hán Việt chuẩn
(Tử Vi, Thiên Cơ, Vũ Khúc, Mệnh, Tài Bạch, Quan Lộc, Nô Bộc, Miếu, Vượng, Đắc…).

## 2. Ta tự quyết (${ours.length} mục) — xem khi nào bạn muốn

| Hán | Việt đang dùng | Loại | Lý do / nguồn |
|---|---|---|---|
${ours.map((o) => `| ${o.zh} | ${o.vi} | ${o.kind} | ${o.note.replace(/\|/g, '/')} |`).join('\n')}

## 3. Nghi vẫn sai trong bảng iztro (${suspicious.length} mục)

\`common.json\` của iztro có mục trông như máy dịch. Ta chưa override hết vì
chưa chắc nghĩa chuẩn trong tiếng Việt; bạn thấy từ nào sai, ghi vào cột cuối rồi báo tôi.

| Hán | Việt của iztro | key | nên là |
|---|---|---|---|
${suspicious.map((s) => `| ${s.zh} | ${s.vi} | ${s.key} |  |`).join('\n')}

## Cách sửa

1. Mở \`lib/i18n/terms.override.ts\`.
2. Thêm/sửa một dòng \`{ zh: '...', vi: '...', kind: '...', note: 'vì sao' }\`.
3. \`npm test\` (test phủ tên sẽ báo nếu bạn bỏ sót chỗ engine còn dùng).
`;
writeFileSync('docs/TERMINOLOGY-REVIEW.md', md, 'utf8');
console.log(`✓ docs/TERMINOLOGY-REVIEW.md — ${ours.length} mục ta quyết, ${suspicious.length} mục nghi sai, ${iztroCount} mục iztro đã phủ`);
```

- [ ] **Step 2: Chạy và đọc thử**

Thêm `"terms:report": "tsx scripts/i18n/report-terms.ts"` vào `scripts`, rồi:
Run: `npm run terms:report`
Expected: `✓ docs/TERMINOLOGY-REVIEW.md — N mục ta quyết, M mục nghi sai, ...`. Mở file, xác nhận bảng 2 và 3 có nội dung thật (bảng 3 phải có `童年`/`đứa trẻ Hạn`).

- [ ] **Step 3: Commit**

```bash
git add scripts/i18n/report-terms.ts docs/TERMINOLOGY-REVIEW.md package.json
git commit -m "docs(i18n): bao cao thuat ngu de nguoi khong chuyen duyet sau"
```

---

## Task 11: Xác minh bằng mắt và bàn giao

Test logic chứng minh *tên nào cũng có bản Việt*. Nó **không** chứng minh layout không vỡ — chữ Việt dài hơn chữ Hán, bàn 12 ô rất hẹp. Task này là bằng chứng cuối.

**Files:** không sửa code; nếu screenshot lộ lỗi thì quay lại Task 7/8 sửa CSS.

- [ ] **Step 1: Chạy toàn bộ chốt an toàn**

```bash
npm test && npm run typecheck
```
Expected: 21 test suite xanh (17 cũ + 4 mới), typecheck sạch. Ghi lại output.

- [ ] **Step 2: Kiểm nhãn biểu mẫu qua HTTP (server-side render)**

```bash
curl -s http://localhost:3000/chart | grep -o "Lập lá số Tử Vi" | head -1
curl -s http://localhost:3000/chart | grep -o "Ngày sinh (dương lịch)" | head -1
curl -s http://localhost:3000/chart | grep -c "Vui lòng chọn năm sinh"
```
Expected: hai lệnh đầu in ra chuỗi Việt; lệnh cuối `≥ 1`. Nếu 0, `<Bi>` không chạy ở server render — kiểm traBirthForm có phải client component (`"use client"`) làm nhãn bị loại khỏi HTML không.

- [ ] **Step 3: Kiểm bàn lá số bằng browser (bắt buộc, vì bàn tạo ở phía client)**

Với Playwright MCP (đã dùng được ở phiên trước):
1. `browser_navigate` → `http://localhost:3000/chart`
2. `browser_fill_form` chọn năm `1990`, tháng `6 月`, ngày `15 日`, giờ `10 时`
3. `browser_click` nút lập bàn (giờ đã là `立即起盘 · 解命运密码` → sau convert nó hiện nhãn Việt; click bằng `button:has-text("起盘")` để không phụ thuộc bản dịch)
4. `browser_snapshot` → grep kết quả: phải có `Vũ Khúc`, `Thiên Đồng`, `Liêm Trinh`, `Mệnh` **và** `武曲`, `命宫` bên cạnh
5. `browser_take_screenshot` (fullPage, `scale: 'css'`) tại viewport mặc định
6. `browser_resize` 390×844 → screenshot lại (kiểm `.bi-compact` ẩn chữ Hán và không tràn ô)

Expected: mọi ô có dòng Việt ở trên, dòng Hán nhỏ mờ bên dưới; không ô nào chữ bị cắt hoặc dồn sang 3 dòng.

- [ ] **Step 4: Đọc screenshot, sửa lỗi layout nếu có**

Ba lỗi hay gặp và cách sửa đúng:
- **Tràn ô**: giảm `.bi-zh` `font-size` xuống `0.62em`, hoặc đặt `compact` lên `PalaceCell` tên cung (đã làm ở Task 7 Step 1).
- **Chữ Hán hiện thành ô vuông** (thiếu font): xác nhận `'Microsoft YaHei'`/`'Noto Sans SC'` có trong `--font` (Task 6 Step 1).
- **Lệch độ đậm Việt/Hán**: đặt `.bi-zh { font-weight: 300; }` — không sửa `.bi-vi`.

Sau mỗi lần sửa CSS: `npm test && npm run typecheck`, chụp lại screenshot.

- [ ] **Step 5: Báo cáo cho người dùng**

Báo cáo phải có, bằng số thật:
1. Kết quả `npm test` (số suite) và `npm run typecheck`.
2. **Số mục iztro thiếu so với 85 ID sao của repo** — con số spec mục 9 hứa đo ở A0, lấy từ output Task 4 Step 2 (lần fail đầu) và Step 3 (sau khi override).
3. Đường dẫn `docs/TERMINOLOGY-REVIEW.md` + số mục ở bảng 2 và 3.
4. Hai screenshot (desktop + 390px) — người dùng là người cuối cùng xác nhận "đọc được không".
5. Danh sách file đã convert (`ADOPTED`) và những file **chưa** convert còn chữ Hán nguyên khối.

- [ ] **Step 6: Push**

```bash
git log --oneline origin/main..HEAD
git push tuvi feat/vi-bilingual
```
Expected: nhiều commit `feat(i18n)`/`test(i18n)`/`docs(i18n)`, **không có** `tsconfig.json` hay `next-env.d.ts` trong `git diff --stat`.

---

## Tự soát plan against spec

**1. Độ phủ spec (mục 4 Đợt A + mục 7 Kiểm thử):**

| Yêu cầu spec | Task |
|---|---|
| `terms.generated.ts` seed từ iztro | 1 |
| `terms.override.ts` thắng generated | 2 |
| Không có `setLanguage`, không có mutable state | 2 (kiến trúc `resolve.ts`), Global Constraints |
| `ui-phrases.ts` keyed bằng literal Hán | 3 |
| Biến thể có hậu tố (兄弟→兄弟宫, 子→子时) | 1 Step 4 |
| `StarBrightness` 9 bậc ngoài 7 của iztro | 2 Step 3, 4 |
| `ChartBoard` :111/:161/:163-165/:174-176/:182 | 7 Step 3 |
| `PalaceCell` tên cung + sao + badge tứ hóa | 7 Step 1–2 |
| `BirthForm` nhãn/validate/12 canh/nơi sinh | 8 |
| Font fallback CJK (`globals.css:8`) | 6 Step 1 |
| `lang="vi"` ở layout | 9 Step 2 |
| Test `terminology-coverage` build fail khi thiếu | 4 (tên) + 5 (câu UI) |
| `npm test` 17 bộ cũ phải xanh | mọi task Step cuối + 11 Step 1 |
| Screenshot 2 breakpoint | 11 Step 3–4 |
| Báo cáo từ khó + trang tra | 10 |
| `neutral-naming` pass với file mới | 9 Step 3 |

**Không thuộc plan này, có chủ đích:** mục 5 của spec (thêm sách — không có code A nào chạm tới), đợt B (`patterns.ts`, `STAR_DESCRIPTIONS`, `InsightPanel`), đợt C (landing `app/page.tsx` 1191 dòng, `lib/seo`, chú giải `lib/classics`, `metadata.locale`), trang `/thuat-ngu` trong app, và `metadata` Việt hóa. Đợt B và C mỗi đợt cần plan riêng — dịch ~2.300 dòng văn không viết thành task được nếu không có chỗ trống, mà plan thì cấm chỗ trống.

**2. Chỗ trống:** không còn `TBD`/`TODO`/`implement later`. Duy nhất Task 4 Step 3 mô tả *quy tắc* thêm override thay vì liệt kê từng mục — vì danh sách đó **là output của chạy test**, chưa tồn tại lúc viết plan. Task 4 Step 2 bắt executor ghi lại danh sách thật, và Step 3 quy định cách xử lý từng mục.

**3. Nhất quán type:** `TermKind`, `OverrideEntry`, `BiPair` định nghĩa ở Task 1, dùng ở Task 2/3/6/7. `biTerm`/`biText`/`biFmt`/`viTerm`/`hasTerm`/`hasPhrase`/`allTermsZh` định nghĩa ở Task 2–3, gọi ở Task 4–9 theo đúng signature. `ADOPTED` định nghĩa ở Task 5, sửa ở 7/8/9. Một bất thường có chủ đích: Task 8 Step 2–4 dùng `.vi` thay vì `<Bi>` cho message validate, `<option>` và chip — vì `<option>` không nhận element con; ghi rõ lý do tại chỗ.
