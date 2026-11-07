# Thiết kế: Song ngữ Trung–Việt cho ziwei-doushu

- **Ngày:** 2026-11-05
- **Phạm vi:** thêm lớp hiển thị tiếng Việt song song với tiếng Trung cho toàn bộ surface người dùng thấy (UI + thuật ngữ + văn giải đoán + landing + SEO + thư viện).
- **Trạng thái:** chờ người dùng duyệt trước khi lập kế hoạch triển khai.

## 1. Bối cảnh

Repo `F:\Linhtinh\ziwei-doushu` là engine lập lá số Tử Vi theo hệ Thiên Cơ của Ni Hải Hạ,
toàn bộ giao diện và dữ liệu đang là tiếng Trung. Người dùng là người Việt, cần dùng cho
cả hai việc: tự xem lá số và đưa cho khách xem.

Yêu cầu đã chốt qua trao đổi:

| Quyết định | Lựa chọn |
|---|---|
| Cách trình bày | **Song ngữ song song** — Việt là chính, Hán là phụ. Không có nút chuyển ngôn ngữ, không phát sinh state. |
| Độ phủ | **Toàn bộ** (đợt A + B + C) |
| Người duyệt thuật ngữ | **Không bắt buộc** — người dùng không nắm chuyên môn, nên mặc định do phía triển khai quyết định kèm nghiên cứu; người dùng chỉ sửa khi muốn, và nhận danh sách từ khó để nghiên cứu sau. |

## 2. Ràng buộc đã xác minh bằng code thật

Tất cả các mục dưới đây đã đọc/đo trực tiếp, không phải suy đoán.

1. **Tên sao/cung là khóa logic của engine, không phải chuỗi hiển thị.**
   `lib/ziwei/algorithm.ts:575` so sánh `p.name === '命宫'`; `:626` tìm
   `s.name === '紫微' && s.type === 'major'`. `scripts/regression/` có **22 assertion**
   kiểm định bằng chữ Hán. Dịch ở tầng dữ liệu là làm gãy bộ test đang xanh.

2. **iztro ship sẵn locale `vi-VN` với thuật ngữ Hán Việt chuẩn.**
   `node_modules/iztro/lib/i18n/locales/vi-VN/` gồm `star.js` (163 mục), `palace.js` (15 mục,
   `soulPalace: 'Mệnh'`, `wealthPalace: 'Tài Bạch'`, `friendsPalace: 'Nô Bộc'`…),
   `brightness.js` (8 mục), cùng `heavenlyStem` / `earthlyBranch` / `mutagen` /
   `fiveElementsClass` / `gender`. Đây là nguồn thuật ngữ đáng tin hơn bản tự dịch.

3. **i18n của iztro không dùng được trực tiếp.**
   `iztro/lib/i18n/index.d.ts` export `setLanguage` là **module state toàn cục** (i18next
   singleton) và không được re-export từ entry point `iztro/lib/index.d.ts` (chỉ có `data`,
   `star`, `util`, `astro`). Gọi `setLanguage` trong server component sẽ làm các request
   đồng thời dùng chung ngôn ngữ → lá số khách này rò sang request khách khác.

4. **Repo chưa có hạ tầng i18n nào.** `package.json` không có `next-intl`/`i18next`/`react-intl`.
   `app/layout.tsx:41` hardcode `<html lang="zh-CN">`, `:21` đặt `locale: 'zh_CN'` cho metadata.

5. **Chuỗi hiển thị đang hardcode rải rác, không qua bảng nào.**
   Số dòng chứa chữ Hán (đã trừ dòng chỉ có comment):

   | Khu vực | Dòng CJK | Là comment | Cần dịch |
| Corpus Ni Hải Hạ | Dịch, nhưng chỉ trong khu nghiên cứu miễn phí. Không khẩn cấp: `lib/nihai/` hiện không được render ở đâu (mục 6). |
   |---|---|---|---|
   | `app/` | 501 | 73 | ~428 |
   | `components/` | 609 | 93 | ~516 |
   | `lib/ziwei/` | 2316 | — | thuật ngữ + bảng sáng độ + văn 格局 |
   | `lib/nihai/` | 1027 | — | corpus sách — **không được render ở đâu cả**, xem mục 6 |
   | `lib/classics/` | 169 | — | kinh văn cổ — **không dịch** |
   | `lib/seo/` | 41 | — | metadata |
   | `scripts/` | 298 | — | test, giữ nguyên |

   File nặng nhất: `app/page.tsx` 1191 dòng, `lib/ziwei/patterns.ts` 1126,
   `lib/ziwei/cities.ts` 704, `components/BirthForm.tsx` 489, `components/InsightPanel.tsx` 469.

