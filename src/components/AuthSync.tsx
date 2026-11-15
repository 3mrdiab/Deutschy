'use client';
import { useEffect } from 'react';
import { load, mergeRemote, setLoggedIn } from '@/lib/store';

export default function AuthSync() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let on = false;
    const push = () => {
      if (!on) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const s = load();
        fetch('/api/me/progress', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ xp: s.xp, streak: s.streak, best: s.best, lastDay: s.lastDay, data: { seen: s.seen, name: s.name } }) }).catch(() => {});
      }, 1500);
    };
    fetch('/api/auth/me', { cache: 'no-store' }).then((r) => r.json()).then(async (j) => {
      if (!j.user) return;
      on = true; setLoggedIn(true);
      const r = await fetch('/api/me/progress', { cache: 'no-store' }).then((x) => x.json()).catch(() => null);
      if (r?.progress) mergeRemote(r.progress);
      push();
    }).catch(() => {});
    window.addEventListener('deutschy:update', push);
    return () => { clearTimeout(timer); window.removeEventListener('deutschy:update', push); };
  }, []);
  return null;
}
