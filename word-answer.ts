import type { State } from './store';
import { grade, dayNum } from './srs';

const localDay = (date: Date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;

/** One vocabulary answer changes one progress record, without mutating its input. */
export function wordAnswerState(current: State, id: string, ok: boolean, xp: number, now = new Date()): State {
  const today = localDay(now);
  const yesterday = new Date(now); yesterday.setDate(yesterday.getDate()-1);
  const streak = current.lastDay === today ? current.streak : current.lastDay === localDay(yesterday) ? current.streak+1 : 1;
  const seen = current.seen[id] ?? {ok:0,bad:0};
  return {
    ...current,
    xp: current.xp+xp,
    streak,
    best: Math.max(current.best,streak),
    lastDay: today,
    daily: xp>0 ? {...current.daily,[today]:(current.daily[today]??0)+xp} : current.daily,
    seen: {...current.seen,[id]:{ok:seen.ok+(ok?1:0),bad:seen.bad+(ok?0:1)}},
    srs: {...current.srs,[id]:grade(current.srs[id],ok,dayNum(now.getTime()))},
  };
}
