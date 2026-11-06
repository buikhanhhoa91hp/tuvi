'use client';
import { motion } from 'framer-motion';
import { STEMS, SI_HUA_TABLE } from '@/lib/ziwei/constants';
import type { ZiweiChart } from '@/lib/ziwei/types';
import Bi from './Bi';
import { biTerm, viTerm } from '@/lib/i18n/resolve';

export type TimeView = 'mingpan' | 'daxian' | 'liunian';

interface TimeNavProps {
  chart: ZiweiChart;
  view: TimeView;
  liunianYear: number;
  onViewChange: (view: TimeView) => void;
  onYearChange: (year: number) => void;
}

/** 由年份计算天干索引 (0-9) */
export function getYearStemIndex(year: number): number {
  return ((year - 4) % 10 + 10) % 10;
}

/** 根据天干索引返回四化映射：starName → SiHua */
export function buildSiHuaOverlay(stemIndex: number): Record<string, string> {
  const stars = SI_HUA_TABLE[stemIndex];
  if (!stars) return {};
  // Giá trị là KÝ TỰ HÁN engine (PalaceCell/ChartBoard so khớp với Star.siHua), không được
  // đổi. biTerm(..).zh là đồng nhất (zh luôn trả về đúng chuỗi đưa vào) nên vẫn là Hán tự,
  // đồng thời khai báo "đây là thuật ngữ mutagen" thay vì để chuỗi trần trong file ADOPTED
  // — đúng khuôn SIHUA_STYLES của PalaceCell.tsx:40-45.
  return {
    [stars[0]]: biTerm('禄', 'mutagen').zh,
    [stars[1]]: biTerm('权', 'mutagen').zh,
    [stars[2]]: biTerm('科', 'mutagen').zh,
    [stars[3]]: biTerm('忌', 'mutagen').zh,
  };
}

// Key màu là ký tự Hán engine — cùng khuôn biTerm(..).zh ở trên; `.zh` đồng nhất nên
// tra SIHUA_COLORS[sh] với sh từ engine vẫn khớp nguyên văn.
const SIHUA_COLORS: Record<string, string> = {
  [biTerm('禄', 'mutagen').zh]: '#4ade80',
  [biTerm('权', 'mutagen').zh]: '#60a5fa',
  [biTerm('科', 'mutagen').zh]: '#facc15',
  [biTerm('忌', 'mutagen').zh]: '#f87171',
};

