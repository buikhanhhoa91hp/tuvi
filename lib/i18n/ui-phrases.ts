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
};
