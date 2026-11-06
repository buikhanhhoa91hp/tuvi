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
