'use client';
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';

export type Lang = 'ar' | 'en';
const KEY = 'deutschy:lang';
const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'ar', setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setL] = useState<Lang>('ar');
  useEffect(() => {
    const saved = (localStorage.getItem(KEY) as Lang | null) ?? 'ar';
    setL(saved === 'en' ? 'en' : 'ar');
  }, []);
  const setLang = useCallback((l: Lang) => {
    setL(l);
    localStorage.setItem(KEY, l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
export const useT = () => {
  const { lang } = useLang();
  return useCallback((ar: string, en: string) => (lang === 'ar' ? ar : en), [lang]);
};
/** Inline bilingual text. */
export function T({ ar, en }: { ar: string; en: string }) {
  const { lang } = useLang();
  return <>{lang === 'ar' ? ar : en}</>;
}
