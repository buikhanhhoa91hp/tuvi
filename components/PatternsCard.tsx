'use client';
import { motion } from 'framer-motion';
import type { ZiweiChart } from '@/lib/ziwei/types';
import { detectPatterns } from '@/lib/ziwei/patterns';
import Bi from './Bi';
import { biTerm, biText } from '@/lib/i18n/resolve';

const LevelStyle = {
  excellent: { dot: 'bg-amber-400', label: 'text-amber-500', badge: 'text-amber-500 bg-amber-500/10 border-amber-500/25' },
  good:      { dot: 'bg-sky-400',   label: 'text-sky-500',   badge: 'text-sky-500 bg-sky-500/10 border-sky-500/25' },
  neutral:   { dot: 'bg-slate-400', label: 'text-slate-400', badge: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
  caution:   { dot: 'bg-orange-500', label: 'text-orange-500', badge: 'text-orange-500 bg-orange-500/10 border-orange-500/25' },
};

export default function PatternsCard({ chart }: { chart: ZiweiChart }) {
  const patterns = detectPatterns(chart);
  if (patterns.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card-glass rounded-xl p-4 mb-4"
    >
      <div className="text-[10px] tracking-widest mb-3 flex items-center gap-2" style={{ color: 'var(--t-faint)' }}>
        <span style={{ color: 'var(--t-gold)', opacity: 0.6 }}>◉</span>
        格局识别（严格古书条件）
        <span className="text-[9px] ml-auto" style={{ color: 'var(--t-faint)', opacity: 0.75 }}>{patterns.length}个</span>
      </div>
      <div className="space-y-2">
        {patterns.map((p, i) => {
          const st = LevelStyle[p.level];
          return (
            <motion.div
              key={`${p.name}-${i}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card-inner rounded-lg p-3"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${st.dot}`} />
                <span className={`text-[11px] font-medium ${st.label}`}>
                  {/* Ten cach cuc = THUAT NGU (杀破狼 → Sát Phá Lang): echo hai ngon ngu. */}
                  <Bi mode="term" zh={p.name} kind="pattern" compact />
                </span>
                <div className="flex gap-1 ml-auto">
                  {p.palaces.slice(0, 2).map(pa => (
                    <span key={pa} className={`text-[8px] px-1.5 py-px rounded-full border ${st.badge}`}>
                      {/* replace() giu nguyen chuoi engine (qua biTerm(..).zh, khuon
                          ChartSummary.tsx:205) de khong doi du lieu; in ra thi hai ngon ngu. */}
                      <Bi mode="term" zh={pa.replace(biTerm('宫', 'palace').zh, '')} kind="palace" compact />
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-[10px] leading-relaxed pl-3.5" style={{ color: 'var(--t-text2)' }}>
                {/* Mo ta + dieu kien la VAN luan (nhieu dong) → ban dich THAY chuoi Hán (R30),
                    khong echo: PROSE_VI keyed dung nguyen van cua lib/ziwei/patterns.ts. */}
                {biText(p.description).vi}
              </p>

              {p.conditions && (
                <div className="mt-2 pl-3.5 space-y-0.5">
                  {p.conditions.required.length > 0 && (
                    <div className="text-[9px] leading-relaxed" style={{ color: 'var(--t-text2)', opacity: 0.85 }}>
                      <span className="font-medium" style={{ color: 'var(--t-gold)' }}><Bi mode="text" zh="必须" /></span>
                      <span style={{ opacity: 0.6 }}> · </span>
                      {p.conditions.required.map((c) => biText(c).vi).join('、')}
                    </div>
                  )}
                  {p.conditions.bonus && p.conditions.bonus.length > 0 && (
                    <div className="text-[9px] leading-relaxed" style={{ color: 'var(--t-text2)', opacity: 0.85 }}>
                      <span className="font-medium text-emerald-500"><Bi mode="text" zh="加分" /></span>
                      <span style={{ opacity: 0.6 }}> · </span>
                      {p.conditions.bonus.map((c) => biText(c).vi).join('、')}
                    </div>
                  )}
                  {p.conditions.breaking && p.conditions.breaking.length > 0 && (
                    <div className="text-[9px] leading-relaxed" style={{ color: 'var(--t-text2)', opacity: 0.85 }}>
                      <span className="font-medium text-orange-500"><Bi mode="text" zh="破格" /></span>
                      <span style={{ opacity: 0.6 }}> · </span>
                      {p.conditions.breaking.map((c) => biText(c).vi).join('、')}
                    </div>
                  )}
                </div>
              )}

              {p.source && (
                <div className="text-[9px] mt-1.5 pl-3.5" style={{ color: 'var(--t-faint)', opacity: 0.5 }}>
                  出处 · {p.source}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
