import type { OverrideEntry, TermKind } from './terms.types';

/**
 * Quyết định của ta, thắng GENERATED_TERMS.
 * Thêm vào đây khi: (a) iztro không có mục; (b) bản Việt của iztro sai/dịch máy;
 * (c) hai iztro key cùng một chữ Hán nhưng khác bản Việt; (d) biến thể riêng của repo.
 *
 * note là BẮT BUỘC — nó là bằng chứng đã nghiên cứu, và là thứ người đọc
 * docs/TERMINOLOGY-REVIEW.md cần để quyết định thay ta.
 */
export const OVERRIDE_TERMS: OverrideEntry[] = [
  // ── (d) biến thể riêng của repo ──
  { zh: '交友宫', vi: 'Nô Bộc', kind: 'palace',
    note: "constants.ts:25 PALACE_NAMES_ORDER dùng 交友宫; iztro palace.js dùng 仆役→'Nô Bộc'. Cùng một cung." },
  { zh: '交友', vi: 'Nô Bộc', kind: 'palace',
    note: 'Dạng ngắn của mục trên.' },

  // ── (a) iztro thiếu: StarBrightness có 9 bậc, locale chỉ có 7 ──
  { zh: '闲', vi: 'Nhàn', kind: 'brightness',
    note: "types.ts:42 StarBrightness có '闲'/'地' ngoài 7 bậc 庙旺得利平不陷 của iztro. Nhàn = trung bình khá, gần Bình." },
  { zh: '地', vi: 'Địa', kind: 'brightness',
    note: "types.ts:42. Chữ dùng trong bảng sáng độ của một số流派; giữ Hán Việt sát nghĩa." },

  // ── (b) iztro dịch đạt nhưng trùng từ: 陷 và 限 đều ra 'Hạn' ──
  // 'Hạn' trong Tử Vi Việt = 限 (đại hạn/lưu hạn), còn 陷 phải là 'Hãm' (hãm địa).
  // Để nguyên 'Hạn' thì bàn lá số sẽ ghi 'Hạn' cạnh cung hạn — người đọc không phân biệt được.
  { zh: '陷', vi: 'Hãm', kind: 'brightness',
    note: "iztro brightness.js xian='Hạn' trùng với 限='Hạn'. Việt chuẩn: 陷 địa = Hãm địa. Override này THẮNG generated — xem test mục 3b." },
  // Khóa _limit_ phải có mặt để mục 3b chứng minh được override của 陷 không đụng tới nó.
  // Generated KHÔNG có '限' (đo được: 0 khóa chứa 限, mục duy nhất có giá trị 'Hạn' là 陷),
  // vì iztro chỉ đặt 限 ở common.json (decadal=大限) mà common.json bị R5 loại khỏi sync.
  { zh: '限', vi: 'Hạn', kind: 'misc',
    note: "iztro zh-CN/common.json decadal='大限' → vi-VN 'Đại Hạn' — 限 đứng một đoạn là 'Hạn' " +
          "(đại hạn/lưu hạn). Không sinh ra từ sync (R5 loại common.json) nên override là đường duy nhất." },
  // R15: '限' và '年' là hai nhãn của CÙNG một biểu thức ở ChartBoard.tsx:75
  // (`timeView === 'daxian' ? '限' : timeView === 'liunian' ? '年'`). Một chữ ở
  // terms.override, chữ kia ở UI_VI là phá quy tắc một nguồn — guard
  // `UI_VI ∩ hasTerm = ∅` sẽ fail đúng vào ngày '年' được khai là thuật ngữ. Nên '年'
  // về đây, đứng cạnh '限'; '闰' (nhãn tháng nhuận, :182) thì ở lại UI_VI.
  { zh: '年', vi: 'Lưu niên', kind: 'misc',
    note: "Nhãn temporal ghép cặp với '限' trong overlayLabel của ChartBoard.tsx:75 (chế độ xem " +
          "lưu niên). iztro zh-CN/common.json yearly='流年' → vi-VN 'Lưu Niên', nên bản Việt " +
          "chuẩn của '年' ở ngữ cảnh này là 'Lưu niên'. common.json bị R5 loại khỏi sync nên " +
          "generated không có mục này — override là đường duy nhất (R15)." },

  // ── (a) thập nhị canh chố dưới dạng 时 ──
  // (sync đã sinh '子时'..'亥时' từ earthlyBranch; giữ override cho 早/晚 子时 vì
  //  app/chart và algorithm phân biệt giờ Tý sớm/muộn)
  { zh: '早子时', vi: 'Giờ Tý sớm', kind: 'hour', note: 'common.json vi-VN: earlyRatHour' },
  { zh: '晚子时', vi: 'Giờ Tý muộn', kind: 'hour', note: 'common.json vi-VN: lateRatHour' },

  // ── (a) iztro thiếu: sao cặp do repo tự sinh, không phải sao iztro nên sync không coverage ──
  { zh: '副旬', vi: 'Phó Tuần', kind: 'star',
    note: "algorithm.ts:450 applySchoolFuxun pushNatalStar 副旬 vào branch còn lại của cặp旬空 " +
          "(cả school-data id 78). generated có 旬空='Tuần Không' (terms.generated.ts:208) nhưng " +
          "không có 副旬 — Hán Việt cùng họ với sao cha: Phó Tuần." },
  { zh: '副截', vi: 'Phó Triệt', kind: 'star',
    note: "algorithm.ts:414-417 applySchoolJiekong ĐỔI TÊN VÔ KIỆN 截路/空亡 của iztro thành " +
          "截空/副截 (mọi năm), không phải 'cho năm âm can' — năm âm can chỉ ĐẢO CUNG ở :426 " +
          "(yearStem % 2 === 0 tức阳干 return sớm), ghép cặp với 截空 (金标准 comments :411). " +
          "generated có 截空='Triệt Không' (terms.generated.ts:68) nhưng không có 副截 — " +
          "Hán Việt cùng họ: Phó Triệt." },

  // ── (a) nhãn âm-dương + giới tính engine tự sinh (không phải sao iztro, sync không coverage) ──
  // algorithm.ts:658 gọi calcYinYangGender; :286 ghép '阳'/'阴' theo yearStem % 2 và '男'/'女'
  // theo gender. chart-name-coverage đo trước khi thêm: hasTerm('阳男') === false — blind spot thật.
  { zh: '阳男', vi: 'Dương Nam', kind: 'gender',
    note: "algorithm.ts:658 yinYangGender = calcYinYangGender(lunarInfo.yearStem, gender); " +
          "hàm :286 ghép '阳' khi yearStem % 2 === 0 và '男' khi gender 'male'. iztro không sinh " +
          "nhãn ghép này nên generated/constants/school-data đều không có — override là đường duy nhất." },
  { zh: '阴男', vi: 'Âm Nam', kind: 'gender',
    note: "algorithm.ts:658 như trên; hàm :286 ghép '阴' khi yearStem % 2 === 1 và '男' khi gender " +
          "'male'. shier-shen.ts:106 dùng cùng尺子阳男阴女顺/阴男阳女逆 để định thuận-nghịch." },
  { zh: '阳女', vi: 'Dương Nữ', kind: 'gender',
    note: "algorithm.ts:658 như trên; hàm :286 ghép '阳' khi yearStem % 2 === 0 và '女' khi gender " +
          "'female'. Cùng bộ nhãn với 阴女 mà yunxian-context.ts:88 so trực tiếp." },
  { zh: '阴女', vi: 'Âm Nữ', kind: 'gender',
    note: "algorithm.ts:658 như trên; hàm :286 ghép '阴' khi yearStem % 2 === 1 và '女' khi gender " +
          "'female'. yunxian-context.ts:88 `chart.yinYangGender === '阴女'` — nhãn engine phát ra " +
          "mà không có bản Việt thì UI chỉ hiện chữ Hán." },

  // ── (b) mục iztro dịch lỗi, ghi lại để người dùng biết mà soát ──
  { zh: '童限', vi: 'Đồng Hạn', kind: 'misc',
    note: "iztro zh-CN/common.json childhood = 童限 (ĐÃ KIỂM CHỨNG, không phải 童年); vi-VN trả " +
          "'đứa trẻ Hạn' — trật từ sai, rõ là máy dịch. common.json không được sync (R5) nên " +
          "override là đường duy nhất đưa mục này vào bảng." },
];

