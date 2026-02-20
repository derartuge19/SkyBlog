'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// logo removed per request
import { usePathname } from 'next/navigation';

export function MainNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    // No nav items needed
  ];
  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <div className="relative h-28 w-28">
                <Image
                  src="/images/skykin_logo.png"
                  alt="SKYKIN"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:space-x-4 items-center">
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
          </div>
        </div>
      </div>
    </nav>
  );
}
