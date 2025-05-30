'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from './components/Footer';
import ProjectCardImage from './components/ProjectCardImage';
import ProjectCardLoginOverlay from './components/ProjectCardLoginOverlay';
import { portfolioData, Project } from '@/lib/data';
import { FaExternalLinkAlt, FaGithub, FaInfoCircle, FaArrowRight, FaLinkedin, FaLock, FaLaptopCode, FaPencilRuler, FaVideo, FaBullhorn, FaHandsHelping, FaCog, FaComments, FaTools, FaTwitter, FaTelegramPlane, FaDiscord, FaRocket, FaUsers, FaChartLine, FaEnvelope, FaShieldAlt, FaCube, FaCodeBranch, FaProjectDiagram, FaLightbulb, FaLink, FaBrain, FaPalette, FaCode } from 'react-icons/fa';
import { BsCurrencyBitcoin } from "react-icons/bs";
import CharacterCycle from './components/CharacterCycle';

// Uncomment icons
const GitHubIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>;
const XIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const NotionIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>; 
const TokenIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm0-1.143A6.857 6.857 0 1 1 8 1.143a6.857 6.857 0 0 1 0 13.714z"/><path d="M6.29 8.51H4.844V6.66h.33L6.29 8.51zm2.47-1.615c0-.58-.4-1.047-1.063-1.047H6.42v4.33h1.374c.68 0 1.086-.467 1.086-1.08V6.895zm-1.22 1.857H6.81V6.24h.74c.39 0 .625.246.625.6v1.867c0 .348-.248.602-.64.602zM11.156 8.51h-1.45v-1.85h.33l1.12 1.85z"/></svg>; 

const services = [
  {
    id: 'startup-incubation',
    slug: 'startup-incubation',
    title: 'Tech Startup Incubation',
    description: 'End-to-end incubation services for tech startups, from ideation to market launch, including mentorship, technical guidance, and business development support.',
    Icon: FaRocket,
  },
  {
    id: 'saas-blockchain',
    slug: 'saas-blockchain',
    title: 'SaaS on Blockchain',
    description: 'Build scalable Software-as-a-Service platforms on blockchain infrastructure with integrated tokenization, smart contracts, and decentralized features.',
    Icon: FaCog,
  },
  {
    id: 'defi-exchange',
    slug: 'defi-exchange',
    title: 'DeFi Exchange Development',
    description: 'Create decentralized finance exchanges with automated market makers, liquidity pools, yield farming, and cross-chain interoperability.',
    Icon: FaTools,
  },
  {
    id: 'blockchain-platform',
    slug: 'blockchain-platform',
    title: 'Blockchain Platform Development',
    description: 'Custom blockchain platform development with consensus mechanisms, smart contract capabilities, and scalable network architecture.',
    Icon: FaLaptopCode,
  },
  {
    id: 'tokenization-services',
    slug: 'tokenization-services',
    title: 'Tokenization & Digital Assets',
    description: 'Asset tokenization services, stablecoin development, digital payment systems, and blockchain-based record keeping solutions.',
    Icon: FaBullhorn,
  },
  {
    id: 'capital-raising',
    slug: 'capital-raising',
    title: 'Capital Raising & Team Building',
    description: 'Strategic capital raising through ICOs, STOs, private placements, and comprehensive team building for technical and business roles.',
    Icon: FaUsers,
  },
  {
    id: 'business-development',
    slug: 'business-development',
    title: 'Business Development & Strategy',
    description: 'Go-to-market strategy, partnership development, market analysis, and business model optimization for tech companies.',
    Icon: FaChartLine,
  },
  {
    id: 'stablecoin-payments',
    slug: 'stablecoin-payments',
    title: 'Stablecoin Payment Systems',
    description: 'Design and implement stablecoin-based payment infrastructure with multi-currency support, instant settlements, and regulatory compliance.',
    Icon: FaHandsHelping,
  },
  {
    id: 'technical-consulting',
    slug: 'technical-consulting',
    title: 'Technical Architecture Consulting',
    description: 'Expert technical consulting for complex blockchain projects, system architecture design, and technology stack optimization.',
    Icon: FaComments,
  }
];

// Studio features data (moved from app/studio/page.tsx)
const studioFeatures = [
  {
    icon: FaCode,
    title: 'Development Studio',
    description: 'Full-stack development environment with modern tools and frameworks.',
    color: 'blue' // Corresponds to Tailwind bg-blue-50, border-blue-200, text-blue-800 etc.
  },
  {
    icon: FaBrain,
    title: 'AI Integration',
    description: 'AI-powered tools and machine learning capabilities for your projects.',
    color: 'purple'
  },
  {
    icon: FaPalette,
    title: 'Design Lab',
    description: 'Creative design workspace with advanced design tools and resources.',
    color: 'pink'
  },
  {
    icon: FaUsers, // Assuming FaUsers is already imported for other sections
    title: 'Collaboration Hub',
    description: 'Team workspace for seamless collaboration and project management.',
    color: 'green'
  },
  {
    icon: FaRocket, // Assuming FaRocket is already imported
    title: 'Launch Pad',
    description: 'Deploy and scale your applications with our cloud infrastructure.',
    color: 'orange'
  },
  {
    icon: FaChartLine, // Assuming FaChartLine is already imported
    title: 'Analytics Center',
    description: 'Comprehensive analytics and insights for your digital products.',
    color: 'indigo'
  }
];

