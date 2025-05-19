'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp, FaTwitter, FaBars, FaTimes, FaLock } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import { portfolioData } from '@/lib/data';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);

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
    { Icon: FaGithub, href: 'https://github.com/richardboase' },
    { Icon: FaLinkedin, href: 'https://linkedin.com/in/richardboase' },
    { Icon: FaTwitter, href: 'https://x.com/richardboase' },
    // { Icon: FaYoutube, href: 'https://youtube.com' }, // Example
    { Icon: FaEnvelope, href: 'mailto:richard@b0ase.com' },
    { Icon: FaWhatsapp, href: 'https://wa.me/yourphonenumber' }, // Replace with actual number
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close menu when a link is clicked (optional, good UX)
  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 text-black dark:text-white py-4 shadow-sm px-6">
      <div className="flex items-center justify-between">
        {/* Logo - Ensure white/light text in dark mode */}
        <Link 
          href="/" 
          className="text-xl text-white hover:text-gray-300 transition-colors font-mono flex items-center gap-2"
          onClick={handleMobileLinkClick}
        >
          B0ASE.COM
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          {sectionLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right side container */}
        <div className="flex items-center space-x-4">
          {/* Desktop Utility Links */}
          <div className="hidden md:flex items-center space-x-4">
            {utilityLinks.map((link) => (
              <span key={link.name} className="flex items-center gap-1">
                <Link href={link.href} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
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
            ))}
          </div>

          {/* Social Icons and Theme Toggle Container */}
          <div className="flex items-center space-x-3">
            {socialLinks.map((link, index) => (
              <a key={index} href={link.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <link.Icon size={18} />
              </a>
            ))}
            <ThemeToggle />
            {/* Admin Link (padlock icon) */}
            <Link href="/admin" aria-label="Admin Dashboard" className="text-gray-400 hover:text-blue-400 transition-colors ml-2">
              <FaLock size={18} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} aria-label="Toggle menu" className="text-gray-300 hover:text-white focus:outline-none">
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Apply dark class explicitly? Maybe not needed if body handles it */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gray-900 dark:bg-gray-900 border-t border-gray-800 dark:border-gray-800 shadow-lg py-4 px-4">
           {/* Ensure links have dark styles */} 
          <nav className="flex flex-col space-y-3 mb-4">
            {sectionLinks.map((link) => (
              <Link key={`mobile-${link.name}`} href={link.href} className="block text-base font-medium text-gray-300 hover:text-white transition-colors" onClick={handleMobileLinkClick}>
                {link.name}
              </Link>
            ))}
            {/* Admin Link (padlock icon) in mobile menu */}
            <Link href="/admin" aria-label="Admin Dashboard" className="block text-base font-medium text-gray-300 hover:text-blue-400 transition-colors mt-2" onClick={handleMobileLinkClick}>
              <span className="inline-flex items-center gap-2"><FaLock size={16} /> Admin</span>
            </Link>
          </nav>
          <div className="border-t border-gray-700 dark:border-gray-700 pt-4 flex flex-col space-y-3"> 
             {utilityLinks.map((link) => (
              <Link key={`mobile-${link.name}`} href={link.href} className="block text-base font-medium text-gray-300 hover:text-white transition-colors" onClick={handleMobileLinkClick}>
                {link.name}
              </Link>
            ))}
          </div>

          {/* Service Links */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex flex-col space-y-3 mb-4">
             <span className="px-1 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Services</span>
             {portfolioData.services.map((service) => (
                <Link key={`mobile-service-${service.slug}`} href={`/services/${service.slug}`} className="block text-base font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors" onClick={handleMobileLinkClick}>
                  {service.title}
                </Link>
             ))}
          </div>
        </div>
      )}
    </header>
  );
} 