import Link from 'next/link';
import { notFound } from 'next/navigation';
import { levels, levelOf, topicLevel } from '@/lib/levels';
import { topics, topicTitles, wordsOf, img } from '@/lib/data';

export const dynamicParams = false;
export const generateStaticParams = () => levels.map((l) => ({ level: l.id }));

export default async function LevelPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  const l = levelOf(level);
  if (!l) notFound();
  const ts = topics.filter((t) => topicLevel(t.id) === l.id);
  return (
    <div className="space-y-6">
      <Link href="/levels/" className="text-sm text-muted hover:text-ink">← كل المستويات</Link>
      <h1 className="ar-title text-4xl font-bold"><span className="de num">{l.id}</span> · {l.nameAr}</h1>
      <p className="text-lg text-muted">{l.descAr}</p>
      {l.status === 'soon' ? (
        <div className="rounded-2xl border border-line bg-card p-6">
          <p className="ar-title text-2xl font-bold">المستوى ده لسه تحت التجهيز</p>
          <p className="mt-2 text-muted">هنفتحه بعد ما نخلص A1 كامل. اللي مخطط له:</p>
          <ul className="mt-3 list-disc space-y-1 ps-6 text-lg">{l.plannedAr.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ts.map((t, i) => {
            const ws = wordsOf(t.id);
            return (
              <Link key={t.id} href={`/lessons/${t.id}/`} className="flex overflow-hidden rounded-2xl border border-line bg-card hover:border-accent">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(ws[0])} alt="" className="h-28 w-28 shrink-0 object-cover" width={112} height={112} loading="lazy" />
                <div className="p-4">
                  <p className="num text-xs font-bold text-accent">{l.id} · درس {i + 1}</p>
                  <p className="de text-xl font-semibold">{topicTitles[t.id]}</p>
                  <p className="ar-title text-lg text-muted">{t.ar} · <span className="num">{ws.length}</span> كلمة</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
