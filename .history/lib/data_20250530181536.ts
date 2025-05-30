import { Url } from "url";

// Helper function to create project stubs
const createProjectStub = (id: number, title: string, description: string, status?: string, tech?: string[], tokenName?: string, tokenProgressPercent?: number, cardImageUrls?: string[], xUrl?: string, githubUrl?: string, notionUrl?: string) => {
  // Ensure title is treated as a string for slug generation
  const safeTitle = (title || ''); 
  const slug = safeTitle.toLowerCase().replace(/\s+/g, '-') // Replace spaces with hyphens
                       .replace(/[^a-z0-9\-]/g, '') // Remove invalid chars
                       .replace(/\.+/g, '-'); // Replace periods with hyphens specifically for domain-like titles

  const defaultStatus = status || 'Concept';
  const defaultTech = tech || [];
  const defaultTokenName = tokenName || '';
  const defaultTokenProgress = tokenProgressPercent || 0;
  const defaultCardImageUrls = cardImageUrls || []; // Default to empty array

  return {
    id,
    title,
    slug, // Add generated slug
    description,
    tech: defaultTech,
    githubUrl: githubUrl || `https://github.com/b0ase/${slug}`, // Use slug for default URLs too?
    xUrl: xUrl || `https://x.com/${slug}`,
    notionUrl: notionUrl || '#',
    tokenName: defaultTokenName,
    tokenProgressPercent: defaultTokenProgress,
    status: defaultStatus,
    type: 'domain', // Default type, can be overridden
    cardImageUrls: defaultCardImageUrls // Use the new array field
  };
};

// Define the structure for a Service
export interface Service {
  id: number;
  slug: string;
  title: string;
  description: string;
  detailedDescription: string;
  priceInfo?: string;
}

// Define the structure for a Project
export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  xUrl?: string;
  notionUrl?: string;
  tokenName?: string;
  tokenProgressPercent?: number;
  status: string;
  type: 'domain' | 'github' | 'client';
  cardImageUrls?: string[]; // Changed from imageUrl to cardImageUrls
  tokenMarketUrl?: string; // Added for specific projects
  tokenPlatform?: string; // Added for specific projects
  liveUrl?: string;
  subtitle?: string;
}

export interface SkillsData {
    technical: string[];
    // soft?: string[]; // Optional: Add other skill categories if needed
}

export interface PortfolioData {
    about: {
        name: string;
        tagline: string;
        bio: string;
        socials: {
            github: string;
            linkedin: string;
            x: string;
            youtube: string;
            fiverr: string;
            upwork: string;
            freelancer: string;
            telegram?: string;
            discord?: string;
        };
        token: {
            name: string;
            ticker: string;
            description: string;
            platform: string;
            marketLink: string;
        };
    };
    projects: Project[];
    skills: SkillsData;
    services: Service[];
    contact: { email: string; };
}

