import type { TermKind } from '@/lib/i18n/terms.types';
import { biFmt, biTerm, biText } from '@/lib/i18n/resolve';

/**
 * Điểm DUY NHẤT in bản dịch ra màn hình.
 * Muốn tắt hẳn lớp Việt hoặc thêm ngôn ngữ thứ ba: sửa file này, không sửa từng component.
 *
 * Khong co side effect va khong doc module state → an toàn trong server rendering.
 */
export type BiProps =
  | { mode: 'term'; zh: string; kind?: TermKind; className?: string; compact?: boolean }
  | { mode: 'text'; zh: string; className?: string; compact?: boolean }
  | { mode: 'fmt'; template: string; args: Record<string, string | number>; className?: string; compact?: boolean }
  | { mode: 'pair'; zh: string; vi: string; className?: string; compact?: boolean };

export default function Bi(props: BiProps) {
  let pair: { zh: string; vi: string };
  if (props.mode === 'term') pair = biTerm(props.zh, props.kind);
  else if (props.mode === 'text') pair = biText(props.zh);
  else if (props.mode === 'fmt') pair = biFmt(props.template, props.args);
  else pair = { zh: props.zh, vi: props.vi };

  const cls = ['bi', props.compact ? 'bi-compact' : '', props.className ?? '']
    .filter(Boolean).join(' ');

  // Thiếu bản dịch: chỉ hiện chữ Hán, không hiện trùng hai dòng
  if (pair.vi === pair.zh) return <span className={cls}>{pair.zh}</span>;

  return (
    <span className={cls}>
      <span className="bi-vi">{pair.vi}</span>
      <span className="bi-zh" lang="zh-Hans">{pair.zh}</span>
    </span>
  );
}