// Helper for studio feature card styling
const studioColorClasses: { [key: string]: string } = {
  blue: 'bg-blue-50 border-blue-200 text-blue-800 group-hover:border-blue-300',
  purple: 'bg-purple-50 border-purple-200 text-purple-800 group-hover:border-purple-300',
  pink: 'bg-pink-50 border-pink-200 text-pink-800 group-hover:border-pink-300',
  green: 'bg-green-50 border-green-200 text-green-800 group-hover:border-green-300',
  orange: 'bg-orange-50 border-orange-200 text-orange-800 group-hover:border-orange-300',
  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800 group-hover:border-indigo-300'
};

// New helper for icon colors on dark background
const studioIconColorClasses: { [key: string]: string } = {
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  pink: 'text-pink-400',
  green: 'text-green-400',
  orange: 'text-orange-400',
  indigo: 'text-indigo-400'
};

// Helper for icon and title colors on white cards
const whiteCardTextStyles: { [key: string]: { icon: string; title: string } } = {
  blue:   { icon: 'text-blue-600',   title: 'text-blue-800' },
  purple: { icon: 'text-purple-600', title: 'text-purple-800' },
  pink:   { icon: 'text-pink-600',   title: 'text-pink-800' },
  green:  { icon: 'text-green-600',  title: 'text-green-800' },
  orange: { icon: 'text-orange-600', title: 'text-orange-800' },
  indigo: { icon: 'text-indigo-600', title: 'text-indigo-800' }
};

