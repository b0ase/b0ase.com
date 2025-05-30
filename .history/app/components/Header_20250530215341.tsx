'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaBars, FaTimes, FaLock, FaTelegramPlane, FaDiscord } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import { portfolioData } from '@/lib/data';
import { useAuth } from './Providers';
import getSupabaseBrowserClient from '@/lib/supabase/client';

// Define XIcon component locally
const XIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);
  const { session, isLoading: isLoadingAuth } = useAuth();
  const isAuthenticated = !!session;

  // Check backend connection on mount
  useEffect(() => {
    async function checkConnection() {
      try {
        const res = await fetch('/api/clients', { method: 'GET' });
        setBackendConnected(res.ok);
      } catch {
        setBackendConnected(false);
      }
    }
    checkConnection();
  }, []);

  const sectionLinks = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' }, // Combined Projects/Development
    { name: 'Contact', href: '#contact' },
  ];

  const utilityLinks = [
    { name: 'New Clients', href: '/signup' },
    { name: 'Login', href: '/login' },
    { name: 'Studio', href: '/studio' },
    { name: '$BOASE', href: '/token' },
  ];

  const socialLinks = [
    { Icon: FaGithub, href: portfolioData.about.socials.github },
    { Icon: FaLinkedin, href: portfolioData.about.socials.linkedin },
    { Icon: XIcon, href: portfolioData.about.socials.x },
  
    { Icon: FaTelegramPlane, href: portfolioData.about.socials.telegram },


    { Icon: FaDiscord, href: portfolioData.about.socials.discord },
    { Icon: FaEnvelope, href: 'mailto:richard@b0ase.com' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close menu when a link is clicked (optional, good UX)
  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle logout
  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('isLoggingOut', 'true'); // Set flag before logging out
    }
    await supabase.auth.signOut();
    // Redirect to landing page after logout
    window.location.assign('/'); 
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b border-border py-4 shadow-sm px-6">
      <div className="flex items-center justify-between">
        {/* Logo - Ensure white/light text in dark mode */}
        <Link 
          href="/" 
          className="text-xl text-foreground hover:text-foreground transition-colors font-mono flex items-center gap-2"
          onClick={handleMobileLinkClick}
        >
          b0ase.com
        </Link>

        {/* Studio link - always visible on desktop, to the right of the logo, with spacing */}
        <Link key="desktop-studio-link" href="/studio" className="text-sm font-medium text-gray-300 hover:text-white transition-colors ml-6 md:ml-8">
          Studio
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 flex-grow ml-6">
          {sectionLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right side container: Utility Links, Social Icons, Admin, Mobile Button */}
        <div className="flex items-center ml-auto">
          {/* Desktop Utility Links */}
          <div className="hidden md:flex items-center space-x-4 md:space-x-6">
            {isAuthenticated ? (
              // If authenticated, show Log out link
              <button onClick={handleLogout} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Log out
              </button>
            ) : (
              // If not authenticated, show New Clients, Login, and $BOASE links
              utilityLinks.filter(link => link.name !== 'Studio').map((link) => (
                <span key={link.name} className="flex items-center gap-1">
                  <Link href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                  {/* Show flashing green light next to 'New Clients' ONLY if backend is connected */}
                  {link.name === 'New Clients' && backendConnected && (
                    <span className="relative flex h-2.5 w-2.5 ml-1" title="Backend Connected">
                      {/* Apply the slower ping animation */}
                      <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                  )}
                </span>
              ))
            )}
          </div>

          {/* Social Icons and Theme Toggle Container */}
          <div className="flex items-center space-x-3 ml-4 md:ml-6">
            {/* Filter out links that might not have a valid href or are placeholders (e.g., include '#') */}
            {socialLinks
              .filter(link => link.href && !link.href.includes('#') && link.href !== '') // More robust filtering
              .map((link, index) => (
              <a key={index} href={link.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <link.Icon size={18} />
              </a>
            ))}
            {/* Commented out ThemeToggle per user request */}
            {/* <ThemeToggle /> */}
            {/* Admin Link (padlock icon) */}
            <Link href="/admin" aria-label="Admin Dashboard" className="text-muted-foreground hover:text-blue-400 transition-colors ml-2">
              <FaLock size={18} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} aria-label="Toggle menu" className="text-muted-foreground hover:text-foreground focus:outline-none">
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Apply dark class explicitly? Maybe not needed if body handles it */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gray-900 border-t border-gray-800 shadow-lg py-4 px-4">
           {/* Ensure links have dark styles */} 
          <nav className="flex flex-col space-y-3 mb-4 items-start w-full">
            {/* Studio link - always visible in mobile menu */}
            <Link key="mobile-studio-link" href="/studio" className="block text-base font-medium text-gray-300 hover:text-white transition-colors w-full" onClick={handleMobileLinkClick}>
              Studio
            </Link>
            {sectionLinks.map((link) => (
              <Link key={`${link.name}-mobile`} href={link.href} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                {link.name}
              </Link>
            ))}
            {/* Mobile Utility Links - Conditional Rendering */}
            {isAuthenticated ? (
              // If authenticated, show Log out link in mobile menu
              <button onClick={() => { handleLogout(); handleMobileLinkClick(); }} className="block text-base font-medium text-gray-300 hover:text-white transition-colors mt-3">
                Log out
              </button>
            ) : (
              // If not authenticated, show original utility links in mobile menu
              utilityLinks.filter(link => link.name !== 'Studio').map((link) => (
                <Link key={`mobile-${link.name}`} href={link.href} className="block text-base font-medium text-gray-300 hover:text-white transition-colors" onClick={handleMobileLinkClick}>
                  {link.name}
                </Link>
              ))
            )}
            {/* Admin Link (padlock icon) in mobile menu */}
            <Link href="/admin" aria-label="Admin Dashboard" className="block text-base font-medium text-gray-300 hover:text-blue-400 transition-colors mt-2" onClick={handleMobileLinkClick}>
              <span className="inline-flex items-center gap-2"><FaLock size={16} /> Admin</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
} 