import type { Metadata } from 'next';
import { Anton, Archivo, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import GlobalNotification from '@/components/GlobalNotification';
import SearchModal from '@/components/SearchModal';

const anton = Anton({
  variable: '--font-anton',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ENDLEZZ — Streetwear, Manila',
    template: '%s | ENDLEZZ',
  },
  description:
    'Boxy cropped polos and camp shirts built around Discipline, Silence, Resilience. Shop the Grid, Minimalist and Angel collections.',
  keywords: ['streetwear', 'cropped polo', 'camp shirt', 'philippines clothing', 'endlezz market', 'manila streetwear'],
  openGraph: {
    title: 'ENDLEZZ — Streetwear, Manila',
    description: 'Boxy cropped polos and camp shirts. Grid, Minimalist and Angel collections.',
    url: 'https://endlezz.market',
    siteName: 'Endlezz Market',
    locale: 'en_PH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ENDLEZZ',
    description: 'Boxy cropped polos and camp shirts.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${archivo.variable} ${jetbrains.variable} h-full antialiased`}
      style={{ colorScheme: 'light' }}
    >
      <body className="min-h-full bg-paper text-ink font-sans flex flex-col overflow-x-hidden">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:bg-ink focus:text-paper focus:px-4 focus:py-2 label"
        >
          Skip to content
        </a>
        <StoreProvider>
          <GlobalNotification />
          <SearchModal />
          <Navbar />
          <CartDrawer />
          <main id="main" className="flex-grow flex flex-col pt-[var(--header-h)]">
            {children}
          </main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
