import Link from 'next/link';
import { topics, topicTitles, words, wordsOf, img } from '@/lib/data';

export default function Home() {
  const hero = words.filter((w) => ['apfel', 'pferd', 'fahrrad', 'kaffee'].includes(w.id));
  return (
    <div className="space-y-14">
      <section className="grid items-center gap-8 md:grid-cols-2">
        <div className="space-y-5">
          <p className="num text-sm font-bold text-accent">من A1 لحد C2 · {words.length} كلمة بصور حقيقية جاهزة دلوقتي</p>
          <h1 className="ar-title text-5xl font-bold leading-[1.15] md:text-6xl">الألماني بقى <span className="text-accent">أسهل</span> بالصورة والعربي المصري</h1>
          <p className="max-w-lg text-lg text-muted">كل كلمة معاها صورة حقيقية، أداة التعريف الصح (der / die / das)، والجمع. اتعلم بالكروت وبعدين العب وجمّع XP.</p>
          <div className="flex gap-3">
            <Link href="/lessons/" className="rounded-full bg-accent px-6 py-3 font-bold text-accent-ink">ابدأ الدروس</Link>
            <Link href="/games/" className="rounded-full border border-line px-6 py-3 font-bold hover:bg-card">العب</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {hero.map((w) => (
            <div key={w.id} className="overflow-hidden rounded-2xl border border-line bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(w)} alt={w.de} className="photo" width={480} height={360} />
              <p className="de p-3 text-lg font-semibold"><span className="text-accent">{w.art}</span> {w.de}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="ar-title mb-5 text-3xl font-bold">المستوى A1 · الدروس</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map((t) => {
            const ws = wordsOf(t.id);
            return (
              <Link key={t.id} href={`/lessons/${t.id}/`} className="group overflow-hidden rounded-2xl border border-line bg-card hover:border-accent">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(ws[0])} alt="" className="photo" width={480} height={360} loading="lazy" />
                <div className="p-4">
                  <p className="de text-xl font-semibold">{topicTitles[t.id]}</p>
                  <p className="ar-title text-lg text-muted">{t.ar} · <span className="num">{ws.length}</span></p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
