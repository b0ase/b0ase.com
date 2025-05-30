"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon, Code, Compass, FileCode, Layers, Rocket, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="p-6 border border-border/40 bg-background/60 backdrop-blur-sm hover:shadow-md transition-all duration-200 hover:border-primary/20">
      <div className="flex flex-col space-y-2">
        <div className="p-2 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mt-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}

interface ProjectTemplateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  popular?: boolean;
}

function ProjectTemplate({ title, description, icon, popular }: ProjectTemplateProps) {
  return (
    <Card className="relative p-6 border border-border/40 bg-background/60 backdrop-blur-sm hover:shadow-md transition-all duration-200 hover:border-primary/20 flex flex-col h-full">
      {popular && (
        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
          Popular
        </Badge>
      )}
      <div className="flex flex-col space-y-2 flex-1">
        <div className="p-2 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mt-2">{title}</h3>
        <p className="text-sm text-muted-foreground flex-1">{description}</p>
        <Button variant="outline" className="mt-4 w-full">
          Use Template
        </Button>
      </div>
    </Card>
  );
}

const BackgroundGradient = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute left-1/3 top-1/4 h-[256px] w-[60%] -translate-x-1/2 scale-[2.5] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_hsla(var(--primary)/.3)_10%,_hsla(var(--primary)/0)_60%)] sm:h-[512px]" />
      <div className="absolute right-1/3 bottom-1/4 h-[256px] w-[60%] -translate-x-1/2 scale-[2.5] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_hsla(var(--primary)/.3)_10%,_hsla(var(--primary)/0)_60%)] sm:h-[512px]" />
    </div>
  );
};

function StudioPage() {
  return (
    <div className="container relative mx-auto px-4 py-16 md:py-24">
      <BackgroundGradient />
      
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="mb-4 animate-appear gap-2">
            <span className="text-muted-foreground">Build faster with our studio</span>
            <a href="/docs" className="flex items-center gap-1">
              Learn more
              <ArrowRightIcon className="h-3 w-3" />
            </a>
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
            Start Building Amazing Projects
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Choose from our templates or start from scratch. We've got everything you need to bring your ideas to life.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg">
              Create New Project
            </Button>
            <Button size="lg" variant="outline">
              Explore Templates
            </Button>
          </div>
        </motion.div>
      </div>

      <Tabs defaultValue="templates" className="w-full max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProjectTemplate 
              title="Web Application" 
              description="Start with a fully configured web application with authentication, database, and API routes."
              icon={<Layers className="h-5 w-5" />}
              popular
            />
            <ProjectTemplate 
              title="Landing Page" 
              description="Create a beautiful landing page for your product or service with customizable sections."
              icon={<Rocket className="h-5 w-5" />}
            />
            <ProjectTemplate 
              title="E-commerce Store" 
              description="Build an online store with product catalog, shopping cart, and checkout functionality."
              icon={<Compass className="h-5 w-5" />}
              popular
            />
            <ProjectTemplate 
              title="Blog" 
              description="Start a blog with markdown support, categories, and a responsive design."
              icon={<FileCode className="h-5 w-5" />}
            />
            <ProjectTemplate 
              title="Dashboard" 
              description="Create a data dashboard with charts, tables, and interactive components."
              icon={<Code className="h-5 w-5" />}
            />
            <ProjectTemplate 
              title="Empty Project" 
              description="Start with a blank canvas and build your project from scratch."
              icon={<Sparkles className="h-5 w-5" />}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Zap className="h-5 w-5" />}
              title="Lightning Fast"
              description="Build and deploy your projects in minutes, not hours. Our optimized workflow saves you time."
            />
            <FeatureCard 
              icon={<Layers className="h-5 w-5" />}
              title="Component Library"
              description="Access hundreds of pre-built components that you can customize to fit your needs."
            />
            <FeatureCard 
              icon={<Code className="h-5 w-5" />}
              title="Developer Friendly"
              description="Built with TypeScript and React, our platform is designed for developers by developers."
            />
            <FeatureCard 
              icon={<Compass className="h-5 w-5" />}
              title="Intuitive Interface"
              description="Our user-friendly interface makes it easy to navigate and find what you need."
            />
            <FeatureCard 
              icon={<Rocket className="h-5 w-5" />}
              title="One-Click Deploy"
              description="Deploy your projects with a single click to your favorite hosting platform."
              />
            <FeatureCard 
              icon={<Sparkles className="h-5 w-5" />}
              title="AI Assistance"
              description="Get help from our AI assistant to solve problems and generate code snippets."
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-24 text-center">
        <Card className="p-8 md:p-12 border border-border/40 bg-background/60 backdrop-blur-sm max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to start building?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already creating amazing projects with our platform.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg">
              Get Started Now
            </Button>
            <Button size="lg" variant="outline">
              View Documentation
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default StudioPage; 