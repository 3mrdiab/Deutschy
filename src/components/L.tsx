'use client';
import { useLang } from '@/lib/i18n';
import { glossOf, topicName, pluralText, type Word } from '@/lib/data';
export function Gloss({ w }: { w: Word }) { const { lang } = useLang(); return <>{glossOf(w, lang)}</>; }
export function TopicName({ id }: { id: string }) { const { lang } = useLang(); return <>{topicName(id, lang)}</>; }
export function PluralText({ w }: { w: Word }) { const { lang } = useLang(); return <>{pluralText(w, lang)}</>; }
export function LevelText({ id, f }: { id: string; f: 'name' | 'desc' }) {
  const { lang } = useLang();
  return <LevelTextInner id={id} f={f} lang={lang} />;
}
import { levelOf } from '@/lib/levels';
function LevelTextInner({ id, f, lang }: { id: string; f: 'name' | 'desc'; lang: 'ar' | 'en' }) {
  const l = levelOf(id)!;
  return <>{f === 'name' ? (lang === 'ar' ? l.nameAr : l.nameEn) : lang === 'ar' ? l.descAr : l.descEn}</>;
}
export function Planned({ id }: { id: string }) {
  const { lang } = useLang();
  const l = levelOf(id)!;
  return <ul className="mt-3 list-disc space-y-1 ps-6 text-lg">{(lang === 'ar' ? l.plannedAr : l.plannedEn).map((p) => <li key={p}>{p}</li>)}</ul>;
}
