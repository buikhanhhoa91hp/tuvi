/**
 * Sinh docs/TERMINOLOGY-REVIEW.md — báo cáo thuật ngữ cho người KHÔNG chuyên Tử Vi duyệt.
 * Chạy: npm run terms:report
 *
 * Ba bảng theo đúng thiết kế Task 10:
 *  1. Thuật ngữ đã chốt từ iztro — chỉ đếm số mục, không liệt kê (nguồn MIT, khỏi xem).
 *  2. Thuật ngữ TA tự quyết — toàn bộ terms.override.ts, mỗi dòng kèm note nguyên văn.
 *  3. Mục nghi vẫn sai — gồm cả giá trị common.json của iztro trông như máy dịch
 *     (vd childhood → 'đứa trẻ Hạn'), có cột "Nên là" trống để người đọc điền.
 *
 * LUU Y (Task 10): KHONG import `collectChartNames` từ
 * scripts/regression/chart-name-coverage.test.ts — import một file test sẽ chạy
 * whole scan cấp top-level của nó, kể cả các nhánh process.exit(1). Báo cáo này
 * không cần tên của từng lá số: chỉ đọc các bảng tĩnh (generated / override / common.json).
 */
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { GENERATED_TERMS } from '../../lib/i18n/terms.generated';
import { OVERRIDE_TERMS } from '../../lib/i18n/terms.override';
import type { TermKind } from '../../lib/i18n/terms.types';

const require = createRequire(import.meta.url);
const BASE = 'iztro/lib/i18n/locales';
const commonZh = require(`${BASE}/zh-CN/common.json`) as Record<string, string>;
const commonVi = require(`${BASE}/vi-VN/common.json`) as Record<string, string>;

const CJK = /[\u4e00-\u9fff]/;

/** Escape | và xuống dòng để note không phá vỡ bảng markdown. */
const esc = (s: string): string => s.replace(/\|/g, '/').replace(/\s*\n\s*/g, ' ');

/** Nhãn tiếng Việt cho TermKind — người không chuyên đọc bảng 2 khỏi phải đoán từ khóa code. */
const KIND_LABEL: Record<TermKind, string> = {
  star: 'Sao', palace: 'Cung', brightness: 'Độ sáng (miếu/hãm)', mutagen: 'Tứ hóa',
  stem: 'Thiên can', branch: 'Địa chi', hour: 'Giờ', element: 'Cục ngũ hành',
  gender: 'Âm dương / giới tính', zodiac: 'Hoàng đạo', pattern: 'Cách cục', misc: 'Khác',
};

// Bảng 3: mục common.json của iztro nghi máy dịch — bản Việt còn chữ Hán, hoặc lộ
// trật từ của máy dịch ('đứa trẻ Hạn' = 童限 mà dịch word-by-word, rõ ràng không phải người viết).
const suspicious = Object.keys(commonZh)
  .filter((k) => CJK.test(commonVi[k] ?? '') || /^(?:đứa trẻ|cái|con) /.test(commonVi[k] ?? ''))
  .map((k) => ({ zh: commonZh[k], vi: commonVi[k], key: k }));

// Bảng 2: mọi quyết định của ta trong terms.override.ts, sắp theo loại cho dễ đọc.
const ours = [...OVERRIDE_TERMS].sort(
  (a, b) => a.kind.localeCompare(b.kind) || a.zh.localeCompare(b.zh, 'zh-Hans-CN'),
);

// Bảng 1: số mục đã khóa từ iztro (chỉ đếm, không liệt kê).
const iztroCount = Object.keys(GENERATED_TERMS).length;