6. **Repo có test cấm tên phần mềm Tử Vi thứ ba.** `scripts/regression/neutral-naming.test.ts`
   quét **mọi file được git theo dõi** (`.ts .tsx .json .css .md …`) và fail nếu xuất hiện
   tên/thương hiệu bị cấm. File Việt thêm mới cũng phải tuân thủ ràng buộc này.

7. **Font là hệ thống, không có webfont.** `app/globals.css:8`:
   `--font: -apple-system, 'PingFang SC', 'Helvetica Neue', 'Segoe UI', sans-serif`.
   System stack không có glyph CJK đáng tin trên Windows/Android, nên phần chữ Hán nhỏ sẽ rơi
   về font dự phòng và lệch độ đậm với phần tiếng Việt khi đặt cạnh nhau.

8. **Bản open-source không có backend giải đoán AI.** `POST /api/interpret` trả 404 (đã quan sát
   trong console khi chạy `/chart`). Toàn bộ phần tiếng Việt trong dự án này là text tĩnh;
   không có suy luận AI bằng tiếng Việt.

## 3. Kiến trúc đã chọn

### 3.1 Nguyên tắc gốc: tiếng Trung là khóa, tiếng Việt là lớp phủ

Không sửa `lib/ziwei/algorithm.ts`, không sửa bảng `school-data`/`school-tables`, không đổi
`astro.bySolar(..., 'zh-CN')`. Nhờ đó 17 bộ test hồi quy giữ nguyên kết quả và engine không
bao giờ phụ thuộc vào bản dịch.

### 3.2 Ba bảng tra, tất cả keyed bằng chính chuỗi/định danh tiếng Trung

Điểm thiết kế quan trọng nhất: **key là literal tiếng Trung đã có sẵn trong source**. Vì vậy
không phải đặt tên key, không phải luồn prop vào từng component, không phải refactor JSX —
chi phí trích xuất chuỗi gần bằng 0, và mọi bản dịch tập trung vào một chỗ để sửa.

```
lib/i18n/
  terms.generated.ts   # zh→vi cho THUẬT NGỮ, seed tự động từ iztro vi-VN (không sửa tay)
  terms.override.ts    # quyết định của ta: mục iztro thiếu, mục nghi ngờ, mục muốn đổi
  ui-phrases.ts        # câu/label UI: '请选择出生年份' → 'Vui lòng chọn năm sinh'
  prose/patterns.ts    # văn 格局, keyed theo tên cách cục
  prose/stars.ts       # keywords/nature của STAR_DESCRIPTIONS
  prose/nihai.ts       # corpus sách (đợt C)
  resolve.ts           # API tra + fallback, KHÔNG có mutable state cấp module
components/Bi.tsx      # thành phần hiển thị song ngữ
scripts/i18n/sync-terms.ts    # sinh lại terms.generated.ts từ iztro
scripts/i18n/report-terms.ts  # sinh docs/TERMINOLOGY-REVIEW.md
```

```ts
export type TermKind =
  | 'star' | 'palace' | 'brightness' | 'mutagen'
  | 'stem' | 'branch' | 'hour' | 'element' | 'gender' | 'pattern' | 'misc';

export interface TermEntry {
  zh: string;
  vi: string;
  kind: TermKind;
  source: 'iztro' | 'researched' | 'default';  // 'default' = chưa có bằng chứng, đưa vào danh sách cần xem
  note?: string;                                // lý do chọn / nguồn tham khảo
}

/** Tra một thuật ngữ. Không throw; thiếu thì trả về undefined. */
export function viTerm(zh: string, kind?: TermKind): string | undefined;

/** Cho cặp hiển thị. Thiếu bản dịch → vi === zh (chỉ hiện chữ Hán, không vỡ layout). */
export function biTerm(zh: string, kind?: TermKind): { zh: string; vi: string; missing: boolean };

/** Tra câu UI theo đúng literal tiếng Trung. */
export function biText(zh: string): { zh: string; vi: string; missing: boolean };

/** Cho câu có nội suy. Key là CHÍNH template string chứa placeholder. */
export function biFmt(zhTemplate: string, args: Record<string, string | number>): { zh: string; vi: string; missing: boolean };
```

