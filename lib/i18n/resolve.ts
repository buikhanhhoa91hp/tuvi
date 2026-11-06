import { GENERATED_TERMS } from './terms.generated';
import { OVERRIDE_BY_ZH } from './terms.override';
import type { BiPair, TermKind } from './terms.types';

/**
 * API tra thuật ngữ. Không có mutable state cấp module: mọi hàm là pure,
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