const md = `# Danh sách thuật ngữ cần xem lại (TERMINOLOGY REVIEW)

> **File này do script sinh ra — KHÔNG SỬA TAY.**
> Chạy \`npm run terms:report\` (script: \`scripts/i18n/report-terms.ts\`) để tái sinh.
> Muốn đổi một bản dịch: sửa **\`lib/i18n/terms.override.ts\`** rồi chạy lại lệnh trên.
> Đổi một dòng trong override là bản dịch đổi ở MỌI màn hình, vì toàn bộ UI render qua \`<Bi>\`.

Hướng dẫn cho người không chuyên Tử Vi: bảng 1 khỏi cần xem; bảng 2 là những từ
ta tự quyết — cột cuối ghi lại lý do/nguồn ta đã nghiên cứu, thấy chưa thuyết phục
thì đổi \`vi\` (và viết note mới); bảng 3 là những từ nghi sai — thấy sai thì điền
bản dịch đúng vào cột "Nên là" rồi báo lại.

## 1. Đã chốt từ iztro (${iztroCount} mục) — khỏi xem

Nguồn \`iztro/lib/i18n/locales/{zh-CN,vi-VN}\` (MIT), ghép theo key ra cặp Hán→Việt, lưu
trong \`lib/i18n/terms.generated.ts\`. Đây là thuật ngữ Hán Việt chuẩn (Tử Vi, Thiên Cơ,
Vũ Khúc, Mệnh, Tài Bạch, Quan Lộc, Nô Bộc, Miếu, Vượng, Đắc…). Toàn bộ **61** ID sao
trong bảng sao của repo (\`SCHOOL_STAR_ID_TO_NAME\`, lib/ziwei/school-data.ts) đã có bản
Việt trong số này — \`chart-name-coverage.test.ts\` kiểm chứng mỗi lần chạy \`npm test\`.
(Con số 85 ở bản thảo cũ là stale — đo lại trên table hiện tại là 61.)

## 2. Ta tự quyết (${ours.length} mục) — xem khi bạn muốn

Mỗi dòng = một quyết định trong \`lib/i18n/terms.override.ts\`. Cột "Lý do / nguồn" là
note NGUYÊN VĂN trong file đó (tham chiếu dòng source, số liệu đo ở /chart…) — chính
là bằng chứng nghiên cứu để bạn đánh giá thay ta.

| Hán | Việt đang dùng | Loại | Lý do / nguồn (verbatim) |
|---|---|---|---|
${ours.map((o) => `| ${o.zh} | ${o.vi} | ${KIND_LABEL[o.kind] ?? o.kind} | ${esc(o.note)} |`).join('\n')}

## 3. Nghi vẫn sai trong bảng iztro (${suspicious.length} mục)

\`common.json\` của iztro (vi-VN) có mục trông như máy dịch. Common.json bị R5 loại khỏi
sync nên các mục này không vào \`terms.generated.ts\`; một số đã được override ở bảng 2,
số còn lại nằm ở đây để bạn duyệt. Từ nào sai, điền bản dịch đúng vào cột "Nên là".

| Hán | Việt của iztro | key trong common.json | Nên là (điền vào đây) |
|---|---|---|---|
${suspicious.map((s) => `| ${esc(s.zh)} | ${esc(s.vi)} | ${s.key} |  |`).join('\n')}

## Cách sửa (quy trình duy nhất)

1. Mở \`lib/i18n/terms.override.ts\`.
2. Thêm/sửa một dòng \`{ zh: '…', vi: '…', kind: '…', note: 'vì sao' }\` — note bắt buộc.
3. Chạy \`npm test\` (chart-name-coverage sẽ báo nếu engine sinh tên mà bảng chưa phủ),
   rồi \`npm run terms:report\` để tái sinh chính file này.
`;

writeFileSync('docs/TERMINOLOGY-REVIEW.md', md, 'utf8');
console.log(
  `✓ docs/TERMINOLOGY-REVIEW.md — ${ours.length} mục ta tự quyết, ` +
  `${suspicious.length} mục nghi sai, ${iztroCount} mục iztro đã phủ (61 ID sao của repo nằm trong số đó).`,
);
