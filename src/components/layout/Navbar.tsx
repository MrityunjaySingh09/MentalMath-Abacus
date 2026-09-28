'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, BookOpen, Trophy, Zap, Bot, BarChart2, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart2 },
    { href: '/learn/abacus', label: 'Mental Abacus', icon: Brain },
    { href: '/practice/addition', label: 'Practice', icon: Zap },
    { href: '/techniques', label: 'Techniques', icon: BookOpen },
    { href: '/benchmark', label: 'Benchmark', icon: Trophy },
    { href: '/ai-coach', label: 'AI Coach', icon: Bot },
  ];

  return (
    <nav className="w-full bg-[#FFFDF8]/90 backdrop-blur-md border-b border-[#D9D5CA] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-xl bg-[#173F35] flex items-center justify-center text-[#F7F3EA] shadow-sm transition group-hover:bg-[#0F2C25]">
            <Brain className="w-5 h-5 text-[#F7F3EA]" />
          </div>
          <div>
            <span className="text-lg font-extrabold text-[#173F35] tracking-tight block font-sans">
              Mental<span className="text-[#C96F4A]">Math</span>
            </span>
            <span className="text-[10px] text-[#6B746F] font-mono uppercase tracking-widest block -mt-1 font-semibold">
              Calculation Training
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-2 ${
                  isActive
                    ? 'bg-[#173F35] text-[#FFFDF8] font-bold shadow-sm'
                    : 'text-[#6B746F] hover:text-[#18211E] hover:bg-[#F7F3EA]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA & Mobile Menu Button */}
        <div className="flex items-center space-x-2">
          <Link
            href="/practice/addition"
            className="hidden sm:flex px-4 py-2 bg-[#C96F4A] hover:bg-[#B85B38] text-[#FFFDF8] font-bold rounded-lg text-xs shadow-sm transition items-center space-x-1.5"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Start Training</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-lg text-[#173F35] hover:bg-[#F7F3EA] transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFDF8] border-b border-[#D9D5CA] px-4 py-4 space-y-2 font-sans shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-semibold transition flex items-center space-x-3 ${
                  isActive
                    ? 'bg-[#173F35] text-[#FFFDF8] font-bold'
                    : 'text-[#18211E] hover:bg-[#F7F3EA]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-[#E5E0D5]">
            <Link
              href="/practice/addition"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 bg-[#C96F4A] hover:bg-[#B85B38] text-[#FFFDF8] font-bold rounded-xl text-xs shadow-sm transition flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Start Training Now</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
