'use client';
import { Word, img, pluralText } from '@/lib/data';
import { speak } from '@/lib/speak';

export default function WordCard({ w }: { w: Word }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img(w)} alt={`${w.art} ${w.de}`} className="photo" loading="lazy" width={480} height={360} />
      <div className="space-y-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="de text-2xl font-semibold leading-tight" lang="de">
            <span className="text-accent">{w.art}</span> {w.de}
          </h3>
          <button onClick={() => speak(`${w.art} ${w.de}`)} aria-label={`نطق ${w.de}`} className="shrink-0 rounded-full border border-line px-3 py-1 text-sm hover:bg-paper">🔊</button>
        </div>
        <p className="ar-title text-xl text-ink">{w.ar}</p>
        <p className="de text-sm text-muted" lang="de">{pluralText(w)}</p>
      </div>
    </article>
  );
}
