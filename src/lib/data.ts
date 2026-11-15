import raw from '../../data/vocab.json';

export type Photo = { file: string; page: string; commons: string; license: string; author: string };
export type Word = {
  id: string; topic: string; art: 'der' | 'die' | 'das'; de: string; plural: string; ar: string; photo: Photo;
};
export type Topic = { id: string; ar: string };

export const topics: Topic[] = raw.topics;
export const words = raw.words as Word[];

export const topicTitles: Record<string, string> = {
  family: 'Familie', food: 'Essen', drinks: 'Getränke', house: 'Haus', places: 'Stadt', transport: 'Verkehr',
  clothes: 'Kleidung', animals: 'Tiere', body: 'Körper', school: 'Schule & Büro', nature: 'Natur', jobs: 'Berufe',
};
export const wordsOf = (topic: string) => words.filter((w) => w.topic === topic);
export const withArticle = (w: Word) => `${w.art} ${w.de}`;
export const pluralText = (w: Word) => (w.plural === '-' ? 'die ' + w.de + ' (نفس الشكل)' : 'die ' + w.plural);
export const img = (w: Word) => `/img/${w.id}.jpg`;

export const shuffle = <T,>(a: T[]): T[] => {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
};
export const sample = <T,>(a: T[], n: number) => shuffle(a).slice(0, n);
