'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from './components/Header';
import Footer from './components/Footer';
import ProjectCardImage from './components/ProjectCardImage';
import ProjectCardLoginOverlay from './components/ProjectCardLoginOverlay';
import { portfolioData, Project } from '@/lib/data';
import { FaExternalLinkAlt, FaGithub, FaInfoCircle, FaArrowRight, FaLinkedin, FaLock } from 'react-icons/fa';
import { BsCurrencyBitcoin } from "react-icons/bs";
import CharacterCycle from './components/CharacterCycle';

// Uncomment icons
const GitHubIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>;
const XIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const NotionIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>; 
const TokenIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm0-1.143A6.857 6.857 0 1 1 8 1.143a6.857 6.857 0 0 1 0 13.714z"/><path d="M6.29 8.51H4.844V6.66h.33L6.29 8.51zm2.47-1.615c0-.58-.4-1.047-1.063-1.047H6.42v4.33h1.374c.68 0 1.086-.467 1.086-1.08V6.895zm-1.22 1.857H6.81V6.24h.74c.39 0 .625.246.625.6v1.867c0 .348-.248.602-.64.602zM11.156 8.51h-1.45v-1.85h.33l1.12 1.85z"/></svg>; 

export default function PortfolioPage() {
  const projects: Project[] = portfolioData.projects as Project[];
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAboutVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col">
      <main className="px-6 py-12 md:py-16 flex-grow">
        {/* About Section - Apply fade-in */}
        <section id="about" className="mb-16 md:mb-24 scroll-mt-20">
          {/* Apply transition and opacity classes */}
          <div className={`bg-white dark:bg-black p-6 md:p-8 border border-gray-200 dark:border-gray-800 shadow-md dark:shadow-xl 
                         transition-opacity duration-700 ease-in-out ${isAboutVisible ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="relative text-3xl md:text-4xl text-black dark:text-white mb-4 font-mono min-h-[2.5rem]">
                <span className="invisible">{portfolioData.about.name}</span>
                <span className="absolute inset-0">
                  <CharacterCycle text={portfolioData.about.name} cycleDuration={40} />
                </span>
            </h1>
            <p className="relative text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-4">
              <span className="invisible">{portfolioData.about.tagline}</span>
              <span className="absolute inset-0">
                <CharacterCycle text={portfolioData.about.tagline} cycleDuration={20} />
              </span>
            </p>
            <p className="relative text-base text-gray-600 dark:text-gray-400 mb-6 whitespace-pre-line">
               <span className="invisible">{portfolioData.about.bio}</span>
               <span className="absolute inset-0">
                 <CharacterCycle text={portfolioData.about.bio} cycleDuration={5} />
                </span>
            </p>
            <div className="flex space-x-4 mb-6">
              <a href={portfolioData.about.socials.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                <FaGithub size={24} />
              </a>
              <a href={portfolioData.about.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                <FaLinkedin size={24} /> 
              </a>
            </div>
            <div className="bg-gray-100 dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-400">
              <h3 className="font-semibold text-black dark:text-white mb-2 flex items-center">
                <BsCurrencyBitcoin className="mr-2" /> {portfolioData.about.token.name} ({portfolioData.about.token.ticker})
              </h3>
              <p className="mb-2">{portfolioData.about.token.description}</p>
              <a 
                href={portfolioData.about.token.marketLink}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white text-xs font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm dark:shadow-md"
              >
                View Market <FaExternalLinkAlt className="ml-2" />
              </a>
            </div>
          </div>
        </section>

        {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
        {/* Services Section - Apply dark: variants */}
        <section id="services" className="mb-16 md:mb-24 scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
            <span className="text-blue-500 dark:text-blue-400">//</span> Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioData.services.map((service) => (
              <Link 
                key={service.id} 
                href={`/services/${service.slug}`}
                className="block bg-white dark:bg-black p-6 border border-gray-200 dark:border-gray-800 shadow-md dark:shadow-xl flex flex-col transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:brightness-110 dark:hover:brightness-125"
              >
                <h3 className="text-xl font-semibold text-black dark:text-white mb-2">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow">{service.description}</p>
                {service.priceInfo && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 italic mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">{service.priceInfo}</p>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* Skills Section - Apply dark: variants */}
        <section id="skills" className="mb-16 md:mb-24 scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
            <span className="text-green-500 dark:text-green-400">*</span> Technical Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {portfolioData.skills.technical.map((skill) => (
              <span key={skill} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium px-2.5 py-0.5 border border-gray-300 dark:border-gray-700 shadow-sm">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Projects (Domains) Section */}
        <section id="projects" className="mb-16 md:mb-24 scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
            &lt;ClientProjects&gt;
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.filter(p => p.type === 'domain').map((project) => (
              <div 
                key={project.id} 
                className="relative group bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-md dark:shadow-xl flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:brightness-105 dark:hover:brightness-110"
                onMouseEnter={() => setHoveredProjectId(project.id)}
                onMouseLeave={() => setHoveredProjectId(null)}
              >
                {/* Persistent Social Links Bar */}
                <div className="absolute top-0 right-0 z-20 flex items-center gap-2 p-2 bg-gradient-to-l from-black/90 to-transparent">
                  {project.tokenName && (
                    <a
                      href={project.tokenMarketUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-gray-400 hover:text-gray-300 transition-colors ${!project.tokenMarketUrl && 'opacity-50 cursor-not-allowed'} font-mono font-bold`}
                      title={`View ${project.tokenName} Token`}
                    >
                      $
                    </a>
                  )}
                  {project.githubUrl && project.githubUrl !== '#' && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-300 transition-colors"
                      title="View on GitHub"
                    >
                      <FaGithub size={16} />
                    </a>
                  )}
                  {project.xUrl && project.xUrl !== '#' && (
                    <a
                      href={project.xUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-300 transition-colors"
                      title="View on X"
                    >
                      <XIcon />
                    </a>
                  )}
                  {project.notionUrl && project.notionUrl !== '#' && (
                    <a
                      href={project.notionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-300 transition-colors"
                      title="View Documentation"
                    >
                      <NotionIcon />
                    </a>
                  )}
                  <a
                    href={`mailto:${portfolioData.contact.email}?subject=Inquiry about ${project.title}`}
                    className="text-gray-400 hover:text-gray-300 transition-colors"
                    title="Contact About Project"
                  >
                    <FaInfoCircle size={16} />
                  </a>
                </div>

                <div className="relative w-full h-40 bg-gradient-to-b from-black to-gray-900 dark:from-black dark:to-gray-900 flex items-center justify-start p-4">
                  <ProjectCardImage 
                    imageUrls={project.cardImageUrls || []} 
                    alt={`${project.title} logo`}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-black to-transparent"></div>
                </div>
                <div className="relative p-5 flex flex-col flex-grow transition-opacity duration-300 group-hover:opacity-0 group-hover:pointer-events-none">
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-1">{project.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex-grow">{project.description}</p>
                  <div className="mb-3 flex flex-wrap gap-1">
                    {project.status && (
                      <span className={`text-xs font-medium mr-1 px-2 py-0.5 inline-block w-max border 
                        ${project.status === 'Live' ? 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-300' : 
                         project.status === 'Ltd Company' ? 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300' :
                         project.status === 'In Development' ? 'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-300' : 
                         'bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                        }
                      `}>
                         {project.status}
                      </span>
                    )}
                    {project.tokenName && (
                      <span className="bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-300 border text-xs font-medium mr-1 px-2 py-0.5 inline-block w-max">
                        Token: {project.tokenName}
                      </span>
                    )}
                  </div>
                  {typeof project.tokenProgressPercent === 'number' && (
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 mb-3">
                      <div className="bg-blue-500 dark:bg-blue-600 h-1" style={{ width: `${project.tokenProgressPercent}%` }}></div>
                    </div>
                  )}
                  <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end">
                    <Link href={`/projects/${project.slug}`} className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium inline-flex items-center">
                      Details <FaArrowRight className="ml-1" size={10}/>
                    </Link>
                  </div>
                </div>
                <ProjectCardLoginOverlay project={project} isVisible={hoveredProjectId === project.id} />
              </div>
            ))}
          </div>
        </section>

        {/* Development (GitHub Repos) Section */}
        <section id="development" className="mb-16 md:mb-24 scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
            <span className="text-purple-500 dark:text-purple-400">#</span> Open Source / Development
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.filter(p => p.type === 'github').map((project) => (
              <div key={project.id} className="bg-white dark:bg-black p-6 border border-gray-200 dark:border-gray-800 shadow-md dark:shadow-xl flex flex-col transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:brightness-110 dark:hover:brightness-125">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-1">{project.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex-grow">{project.description}</p>
                {project.status && (
                  <span className={`text-xs font-medium mr-2 px-2 py-0.5 mb-2 inline-block w-max border
                    ${project.status === 'Live' ? 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-300' : 
                     project.status === 'Archived' ? 'bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400' : 
                     'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-300'}
                  `}>
                    {project.status}
                  </span>
                )}
                <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex space-x-3">
                  {project.githubUrl && project.githubUrl !== '#' && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" title="View Repository">
                      <FaGithub size={16}/>
                    </a>
                  )}
                  {project.xUrl && project.xUrl !== '#' && (
                    <a href={project.xUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors" title="Visit X Profile">
                      <FaExternalLinkAlt size={16}/>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section - Apply dark: variants */}
        <section id="contact" className="mb-16 md:mb-24 scroll-mt-20">
            <div className="bg-white dark:bg-black p-6 md:p-8 border border-gray-200 dark:border-gray-800 shadow-md dark:shadow-xl text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-4">
                   <span className="text-red-500 dark:text-red-400">@</span>Get in Touch
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">Interested in collaborating or discussing a project? Reach out via email.</p>
                <a 
                    href={`mailto:${portfolioData.contact.email}`}
                    className="inline-flex items-center px-6 py-3 bg-black dark:bg-blue-700 text-white dark:text-white text-base font-medium hover:bg-gray-800 dark:hover:bg-blue-600 transition-colors shadow-sm dark:shadow-md"
                >
                   Contact B0ASE
                </a>
            </div>
        </section>

      </main>
    </div>
  );
}