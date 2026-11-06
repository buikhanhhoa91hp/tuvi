/**
 * Câu và nhãn UI — key là đúng literal tiếng Trung trong source.
 * Chỉ chứa CÂU. Thuật ngữ một từ (武曲, 命宫) để ở terms.generated/terms.override,
 * vì UI hiển thị thuật ngữ qua <Bi mode="term"> chứ không qua bảng này.
 *
 * Charter (R12): một chữ Hán đứng một mình mà đã là THUẬT NGỮ thì KHÔNG được vào đây.
 * '限' và '年' vì vậy không có mục nào — cả hai thuộc terms.override.ts, render qua
 * biTerm (R15). scripts/regression/ui-phrases.test.ts guard điều đó bằng
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

  // ── components/BirthForm.tsx — phần còn lại Task 8 wire (mở rộng bảng Task 3) ──
  // Key lấy nguyên văn từ source (kể cả （） ： – … dấu cách), không đặt lại ký tự nào.
  '输入生辰八字': 'Nhập ngày giờ sinh',                             // :207 tiêu đề (── … ── là trang trí, nằm ngoài <Bi>)
  '请输入姓名': 'Vui lòng nhập họ tên',                             // :227 placeholder (attribute → chỉ vế Việt)
  '年份': 'Năm',                                                   // :247 <option> không nhận con → vế Việt
  '月份': 'Tháng',                                                 // :261
  '日期': 'Ngày',                                                  // :275
  '省份 / 直辖市': 'Tỉnh / thành phố trực thuộc',                    // :296
  '城市': 'Thành phố',                                              // :309
  '先选省份': 'Chọn tỉnh trước',                                     // :309
  '经度': 'Kinh độ',                                               // :324 dòng thông tin kinh độ/lệch giờ
  '时差': 'Lệch giờ',                                              // :324
  '分钟': 'phút',                                                  // :324
  '时辰不详': 'Canh giờ không rõ',                                   // :117 summary chip (một dòng → vế Việt)
  '真太阳时': 'Giờ thật–mặt trời',                                   // :366 nhãn kết quả
  '不知道出生时间，以子时（23:00–01:00）起盘':
    'Không rõ giờ sinh — lập lá số theo giờ Tý (23:00–01:00)',        // :385 checkbox
  '性别': 'Giới tính',                                              // :392 nhãn
  '紫微起盘中…': 'Đang lập lá số Tử Vi…',                            // :483 nút loading
  '立即起盘 · 解命运密码': 'Lập lá số · Giải mã vận mệnh',             // :485 nút submit

  // ── components/ChartBoard.tsx (số dòng sau Task 7, khi mỗi chuỗi đã nằm trong <Bi>) ──
  '紫微斗数命盘': 'Lá số Tử Vi',                                   // :122
  '紫微斗数': 'Tử Vi đẩu số',                                       // :176
  '当前大限': 'Đại hạn hiện tại',                                    // :205
  '点击宫位看三方四正': 'Nhấn một cung để xem tam phương tứ chính',   // :326, chú giải dưới bàn lá số
  // :81-84 `timeView === 'daxian' ? <Bi … zh="限"> : <Bi … zh="年">` — cả hai nhãn của cùng
  // một biểu thức đều là THUẬT NGỮ, nên ở terms.override.ts (R12 + R15), không ở đây.
  // '闰' thì khác: đó là tiếp đầu tố 'tháng nhuận' của lịch âm (:222), không phải thuật ngữ;
  // ngày nào nó thành thuật ngữ thì guard `UI_VI ∩ hasTerm = ∅` phải báo — guard đang làm việc.
  '闰': 'nhuận',                                                    // :222

  // ── components/PalaceCell.tsx ──
  // '空宫' là nhãn PLACEHOLDER của UI khi cung không có chính tinh (PalaceCell.tsx:166).
  // Engine không bao giờ phát ra chuỗi này (Palace.name lấy nguyên từ iztro, algorithm.ts:572)
  // nên nó là CÂU của UI, không phải thuật ngữ — guard ui-phrases.test.ts:45
  // (`UI_VI ∩ hasTerm = ∅`) chứng minh nó không trùng mục thuật ngữ nào.
  '空宫': 'Cung trống',                                             // :166

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
 * Quy ước key: nguồn viết `${y}年${m}月${d}日` (template literal) hoặc
 * `<option>{mo} 月</option>` (JSX) — ở đây ghi lại đúng nguyên văn nhưng đổi phần nội
 * suy thành `{tên}`. Từ R14, biFmt/hasPhrase chỉ khớp key TUYỆT ĐỐI: call site phải
 * truyền đúng chuỗi key, kể cả tên placeholder (`{m}`, không phải `{mo}`); truyền khác
 * tên thì missing=true và ratchet Task 5 phải thấy — đó là hành vi muốn có, không phải
 * chỗ để nới.
 *
 * Quy ước value: chỉ thế `{name}` bằng args[name]; không còn cú pháp định dạng nào
 * (kiểu `{name:N}` đã bỏ theo R14). Muốn số lẻ có '0' đầu thì call site pad sẵn trước
 * khi gọi — xem plans Task 8 Step 3: `biFmt('{y}年{m}月{d}日', { y,
 * m: String(m).padStart(2,'0'), d: String(d).padStart(2,'0') })`. Vế Hán luôn tái hiện
 * đúng chuỗi app đã in.
 */
export const UI_FMT_VI: Record<string, string> = {
  '{y}年{m}月{d}日': '{d}/{m}/{y}',                   // BirthForm.tsx:115 (call site pad: '15/06/1990')
  '{m}月没有{d}日': 'Ngày {d} không có trong tháng {m}', // BirthForm.tsx:97 (không pad: 'tháng 2', không phải 'tháng 02')
  '{m} 月': 'Tháng {m}',                               // BirthForm.tsx:263 `<option>{mo} 月</option>` (dấu cách U+0020 trước 月)
  '{n} 日': 'Ngày {n}',                                // BirthForm.tsx:277 `<option>{dy} 日</option>` (Task 8)
  '{n} 时': '{n} giờ',                                 // BirthForm.tsx:351 `<option>08 时</option>` (call site pad, R17)
  '{n} 分': '{n} phút',                                // BirthForm.tsx:360 `<option>00 分</option>` (call site pad, R17)
  '{n}岁': '{n} tuổi',                                 // chưa có call site nào; ChartBoard dùng dạng HAI số, khai báo riêng bên dưới (R7)
  // ChartBoard.tsx:175 (bản TRƯỚC Task 7; nay là :212) viết `<div>{dx.startAge}–{dx.endAge}岁</div>` — JSX text
  // CHEN biểu thức nên extractor không thấy nó (R29a, blind spot có chủ đích). Task 7 đổi sang
  // <Bi mode="fmt" template="{n1}–{n2}岁" …/> : chuỗi trần khai báo trong lời dịch → thấy được,
  // và vì thế KHÔNG cần dòng nào trong TEMPLATE_OK của ratchet (R7 đường (a)).
  '{n1}–{n2}岁': '{n1}–{n2} tuổi',                     // ChartBoard.tsx:212 (dấu – là U+2013, giống source)
};
