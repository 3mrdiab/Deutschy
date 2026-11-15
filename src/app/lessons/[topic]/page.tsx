import Link from 'next/link';
import { notFound } from 'next/navigation';
import { topics, topicTitles, wordsOf } from '@/lib/data';
import WordCard from '@/components/WordCard';

export const dynamicParams = false;
export const generateStaticParams = () => topics.map((t) => ({ topic: t.id }));

export default async function Topic({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const t = topics.find((x) => x.id === topic);
  if (!t) notFound();
  const ws = wordsOf(topic);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/lessons/" className="text-sm text-muted hover:text-ink">← كل الدروس</Link>
          <h1 className="de mt-1 text-4xl font-semibold">{topicTitles[topic]}</h1>
          <p className="ar-title text-2xl text-muted">{t.ar} · <span className="num">{ws.length}</span> كلمة</p>
        </div>
        <Link href={`/games/quiz/?topic=${topic}`} className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink">اختبر نفسك في الدرس</Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{ws.map((w) => <WordCard key={w.id} w={w} />)}</div>
    </div>
  );
}