/**
 * Pure helper — CÁCH CHỌN duy nhất giữa các mục cùng khóa: kind khớp thắng thứ tự khai báo,
 * không có kind (hoặc kind không khớp mục nào) rơi về mục đầu khai báo — sai kind không mất
 * bản dịch. resolve.ts dùng hàm này nên logic chỉ có một chỗ; terms-resolve.test.ts chứng
 * minh cả hai nhánh bằng fixture danh sách cục bộ thay vì nhét từ giả ('双轨') vào bảng thật
 * (mục fixture sẽ đi theo allTermsZh() sang Báo cáo từ khó Task 10 in cho người đọc).
 */
export function pickOverride<E extends { kind: TermKind }>(
  entries: readonly E[], kind?: TermKind
): E | undefined {
  if (entries.length === 0) return undefined;
  const exact = kind ? entries.find((o) => o.kind === kind) : undefined;
  return exact ?? entries[0];
}

/** kind là ƯU TIÊN giữa các mục cùng zh, không phải bộ lọc: không mục nào khớp kind
 *  thì resolve.ts lấy mục đầu được khai báo (theo thứ tự viết trong bảng) — sai kind không mất bản dịch. */
export const OVERRIDE_BY_ZH = new Map<string, OverrideEntry[]>();
for (const e of OVERRIDE_TERMS) {
  const list = OVERRIDE_BY_ZH.get(e.zh);
  if (list) list.push(e); else OVERRIDE_BY_ZH.set(e.zh, [e]);
}
