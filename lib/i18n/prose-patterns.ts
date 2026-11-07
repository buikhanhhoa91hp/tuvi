/**
 * PROSE_VI — bảng VĂN LUẬN (Task B1).
 *
 * KEY là ĐÚNG NGUYÊN VĂN chuỗi tiếng Trung trong `lib/ziwei/patterns.ts` (mô tả cách cục,
 * điều kiện required/bonus/breaking, keyword/nature lấy từ getMingGongSummary và
 * STAR_DESCRIPTIONS). Vì SAO dùng chuỗi gốc chứ không dùng tên cách cục: MỘT `name` có thể
 * mang HAI `description` khác nhau ('紫府同宫' có bản "同入命宫" và bản "未坐命"), nên khóa
 * theo tên là khóa sai. Đây đúng là cơ chế UI_VI đang dùng (khóa = literal nguyên văn),
 * không id bịa đặt.
 *
 * VALUE là bản dịch tiếng Việt. File này KHÔNG đổi bất kỳ logic nào: không chạm lib/ziwei/,
 * không đổi detectPatterns / level / conditions — nó thuần là bảng hiển thị.
 *
 * Khi nào thêm dòng ở đây? Khi `npx tsx scripts/regression/prose-coverage.test.ts` in ra
 * danh sách chuỗi chưa dịch — mỗi dòng trong đó là một key của bảng này (Task B2).
 * Thuật ngữ bên trong văn (sao, cung, tính) giữ đúng cách đọc Hán-Việt của lớp thuật ngữ
 * (terms.generated.ts / terms.override.ts): 紫微 = Tử Vi, 天府 = Thiên Phủ, 左辅 = Tả Phù…
 */

export const PROSE_VI: Record<string, string> = {
  // ─── 紫府同宫 (detectZiFu) — hai nhánh của CÙNG một tên: chứng minh khóa theo chuỗi ───
  '紫微天府同入命宫，帝相并临，尊贵之命。主品行端正、衣食无忧、有领导才能，宜担任要职。需要左右辅弼来配合方为完整大格。':
    'Tử Vi và Thiên Phủ cùng nhập Mệnh Cung, Đế – Tướng sánh bên, là mệnh tôn quý. Chủ về phẩm hạnh đoan chính, áo cơm không thiếu, có tài lãnh đạo, thích hợp giữ chức vụ quan trọng. Cần Tả Phù, Hữu Bật hỗ trợ thì mới thành đại cách trọn vẹn.',
  '紫微天府同宫但未坐命，主一生有贵人贵气依托，但本身不一定大富贵，需看会照吉煞而定。':
    'Tử Vi và Thiên Phủ đồng cung nhưng không trấn Mệnh, chủ về cả đời có quý nhân và quý khí nương tựa, song bản thân chưa chắc đại phú đại quý; phải xét hội chiếu cát tinh hay sát tinh mà định.',
  '紫微天府同入命宫':
    'Tử Vi Thiên Phủ cùng nhập Mệnh Cung',
};