export default function PortfolioPage() {
  const projects: Project[] = portfolioData.projects as Project[];
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAboutVisible(true);
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // console.log("Name prop for CharacterCycle:", portfolioData.about.name);

  const openSourceProjects = [
    {
      id: 'os_project_1',
      title: 'VeriLedger',
      description: 'A tamper-proof, open-source ledger system for decentralized verification of academic credentials and professional certifications.',
      Icon: FaShieldAlt,
    },
    {
      id: 'os_project_2',
      title: 'BlockVote',
      description: 'A secure and transparent e-voting platform built on blockchain, ensuring anonymity and auditable election results for DAOs and communities.',
      Icon: FaCube,
    },
    {
      id: 'os_project_3',
      title: 'ChainTrack',
      description: 'Open-source supply chain solution using blockchain to provide immutable traceability and transparency for goods from origin to consumer.',
      Icon: FaLink,
    },
    {
      id: 'os_project_4',
      title: 'DeFi Spark',
      description: 'A suite of open-source smart contracts and tools for building and deploying decentralized finance (DeFi) applications with ease.',
      Icon: FaLightbulb,
    },
    {
      id: 'os_project_5',
      title: 'NFT Forge',
      description: 'A community-driven platform for creating, managing, and trading NFTs with a focus on low gas fees and interoperability.',
      Icon: FaProjectDiagram,
    },
    {
      id: 'os_project_6',
      title: 'CollabChain',
      description: 'A decentralized version control system fostering transparent and secure collaborative software development, with built-in reward mechanisms.',
      Icon: FaCodeBranch,
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      <main className="flex-grow">
        {/* START - Updated Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 md:py-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-7xl md:text-9xl font-extrabold mb-6">
              B0ASE
            </h1>
            <p className="text-4xl md:text-6xl font-medium mb-10 text-blue-100">
              Tech Incubator
            </p>
            <p className="text-xl md:text-2xl text-blue-200 mx-auto">
              Open-source
              tools for a decentralized future.
            </p>
          </div>
        </div>
        {/* END - Updated Hero Section */}

        {/* Platform Features Section (should remain below the new header) */}
        <section id="platform-features" className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12 md:mb-16">Key Platform Capabilities</h2> */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {studioFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className={`group p-6 md:p-8 rounded-xl bg-white shadow-lg border border-gray-200 transition-all duration-300 hover:bg-gray-50 hover:shadow-xl hover:border-gray-300 hover:scale-105`}
                >
                  <feature.icon className={`text-4xl md:text-5xl mb-5 ${whiteCardTextStyles[feature.color]?.icon || 'text-gray-700'}`} /> 
                  <h3 className={`text-xl md:text-2xl font-semibold mb-3 ${whiteCardTextStyles[feature.color]?.title || 'text-gray-900'}`}>{feature.title}</h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Studio Features Section (Moved from /studio) - THIS SECTION IS NOW REMOVED */}
        {/* 
        <section id="core-features" className="mb-16 md:mb-24 scroll-mt-20">
          <div className="bg-gray-50 p-8 md:p-12 border border-gray-200 shadow-xl rounded-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 md:mb-12 text-center">
              Core Platform Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {studioFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`group p-6 rounded-lg border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 ${studioColorClasses[feature.color]}`}
                >
                  <feature.icon className={`text-4xl mb-4 ${feature.color === 'blue' ? 'text-blue-600' : feature.color === 'purple' ? 'text-purple-600' : feature.color === 'pink' ? 'text-pink-600' : feature.color === 'green' ? 'text-green-600' : feature.color === 'orange' ? 'text-orange-600' : 'text-indigo-600'}`} />
                  <h3 className={`text-xl font-bold mb-3 ${feature.color === 'blue' ? 'text-blue-800' : feature.color === 'purple' ? 'text-purple-800' : feature.color === 'pink' ? 'text-pink-800' : feature.color === 'green' ? 'text-green-800' : feature.color === 'orange' ? 'text-orange-800' : 'text-indigo-800'}`}>{feature.title}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        */}

        {/* About Section - Renamed and content remains */}
        <section id="about" className="mb-16 md:mb-24 scroll-mt-20">
          <div className={`relative bg-gray-50 p-8 md:p-12 border border-gray-200 shadow-xl rounded-2xl transition-all duration-700 ease-in-out ${isAboutVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
            {/* Optional: Gradient overlay if desired, or remove for cleaner look */}
            {/* <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-teal-500/5 rounded-2xl"></div> */}
            
            <div className="relative z-10 text-center">
              <h1 className="text-4xl md:text-5xl text-gray-900 font-bold mb-6">
                Our Open Source Initiatives
              </h1>
              <p className="text-xl text-gray-700 mb-10 md:mb-12 max-w-3xl mx-auto">
                Dedicated to fostering innovation and collaboration in the decentralized space. Explore some of Raf's open-source contributions to the blockchain ecosystem:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                {openSourceProjects.map((project) => (
                  <div key={project.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center mb-3">
                      <project.Icon className="text-3xl text-blue-600 mr-4" />
                      <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{project.description}</p>
                  </div>
                ))}
              </div>
              
              {/* Social Links - Can be kept if relevant, or moved/removed */}
              <div className="mt-12 flex justify-center space-x-4">
                {portfolioData.about.socials.github && (
                   <a href={portfolioData.about.socials.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all duration-300 rounded-xl border border-gray-200 hover:border-gray-300 transform hover:scale-110">
                     <FaGithub size={24} />
                   </a>
                )}
                {/* Add other relevant social links here if desired */}
              </div>
            </div>
          </div>
        </section>

        {/* Services Section - Modern card design */}
        <section id="services" className="mb-16 md:mb-24 scroll-mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group flex flex-col items-center text-center bg-gray-50 p-8 border border-gray-200 shadow-xl rounded-2xl transition-all duration-300 hover:transform hover:scale-105 hover:bg-gray-100 hover:border-gray-300"
              >
                <div className="p-3 bg-blue-600 rounded-xl mb-3">
                  <service.Icon className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">{service.description}</p>
                <div className="mt-auto flex items-center justify-center text-blue-600 text-sm font-medium">
                  Learn more <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Skills Section - Modern glassmorphism design */}
        <section id="skills" className="mb-16 md:mb-24 scroll-mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Technical Skills
          </h2>
          <div className="bg-gray-50 p-8 md:p-12 border border-gray-200 shadow-xl rounded-2xl">
            <div className="flex flex-wrap gap-3">
              {portfolioData.skills.technical.map((skill) => (
                <span 
                  key={skill} 
                  className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-200 hover:bg-blue-200 transition-all duration-300 hover:scale-105"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section - Renamed to "Featured Projects" */}
        <section id="projects" className="mb-16 md:mb-24 scroll-mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 6).map((project) => (
              <div 
                key={project.id}
                className="group bg-gray-50 p-6 border border-gray-200 shadow-xl rounded-2xl transition-all duration-300 hover:transform hover:scale-105 hover:bg-gray-100"
                onMouseEnter={() => setHoveredProjectId(project.id)}
                onMouseLeave={() => setHoveredProjectId(null)}
              >
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <ProjectCardImage 
                    imageUrls={project.cardImageUrls || []} 
                    alt={`${project.title} logo`}
                  />
                  {hoveredProjectId === project.id && (
                    <ProjectCardLoginOverlay 
                      project={project} 
                      isVisible={hoveredProjectId === project.id} 
                    />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.slice(0, 3).map((tech) => (
                    <span 
                      key={tech} 
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md border border-blue-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section - Modern design */}
        <section id="contact" className="mb-16 scroll-mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Get In Touch
          </h2>
          <div className="bg-gray-50 p-8 md:p-12 border border-gray-200 shadow-xl rounded-2xl text-center">
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Ready to transform your ideas into reality? Let's build something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={`mailto:${portfolioData.contact.email}`}
                className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-xl border border-gray-300 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <FaEnvelope className="mr-3" />
                Start a Project
              </a>
              <Link
                href="/signup"
                className="inline-flex items-center px-8 py-4 bg-transparent hover:bg-teal-50 text-teal-600 font-semibold rounded-xl border-2 border-teal-500 hover:border-teal-600 transition-all duration-300 transform hover:scale-105"
              >
                <FaUsers className="mr-3" />
                Join Our Platform
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}