'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from './components/Header';
import Footer from './components/Footer';
import ProjectCardImage from './components/ProjectCardImage';
import ProjectCardLoginOverlay from './components/ProjectCardLoginOverlay';
import { portfolioData, Project } from '@/lib/data';
import { FaExternalLinkAlt, FaGithub, FaInfoCircle, FaArrowRight, FaLinkedin, FaLock, FaLaptopCode, FaPencilRuler, FaVideo, FaBullhorn, FaHandsHelping, FaCog, FaComments, FaTools, FaTwitter, FaTelegramPlane, FaDiscord } from 'react-icons/fa';
import { BsCurrencyBitcoin } from "react-icons/bs";
import CharacterCycle from './components/CharacterCycle';

// Uncomment icons
const GitHubIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>;
const XIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const NotionIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>; 
const TokenIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm0-1.143A6.857 6.857 0 1 1 8 1.143a6.857 6.857 0 0 1 0 13.714z"/><path d="M6.29 8.51H4.844V6.66h.33L6.29 8.51zm2.47-1.615c0-.58-.4-1.047-1.063-1.047H6.42v4.33h1.374c.68 0 1.086-.467 1.086-1.08V6.895zm-1.22 1.857H6.81V6.24h.74c.39 0 .625.246.625.6v1.867c0 .348-.248.602-.64.602zM11.156 8.51h-1.45v-1.85h.33l1.12 1.85z"/></svg>; 

const services = [
  {
    id: 'web-design-development',
    slug: 'web-development', // Keep slug for routing if web-development page uses this data
    title: 'Web Design & Development',
    description: 'Building responsive, performant websites & applications using modern tech, including Web3, crypto & blockchain integrations.',
    Icon: FaLaptopCode,
    priceInfo: 'Est. Rate: £120/hr | £480/day'
  },
  {
    id: 'software-development',
    slug: 'software-development',
    title: 'Software Development',
    description: 'App development and technical support for start-ups, with a special focus on crypto, blockchain, and AI innovation.',
    Icon: FaCog, // Using FaCog as a general software icon
    priceInfo: 'Est. Rate: £120/hr | £480/day'
  },
  {
    id: 'content-copywriting',
    slug: 'content-copywriting',
    title: 'Content & Copywriting',
    description: 'Crafting compelling narratives, articles, and website copy tailored to your audience.',
    Icon: FaPencilRuler, // Using FaPencilRuler as it relates to creation/design
    priceInfo: 'Est. Rate: £100/hr | £400/day'
  },
  {
    id: 'video-production-photography',
    slug: 'video-production',
    title: 'Video Production & Photography',
    description: 'From concept and shooting to editing and final delivery for promotional or creative needs, including high-quality photography.',
    Icon: FaVideo,
    priceInfo: 'Est. Rate: £110/hr | £450/day'
  },
  {
    id: 'logo-design-branding',
    slug: 'logo-branding',
    title: 'Logo Design & Branding',
    description: 'Crafting unique logos and visual identities that effectively represent your brand.',
    Icon: FaPencilRuler, // Re-using FaPencilRuler or consider a more specific branding icon
    priceInfo: 'Est. Rate: £90/hr | Project-based'
  },
  {
    id: 'seo-digital-marketing',
    slug: 'seo-marketing',
    title: 'SEO & Digital Marketing',
    description: 'Optimizing online presence and content strategy to drive organic growth.',
    Icon: FaBullhorn,
    priceInfo: 'Est. Rate: £110/hr | £450/day'
  },
  {
    id: 'social-media-management',
    slug: 'social-media-management',
    title: 'Social Media Management',
    description: 'Developing strategies, creating content, and managing social media presence to grow engagement and reach.',
    Icon: FaComments,
    priceInfo: 'Est. Rate: £80/hr | Retainer'
  },
  {
    id: 'technical-consulting',
    slug: 'technical-consulting',
    title: 'Technical Consulting',
    description: 'Providing expert advice and strategy for your digital projects and technical challenges.',
    Icon: FaTools, // Using FaTools as a general consulting/technical icon
    priceInfo: 'Est. Rate: £150/hr'
  },
  {
    id: 'support-maintenance',
    slug: 'support-maintenance',
    title: 'Support & Maintenance',
    description: 'Ongoing technical support, updates, and optimization to ensure your digital assets run smoothly and securely.',
    Icon: FaHandsHelping,
    priceInfo: 'Retainer-based | Ad-hoc rates available'
  }
];

