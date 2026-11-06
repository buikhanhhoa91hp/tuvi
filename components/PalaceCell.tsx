'use client';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { Palace, Star } from '@/lib/ziwei/types';
import { STEMS, BRANCHES } from '@/lib/ziwei/constants';
import clsx from 'clsx';
import Bi from './Bi';
import { biTerm, viPillar } from '@/lib/i18n/resolve';

interface PalaceCellProps {
  palace: Palace;
  onClick?: () => void;
  onStarClick?: (star: Star) => void;
  isSelected?: boolean;
  isSanFang?: boolean;
  delay?: number;
  /** 叠加四化：星名 → 四化类型（'禄'/'权'/'科'/'忌'） */
  overlayStarSiHua?: Record<string, string>;
  /**
   * Nhãn overlay ('限' đại hạn / '年' lưu niên). Ở đây nó là NODE ĐÃ DỊCH chứ không phải
   * chuỗi Hán: ChartBoard dựng bằng <Bi mode="term"> nên R28 thấy literal nằm trong lời
   * dịch, và cung không bao giờ so sánh nhãn này với dữ liệu engine (chỉ in).
   */
  overlayLabel?: ReactNode;
  /** 点击叠加四化 badge 回调 */
  onSiHuaClick?: (starName: string, siHua: string) => void;
}

/**
 * Bảng màu badge tứ hóa. KEY là ký tự Hán engine trả ra (`Star.siHua`, types.ts:39) nên
 * phép so khớp phải giữ nguyên chữ Hán — dịch key ra là mất màu.
 *
 * Key viết qua `biTerm(..).zh` thay vì chuỗi Hán trần, vì PalaceCell nằm trong ADOPTED của
 * ratchet (R28) và ratchet đo theo VỊ TRÍ chuỗi, không biết "đây là dữ liệu chứ không phải
 * nhãn UI". `biTerm().zh` là đồng nhất (thiếu bản dịch thì viTerm trả undefined, biTerm trả
 * { zh } nguyên văn — xem resolve.ts:26-29) nên key KHÔNG bao giờ đổi; đồng thời nó khai báo
 * "bốn chuỗi này là THUẬT NGỮ mutagen", đúng loại, thay vì xin miễn trừ trong EXCLUDE.
 * Xóa lời gọi biTerm ở đây → ratchet báo ngay (chứng minh ở task-7-report.md).
 */
const SIHUA_STYLES: Record<string, string> = {
  [biTerm('禄', 'mutagen').zh]: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  [biTerm('权', 'mutagen').zh]: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  [biTerm('科', 'mutagen').zh]: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  [biTerm('忌', 'mutagen').zh]: 'text-red-400 bg-red-500/10 border-red-500/30',
};

const SiHuaBadge = ({
  siHua,
  overlay,
  label,
  onClick,
}: {
  siHua: string;
  overlay?: boolean;
  label?: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center text-[8px] px-1 rounded-full border leading-none py-px font-bold ml-1 flex-shrink-0',
        SIHUA_STYLES[siHua],
        overlay && 'border-dashed opacity-80',
        onClick && 'cursor-pointer hover:opacity-100',
      )}
      onClick={onClick}
    >
      {overlay && label && <span className="mr-px opacity-70">{label}</span>}
      {/* siHua vẫn là ký tự Hán (key engine); <Bi> chỉ in thêm bản Việt bên cạnh. */}
      <Bi mode="term" zh={siHua} kind="mutagen" className="bi-badge" compact />
    </span>
  );
};

