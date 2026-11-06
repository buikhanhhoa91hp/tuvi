import { biText, biFmt, hasPhrase, hasTerm } from '../../lib/i18n/resolve';
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
ok(Object.keys(UI_VI).every(k => !hasTerm(k)), 'không câu UI nào trùng khóa với thuật ngữ');

console.log(failed ? `\n✗ ui-phrases: ${failed} loi` : '\n✅ ui-phrases: đạt');
process.exit(failed ? 1 : 0);
