'use client';
import { useStore, level } from '@/lib/store';
import { useAuth } from '@/lib/store';

const names: Record<string, string> = { quiz: 'Bild-Quiz', article: 'der·die·das', spelling: 'Buchstabieren', memory: 'Memory' };

export default function Leaderboard() {
  const { s, patch } = useStore();
  const user = useAuth();
  const best = Object.entries(names).map(([g, label]) => {
    const rows = s.scores.filter((x) => x.game === g).sort((a, b) => b.score - a.score).slice(0, 5);
    return { g, label, rows };
  });
  return (
    <div className="space-y-8">
      <div>
        <h1 className="ar-title text-4xl font-bold">المتصدرين</h1>
        <p className="mt-2 text-muted">الترتيب هنا محلي على جهازك (من غير سيرفر). الترتيب العالمي هيتضاف لما نربط قاعدة بيانات.</p>
      </div>
      <section className="grid gap-4 rounded-2xl border border-line bg-card p-5 sm:grid-cols-4">
        <Stat l="الاسم" v={<input className="w-full rounded-lg border border-line bg-paper px-2 py-1" placeholder={user?.name ?? 'اكتب اسمك'} value={s.name} onChange={(e) => patch({ name: e.target.value })} />} />
        <Stat l="المستوى" v={<span className="num text-3xl font-bold">{level(s.xp)}</span>} />
        <Stat l="XP" v={<span className="num text-3xl font-bold">{s.xp}</span>} />
        <Stat l="أطول سلسلة أيام" v={<span className="num text-3xl font-bold">🔥 {s.best}</span>} />
      </section>
      <div className="grid gap-4 md:grid-cols-2">
        {best.map(({ g, label, rows }) => (
          <section key={g} className="rounded-2xl border border-line bg-card p-5">
            <h2 className="de text-xl font-semibold">{label}</h2>
            {rows.length === 0 ? <p className="mt-2 text-sm text-muted">لسه ماتلعبتش.</p> : (
              <ol className="mt-3 space-y-1">
                {rows.map((r, i) => <li key={r.at} className="num flex justify-between"><span>{i + 1}. {r.name}</span><b>{r.score}</b></li>)}
              </ol>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
function Stat({ l, v }: { l: string; v: React.ReactNode }) {
  return <div><p className="mb-1 text-xs text-muted">{l}</p>{v}</div>;
}
