import Link from 'next/link';
import { topics, topicTitles, wordsOf, img } from '@/lib/data';

export const metadata = { title: 'الدروس – Deutschy' };

export default function Lessons() {
  return (
    <div className="space-y-6">
      <h1 className="ar-title text-4xl font-bold">الدروس · المستوى A1</h1>
      <p className="text-muted">كل درس موضوع واحد. افتح الدرس، شوف الكروت، وبعدين جرّب الألعاب على نفس الكلمات.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((t, i) => {
          const ws = wordsOf(t.id);
          return (
            <Link key={t.id} href={`/lessons/${t.id}/`} className="flex overflow-hidden rounded-2xl border border-line bg-card hover:border-accent">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(ws[0])} alt="" className="h-28 w-28 shrink-0 object-cover" width={112} height={112} loading="lazy" />
              <div className="p-4">
                <p className="num text-xs font-bold text-accent">الدرس {i + 1}</p>
                <p className="de text-xl font-semibold">{topicTitles[t.id]}</p>
                <p className="ar-title text-lg text-muted">{t.ar} · <span className="num">{ws.length}</span> كلمة</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
