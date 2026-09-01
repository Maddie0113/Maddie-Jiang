import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Maddie Jiang | 蒋倩的个人网站',
  description: '蒋倩的运营策划、视觉设计与产品体验互动作品集。',
  openGraph: { title: 'Maddie Jiang | 蒋倩的个人网站', description: '把创意做成可以发生的事。', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title: 'Maddie Jiang | 蒋倩的个人网站', description: '把创意做成可以发生的事。', images: ['/og.png'] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
