/**
 * Test bảng thuật ngữ do sync-terms sinh ra.
 * Chạy: npx tsx scripts/regression/terms-sync.test.ts
 */
import { readFileSync, existsSync } from 'node:fs';

const CJK = /[\u4e00-\u9fff]/;
const FILE = 'lib/i18n/terms.generated.ts';
let failed = 0;
const ok = (cond: boolean, msg: string) => {
  if (!cond) { failed++; console.error('  ✗ ' + msg); } else console.log('  ✓ ' + msg);
};

if (!existsSync(FILE)) {
  console.error(`✗ ${FILE} chưa tồn tại — chạy "npm run terms:sync" để sinh`);
  process.exit(1);
}

const src = readFileSync(FILE, 'utf8');
const pairs = [...src.matchAll(/^\s{2}'([^']+)': '([^']*)',?$/gm)];
ok(pairs.length >= 216, `số cặp thuật ngữ >= 216 (thực tế: ${pairs.length})`);

// Đối chiếu header với nội dung (tự nhất quán, không hardcode 240):
// header do script ghi ra "N mục (M biến thể ...)", N phải đúng bằng số dòng bảng.
// iztro lên bản mới -> cả hai cùng đổi -> test vẫn đạt.
// Bảng bị mất dòng (điển hình: mất biến thể hậu tố 宫/时) mà header chưa đổi -> fail.
const selfDescription = src.match(/(\d+)\s*mục\s*\(\s*(\d+)\s*biến thể/);
ok(selfDescription !== null, 'header tự khai "N mục (M biến thể ...)" để đối chiếu');
if (selfDescription) {
  const declaredTotal = Number(selfDescription[1]);
  const declaredSuffix = Number(selfDescription[2]);
  ok(declaredTotal === pairs.length, `header khai ${declaredTotal} mục == số cặp parse được (${pairs.length})`);
  ok(declaredSuffix > 0 && declaredSuffix <= declaredTotal, `header khai ${declaredSuffix} biến thể hậu tố, hợp lệ trong ${declaredTotal} mục`);
}

const map = new Map(pairs.map((m) => [m[1], m[2]]));
for (const [zh, vi] of [['紫微', 'Tử Vi'], ['天机', 'Thiên Cơ'], ['武曲', 'Vũ Khúc'],
  ['命宫', 'Mệnh'], ['财帛', 'Tài Bạch'], ['庙', 'Miếu'], ['陷', 'Hạn'],
  ['禄', 'Lộc'], ['忌', 'Kỵ'], ['甲', 'Giáp'], ['子', 'Tý'],
  ['水二局', 'Thủy Nhị Cục'], ['男', 'Nam'], ['女', 'Nữ'],
  // Hai cặp dưới đây KHÔNG có trong bảng gốc 216 mục — chúng do vòng hậu tố thêm vào,
  // nên mất là bắt được ngay: 兄弟宫 = vòng palace, 子时 = vòng earthlyBranch.
  ['兄弟宫', 'Huynh Đệ'], ['子时', 'Giờ Tý']] as const) {
  ok(map.get(zh) === vi, `${zh} → ${vi} (thực tế: ${JSON.stringify(map.get(zh))})`);
}

const giaTriKhongRong = pairs.filter(([, , vi]) => vi.trim() === '');
ok(giaTriKhongRong.length === 0, `không có giá trị Việt rỗng (${giaTriKhongRong.length} cái)`);

const conCJK = pairs.filter(([, , vi]) => CJK.test(vi));
ok(conCJK.length === 0, `giá trị Việt không còn chữ Hán (${conCJK.length} cái còn)`);

ok(src.includes('AUTO-GENERATED'), 'file có header AUTO-GENERATED để không sửa tay');

console.log(failed ? `\n✗ terms-sync: ${failed} lỗi` : '\n✅ terms-sync: đạt');
process.exit(failed ? 1 : 0);
