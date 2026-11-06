import { GENERATED_TERMS } from './terms.generated';
import { OVERRIDE_BY_ZH } from './terms.override';
import { UI_FMT_VI, UI_VI } from './ui-phrases';
import type { BiPair, TermKind } from './terms.types';

/**
 * API tra thuật ngữ và câu UI. Không có mutable state cấp module: mọi hàm là pure,
 * nên an toàn khi nhiều request server rendering chạy đồng thời.
 * (Đây chính là lý do không dùng iztro/lib/i18n setLanguage — xem spec mục 2, ý 3.)
 */
export function viTerm(zh: string, kind?: TermKind): string | undefined {
  if (!zh) return undefined;
  const overrides = OVERRIDE_BY_ZH.get(zh);
  if (overrides) {
    const exact = kind ? overrides.find((o) => o.kind === kind) : undefined;
    const vi = (exact ?? overrides[0]).vi;
    if (vi) return vi;
  }
  const gen = GENERATED_TERMS[zh];
  if (gen) return gen;
  // Cắt hậu tố 宫/星 rồi thử lại: '兄弟宫' → '兄弟', '火星' vẫn ra 'Hỏa Tinh'
  const stripped = zh.length > 1 ? zh.replace(/[宫星]$/, '') : undefined;
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
