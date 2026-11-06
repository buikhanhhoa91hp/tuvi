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

// Câu nội suy: BirthForm.tsx:115 ghép `${y}年{m}月${d}日`. fill() chỉ thế chỗ theo tên,
// không định dạng: args số nguyên → '15/6/1990'. Muốn có '06'/'15' thì call site pad sẵn
// (plans Task 8 Step 3) — dòng cuối khối này chốt đúng hợp đồng đó.
const f = biFmt('{y}年{m}月{d}日', { y: 1990, m: 6, d: 15 });
ok(f.vi === '15/6/1990', `noi suy → đảo ba thành phần, không pad (thực tế: ${f.vi})`);
ok(f.zh === '1990年6月15日', `noi suy → giu nguyen van Han (thực tế: ${f.zh})`);
ok(f.missing === false, 'biFmt tim thay key');
ok(biFmt('{y}年{m}月{d}日', { y: 1990, m: '06', d: '15' }).vi === '15/06/1990',
   'pad là việc call site, bảng không pad hộ');

// Placeholder phai trung nhau giu 2 bange
ok(biFmt('{m}月没有{d}日', { m: 2, d: 30 }).vi === 'Ngày 30 không có trong tháng 2', 'câu ngày không tồn tại');

// Args KHÔNG đủ: fill() để nguyên `{name}`, không ném. Hành vi này có chủ đích và hệ quả
// là ngoặc nhọn sót lại hiện thẳng ra UI — các assertion dưới chốt chuỗi đầu ra cụ thể để
// phần sót là dữ liệu đã được kiểm, không phải tai nạn chưa ai đo.
ok(biFmt('{y}年{m}月{d}日', { y: 2000 }).vi === '{d}/{m}/2000', 'partial args → {d}/{m}/2000');
ok(biFmt('{m}月没有{d}日', { m: 2 }).vi === 'Ngày {d} không có trong tháng 2', 'thiếu {d} → chỉ {d} sót');
ok(biFmt('{y}年{m}月{d}日', { y: 2000 }).missing === false, 'key có trong bảng → missing=false, không ném');

// Template KHÔNG có trong UI_FMT_VI thì trật là trật: R14 bỏ hẳn khớp theo bộ xương, nên
// missing=true và hasPhrase nói 'không' — điều kiện để ratchet Task 5 không bỏ sót và báo
// cáo Task 10 đếm đủ số câu chưa dịch.
ok(biFmt('{a}月', { b: 1 }).missing === true, 'template lạ → missing=true, không ném');
ok(hasPhrase('{a}月') === false, "hasPhrase('{a}月') === false: chỉ khớp key tuyệt đối");

// Moi key trong UI_VI khong duoc trung voi mot thuat ngu don le
ok(Object.keys(UI_VI).length > 0, `UI_VI có ${Object.keys(UI_VI).length} mục`);
ok(hasPhrase('请选择月份'), 'hasPhrase');
ok(Object.keys(UI_VI).every(k => !hasTerm(k)), 'không câu UI nào trùng khóa với thuật ngữ');
ok(!hasPhrase('年') && hasTerm('年'), "R15: '年' là thuật ngữ (terms.override), không phải câu UI");

console.log(failed ? `\n✗ ui-phrases: ${failed} loi` : '\n✅ ui-phrases: đạt');
process.exit(failed ? 1 : 0);
