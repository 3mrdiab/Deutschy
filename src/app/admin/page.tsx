'use client';
import { useEffect, useState } from 'react';
import { useAuth, useStore } from '@/lib/store';
import { words, topics } from '@/lib/data';

const themes = [
  { id: 'papier', t: 'Papier', d: 'ورق دافي وحبر – الافتراضي' },
  { id: 'nacht', t: 'Nacht', d: 'داكن مع لمسة دهبي' },
  { id: 'salbei', t: 'Salbei', d: 'أخضر هادي' },
  { id: 'terrakotta', t: 'Terrakotta', d: 'طين وبرتقالي محروق' },
];

export default function Admin() {
  const user = useAuth();
  const { s, patch } = useStore();
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    if (user === undefined) return;
    if (!user) { setOk(false); return; }
    fetch('/api/admin/ping', { cache: 'no-store' }).then((r) => setOk(r.ok)).catch(() => setOk(false));
  }, [user]);

  if (user === undefined || ok === null) return <p className="text-muted">…</p>;
  if (!ok) {
    return (
      <div className="mx-auto max-w-md space-y-3 rounded-2xl border border-line bg-card p-8 text-center">
        <h1 className="ar-title text-2xl font-bold">الصفحة دي مش متاحة</h1>
        {!user && <a href="/api/auth/google" className="inline-block rounded-full bg-accent px-5 py-2.5 font-bold text-accent-ink">دخول بحساب Google</a>}
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <h1 className="ar-title text-4xl font-bold">لوحة التحكم</h1>
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-card p-5"><p className="text-sm text-muted">كلمات بصور</p><p className="num text-4xl font-bold">{words.length}</p></div>
        <div className="rounded-2xl border border-line bg-card p-5"><p className="text-sm text-muted">دروس</p><p className="num text-4xl font-bold">{topics.length}</p></div>
        <div className="rounded-2xl border border-line bg-card p-5"><p className="text-sm text-muted">XP عندك</p><p className="num text-4xl font-bold">{s.xp}</p></div>
      </section>
      <section>
        <h2 className="ar-title mb-3 text-2xl font-bold">الثيمات</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {themes.map((th) => (
            <button key={th.id} onClick={() => patch({ theme: th.id })} data-theme={th.id} className={`rounded-2xl border-2 p-5 text-start ${s.theme === th.id ? 'border-accent' : 'border-line'}`} style={{ background: 'var(--card)', color: 'var(--ink)' }}>
              <p className="de text-2xl font-semibold">{th.t}</p>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{th.d}</p>
              <span className="mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold" style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}>Aa</span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">الثيم بيتحفظ على جهازك وبيظهر لحسابك انت بس. باقي الزوار بيشوفوا Papier.</p>
      </section>
    </div>
  );
}