export default function PortfolioPage() {
  const projects: Project[] = portfolioData.projects as Project[];
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAboutVisible(true);
    }, 100);
    // Force dark theme
    document.documentElement.classList.add('dark');
    return () => {
      clearTimeout(timer);
      // Optionally remove the dark class on component unmount if needed elsewhere
      // document.documentElement.classList.remove('dark'); 
    };
  }, []);

  console.log("Name prop for CharacterCycle:", portfolioData.about.name); 

  return (
    <div className="flex flex-col bg-black">
      {/* <ClientForm /> */}
      <main className="px-6 py-12 md:py-16 flex-grow">
        {/* About Section - Apply fade-in */}
        <section id="about" className="mb-16 md:mb-24 scroll-mt-20">
          {/* Apply transition and opacity classes */}
          <div className={`relative bg-white dark:bg-black p-6 md:p-8 border border-gray-200 dark:border-gray-800 shadow-md dark:shadow-xl transition-opacity duration-700 ease-in-out ${isAboutVisible ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="relative text-3xl md:text-4xl text-black dark:text-white mb-4 font-mono min-h-[2.5rem]">
                <span className="invisible">{portfolioData.about.name}</span>
                <span className="absolute inset-0">
                  <CharacterCycle text={portfolioData.about.name} cycleDuration={50} />
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
            {/* Social Links - Added */}
            <div className="mt-6 flex justify-center md:justify-start space-x-4">
              {portfolioData.about.socials.github && (
                 <a href={portfolioData.about.socials.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                   <FaGithub size={24} />
                 </a>
              )}
              {portfolioData.about.socials.linkedin && (
                <a href={portfolioData.about.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  <FaLinkedin size={24} />
                </a>
              )}
              {portfolioData.about.socials.x && (
                <a href={portfolioData.about.socials.x} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  <XIcon />
                </a>
              )}
               {portfolioData.about.socials.telegram && portfolioData.about.socials.telegram !== '#telegram' && (
                <a href={portfolioData.about.socials.telegram} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  <FaTelegramPlane size={24} />
                </a>
              )}
               {portfolioData.about.socials.discord && portfolioData.about.socials.discord !== '#discord' && (
                <a href={portfolioData.about.socials.discord} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  <FaDiscord size={24} />
                </a>
              )}
               {/* Add other social links as needed */}
            </div>
            {/* Postage stamp token box in top right - Modified to be smaller by removing separate title */}
            <div className="absolute top-4 right-4 bg-gray-100 dark:bg-gray-900 px-2 py-2 border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-400 rounded shadow-md flex flex-col items-start min-w-[120px] max-w-[160px] z-10">
              <a 
                href="https://1sat.market/market/bsv21/c3bf2d7a4519ddc633bc91bbfd1022db1a77da71e16bb582b0acc0d8f7836161_1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center px-3 py-1 bg-blue-600 dark:bg-blue-700 text-white text-xs font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-sm dark:shadow-md rounded"
              >
                Trade on 1Sat Market <FaExternalLinkAlt className="ml-1" />
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
            {services.map((service) => (
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
            {projects.filter(p => p.type === 'domain' || p.type === 'client').map((project) => {
              const primaryImageUrl = project.cardImageUrls && project.cardImageUrls.length > 0 ? project.cardImageUrls[0] : null;
              return (
                <div 
                  key={project.id}
                  className="relative group bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-md dark:shadow-xl flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:brightness-105 dark:hover:brightness-110"
                  onMouseEnter={() => setHoveredProjectId(project.id)}
                  onMouseLeave={() => setHoveredProjectId(null)}
                >
                  {/* Content wrapper - sits on top of all overlays */}
                  <div className="relative z-10 flex flex-col flex-grow p-6 overflow-auto"> 
                    {/* Persistent Social Links Bar (z-20 relative to this z-10 container) */}
                    <div className="absolute top-2 right-2 z-20 flex items-center gap-2 p-1 bg-gradient-to-l from-black/30 dark:from-black/50 to-transparent rounded-bl-sm">
                      {project.tokenName && (
                        <a
                          href={project.tokenMarketUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-xs text-gray-200 dark:text-gray-300 hover:text-white dark:hover:text-gray-100 transition-colors ${!project.tokenMarketUrl && 'opacity-50 cursor-not-allowed'} font-mono font-bold px-1`}
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
                          className="text-gray-200 dark:text-gray-300 hover:text-white dark:hover:text-gray-100 transition-colors"
                          title="View on GitHub"
                        >
                          <FaGithub size={14} />
                        </a>
                      )}
                      {project.xUrl && project.xUrl !== '#' && (
                        <a
                          href={project.xUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-200 dark:text-gray-300 hover:text-white dark:hover:text-gray-100 transition-colors"
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
                          className="text-gray-200 dark:text-gray-300 hover:text-white dark:hover:text-gray-100 transition-colors"
                          title="View Documentation"
                        >
                          <NotionIcon />
                        </a>
                      )}
                      <a
                        href={`mailto:${portfolioData.contact.email}?subject=Inquiry about ${project.title}`}
                        className="text-gray-200 dark:text-gray-300 hover:text-white dark:hover:text-gray-100 transition-colors"
                        title="Contact About Project"
                      >
                        <FaInfoCircle size={14} />
                      </a>
                    </div>

                    {/* Main image/avatar area - this is the small circular logo */}
                    <div className="absolute top-3 left-3 z-20 w-20 h-20 flex items-start justify-start">
                      {primaryImageUrl && (
                        <ProjectCardImage 
                          imageUrls={project.cardImageUrls!}
                          alt={`${project.title} logo`}
                        />
                      )}
                    </div>

                    {/* Text content area */}
                    <div className="flex flex-col flex-grow mt-16">
                      <h3 className="text-lg font-semibold text-black dark:text-white mb-1">
                        <a 
                          href={project.liveUrl || '#'} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded"
                        >
                          {project.title}
                        </a>
                      </h3>
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
                </div>
              );
            })}
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