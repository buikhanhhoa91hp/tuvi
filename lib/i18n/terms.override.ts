import type { OverrideEntry } from './terms.types';

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

  // ── (a) thập nhị canh chố dưới dạng 时 ──
  // (sync đã sinh '子时'..'亥时' từ earthlyBranch; giữ override cho 早/晚 子时 vì
  //  app/chart và algorithm phân biệt giờ Tý sớm/muộn)
  { zh: '早子时', vi: 'Giờ Tý sớm', kind: 'hour', note: 'common.json vi-VN: earlyRatHour' },
  { zh: '晚子时', vi: 'Giờ Tý muộn', kind: 'hour', note: 'common.json vi-VN: lateRatHour' },

  // ── (b) mục iztro dịch lỗi, ghi lại để người dùng biết mà soát ──
  { zh: '童限', vi: 'Đồng Hạn', kind: 'misc',
    note: "iztro zh-CN/common.json childhood = 童限 (ĐÃ KIỂM CHỨNG, không phải 童年); vi-VN trả " +
          "'đứa trẻ Hạn' — trật từ sai, rõ là máy dịch. common.json không được sync (R5) nên " +
          "override là đường duy nhất đưa mục này vào bảng." },
];

/** kind là ƯU TIÊN giữa các mục cùng zh, không phải bộ lọc: không mục nào khớp kind
 *  thì resolve.ts lấy mục đầu được khai báo (theo thứ tự viết trong bảng) — sai kind không mất bản dịch. */
export const OVERRIDE_BY_ZH = new Map<string, OverrideEntry[]>();
for (const e of OVERRIDE_TERMS) {
  const list = OVERRIDE_BY_ZH.get(e.zh);
  if (list) list.push(e); else OVERRIDE_BY_ZH.set(e.zh, [e]);
}