**Vì sao cần `biFmt`:** nhiều câu trong `BirthForm` ghép động, ví dụ
`components/BirthForm.tsx:97` → `` `${m}月没有${d}日` `` và `:115` → `` `${y}年${m}月${d}日` ``.
Những câu này không keyed bằng literal trần được. Cách giải quyết: key là đúng chuỗi template
gốc (`'{m}月没有{d}日'`), bản dịch giữ nguyên placeholder (`'{d} không có trong tháng {m}'`),
`biFmt` thay giá trị vào cả hai vế. Thứ tự từ trong bản dịch Việt có thể đảo so với Hán —
nên placeholder bắt buộc phải có tên, không dùng vị trí.

**Tính chất "không gì chặn bạn":** thiếu bản dịch thì UI vẫn render đúng bằng tiếng Trung.
Không có trạng thái nào phải chờ người dùng duyệt.

### 3.3 Sửa về sau = sửa một dòng

`terms.override.ts` luôn thắng `terms.generated.ts`. Khi iztro lên phiên bản mới, chạy
`npm run terms:sync` để seed lại bảng generated — **quyết định của ta không bị ghi đè**, vì nó
nằm ở file separate. Đây là cơ chế trả lời trực tiếp cho yêu cầu "sau này sửa được".

Muỗi đổi một thuật ngữ (ví dụ `Thiên Hình` → `Thiên Diêu`): sửa 1 dòng trong `terms.override.ts`,
toàn bộ lá số + panel + trang thư viện đổi theo, không đụng component nào.

### 3.4 Danh sách từ khó — phân công lại việc

Người dùng không phải là người duyệt bắt buộc. Thay vào đó:

1. Phía triển khai **nghiên cứu trước** mọi mục `source !== 'iztro'` bằng tài liệu Tử Vi tiếng
   Việt công khai, ghi nguồn vào `note`.
2. `scripts/i18n/report-terms.ts` sinh `docs/TERMINOLOGY-REVIEW.md` gồm 3 bảng:
   - **Đã chốt từ iztro** — không cần xem.
   - **Cần bạn xem** — mục iztro thiếu hoặc các nguồn Việt mâu thuẫn: liệt kê 中文, các phương
     án Việt, nghĩa, *xuất hiện ở màn hình nào*, và mặc định đang dùng.
   - **Nghi vẫn sai** — heuristic: sao có trong `school-data` (85 ID) nhưng không có trong bảng
     star của iztro (163 mục), thuật ngữ chưa dùng đến lần nào.
3. Trang `/thuat-ngu` trong app hiển thị toàn bộ bảng tra song ngữ — để bạn và khách đọc đối
   chiếu, và để bạn phát hiện từ sai bằng mắt khi dùng bình thường.

Bạn làm gì với danh sách đó là tùy; không bước nào trong triển khai chờ câu trả lời.

### 3.5 Hợp đồng hiển thị song ngữ

```tsx
<Bi kind="star" zh={star.name} />          // 'Vũ Khúc' + '武曲' nhỏ bên dưới
<Bi kind="palace" zh={palace.name} />
<Bi text="请选择出生年份" />                  // câu UI, tra ui-phrases
<Bi fmt={'{m}月没有{d}日'} args={{ m, d }} /> // câu có nội suy
<Bi none label="Vũ Khúc" sub="武曲" />        // khi đã có sẵn bản dịch
```

`<Bi>` nhận **một trong bốn mode** (`kind` | `text` | `fmt` | `none`), không suy ra từ
`TermKind`. `TermKind` chỉ áp dụng cho mode `kind`; `text`/`fmt`/`none` không cần kind.
Đây là interface duy nhất in bản dịch ra màn hình — nghĩa là muốn tắt hẳn lớp Việt thì chỉ
sửa một component.

- **Lá số (mật độ cao):** Việt chữ chính, Hán chữ phụ ~10–11px, muted. Ở ô nhỏ, dùng class
  ẩn chữ Hán dưới breakpoint để không tràn ô.
