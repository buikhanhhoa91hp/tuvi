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
  | { mode: 'fmt'; template: string; args: Record<string, string | number>; className?: string; compact?: boolean };

export default function Bi(props: BiProps) {
  let pair: { zh: string; vi: string };
  if (props.mode === 'term') pair = biTerm(props.zh, props.kind);
  else if (props.mode === 'text') pair = biText(props.zh);
  else pair = biFmt(props.template, props.args);

  const cls = ['bi', props.compact ? 'bi-compact' : '', props.className ?? '']
    .filter(Boolean).join(' ');

  // Thiếu bản dịch: chỉ hiện chữ Hán, không hiện trùng hai dòng.
  // lang="zh-Hans" là bắt buộc (R25): Task 9 đặt document lang="vi"; span không có lang
  // sẽ bị trình đọc màn hình đoán là tiếng Việt và đọc chữ Hán theo kiểu Việt.
  if (pair.vi === pair.zh) return <span className={cls} lang="zh-Hans">{pair.zh}</span>;

  return (
    <span className={cls}>
      <span className="bi-vi" lang="vi">{pair.vi}</span>
      <span className="bi-zh" lang="zh-Hans">{pair.zh}</span>
    </span>
  );
}
