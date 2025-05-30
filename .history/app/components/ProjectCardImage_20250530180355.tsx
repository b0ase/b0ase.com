'use client';

import React from 'react';
import Image from 'next/image';

interface ProjectCardImageProps {
  imageUrls: string[];
  alt: string;
}

const ProjectCardImage: React.FC<ProjectCardImageProps> = ({ 
  imageUrls,
  alt,
}) => {
  // Handle cases with no images
  if (!imageUrls || imageUrls.length === 0) {
    // Return null or a minimal placeholder, parent div now handles background
    return null; 
  }

  // Always use the first image
  const imageUrl = imageUrls[0];

  return (
    <Image
      src={imageUrl}
      alt={alt}
      fill={true}
      className="rounded-full object-cover"
      priority
    />
  );
};

export default ProjectCardImage; 