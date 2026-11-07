import { GENERATED_TERMS } from './terms.generated';
import { OVERRIDE_BY_ZH, pickOverride } from './terms.override';
import { UI_FMT_VI, UI_VI } from './ui-phrases';
import { PROVINCE_VI } from './place-vi';
import type { BiPair, TermKind } from './terms.types';

/**
 * API tra thuật ngữ và câu UI. Không có mutable state cấp module: mọi hàm là pure,
 * nên an toàn khi nhiều request server rendering chạy đồng thời.
 * (Đây chính là lý do không dùng iztro/lib/i18n setLanguage — xem spec mục 2, ý 3.)
 */
export function viTerm(zh: string, kind?: TermKind): string | undefined {
  if (!zh) return undefined;
  const chosen = pickOverride(OVERRIDE_BY_ZH.get(zh) ?? [], kind);
  if (chosen && chosen.vi) return chosen.vi;
  // Cắt hậu tố 宫/星 rồi thử lại: '兄弟宫' → '兄弟', '火星' vẫn ra 'Hỏa Tinh'.
  // (R-final) Thử lại PHẢI đi theo đúng thứ tự ưu tiên của đường chính — override trước,
  // generated sau — nếu chỉ hỏi GENERATED_TERMS thì một override keyed trên dạng cắt
  // ('测试') sẽ âm thầm thua một mục generated keyed trên dạng đầy đủ ('测试星').
  // Hàm vẫn pure: chỉ đọc hai bảng, không state.
  const stripped = zh.length > 1 ? zh.replace(/[宫星]$/, '') : undefined;
  if (stripped && stripped !== zh) {
    const o = pickOverride(OVERRIDE_BY_ZH.get(stripped) ?? [], kind);
    if (o && o.vi) return o.vi;
  }
  const gen = GENERATED_TERMS[zh];
  if (gen) return gen;
  if (stripped && stripped !== zh) {
    const g = GENERATED_TERMS[stripped];
    if (g) return g;
  }
  return undefined;
}

export function biTerm(zh: string, kind?: TermKind): BiPair {
  const vi = viTerm(zh, kind);
  return vi ? { zh, vi, missing: false } : { zh, vi: zh, missing: true };
}

export function hasTerm(zh: string): boolean {
  return viTerm(zh) !== undefined;
}

/**
 * CANH CHỈ hai chữ (庚午, 辛亥… — algorithm.ts:224-258 sinh fourPillars/fourPillarsLunar
 * bằng `${STEMS[i]}${BRANCHES[j]}`, 60 tổ hợp). Không bịa 60 dòng bảng: tra trực tiếp trước
 * (override vẫn thắng nếu ai đó khai một cột), không có thì TÁCH can + chi và ghép bản dịch
 * sẵn có — '庚午' → 'Canh Ngọ'. Một nửa không tra được → missing:true, vi === zh (UI không
 * hiện nửa Việt nửa Hán). Pure, không state.
 */
export function viPillar(zh: string): BiPair {
  const direct = viTerm(zh);
  if (direct) return { zh, vi: direct, missing: false };
  if (zh.length === 2) {
    const stem = viTerm(zh.slice(0, 1));
    const branch = viTerm(zh.slice(1));
    if (stem && branch) return { zh, vi: `${stem} ${branch}`, missing: false };
  }
  return { zh, vi: zh, missing: true };
}

/** Mọi khóa Hán đã có bản dịch — dùng cho coverage test và báo cáo thuật ngữ. */
export function allTermsZh(): string[] {
  return [...new Set([...Object.keys(GENERATED_TERMS), ...OVERRIDE_BY_ZH.keys()])];
}

// ─── Lớp câu/label (Task 3) — tra theo đúng literal tiếng Trung trong source ───

/** Tra một giá trị trong bảng thường, không để prototype key ('toString', '__proto__') khớp. */
function pick(table: Record<string, string>, key: string): string | undefined {
  return Object.prototype.hasOwnProperty.call(table, key) ? table[key] : undefined;
}

/** Điền placeholder theo TÊN: `{name}` → args[name]; tên không có trong args thì giữ nguyên `{name}`. */
function fill(template: string, args: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (whole, name: string) =>
    Object.prototype.hasOwnProperty.call(args, name) ? String(args[name]) : whole);
}

/** Tra một câu UI theo đúng literal tiếng Trung. */
export function biText(zh: string): BiPair {
  const vi = pick(UI_VI, zh);
  return vi ? { zh, vi, missing: false } : { zh, vi: zh, missing: true };
}

/**
 * Câu có nội suy. `template` phải là chuỗi gốc chứa {placeholder}, key của
 * UI_FMT_VI cũng phải dùng đúng dạng đó — CHỈ khớp tuyệt đối theo key (R14 bỏ hẳn
 * khớp theo bộ xương): `hasPhrase`/`biFmt` nói 'có' thì Task 5 và Task 10 mới đếm đúng.
 * Vế Hán điền theo nguyên bản; vế Việt theo template đã dịch — trật tự từ Việt
 * đảo so với Hán nên placeholder bắt buộc có tên.
 */
export function biFmt(template: string, args: Record<string, string | number>): BiPair {
  const zh = fill(template, args);
  const viTpl = pick(UI_FMT_VI, template);
  if (viTpl === undefined) return { zh, vi: zh, missing: true };
  return { zh, vi: fill(viTpl, args), missing: false };
}

export function hasPhrase(zh: string): boolean {
  return pick(UI_VI, zh) !== undefined || pick(UI_FMT_VI, zh) !== undefined;
}

// ─── Lớp địa danh (Task c6) — nhãn CHO 34 đơn vị cấp tỉnh, khóa tra không đổi ───

/**
 * Nhãn Việt của một địa danh cấp tỉnh. Bảng địa danh đi TRƯỚC, các tra cứu sẵn có
 * (viTerm — phòng khi thuật ngữ generated/override có mục tên riêng) là fallback.
 * CHỈ hiển thị: người gọi vẫn phải giữ nguyên chuỗi Hán làm key/value (form.province,
 * `value=` của <option>, dữ liệu lưu vào lá số) — xem header lib/i18n/place-vi.ts.
 * Pure: pick() có hasOwnProperty nên prototype key ('toString', '__proto__') không khớp;
 * không mutable state cấp module, an toàn khi server rendering chạy đồng thời.
 */
export function viPlace(zh: string): string | undefined {
  if (!zh) return undefined;
  const fromTable = pick(PROVINCE_VI, zh);
  if (fromTable) return fromTable;
  return viTerm(zh);
}

/** Cặp hiển thị cho địa danh: vế Việt qua viPlace, vế Hán là chính chuỗi key. */
export function biPlace(zh: string): BiPair {
  const vi = viPlace(zh);
  return vi ? { zh, vi, missing: false } : { zh, vi: zh, missing: true };
}
