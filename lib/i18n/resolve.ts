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

/** `${y}年${m}月${d}日` (template literal trong source) và `{y}年{m}月{d}日` (key trong bảng) là một. */
function normalizeTemplate(template: string): string {
  return template.replace(/\$\{(\w+)\}/g, '{$1}');
}

/**
 * Điền placeholder. `{name}` lấy thẳng args[name]; `{name:N}` padStart(N, '0') —
 * chỉ nên xuất hiện ở vế Việt, vì vế Hán phải tái hiện đúng chuỗi app đã in.
 * Placeholder không có trong args thì giữ nguyên `{name}` (không ném, không 'undefined').
 * `alias` chỉ dùng khi câu được tra khớp theo bộ xương: bảng gọi nó là {m}, call site
 * gọi là {mo} — alias { m: 'mo' } để vế Việt điền đúng giá trị, không in '{m}' ra UI.
 */
function fill(
  template: string,
  args: Record<string, string | number>,
  alias: Record<string, string> = {},
): string {
  return template.replace(/\{(\w+)(?::(\d+))?\}/g, (whole, name: string, pad?: string) => {
    const key = alias[name] ?? name;
    if (!Object.prototype.hasOwnProperty.call(args, key)) return pad ? `{${key}}` : whole;
    const value = String(args[key]);
    return pad ? value.padStart(Number(pad), '0') : value;
  });
}

/** Tên các placeholder, theo thứ tự xuất hiện. */
function placeholderNames(template: string): string[] {
  return [...template.matchAll(/\{(\w+)(?::\d+)?\}/g)].map((m) => m[1]);
}

/**
 * 'Bộ xương' của một câu nội suy: tên placeholder (và dấu cách quanh nó) xóa đi,
 * chỉ còn chữ cố định. '{m} 月' và '{mo}月' cùng bộ xương '{}月'.
 */
function skeleton(key: string): string {
  return normalizeTemplate(key).replace(/\s*\{[^{}]*\}\s*/g, '{}');
}

/**
 * Tra UI_FMT_VI. Khớp tuyệt đối trước; nếu trật, khớp theo bộ xương để tên placeholder
 * ở call site không cần trùng hệt tên trong bảng — lệch TÊN vẫn dịch được, còn lệch
 * CHỮ HÁN thì không bao giờ khớp (đúng như ratchet của Task 5 bắt). Hai câu cùng bộ
 * xương thì placeholder tương ứng theo thứ tự, nên suy ra được alias để điền.
 * Quét trực tiếp thay vì cache một Map cấp module: resolve.ts giữ lời hứa không có
 * state, mà bảng chỉ vài mục nên quét rẻ.
 */
function matchPhrase(template: string): { vi: string; alias: Record<string, string> } | undefined {
  const norm = normalizeTemplate(template);
  const exact = pick(UI_FMT_VI, template) ?? pick(UI_FMT_VI, norm);
  if (exact !== undefined) return { vi: exact, alias: {} };
  const sk = skeleton(norm);
  for (const key of Object.keys(UI_FMT_VI)) {
    if (skeleton(key) !== sk) continue;
    const from = placeholderNames(key);
    const to = placeholderNames(norm);
    const alias: Record<string, string> = {};
    from.forEach((name, i) => { if (to[i] && to[i] !== name) alias[name] = to[i]; });
    return { vi: UI_FMT_VI[key], alias };
  }
  return undefined;
}

/** Tra một câu UI theo đúng literal tiếng Trung. */
export function biText(zh: string): BiPair {
  const vi = pick(UI_VI, zh);
  return vi ? { zh, vi, missing: false } : { zh, vi: zh, missing: true };
}

/**
 * Câu có nội suy. `template` phải là chuỗi gốc chứa {placeholder}, key của
 * UI_FMT_VI cũng phải dùng đúng dạng đó (dạng `${x}` của source cũng nhận).
 * Vế Hán điền theo nguyên bản; vế Việt theo template đã dịch — trật tự từ Việt
 * đảo so với Hán nên placeholder bắt buộc có tên.
 */
export function biFmt(template: string, args: Record<string, string | number>): BiPair {
  const zh = fill(normalizeTemplate(template), args);
  const hit = matchPhrase(template);
  if (!hit) return { zh, vi: zh, missing: true };
  return { zh, vi: fill(hit.vi, args, hit.alias), missing: false };
}

export function hasPhrase(zh: string): boolean {
  return pick(UI_VI, zh) !== undefined || matchPhrase(zh) !== undefined;
}
