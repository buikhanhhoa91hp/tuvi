/**
 * Câu và nhãn UI — key là đúng literal tiếng Trung trong source.
 * Chỉ chứa CÂU. Thuật ngữ một từ (武曲, 命宫) để ở terms.generated/terms.override,
 * vì UI hiển thị thuật ngữ qua <Bi mode="term"> chứ không qua bảng này.
 *
 * Charter (R12): một chữ Hán đứng một mình mà đã là THUẬT NGỮ thì KHÔNG được vào đây.
 * '限' vì vậy không có mục nào — nó thuộc terms.override.ts, render qua biTerm('限').
 * scripts/regression/ui-phrases.test.ts guard điều đó bằng
 * `Object.keys(UI_VI).every(k => !hasTerm(k))`.
 *
 * Mọi key ở dưới đã đối chiếu từng ký tự với source (kể cả （） ： – ， ； dấu cách);
 * comment cuối dòng là vị trí nguồn. Sửa chuỗi trong component thì sửa cả dòng này.
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
  '请选择出生年份': 'Vui lòng chọn năm sinh',                       // :92
  '请选择月份': 'Vui lòng chọn tháng',                              // :95
  '请选择日期': 'Vui lòng chọn ngày',                               // :96
  '年份范围：1900–2026': 'Năm phải trong khoảng 1900–2026',          // :93 (– là U+2013)

  // ── components/ChartBoard.tsx ──
  '紫微斗数命盘': 'Lá số Tử Vi',                                   // :111
  '紫微斗数': 'Tử Vi đẩu số',                                       // :161
  '当前大限': 'Đại hạn hiện tại',                                    // :174
  // '限' KHÔNG ở đây — thuật ngữ, xem charter ở đầu file (R12).
  '年': 'Lưu niên',                                                 // :75 overlayLabel (badge lưu niên)
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
 *
 * Quy ước key: nguồn viết `${y}年${m}月${d}日` (template literal) hoặc `{mo} 月`
 * (JSX expression) — ở đây ghi lại đúng nguyên văn nhưng đổi phần nội suy thành
 * `{tên}`. Call site truyền chính chuỗi key đó cho biFmt(); resolve.ts còn khớp
 * được khi call site đặt tên placeholder khác (xem ghi chú ở biFmt).
 *
 * Quy ước value: `{name:N}` = padStart(N, '0'). Chỉ dùng cho vế Việt, vì vế Hán
 * phải tái hiện đúng chuỗi app đã in ra. Task 8 có thể truyền sẵn chuỗi đã pad
 * (`String(m).padStart(2,'0')`) — pad khi đó là no-op, không ảnh hưởng.
 */
export const UI_FMT_VI: Record<string, string> = {
  '{y}年{m}月{d}日': '{d:2}/{m:2}/{y}',               // BirthForm.tsx:115
  '{m}月没有{d}日': 'Ngày {d} không có trong tháng {m}', // BirthForm.tsx:97 (không pad: 'tháng 2', không phải 'tháng 02')
  '{m} 月': 'Tháng {m}',                               // BirthForm.tsx:263 `<option>{mo} 月</option>` (dấu cách U+0020 trước 月)
  '{n}岁': '{n} tuổi',                                 // chưa có source trần nào; ChartBoard.tsx:175 là `{dx.startAge}–{dx.endAge}岁` — Task 7 khai báo key '{n1}–{n2}岁' riêng (R7)
};
