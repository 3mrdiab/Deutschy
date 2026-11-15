import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import GameRunner from '@/components/GameRunner';

const ids = ['flashcards', 'quiz', 'article', 'spelling', 'memory'];
export const dynamicParams = false;
export const generateStaticParams = () => ids.map((game) => ({ game }));

export default async function GamePage({ params }: { params: Promise<{ game: string }> }) {
  const { game } = await params;
  if (!ids.includes(game)) notFound();
  return <Suspense fallback={null}><GameRunner game={game} /></Suspense>;
}