- **Văn giải đoán:** tiếng Việt là đoạn chính; nguyên văn Hán đặt trong
  `<details>` "Xem nguyên văn 原文" — khách đọc mạch, người nghiên cứu vẫn đối chiếu được.
- **Tiếp cận:** chữ Hán bọc `lang="zh-Hans"` để screen reader và font engine xử lý đúng; phần
  Việt giữ `lang="vi"`. `app/layout.tsx` chuyển sang `lang="vi"` vì Việt là ngôn ngữ chính.

### 3.6 Typography

Thêm fallback CJK tường minh vào `--font` (giữ font Latin đứng trước để tiếng Việt dùng
Segoe UI / system, chỉ glyph Hán mới rơi về CJK):

```
--font: -apple-system, 'Segoe UI', 'Helvetica Neue', 'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
```

Quyết định này kiểm chứng bằng screenshot thật ở 2 kích thước (desktop + mobile) trong đợt A,
không chỉ dựa vào lý thuyết.

## 4. Phạm vi và các quyết định có chủ đích

### Đợt A — Lá số và biểu mẫu (dùng được ngay)

- Thuật ngữ: sao, cung, độ sáng, tứ hóa, can chi, 12 giờ canh, ngũ hành, giới hạn — qua
  `terms.generated.ts` + `terms.override.ts`.
- `components/ChartBoard.tsx` (285 dòng): nhãn cung/sao, overlay 限/年, 三方四正.
- `components/BirthForm.tsx` (489): nhãn, message validate (`lib/i18n/ui-phrases.ts`), `SHICHEN_NAMES`.
- `components/StarDetailPanel.tsx`, `ChartSummary.tsx`, điều hướng + footer.
- **`lib/ziwei/cities.ts` (704 dòng) — chỉ thêm chú giải Việt cho ~34 đơn vị cấp tỉnh**, giữ
  nguyên tên huyện/thị. Dịch hàng trăm địa danh Trung Quốc ít giá trị, dễ sai, và danh sách này
  chỉ dùng để hiệu chỉnh giờ thật-mặt-trời.

### Đợt B — Văn giải đoán tự động

- `lib/ziwei/patterns.ts` (1126): thêm bản dịch trong `prose/patterns.ts`, keyed theo tên cách
  cục. **Không** đổi logic phát hiện; `required`/điều kiện vẫn dùng chữ Trung.
- `STAR_DESCRIPTIONS` (`lib/ziwei/constants.ts:112`, cấu trúc `{keywords, nature, element}`):
  `keywords` và `nature` dịch qua `prose/stars.ts` keyed theo tên sao; `element` dùng bảng
  ngũ hành chung.
- `InsightPanel.tsx` (469), `PatternsCard.tsx`, `ShareCardCanvas.tsx` (canvas vẽ card chia sẻ
  phải load đúng font cho cả hai chữ — kiểm bằng screenshot).

### Đợt C — Landing, SEO, thư viện

- `app/page.tsx` (1191) và `lib/seo` (41): Việt là chính cho title/description; metadata
  `locale` → `vi_VN`.
- `lib/classics/` (169): **giữ nguyên văn kinh văn, chỉ thêm chú giải Việt** vào field
  `translation` đã có sẵn (mục 5). Lý do: đây là tư liệu gốc (`《骨髓赋》`…), dịch ra là mất
  khả năng đối chiếu và dễ sai ý; người xem lá số cần tra được bản gốc.
- `app/heming/page.tsx` (369, hợp bàn) dùng lại toàn bộ bảng thuật ngữ của đợt A.
- **`lib/nihai/` (1207 dòng) — KHÔNG dịch, và đây là chỗ tôi tự sửa spec của mình.**
  `grep -rln nihai` trên toàn repo (trừ chính thư mục đó và `node_modules`) trả về **rỗng**:
  corpus này không được `app/**` hay `components/**` import ở bất kỳ đâu. Đó là dữ liệu chết
  trong bản open-source. Dịch 1207 dòng không render ra màn hình nào là lãng phí, và cũng không
  giảm rủi ro gì vì nó vốn không đến với khách. Xem mục 6 để biết hệ quả với quyết định đã chọn.

## 5. Thêm sách Tử Vi mới về sau (đã có sẵn chỗ, không phải code)

