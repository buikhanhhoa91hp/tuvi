/**
 * BirthForm → BirthInfo 转换一致性回归
 *
 * 背景：`BirthFormState → BirthInfo` 的转换在本仓库里必须只有一处实现——
 * `lib/ziwei/share.ts` 的 `formToBirthInfo()`，它负责「晚子时换日」：
 * 23:00–23:59 出生按**次日**排盘。这条规则是三处规格共同确定的：
 *   · `lib/ziwei/types.ts` 声明 `BirthInfo.year` 是「已经过子时换日修正后的排盘日」；
 *   · `README.md` 时辰对照表下一行：「23:00–23:59 出生（晚子时）按次日排盘、时辰取 0」；
 *   · `scripts/regression/iztro-time-index-boundary.test.ts` 已把它钉成断言。
 *
 * 但 `components/BirthForm.tsx` 的 `handleSubmit` 曾经自行拼装 BirthInfo，
 * `year/month/day` 直接用表单原值，绕过了换日。于是同一次出生输入：
 *   · `/chart`（`BirthForm.onSubmit` → `generateChart`）排出「填的那天」的盘；
 *   · `/heming`（`formToBirthInfo` → `generateChart`）排出「次日」的盘。
 * 两条路径相差一整天，整张命盘（十二宫、星曜、四化）都不一样。
 *
 * 本回归钉住三件事：
 *   1. BirthForm 必须复用 `formToBirthInfo`，不得自行拼装 BirthInfo；
 *   2. BirthForm 不得再带一份自己的 `calcTrueSolarBranch`（真太阳时只有一处实现）；
 *   3. `formToBirthInfo` 的晚子时 / 早子时边界行为，含跨月与跨年进位。
 *
 * 第 1、2 条走源码解析（组件是 .tsx，仓库没有 DOM 测试环境），
 * 与 `famous-hour-consistency.test.ts` 同一做法。
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { formToBirthInfo } from '../../lib/ziwei/share';
import { PROVINCES } from '../../lib/ziwei/cities';
import { PROVINCE_VI } from '../../lib/i18n/place-vi';
import { viPlace } from '../../lib/i18n/resolve';
import type { BirthFormState } from '../../components/BirthForm';

const src = readFileSync(new URL('../../components/BirthForm.tsx', import.meta.url), 'utf8');

// ── 1) 转换只有一处实现：BirthForm 必须复用 share.ts ──────────────
assert.match(
  src,
  /import\s*\{[^}]*\bformToBirthInfo\b[^}]*\}\s*from\s*'@\/lib\/ziwei\/share'/,
  'BirthForm 必须从 @/lib/ziwei/share 引入 formToBirthInfo，不能自己拼 BirthInfo',
);

assert.equal(
  /onSubmit\(\s*\{/.test(src),
  false,
  'BirthForm 的 onSubmit 不应收到手拼的对象字面量——晚子时换日会因此被绕过，请改走 formToBirthInfo',
);

// ── 2) 真太阳时时辰只有一处实现 ─────────────────────────────────
assert.equal(
  /function\s+calcTrueSolarBranch\s*\(/.test(src),
  false,
  'BirthForm 不得重复实现 calcTrueSolarBranch，请复用 lib/ziwei/share.ts 的同名导出',
);

// ── 3) formToBirthInfo 的边界行为 ───────────────────────────────
function formAt(
  year: string,
  month: string,
  day: string,
  clockHour: string,
  clockMinute = '30',
  overrides: Partial<BirthFormState> = {},
): BirthFormState {
  return {
    name: '',
    year,
    month,
    day,
    clockHour,
    clockMinute,
    unknownTime: false,
    province: '',
    city: '',
    longitude: 120,
    gender: 'male',
    ...overrides,
  };
}

const pick = (b: ReturnType<typeof formToBirthInfo>) => ({
  year: b.year,
  month: b.month,
  day: b.day,
  hour: b.hour,
});

// 晚子时：按次日排盘、时辰取 0
assert.deepEqual(
  pick(formToBirthInfo(formAt('2000', '1', '31', '23'))),
  { year: 2000, month: 2, day: 1, hour: 0 },
  '1/31 23:30 晚子时应排到 2/1、时辰支 0',
);
assert.deepEqual(
  pick(formToBirthInfo(formAt('2000', '12', '31', '23'))),
  { year: 2001, month: 1, day: 1, hour: 0 },
  '跨年：12/31 23:30 应排到次年 1/1',
);
assert.deepEqual(
  pick(formToBirthInfo(formAt('2000', '2', '28', '23'))),
  { year: 2000, month: 2, day: 29, hour: 0 },
  '闰年：2/28 23:30 应排到 2/29',
);
assert.deepEqual(
  pick(formToBirthInfo(formAt('2001', '2', '28', '23'))),
  { year: 2001, month: 3, day: 1, hour: 0 },
  '平年：2/28 23:30 应排到 3/1',
);
assert.deepEqual(
  pick(formToBirthInfo(formAt('2000', '1', '31', '23', '0'))),
  { year: 2000, month: 2, day: 1, hour: 0 },
  '23:00 整点即进入晚子时',
);

// 早子时与 22:xx：不换日
assert.deepEqual(
  pick(formToBirthInfo(formAt('2000', '1', '31', '0'))),
  { year: 2000, month: 1, day: 31, hour: 0 },
  '00:30 早子时留在本日、时辰支同为 0',
);
assert.deepEqual(
  pick(formToBirthInfo(formAt('2000', '1', '31', '22', '59'))),
  { year: 2000, month: 1, day: 31, hour: 11 },
  '22:59 是亥时，不应换日',
);

// 时辰不详：不换日、支取 0
assert.deepEqual(
  pick(formToBirthInfo(formAt('2000', '1', '31', '23', '30', { unknownTime: true }))),
  { year: 2000, month: 1, day: 31, hour: 0 },
  '时辰不详时不应按晚子时换日',
);

// ── 4) Task c6: nhãn Việt 34 đơn vị cấp tỉnh KHÔNG được xoay chuyển khóa tra cứu ──
// Bối cảnh: option tỉnh hiển thị nhãn Việt (Bắc Kinh…) nhưng form.province, `value=` và
// chuỗi lưu vào lá số VẪN là tên Hán — vì PROVINCES.find(p => p.name === …) tra theo khóa
// đó và offsetMin = round((longitude − 120) × 4) của giờ thật–mặt trời đọc longitude từ
// phép tra ấy. Nếu một nhãn Việt lọt được vào làm key, lookup trả undefined → BirthForm
// rơi về longitude 120 (mặc định) → giờ sinh của mọi lá số chọn tỉnh đó sai silently.
// Các chốt dưới đây bảo đảm: bảng phủ đúng 34 tỉnh, không khóa thừa, tra ngược
// nhãn→Hán→kinh độ cho cùng offsetMin như tra theo Hán, và nguồn vẫn dùng key Hán.
const CJK = /[\u4e00-\u9fff]/;
const zhNames = PROVINCES.map((p) => p.name);

assert.equal(PROVINCES.length, 34, 'PROVINCES phải có đúng 34 đơn vị cấp tỉnh ( Task c6 đếm theo này)');
assert.equal(Object.keys(PROVINCE_VI).length, 34, 'PROVINCE_VI phải có đúng 34 mục');

// 4a. Mọi tên tỉnh Hán đều có nhãn Việt, nhãn không rỗng và không còn ký tự Hán.
for (const n of zhNames) {
  const vi = PROVINCE_VI[n];
  assert.ok(typeof vi === 'string' && vi.trim() !== '', `thiếu nhãn Việt cho '${n}'`);
  assert.ok(!CJK.test(vi), `nhãn '${vi}' của '${n}' vẫn chứa Hán tự`);
}
// 4b. KHÔNG khóa nào ngoài PROVINCES (chống mục thừa/sau khi dữ liệu Hán đổi tên).
const orphanKeys = Object.keys(PROVINCE_VI).filter((k) => !zhNames.includes(k));
assert.deepEqual(orphanKeys, [], `PROVINCE_VI có khóa không tồn tại trong PROVINCES: ${orphanKeys.join(', ')}`);
// 4c. Nhãn không trùng nhau — hai tỉnh cùng một nhãn sẽ khiến tra ngược nhập nhằng.
assert.equal(new Set(Object.values(PROVINCE_VI)).size, 34, 'nhãn Việt phải nhất quán 1-1 với tên Hán');

// Cùng đường tra mà BirthForm dùng (handleProvince/handleCity): tên → cities[0].longitude,
// thiếu tên thì mặc định 120 — đúng như `?? 120` trong component.
const lonOfProvinceName = (name: string): number =>
  PROVINCES.find((p) => p.name === name)?.cities[0]?.longitude ?? 120;
const offsetMinOf = (lon: number): number => Math.round((lon - 120) * 4);

// 4d. Với MỌI tỉnh: đi từ NHÃN Việt (đảo ngược bảng) về khóa Hán rồi tra longitude cho
//     cùng offsetMin như tra thẳng bằng tên Hán. Đây chính là bất biến "đổi nhãn không
//     đổi giờ": label không nằm trên đường tính số, và khóa không đổi nên không lệch 120.
for (const n of zhNames) {
  const vi = PROVINCE_VI[n];
  const backToZh = zhNames.find((z) => PROVINCE_VI[z] === vi);
  assert.equal(backToZh, n, `nhãn '${vi}' không tra ngược về đúng '${n}'`);
  assert.equal(offsetMinOf(lonOfProvinceName(backToZh!)), offsetMinOf(lonOfProvinceName(n)),
    `offsetMin qua nhãn '${vi}' khác với qua tên '${n}'`);
}
// viPlace() — API mà component gọi — phải trả đúng nhãn (không rơi sang viTerm).
for (const n of zhNames) assert.equal(viPlace(n), PROVINCE_VI[n], `viPlace('${n}') !== PROVINCE_VI`);

// 4e. Số chốt (trước-c6 = sau-c6, vì cities.ts không bị sờ tới): 北京市 116.4 → −14,
//     广东省 113.3 → −27, 新疆维吾尔自治区 87.6 → −130. Nếu ai đó sửa cities.ts
//     làm kinh độ đổi, những dòng này báo — đó là chủ đích (số phải có lý do).
assert.equal(offsetMinOf(lonOfProvinceName('北京市')), -14, "offsetMin 北京市 phải là -14 (như trước Task c6)");
assert.equal(offsetMinOf(lonOfProvinceName('广东省')), -27, "offsetMin 广东省 phải là -27 (như trước Task c6)");
assert.equal(offsetMinOf(lonOfProvinceName('新疆维吾尔自治区')), -130, "offsetMin 新疆 phải là -130 (như trước Task c6)");

// 4f. Nguồn BirthForm vẫn dùng TÊN HÁN làm key/value, chỉ ĐỔI NHÃN:
//     - `value={p.name}` và `key={p.name}` trên option tỉnh;
//     - lookup `PROVINCES.find(p => p.name === form.province)` / `=== prov` giữ nguyên;
//     - label đi qua viPlace(p.name).
assert.match(src, /<option key=\{p\.name\} value=\{p\.name\}>\{viPlace\(p\.name\) \?\? p\.name\}<\/option>/,
  'option tỉnh phải: value=key=tên Hán, label=viPlace(name)');
assert.match(src, /PROVINCES\.find\(p => p\.name === form\.province\)/,
  'BirthForm phải tiếp tục tra PROVINCES bằng form.province (chuỗi Hán)');
assert.match(src, /PROVINCES\.find\(p => p\.name === prov\)/,
  'handleProvince phải tiếp tục tra bằng đúng tên Hán được chọn');

console.log('✅ BirthForm→BirthInfo 转换一致性：单一实现 + 晚子时边界（跨月/跨年）均正确');
console.log('✅ Task c6: 34 nhãn tỉnh tiếng Việt phủ đủ, khóa Hán và offsetMin (kinh độ→giờ thật) không đổi');
process.exit(0);
