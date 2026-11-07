/**
 * Nhãn tiếng Việt cho 34 đơn vị cấp tỉnh trong lib/ziwei/cities.ts (PROVINCES).
 *
 * CHỈ PHỤC VỤ HIỂN THỊ. Khóa là đúng nguyên văn chuỗi Hán của ProvinceInfo.name —
 * form.province / form.city trong BirthForm, giá trị `value=` gửi đi và chuỗi được
 * lưu vào lá số VẪN là Hán tự, vì PROVINCES.find(p => p.name === form.province) tra
 * theo khóa đó và mọi phép hiệu chỉnh giờ thật–mặt trời (offsetMin, calcTrueSolarBranch)
 * đọc longitude từ chính phép tra này. Đổi nhãn không được đổi khóa — chốt bằng
 * scripts/regression/birthform-birthinfo-consistency.test.ts (mục Task c6).
 *
 * Phong cách nhãn: dạng Hán-Việt NGẮN GỌN mà người Việt thực sự nhận ra
 * (sách giáo khoa / báo chí: Bắc Kinh, Thượng Hải, Tân Cương, Hồng Kông, Ma Cao…),
 * thay vì dịch nguyên văn hậu tố 省/市/自治区/特别行政区 ('Nội Mông Cổ Tự trị khu').
 * Lý do: ô chọn chỉ rộng 1 cột trong lưới 2 cột, tên đầy đủ kiểu hành chính
 * bị cắt dòng và không ai gọi bằng tên đó; dạng ngắn vẫn phân biệt được
 * Sơn Tây (山西) ↔ Thiểm Tây (陝西), Giang Tây (江) ↔ Giang Tô (苏) vì âm khác nhau.
 *
 * File display-data: nằm ở lib/i18n/, KHÔNG được sửa lib/ziwei/cities.ts.
 * 520 tên thành phố trực thuộc và 2724 quận huyện KHÔNG ở đây — phạm vi của
 * task này chỉ là 34 đơn vị cấp tỉnh (quyết định dịch tiếp là việc sau).
 */
export const PROVINCE_VI: Record<string, string> = {
  // ─── 直辖市 ───
  '北京市': 'Bắc Kinh',
  '天津市': 'Thiên Tân',
  '上海市': 'Thượng Hải',
  '重庆市': 'Trùng Khánh',
  // ─── 省 ───
  '河北省': 'Hà Bắc',
  '山西省': 'Sơn Tây',
  '辽宁省': 'Liêu Ninh',
  '吉林省': 'Cát Lâm',
  '黑龙江省': 'Hắc Long Giang',
  '江苏省': 'Giang Tô',
  '浙江省': 'Chiết Giang',
  '安徽省': 'An Huy',
  '福建省': 'Phúc Kiến',
  '江西省': 'Giang Tây',
  '山东省': 'Sơn Đông',
  '河南省': 'Hà Nam',
  '湖北省': 'Hồ Bắc',
  '湖南省': 'Hồ Nam',
  '广东省': 'Quảng Đông',
  '海南省': 'Hải Nam',
  '四川省': 'Tứ Xuyên',
  '贵州省': 'Quý Châu',
  '云南省': 'Vân Nam',
  '陕西省': 'Thiểm Tây',
  '甘肃省': 'Cam Túc',
  '青海省': 'Thanh Hải',
  '台湾省': 'Đài Loan',
  // ─── 自治区 (dạng ngắn, bỏ 自治区) ───
  '内蒙古自治区': 'Nội Mông',
  '广西壮族自治区': 'Quảng Tây',
  '西藏自治区': 'Tây Tạng',
  '宁夏回族自治区': 'Ninh Hạ',
  '新疆维吾尔自治区': 'Tân Cương',
  // ─── 特别行政区 (dạng quen dùng trong tiếng Việt) ───
  '香港特别行政区': 'Hồng Kông',
  '澳门特别行政区': 'Ma Cao',
};