Người dùng hỏi về khả năng nạp thêm sách sau này. Đã đọc cấu trúc thật và câu trả lời là
**kiến trúc hiện tại đã thiết kế sẵn cho việc này**, cụ thể:

**Đường nạp sách** (`lib/classics/`):
1. Tạo `lib/classics/data/<ten-sach>.ts` export một object theo interface `Book`
   (`lib/classics/types.ts:29` — `title / slug / dynasty / author / intro / wordCount / chapters`).
2. Thêm vào mảng `ALL_BOOKS` tại `lib/classics/index.ts:14` — **đúng một dòng**.
3. Xong. `/library/[book]` và `/library/search` tự nhận vì cả hai đọc từ `ALL_BOOKS`;
   `TOTAL_PARAGRAPHS` tự cộng. **Không sửa component nào.**

Hiện đã có 3 sách / 75 đoạn (`gusuifu` 29, `quanji` 29, `quanshu` 17).

**Chỗ để bản dịch tiếng Việt — đã có và đã được render.** Interface `Paragraph`
(`lib/classics/types.ts:8`) khai báo:
```ts
text: string;            // nguyên văn cổ văn
translation?: string;    // "现代翻译（可选，未来填充）" — dịch hiện đại, để trống toàn bộ hiện nay
niNote?: string;         // chú giải Ni sư, có ghi nguồn
```
Cả hai field **đã được render có điều kiện** tại
`app/library/[book]/[chapter]/page.tsx:103` (`translation`) và `:118` (`niNote`), mỗi cái có
kiểu riêng. Nghĩa là muốn hiện chú giải Việt cho một đoạn, chỉ việc điền chữ vào `translation` —
**zero thay đổi giao diện**. Đây là chỗ tự nhiên nhất để đặt tiếng Việt cho sách cổ, và nó
không xung đột gì với nguyên văn Hán.

**Ràng buộc bản quyền khi thêm sách — quan trọng hơn phần kỹ thuật.**
Sách hiện có được ghi rõ là 公版 (public domain) trong `lib/classics/types.ts:4`. Khi nạp sách mới:
- **An toàn:**古籍公版 (Ngũ Hành Loại?, các bản cổ hết hạn bảo hộ), tự do dùng cả thương mại.
- **Không tự nhiên mà được:** sách in hiện đại, bản dịch/đào tạo có bản quyền, và **bản ghi giảng
  của Ni Hải Hạ** — xem mục 6.
- Mỗi file sách mới phải có comment đầu file ghi rõ nguồn + tình trạng bản quyền, theo đúng
  cách repo đang làm.

## 6. Bản quyền — phải đọc trước khi dùng cho khách

Repo này **không có một giấy phép duy nhất**. Bốn lớp, đọc từ chính các file license:

| Nội dung | Giấy phép | Dùng thương mại? |
|---|---|---|
| Code (`LICENSE`) | MIT | ✅ Được |
| Dataset sample/interpretation (GitHub Releases, `DATASET-LICENSE`) | CC BY 4.0 | ✅ Được, **bắt buộc ghi nguồn** |
| Cổ văn trong `lib/classics/` | 公有领域 (public domain) — ghi tại `lib/classics/types.ts:4` và `DATASET-LICENSE:15` | ✅ Được |
| **Trích giảng Ni Hải Hạ** trong `docs/tianji-ziwei/*.md` (24 file `.md`) | **CC BY-NC-SA 4.0** — `docs/tianji-ziwei/LICENSE.md` nói rõ mục này **không** theo MIT, không theo DATASET-LICENSE,著作权归倪海厦及权利继承人 | ❌ **Không** |

**Chỗ cần dừng lại:** `DATASET-LICENSE:41-44` ghi nguyên văn rằng các lời trích 《天纪》 trong văn
giải đoán **không nằm trong phạm vi授权 của dataset**, muốn dùng thành批次 thì phải theo
CC BY-NC-SA 4.0. Mà `lib/nihai/tianji.ts` (548 dòng) và `renji.ts` (659 dòng) chính là cơ sở dữ
liệu cấu trúc hóa từ các bài giảng đó.

