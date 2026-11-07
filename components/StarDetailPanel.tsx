'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { Star } from '@/lib/ziwei/types';
import { STAR_DESCRIPTIONS } from '@/lib/ziwei/constants';
import { STAR_DETAIL, LUCKY_STAR_NOTES, SHA_STAR_NOTES } from '@/lib/content/starDetail';
import Bi from './Bi';
import { biTerm, biText } from '@/lib/i18n/resolve';

interface StarDetailPanelProps {
  star: Star | null;
  palaceName?: string;
  onClose: () => void;
}


// Nhan loai sao la CAU UI (hasTerm false — da probe) nen di thang qua <Bi mode="text"> tai
// dinh nghia, kieu overlayLabel cua ChartBoard.tsx:81-85: label tro thanh ReactNode song ngu,
// khong con literal Han tran trong file ADOPTED.
const levelConfig = {
  major: { label: <Bi mode="text" zh="主星" compact />, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  lucky: { label: <Bi mode="text" zh="吉星" compact />, color: 'text-sky-400 border-sky-500/30 bg-sky-500/10' },
  sha:   { label: <Bi mode="text" zh="煞星" compact />, color: 'text-red-400 border-red-500/30 bg-red-500/10' },
  minor: { label: <Bi mode="text" zh="杂星" compact />, color: 'text-slate-400 border-slate-500/25 bg-slate-500/10' },
};

// Key mau la ky tu Han engine (doi chieu star.siHua) — qua biTerm(..).zh dong nhat,
// dung khuon SIHUA_STYLES cua PalaceCell.tsx:40-45; gia tri key khong doi nen so khop van Han.
const siHuaColors: Record<string, string> = {
  [biTerm('禄', 'mutagen').zh]: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  [biTerm('权', 'mutagen').zh]: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  [biTerm('科', 'mutagen').zh]: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  [biTerm('忌', 'mutagen').zh]: 'text-red-400 bg-red-500/10 border-red-500/30',
};

export default function StarDetailPanel({ star, palaceName, onClose }: StarDetailPanelProps) {
  const desc = star ? STAR_DESCRIPTIONS[star.name] : null;
  const detail = star ? STAR_DETAIL[star.name] : null;
  const typeConfig = star ? levelConfig[star.type] : null;

  return (
    <AnimatePresence>
      {star && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className="card-glass rounded-xl overflow-hidden"
        >
          {/* 标题栏 */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--t-border)' }}>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold" style={{ color: 'var(--t-gold)' }}><Bi mode="term" zh={star.name} kind="star" /></span>
              {typeConfig && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${typeConfig.color}`}>
                  {typeConfig.label}
                </span>
              )}
              {star.siHua && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${siHuaColors[star.siHua] || ''}`}>
                  {/* '化禄' hai am — terms.override.ts; ghep luc chay nen tra qua Bi term
                      ('化' nam TRONG loi dich, khong phai nhan tho). */}
                  <Bi mode="term" zh={biTerm('化', 'mutagen').zh + star.siHua} kind="mutagen" compact />
                </span>
              )}
            </div>
            <button onClick={onClose} className="transition-colors text-lg leading-none" style={{ color: 'var(--t-faint)' }}>×</button>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto max-h-[560px]">
            {/* 基本信息 */}
            {desc && (
              <div className="flex flex-wrap gap-1.5">
                {/* Bo ghep chuoi Han `五行 · ${..}` (template literal vo hinh voi ratchet ma
                    lai in chu Han ra UI): moi chip la nhan qua <Bi mode="text"> + gia tri
                    engine giu nguyen (element/nature la Dot B, spec muc 4). Mau theo
                    star.brightness (enum tieng Anh) thay cho tag.includes('庙旺') cu. */}
                <Chip><Bi mode="text" zh="五行" compact /> · {desc.element}</Chip>
                {/* nature + keyword cua STAR_DESCRIPTIONS (lib/ziwei/constants.ts, khong bao
                    gio) la VAN luan ngan → biText(...).vi thay chuoi Hán (R30); element van la
                    ky tu engine (DATA, doi chieu mau/sao). */}
                <Chip><Bi mode="text" zh="性质" compact /> · {biText(desc.nature).vi}</Chip>
                {palaceName && <Chip><Bi mode="text" zh="位置" compact /> · <Bi mode="term" zh={palaceName} kind="palace" compact /></Chip>}
                {star.brightness && (
                  <Chip color={star.brightness === 'bright' ? '#eab308' : star.brightness === 'dim' ? '#ef4444' : 'var(--t-text2)'}>
                    <Bi mode="text" zh={star.brightness === 'bright' ? '庙旺' : star.brightness === 'dim' ? '落陷' : '平和'} compact />
                  </Chip>
                )}
              </div>
            )}

            {/* 关键词 */}
            {desc && (
              <div>
                <div className="text-[10px] tracking-widest mb-1.5" style={{ color: 'var(--t-faint)' }}><Bi mode="text" zh="星曜特质" /></div>
                <div className="flex flex-wrap gap-1.5">
                  {desc.keywords.split('·').map(k => (
                    <span key={k} className="text-[11px] px-2 py-0.5 rounded-full"
                      style={{ color: 'var(--t-gold)', border: '1px solid rgba(212,168,67,0.2)', background: 'rgba(212,168,67,0.06)' }}>
                      {biText(k.trim()).vi}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 古书原文 */}
            {detail && (
              <div className="rounded-xl p-3" style={{ background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.12)' }}>
                <div className="text-[10px] tracking-widest mb-1.5 flex items-center gap-1" style={{ color: 'var(--t-gold)', opacity: 0.7 }}>
                  <Bi mode="text" zh="古书原文" />
                </div>
                <p className="text-[11px] leading-relaxed italic" style={{ color: 'var(--t-gold)', opacity: 0.8 }}>{detail.classical}</p>
              </div>
            )}

            {/* 倪海厦解读 */}
            {detail && (
              <>
                <div>
                  <div className="text-[10px] tracking-widest mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--t-faint)' }}>
                    <span className="w-3 h-px inline-block" style={{ background: 'var(--t-border-acc)' }} />
                    <Bi mode="text" zh="倪海厦老师解读" />
                    <span className="w-3 h-px inline-block" style={{ background: 'var(--t-border-acc)' }} />
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--t-text2)' }}>{detail.niHaixia}</p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: 'career', label: <Bi mode="text" zh="事业方向" compact />, value: detail.career, icon: '◈' },
                    { id: 'relationship', label: <Bi mode="text" zh="感情特质" compact />, value: detail.relationship, icon: '♡' },
                    { id: 'wealth', label: <Bi mode="text" zh="财运分析" compact />, value: detail.wealth, icon: '◆' },
                    { id: 'health', label: <Bi mode="text" zh="健康提示" compact />, value: detail.health, icon: '☯' },
                  ].map(item => (
                    <div key={item.id} className="card-inner rounded-lg p-3">
                      <div className="text-[10px] mb-1 flex items-center gap-1" style={{ color: 'var(--t-faint)' }}>
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--t-text2)' }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-[10px] p-2.5 rounded-lg" style={{ border: '1px solid rgba(74,222,128,0.15)', background: 'rgba(74,222,128,0.05)' }}>
                    <div className="text-emerald-500 mb-0.5 font-medium"><Bi mode="text" zh="最佳宫位" /></div>
                    <div className="text-emerald-500/70">{detail.bestPalace}</div>
                  </div>
                  <div className="text-[10px] p-2.5 rounded-lg" style={{ border: '1px solid rgba(248,113,113,0.15)', background: 'rgba(248,113,113,0.05)' }}>
                    <div className="text-red-500 mb-0.5 font-medium"><Bi mode="text" zh="注意宫位" /></div>
                    <div className="text-red-500/70">{detail.worstPalace}</div>
                  </div>
                </div>
              </>
            )}

            {/* 辅星/煞星说明 */}
            {!detail && star.type !== 'major' && (
              <div className="text-xs leading-relaxed" style={{ color: 'var(--t-text2)' }}>
                {star.type === 'lucky' && LUCKY_STAR_NOTES[star.name]}
                {star.type === 'sha' && SHA_STAR_NOTES[star.name]}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Chip nhiem vu: vien nang nho cho dong thong tin (khuon <div> cu trong array map). */
function Chip({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="text-[10px] px-2 py-1 rounded-full"
      style={{ border: '1px solid var(--t-border)', color: color ?? 'var(--t-text2)' }}>
      {children}
    </div>
  );
}