export default function PalaceCell({
  palace, onClick, onStarClick, isSelected, isSanFang, delay = 0,
  overlayStarSiHua, overlayLabel, onSiHuaClick,
}: PalaceCellProps) {
  const { branch, stem, name, stars, daXianAge, isCurrentDaXian, isMingGong, isShenGong } = palace;
  const ganzhi = `${STEMS[stem]}${BRANCHES[branch]}`, pillar = viPillar(ganzhi);

  const majorStars = stars.filter(s => s.type === 'major');
  const luckyStars = stars.filter(s => s.type === 'lucky');
  const shaStars = stars.filter(s => s.type === 'sha');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      onClick={onClick}
      className="relative flex flex-col p-1.5 cursor-pointer transition-all duration-200 h-full"
      style={{
        minHeight: '90px',
        background: isCurrentDaXian
          ? 'rgba(147,51,234,0.08)'
          : isSelected
          ? 'rgba(37,99,235,0.18)'
          : isSanFang
          ? 'rgba(37,99,235,0.09)'
          : isMingGong
          ? 'rgba(212,168,67,0.04)'
          : 'var(--t-bg)',
        boxShadow: isCurrentDaXian
          ? 'inset 3px 0 0 rgba(147,51,234,0.5)'
          : isSelected
          ? 'inset 0 0 0 1.5px rgba(37,99,235,0.7)'
          : isSanFang
          ? 'inset 0 0 0 1px rgba(37,99,235,0.4)'
          : 'none',
      }}
    >
      {/* 大限年龄 */}
      {daXianAge && (
        <div className={clsx(
          'absolute top-1 right-1 text-[9px] font-mono tabular-nums',
          isCurrentDaXian ? 'text-purple-400' : ''
        )}
          style={!isCurrentDaXian ? { color: 'var(--t-faint)', opacity: 0.75 } : undefined}
        >
          {daXianAge[0]}–{daXianAge[1]}
        </div>
      )}

      {/* 宫名行 */}
      <div className="flex items-center gap-1 mb-0.5 pr-8">
        <span className={clsx('text-[10px] font-medium tracking-wide',
          isMingGong ? 'text-amber-500' : isShenGong ? 'text-sky-500' : ''
        )}
          style={!isMingGong && !isShenGong ? { color: 'var(--t-faint)' } : undefined}
        >
          <Bi mode="term" zh={name} kind="palace" className="bi-cell" compact />
        </span>
        {isMingGong && (
          <span className="text-[7px] text-amber-500/80 border border-amber-500/30 px-0.5 rounded leading-tight">命</span>
        )}
        {isShenGong && (
          <span className="text-[7px] text-sky-500/80 border border-sky-500/30 px-0.5 rounded leading-tight">身</span>
        )}
      </div>

      {/* Thiên Can Địa Chi của cung. ĐÂY LÀ GIÁ TRỊ NỘI SUY lúc chạy
          (`${STEMS[stem]}${BRANCHES[branch]}`, constants.ts:2,5) nên ratchet R28 vô hình với nó —
          nó đo literal, không đo kết quả nội suy: để `{ganzhi}` trần thì người Việt nhận '丙辰'
          giữa bàn lá số đã song ngữ. Lớp dịch đúng là viPillar: nó tách '丙'+'辰' và ghép
          'Bính Thìn' (biTerm('丙辰') thì missing → vẫn in chữ Hán, vì không khóa 2 chữ nào trong
          bảng). Cách in mô phỏng đúng Bi.tsx:27-34 — Việt là dòng chính, Hán phụ, lang="zh-Hans"
          bắt buộc (R25) — cùng chiều với cách ChartBoard.tsx:184 render chi bằng
          <Bi mode="term" … kind="branch">. Không gọi <Bi> trực tiếp ở đây vì props của nó
          (mode term/text/fmt) không nhận một cặp can+chi đã ghép. */}
      <div className="text-[9px] font-mono mb-1" style={{ color: 'var(--t-faint)', opacity: 0.75 }}>
        {pillar.missing
          ? <span className="bi bi-cell bi-compact" lang="zh-Hans">{pillar.zh}</span>
          : (
            <span className="bi bi-cell bi-compact">
              <span className="bi-vi" lang="vi">{pillar.vi}</span>
              <span className="bi-zh" lang="zh-Hans">{pillar.zh}</span>
            </span>
          )}
      </div>

      {/* 主星 */}
      <div className="flex flex-col gap-0.5 flex-1">
        {majorStars.length === 0 && (
          <span className="text-[10px] italic" style={{ color: 'var(--t-faint)', opacity: 0.6 }}>
            <Bi mode="text" zh="空宫" className="bi-cell" compact />
          </span>
        )}
        {majorStars.map((star) => {
          const overlaySiHua = overlayStarSiHua?.[star.name];
          return (
            <div
              key={star.name}
              className="star-row flex items-center"
              onClick={e => { e.stopPropagation(); onStarClick?.(star); }}
            >
              <span className={clsx(
                'text-[13px] leading-tight font-bold tracking-tight cursor-pointer hover:brightness-125 transition-all',
                star.brightness === 'bright' ? 'text-amber-300' : star.brightness === 'dim' ? 'text-amber-700/80' : 'text-amber-500',
              )}>
                {/* key={star.name} và mọi so sánh bên dưới vẫn dùng star.name gốc Hán. */}
                <Bi mode="term" zh={star.name} kind="star" className="bi-cell" compact />
              </span>
              {star.siHua && <SiHuaBadge siHua={star.siHua} />}
              {overlaySiHua && (
                <SiHuaBadge
                  siHua={overlaySiHua}
                  overlay
                  label={overlayLabel}
                  onClick={e => {
                    e.stopPropagation();
                    onSiHuaClick?.(star.name, overlaySiHua);
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* 吉星 */}
      {luckyStars.length > 0 && (
        <div className="flex flex-wrap gap-x-1 mt-0.5">
          {luckyStars.map(s => {
            const overlaySiHua = overlayStarSiHua?.[s.name];
            return (
              <span key={s.name} className="inline-flex items-center text-[9px] text-sky-500/70 leading-tight">
                <Bi mode="term" zh={s.name} kind="star" className="bi-cell" compact />
                {s.siHua && <SiHuaBadge siHua={s.siHua} />}
                {overlaySiHua && (
                  <SiHuaBadge
                    siHua={overlaySiHua}
                    overlay
                    label={overlayLabel}
                    onClick={e => {
                      e.stopPropagation();
                      onSiHuaClick?.(s.name, overlaySiHua);
                    }}
                  />
                )}
              </span>
            );
          })}
        </div>
      )}

      {/* 煞星 */}
      {shaStars.length > 0 && (
        <div className="flex flex-wrap gap-x-1">
          {shaStars.map(s => (
            <span key={s.name} className="text-[9px] text-red-500/60 leading-tight">
              <Bi mode="term" zh={s.name} kind="star" className="bi-cell" compact />{s.siHua && <SiHuaBadge siHua={s.siHua} />}
            </span>
          ))}
        </div>
      )}

    </motion.div>
  );
}