Hệ quả thẳng thắn: **bản dịch tiếng Việt là một tác phẩm phái sinh**, nên mang theo điều kiện NC.
Dịch corpus 天纪 sang Việt rồi đưa cho khách trả tiền dùng — vượt quá quyền mà repo cấp, dù chỉ
một dòng code cũng không sửa được điều đó. Đây là quyết định pháp lý/kinh doanh của bạn, không
phải trở ngại kỹ thuật, nên tôi nêu ở đây trước khi bắt đầu đợt C.

Lựa chọn của người dùng (đã chốt): **dịch corpus nhưng chỉ để trong khu nghiên cứu miễn phí.**
Áp dụng vào thực tế repo này như sau — và thực tế khác với lo ban đầu:

- `lib/nihai/` **không được render ở đâu cả** (đã kiểm chứng, xem mục 4 Đợt C). Nên quyết định
  "khu nghiên cứu miễn phí" hiện **không việc gì phải làm trong đợt C**: không có màn hình nào
  chứa lời giảng để mà dịch hay mà giấu.
- Việc còn lại chỉ là **quy tắc cho tương lai**: nếu về sau bạn muốn *bật* `lib/nihai` lên UI
  (trang nghiên cứu 研究), thì nội dung tiếng Việt của nó phải nằm ở khu không thu phí,
  không upsell, không quảng bá bằng nó, giữ nguyên notice CC BY-NC-SA và ghi 著作权归倪海厦及权利继承人.
  Bản dịch Việt là tác phẩm phái sinh nên mang theo NC-SA vĩnh viễn, không "rửa" được bằng cách dịch.
- Phần **đang thực sự** hiện trong UI liên quan tới Ni Hải Hạ chỉ là *chữ để gọi tên hệ thống*:
  `app/knowledge/page.tsx:11-13,47` và `app/heming/page.tsx:199,247` ghi "基于倪海厦《天纪》体系".
  Đây là dẫn giải tên (nominative reference), không phải trích nguyên văn, và nội dung tri thức
  mà trang đó render đến từ `lib/ziwei/constants.ts` / `school-data` do repo tự viết (MIT).
  Dịch sang Việt thì vẫn giữ cách diễn đạt "theo hệ thống Thiên Cơ của Ni Hải Hạ" là an toàn.
- `docs/tianji-ziwei/*.md` (24 file) là nội dung NC-SA thật, nằm trong repo dưới dạng tài liệu
  nguồn chứ không phải trang sản phẩm. Fork lên GitHub **công khai** kèm các file này là redistribution
  theo NC-SA — cho phép, miễn là repo/dự án không mang tính thương mại đối với chính nội dung đó.
  Nếu sau này repo thành mã nguồn sản phẩm bán hàng, cân nhắc tắt quyền truy cập thư mục này
  hoặc chuyển repo sang private.
- Nếu dùng dataset CC BY 4.0 (file sample/interpretation trên GitHub Releases) thì **bắt buộc ghi
  nguồn** theo `DATASET-LICENSE:28-39` — đặt ở About/footer một dòng: `本项目使用 紫微斗数开源样本
  数据集 v3.0 / 解读数据集 v4.0 · 来源 https://github.com/Renhuai123/ziwei-doushu · 作者 王多鱼AI`.
  Đây là điều kiện duy nhất của license đó, không trả tiền hay xin phép được.
- Giữ nguyên các file `LICENSE` / `DATASET-LICENSE` / `docs/tianji-ziwei/LICENSE.md` — đừng xóa,
  đó chính là bằng chứng tôn trọng giấy phép.

## 7. Kiểm thử và chốt an toàn

1. **Giữ `npm test` xanh** (17 bộ hiện tại) — đây là bằng chứng engine không bị chạm.
   Chạy trước/sau từng đợt.
2. **Test mới `scripts/regression/terminology-coverage.test.ts`** — quét tĩnh, không phải
   runtime (runtime accumulation sẽ tái tạo đúng cái bug state toàn cục đã loại ở mục 2, ý 3):
   - Mọi literal tiếng Trung nằm trong `app/**` và `components/**` phải có mục trong
     `ui-phrases.ts`, trừ danh sách loại trừ **tường minh**: một mảng `EXCLUDE` khai báo từng
     literal kèm lý do (comment, chuỗi debug, tên file test). Không có cơ chế "bỏ qua theo
     pattern" — nếu không, test sẽ âm thầm cho qua đúng thứ nó đáng bắt.
   - Mọi tên sao/cung/độ sáng/tứ hóa mà engine có thể sinh ra (dựng từ `SCHOOL_STAR_ID_TO_NAME`
     + bảng iztro) phải có mục trong glossary.
   - Test fail thì in ra đúng danh sách thiếu — đây chính là "danh sách từ cần xử lý".
   - Test cấm import `setLanguage` từ iztro, và cấm `ui-phrases`/`terms` có mutable export.
