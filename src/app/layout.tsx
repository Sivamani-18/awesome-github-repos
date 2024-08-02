import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Awesome GitHub Repos',
  description:
    'Search and filter GitHub repositories based on stars, language, and topics. Explore popular repositories and discover new projects.',
  openGraph: {
    title: 'Awesome GitHub Repos',
    description:
      'Search and filter GitHub repositories based on stars, language, and topics. Explore popular repositories and discover new projects.',
    url: 'https://sivamani-18.github.io/awesome-github-repos/', // Replace with your domain
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Awesome GitHub Repos',
    description:
      'Search and filter GitHub repositories based on stars, language, and topics. Explore popular repositories and discover new projects.',
    // creator: '@yourtwitterhandle', // Replace with your Twitter handle
  },
  keywords: [
    'GitHub',
    'Repositories',
    'Search',
    'Filter',
    'Stars',
    'Language',
    'Topics',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
