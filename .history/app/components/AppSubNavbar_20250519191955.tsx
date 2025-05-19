'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaPlusSquare, FaUsers, FaProjectDiagram, FaUserPlus, FaBriefcase, FaChevronDown, FaChevronUp, FaRocket, FaCubes, FaUserSecret, FaSave, FaSpinner } from 'react-icons/fa';

const navLinks = [
  { href: '/projects/new', label: 'Start a New Project', icon: FaPlusSquare },
  { href: '/teams/new', label: 'Start a New Team', icon: FaUsers },
  { href: '/myprojects', label: 'Join a Project', icon: FaProjectDiagram },
  { href: '/teams/join', label: 'Join a Team', icon: FaUserPlus },
  { href: '/careers', label: 'Careers', icon: FaBriefcase },
  { href: '/myagent', label: 'Create Agent', icon: FaUserSecret },
  { href: '/mytoken', label: 'Launch Token', icon: FaCubes },
];

const welcomeTitle = "Ready to build something amazing?";
const welcomeSubtitle = "Welcome to b0ase.com! This is your hub to bring your digital ideas to life. Start a new project to define your vision, outline features, and begin collaborating with our team. Whether it's a website, a mobile app, an AI solution, or something entirely new, we're here to help you build it.";

interface AppSubNavbarProps {
  initialIsExpanded: boolean;
  onCollapse: () => void;
  onSaveProfile?: (e: React.FormEvent) => Promise<void>;
  isSavingProfile?: boolean;
}

export default function AppSubNavbar({ initialIsExpanded, onCollapse, onSaveProfile, isSavingProfile }: AppSubNavbarProps) {
  const pathname = usePathname() ?? '';
  const [isExpanded, setIsExpanded] = useState(initialIsExpanded);

  useEffect(() => {
    setIsExpanded(initialIsExpanded);
  }, [initialIsExpanded]);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (!newState) { // If collapsing
      onCollapse();
    }
  };

  return (
    <div className={`bg-black text-gray-300 shadow-md sticky top-28 z-30 transition-all duration-300 ease-in-out`}>
      <div className="container mx-auto px-4 bg-gradient-to-br from-sky-600 via-sky-700 to-blue-800 rounded-xl shadow-2xl">
        {isExpanded && (
          <div className="py-6 text-center border-b border-gray-700/50">
            <FaRocket className="w-12 h-12 mx-auto mb-4 text-sky-300 opacity-90" />
            <h2 className="text-2xl font-bold text-white mb-2">{welcomeTitle}</h2>
            <p className="text-md text-sky-100/90 mb-6 max-w-3xl mx-auto">{welcomeSubtitle}</p>
          </div>
        )}
        
        <div className={`flex items-center justify-between py-3 ${isExpanded ? '' : 'border-t border-gray-700/50'}`}>
          <FaRocket className="h-6 w-6 text-sky-300 mr-3 flex-shrink-0" />
          <div className={`flex items-center flex-wrap gap-2 sm:gap-3 md:gap-4 flex-grow`}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/');
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-2 py-1.5 md:px-3 md:py-2 rounded-md text-xs sm:text-sm font-medium flex items-center transition-colors duration-150 ease-in-out 
                    ${isActive
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'bg-white/10 hover:bg-white/20 text-sky-100 hover:text-white'
                    }`}
                >
                  <link.icon className={`mr-1 sm:mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`} />
                  {link.label}
                </Link>
              );
            })}
          </div>
          {pathname === '/profile' && onSaveProfile && (
            <button
              form="profile-form"
              type="submit"
              disabled={isSavingProfile}
              onClick={(e) => {
                // We don't call onSaveProfile directly here if type="submit" and form="profile-form" is used.
                // The form's onSubmit will be triggered.
                // If we needed to do something *before* submission, we could call onSaveProfile.
                // For now, let the form handle it.
              }}
              className="ml-3 px-3 py-1.5 md:px-4 md:py-2 rounded-md text-xs sm:text-sm font-medium flex items-center bg-green-500 hover:bg-green-600 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out flex-shrink-0"
            >
              {isSavingProfile ? (
                <FaSpinner className="animate-spin mr-1.5 h-4 w-4" />
              ) : (
                <FaSave className="mr-1.5 h-4 w-4" />
              )}
              {isSavingProfile ? 'Saving...' : 'Save Profile'}
            </button>
          )}
          <button 
            onClick={handleToggle} 
            className="ml-4 p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 flex-shrink-0"
            aria-label={isExpanded ? "Collapse navbar" : "Expand navbar"}
          >
            {isExpanded ? <FaChevronUp className="h-5 w-5 text-sky-100" /> : <FaChevronDown className="h-5 w-5 text-sky-100" />}
          </button>
        </div>
      </div>
    </div>
  );
} 