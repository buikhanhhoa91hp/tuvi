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

const map = new Map(pairs.map((m) => [m[1], m[2]]));
for (const [zh, vi] of [['紫微', 'Tử Vi'], ['天机', 'Thiên Cơ'], ['武曲', 'Vũ Khúc'],
  ['命宫', 'Mệnh'], ['财帛', 'Tài Bạch'], ['庙', 'Miếu'], ['陷', 'Hạn'],
  ['禄', 'Lộc'], ['忌', 'Kỵ'], ['甲', 'Giáp'], ['子', 'Tý'],
  ['水二局', 'Thủy Nhị Cục'], ['男', 'Nam'], ['女', 'Nữ']] as const) {
  ok(map.get(zh) === vi, `${zh} → ${vi} (thực tế: ${JSON.stringify(map.get(zh))})`);
}

const giaTriKhongRong = pairs.filter(([, , vi]) => vi.trim() === '');
ok(giaTriKhongRong.length === 0, `không có giá trị Việt rỗng (${giaTriKhongRong.length} cái)`);

const conCJK = pairs.filter(([, , vi]) => CJK.test(vi));
ok(conCJK.length === 0, `giá trị Việt không còn chữ Hán (${conCJK.length} cái còn)`);

ok(src.includes('AUTO-GENERATED'), 'file có header AUTO-GENERATED để không sửa tay');

console.log(failed ? `\n✗ terms-sync: ${failed} lỗi` : '\n✅ terms-sync: đạt');
process.exit(failed ? 1 : 0);
