import type { Metadata } from 'next';
import { Space_Grotesk, Montserrat } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import GlobalNotification from '@/components/GlobalNotification';
import SearchModal from '@/components/SearchModal';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ENDLEZZ MARKET | Premium Brutalist Streetwear',
    template: '%s | ENDLEZZ MARKET'
  },
  description: 'Immersive full-stack streetwear ecommerce platform. Built around the core human principles: Discipline, Silence, Resilience. Explore the Grid, Minimalist, and Angel Collections.',
  keywords: ['streetwear', 'brutalist fashion', 'oversized tees', 'cropped polo', 'discipline', 'silence', 'resilience', 'philippines clothing', 'endlezz market'],
  openGraph: {
    title: 'ENDLEZZ MARKET | Streetwear Redefined',
    description: 'Immersive streetwear experience engineered with discipline and resilience.',
    url: 'https://endlezz.market',
    siteName: 'Endlezz Market',
    locale: 'en_PH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ENDLEZZ MARKET',
    description: 'Premium streetwear built around structural discipline.',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${montserrat.variable} h-full antialiased dark`}
      style={{ colorScheme: 'dark' }}
    >
      <body className="min-h-full bg-black text-zinc-100 font-sans flex flex-col selection:bg-zinc-800 selection:text-white overflow-x-hidden">
        <StoreProvider>
          {/* Global UI Components */}
          <GlobalNotification />
          <SearchModal />
          
          {/* Header Navigation */}
          <Navbar />
          
          {/* Slide-out bag drawer */}
          <CartDrawer />
          
          {/* Main page content area */}
          <main className="flex-grow flex flex-col pt-[104px]">
            {children}
          </main>
          
          {/* Site footer */}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
