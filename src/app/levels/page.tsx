import Link from 'next/link';
import { levels } from '@/lib/levels';
import { words, topics } from '@/lib/data';

export const metadata = { title: 'المستويات – Deutschy' };

export default function Levels() {
  return (
    <div className="space-y-6">
      <h1 className="ar-title text-4xl font-bold">المستويات</h1>
      <p className="text-muted">Deutschy بتغطي كل المستويات من A1 لحد C2. بنفتح كل مستوى لما محتواه يخلص ويتراجع، من غير محتوى فاضي أو مزيف.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {levels.map((l) => (
          <Link key={l.id} href={`/levels/${l.id}/`} className={`rounded-2xl border bg-card p-6 ${l.status === 'live' ? 'border-accent' : 'border-line opacity-80'}`}>
            <div className="flex items-center justify-between">
              <p className="de num text-4xl font-semibold">{l.id}</p>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${l.status === 'live' ? 'bg-accent text-accent-ink' : 'border border-line text-muted'}`}>{l.status === 'live' ? 'متاح' : 'قريباً'}</span>
            </div>
            <p className="ar-title mt-1 text-xl text-accent">{l.nameAr}</p>
            <p className="mt-2 text-muted">{l.descAr}</p>
            {l.status === 'live' && <p className="num mt-3 text-sm font-bold">{topics.length} دروس · {words.length} كلمة بصور</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
