/**
 * 古籍原典查询库 · 主页
 *
 * 列出所有收录古籍 + 全局搜索入口
 */

import Link from 'next/link';
import { ALL_BOOKS, TOTAL_PARAGRAPHS } from '@/lib/classics';
import { biFmt, biText } from '@/lib/i18n/resolve';
import LibrarySearch from './LibrarySearch';

// Task c5: metadata <head> cua /library DA DICH sang tieng Viet qua biText(...).vi (R30) —
// dao nguoc phan quyet e0e2140. Hai literal van nam TRONG loi dich nen qua R28; ten co thu o
// phan title/description dung ten Viet dia (Tử Vi Đẩu Số Toàn Tập / Toàn Thư / Cốt Tủy Phú)
// vi day la chuoi <head> nguoi dung doc, khong phai khoa goi may tim kiem du lieu.
export const metadata = {
  title: biText('倪师方法论 · 古籍原典库 · 紫微斗数全集 / 全书 / 骨髓赋').vi,
  description: biText('紫微斗数权威古籍全文检索：《紫微斗数全集》《紫微斗数全书》《骨髓赋》倪海厦《天纪》引证来源').vi,
};

export default function LibraryHomePage() {
  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* 顶栏 */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.3em', textDecoration: 'none' }}>
          {biText('← 返回首页').vi}
        </Link>
        <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.3em' }}>
          {biText('古籍原典库 · CLASSICS').vi}
        </div>
        <Link href="/chart" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.2em', textDecoration: 'none' }}>
          {biText('起盘 →').vi}
        </Link>
      </div>

      {/* Hero */}
      <div className="text-center px-6 py-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to right, transparent, rgba(184,146,42,0.4))' }} />
          <span style={{ fontSize: '11px', color: 'var(--ac)', letterSpacing: '0.4em' }}>NI HAI XIA · CURRICULUM</span>
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to left, transparent, rgba(184,146,42,0.4))' }} />
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.15em', marginBottom: '12px' }}>
          {biText('倪师方法论 · 古籍原典库').vi}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--tx-2)', letterSpacing: '0.1em', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
          {biText('紫微斗数权威古籍全文检索').vi}<br />
          {biText('收录').vi} <strong style={{ color: 'var(--ac)' }}>{ALL_BOOKS.length}</strong> {biText('部古籍 · 共').vi} <strong style={{ color: 'var(--ac)' }}>{TOTAL_PARAGRAPHS}</strong> {biText('段精华').vi}
        </p>
      </div>

      {/* 搜索 */}
      <div className="max-w-2xl mx-auto px-6 mb-12">
        <LibrarySearch />
      </div>

      {/* 古籍列表 */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_BOOKS.map(book => (
            <Link
              key={book.slug}
              href={`/library/${book.slug}`}
              style={{
                display: 'block',
                background: 'var(--bg-card)',
                border: '1px solid rgba(184,146,42,0.2)',
                borderRadius: '14px',
                padding: '24px',
                textDecoration: 'none',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(184,146,42,0.06)',
              }}
              className="hover:shadow-lg"
            >
              <div style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.2em', marginBottom: '6px' }}>
                {book.dynasty} · {book.author.split(' ')[0]}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--tx-0)', marginBottom: '10px', letterSpacing: '0.1em' }}>
                《{book.title}》
              </div>
              <div style={{ fontSize: '12px', color: 'var(--tx-2)', lineHeight: 1.7, marginBottom: '14px' }}>
                {book.intro}
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--tx-3)' }}>
                <span>{biFmt('{n} 章节', { n: book.chapters.length }).vi}</span>
                <span style={{ color: 'rgba(184,146,42,0.4)' }}>·</span>
                <span>{biFmt('{n} 段精华', { n: book.chapters.reduce((s, c) => s + c.paragraphs.length, 0) }).vi}</span>
              </div>
              <div style={{
                display: 'inline-flex',
                marginTop: '14px',
                fontSize: '11px',
                color: 'var(--ac)',
                letterSpacing: '0.15em',
                fontWeight: 500,
              }}>
                {biText('进入查阅 →').vi}
              </div>
            </Link>
          ))}
        </div>

        {/* 底部说明 */}
        <div style={{ marginTop: '60px', padding: '24px', background: 'rgba(184,146,42,0.05)', borderRadius: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--ac-dim)', fontWeight: 600, letterSpacing: '0.15em', marginBottom: '8px' }}>
            {biText('关于本库').vi}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--tx-2)', lineHeight: 1.8, maxWidth: '600px', margin: '0 auto' }}>
            {biText('所收录古籍均为公版（明代刊本）。').vi}<br />
            {biText('内容持续完善，未来将补全《紫微斗数全集》全本与倪海厦《天纪》引证目录。').vi}<br />
            {biText('如发现任何错误请联系我们。').vi}
          </div>
        </div>
      </div>
    </div>
  );
}
