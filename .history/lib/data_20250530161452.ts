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
    githubUrl: githubUrl || `https://github.com/b0ase/${slug}`, // Updated to b0ase
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
            tokenUrl?: string;
        };
        token: {
            name: string;
            ticker: string;
            description: string;
            totalSupply: string;
            contractAddress: string;
            networks: string[];
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
    name: '$Boase',
    tagline: 'A dynamic tech incubator, transforming concepts into digital realities.',
    bio: "We incubate innovative tech startups and deliver cutting-edge solutions in web development, blockchain, AI, and emerging technologies. Explore our portfolio, discover our capabilities, and partner with us to build the future.",
    socials: {
      github: 'https://github.com/b0ase',
      linkedin: 'https://www.linkedin.com/company/b0ase/',
      x: 'https://x.com/b0ase',
      youtube: 'https://www.youtube.com/@b0ase',
      fiverr: 'https://www.fiverr.com/b0ase',
      upwork: 'https://www.upwork.com/freelancers/b0ase',
      freelancer: 'https://www.freelancer.com/u/b0ase',
      telegram: '#telegram',
      discord: '#discord',
      tokenUrl: 'https://1sat.market'
    },
    token: {
      name: "Boase",
      ticker: "BOASE",
      description: "The native token of the b0ase ecosystem, enabling governance, access to premium features, and participation in the tech incubation platform.",
      totalSupply: "1,000,000",
      contractAddress: "", // To be filled when deployed
      networks: ["Ethereum", "BSV"], // Supported networks
    }
  },
  projects: [
    // Placeholder projects for the tech incubator
    {
      id: 1,
      title: 'AI-Powered Analytics Platform',
      slug: 'ai-analytics-platform',
      description: 'Revolutionary analytics platform using machine learning to provide business insights.',
      type: 'domain' as const,
      status: 'In Development',
      tech: ['React', 'Python', 'TensorFlow', 'PostgreSQL'],
      cardImageUrls: [],
      subtitle: 'Business Intelligence & AI',
      xUrl: '#',
      notionUrl: '#',
      githubUrl: '#'
    },
    {
      id: 2,
      title: 'Blockchain Identity Solution',
      slug: 'blockchain-identity',
      description: 'Decentralized identity management system built on blockchain technology.',
      type: 'github' as const,
      status: 'Concept',
      tech: ['Solidity', 'Next.js', 'Web3.js'],
      cardImageUrls: [],
      subtitle: 'Identity & Security',
      xUrl: '#',
      notionUrl: '#',
      githubUrl: '#'
    },
    {
      id: 3,
      title: 'Smart Contract Marketplace',
      slug: 'smart-contract-marketplace',
      description: 'Marketplace for buying, selling, and deploying pre-audited smart contracts.',
      type: 'domain' as const,
      status: 'Planning',
      tech: ['React', 'Solidity', 'IPFS', 'Node.js'],
      cardImageUrls: [],
      subtitle: 'Web3 & DeFi',
      xUrl: '#',
      notionUrl: '#',
      githubUrl: '#'
    }
  ],
  skills: {
    technical: [
      'JavaScript', 'TypeScript', 'Python', 'SQL', 'HTML5', 'CSS3',
      'React', 'Next.js', 'Tailwind CSS', 'Vue.js',
      'Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'MySQL',
      'Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'Git', 'CI/CD',
      'Blockchain Development', 'Smart Contracts', 'DeFi', 'NFTs',
      'AI/ML', 'TensorFlow', 'PyTorch', 'OpenAI API',
      'Mobile Development', 'React Native', 'Flutter'
    ],
    // soft: ["Innovation", "Strategic Thinking", "Team Leadership"] // Add soft skills here if desired
  },
  services: [
    { 
      id: 1, 
      slug: "startup-incubation", 
      title: "Startup Incubation", 
      description: "Complete incubation program for early-stage tech startups with mentorship, funding, and technical support.",
      detailedDescription: "Our comprehensive incubation program provides everything early-stage startups need to succeed. From initial concept validation to MVP development, funding assistance, and go-to-market strategy. We offer hands-on mentorship, technical expertise, and access to our network of investors and industry experts.",
      priceInfo: "Equity-based program | Custom terms negotiable"
    },
    { 
      id: 2, 
      slug: "web3-development", 
      title: "Web3 & Blockchain Development", 
      description: "End-to-end blockchain solutions including smart contracts, DApps, and tokenization.",
      detailedDescription: "Specialized in building decentralized applications, smart contracts, and blockchain infrastructure. We develop DeFi protocols, NFT marketplaces, tokenization platforms, and Web3 integrations. Our team has expertise across multiple blockchains including Ethereum, BSV, and emerging networks.",
      priceInfo: "From $25,000 per project | Retainer options available"
    },
    { 
      id: 3, 
      slug: "ai-integration",
      title: "AI Integration & Development", 
      description: "Custom AI solutions and integrations to enhance your products and operations.", 
      detailedDescription: "We build AI-powered features and applications using cutting-edge machine learning models. From chatbots and recommendation systems to computer vision and natural language processing, we help businesses leverage AI to gain competitive advantages.",
      priceInfo: "From $15,000 per project | Ongoing support available" 
    },
    { 
      id: 4, 
      slug: "full-stack-development",
      title: "Full-Stack Development", 
      description: "Complete web and mobile application development using modern technologies.",
      detailedDescription: "End-to-end development services for web and mobile applications. We build scalable, performant applications using modern frameworks and best practices. From simple MVPs to complex enterprise solutions, we deliver high-quality software that grows with your business.",
      priceInfo: "From $10,000 per project | Hourly rates available" 
    },
    { 
      id: 5, 
      slug: "technical-consulting",
      title: "Technical Consulting", 
      description: "Strategic technology guidance and architecture consulting for growing companies.", 
      detailedDescription: "Expert technical consulting to help you make informed technology decisions. We provide architecture reviews, technology stack recommendations, scalability planning, and technical due diligence for investments. Perfect for companies looking to optimize their tech infrastructure.",
      priceInfo: "From $200/hour | Project-based engagements available" 
    },
    { 
      id: 6, 
      slug: "product-strategy",
      title: "Product Strategy & Development", 
      description: "Comprehensive product development from concept to market launch.",
      detailedDescription: "Full product lifecycle support including market research, product strategy, UX/UI design, development, and launch planning. We help startups and established companies bring innovative products to market quickly and efficiently.",
      priceInfo: "From $20,000 per engagement | Equity partnerships considered" 
    }
  ],
  contact: {
    email: "hello@b0ase.com"
  }
}; 