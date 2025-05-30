'use client';

import React from 'react';
import Link from 'next/link';

export const sections = [
  { name: '/web design', href: '/services/web-development' },
  { name: '/software development', href: '/services/software-development' },
  { name: '/content', href: '/services/content-copywriting' },
  { name: '/video', href: '/services/video-production' },
  { name: '/branding', href: '/services/logo-branding' },
  { name: '/seo', href: '/services/seo-marketing' },
  { name: '/social', href: '/services/social-media-management' },
  { name: '/consulting', href: '/services/technical-consulting' },
  { name: '/support', href: '/services/support-maintenance' },
];

export default function SubNavigation() {
  return (
    // Hidden on mobile (e.g., hidden md:flex), shown on desktop
    // Adjust sticky top value based on Header height
    <nav className="hidden md:flex sticky top-[60px] z-30 w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 shadow-sm px-4">
      <div className="w-full flex justify-between items-center h-12 space-x-6">
        {/* Left group: Service links */}
        {/* Right group: Service links */}
        <ul className="flex space-x-4 md:space-x-6">
          {sections.map((section) => (
            <li key={section.name}>
              <Link
                href={section.href}
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                {section.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right group: External platform links */}
        <ul className="flex space-x-4 md:space-x-5 ml-auto">
          <li>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors flex items-center">
              Fiverr
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
          </li>
          <li>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors flex items-center">
              Upwork
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
          </li>
          <li>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors flex items-center">
              Freelancer
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
} 