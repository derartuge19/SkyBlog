import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SkyBlog - Insights & Stories',
  description: 'Insights, stories, and updates from SkyKin. Explore our latest articles on technology, design, and innovation.',
  keywords: 'blog, technology, design, innovation, skykin, skyblog',
  authors: [{ name: 'SkyKin' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}