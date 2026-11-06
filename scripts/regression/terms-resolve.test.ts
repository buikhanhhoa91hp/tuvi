import { viTerm, biTerm, hasTerm, viPillar } from '../../lib/i18n/resolve';
import { GENERATED_TERMS } from '../../lib/i18n/terms.generated';
import { OVERRIDE_TERMS, pickOverride } from '../../lib/i18n/terms.override';
import type { OverrideEntry } from '../../lib/i18n/terms.types';

let failed = 0;
const ok = (c: boolean, m: string) => { if (!c) { failed++; console.error('  ✗ ' + m); } else console.log('  ✓ ' + m); };

// 1. Tra được từ generated
ok(viTerm('紫微') === 'Tử Vi', "viTerm('紫微') === 'Tử Vi'");
ok(viTerm('财帛') === 'Tài Bạch', "viTerm('财帛') === 'Tài Bạch'");

// 2. Biến thể repo thắng — '交友宫' iztro KHÔNG có mục nào (repo dùng thay 仆役, constants.ts:25),
//    override là đường duy nhất đưa nó về 'Nô Bộc'.
ok(viTerm('交友宫') === 'Nô Bộc', "bien the repo '交友宫' -> 'Nô Bộc' (override)");
// '子时' thì NGƯỢC LẠI: bảng generated đã có do vòng hậu tố 时 của sync — không có override
// '子时' trong terms.override.ts (chỉ có 早子时/晚子时). Caption cũ ghi nhầm "override thắng".
ok(viTerm('子时') === 'Giờ Tý', "dien the '子时' -> 'Giờ Tý' (qua generated, khong phai override)");

// 3. Brightness ngoai 7 bac cua iztro: StarBrightness con '闲' va '地' (types.ts:42)
ok(viTerm('闲') === 'Nhàn', "StarBrightness '闲' -> 'Nhàn'");
ok(viTerm('地') === 'Địa', "StarBrightness '地' -> 'Địa'");

// 3b. Override THANG generated — iztro dịch 陷='Hạn' trùng với 限='Hạn'; Việt chuẩn ngành là 'Hãm'
// '限' giờ ĐÃ là override (kind misc, terms.override.ts) — caption cũ "không bị override" là sai.
// Generated không có '限' (R5 loại common.json), nên 'Hạn' ở đây tới từ override, và mục dưới
// chứng minh override của 陷 không đụng tới nó.
ok(viTerm('限') === 'Hạn', "限 -> 'Hạn' qua override (kind misc), khong bi 陷 choán");
ok(viTerm('陷') === 'Hãm', "陷 -> 'Hãm' nhờ override, dù generated nói 'Hạn'");
ok(GENERATED_TERMS['陷'] === 'Hạn', 'generated vẫn giữ nguyên giá trị iztro (không sửa tay)');

// 4. Thieu ban dich -> khong throw, tra ve missing:true va vi === zh (UI van chay)
const m = biTerm('不存在的东西');
ok(m.missing === true && m.vi === '不存在的东西', 'thieu muc: missing=true, vi===zh, khong crash');
ok(hasTerm('不存在的东西') === false, 'hasTerm false khi chua co');

// 5. kind chi ưu tiên chọn mục override cùng kind, không được làm mất kết quả
ok(viTerm('紫微', 'star') === 'Tử Vi', 'kind=star vẫn ra Tử Vi');
ok(viTerm('紫微') === viTerm('紫微', 'misc'), 'kind lạ không làm hỏng kết quả');

// 6. R13: exact kind THẮNG thứ tự khai báo, kind sai rơi về mục đầu — chứng minh bằng
//    fixture cục bộ qua helper pure pickOverride (terms.override.ts). Trước đây case này
//    sống bằng 2 mục '双轨' giả trong bảng production: chúng đi theo allTermsZh() sang
//    Task 10 in cho người dùng rà — fixture không được ship lẫn dữ liệu thật.
const R13_FIXTURE: OverrideEntry[] = [
  { zh: '双轨', vi: 'Song Quỹ (sao)', kind: 'star', note: 'fixture cục bộ — mục đầu khai báo.' },
  { zh: '双轨', vi: 'Song Quỹ (cách)', kind: 'pattern', note: 'fixture cục bộ — mục hai cùng zh.' },
];
ok(pickOverride(R13_FIXTURE, 'star')?.vi === 'Song Quỹ (sao)', "pickOverride kind='star' khớp mục 1");
ok(pickOverride(R13_FIXTURE, 'pattern')?.vi === 'Song Quỹ (cách)', "pickOverride kind='pattern' thắng muc dau khai bao");
ok(pickOverride(R13_FIXTURE)?.vi === 'Song Quỹ (sao)', 'pickOverride khong kind -> lay muc dau khai bao');
ok(pickOverride(R13_FIXTURE, 'brightness')?.vi === 'Song Quỹ (sao)', 'pickOverride kind sai -> roi ve muc dau, khong mat ban dich');
ok(pickOverride([], 'star') === undefined, 'pickOverride danh sach rong -> undefined');
// Fixture phải ở ngoài bảng production — nếu ai thêm lại '双轨' vào terms.override.ts, fail ở đây.
ok(!OVERRIDE_TERMS.some((e) => e.zh === '双轨'), "bang production khong con fixture '双轨' (allTermsZh sach)");

