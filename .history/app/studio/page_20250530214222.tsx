"use client";

import React from "react";
import Link from "next/link"; // Import Link for navigation
import { motion } from "framer-motion";
// Assuming these components are available from your shadcn/ui setup
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Import relevant icons from lucide-react for the new pages/actions
import { ArrowRightIcon, Layers, Rocket, Users, Code, Sparkles, Bot, Waypoints, ShieldQuestion } from "lucide-react";
// Assuming cn utility is available
import { cn } from "@/lib/utils";

// Define interface for action cards
interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string; // Add href for linking
}

// Component for displaying an action card
function ActionCard({ icon, title, description, href }: ActionCardProps) {
  return (
    <Link href={href} className="block"> {/* Wrap with Link */}
      <Card className="p-6 border border-gray-700 bg-black hover:bg-gray-900 transition-all duration-200 hover:border-blue-600 text-white h-full">
        <div className="flex flex-col space-y-3">
          <div className="p-3 w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
            {icon}
          </div>
          <h3 className="text-lg font-semibold mt-2">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </Card>
    </Link>
  );
}

// Background Gradient component (optional visual flourish)
const BackgroundGradient = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Adjust colors and positions as needed for your theme */}
      <div className="absolute left-1/3 top-1/4 h-[256px] w-[60%] -translate-x-1/2 scale-[2.5] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.2)_10%,_rgba(37,99,235,0)_60%)] sm:h-[512px]" />
      <div className="absolute right-1/3 bottom-1/4 h-[256px] w-[60%] -translate-x-1/2 scale-[2.5] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.2)_10%,_rgba(37,99,235,0)_60%)] sm:h-[512px]" />
    </div>
  );
};

// Main Studio Page Component
export default function StudioPage() {
  // Define the actions/pages with their details
  const studioActions = [
    {
      title: "Define Your Role",
      description: "Understand how you fit into the b0ase.com ecosystem.",
      icon: <ShieldQuestion className="h-6 w-6" />,
      href: "/studio/role",
    },
    {
      title: "Start a New Project",
      description: "Begin building your idea from scratch or a template.",
      icon: <Rocket className="h-6 w-6" />,
      href: "/studio/start-a-project",
    },
    {
      title: "Build a Website",
      description: "Design and develop a professional online presence.",
      icon: <Layers className="h-6 w-6" />,
      href: "/studio/build-a-website",
    },
    {
      title: "Create a Team",
      description: "Form a new team to collaborate on projects.",
      icon: <Users className="h-6 w-6" />,
      href: "/studio/create-a-team",
    },
    {
      title: "Join a Project",
      description: "Find and contribute to existing projects.",
      icon: <Code className="h-6 w-6" />, // Or a different icon representing joining
      href: "/studio/join-a-project",
    },
    {
      title: "Join a Team",
      description: "Become a member of an existing team.",
      icon: <Users className="h-6 w-6" />, // Or a different icon representing joining
      href: "/studio/join-a-team",
    },
    {
      title: "Create an Agent",
      description: "Develop or deploy an AI-powered agent.",
      icon: <Bot className="h-6 w-6" />,
      href: "/studio/create-an-agent",
    },
    {
      title: "Launch a Token",
      description: "Issue your own token on the blockchain.",
      icon: <Sparkles className="h-6 w-6" />, // Or a token-specific icon
      href: "/studio/launch-a-token",
    },
  ];

  return (
    <div className="container relative mx-auto px-4 py-16 md:py-24 text-white"> {/* Added text-white */}
      {/* <BackgroundGradient /> {/* Optional: Uncomment if you want the background effect */}
      
      <div className="text-center mb-16 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="mb-4 border-gray-600 text-gray-400"> {/* Adjusted Badge styles */}
            <span className="text-muted-foreground">Your Hub to Build</span>
            {/* Link to documentation or about Studio page */}
             <Link href="/docs" className="flex items-center gap-1 ml-2 text-blue-400 hover:text-blue-300">
              Learn more
              <ArrowRightIcon className="h-3 w-3" />
            </Link>
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6"> {/* Removed gradient text */}
            Welcome to the Studio
          </h1>
          
          <p className="text-xl text-gray-400 mb-8"> {/* Adjusted text color */}
            Choose your path and start creating. The b0ase.com Studio provides the tools and resources you need.
          </p>
          
          {/* Optional: Call to action buttons */}
          {/* <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Create New Project
            </Button>
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
              Explore Templates
            </Button>
          </div> */}
        </motion.div>
      </div>

      {/* Grid of Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {studioActions.map((action) => (
          <ActionCard
            key={action.href}
            icon={action.icon}
            title={action.title}
            description={action.description}
            href={action.href}
          />
        ))}
      </div>
      
      {/* Optional: Footer Call to Action */}
      {/* <div className="mt-24 text-center">
        <Card className="p-8 md:p-12 border border-gray-700 bg-black max-w-4xl mx-auto text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to start building?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already creating amazing projects with our platform.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Get Started Now
            </Button>
            <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
              View Documentation
            </Button>
          </div>
        </Card>
      </div> */}
    </div>
  );
}