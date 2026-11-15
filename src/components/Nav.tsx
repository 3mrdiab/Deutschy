'use client';
import Flame from './Flame';
import Link from 'next/link';
import { useEffect } from 'react';
import { useAuth, useStore, level } from '@/lib/store';

const links = [
  { href: '/levels/', label: 'المستويات' },
  { href: '/lessons/', label: 'الدروس' },
  { href: '/learn/', label: 'أساسيات' },
  { href: '/games/', label: 'ألعاب' },
  { href: '/leaderboard/', label: 'المتصدرين' },
];

export default function Nav() {
  const user = useAuth();
  const { s } = useStore();
  useEffect(() => {
    // Themes are an admin-only feature: everyone else always gets the default look.
    if (user?.isAdmin) document.documentElement.dataset.theme = s.theme || 'papier';
    else document.documentElement.dataset.theme = 'papier';
  }, [user, s.theme]);
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <Link href="/" className="de text-2xl font-semibold tracking-tight" dir="ltr">
          Deutsch<span className="text-accent">y</span>
        </Link>
        <nav className="order-last flex w-full items-center gap-1 overflow-x-auto text-sm font-semibold md:order-none md:w-auto md:flex-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-full px-3 py-1.5 text-muted hover:bg-card hover:text-ink">{l.label}</Link>
          ))}
          {user?.isAdmin && <Link href="/admin/" className="rounded-full px-3 py-1.5 text-accent hover:bg-card">لوحة التحكم</Link>}
        </nav>
        <div className="num flex flex-1 items-center justify-end gap-3 text-xs font-bold text-muted md:flex-none" title="XP ومستوى وسلسلة الأيام">
          <span>Lv {level(s.xp)}</span><span>{s.xp} XP</span><span className="inline-flex items-center gap-0.5 text-accent"><Flame />{s.streak}</span>
        </div>
        {user === undefined ? null : user ? (
          <button className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:bg-card" onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); location.reload(); }}>
            خروج ({user.name.split(' ')[0]})
          </button>
        ) : (
          <a className="rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-accent-ink" href="/api/auth/google">دخول بحساب Google</a>
        )}
      </div>
    </header>
  );
}
