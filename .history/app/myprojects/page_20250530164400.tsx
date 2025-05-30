'use client';

import React from 'react';
import Link from 'next/link';
import { FaProjectDiagram, FaPlusCircle, FaEdit, FaExternalLinkAlt, FaUsers, FaCog } from 'react-icons/fa';

export default function MyProjectsPage() {
  // Mock project data for demo
  const mockProjects = [
    {
      id: '1',
      name: 'b0ase.com Website',
      status: 'Live',
      type: 'Website',
      priority: 'High Priority',
      description: 'Main b0ase.com tech incubator platform',
      url: 'https://b0ase.com',
      role: 'Owner'
    },
    {
      id: '2',
      name: 'DeFi Exchange Platform',
      status: 'In Development',
      type: 'Web3/Blockchain',
      priority: 'High Priority',
      description: 'Decentralized finance exchange with AMM functionality',
      url: null,
      role: 'Developer'
    },
    {
      id: '3',
      name: 'SaaS Analytics Dashboard',
      status: 'Planning',
      type: 'SaaS',
      priority: 'Medium Priority',
      description: 'Analytics dashboard for blockchain SaaS platforms',
      url: null,
      role: 'Project Manager'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Development': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High Priority': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium Priority': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Low Priority': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Owner': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Developer': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Project Manager': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg text-black mb-8">
        <div className="mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FaProjectDiagram className="text-3xl text-black" />
              <div>
                <h1 className="text-3xl font-bold text-black">My Projects</h1>
                <p className="text-gray-600">Manage your RafsKitchen projects and collaborations</p>
              </div>
            </div>
            <Link href="/projects/new" legacyBehavior>
              <a className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center">
                <FaPlusCircle className="mr-2" />
                New Project
              </a>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-black mb-2">Total Projects</h3>
            <p className="text-3xl font-bold text-blue-600">{mockProjects.length}</p>
            <p className="text-gray-600 text-sm">Active projects</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-black mb-2">Live Projects</h3>
            <p className="text-3xl font-bold text-green-600">{mockProjects.filter(p => p.status === 'Live').length}</p>
            <p className="text-gray-600 text-sm">In production</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-black mb-2">In Development</h3>
            <p className="text-3xl font-bold text-blue-600">{mockProjects.filter(p => p.status === 'In Development').length}</p>
            <p className="text-gray-600 text-sm">Under development</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-black mb-2">Planning</h3>
            <p className="text-3xl font-bold text-yellow-600">{mockProjects.filter(p => p.status === 'Planning').length}</p>
            <p className="text-gray-600 text-sm">In planning phase</p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-black">Your Projects</h2>
            <div className="text-sm text-gray-600">
              {mockProjects.length} projects total
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockProjects.map((project) => (
              <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-black mb-2">{project.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-3 py-1 text-xs font-medium border rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      <span className={`px-3 py-1 text-xs font-medium border rounded-full ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                      <span className={`px-3 py-1 text-xs font-medium border rounded-full ${getRoleColor(project.role)}`}>
                        {project.role}
                      </span>
                      <span className="px-3 py-1 text-xs font-medium border rounded-full bg-gray-100 text-gray-800 border-gray-200">
                        {project.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                      <FaEdit size={16} />
                    </button>
                    <button className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors">
                      <FaUsers size={16} />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <FaCog size={16} />
                    </button>
                  </div>
                  
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                    >
                      <FaExternalLinkAlt className="mr-2" size={14} />
                      View Live
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Demo Mode</h3>
          <p className="text-yellow-700">
            You're viewing a demo version of the Projects dashboard. In the full version, you would be able to:
          </p>
          <ul className="list-disc list-inside text-yellow-700 mt-2 space-y-1">
            <li>Create and manage real projects</li>
            <li>Collaborate with team members</li>
            <li>Track project progress and milestones</li>
            <li>Deploy projects to production</li>
            <li>Access project analytics and reporting</li>
          </ul>
          <div className="mt-4">
            <Link
              href="/profile"
              className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 