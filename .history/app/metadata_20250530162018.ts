import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'b0ase',
    template: '%s | b0ase',
  },
  metadataBase: new URL('https://b0ase.com'),
  description: 'b0ase - Tech incubator transforming concepts into digital realities',
  openGraph: {
    title: 'b0ase',
    description: 'Dynamic tech incubator specializing in blockchain, AI, and emerging technologies',
    images: [`/api/og?title=b0ase`],
  },
  twitter: {
    card: 'summary_large_image',
  },
}; 