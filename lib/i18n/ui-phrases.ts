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

  // ── components/TimeNav.tsx (fix wave — vòng review toàn nhánh cuối) ──
  '本命': 'Bản mệnh',                                               // :88 tab
  '大限': 'Đại hạn',                                                // :96 (nhánh fallback của tab) + :154 (args {z} của fmt 年四化)
  '流年': 'Lưu niên',                                               // :116 tab
  // hasTerm('本命')/hasTerm('大限')/hasTerm('流年') đều false (đo bằng probe
  // resolve.ts trước khi thêm) — không vi phạm R12; '限'/'年' một âm vẫn là thuật ngữ ở
  // terms.override.ts, còn ba nhãn tab hai âm này là CÂU điều hướng.

  // ── components/ChartSummary.tsx (fix wave) ──
  '命格总览': 'Tổng quan mệnh cách',                                 // :50
  '命宫主星': 'Chính tinh cung Mệnh',                                // :55
  '性格特质': 'Đặc tính tính cách',                                  // :72
  '五行局 · 当前大限': 'Cục ngũ hành · Đại hạn hiện tại',             // :89 (· là U+00B7, có dấu cách hai bên — copy nguyên văn)
  '本命四化': 'Tứ hóa bản mệnh',                                     // :122
  '格局识别': 'Nhận diện cách cục',                                  // :161
  '必须': 'Bắt buộc',                                                // :194 điều kiện cách cục
  '加分': 'Điểm cộng',                                               // :201
  '破格': 'Phá cách',                                                // :208
  '大限运程': 'Vận trình đại hạn',                                   // :238

  // ── components/StarDetailPanel.tsx (fix wave) ──
  '主星': 'Chính tinh',                                              // :166 nhãn loại sao
  '吉星': 'Cát tinh',                                                // :167
  '煞星': 'Sát tinh',                                                // :168
  '杂星': 'Tạp tinh',                                                // :169
  '五行': 'Ngũ hành',                                                // :216 chip thuộc tính
  '性质': 'Tính chất',                                               // :217
  '位置': 'Vị trí',                                                  // :218
  '庙旺': 'Miếu vượng',                                              // :219 nhãn độ sáng (đối chiếu brightness tiếng Anh, không so với dữ liệu Hán)
  '落陷': 'Lạc hãm',                                                 // :220
  '平和': 'Bình hòa',                                                // :220
  '星曜特质': 'Đặc tính tinh diệu',                                  // :236
  '古书原文': 'Nguyên văn cổ thư',                                   // :252 — văn cổ giữ nguyên Hán, chỉ Việt nhãn
  '倪海厦老师解读': 'Thầy Ni Hải Hạ luận giải',                       // :264
  '事业方向': 'Phương hướng sự nghiệp',                               // :272
  '感情特质': 'Đặc tính tình cảm',                                    // :273
  '财运分析': 'Phân tích tài vận',                                    // :274
  '健康提示': 'Lưu ý sức khỏe',                                       // :275
  '最佳宫位': 'Cung tốt nhất',                                       // :289
  '注意宫位': 'Cung cần lưu ý',                                       // :293

  // ══ app/page.tsx (task c1) — trang chủ landing ══════════════════════
  // R30: van trang → TIENG VIET THAY THE CHU HAN (biText(...).vi, khong <Bi mode="text">).
  // Ten 14 chu tinh + tu hoa o day di qua biTerm (THUAT NGU, terms.generated) — R12 cam
  // trung key voi hasTerm nen chung KHONG xuat hien trong khoi duoi day.
  // Cac chuoi chua \n (tieu de 2 dong / doan van nhieu dong JSX) copy nguyen van escapes.

  // ── ThemeToggle ──
  '切换亮色主题': 'Chuyển sang nền sáng',
  '切换暗色主题': 'Chuyển sang nền tối',
  '暗色': 'Tối',
  '亮色': 'Sáng',

  // ── FEATURES (the + tag/subtitle/points; '格局识别'复用 mục ChartSummary ở trên) ──
  '排盘体系': 'Hệ thống lập lá số',
  '倪海厦正宗\n紫微斗数': 'Chính truyền Ni Hải Hạ\nTử Vi đẩu số',
  '非简化版，严格遵循倪海厦老师传承': 'Bản đầy đủ không giản lược — tuân thủ chặt chẽ truyền bản của thầy Ni Hải Hạ',
  '纳音五行局起盘，不采用网络简化算法': 'Khởi cục theo nạp âm ngũ hành, không dùng thuật toán giản lược trên mạng',
  '命宫逆数生时、身宫顺数生时，严格对齐教学规则': 'Cung Mệnh đếm nghịch, cung Thân đếm thuận theo giờ sinh — bám sát quy tắc bài giảng',
  '十四主星与四化飞星按原法推演，结构完整可复核': '14 chính tinh và tứ hóa phi tinh diễn theo phép gốc, cấu trúc đầy đủ, kiểm chứng được',
  '命盘呈现': 'Hiển thị lá số',
  '完整十四主星\n四化飞星': 'Đủ 14 chính tinh\nTứ hóa phi tinh',
  '结构清晰，一眼看懂主轴与重点': 'Bố cục rõ ràng — nhìn là thấy ngay trục chính và trọng điểm',
  '十四主星完整入宫，主星关系清楚可读': '14 chính tinh an cung đầy đủ, tương quan chính tinh dễ đọc',
  '辅星与煞星同屏呈现，避免关键信息缺失': 'Phụ tinh và sát tinh hiển thị cùng màn — không sót thông tin then chốt',
  '庙旺利陷亮度分级，快速识别强弱': 'Phân cấp độ sáng miếu vượng lợi hãm — nhận biết mạnh yếu tức thì',
  '点击任意主星即可查看倪海厦老师对该星的详细解读': 'Nhấn vào bất kỳ chính tinh nào để xem thầy Ni Hải Hạ luận giải chi tiết về sao đó',
  'AI 解读': 'AI luận giải',
  '深度解盘\n不止于算': 'Luận giải chuyên sâu\nKhông chỉ là dự đoán',
  '倪海厦体系知识库 × Claude AI': 'Kho tri thức hệ Ni Hải Hạ × Claude AI',
  '命格分析：从命宫主星出发，结合三方四正，给出全面的性格与人生格局判断':
    'Phân tích mệnh cách: từ chính tinh cung Mệnh, kết hợp tam phương tứ chính, cho đánh giá toàn diện về tính cách và cục diện đời bạn',
  '六大维度解读：事业方向、感情婚姻、财运模式、健康注意、家庭关系、子女缘分':
    'Luận giải 6 chiều: hướng sự nghiệp, tình duyên hôn nhân, mô thức tài vận, lưu ý sức khỏe, quan hệ gia đình, duyên con cái',
  '大限流年追踪：当前10年大限重点、今年流年宫位的具体提示与行动建议':
    'Theo dõi đại hạn – lưu niên: trọng tâm đại hạn 10 năm hiện tại, gợi ý cụ thể từ cung lưu niên năm nay kèm khuyến nghị hành động',
  '自由追问：针对你的命盘直接提问，「今年能换工作吗」「什么时候结婚运最好」':
    'Hỏi tự do: hỏi thẳng về lá số của bạn — "Năm nay đổi việc được không?", "Bao giờ vận hôn nhân đẹp nhất?"',
  '自动检测\n命盘格局': 'Tự động phát hiện\ncách cục lá số',
  '从星曜组合中发现你的命中注定': 'Tìm ra chữ "duyên" của bạn từ tổ hợp tinh diệu',
  '自动识别11种经典格局：紫府同宫、杀破狼格、机月同梁、廉相格、武曲七杀等':
    'Tự động nhận diện 11 cách cục kinh điển: Tử Phủ đồng cung, Sát Phá Lang, Cơ Nguyệt Đồng Lương, Liêm Tướng, Vũ Khúc Thất Sát…',
  '辅弼夹命、日月夹命等特殊格局精准检测，并给出倪海厦体系下的标准解读':
    'Nhận diện chính xác các cách cục đặc biệt như Phụ Bật giáp Mệnh, Nhật Nguyệt giáp Mệnh — kèm luận giải chuẩn theo hệ Ni Hải Hạ',
  '四化入命宫迁移宫的特殊状况自动标注，提示需关注的人生议题':
    'Tự động đánh dấu tứ hóa nhập cung Mệnh / Thiên Di — nhắc các vấn đề đời sống cần lưu tâm',
  '格局按吉凶等级分层展示，让你一目了然自己命盘中的优势与挑战':
    'Cách cục xếp tầng theo mức cát – hung — thấy ngay thế mạnh và thách thức trong lá số',

  // ── SECTIONS (4板块时间轴) ──
  '天纪': 'Thiên Kỷ',
  '地纪': 'Địa Kỷ',
  '人纪': 'Nhân Kỷ',
  '14 主星 · 13 宫位 · AI 解读': '14 chính tinh · 13 cung · AI luận giải',
  '紫微 · 周易 · 奇门遁甲': 'Tử Vi · Chu Dịch · Kỳ Môn Độn Giáp',
  '倪师未竟之业 · 后辈补注': 'Cơ nghiệp dở dang của Ni sư · hậu bối chú bổ',
  '内经 · 伤寒 · 金匮 · 针灸': 'Nội Kinh · Thương Hàn · Kim Quỹ · Châm Cứu',
  '5 月': 'Tháng 5',
  '6 月': 'Tháng 6',
  '7 月': 'Tháng 7',
  '遗稿研读': 'Nghiên cứu di cảo',

  // ── NI_TEACHINGS (4教义) ──
  '命宫为本，三方为用': 'Lấy cung Mệnh làm gốc, tam phương làm dụng',
  '倪师始终强调，看命必先看命宫。命宫主星决定一个人的基本格局与天生性格，三方（财帛、官禄、迁移）则决定此人的「用武之地」。四宫联动才是完整的人生图景。':
    'Ni sư luôn nhấn mạnh: xem mệnh phải xem cung Mệnh trước tiên. Chính tinh cung Mệnh quyết định cục diện cơ bản và thiên tính của một người; tam phương (Tài Bạch, Quan Lộc, Thiên Di) quyết định "đất dụng võ" của người đó. Bốn cung tương tác mới tạo nên bức tranh đời người trọn vẹn.',
  '对宫借星，不可忽视': 'Mượn sao cung đối — đừng bỏ qua',
  '倪师的独到之处在于重视「对宫」。任何宫位若为空宫，必须借对宫星曜来论断，命宫的对面是迁移宫，两者互相影响，这是很多初学者容易忽略的关键。':
    'Điểm độc đáo của Ni sư là rất coi trọng "cung đối". Cung nào vô chính tinh bắt buộc phải mượn sao cung đối diện để luận: cung đối của Mệnh là Thiên Di, hai cung ảnh hưởng lẫn nhau — điều người mới học dễ bỏ qua.',
  '四化才是命运的手': 'Tứ hóa mới là bàn tay của vận mệnh',
  '星曜只是基础，四化（化禄、化权、化科、化忌）才是决定运势好坏的关键。同一颗星，有化禄与有化忌，人生轨迹可以截然不同。倪师反复强调：不看四化，命盘只解了一半。':
    'Tinh diệu chỉ là nền; tứ hóa (Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ) mới là then chốt quyết định vận tốt xấu. Cùng một sao, gặp Hóa Lộc hay Hóa Kỵ, quỹ đạo đời người có thể khác biệt một trời một vực. Ni sư lặp đi lặp lại: không xem tứ hóa thì lá số mới giải được một nửa.',
  '大限十年，运势有节': 'Đại hạn 10 năm — vận có nhịp',
  '倪师将人生划分为12个大限，每个大限10年。他认为人在不同的大限宫位，际遇完全不同。了解自己现在走的是哪个大限、该宫位有何星曜，才能真正把握当下的运势。':
    'Ni sư chia đời người thành 12 đại hạn, mỗi hạn 10 năm. Ở đại hạn khác nhau, cung vận khác nhau thì cảnh ngộ hoàn toàn khác. Hiểu mình đang đi qua đại hạn nào, cung ấy an sao gì, mới thực sự nắm được vận hiện tại.',

  // ── SIHUA_BRIEF (key 化禄… là THUAT NGU → biTerm; chi attr/brief vao day) ──
  '吉化·增益': 'Cát hóa · tăng ích',
  '福星到宫，主财运与福气增益。所在宫位事物顺遂，能力增强，是命盘中最受欢迎的化星。':
    'Phúc tinh đến cung, chủ tài lộc và phúc khí tăng thêm. Cung ấy mọi việc hanh thông, năng lực được bồi đắp — hóa tinh được đón nhận nhất trên lá số.',
  '吉化·权威': 'Cát hóa · uy quyền',
  '权力星到宫，主掌控与领导力。所在宫位主强势与决断，喜入官禄宫与命宫，主事业上的实权。':
    'Quyền tinh đến cung, chủ nắm giữ và dẫn dắt. Cung ấy thêm phần mạnh tay và quyết đoán; ưa nhập cung Quan Lộc và cung Mệnh — thực quyền trong sự nghiệp.',
  '吉化·名誉': 'Cát hóa · danh vọng',
  '科名星到宫，主声誉与贵人缘。所在宫位主文名与考运，有贵人扶持，宜学术、考试与公开场合。':
    'Khoa danh tinh đến cung, chủ tiếng tăm và quý nhân. Cung ấy nổi về văn danh và thi vận, có quý nhân nâng đỡ — hợp học thuật, thi cử và nơi công cộng.',
  '凶化·阻碍': 'Hung hóa · trở ngại',
  '劫数星到宫，主执念与阻碍。所在宫位需特别关注，该宫人生课题将成为重要考验。':
    'Kiếp số tinh đến cung, chủ chấp niệm và trở ngại. Cung này cần đặc biệt lưu tâm — bài học đời người tại đó sẽ là thử thách lớn.',

  // ── STAR_BRIEF attr (14) ──
  '土·帝王星': 'Thổ · Đế tinh',
  '木·智慧星': 'Mộc · Sao Trí tuệ',
  '火·官禄主': 'Hỏa · Chủ Quan Lộc',
  '金·财帛主': 'Kim · Chủ Tài Bạch',
  '水·福星': 'Thủy · Phúc tinh',
  '火·才艺星': 'Hỏa · Sao Tài nghệ',
  '土·财库星': 'Thổ · Sao Tài khố',
  '水·田宅主': 'Thủy · Chủ Điền Trạch',
  '木水·桃花': 'Mộc Thủy · Đào hoa',
  '水·是非星': 'Thủy · Sao Thị phi',
  '水·印星': 'Thủy · Ấn tinh',
  '土·荫星': 'Thổ · Ẩm tinh',
  '金火·将星': 'Kim Hỏa · Tướng tinh',
  '水·耗星': 'Thủy · Hao tinh',

  // ── STAR_BRIEF brief (14) ──
  '天皇贵星，统御众星。坐命者有孤傲之气，主权威显达，天生具备领导气质，适合独当一面的领导岗位。':
    'Thiên hoàng quý tinh, thống soái quần sao. Người tọa Mệnh mang khí cô ngạo, chủ quyền uy hiển đạt, thiên phú khí chất lãnh đạo — đủ sức gánh vác một phương.',
  '益寿星，主智谋与变动。聪慧机灵，善于筹谋，心思细腻，宜从事策划、顾问、技术类工作。':
    'Ích thọ tinh, chủ trí mưu và biến động. Thông minh linh lợi, giỏi mưu tính, lòng dạ tinh tế — hợp công việc hoạch định, tư vấn, kỹ thuật.',
  '官禄主星，主声誉与名望。慷慨大度，重视公众形象，利官场与公职，男命力强，入庙时光明磊落。':
    'Quan lộc chủ tinh, chủ tiếng tăm và danh vọng. Khảng khái đại độ, coi trọng hình ảnh công chúng, lợi đường quan chức; nam mệnh lực mạnh, nhập miếu thì quang minh lỗi lạc.',
  '财帛主星，主财务与决断。意志坚定，行动果敢，适合财务、金融、军警类职业，孤克之星，利晚婚。':
    'Tài bạch chủ tinh, chủ tài vụ và quyết đoán. Ý chí kiên định, hành động quả cảm, hợp nghề tài chính, ngân hàng, quân cảnh; sao cô khắc — hợp cưới muộn.',
  '福德主星，主享乐与人缘。性情温和，人缘极好，注重生活品质，感情细腻，晚年运势佳。':
    'Phúc đức chủ tinh, chủ hưởng lạc và nhân duyên. Tính tình ôn hòa, được lòng người, coi trọng chất lượng sống, tình cảm tinh tế — vận muộn màng đẹp.',
  '次桃花星，主才艺与情欲。才华出众，感情丰富，适合艺术、政界，多才多艺但需防桃花是非。':
    'Thứ đào hoa tinh, chủ tài nghệ và tình dục (tình cảm). Tài hoa vượt trội, tình cảm phong phú, hợp nghệ thuật và chính trường; đa tài nhưng cần phòng thị phi đào hoa.',
  '南斗主星，主财库与积蓄。稳重保守，理财能力强，是命盘的稳定力量，适合管理财务与行政。':
    'Nam đẩu chủ tinh, chủ tài khố và dành dụm. Trầm ổn bảo thủ, giỏi quản tài — sức giữ cân bằng của lá số, hợp quản lý tài chính và hành chính.',
  '田宅主星，主财富与阴柔。细腻温柔，感受力强，女命尤佳，利不动产与积蓄，适合文艺或服务业。':
    'Điền trạch chủ tinh, chủ tài phú và nhu mì. Tế nhị ôn nhu, cảm thụ tốt; nữ mệnh càng đẹp — lợi bất động sản và tích lũy, hợp văn nghệ hoặc dịch vụ.',
  '桃花星，主欲望与才艺。多才多艺，欲望旺盛，社交活跃，宜从事艺术、公关、商业，人缘极好。':
    'Đào hoa tinh, chủ dục vọng và tài nghệ. Đa tài đa nghệ, khao khát mạnh mẽ, giao tiếp sôi nổi — hợp nghệ thuật, đối ngoại, kinh doanh; nhân duyên rất tốt.',
  '暗星，主口才与是非。口才出众，思辨能力强，适合律师、教育、媒体，注意口舌是非，以辩才立身。':
    'Ám tinh, chủ khẩu tài và thị phi. Ăn nói xuất chúng, tư biện sắc bén — hợp luật sư, giáo dục, truyền thông; cần giữ miệng kẻo thị phi, lấy tài biện luận làm gốc.',
  '印星，主辅佐与印绶。善于协调，重视礼节，正直守法，适合幕僚、行政、法律类工作，贵人运佳。':
    'Ấn tinh, chủ phù tá và ấn thụ. Giỏi điều phối, trọng lễ nghĩa, chính trực thủ pháp — hợp tham mưu, hành chính, pháp lý; vận quý nhân tốt.',
  '荫星，主老成与荫蔽。正直稳重，慈悲心强，老天爷会保佑，适合医疗、社会工作、宗教领域。':
    'Ẩm tinh, chủ chững chạc và che chở. Chính trực trầm ổn, giàu lòng từ bi — như có trời phù hộ; hợp y tế, công tác xã hội, tôn giáo.',
  '将星，主刚烈与开创。性格刚毅，行动力强，勇于挑战，适合创业、军警、竞争性行业，逢凶化吉。':
    'Tướng tinh, chủ cương liệt và khai sáng. Tính tình cương nghị, hành động mạnh, dám đương đầu — hợp khởi nghiệp, quân cảnh, ngành cạnh tranh; gặp dữ hóa lành.',
  '耗星，主变动与开拓。勇于突破，不惧改变，一生变动大但有魄力，适合开拓型工作，走别人没走过的路。':
    'Hao tinh, chủ biến động và khai phá. Dám phá vỡ, không sợ đổi thay; đời nhiều biến động nhưng có khí phách — hợp công việc mở đường, đi con đường chưa ai đi.',

  // ── FeatureVisual (ô trang trí trong 4 tính năng) ──
  '倪海厦排盘法': 'Phép lập lá số Ni Hải Hạ',
  '紫微系': 'Hệ Tử Vi',
  '天府系': 'Hệ Thiên Phủ',
  '四化飞星': 'Tứ hóa phi tinh',
  '我今年的事业运势如何？': 'Năm nay vận sự nghiệp của tôi thế nào?',
  '命宫天机化禄，今年大限走官禄宫，三方有左辅相助，事业有贵人提携，适合主动拓展…':
    'Cung Mệnh có Thiên Cơ Hóa Lộc; đại hạn năm nay đi qua cung Quan Lộc, tam phương có Tả Phụ phù trợ — sự nghiệp được quý nhân nâng đỡ, thích hợp chủ động mở mang…',
  '什么时候感情运最好？': 'Khi nào vận tình cảm đẹp nhất?',
  '杀破狼格': 'Cách Sát Phá Lang',
  '开创进取之命': 'Mệnh khai sáng, tiến thủ',
  '廉相格': 'Cách Liêm Tướng',
  '行政印绶之格': 'Cách hành chính, ấn thụ',
  '化忌入命': 'Hóa Kỵ nhập Mệnh',
  '需关注心理课题': 'Cần lưu ý bài học tâm lý',
  '自动识别 11 种经典格局': 'Tự động nhận diện 11 cách cục kinh điển',

  // ── nav + hero + sticky note ──
  '紫微命盘': 'Lá số Tử Vi',
  '合盘': 'Hợp bàn',
  '立即起盘': 'Lập lá số ngay',
  '紫微斗数 · 倪海厦体系': 'Tử Vi đẩu số · hệ Ni Hải Hạ',
  '紫微为门 · 天地人为路 · 倪海厦为师': 'Lấy Tử Vi làm cửa · Thiên Địa Nhân làm đường · Lấy Ni Hải Hạ làm thầy',
  'AI 答疑 · 知行合一': 'AI giải đáp · Biết đi đôi với làm',
  '输入出生年月日时，生成专属紫微斗数命盘 — 后续天纪、地纪、人纪学习模块陆续开放。':
    'Nhập ngày giờ sinh để lập lá số Tử Vi riêng của bạn — các module Thiên Kỷ, Địa Kỷ, Nhân Kỷ sẽ lần lượt mở sau.',
  '限时回馈': 'Ưu đãi có thời hạn',
  '全部功能 + AI 提问': 'Toàn bộ tính năng + hỏi AI',
  '全部功能 + AI': 'Toàn bộ tính năng + AI',
  '全免费': 'Miễn phí hoàn toàn',
  '探索更多': 'Khám phá thêm',

  // ── triết lý (mệnh · vận · quan) ──
  '命 · 运 · 观': 'Mệnh · Vận · Quan',
  '提前窥探命运的意义': 'Ý nghĩa của việc nhìn trước vận mệnh',
  '不在于预知未来': 'không phải để biết trước tương lai,',
  '而在于不断认识自己': 'mà là để không ngừng hiểu chính mình —',
  '最终书写属于自己的人生剧本': 'rốt cuộc tự viết kịch bản đời mình',

  // ── curriculum header ──
  '倪师方法论 · 渐次展开': 'Phương pháp Ni sư — mở dần theo bậc',
  '从紫微入门，逐步开放天纪 / 地纪 / 人纪学习模块': 'Vào cửa từ Tử Vi, lần lượt mở các module Thiên Kỷ / Địa Kỷ / Nhân Kỷ',

  // ── Thiên · Địa · Nhân (glyph '地' là thuật ngữ → biTerm) ──
  '天 · 地 · 人': 'Thiên · Địa · Nhân',
  '倪海厦老师的核心命运观：命运从来不是人生的全部。':
    'Quan niệm cốt lõi của thầy Ni Hải Hạ về mệnh số: vận mệnh chưa bao giờ là tất cả đời người.',
  '他将影响人生的力量分为三个同等重要的维度。': 'Thầy chia những sức mạnh chi phối đời người thành ba chiều quan trọng như nhau.',
  '天': 'Thiên',
  '人': 'Nhân',
  '先天命运': 'Thiên mệnh bẩm sinh',
  '地理环境': 'Địa lý – môi trường',
  '人心意念': 'Tâm ý con người',
  '紫微斗数所揭示的，是一个人的先天命盘格局——出生时间决定的星曜布局、五行局数、命宫主星。这只是命运的三分之一，是人生的底色，而非全貌。':
    'Điều Tử Vi đẩu số hé lộ là cục diện lá số bẩm sinh — bố cục tinh diệu, cục ngũ hành, chính tinh cung Mệnh do giờ sinh định đoạt. Đó chỉ là một phần ba vận mệnh: gam màu nền của cuộc đời, không phải toàn cảnh.',
  '你所在的地理环境、城市、国家、风水格局，乃至家庭背景与社会结构，共同构成了命运的第二个维度。同一命盘，生在不同地方，际遇可以天壤之别。':
    'Môi trường địa lý bạn sống — thành phố, đất nước, thế phong thủy, cùng hoàn cảnh gia đình và cấu trúc xã hội — hợp thành chiều thứ hai của vận mệnh. Cùng một lá số, sinh ở nơi khác, cảnh ngộ khác nhau một trời một vực.',
  '个人的意志、心态、选择与行动，才是改变命运最主动的力量。倪师强调：了解命盘是为了更好地做人，而不是坐等命运安排。精进自己，是最强的破局之道。':
    'Ý chí, tâm thế, lựa chọn và hành động của mỗi người mới là lực lượng chủ động nhất để đổi vận. Ni sư nhấn mạnh: hiểu lá số để sống đẹp hơn, không phải khoanh tay chờ số xếp đặt. Không ngừng trau dồi mình chính là cách phá cục mạnh nhất.',
  '命盘 · 星曜 · 五行': 'Lá số · Tinh diệu · Ngũ hành',
  '地域 · 风水 · 环境': 'Địa vực · Phong thủy · Môi trường',
  '意志 · 选择 · 行动': 'Ý chí · Lựa chọn · Hành động',
  '「命运不是人生的全部，加上地理位置和人念，才是。」':
    '"Vận mệnh không phải tất cả đời người; phải cộng thêm vị trí địa lý và tâm niệm con người mới thành đủ."',
  '— 倪海厦': '— Ni Hải Hạ',

  // ── giới thiệu thầy Ni Hải Hạ ──
  '倪海厦老师': 'Thầy Ni Hải Hạ',
  '当代华人圈最具影响力的中医与术数大家之一': 'Một trong những bậc thầy Đông y và thuật số ảnh hưởng nhất trong cộng đồng Hoa ngữ đương đại',
  '美国汉唐中医学院创办人 ·「人纪」「天纪」两大教学体系传世':
    'Người sáng lập Học viện Đông y Hán Đường (Mỹ) · hai hệ giáo trình "Nhân Kỷ" và "Thiên Kỷ" truyền đời',
  '生于': 'Sinh',
  '1954年': '1954',
  '台湾': 'Đài Loan',
  '离世': 'Mất',
  '2012年': '2012',
  '1月31日 · 享年58': 'ngày 31/1 · thọ 58',
  '传承': 'Truyền thừa',
  '经方中医 · 易经': 'Đông y kinh phương · Dịch kinh',
  '生平履历': 'Tiểu sử',
  '：\n倪海厦先生（1954–2012）出生于台湾，早年师承多位中医名家，专研经方派（《伤寒论》传承）。\n中年赴美行医，在美国创立':
    ': Ông Ni Hải Hạ (1954–2012) sinh tại Đài Loan, thuở nhỏ theo học nhiều danh y Đông y, chuyên nghiên cứu kinh phương phái (truyền thừa Thương Hàn Luận). Trung niên sang Mỹ hành nghề và sáng lập tại đây',
  '汉唐中医学院': 'Học viện Đông y Hán Đường',
  '，二十余年间系统传授中医与传统术数。\n2012 年 1 月 31 日因肝癌在台湾离世，享年 58 岁。':
    '; hơn hai mươi năm truyền dạy có hệ thống Đông y và thuật số truyền thống. Ông mất vì ung thư gan tại Đài Loan ngày 31/1/2012, thọ 58 tuổi.',
  '教学体系': 'Hệ thống giáo trình',
  '：\n倪师将毕生所学整理为两大公开教学系列。':
    ': Ni sư dồn hết sở học cả đời vào hai bộ giáo trình công khai.',
  '「人纪」': '"Nhân Kỷ"',
  '涵盖《针灸大成》《神农本草经》《黄帝内经》《伤寒论》《金匮要略》——\n这是「人之纪」，奠定中医学习的完整路径；':
    'gồm Châm Cứu Đại Thành, Thần Nông Bản Thảo Kinh, Hoàng Đế Nội Kinh, Thương Hàn Luận, Kim Quỹ Yếu Lược — đó là "Kỷ của Người", con đường hoàn chỉnh để học Đông y;',
  '「天纪」': '"Thiên Kỷ"',
  '涵盖紫微斗数与《易经》——这是「天之纪」，是术数研究的体系化成果。\n两者相合，是倪师留给后世最完整的传承。':
    'gồm Tử Vi đẩu số và Dịch Kinh — đó là "Kỷ của Trời", thành quả hệ thống hóa nghiên cứu thuật số. Hai bộ hợp lại là di sản truyền thừa trọn vẹn nhất Ni sư để lại cho đời sau.',
  '紫微立场': 'Lập trường về Tử Vi',
  '：\n倪师在紫微斗数上明确属': ': về Tử Vi đẩu số, Ni sư rõ ràng thuộc',
  '南派三合派': 'nam phái Tam Hợp',
  '，主张「以命宫为本、以三方四正为用、以四化为纲」。\n他在《天纪》课程中明言：「':
    ', chủ trương "lấy cung Mệnh làm gốc, tam phương tứ chính làm dụng, tứ hóa làm cương lĩnh". Trong bài giảng Thiên Kỷ, ông nói rõ: "',
  '飞星（四化）飞来飞去太复杂，不搞这个，毕竟大道至简':
    'Phi tinh (tứ hóa) bay qua bay lại quá rối rắm, tôi không dùng cách đó — đạo lớn vốn chí giản',
  '」——\n这一立场将其与繁琐的飞星派清晰区分。':
    '" — lập trường ấy phân định rạch ròi ông với phi tinh phái phiền toái.',
  '治学态度': 'Thái độ trị học',
  '：\n倪师反对死记硬背口诀，强调「理解原理胜过背诵」「逻辑可复核胜过神秘玄学」。\n这种态度让紫微斗数从师徒密传的封闭体系，走向系统化、可验证、可学习的现代知识体系。':
    ': Ni sư phản đối học thuộc lòng khẩu quyết, nhấn mạnh "hiểu nguyên lý hơn tụng đọc" và "logic kiểm chứng được hơn huyền học mù mờ". Thái độ ấy đưa Tử Vi đẩu số từ vòng kínthầy truyền trò bí truyền, mở ra thành một hệ tri thức hiện đại có hệ thống, kiểm chứng và học được.',
  '当代影响': 'Ảnh hưởng đương đại',
  '：\n倪师的讲课视频在 B 站、YouTube 与各大平台广泛流传，是新一代命理与中医爱好者公认的入门必修。\n他不仅是紫微斗数的传承者，更是把传统命理与中医带入现代知识体系的关键人物之一。':
    ': Video bài giảng của Ni sư được lan truyền rộng rãi trên các nền tảng video và YouTube, được thế hệ người mê mệnh lý và Đông y coi là khóa nhập môn bắt buộc. Ông không chỉ là người truyền thừa Tử Vi đẩu số mà còn là một trong những nhân vật đưa mệnh lý và Đông y truyền thống vào hệ tri thức hiện đại.',
  '本平台所有解读基于倪师《天纪》公开教学讲义、《紫微斗数全书》明版、传统三合派古籍整理而成，\n仅作文化与个人成长参考。倪师本人与本平台无任何商业关联。':
    'Mọi luận giải trên nền tảng này được biên soạn từ giáo trình Thiên Kỷ công khai của Ni sư, bản in đời Minh của "Tử Vi Đẩu Số Toàn Thư" và cổ thư Tam Hợp phái truyền thống, chỉ dùng làm tham khảo về văn hóa và phát triển bản thân. Bản thân Ni sư không có bất kỳ liên hệ thương mại nào với nền tảng này.',

  // ── 合盘入口 ──
  '紫微合盘': 'Tử Vi hợp bàn',
  '输入两个人的出生信息，AI 基于倪海厦体系分析夫妻宫互参、命宫兼容性与三方四正交互，':
    'Nhập thông tin của hai người; AI theo hệ Ni Hải Hạ phân tích cung Phu Thê tương tham, độ hợp cung Mệnh và tương tác tam phương tứ chính,',
  '给出感情匹配度、合伙可行性与最佳相处建议。': 'rồi cho biết độ hợp tình cảm, khả năng hùn hạp và gợi ý chung sống tốt nhất.',
  '感情匹配度分析': 'Phân tích độ hợp tình cảm',
  '合伙创业评估': 'Đánh giá hùn hạp khởi nghiệp',
  '亲子缘分解读': 'Luận duyên cha mẹ – con cái',
  '婚前相性评估': 'Đánh giá hợp tính cách trước hôn nhân',
  '开始合盘分析': 'Bắt đầu phân tích hợp bàn',

  // ── CTA cuối trang + footer ──
  '开始你的命盘之旅': 'Bắt đầu hành trình lá số của bạn',
  '你的紫微命盘': 'Lá số Tử Vi của bạn',
  '等你解读': 'đang chờ bạn luận giải',
  '输入出生年月日时，在几秒内生成你的专属命盘': 'Nhập ngày giờ sinh — lá số riêng của bạn hiện ra trong vài giây',
  '再由 AI 按倪海厦体系为你深度解读': 'rồi AI theo hệ Ni Hải Hạ luận giải chiều sâu cho bạn',
  '免费起盘': 'Lập lá số miễn phí',
  '✦ 紫微斗数知识库 →': '✦ Kho tri thức Tử Vi đẩu số →',
  '📜 古籍原典库 →': '📜 Kho cổ thư nguyên bản →',
  '倪师方法论 · 学术体系': 'Phương pháp Ni sư · hệ học thuật',
  '✓ 已上线': '✓ Đã ra mắt',
  '紫微命盘 · 基于倪海厦正宗体系 · 仅供参考，命运掌握在自己手中':
    'Lá số Tử Vi · theo chính truyền Ni Hải Hạ · chỉ mang tính tham khảo — vận mệnh nằm trong tay bạn',
  '本平台基于中国传统文化研究，仅提供学习参考。':
    'Nền tảng phục vụ nghiên cứu văn hóa truyền thống, chỉ cung cấp tài liệu tham khảo học tập.',
  '不构成任何医疗、投资、法律或重大决策建议。':
    'Không cấu thành khuyến nghị y khoa, đầu tư, pháp lý hay quyết định hệ trọng nào.',
  '服务条款': 'Điều khoản dịch vụ',
  '隐私政策': 'Chính sách bảo mật',

  // ══ app/knowledge/* (task c2) — trang kien thuc ═════════════════════
  // R30: van trang → TIENG VIET THAY THE CHU HAN qua biText(...).vi; chuoi noi suy
  // → UI_FMT_VI + biFmt (placeholder CO TEN). Metadata/JSON-LD SEO GIU NGUYEN Hán
  // (dua theo phan quyet commit e0e2140) → mien EXCLUDE/TEMPLATE_OK trong ratchet.
  // Ten sao/cung du lieu → biTerm(...).vi (bang thuat ngu, R12 cam trung key UI_VI).

  // ── dieu huong (2 page dung chung) ──
  '← 首页': '← Trang chủ',
  '首页': 'Trang chủ',
  '知识库': 'Kho tri thức',
  '倪师方法论 · 知识库': 'Phương pháp Ni sư · Kho tri thức',
  '古籍 →': 'Kho cổ thư →',
  '起盘 →': 'Lập lá số →',
  '立即起盘 →': 'Lập lá số ngay →',

  // ── app/knowledge/page.tsx — hero + danh sach ──
  '紫微斗数知识库': 'Kho tri thức Tử Vi đẩu số',
  '14 主星 × 13 宫位 =': '14 chính tinh × 13 cung =',
  '项专题': 'chuyên đề',
  '基于倪海厦《天纪》体系编纂 · 含古籍引证': 'Biên soạn theo hệ Thiên Kỷ của thầy Ni Hải Hạ · kèm dẫn chứng cổ thư',
  '十四主星': '14 Chính tinh',

  // ── TOPIC_LABEL (lib/ziwei/db-analysis.ts:34, du lieu — khong sua file data;
  //    trang goi biText(TOPIC_LABEL[t]).vi luc render). '命格总览'/'性格特质' da co o tren. ──
  '感情婚姻': 'Tình cảm hôn nhân',
  '事业职业': 'Sự nghiệp nghề nghiệp',
  '财富运势': 'Tài vận',
  '健康状况': 'Tình trạng sức khỏe',
  '兄弟合伙': 'Anh em hợp tác',
  '子女缘分': 'Duyên con cái',
  '迁移外出': 'Di chuyển xuất ngoại',
  '人际贵人': 'Quý nhân giao tế',
  '田宅不动产': 'Điền trạch – bất động sản',
  '精神福德': 'Tinh thần phúc đức',
  '父母长辈': 'Cha mẹ bề trên',

  // ── app/knowledge/[star]/[topic]/page.tsx — nhan 4 doan luan + CTA + footer ──
  '一句话定调': 'Định luận một câu',
  '核心论断': 'Luận đoạn cốt lõi',
  '命盘依据': 'Căn cứ trên lá số',
  '经典出处': 'Xuất xứ kinh điển',
  '输入生辰起盘 · 倪师正宗解读 · AI 答疑伴学': 'Nhập ngày giờ sinh để lập lá số · chính truyền Ni Hải Hạ luận giải · AI giải đáp đồng hành',
  '想读原典？': 'Muốn đọc nguyên bản?',
  '📜 查阅古籍原典库 — 紫微斗数全集 / 全书 / 骨髓赋 →':
    '📜 Vào kho cổ thư nguyên bản — Tử Vi Đẩu Số Toàn Tập / Toàn Thư / Cốt Tủy Phú →',
  '紫微研究 · 基于倪海厦正宗体系 · 仅供学习参考':
    'Nghiên cứu Tử Vi · theo chính truyền Ni Hải Hạ · chỉ dùng để tham khảo học tập',
  '本平台不构成任何医疗、投资、法律或重大决策建议':
    'Nền tảng này không cấu thành bất kỳ khuyến nghị y khoa, đầu tư, pháp lý hay quyết định hệ trọng nào',

  // ── STAR_BRIEF_SEO (lib/seo/knowledge.ts:147, du lieu — khong sua file data;
  //    trang goi biText(STAR_BRIEF_SEO[star] || '').vi luc render). ──
  '紫微为帝星，主尊贵，化气为尊。落命主有领导气场、宜大平台高位。':
    'Tử Vi là Đế tinh, chủ tôn quý, hóa khí là tôn. Người tọa Mệnh có khí chất lãnh đạo, hợp vị trí cao trên nền tảng lớn.',
  '天机为智慧星，主善变机灵，化气为善。落命主聪明机变、宜辅佐策划。':
    'Thiên Cơ là sao Trí tuệ, chủ linh lợi biết biến hóa, hóa khí là thiện. Người tọa Mệnh thông minh cơ biến, hợp phụ tá, hoạch định.',
  '太阳为男贵星，主名誉公务，化气为贵。落命主光明磊落、宜公职名声。':
    'Thái Dương là quý tinh của nam, chủ danh dự công vụ, hóa khí là quý. Người tọa Mệnh quang minh lỗi lạc, hợp công chức và tiếng tăm.',
  '武曲为财星，主刚毅果决，化气为财。落命主理财能力强、宜实业金融。':
    'Vũ Khúc là sao Tài, chủ cương nghị quả quyết, hóa khí là tài. Người tọa Mệnh giỏi quản tài, hợp thực nghiệp và tài chính.',
  '天同为福星，主温和享乐，化气为福。落命主性情温和、有福气。':
    'Thiên Đồng là Phúc tinh, chủ ôn hòa hưởng lạc, hóa khí là phúc. Người tọa Mệnh tính tình ôn hòa, có phúc khí.',
  '廉贞为次桃花星，文武兼备，化气为囚。落命主多才多艺、感情丰富。':
    'Liêm Trinh là thứ đào hoa tinh, văn võ song toàn, hóa khí là tù. Người tọa Mệnh đa tài đa nghệ, tình cảm phong phú.',
  '天府为南帝守财星，主稳重保守，化气为令。落命主品行端正、善守财库。':
    'Thiên Phủ là Nam Đế thủ tài tinh, chủ trầm ổn bảo thủ, hóa khí là lệnh. Người tọa Mệnh phẩm hạnh đoan chính, giỏi giữ tài khố.',
  '太阴为月亮富贵星，主田宅富贵，化气为富。落命主感情细腻、女命最吉。':
    'Thái Âm là phú quý tinh của mặt trăng, chủ điền trạch phú quý, hóa khí là phú. Người tọa Mệnh tình cảm tế nhị, nữ mệnh đại cát.',
  '贪狼为桃花欲望星，多才多社交，化气为桃花。落命主多才艺、社交广。':
    'Tham Lang là đào hoa dục vọng tinh, đa tài hay giao tế, hóa khí là đào hoa. Người tọa Mệnh nhiều tài nghệ, giao thiệp rộng.',
  '巨门为是非口才星，主辩论传媒，化气为暗。落命主口才好、宜律师教师。':
    'Cự Môn là sao thị phi khẩu tài, chủ biện luận truyền thông, hóa khí là ám. Người tọa Mệnh ăn nói giỏi, hợp luật sư và giáo viên.',
  '天相为印星辅佐，主忠厚老实，化气为印。落命主品行端正、宜行政法务。':
    'Thiên Tướng là Ấn tinh phụ tá, chủ trung hậu thật thà, hóa khí là ấn. Người tọa Mệnh phẩm hạnh đoan chính, hợp hành chính và pháp vụ.',
  '天梁为老人星荫星，善逢凶化吉，化气为荫。落命主慈悲善良、宜法律医学。':
    'Thiên Lương là Lão nhân tinh / Ẩm tinh, giỏi gặp dữ hóa lành, hóa khí là ẩm. Người tọa Mệnh từ bi lương thiện, hợp pháp luật và y khoa.',
  '七杀为将星，主孤独果决冒险，化气为肃杀。落命主刚毅果决、宜军警创业。':
    'Thất Sát là Tướng tinh, chủ cô độc quả quyết mạo hiểm, hóa khí là túc sát. Người tọa Mệnh cương nghị quả quyết, hợp quân cảnh và khởi nghiệp.',
  '破军为破坏创新星，主六亲缘薄，化气为耗。落命主开创变动、宜技术专长。':
    'Phá Quân là sao phá cũ lập mới, chủ duyên với lục thân mỏng, hóa khí là hao. Người tọa Mệnh khai sáng nhiều biến động, hợp kỹ thuật chuyên môn.',

  // ══ app/library/* (task c3) — chrome cua trang thu vien co thu ═══════
  // R30: nhan/trang tri TIENG VIET THAY THE chuoi Hán qua biText(...).vi (khong dung
  // <Bi mode="text"> — no in kem mot dong Hán). CHUOI NOI SUY → UI_FMT_VI + biFmt.
  // NGOAI LE CO Y THUC (khong them vao bang, mien EXCLUDE/TEMPLATE_OK ben ratchet):
  //  (1) metadata title/description cua 3 page — SEO giu nguyen van (e0e2140);
  //  (2) VAN BAN co tich + ten sach/trieu dai/tac gia/ten chi tu lib/classics/data/*.
  // Day la DATA, khong phai chrome: dich ra thi ban dich am tham tro thanh uy quyen
  // thay the nguyen tac, nen giu nguyen (slot cho chu thich tieng Viet tuong lai =
  // Paragraph.translation, da render san o app/library/[book]/[chapter]/page.tsx).

  // ── dieu huong (dùng chung /library, /library/search, /library/[book], /[chapter]) ──
  '← 返回首页': '← Về trang chủ',
  '← 古籍库': '← Kho cổ thư',
  '古籍库 →': 'Kho cổ thư →',
  '首页 →': 'Trang chủ →',
  '古籍原典库 · CLASSICS': 'Kho cổ thư nguyên bản · CLASSICS',
  '搜索结果': 'Kết quả tìm kiếm',

  // ── app/library/page.tsx — hero, the sach, khoi "ve kho" ──
  '倪师方法论 · 古籍原典库': 'Phương pháp Ni sư · Kho cổ thư nguyên bản',
  '紫微斗数权威古籍全文检索': 'Tìm kiếm toàn văn cổ thư Tử Vi đẩu số',
  '收录': 'Bao gồm',
  '部古籍 · 共': ' bộ cổ thư · tổng cộng',
  '段精华': ' đoạn tinh hoa',
  '进入查阅 →': 'Xem nguyên bản →',
  '关于本库': 'Giới thiệu kho này',
  '所收录古籍均为公版（明代刊本）。':
    'Toàn bộ cổ thư trong kho đều thuộc phạm vi công cộng (bản khắc đời Minh).',
  '内容持续完善，未来将补全《紫微斗数全集》全本与倪海厦《天纪》引证目录。':
    'Nội dung đang tiếp tục được hoàn thiện; sắp tới sẽ bổ sung toàn bản Tử Vi Đẩu Số Toàn Tập và mục lục dẫn chứng Thiên Kỷ của thầy Ni Hải Hạ.',
  '如发现任何错误请联系我们。': 'Nếu phát hiện sai sót, xin liên hệ với chúng tôi.',

  // ── app/library/LibrarySearch.tsx — o tim kiem (client component) ──
  // Vi du tu khoa trong placeholder giu NGUYEN VAN Hán: chung la chuoi goi cho
  // searchClassics (matching tren ngu lieu Hán), dich ra thi goi khong ra ket qua.
  '搜索古籍原文，如：七杀朝斗 / 双禄朝垣 / 化忌':
    'Tìm trong nguyên bản cổ thư, ví dụ: 七杀朝斗 / 双禄朝垣 / 化忌',
  '搜索': 'Tìm',

  // ── app/library/search/page.tsx — trang ket qua + empty state ──
  '搜索关键词': 'Từ khóa tìm kiếm',
  '（空）': '(để trống)',
  '共找到': 'Tìm thấy',
  '条古籍原文匹配': ' đoạn cổ văn khớp',
  '暂未在已收录古籍中找到这个关键词': 'Chưa tìm thấy từ khóa này trong kho cổ thư hiện có.',
  '我们持续补充内容中。可尝试搜索：': 'Chúng tôi đang tiếp tục bổ sung nội dung. Có thể thử tìm:',
  '请输入要搜索的关键词': 'Vui lòng nhập từ khóa cần tìm',

  // ── app/library/[book]/page.tsx — tieu de khoi muc luc ──
  'CHAPTERS · 章节目录': 'CHAPTERS · Mục lục chương',

  // ── app/library/[book]/[chapter]/page.tsx — nhan chu thich + dieu huong chi ──
  '白话': 'Bản dịch',
  '倪师注': 'Chú của Ni sư',
  '← 上一章': '← Chương trước',
  '下一章 →': 'Chương sau →',

  // ── Task c4 — app/heming/page.tsx (trang hop ban /heming) ──
  // Chrome cua page thay Hán bang tieng Viet (R30, biText(...).vi — khong dung
  // <Bi mode="text"> de khoi in kem dong Hán thu hai). '紫微合盘' (:366) và
  // '开始合盘分析' (:374) da co tu muc 合盘入口 cua trang chu — tai su dung.
  // Van ban ket qua (SSE tu /api/heming) va du lieu thuat ngu LA DATA, khong o day.
  '返回': 'Quay lại',                                                // :182 nut ve trang chu
  '合盘分析': 'Phân tích hợp bàn',                                   // :185 nhan tren header
  '感情 · 合伙 · 亲子 · 朋友': 'Tình cảm · Hùn hạp · Cha mẹ – con cái · Bạn bè', // :187
  '输入两个人的出生信息，AI 基于倪海厦体系分析双方命盘的缘分匹配度、感情走向与相处建议':
    'Nhập thông tin ngày sinh của hai người; AI theo hệ Ni Hải Hạ phân tích độ hợp duyên giữa hai lá số, xu hướng tình cảm và gợi ý chung sống.', // :199
  '甲方 — A': 'Bên A — A',                                           // :209 nhan form ben A
  '乙方 — B': 'Bên B — B',                                           // :219 nhan form ben B
  '合盘分析 · HEMING': 'Phân tích hợp bàn · HEMING',                  // :240
  '填好双方出生信息后，点击下方按钮':
    'Sau khi điền xong thông tin ngày sinh của hai người, nhấn nút bên dưới', // :247
  'AI 将基于倪海厦体系深度分析两人缘分匹配度':
    'AI sẽ phân tích sâu độ hợp duyên giữa hai người theo hệ Ni Hải Hạ', // :248
  '正在对比双方命盘…': 'Đang so sánh hai lá số…',                      // :280
  '请先填写双方完整出生信息': 'Vui lòng điền đầy đủ thông tin ngày sinh của cả hai người', // :91 formError
  '开源版不含合盘 AI 分析接口（/api/heming），需要你自己实现后才能用。两人的命盘可以分别到「排盘」页（/chart）查看。':
    'Bản mã nguồn mở không kèm API phân tích hợp bàn AI (/api/heming) — bạn cần tự triển khai thì mới dùng được. Lá số của từng người có thể xem riêng ở trang Lập lá số (/chart).', // :289
  '分析暂时不可用，请重试。': 'Phân tích tạm thời không khả dụng, vui lòng thử lại.', // :290
  '针对此次合盘继续追问': 'Đặt thêm câu hỏi về lần hợp bàn này',        // :299
  '感情匹配度如何？': 'Độ hợp tình cảm ra sao?',                       // :305 nut hoi nhanh
  '适合合伙创业吗？': 'Có phù hợp hùn hạp khởi nghiệp không?',          // :306
  '两人结婚是否合适？': 'Hai người kết hôn có hợp không?',              // :307
  '哪方面最容易产生矛盾？': 'Phương diện nào dễ phát sinh mâu thuẫn nhất?', // :308
  '财运是否互补？': 'Tài vận có bù trừ cho nhau không?',                // :309
  '继续追问，如：哪几年是两人感情关键期？':
    'Đặt thêm câu hỏi, ví dụ: năm nào là giai đoạn then chốt trong tình cảm của hai người?', // :340 placeholder
  '分析中…': 'Đang phân tích…',                                       // :357
  '继续追问': 'Đặt câu hỏi tiếp',                                      // :357

  // ── app/privacy/page.tsx (task c5) — trang phap ly. Key lay NGUYEN VAN source,
  // ke ca dau ： ， 、 （ ） ASCII "..." va dau cach trong `(Alipay / WeChat Pay)`.
  // Ban dich giu dung ket cau 8 muc + danh sach dem cua ban goc, khong them/bot noi dung.
  '隐私政策 · 紫微命盘': 'Chính sách bảo mật · Lá số Tử Vi',           // :4 metadata title
  '紫微命盘隐私政策': 'Chính sách bảo mật của Lá số Tử Vi',            // :5 metadata description
  '返回首页': 'Về trang chủ',                                          // :14, :72 (dung ca 2 trang + /terms)
  '最后更新：2026年4月': 'Cập nhật lần cuối: tháng 4 năm 2026',         // :21
  '1. 我们收集的信息': '1. Thông tin chúng tôi thu thập',               // :23
  '为提供紫微命盘排盘与解读服务，我们可能收集以下信息：':
    'Để cung cấp dịch vụ lập và luận giải lá số Tử Vi, chúng tôi có thể thu thập các thông tin sau:', // :24
  '命盘必要信息': 'Thông tin cần cho lá số',                            // :26
  '：姓名（选填）、出生公历年月日、出生时辰、性别、出生地经度':
    ': họ tên (không bắt buộc), ngày tháng năm sinh dương lịch, canh giờ sinh, giới tính, kinh độ nơi sinh', // :26
  '账号信息（注册后）': 'Thông tin tài khoản (sau khi đăng ký)',         // :27
  '：手机号（用于短信验证与会员服务）': ': số điện thoại (dùng để xác minh qua SMS và chăm sóc hội viên)', // :27
  '交互信息': 'Thông tin tương tác',                                    // :28
  '：你在站内的点击、浏览、命盘历史记录': ': thao tác nhấn, lượt xem và lịch sử lá số của bạn trong trang', // :28
  '反馈信息': 'Thông tin phản hồi',                                      // :29
  '：你对解读内容的"准 / 不准"打分与文字反馈':
    ': điểm "chuẩn / không chuẩn" bạn dành cho nội dung luận giải và phản hồi bằng chữ viết', // :29
  '支付信息': 'Thông tin thanh toán',                                    // :30
  '：购买会员或单项服务时通过第三方支付（支付宝 / 微信支付）处理，本平台不存储完整卡号或密码':
    ': khi mua hội viên hoặc dịch vụ đơn lẻ được xử lý qua nhà cung cấp thanh toán bên thứ ba (Alipay / WeChat Pay); nền tảng này không lưu trữ đầy đủ số thẻ hay mật khẩu', // :30
  '2. 我们如何使用信息': '2. Chúng tôi sử dụng thông tin như thế nào',    // :33
  '命盘信息仅用于本次解读与你账号下的历史命盘记录':
    'Thông tin lá số chỉ dùng cho lần luận giải này và lịch sử lá số trong tài khoản của bạn', // :35
  '手机号用于注册、登录、订单通知': 'Số điện thoại dùng để đăng ký, đăng nhập và thông báo đơn hàng', // :36
  '反馈信息用于持续改进命理内容质量（脱敏后聚合分析）':
    'Thông tin phản hồi dùng để cải thiện liên tục chất lượng nội dung mệnh lý (khử thông tin định danh rồi tổng hợp phân tích)', // :37
  '聚合数据可能用于行业研究与平台优化': 'Dữ liệu tổng hợp có thể dùng cho nghiên cứu ngành và tối ưu nền tảng', // :38
  '3. 信息共享与第三方': '3. Chia sẻ thông tin và bên thứ ba',            // :41
  '除以下情形外，我们不会向第三方共享你的个人信息：':
    'Ngoài các trường hợp sau, chúng tôi không chia sẻ thông tin cá nhân của bạn với bên thứ ba:', // :42
  '支付服务商（支付宝 / 微信支付）：处理订单结算':
    'Nhà cung cấp dịch vụ thanh toán (Alipay / WeChat Pay): xử lý quyết toán đơn hàng', // :44
  '短信服务商（如阿里云短信）：发送验证码':
    'Nhà cung cấp dịch vụ SMS (như Alibaba Cloud SMS): gửi mã xác minh', // :45
  '云服务商（如 Vercel / Cloudflare / 阿里云）：技术承载':
    'Nhà cung cấp dịch vụ đám mây (như Vercel / Cloudflare / Alibaba Cloud): hạ tầng kỹ thuật', // :46
  'AI 解读服务（如 Anthropic Claude）：处理你的"自由追问"对话（已做匿名化）':
    'Dịch vụ luận giải AI (như Anthropic Claude): xử lý các hội thoại "tự do đặt thêm câu hỏi" của bạn (đã được ẩn danh hóa)', // :47
  '司法机关或政府部门基于法律法规的合法要求':
    'Yêu cầu hợp pháp của cơ quan tư pháp hoặc cơ quan nhà nước dựa trên quy định của pháp luật', // :48
  '4. 信息安全': '4. An toàn thông tin',                                // :51
  '我们采取业界常见的技术与管理手段保护你的信息（HTTPS 传输加密、数据库加密存储、访问权限控制等）。但请注意，互联网传输无法保证 100% 安全。':
    'Chúng tôi áp dụng các biện pháp kỹ thuật và quản lý phổ biến trong ngành để bảo vệ thông tin của bạn (mã hóa truyền tải HTTPS, lưu trữ mã hóa cơ sở dữ liệu, kiểm soát quyền truy cập, v.v.). Tuy nhiên xin lưu ý rằng truyền tải trên internet không thể bảo đảm an toàn 100%.', // :52
  '5. 你的权利': '5. Quyền của bạn',                                    // :54
  '查询': 'Tra cứu',                                                    // :56
  '：可通过账号中心查看你的所有历史命盘与订单': ': xem toàn bộ lịch sử lá số và đơn hàng của bạn trong trung tâm tài khoản', // :56
  '删除': 'Xóa',                                                        // :57
  '：联系客服删除账号下指定命盘 / 注销账号': ': liên hệ bộ phận chăm sóc khách hàng để xóa một lá số được chỉ định trong tài khoản / hủy tài khoản', // :57
  '导出': 'Xuất dữ liệu',                                                // :58
  '：可申请导出你的全部个人数据': ': có thể yêu cầu xuất toàn bộ dữ liệu cá nhân của bạn', // :58
  '6. Cookie 与本地存储': '6. Cookie và lưu trữ cục bộ',                 // :61
  '本站使用 cookie / localStorage 用于：保存你的暗黑/亮色主题偏好、最近的命盘历史、会员登录状态。你可在浏览器设置中关闭，但部分功能可能受影响。':
    'Trang này dùng cookie / localStorage để: lưu sở thích giao diện tối/sáng của bạn, lịch sử lá số gần nhất và trạng thái đăng nhập hội viên. Bạn có thể tắt trong cài đặt trình duyệt, nhưng một số chức năng có thể bị ảnh hưởng.', // :62
  '7. 未成年人': '7. Người chưa thành niên',                             // :64
  '本平台命理内容面向 18 岁以上成年用户。未成年人请在监护人同意下使用，并不得将解读用于重大人生决策。':
    'Nội dung mệnh lý của nền tảng dành cho người dùng trưởng thành từ 18 tuổi trở lên. Người chưa thành niên chỉ sử dụng khi có sự đồng ý của người giám hộ, và không được dùng nội dung luận giải cho những quyết định lớn của cuộc đời.', // :65
  '8. 政策变更': '8. Thay đổi chính sách',                               // :67
  '本政策可能不定期更新。重大变更将以显著方式通知。继续使用即表示同意更新后的版本。':
    'Chính sách này có thể được cập nhật mà không theo kỳ hạn cố định. Các thay đổi lớn sẽ được thông báo bằng hình thức rõ ràng. Tiếp tục sử dụng nghĩa là bạn đồng ý với phiên bản đã cập nhật.', // :68

  // ── app/terms/page.tsx (task c5) — trang phap ly. 7 muc + kho cam ①②③④ giu nguyen
  // danh va ket cau; `**...**` la dau nhan ban trong goc nen ban Viet giu dung no.
  '服务条款 · 紫微命盘': 'Điều khoản dịch vụ · Lá số Tử Vi',            // :1 metadata title
  '紫微命盘服务条款与用户协议': 'Điều khoản dịch vụ và thỏa thuận người dùng của Lá số Tử Vi', // :1 metadata description
  '1. 服务概述': '1. Tổng quan dịch vụ',                                // :19
  '紫微命盘（以下简称"本平台"）基于倪海厦《天纪》紫微斗数体系提供命盘排盘与解读服务。本平台所有命理内容仅供参考，':
    'Lá số Tử Vi (sau đây gọi tắt là "nền tảng này") cung cấp dịch vụ lập và luận giải lá số theo hệ thống Tử Vi đẩu số trong Thiên Kỷ của thầy Ni Hải Hạ. Toàn bộ nội dung mệnh lý của nền tảng này chỉ mang tính tham khảo,', // :20
  '不构成任何医疗、投资、法律、心理咨询或人生重大决策建议':
    'không cấu thành bất kỳ khuyến nghị nào về y tế, đầu tư, pháp lý, tư vấn tâm lý hay quyết định lớn của cuộc đời', // :20
  '2. 用户行为规范': '2. Quy tắc hành vi người dùng',                    // :22
  '使用本平台即表示您同意：': 'Sử dụng nền tảng này nghĩa là bạn đồng ý:', // :23
  '仅出于合法、个人参考目的使用本平台': 'chỉ sử dụng nền tảng vì mục đích hợp pháp và tham khảo cá nhân', // :25
  '不传播本平台内容用于商业销售、转载或公开发布':
    'không lan truyền nội dung nền tảng nhằm bán thương mại, đăng lại hoặc công bố công khai', // :26
  '不进行扰乱平台正常运行的行为': 'không thực hiện hành vi làm rối loạn hoạt động bình thường của nền tảng', // :27
  '提交的出生信息真实有效；本平台对错误信息导致的解读偏差不承担责任':
    'khai sinh bạn cung cấp phải chân thực và hợp lệ; nền tảng không chịu trách nhiệm cho sai lệch luận giải do thông tin sai gây ra', // :28
  '3. 知识产权与禁止条款 · 反爬反训练':
    '3. Sở hữu trí tuệ và điều khoản cấm · chống thu thập tự động, chống huấn luyện mô hình', // :31
  '本平台所有命理内容、知识库（含 14 主星 × 12 宫 × 男女 × 四化 × 大限流年的全部解读文本）、UI 设计、算法整合方案、案例库均为本平台原创或经合法整理。':
    'Toàn bộ nội dung mệnh lý, kho tri thức (bao gồm mọi văn bản luận giải theo 14 chính tinh × 12 cung × nam nữ × tứ hóa × đại hạn lưu niên), thiết kế UI, phương án tích hợp thuật toán và kho ví dụ điển hình của nền tảng đều do nền tảng tự sáng tạo hoặc được biên tập hợp pháp.', // :33
  '严格禁止以下行为，违者保留追究民事赔偿与刑事责任的权利：':
    'Cấm nghiêm ngặt các hành vi sau đây; với người vi phạm, chúng tôi bảo lưu quyền truy cứu bồi thường dân sự và trách nhiệm hình sự:', // :34
  '① 通过爬虫、自动化脚本、批量调用 API 等任何技术手段抓取本平台内容；':
    '① thu thập nội dung nền tảng bằng bất kỳ phương tiện kỹ thuật nào như crawler, script tự động, gọi API hàng loạt;', // :35
  '② 将本平台生成的命盘解读、文本、API 响应数据**用于训练任何机器学习模型**（含但不限于大语言模型、命理生成模型、文本生成模型等）；':
    '② dùng văn bản luận giải lá số, văn bản và dữ liệu phản hồi API do nền tảng tạo ra **để huấn luyện bất kỳ mô hình học máy nào** (bao gồm nhưng không giới hạn ở mô hình ngôn ngữ lớn, mô hình sinh mệnh lý, mô hình sinh văn bản);', // :36
  '③ 将本平台生成的内容转售、发布到其他网站、APP、自媒体账号；':
    '③ bán lại hoặc đăng nội dung do nền tảng tạo ra lên website, ứng dụng hoặc tài khoản truyền thông khác;', // :37
  '④ 反编译、复制、修改本平台前端或后端代码并以"自营"方式提供同类服务。':
    '④ dịch ngược, sao chép, chỉnh sửa mã frontend hoặc backend của nền tảng và cung cấp dịch vụ cùng loại theo hình thức "tự vận hành kinh doanh".', // :38
  '本平台输出文本嵌入有指纹追溯水印，违规复制 / 训练所产生的输出可被检测追溯。一经发现违规，本平台有权要求 ':
    'Văn bản đầu ra của nền tảng được nhúng watermark truy vết theo dấu vết; đầu ra sinh ra từ việc sao chép / huấn luyện trái phép có thể bị phát hiện và truy vết. Khi phát hiện vi phạm, nền tảng có quyền yêu cầu ', // :39 (key ket thuc bang 1 dau cach ASCII — source noi tiep <strong>)
  '每例违约赔偿 100 万元人民币': 'bồi thường vi phạm 1.000.000 nhân dân tệ cho mỗi vụ', // :39
  '，并保留向法院提起诉讼及配合公安机关调查的权利。':
    ', đồng thời bảo lưu quyền khởi kiện ra tòa án và phối hợp với cơ quan công an điều tra.', // :39
  '4. 免责声明': '4. Tuyên bố miễn trừ trách nhiệm',                      // :42
  '本平台命理内容基于传统紫微斗数与倪海厦体系的知识整理，':
    'Nội dung mệnh lý của nền tảng được biên tập từ kiến thức Tử Vi đẩu số truyền thống và hệ thống Ni Hải Hạ,', // :43
  '不保证 100% 准确': 'không bảo đảm chính xác 100%',                     // :43
  '。命运受天、地、人三才共同影响，本平台输出仅作为认识自我的参考，使用者应理性看待，不应过度依赖任何单一命理判断。':
    '. Vận mệnh chịu tác động chung của Thiên – Địa – Nhân (ba ngôi tam tài), nên đầu ra của nền tảng chỉ là tài liệu tham khảo để hiểu bản thân; người dùng nên nhìn nhận một cách lý trí, không phụ thuộc quá mức vào bất kỳ nhận định mệnh lý đơn lẻ nào.', // :43
  '因使用本平台内容产生的任何后果（包括但不限于决策失误、心理影响、关系变化等），本平台不承担法律责任。':
    'Nền tảng không chịu trách nhiệm pháp lý đối với bất kỳ hệ quả nào phát sinh từ việc sử dụng nội dung nền tảng (bao gồm nhưng không giới hạn ở quyết định sai, ảnh hưởng tâm lý, thay đổi quan hệ, v.v.).', // :44
  '5. 服务变更与终止': '5. Thay đổi và chấm dứt dịch vụ',                  // :46
  '本平台保留随时调整、暂停或终止部分或全部服务的权利。重大变更将以站内公告或邮件方式通知用户。':
    'Nền tảng bảo lưu quyền điều chỉnh, tạm ngừng hoặc chấm dứt một phần hay toàn bộ dịch vụ vào bất kỳ lúc nào. Các thay đổi lớn sẽ được thông báo tới người dùng bằng công bố trong trang hoặc qua email.', // :47
  '6. 法律适用与争议解决': '6. Luật áp dụng và giải quyết tranh chấp',     // :49
  '本条款适用中华人民共和国法律。若发生争议，双方应友好协商；协商不成的，提交本平台运营主体所在地有管辖权的人民法院诉讼解决。':
    'Điều khoản này chịu sự điều chỉnh của pháp luật nước Cộng hòa Nhân dân Trung Hoa. Nếu phát sinh tranh chấp, hai bên thương lượng trên tinh thần hữu hảo; nếu thương lượng không thành, khởi kiện tại tòa án nhân dân có thẩm quyền nơi chủ thể vận hành nền tảng đóng trụ sở.', // :50
  '7. 联系方式': '7. Thông tin liên hệ',                                  // :52
  '如有疑问，请通过本平台公布的客服微信 / 邮箱联系。':
    'Nếu còn thắc mắc, xin liên hệ qua WeChat chăm sóc khách hàng hoặc email đã được nền tảng công bố.', // :53

  // ── metadata <head> (task c5) — title/description/keywords cua root layout + 3 page ──
  // Phan quyet e0e2140 (SEO metadata giu nguyen Han) DUOC DAO NGUOC o dot C-5: day la chu
  // nguoi doc nhin thay (ket qua tim kiem, preview link) nen phai tieng Viet. goi qua
  // biText(...).vi o vi tri module-level → chay luc import, pure, khong side effect.
  '紫微命盘 · 倪海厦正宗紫微斗数': 'Lá số Tử Vi · Tử Vi đẩu số chính truyền Ni Hải Hạ', // app/layout.tsx title + OG title
  '基于倪海厦正宗紫微斗数体系，AI深度解读您的命盘格局、大限流年、感情事业财富健康全方位解析':
    'Dựa trên hệ thống Tử Vi đẩu số chính truyền của thầy Ni Hải Hạ, AI luận giải chuyên sâu cách cục lá số, đại hạn lưu niên, cùng tình cảm, sự nghiệp, tài phú và sức khỏe của bạn', // app/layout.tsx description + OG description
  '紫微斗数, 倪海厦, 紫微斗数全集, 紫微斗数全书, 骨髓赋, 命盘, 命理, 14主星, 12宫位':
    'Tử Vi đẩu số, Ni Hải Hạ, Tử Vi Đẩu Số Toàn Tập, Tử Vi Đẩu Số Toàn Thư, Cốt Tủy Phú, lá số, mệnh lý, 14 chính tinh, 12 cung', // app/layout.tsx keywords
  '紫微研究': 'Nghiên cứu Tử Vi',                                       // app/layout.tsx OG siteName
  '紫微斗数知识库 · 14 主星 × 13 宫位 · 倪海厦正宗体系':
    'Kho tri thức Tử Vi đẩu số · 14 chính tinh × 13 cung · hệ chính truyền Ni Hải Hạ', // app/knowledge/page.tsx title
  '基于倪海厦《天纪》体系与古籍《紫微斗数全集》《骨髓赋》编纂的紫微斗数知识库。覆盖 14 主星在 13 个宫位的完整论断，含一句话定调、核心论断、命盘依据、经典出处。':
    'Kho tri thức Tử Vi đẩu số được biên soạn theo hệ Thiên Kỷ của thầy Ni Hải Hạ cùng cổ thư Tử Vi Đẩu Số Toàn Tập và Cốt Tủy Phú. Bao quát luận giải đầy đủ của 14 chính tinh tại 13 cung, gồm câu định giọng, luận giải cốt lõi, căn cứ trên lá số và xuất xứ kinh điển.', // app/knowledge/page.tsx description
  '倪师方法论 · 古籍原典库 · 紫微斗数全集 / 全书 / 骨髓赋':
    'Phương pháp luận của Ni sư · Kho cổ thư nguyên bản · Tử Vi Đẩu Số Toàn Tập / Toàn Thư / Cốt Tủy Phú', // app/library/page.tsx title
  '紫微斗数权威古籍全文检索：《紫微斗数全集》《紫微斗数全书》《骨髓赋》倪海厦《天纪》引证来源':
    'Tra cứu toàn văn các cổ thư Tử Vi đẩu số có thẩm quyền: Tử Vi Đẩu Số Toàn Tập, Tử Vi Đẩu Số Toàn Thư, Cốt Tủy Phú — nguồn dẫn chứng trong Thiên Kỷ của thầy Ni Hải Hạ', // app/library/page.tsx description
  '搜索 · 古籍原典库': 'Tìm kiếm · Kho cổ thư nguyên bản',              // app/library/search/page.tsx title

  // ══ components/InsightPanel.tsx (task c7) — bang luan giai AI o /chart ══════
  // R30: VIET THAY HAN (biText(...).vi), khong <Bi mode="text"> — panel 380px, echo 2 dong se
  // vo day. CHI co chrome: cac prompt trong TOPIC_PROMPTS/PALACE_ROLES/dong 222-272 la dau vao
  // cua mo hinh (KHONG hien thi: sendMessage(..., hidden = true)) nen khong dich — chung duoc
  // mien tuong minh trong EXCLUDE/TEMPLATE_OK cua ui-phrase-coverage.test.ts, khong o kho nay.
  // '大限'/'流年' KHONG co dong moi o day: chung da la UI_VI :79-80 (nhan tab TimeNav);
  // InsightPanel chi dung .zh cua hai key do de giu nguyen chu Hán trong prompt.
  '命格': 'Mệnh cách',                                                  // :26 nhan topic (mang TOPICS)
  '感情': 'Tình cảm',                                                   // :27
  '事业': 'Sự nghiệp',                                                  // :28
  '财运': 'Tài vận',                                                    // :29
  '健康': 'Sức khỏe',                                                   // :30
  '性格': 'Tính cách',                                                  // :31
  '命格解读生成中…': 'Đang sinh bản luận giải mệnh cách…',                // :383 trang thai loading
  '命理解读': 'Luận giải mệnh lý',                                      // :426 nhan dau moi tin AI
  '继续追问，如：今年适合换工作吗？':
    'Đặt thêm câu hỏi, ví dụ: năm nay có nên đổi việc không?',            // :443 placeholder
  '追问': 'Hỏi thêm',                                                   // :462 nut gui
  '解读失败，请稍后重试。': 'Luận giải thất bại, vui lòng thử lại sau.',   // :315
  '开源版不含 AI 解读接口（/api/interpret），需要你自己实现后才能用，详见 README「快速开始」。排盘本身不需要任何 API Key。':
    'Bản mã nguồn mở không kèm giao diện luận giải AI (/api/interpret) — bạn phải tự triển khai thì mới dùng được, xem mục 「Bắt đầu nhanh」 trong README. Riêng việc lập lá số không cần bất kỳ API Key nào.', // :315 (ban open-source: /api/interpret tra 404)

  // ══ app/preview/page.tsx (task c7) — trang xem thu doan mo dau (scroll intro) ══
  // Panel chi render SAU khi ScrollIntro xong (state `done`), nen HTML cua server tai /preview
  // chua KHONG loai chuoi nay; phan Hán con lai trong curl la components/ScrollIntro.tsx
  // (ngoai pham vi task c7 — bao cao c7 ghi ro). '合盘' o :96 tai dung muc :272 tren.
  '紫微卷轴 · 开场预览': 'Cuộn Tử Vi · Xem thử đoạn mở đầu',              // :40 h1
  '刚才看到的卷轴效果会在每次进入主页时缓缓铺开。':
    'Hiệu ứng cuộn tranh vừa xem sẽ từ từ mở ra mỗi lần bạn vào trang chủ.', // :49
  '如果满意，告诉我，我把它接到主页 / 上线。':
    'Nếu thấy hài lòng, hãy báo tôi để tôi gắn vào trang chủ và lên sóng.', // :50
  '再 播 放 一 次': 'Phát lại một lần nữa',                               // :68 nut (source gap từng chữ)
  '进 入 原 版 首 页': 'Vào trang chủ bản gốc',                            // :83 nut
  '原版 ↗': 'Bản gốc ↗',                                                  // :92 lien ket (↗ la U+2197)
  '命盘': 'Lá số',                                                        // :94 (doi chieu '紫微斗数命盘': 'Lá số Tử Vi')
  '动画时间轴': 'Mốc thời gian của animation',                              // :112
  '卷轴从中央向两侧展开': 'cuộn mở từ giữa ra hai bên',                     // :113
  '宣纸内容浮现（标题 + 副标 + 朱砂印）':
    'nội dung trên tuyên chỉ hiện dần (tiêu đề + phụ đề + ấn chu sa)',      // :114
  '停留欣赏': 'lưu lại để thưởng lãm',                                    // :115
  '整体淡出，进入主页': 'toàn bộ mờ dần, chuyển vào trang chủ',              // :116
  '用户随时可点右下「跳过」直接进入主页。':
    'Người dùng có thể nhấn 「Bỏ qua」 ở góc dưới bên phải bất cứ lúc nào để vào thẳng trang chủ.', // :118

  // ══ components/ScrollIntro.tsx (task c8) — doan mo dau «cuon tranh» cua /preview ══
  // 41 chu Hán duy nhat con sot lai o /preview: task c7 dung curl nen chi thay duoc panel
  // sau khi intro xong; phan con lai la component nay. R30 — tieng Viet THAY chu Hán
  // (biText(...).vi), KHONG <Bi mode="text">: echo hai dong se vo day khung 90vw cua tro
  // choi. Khong co prompt AI / khoa du lieu nao trong file → khong dong nao vao EXCLUDE.
  // '紫微命盘' KHONG co dong moi o day: da la UI_VI :271 (同 key với title/OG cua layout.tsx)
  // → 'Lá số Tử Vi', tai dung theo R12-don (khong trung lap khoa).
  // Bảy sao Bắc Đẩu: am Hán-Việt chuẩn của ten thien van (khong phai ten sao Tu Vi trong
  // termosaurus — '玉衡' vs '廉 Trinh' la hai lop ten khac nhau), nen khong trung thuat ngu.
  '天枢': 'Thiên Xu',                                                // :15
  '天璇': 'Thiên Toàn',                                              // :15
  '天玑': 'Thiên Cơ',                                                // :15
  '天权': 'Thiên Quyền',                                             // :15
  '玉衡': 'Ngọc Hành',                                               // :16
  '开阳': 'Khai Dương',                                              // :16
  '摇光': 'Dao Quang',                                               // :16
  '观 天 之 象 · 察 人 之 命': 'Xem tượng trời · soi mệnh người',      // :181 phụ đề (· là U+00B7, dấu cách U+0020 — copy nguyên văn)
  '倪海厦《天纪》正宗体系': 'Hệ Thiên Kỷ chính truyền của thầy Ni Hải Hạ', // :191 (đối chiếu '基于倪海厦正宗体系' → 'theo chính truyền Ni Hải Hạ')
  // Nut bo qua — source gap từng chữ (同 dang '再 播 放 一 次' :727).
  '跳 过': 'Bỏ qua',                                                 // :19 gia tri mac dinh cua prop skipLabel
  // Bon o nhan chu sa :217-218 = con dấu 「Vương Đa Ngư」 (tro vui ten nhan vat), in theo
  // luong 2x2 → lay tung am, giu nguyen 4 <span> (khong doi layout). Khong chu nao la
  // thuat ngu (guard `UI_VI ∩ hasTerm = ∅` cua ui-phrases.test.ts:45 da kiem chung).
  '王': 'Vương',                                                    // :217
  '多': 'Đa',                                                       // :217
  '鱼': 'Ngư',                                                      // :218
  '印': 'Ấn',                                                       // :218
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

  // Fix wave — TimeNav.tsx. Key '{z}·{s}年四化：' dùng hai placeholder RIÊNG cho hai vế
  // (zh điền {z}/{s} nguyên văn Hán; vi điền {v}/{sv} bản Việt) vì vế Việt đảo trật tự —
  // R14 khớp key tuyệt đối nên call site phải truyền đúng chuỗi này.
  '大限 {n1}–{n2}': 'Đại hạn {n1}–{n2}',                // TimeNav.tsx:96 tab đại hạn (– là U+2013)
  '{z}·{s}年四化：': 'Tứ hóa {v} · can {sv}:',          // TimeNav.tsx:154 (· là U+00B7, ： là U+FF1A — copy nguyên văn)

  // app/page.tsx footer card: `${s.when} 开放` → biFmt('{when} 开放', { when: s.when }).vi
  // (s.when đã là 'Tháng 6' nên vế Việt ghép tự nhiên; placeholder CÓ TÊN theo R14).
  '{when} 开放': '{when} mở',

  // ── app/knowledge/* (task c2) ──
  // Muc dung chung: placeholder `z`-ben tren (sz/pz/tl) dien nguyên văn Hán để vế zh
  // tái hiện đúng chuỗi trang từng in; placeholder `v`-ben (sv/pv/tv) dien ten thuat
  // ngu/câu Việt (biTerm/biText tai call site) — cùng kiểu '{z}·{s}年四化：' của TimeNav.
  // viTerm('命宫')='Mệnh'… (khong co tu 'cung' trong bảng) nên vế Việt thêm 'cung' ở đây.
  '入{pz} · {tl}': 'Nhập cung {pv} · {tv}',           // app/knowledge/page.tsx chip topic
  '{sz}入{pz}宫': '{sv} nhập cung {pv}',              // [topic]/page.tsx h1
  '{sz}入{pz}': '{sv} nhập cung {pv}',                // [topic]/page.tsx 2 khối internal-link
  '{tl} · 倪海厦体系详解': '{tv} · chi tiết theo hệ Ni Hải Hạ', // [topic]/page.tsx kicker
  '想看你自己命盘的{tl}？': 'Muốn xem {tv} trên chính lá số của bạn?', // [topic]/page.tsx CTA
  '{sz}星的其他宫位解读': 'Luận giải các cung khác của sao {sv}',       // [topic]/page.tsx Section
  '其他主星入{pz}宫的解读': 'Luận giải các chính tinh khác nhập cung {pv}', // [topic]/page.tsx Section

  // ── app/library/* (task c3) — chuoi dem so luong + dieu huong co ten sach ──
  // Ba key '{n} …' co nguon la JSX `{expr} 章节` / `{expr} 段` — dang chen bieu thuc nen
  // extractor KHONG nhin thay (R29a blind spot); goi biFmt voi chuoi tran ben trong loi
  // dich lam no visible, dong thoi dich duoc ca nhan to so luong.
  '{n} 章节': '{n} chương',                            // app/library/page.tsx the co thu
  '{n} 段精华': '{n} đoạn tinh hoa',                   // app/library/page.tsx the co thu
  '{n} 段': '{n} đoạn',                                // app/library/[book]/page.tsx muc luc chi
  // {bt} = book.title — DATA tu lib/classics/data/* nen ca hai vế giữ《…》nguyên văn;
  // chi '目录' la chrome → 'Mục lục'.
  '← 《{bt}》目录': '← Mục lục《{bt}》',                // app/library/[book]/[chapter]/page.tsx dieu huong

  // ── app/knowledge/[star]/[topic]/page.tsx generateMetadata (task c5) ──
  // Placeholder z (sz/pz/tl) dien ten sao/cung/chu de la DATA nguyen van Han (de vế zh tai
  // hien dung chuoi trang tung in); placeholder v (sv/pv/tv) dien thuat ngu Viet — cung kieu
  // h1 (:142) va '{z}·{s}年四化：' cua TimeNav. Day la 2 chuoi TRAN trong biFmt( → ratchet
  // nhin thay, khong can khai bao TEMPLATE_OK nua.
  '{sz}入{pz}宫 · {tl} · 倪海厦体系详解': '{sv} nhập cung {pv} · {tv} · chi tiết theo hệ Ni Hải Hạ', // metadata title
  '{sz}入{pz}宫的紫微斗数解读 — 基于倪海厦《天纪》体系与古籍《紫微斗数全集》《骨髓赋》。':
    '{sv} nhập cung {pv} — luận giải Tử Vi đẩu số, biên soạn theo hệ Thiên Kỷ của thầy Ni Hải Hạ cùng cổ thư Tử Vi Đẩu Số Toàn Tập / Cốt Tủy Phú.', // metadata description (fallback)
};
