import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'Deutschy – تعلّم الألماني بالعربي المصري',
  description: 'منصة لتعلم الألماني بكل مستوياته من A1 لحد C2، بالصور والألعاب وشرح بالعربي المصري.',
  metadataBase: new URL('https://deutschy.pages.dev'),
  openGraph: { title: 'Deutschy', description: 'تعلّم الألماني بكل مستوياته بالصور والألعاب', url: 'https://deutschy.pages.dev', locale: 'ar_EG' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" data-theme="papier">
      <body>
        <Nav />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-6xl border-t border-line px-4 py-8 text-xs text-muted">
          <p>Deutschy · الصور من Wikimedia Commons بتراخيص مفتوحة – <Link className="underline" href="/credits/">حقوق الصور</Link></p>
        </footer>
      </body>
    </html>
  );
}