3. **`neutral-naming` vẫn phải pass** với mọi file mới.
4. **`npm run typecheck`** sạch sau mỗi đợt.
5. **Xác minh bằng screenshot Playwright** (harness đã chạy được ở bước cài đặt): `/chart` với
   1990-06-15 10h, ở desktop + mobile, đối chiếu ô lá số không tràn chữ. Không kết luận "UI ổn"
   chỉ vì build pass.

## 8. Rủi ro và giới hạn (nói thẳng)

| Rủi ro | Thực tế | Giảm thiểu |
|---|---|---|
| Bản dịch thuật ngữ sai | Tử Vi Việt có nhiều trường phái dùng từ khác nhau; iztro không phải chuẩn mực của Việt Nam | Mặc định có nguồn + ghi trong `note`; danh sách `TERMINOLOGY-REVIEW.md`; sửa 1 dòng là lan tỏa hết |
| Bản dịch văn dài sai ý | Khoảng **2.300 dòng CJK** cần dịch văn (`patterns` 1126 + `page.tsx` ~1118 + `seo` 41), do công cụ tạo. Không tính `lib/nihai` (mục 4 Đợt C). | Việt + nguyên văn Hán cạnh nhau để phát hiện; ưu tiên cách diễn đạt sát câu gốc thay vì paraphrase |
| Repo diverge khỏi upstream | Mọi sửa đổi nằm trong clone của repo OSS, `git pull` sau này sẽ conflict | Gom thay đổi vào file mới (`lib/i18n/*`, `components/Bi.tsx`); chỉ sửa tối thiểu trong file gốc; làm trên branch riêng `feat/vi-bilingual` |
| Layout vỡ vì chữ Việt dài hơn chữ Hán | Lá số 12 ô mật độ cao | Screenshot 2 breakpoint mỗi đợt; class ẩn chữ Hán ở ô hẹp |
| Không có AI giải đoán tiếng Việt | `/api/interpret` không tồn tại ở bản open-source | Ngoài phạm vi — ghi rõ ở mục 10 |

## 9. Trình tự triển khai

Mỗi đợt kết thúc bằng: `npm test` + `npm run typecheck` + regenerate báo cáo thuật ngữ +
screenshot, rồi báo cáo lại. Không dồn cả ba rồi mới đưa bạn xem.

```
A0  sync-terms + glossary + Bi.tsx + coverage test    → khung chạy được, đo độ phủ thật
A1  ChartBoard + BirthForm + nav + StarDetailPanel    → xem được lá số bằng tiếng Việt
B   patterns + STAR_DESCRIPTIONS + InsightPanel       → giải đoán ra tiếng Việt
C   landing + SEO + chú giải classics + heming + /thuat-ngu → phủ hết surface
```

Điểm đo được ở A0 và không đoán trước: số mục iztro thiếu so với 85 ID sao của repo. Báo cáo
thuật ngữ sẽ trả lời con số này bằng bằng chứng thay vì ước lệ.

## 10. Ngoài phạm vi

- Không dịch kinh văn trong `lib/classics` — chú giải Việt đặt vào field `translation` đã có sẵn
  (mục 5), nguyên văn Hán giữ nguyên.
- Không dịch tên huyện/thị trong `lib/ziwei/cities.ts` (chỉ cấp tỉnh).
- Không đổi thuật ngữ trong dữ liệu engine, không đổi `astro.bySolar(..., 'zh-CN')`.
- Không xây backend AI `/api/interpret`; không làm bản tiếng Việt cho nội dung do AI sinh ra.
- Không tách route `/vi` + `/zh` (next-intl) — nếu sau này cần chế độ tiếng-Thuần-Việt hoặc thêm
  ngôn ngữ thứ ba, kiến trúc mục 3.2 cho phép nâng cấp mà không viết lại, vì mọi chuỗi đã đi qua
  một chỗ duy nhất.
- Không đụng `scripts/regression/` hiện có ngoài việc thêm file test mới.
