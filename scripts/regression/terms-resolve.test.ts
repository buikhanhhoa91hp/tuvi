import { viTerm, biTerm, hasTerm } from '../../lib/i18n/resolve';
import { GENERATED_TERMS } from '../../lib/i18n/terms.generated';
import { OVERRIDE_TERMS } from '../../lib/i18n/terms.override';

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

// 6. R13: HAI mục override CÙNG zh, khác kind (fixture '双轨' trong terms.override.ts).
//    Không có case này thì nhánh find (resolve.ts:15) và nhánh push (terms.override.ts:64)
//    là code chết — không ai chứng minh exact kind THẮNG thứ tự khai báo.
ok(viTerm('双轨', 'star') === 'Song Quỹ (sao)', "kind='star' khop muc 1 (cung zh khac kind)");
ok(viTerm('双轨', 'pattern') === 'Song Quỹ (cách)', "kind='pattern' khop muc 2 — kind thắng muc dau khai bao");
ok(viTerm('双轨') === 'Song Quỹ (sao)', 'khong kind -> lay muc dau khai bao');
ok(viTerm('双轨', 'brightness') === 'Song Quỹ (sao)', 'kind sai -> roi ve muc dau khai bao, khong mat ban dich');

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

console.log(failed ? `\n✗ terms-resolve: ${failed} loi` : '\n✅ terms-resolve: đạt');
process.exit(failed ? 1 : 0);
