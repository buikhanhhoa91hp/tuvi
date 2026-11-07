export type TermKind =
  | 'star' | 'palace' | 'brightness' | 'mutagen'
  | 'stem' | 'branch' | 'hour' | 'element' | 'gender'
  | 'zodiac' | 'pattern' | 'misc';

export interface OverrideEntry {
  /** Khóa: nguyên văn tiếng Trung như nó xuất hiện trong dữ liệu engine */
  zh: string;
  vi: string;
  kind: TermKind;
  /** Bắt buộc: nguồn hoặc lý do. Không có note thì coi như chưa nghiên cứu. */
  note: string;
}

export interface BiPair {
  zh: string;
  vi: string;
  /** true khi không tìm được bản dịch — vi === zh, UI chỉ hiện chữ Hán */
  missing: boolean;
}
