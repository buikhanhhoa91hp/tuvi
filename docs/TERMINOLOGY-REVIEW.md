# Danh sách thuật ngữ cần xem lại (TERMINOLOGY REVIEW)

> **File này do script sinh ra — KHÔNG SỬA TAY.**
> Chạy `npm run terms:report` (script: `scripts/i18n/report-terms.ts`) để tái sinh.
> Muốn đổi một bản dịch: sửa **`lib/i18n/terms.override.ts`** rồi chạy lại lệnh trên.
> Đổi một dòng trong override là bản dịch đổi ở MỌI màn hình, vì toàn bộ UI render qua `<Bi>`.

Hướng dẫn cho người không chuyên Tử Vi: bảng 1 khỏi cần xem; bảng 2 là những từ
ta tự quyết — cột cuối ghi lại lý do/nguồn ta đã nghiên cứu, thấy chưa thuyết phục
thì đổi `vi` (và viết note mới); bảng 3 là những từ nghi sai — thấy sai thì điền
bản dịch đúng vào cột "Nên là" rồi báo lại.

## 1. Đã chốt từ iztro (240 mục) — khỏi xem

Nguồn `iztro/lib/i18n/locales/{zh-CN,vi-VN}` (MIT), ghép theo key ra cặp Hán→Việt, lưu
trong `lib/i18n/terms.generated.ts`. Đây là thuật ngữ Hán Việt chuẩn (Tử Vi, Thiên Cơ,
Vũ Khúc, Mệnh, Tài Bạch, Quan Lộc, Nô Bộc, Miếu, Vượng, Đắc…). Toàn bộ **61** ID sao
trong bảng sao của repo (`SCHOOL_STAR_ID_TO_NAME`, lib/ziwei/school-data.ts) đã có bản
Việt trong số này — `chart-name-coverage.test.ts` kiểm chứng mỗi lần chạy `npm test`.
(Con số 85 ở bản thảo cũ là stale — đo lại trên table hiện tại là 61.)

## 2. Ta tự quyết (20 mục) — xem khi bạn muốn

Mỗi dòng = một quyết định trong `lib/i18n/terms.override.ts`. Cột "Lý do / nguồn" là
note NGUYÊN VĂN trong file đó (tham chiếu dòng source, số liệu đo ở /chart…) — chính
là bằng chứng nghiên cứu để bạn đánh giá thay ta.