// Main data object
export const portfolioData: PortfolioData = {
  about: {
    name: '$BOASE',
    tagline: 'A dynamic digital agency, transforming concepts into digital experiences.',
    bio: "We deliver client solutions in web development, blockchain, content, video, and social media, while also incubating our own projects. Explore our services, view our work, and contact us to build your next venture.",
    socials: {
      github: 'https://github.com/b0ase',
      linkedin: 'https://www.linkedin.com/in/richardboase/',
      x: 'https://x.com/b0ase',
      youtube: 'https://www.youtube.com/@richardboase',
      fiverr: 'https://www.fiverr.com/your_username',
      upwork: 'https://www.upwork.com/freelancers/your_profile',
      freelancer: 'https://www.freelancer.com/u/your_username',
      telegram: '#telegram',
      discord: '#discord'
    },
    token: {
      name: '$BOASE',
      ticker: 'BSV21',
      description: "$BOASE is a regulated share in Boase Corporation. Shares may be tokenized on any blockchain, and can be redeemed and reissued on any chain at the company's discretion.",
      platform: 'BSV21',
      marketLink: 'https://1sat.market/market/bsv21/c3bf2d7a4519ddc633bc91bbfd1022db1a77da71e16bb582b0acc0d8f7836161_1'
    }
  },
  projects: [
    {
      id: 20,
      title: 'robust-ae.com',
      slug: 'robust-ae-com',
      description: 'A comprehensive digital platform for Robust, a leading company in the UAE specializing in innovative solutions and services.',
      type: 'domain',
      status: 'active',
      liveUrl: 'https://robust-ae.com',
      tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'React', 'Node.js'],
      cardImageUrls: ['/images/clientprojects/robust-ae-com/slug/robust-logo.png'],
      subtitle: 'Enterprise Solutions Platform',
      xUrl: '#',
      notionUrl: '#',
      githubUrl: 'https://github.com/b0ase/robust-ae'
    },
    // Domain Projects
    { 
      id: 22, // New unique ID
      title: 'BitDNS', 
      slug: 'bitdns-website', 
      description: 'A blockchain project focused on tokenizing DNS records to provide a decentralized domain name system.',
      type: 'client' as const, // Set type to client
      status: 'active', // Or appropriate status
      liveUrl: 'https://bitdns.website', 
      tech: [], // TODO: Add tech stack
      cardImageUrls: ['/images/clientprojects/bitdns-website/bitdns-logo.svg'], // TODO: Add image URLs
      subtitle: '[Subtitle for BitDNS.website]', // Optional subtitle
      xUrl: '#', // TODO: Add X URL if available
      notionUrl: '#', // TODO: Add Notion URL if available
      githubUrl: '#', // TODO: Add GitHub URL if available
      tokenName: '$DNS' // Added token name
    },
    { 
      id: 23, // New unique ID
      title: 'BitCDN', 
      slug: 'bitcdn-website', 
      description: 'Providing pay-to-stream services by combining aspects of decentralized file sharing with Bitcoin payments.',
      type: 'client' as const, // Set type to client
      status: 'active', // Or appropriate status
      liveUrl: 'https://bitcdn.website', 
      tech: [], // TODO: Add tech stack
      cardImageUrls: ['/images/clientprojects/bitcdn-website/bitcdn-logo.svg'], // TODO: Add image URLs
      subtitle: '[Subtitle for BitCDN.website]', // Optional subtitle
      xUrl: '#', // TODO: Add X URL if available
      notionUrl: '#', // TODO: Add Notion URL if available
      githubUrl: '#', // TODO: Add GitHub URL if available
      tokenName: '$CDN' // Added token name
    },
    { ...createProjectStub(7, 'ninjapunkgirls.com', 'A vibrant NFT marketplace showcasing unique digital art of cyberpunk female warriors.', 'Ltd Company', [], '$NPG', 85, [
      '/images/clientprojects/ninjapunkgirls/slug/NPG%20logo.png'
    ]), type: 'domain' as const },
    { ...createProjectStub(8, 'hyper-flix.com', 'Innovative memecoin marketing platform specializing in viral TikTok campaigns and social engagement.', 'B2C', ['TikTok', 'Social Media', 'Crypto'], '$HFLIX', 100, ['/images/clientprojects/hyper-flix/slug/HYPERFLIXLOGO%20(1).png']), type: 'domain' as const },
    { ...createProjectStub(9, 'tribify.ai', 'AI-powered community platform that connects like-minded individuals through shared interests.', 'SaaS', [], '$TRIBE', 100, ['/images/clientprojects/tribify/slug/TribifyAILogo.JPG']), type: 'domain' as const },
    { ...createProjectStub(10, 'aitribes.online', 'Dynamic social network where AI agents and humans collaborate to create unique digital experiences.', 'Platform', [], '$AITR', 100, []), type: 'domain' as const },
    { 
      ...createProjectStub(
        11, 
        'lilithtattoo.com', 
        'Elegant portfolio showcase for a renowned tattoo artist specializing in dark art and mystical designs.', 
        'Service', 
        [], 
        '$LILITH', 
        100, 
        ['/images/clientprojects/lilithtattoo-com/slug/lilith-ai-logo.png'] // Updated image path for lilithtattoo.com
      ), 
      type: 'domain' as const 
    },
    { ...createProjectStub(12, 'metagraph.app', 'Innovative data visualization tool that transforms complex relationships into interactive 3D networks.', 'App', [], '$META', 100, []), type: 'domain' as const },
    { ...createProjectStub(13, 'floop.online', 'Real-time collaborative workspace for creative professionals with integrated project management.', 'Platform', [], '$FLOOP', 100, ['/images/clientprojects/floop.online/floop-logo.png']), type: 'domain' as const },
    { ...createProjectStub(14, 'dns-dex.com', 'Decentralized domain name exchange platform revolutionizing how web addresses are traded.', 'Platform', [], '$DNSD', 100, []), type: 'domain' as const },
    { ...createProjectStub(15, 'tribeswallet.com', 'Secure multi-chain cryptocurrency wallet designed for community-driven token ecosystems.', 'App', [], '$TWALL', 100, []), type: 'domain' as const },
    { ...createProjectStub(16, 'pennypics.store', 'Micro-payment based image marketplace where photographers earn per view.', 'E-commerce', [], '$PICS', 100, []), type: 'domain' as const },
    { ...createProjectStub(17, 'missvoid.store', 'Avant-garde fashion boutique featuring cyberpunk and dystopian-inspired clothing.', 'E-commerce', [], '$VOID', 100, ['/images/clientprojects/missvoid.store/slug/missvoid_logo.png']), type: 'domain' as const },
    { ...createProjectStub(18, 'interiordesigns.website', 'Virtual interior design consultation platform with AI-powered room visualization.', 'Service', [], '$NTR', 100, []), type: 'domain' as const },
    {
      // Using createProjectStub for consistency, then overriding/adding specific fields
      ...createProjectStub(
        21, // New unique ID
        'Marina3D.xyz', // Title
        'Cutting-edge 3D visualization and interactive experiences for the web.', // Description
        'Live', // Status
        ['Next.js', 'TypeScript', 'Three.js', 'WebGL'], // Example Tech Stack (customize as needed)
        undefined, // tokenName (undefined if not applicable)
        0, // tokenProgressPercent (0 if not applicable)
        ['/images/clientprojects/marina3d-xyz/slug/mar3D_logo.png'] // Updated image path
      ),
      type: 'domain' as const, // Ensure it's treated as a domain project
      liveUrl: 'https://marina3d.xyz', // Specific live URL
      subtitle: 'Interactive 3D Web Experiences' // Example subtitle
    },

    // GitHub Repos
    {
      id: 1,
      title: 'AIOSX',
      slug: 'aiosx', // Manually add slug
      description: 'Fork of AIOS: LLM Agent Operating System. Exploring potential applications.',
      tech: ['Python'],
      githubUrl: 'https://github.com/b0ase/AIOSX',
      xUrl: '#',
      notionUrl: '#',
      status: 'Exploration',
      type: 'github' as const,
      tokenName: '$AIOSX',
      tokenProgressPercent: 100,
      cardImageUrls: [] // Initialize for GitHub repos
    },
    {
      id: 2,
      title: 'bitcoin (Fork)',
      slug: 'bitcoin-fork', // Manually add slug
      description: 'Fork of Bitcoin Core integration/staging tree. For study and potential integration.',
      tech: ['TypeScript'],
      githubUrl: 'https://github.com/b0ase/bitcoin',
      xUrl: '#',
      notionUrl: '#',
      status: 'Study',
      type: 'github' as const,
      tokenName: '$BTC_FORK',
      tokenProgressPercent: 100,
      cardImageUrls: []
    },
    {
      id: 3,
      title: 'npgpublic',
      slug: 'npgpublic', // Manually add slug
      description: 'Public Go project. Purpose and potential to be defined.',
      tech: ['Go'],
      githubUrl: 'https://github.com/b0ase/npgpublic',
      xUrl: '#',
      notionUrl: '#',
      status: 'Concept',
      type: 'github' as const,
      tokenName: '$NPG_DEV',
      tokenProgressPercent: 100,
      cardImageUrls: []
    },
    {
      id: 4,
      title: 'Penshun',
      slug: 'penshun', // Manually add slug
      description: 'Fork of simply-stream: Lock to Stream Bitcoin. Investigating streaming payment models.',
      tech: ['JavaScript'],
      githubUrl: 'https://github.com/b0ase/Penshun',
      xUrl: '#',
      notionUrl: '#',
      status: 'Investigation',
      type: 'github' as const,
      tokenName: '$PENSHUN',
      tokenProgressPercent: 100,
      cardImageUrls: []
    },
    {
      id: 5,
      title: 'Weight',
      slug: 'weight', // Manually add slug
      description: 'Fork of hodlocker: Lock Bitcoins to Social Posts. Experimenting with social/economic weighting.',
      tech: ['TypeScript'],
      githubUrl: 'https://github.com/b0ase/Weight',
      xUrl: '#',
      notionUrl: '#',
      status: 'Experiment',
      type: 'github' as const,
      tokenName: '$WEIGHT',
      tokenProgressPercent: 100,
      cardImageUrls: []
    },
    {
      id: 6,
      title: 'Yours-HandCash-Login',
      slug: 'yours-handcash-login', // Manually add slug
      description: 'Fork of Yours Wallet: Yours/HandCash Integration exploration.',
      tech: ['JavaScript'],
      githubUrl: 'https://github.com/b0ase/Yours-HandCash-Login',
      xUrl: '#',
      notionUrl: '#',
      status: 'Archived/Study',
      type: 'github' as const,
      tokenName: '$YHC',
      tokenProgressPercent: 100,
      cardImageUrls: []
    },
    {
      id: 19,
      title: 'Index Token',
      slug: 'index-token', // Manually add slug
      description: 'Concept and development for an index-based token system.',
      tech: ['Solidity', 'TypeScript'],
      githubUrl: 'https://github.com/b0ase/index-token',
      xUrl: '#',
      notionUrl: '#',
      status: 'Development',
      type: 'github' as const,
      tokenName: '$INDEX',
      tokenProgressPercent: 100,
      cardImageUrls: ['/images/development/index-token/index-token-bg.jpg']
    },
  ],
  skills: {
    technical: [
      'JavaScript', 'TypeScript', 'Python', 'SQL', 'HTML5', 'CSS3',
      'React', 'Next.js', 'Tailwind CSS', 'Vue.js',
      'Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'MySQL',
      'Docker', 'Kubernetes', 'AWS Basics', 'Google Cloud Basics', 'Git', 'CI/CD',
      'Figma', 'Adobe Photoshop', 'Logo Design', 'Motion Graphics', 'Video Production', 'API Integration', 'SEO Principles',
      'Adobe After Effects', 'Adobe Premiere Pro', 'Cinema 4D', 'Blender',
      'Final Cut Pro', 'DaVinci Resolve', 'Lottie/Bodymovin', 'Animation Principles',
      'Compositing', 'VFX Basics', 'Adobe Illustrator', 'Adobe InDesign', 'Adobe Creative Suite'
    ],
    // soft: ["Communication", "Problem Solving"] // Add soft skills here if desired
  },
  services: [
    { 
      id: 1, 
      slug: "web-development", 
      title: "Web Development", 
      description: "Building responsive, performant websites & applications using modern tech, including Web3, crypto & blockchain integrations.",
      detailedDescription: "Our web development process focuses on creating high-performance, scalable, and visually appealing digital experiences. We leverage modern frameworks like Next.js and React, combined with best practices in SEO, accessibility, and user experience. From simple landing pages to complex web applications and e-commerce platforms, we tailor solutions to meet specific business goals.",
      priceInfo: "Est. Rate: £120/hr | £480/day. UK VAT added where applicable. Fixed-price projects negotiable."
    },
    { 
      id: 2, 
      slug: "software-development", 
      title: "Software Development", 
      description: "App development and technical support for start-ups, with a special focus on crypto, blockchain, and AI innovation.",
      detailedDescription: "We specialize in developing scalable web and mobile applications tailored for start-ups and forward-thinking businesses. Our expertise includes blockchain integration, crypto payment systems, AI-powered features, and rapid MVP development. We provide ongoing technical support and strategic guidance to help your venture succeed in a fast-moving digital landscape.",
      priceInfo: "Est. Rate: £120/hr | £480/day. UK VAT added where applicable. Fixed-price projects negotiable."
    },
    { 
      id: 3, 
      slug: "content-copywriting",
      title: "Content & Copywriting", 
      description: "Crafting compelling narratives, articles, and website copy tailored to your audience.", 
      detailedDescription: "We create engaging and SEO-optimized content that resonates with your target audience. Our services include blog posts, articles, website copy, social media content, email marketing campaigns, and more. We focus on clear communication and storytelling to enhance your brand voice.",
      priceInfo: "Est. Rate: £100/article | £400/day" 
    },
    { 
      id: 4, 
      slug: "video-production",
      title: "Video Production & Photography", 
      description: "From concept and shooting to editing and final delivery for promotional or creative needs, including high-quality photography.",
      detailedDescription: "Full-service video production covering concept development, storyboarding, filming, editing, color grading, motion graphics, and final delivery. We produce promotional videos, documentaries, interviews, social media clips, and more, using professional equipment and techniques. Our photography services include event coverage, product photography, corporate headshots, lifestyle portraits, and architectural photography—all expertly edited to meet your requirements.",
      priceInfo: "Est. Rate: £110/hr | £450/day" 
    },
    { 
      id: 5, 
      slug: "logo-branding",
      title: "Logo Design & Branding", 
      description: "Crafting unique logos and visual identities that effectively represent your brand.", 
      detailedDescription: "We develop strong visual identities, starting with logo design and extending to brand guidelines, color palettes, typography, and marketing collateral design. Our goal is to create a cohesive and memorable brand image that aligns with your values.",
      priceInfo: "Est. Rate: £90/hr | Project-based" 
    },
    { 
      id: 6, 
      slug: "seo-marketing",
      title: "SEO & Digital Marketing", 
      description: "Optimizing online presence and content strategy to drive organic growth.", 
      detailedDescription: "Comprehensive SEO services including keyword research, on-page optimization, technical SEO audits, link building, and content strategy development. We also offer broader digital marketing support, including PPC campaign management and analytics reporting.",
      priceInfo: "Est. Rate: £110/hr | £450/day" 
    },
    { 
      id: 7, 
      slug: "social-media-management",
      title: "Social Media Management", 
      description: "Developing strategies, creating content, and managing social media presence to grow engagement and reach.", 
      detailedDescription: "Strategic social media management across various platforms. We handle content creation, scheduling, community engagement, performance tracking, and paid social advertising campaigns to build brand awareness and drive results.",
      priceInfo: "Est. Rate: £90/hr | Retainer" 
    },
    { 
      id: 8, 
      slug: "technical-consulting",
      title: "Technical Consulting", 
      description: "Providing expert advice and strategy for your digital projects and technical challenges.",
      detailedDescription: "Leverage our technical expertise for strategic decision-making. We offer consulting on technology stack selection, software architecture design, project planning, feasibility studies, and technical team guidance.", 
      priceInfo: "Est. Rate: £150/hr" 
    },
    { 
      id: 9, 
      slug: "support-maintenance",
      title: "Ongoing Support & Maintenance", 
      description: "Reliable support packages to keep your digital assets running smoothly and securely.",
      detailedDescription: "Customizable support and maintenance plans to ensure your websites and applications remain secure, up-to-date, and performant. Services include regular updates, security monitoring, backups, performance checks, and troubleshooting.", 
      priceInfo: "Est. Rate: Retainer based" 
    }
  ],
  contact: {
    email: "richardwboase@gmail.com"
  }
}; 