export default function TimeNav({
  chart,
  view,
  liunianYear,
  onViewChange,
  onYearChange,
}: TimeNavProps) {
  const currentDx = chart.daXians[chart.currentDaXianIndex];

  // 计算当前叠加四化信息
  const getOverlayInfo = (): { stemName: string; overlay: Record<string, string> } | null => {
    if (view === 'mingpan') return null;

    if (view === 'daxian' && currentDx) {
      const dxPalace = chart.palaces.find(p => p.branch === currentDx.palaceBranch);
      if (!dxPalace) return null;
      const stemIndex = dxPalace.stem;
      return {
        stemName: STEMS[stemIndex],
        overlay: buildSiHuaOverlay(stemIndex),
      };
    }

    if (view === 'liunian') {
      const stemIndex = getYearStemIndex(liunianYear);
      return {
        stemName: STEMS[stemIndex],
        overlay: buildSiHuaOverlay(stemIndex),
      };
    }

    return null;
  };

  const overlayInfo = getOverlayInfo();

  return (
    <div className="mb-3">
      {/* Tab 行 */}
      <div
        className="flex items-center rounded-xl p-1 gap-1"
        style={{ background: 'var(--t-surface)', border: '1px solid var(--t-border)' }}
      >
        {/* 本命 */}
        <TabButton
          active={view === 'mingpan'}
          onClick={() => onViewChange('mingpan')}
        >
          <Bi mode="text" zh="本命" compact />
        </TabButton>

        {/* 大限 */}
        <TabButton
          active={view === 'daxian'}
          onClick={() => onViewChange('daxian')}
        >
          {/* Tab 大限 — template literal Hán từng vào thẳng UI; nay đi qua Bi fmt
              (khuôn ChartBoard.tsx:211, R7 đường (a)) nên key nằm trong lời dịch. */}
          {currentDx
            ? <Bi mode="fmt" template="大限 {n1}–{n2}" args={{ n1: currentDx.startAge, n2: currentDx.endAge }} compact />
            : <Bi mode="text" zh="大限" compact />}
        </TabButton>

        {/* 流年 — 含年份切换 */}
        <div
          className="relative flex-1 flex items-center justify-center rounded-lg py-1.5 gap-1 transition-all duration-200"
          style={{
            background: view === 'liunian'
              ? 'rgba(212,168,67,0.12)'
              : 'transparent',
            border: view === 'liunian'
              ? '1px solid rgba(212,168,67,0.25)'
              : '1px solid transparent',
          }}
        >
          <button
            onClick={() => onViewChange('liunian')}
            className="text-[10px] font-medium flex-1 text-center"
            style={{ color: view === 'liunian' ? 'var(--t-gold)' : 'var(--t-faint)' }}
          >
            <Bi mode="text" zh="流年" compact />
          </button>
          {/* 年份 +/- */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={e => { e.stopPropagation(); onYearChange(liunianYear - 1); if (view !== 'liunian') onViewChange('liunian'); }}
              className="text-[9px] w-4 h-4 flex items-center justify-center rounded"
              style={{ color: 'var(--t-faint)' }}
            >
              ‹
            </button>
            <span
              className="text-[10px] font-mono min-w-[28px] text-center cursor-pointer"
              style={{ color: view === 'liunian' ? 'var(--t-gold)' : 'var(--t-faint)' }}
              onClick={() => onViewChange('liunian')}
            >
              {liunianYear}
            </span>
            <button
              onClick={e => { e.stopPropagation(); onYearChange(liunianYear + 1); if (view !== 'liunian') onViewChange('liunian'); }}
              className="text-[9px] w-4 h-4 flex items-center justify-center rounded"
              style={{ color: 'var(--t-faint)' }}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* 叠加四化说明行 */}
      {overlayInfo && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2 mt-1.5 px-1 flex-wrap"
        >
          <span className="text-[9px]" style={{ color: 'var(--t-faint)' }}>
            {/* '{z}·{s}年四化：' — vế Hán tái hiện đúng chuỗi cũ ('大限·丙年四化：' /
                '2026·丙年四化：'); vế Việt dùng {v}/{sv} (can đã tra terms, kind 'stem'). */}
            <Bi
              mode="fmt"
              template="{z}·{s}年四化："
              args={{
                z: view === 'daxian' ? '大限' : liunianYear,
                v: view === 'daxian' ? 'Đại hạn' : liunianYear,
                s: overlayInfo.stemName,
                sv: viTerm(overlayInfo.stemName, 'stem') ?? overlayInfo.stemName,
              }}
              compact
            />
          </span>
          {([biTerm('禄', 'mutagen').zh, biTerm('权', 'mutagen').zh,
             biTerm('科', 'mutagen').zh, biTerm('忌', 'mutagen').zh] as const).map(sh => {
            const starName = Object.keys(overlayInfo.overlay).find(k => overlayInfo.overlay[k] === sh);
            if (!starName) return null;
            return (
              <span key={sh} className="text-[9px] font-medium" style={{ color: SIHUA_COLORS[sh] }}>
                {/* '太陽化禄' ghép lúc chạy: tách sao (kind star) + dạng đầy đủ '化X'
                    (terms.override.ts 化禄/化权/化科/化忌) — khuôn PalaceCell.tsx:182+70.
                    '化' là literal nằm TRONG lời dịch biTerm nên ratchet thấy nó như một
                    phần của thuật ngữ ghép, không phải nhãn thô. */}
                <Bi mode="term" zh={starName} kind="star" compact />
                <Bi mode="term" zh={biTerm('化', 'mutagen').zh + sh} kind="mutagen" compact />
              </span>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 py-1.5 text-[10px] font-medium rounded-lg transition-all duration-200"
      style={{
        background: active ? 'rgba(212,168,67,0.12)' : 'transparent',
        color: active ? 'var(--t-gold)' : 'var(--t-faint)',
        border: active ? '1px solid rgba(212,168,67,0.25)' : '1px solid transparent',
      }}
    >
      {children}
    </button>
  );
}
