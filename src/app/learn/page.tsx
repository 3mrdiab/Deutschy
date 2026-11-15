'use client';
import { sections } from '@/lib/basics';
import { speak } from '@/lib/speak';

export default function Learn() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="ar-title text-4xl font-bold">أساسيات A1</h1>
        <p className="mt-2 text-muted">التحيات، الأرقام، الأيام، الألوان، وأهم فعلين. اضغط 🔊 عشان تسمع النطق.</p>
      </div>
      {sections.map((sec) => (
        <section key={sec.id} id={sec.id} className="rounded-2xl border border-line bg-card p-5">
          <h2 className="de text-2xl font-semibold">{sec.title} <span className="ar-title text-xl text-muted">· {sec.ar}</span></h2>
          {sec.note && <p className="ar-title mt-2 text-lg leading-8 text-muted">{sec.note}</p>}
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {sec.rows.map(([de, ar]) => (
              <li key={de} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-paper px-4 py-2.5">
                <span className="de num text-lg" lang="de">{de}</span>
                <span className="flex items-center gap-2">
                  {ar && <span className="ar-title text-lg text-muted">{ar}</span>}
                  <button aria-label="نطق" onClick={() => speak(de.replace(/^\d+ – /, ''))} className="rounded-full border border-line px-2.5 py-0.5 text-sm hover:bg-card">🔊</button>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