| Hán | Việt đang dùng | Loại | Lý do / nguồn (verbatim) |
|---|---|---|---|
| 地 | Địa | Độ sáng (miếu/hãm) | types.ts:42. Chữ dùng trong bảng sáng độ của một số流派; giữ Hán Việt sát nghĩa. |
| 闲 | Nhàn | Độ sáng (miếu/hãm) | types.ts:42 StarBrightness có '闲'/'地' ngoài 7 bậc 庙旺得利平不陷 của iztro. Nhàn = trung bình khá, gần Bình. |
| 陷 | Hãm | Độ sáng (miếu/hãm) | iztro brightness.js xian='Hạn' trùng với 限='Hạn'. Việt chuẩn: 陷 địa = Hãm địa. Override này THẮNG generated — xem test mục 3b. |
| 阳男 | Dương Nam | Âm dương / giới tính | algorithm.ts:658 yinYangGender = calcYinYangGender(lunarInfo.yearStem, gender); hàm :286 ghép '阳' khi yearStem % 2 === 0 và '男' khi gender 'male'. iztro không sinh nhãn ghép này nên generated/constants/school-data đều không có — override là đường duy nhất. |
| 阳女 | Dương Nữ | Âm dương / giới tính | algorithm.ts:658 như trên; hàm :286 ghép '阳' khi yearStem % 2 === 0 và '女' khi gender 'female'. Cùng bộ nhãn với 阴女 mà yunxian-context.ts:88 so trực tiếp. |
| 阴男 | Âm Nam | Âm dương / giới tính | algorithm.ts:658 như trên; hàm :286 ghép '阴' khi yearStem % 2 === 1 và '男' khi gender 'male'. shier-shen.ts:106 dùng cùng尺子阳男阴女顺/阴男阳女逆 để định thuận-nghịch. |
| 阴女 | Âm Nữ | Âm dương / giới tính | algorithm.ts:658 như trên; hàm :286 ghép '阴' khi yearStem % 2 === 1 và '女' khi gender 'female'. yunxian-context.ts:88 `chart.yinYangGender === '阴女'` — nhãn engine phát ra mà không có bản Việt thì UI chỉ hiện chữ Hán. |
| 晚子时 | Giờ Tý muộn | Giờ | common.json vi-VN: lateRatHour |
| 早子时 | Giờ Tý sớm | Giờ | common.json vi-VN: earlyRatHour |
| 年 | Niên | Khác | Nhãn temporal ghép cặp với '限'='Hạn' trong overlayLabel của ChartBoard.tsx:81-85 (chế độ xem lưu niên), in trong pill 8px cạnh ký tự tứ hóa. iztro zh-CN/common.json yearly='流年' → vi-VN 'Lưu Niên', nhưng R19 đo thật ở 1280px: 'Lưu niên' làm pill 68–83px trong ô 211px và đẩy hàng phụ tinh cung 官禄 xuống dòng → lấy một âm 'Niên' (53–68px, không vỡ hàng), đối xứng với 'Hạn'. common.json bị R5 loại khỏi sync nên generated không có mục này — override là đường duy nhất (R15). |
| 童限 | Đồng Hạn | Khác | iztro zh-CN/common.json childhood = 童限 (ĐÃ KIỂM CHỨNG, không phải 童年); vi-VN trả 'đứa trẻ Hạn' — trật từ sai, rõ là máy dịch. common.json không được sync (R5) nên override là đường duy nhất đưa mục này vào bảng. |
| 限 | Hạn | Khác | iztro zh-CN/common.json decadal='大限' → vi-VN 'Đại Hạn' — 限 đứng một đoạn là 'Hạn' (đại hạn/lưu hạn). Không sinh ra từ sync (R5 loại common.json) nên override là đường duy nhất. |
| 化忌 | Hóa Kỵ | Tứ hóa | ChartBoard.tsx:319. Dạng đầy đủ của '忌'='Kỵ' (mutagen một âm trong generated); progress Task 2 đo hasTerm('化忌')===false nên override là đường duy nhất. |
| 化科 | Hóa Khoa | Tứ hóa | ChartBoard.tsx:318. Dạng đầy đủ của '科'='Khoa' (mutagen một âm trong generated). |
| 化禄 | Hóa Lộc | Tứ hóa | ChartBoard.tsx:316 (chú giải màu tứ hóa). Dạng đầy đủ của '禄'='Lộc' (mutagen một âm, đã có trong generated); thêm 化 để không nhầm với sao 禄存. |
| 化权 | Hóa Quyền | Tứ hóa | ChartBoard.tsx:317. Dạng đầy đủ của '权'='Quyền' (mutagen một âm trong generated). |
| 交友 | Nô Bộc | Cung | Dạng ngắn của mục trên. |
| 交友宫 | Nô Bộc | Cung | constants.ts:25 PALACE_NAMES_ORDER dùng 交友宫; iztro palace.js dùng 仆役→'Nô Bộc'. Cùng một cung. |
| 副截 | Phó Triệt | Sao | algorithm.ts:414-417 applySchoolJiekong ĐỔI TÊN VÔ KIỆN 截路/空亡 của iztro thành 截空/副截 (mọi năm), không phải 'cho năm âm can' — năm âm can chỉ ĐẢO CUNG ở :426 (yearStem % 2 === 0 tức阳干 return sớm), ghép cặp với 截空 (金标准 comments :411). generated có 截空='Triệt Không' (terms.generated.ts:68) nhưng không có 副截 — Hán Việt cùng họ: Phó Triệt. |
| 副旬 | Phó Tuần | Sao | algorithm.ts:450 applySchoolFuxun pushNatalStar 副旬 vào branch còn lại của cặp旬空 (cả school-data id 78). generated có 旬空='Tuần Không' (terms.generated.ts:208) nhưng không có 副旬 — Hán Việt cùng họ với sao cha: Phó Tuần. |

## 3. Nghi vẫn sai trong bảng iztro (1 mục)

`common.json` của iztro (vi-VN) có mục trông như máy dịch. Common.json bị R5 loại khỏi
sync nên các mục này không vào `terms.generated.ts`; một số đã được override ở bảng 2,
số còn lại nằm ở đây để bạn duyệt. Từ nào sai, điền bản dịch đúng vào cột "Nên là".

| Hán | Việt của iztro | key trong common.json | Nên là (điền vào đây) |
|---|---|---|---|
| 童限 | đứa trẻ Hạn | childhood |  |

## Cách sửa (quy trình duy nhất)

1. Mở `lib/i18n/terms.override.ts`.
2. Thêm/sửa một dòng `{ zh: '…', vi: '…', kind: '…', note: 'vì sao' }` — note bắt buộc.
3. Chạy `npm test` (chart-name-coverage sẽ báo nếu engine sinh tên mà bảng chưa phủ),
   rồi `npm run terms:report` để tái sinh chính file này.