// 6b. viPillar — 60 tổ hợp can chi không phải từ bảng: ghép từ bản dịch can+chi sẵn có.
ok(viPillar('庚午').missing === false && viPillar('庚午').vi === 'Canh Ngọ', "viPillar('庚午') -> 'Canh Ngọ'");
ok(viPillar('辛亥').missing === false && viPillar('辛亥').vi === 'Tân Hợi', "viPillar('辛亥') -> 'Tân Hợi'");
const halfUnknown = viPillar('庚鼖'); // '鼖' không phải chi nào
ok(halfUnknown.missing === true && halfUnknown.vi === '庚鼖', 'mot nura unknown -> missing=true, vi===zh (khong hoi noi Viet)');
ok(viPillar('壬子').missing === false && viPillar('壬子').vi === 'Nhâm Tý', "viPillar('壬子') -> 'Nhâm Tý'");
ok(viPillar('干').missing === true, 'khong phai 2 chu -> missing (can don khong phai tru)');

// 7. R13 guard: mọi OverrideEntry phải có vi và note khác rỗng.
//    vi rỗng là đường hỏng IM LẶNG: resolve.ts:17 `if (vi) return vi;` bỏ qua override rồi
//    trả giá trị generated mà override đó sinh ra để chèn/đối thắng — bug không ai thấy.
//    note rỗng = chưa nghiên cứu (header terms.override.ts: "Không có note thì coi như chưa nghiên cứu").
const emptyVi = OVERRIDE_TERMS.filter((e) => e.vi.trim() === '');
const emptyNote = OVERRIDE_TERMS.filter((e) => e.note.trim() === '');
ok(OVERRIDE_TERMS.every((e) => e.vi.trim() !== ''),
   `moi override co vi khong rong (rong: ${emptyVi.map((e) => e.zh).join(', ') || 'khong'})`);
ok(OVERRIDE_TERMS.every((e) => e.note.trim() !== ''),
   `moi override co note khong rong (rong: ${emptyNote.map((e) => e.zh).join(', ') || 'khong'})`);

// 8. Task 7 — các giá trị mà KHÔNG gate nào khác bảo vệ:
//    (a) 化禄/化权/化科/化忌 là DẠNG ĐẦY ĐỦ của tứ hóa, iztro mutagen chỉ có một âm nên
//        sync không sinh ra; ChartBoard.tsx:315-318 render chúng qua <Bi mode="term">. Xóa
//        override thì ratchet VẪN XANH (lời dịch biTerm được miễn điều kiện bảng — R28 (b)
//        chỉ áp cho câu), và chart-name-coverage không quét tới (engine không phát sinh
//        chuỗi 化X). Vì vậy giá trị phải chốt ở đây.
for (const [zh, vi] of [['化禄', 'Hóa Lộc'], ['化权', 'Hóa Quyền'], ['化科', 'Hóa Khoa'], ['化忌', 'Hóa Kỵ']] as const) {
  ok(viTerm(zh, 'mutagen') === vi, `dang day du tu hoa '${zh}' -> '${vi}'`);
}
//    (b) R19: nhãn overlay một âm, đối xứng Hạn/Niên — 'Lưu niên' hai âm từng làm vỡ hàng
//        phụ tinh ở viewport 1280 (badge 68–83px trong ô 211px; đo 2026-11-06).
ok(viTerm('限', 'misc') === 'Hạn', "R19: '限' -> 'Hạn' (mot am)");
ok(viTerm('年', 'misc') === 'Niên', "R19: '年' -> 'Niên' (mot am, khong con 'Lưu niên')");

console.log(failed ? `\n✗ terms-resolve: ${failed} loi` : '\n✅ terms-resolve: đạt');
process.exit(failed ? 1 : 0);
