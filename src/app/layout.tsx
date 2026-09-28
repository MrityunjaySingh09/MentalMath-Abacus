import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'MENTALMATH — Train your brain to calculate',
  description:
    'An adaptive mental-arithmetic training platform inspired by internalized abacus visualization and creator-developed calculation strategies.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F7F3EA] text-[#18211E] min-h-screen flex flex-col font-sans selection:bg-[#C96F4A] selection:text-white">
        <Navbar />
        <main className="flex-1 px-4 md:px-8 py-8">{children}</main>
        <footer className="w-full bg-[#FFFDF8] border-t border-[#D9D5CA] py-6 text-center text-xs text-[#68736D] font-mono">
          MENTALMATH — Internalized Mental Calculation Platform • 100% Free & Hostable
        </footer>
      </body>
    </html>
  );
}
