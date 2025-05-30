'use client';

import React from 'react';
import Link from 'next/link';
import { FaRocket, FaUsers, FaLink, FaHandshake, FaBriefcase, FaProjectDiagram, FaUserPlus, FaUserSecret, FaCubes } from 'react-icons/fa';

interface WelcomeActionsCardProps {
  onDismiss: () => void;
}

const WelcomeActionsCard: React.FC<WelcomeActionsCardProps> = ({ onDismiss }) => {
  const buttonStyle = "flex-grow md:flex-grow-0 flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg shadow-md transition-colors duration-150 ease-in-out backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50";

  const handleLinkClick = () => {
    onDismiss();
  };

  return (
    <section className="mb-12 p-6 md:p-8 bg-gradient-to-br from-sky-600 via-sky-700 to-blue-800 rounded-xl shadow-2xl text-white">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
        <div className="hidden md:block shrink-0">
          <FaRocket className="w-20 h-20 text-sky-300 opacity-70 transform -rotate-12" />
        </div>
        <div className="flex-grow text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Ready to build something amazing?</h2>
          <p className="text-lg text-sky-100/90 mb-6 leading-relaxed">
            Welcome to b0ase.com! This is your hub to bring your digital ideas to life. Start a new project to define your vision, outline features, and begin collaborating with our team. Whether it's a website, a mobile app, an AI solution, or something entirely new, we're here to help you build it.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4">
            <Link href="/projects/new" className={buttonStyle} onClick={handleLinkClick}>
              <FaRocket className="text-sky-300" /> Start a New Project
            </Link>
            <Link href="/teams/new" className={buttonStyle} onClick={handleLinkClick}>
              <FaUsers className="text-sky-300" /> Start a New Team
            </Link>
            <Link href="https://b0ase.com/teams/join" target="_blank" rel="noopener noreferrer" className={buttonStyle} onClick={handleLinkClick}>
              <FaProjectDiagram className="text-sky-300" /> Join a Project
            </Link>
            <Link href="https://b0ase.com/teams/join" target="_blank" rel="noopener noreferrer" className={buttonStyle} onClick={handleLinkClick}>
              <FaUserPlus className="text-sky-300" /> Join a Team
            </Link>
            <Link href="/careers" className={buttonStyle} onClick={handleLinkClick}>
              <FaBriefcase className="text-sky-300" /> Careers
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeActionsCard; 