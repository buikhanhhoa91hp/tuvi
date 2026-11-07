/**
 * /library/search?q=xxx — 搜索结果页
 */

import Link from 'next/link';
import { searchClassics, getParagraphById } from '@/lib/classics';
import { biText } from '@/lib/i18n/resolve';

// Task c5: metadata <head> da dich sang tieng Viet (R30, biText(...).vi) — dao nguoc phan
// quyet e0e2140. Literal nam TRONG loi dich nen van qua R28.
export const metadata = {
  title: biText('搜索 · 古籍原典库').vi,
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const sp = await searchParams;
  const q = sp.q?.trim() || '';
  const hits = q ? searchClassics(q, 50) : [];

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/library" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.3em', textDecoration: 'none' }}>
          {biText('← 古籍库').vi}
        </Link>
        <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.2em' }}>
          {biText('搜索结果').vi}
        </div>
        <Link href="/" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.2em', textDecoration: 'none' }}>
          {biText('首页 →').vi}
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div style={{ fontSize: '13px', color: 'var(--tx-3)', letterSpacing: '0.15em', marginBottom: '4px' }}>
            {biText('搜索关键词').vi}
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.1em' }}>
            「{q || biText('（空）').vi}」
          </h1>
          <div style={{ fontSize: '12px', color: 'var(--tx-3)', marginTop: '8px' }}>
            {biText('共找到').vi} <strong style={{ color: 'var(--ac)' }}>{hits.length}</strong> {biText('条古籍原文匹配').vi}
          </div>
        </div>

        {hits.length === 0 ? (
          <div style={{
            background: 'var(--bg-card)',
            padding: '40px 20px',
            borderRadius: '12px',
            textAlign: 'center',
            color: 'var(--tx-2)',
            border: '1px solid rgba(184,146,42,0.15)',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📜</div>
            {q ? (
              <>
                <div style={{ fontSize: '14px', marginBottom: '6px' }}>{biText('暂未在已收录古籍中找到这个关键词').vi}</div>
                <div style={{ fontSize: '11px', color: 'var(--tx-3)', lineHeight: 1.7 }}>
                  {biText('我们持续补充内容中。可尝试搜索：').vi}<br />
                  {/* Vi du tu khoa de NGUYEN VAN Hán: chung la chuoi goi cho may tim
                      kiem cua ngu lieu co tich (searchClassics doi matching chuoi Hán),
                      dich ra tieng Viet thi goi khong ra ket qua -> mien EXCLUDE. */}
                  <span style={{ color: 'var(--ac)' }}>七杀朝斗 / 双禄朝垣 / 化忌 / 紫微 / 命宫 / 机月同梁</span>
                </div>
              </>
            ) : (
              <div style={{ fontSize: '13px' }}>{biText('请输入要搜索的关键词').vi}</div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {hits.map((hit, i) => {
              const ctx = getParagraphById(hit.paragraphId);
              const chapterIdx = ctx?.chapterIdx ?? 0;
              return (
                <Link
                  key={i}
                  href={`/library/${hit.bookSlug}/${chapterIdx}#${hit.paragraphId}`}
                  style={{
                    display: 'block',
                    background: 'var(--bg-card)',
                    padding: '16px 20px',
                    borderRadius: '10px',
                    border: '1px solid rgba(184,146,42,0.18)',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'border-color 0.15s',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '11px',
                    color: 'var(--tx-3)',
                    marginBottom: '8px',
                    letterSpacing: '0.1em',
                  }}>
                    <span style={{ color: 'var(--ac)', fontWeight: 600 }}>《{hit.bookTitle}》</span>
                    <span style={{ opacity: 0.5 }}>·</span>
                    <span>{hit.chapterTitle}</span>
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'var(--tx-0)',
                      lineHeight: 1.9,
                      letterSpacing: '0.02em',
                    }}
                    dangerouslySetInnerHTML={{ __html: hit.snippet }}
                  />
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        mark { background: rgba(184,146,42,0.3); color: #8b6a14; padding: 0 2px; border-radius: 2px; font-weight: 600; }
      `}</style>
    </div>
  );
}
