import '~/styles/globals.css';

import { type Metadata } from 'next';
import { ThemeDropdown, ThemeProvider } from '~/components/theme';
import { Toaster } from '~/components/ui/sonner';
import { TooltipProvider } from '~/components/ui/tooltip';
import { GeistSans } from 'geist/font/sans';

export const metadata: Metadata = {
  title: 'Carta',
  description: 'A new word',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

type RootLayoutProps = {
  children?: React.ReactNode;
};

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang='en' className={`${GeistSans.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
            <div className='absolute right-2 top-2'>
              <ThemeDropdown />
            </div>
          </TooltipProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
