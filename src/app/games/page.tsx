import Link from 'next/link';

export const metadata = { title: 'ألعاب – Deutschy' };

const games = [
  { id: 'flashcards', t: 'Karteikarten', ar: 'كروت المراجعة', d: 'اقلب الكارت وقول لنفسك عرفتها ولا لأ. +2 XP للي تعرفه.' },
  { id: 'quiz', t: 'Bild-Quiz', ar: 'اختبار الصور', d: 'صورة وأربع اختيارات. 10 أسئلة، +10 XP لكل إجابة صح.' },
  { id: 'article', t: 'der · die · das', ar: 'اختار الأداة', d: 'كلمة وتلات أدوات. الأداة الصح هي اللي بتفرق. +10 XP.' },
  { id: 'spelling', t: 'Buchstabieren', ar: 'اكتب الكلمة', d: 'صورة وتكتب الكلمة بالألماني. +15 XP لكل كلمة صح.' },
  { id: 'memory', t: 'Memory', ar: 'لعبة الذاكرة', d: 'طابق الصورة بالكلمة. كل ما قلّت المحاولات زاد السكور.' },
];

export default function Games() {
  return (
    <div className="space-y-6">
      <h1 className="ar-title text-4xl font-bold">ألعاب</h1>
      <p className="text-muted">كل لعبة بتجمّع XP وبتدخل في المتصدرين. الأصوات بتشتغل بس لما تضغط عليها.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((g) => (
          <Link key={g.id} href={`/games/${g.id}/`} className="rounded-2xl border border-line bg-card p-6 hover:border-accent">
            <p className="de text-2xl font-semibold">{g.t}</p>
            <p className="ar-title text-xl text-accent">{g.ar}</p>
            <p className="mt-2 text-muted">{g.d}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
