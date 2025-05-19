'use client';

import React, { useEffect, useState, FormEvent, useCallback } from 'react';
import Link from 'next/link';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { FaProjectDiagram, FaPlusCircle, FaTimes, FaSpinner, FaEdit, FaTrash, FaExternalLinkAlt } from 'react-icons/fa'; // Added FaEdit, FaTrash, FaExternalLinkAlt
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAuth } from '@/app/components/Providers';

// --- BEGIN ADDED ENUM ---
enum ProjectRole {
  ProjectManager = 'project_manager',
  Collaborator = 'collaborator',
  ClientContact = 'client_contact',
  Viewer = 'viewer',
}
// --- END ADDED ENUM ---

interface ClientProject {
  id: string; // UUID
  name: string;
  project_slug: string;
  status: string | null;
  project_brief?: string | null;
  badge1?: string | null;
  badge2?: string | null;
  badge3?: string | null;
  is_featured?: boolean;
  badge4?: string | null;
  badge5?: string | null;
  live_url?: string | null;
  user_id: string; // ID of the user who created/owns the project (from 'clients' table)
  created_at: string; // For sorting
  currentUserRole?: ProjectRole | string; // Role of the currently logged-in user for this project
  order_index?: number | null; // Added for explicit ordering
}

const badge1Options = ['Pending_setup', 'Planning', 'In Development', 'Live', 'Maintenance', 'On Hold', 'Archived', 'Needs Review', 'Completed', 'Requires Update']; // Added Pending_setup
const badge2Options = ['SaaS', 'Mobile App', 'Website', 'E-commerce', 'AI/ML', 'Consulting', 'Internal Tool', 'Web3/Blockchain', 'Creative Services', 'Platform', 'Service'];
const badge3Options = ['High Priority', 'Medium Priority', 'Low Priority', 'Needs Feedback', 'Client Approved', 'Phase 1', 'Phase 2', 'Experimental', 'Showcase Ready', 'Internal'];

// Muted badge style consistent with UserSkills/UserTeams
const getMutedBadgeStyle = (value: string | null, type: 'status' | 'category' | 'priority'): string => {
  let bgColor = 'bg-gray-800';
  let textColor = 'text-gray-300';
  let borderColor = 'border-gray-700';

  if (!value) {
    return `text-xs font-medium rounded-md px-2.5 py-1 border ${bgColor} ${textColor} ${borderColor} hover:opacity-90`;
  }

  const lowerValue = value.toLowerCase();

  if (type === 'status') {
    if (lowerValue === 'live') { bgColor = 'bg-green-800'; textColor = 'text-green-200'; borderColor = 'border-green-700'; }
    else if (lowerValue === 'in development') { bgColor = 'bg-sky-800'; textColor = 'text-sky-200'; borderColor = 'border-sky-700'; }
    else if (lowerValue === 'planning') { bgColor = 'bg-indigo-800'; textColor = 'text-indigo-200'; borderColor = 'border-indigo-700'; }
    else if (lowerValue === 'pending_setup') { bgColor = 'bg-yellow-800'; textColor = 'text-yellow-200'; borderColor = 'border-yellow-700'; }
    else if (lowerValue === 'on hold') { bgColor = 'bg-orange-800'; textColor = 'text-orange-200'; borderColor = 'border-orange-700'; }
    else if (lowerValue === 'maintenance' || lowerValue === 'archived' || lowerValue === 'completed') { bgColor = 'bg-slate-800'; textColor = 'text-slate-300'; borderColor = 'border-slate-700'; }
  } else if (type === 'category') {
    if (lowerValue === 'saas') { bgColor = 'bg-purple-800'; textColor = 'text-purple-200'; borderColor = 'border-purple-700'; }
    else if (lowerValue === 'mobile app') { bgColor = 'bg-pink-800'; textColor = 'text-pink-200'; borderColor = 'border-pink-700'; }
    else if (lowerValue === 'website') { bgColor = 'bg-cyan-800'; textColor = 'text-cyan-200'; borderColor = 'border-cyan-700'; }
    else if (lowerValue === 'e-commerce') { bgColor = 'bg-lime-800'; textColor = 'text-lime-200'; borderColor = 'border-lime-700'; }
    else if (lowerValue === 'ai/ml') { bgColor = 'bg-rose-800'; textColor = 'text-rose-200'; borderColor = 'border-rose-700'; }
  } else if (type === 'priority') {
    if (lowerValue === 'high priority') { bgColor = 'bg-red-800'; textColor = 'text-red-200'; borderColor = 'border-red-700'; }
    else if (lowerValue === 'medium priority') { bgColor = 'bg-amber-800'; textColor = 'text-amber-200'; borderColor = 'border-amber-700'; }
    else if (lowerValue === 'low priority') { bgColor = 'bg-emerald-800'; textColor = 'text-emerald-200'; borderColor = 'border-emerald-700'; }
  }
  
  return `text-xs font-medium rounded-md px-2.5 py-1 border ${bgColor} ${textColor} ${borderColor} hover:opacity-90`;
};

// Helper function to get badge color based on value
const getBadgeStyle = (badgeValue: string | null): string => {
  let baseStyle = "text-xs font-semibold rounded-md p-1.5 appearance-none min-w-[100px] focus:ring-sky-500 focus:border-sky-500 border";
  switch (badgeValue?.toLowerCase()) {
    case 'pending_setup':
      return `${baseStyle} bg-yellow-700 text-yellow-200 border-yellow-600`;
    case 'planning':
      return `${baseStyle} bg-indigo-700 text-indigo-200 border-indigo-600`;
    case 'in development':
      return `${baseStyle} bg-sky-700 text-sky-200 border-sky-600`;
    case 'live':
      return `${baseStyle} bg-green-700 text-green-200 border-green-600`;
    case 'maintenance':
      return `${baseStyle} bg-gray-600 text-gray-200 border-gray-500`;
    case 'on hold':
      return `${baseStyle} bg-orange-600 text-orange-100 border-orange-500`;
    case 'archived':
      return `${baseStyle} bg-slate-700 text-slate-300 border-slate-600`;
    case 'completed':
      return `${baseStyle} bg-teal-600 text-teal-100 border-teal-500`;
    default: // Includes "Needs Review", "Requires Update", "Badge 1..." placeholder, or null/undefined
      return `${baseStyle} bg-gray-800 text-gray-300 border-gray-700`;
  }
};

// Helper function to get badge color for Badge 2
const getBadge2Style = (badgeValue: string | null): string => {
  let baseStyle = "text-xs font-semibold rounded-md p-1.5 appearance-none min-w-[100px] focus:ring-sky-500 focus:border-sky-500 border";
  switch (badgeValue?.toLowerCase()) {
    case 'saas':
      return `${baseStyle} bg-purple-700 text-purple-200 border-purple-600`;
    case 'mobile app':
      return `${baseStyle} bg-pink-700 text-pink-200 border-pink-600`;
    case 'website':
      return `${baseStyle} bg-cyan-600 text-cyan-100 border-cyan-500`;
    case 'e-commerce':
      return `${baseStyle} bg-lime-600 text-lime-100 border-lime-500`;
    case 'ai/ml':
      return `${baseStyle} bg-rose-600 text-rose-100 border-rose-500`;
    // Add more cases for other badge2Options as needed
    default: // Placeholder "Badge 2..." or null/undefined
      return `${baseStyle} bg-gray-800 text-gray-300 border-gray-700`;
  }
};

// Helper function to get badge color for Badge 3
const getBadge3Style = (badgeValue: string | null): string => {
  let baseStyle = "text-xs font-semibold rounded-md p-1.5 appearance-none min-w-[100px] focus:ring-sky-500 focus:border-sky-500 border";
  switch (badgeValue?.toLowerCase()) {
    case 'high priority':
      return `${baseStyle} bg-red-700 text-red-200 border-red-600`;
    case 'medium priority':
      return `${baseStyle} bg-amber-600 text-amber-100 border-amber-500`;
    case 'low priority':
      return `${baseStyle} bg-emerald-700 text-emerald-200 border-emerald-600`;
    case 'needs feedback':
      return `${baseStyle} bg-fuchsia-600 text-fuchsia-100 border-fuchsia-500`;
    // Add more cases for other badge3Options as needed
    default: // Placeholder "Badge 3..." or null/undefined
      return `${baseStyle} bg-gray-800 text-gray-300 border-gray-700`;
  }
};

// Helper function to assign a numeric priority based on badge3 value
const getPriorityOrderValue = (badgeValue: string | null): number => {
  if (!badgeValue) return 4; // Null or empty string is lowest priority
  switch (badgeValue.toLowerCase()) {
    case 'high priority': return 0;
    case 'medium priority': return 1;
    case 'low priority': return 2;
    case 'needs feedback': return 3;
    default: return 4; // All other badge values
  }
};

// Card styling adjusted for new theme
const getCardDynamicBorderStyle = (priorityValue: number): string => {
  let baseStyle = "p-6 shadow-lg rounded-lg hover:border-gray-600 transition-colors duration-300 relative border border-gray-800 bg-black"; 

  switch (priorityValue) {
    case 0: return `${baseStyle} border-red-700`; // High Priority - keep distinct border
    case 1: return `${baseStyle} border-amber-700`; // Medium Priority - keep distinct border
    // For lower priorities, maybe a more subtle border or rely on hover.
    // case 2: return `${baseStyle} border-sky-700`;    
    // case 3: return `${baseStyle} border-teal-700`;  
    default: return `${baseStyle}`; // Uses border-gray-800 from baseStyle
  }
};

// New SortableProjectCard component
interface SortableProjectCardProps {
  project: ClientProject;
  updatingItemId: string | null;
  handleBadgeChange: (projectId: string, badgeKey: 'badge1' | 'badge2' | 'badge3' | 'badge4' | 'badge5', newValue: string | null) => void;
  handleIsFeaturedToggle: (projectId: string, currentIsFeatured: boolean) => void;
  openDeleteModal: (projectId: string, projectName: string) => void;
  // Removed style options, using getMutedBadgeStyle directly
}

function SortableProjectCard({ 
  project, 
  updatingItemId, 
  handleBadgeChange, 
  handleIsFeaturedToggle,
  openDeleteModal,
}: SortableProjectCardProps) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition, 
    isDragging 
  } = useSortable({ id: project.id });

  const projectSlug = project.project_slug;
  const liveUrl = project.live_url;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      className={getCardDynamicBorderStyle(getPriorityOrderValue(project.badge3 ?? null))}
    >
      {updatingItemId === project.id && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg z-[101]">
          <FaSpinner className="animate-spin text-sky-500 text-3xl" />
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div className="flex items-center gap-x-3 mb-2 sm:mb-0">
          {liveUrl ? (
            <a 
              href={liveUrl.startsWith('http') ? liveUrl : `https://${liveUrl}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={(e) => e.stopPropagation()} 
              className="inline-flex items-center text-xl font-semibold text-white hover:text-sky-400 transition-colors"
              title={`Visit live site: ${project.name}`}
            >
              {project.name}
              <FaExternalLinkAlt className="w-4 h-4 ml-2 opacity-70" />
            </a>
          ) : (
            <Link href={`/myprojects/${project.project_slug}`} legacyBehavior>
              <a className="text-xl font-semibold text-white hover:text-sky-400 hover:underline">
                {project.name}
              </a>
            </Link>
          )}
          <Link href={`/myprojects/${project.project_slug}/edit`} passHref legacyBehavior>
            <a className="text-gray-500 hover:text-sky-400 transition-colors" title="Edit Project" onClick={(e) => e.stopPropagation()}>
              <FaEdit />
            </a>
          </Link>
          {project.currentUserRole && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium 
              ${project.currentUserRole === ProjectRole.ProjectManager || project.currentUserRole === "Owner" 
                ? "bg-sky-800 text-sky-200 border border-sky-700" 
                : "bg-gray-700 text-gray-300 border border-gray-600"}\n            `}>
              {typeof project.currentUserRole === 'string' ? project.currentUserRole.replace(/_/g, ' ') : 'Member'}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
          {/* Placeholder for future actions like toggle feature - removed for now to simplify styling */}
        </div>
      </div>

      {project.project_brief && <p className="text-sm text-gray-400 mb-4 leading-relaxed">{project.project_brief}</p>}
      
      <div className="flex flex-wrap gap-2 mb-4" onClick={(e) => e.stopPropagation()}>
        {project.badge1 && <span className={getMutedBadgeStyle(project.badge1 ?? null, 'status')}>{project.badge1}</span>}
        {project.badge2 && <span className={getMutedBadgeStyle(project.badge2 ?? null, 'category')}>{project.badge2}</span>}
        {project.badge3 && <span className={getMutedBadgeStyle(project.badge3 ?? null, 'priority')}>{project.badge3}</span>}
        {/* Add badge4 and badge5 if they are used and need styling */}
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-800" onClick={(e) => e.stopPropagation()}>
        <Link href={`/myprojects/${project.project_slug}`} legacyBehavior>
          <a className="inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 hover:text-white transition-colors">
            Open Project Page
          </a>
        </Link>
        <button 
          onClick={(e) => { e.stopPropagation(); openDeleteModal(project.id, project.name);}} 
          className="p-2 text-gray-500 hover:text-red-500 transition-colors"
          title="Delete Project"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

export default function MyProjectsPage() {
  const supabase = createClientComponentClient();
  const { session } = useAuth(); // Use session from useAuth
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // For new project modal (if we re-add a button for it, or for a separate page)
  // For now, the button is removed from this page.
  // const [showModal, setShowModal] = useState(false);
  // const [newProjectName, setNewProjectName] = useState('');
  // const [newProjectSlug, setNewProjectSlug] = useState('');
  // const [isSubmitting, setIsSubmitting] = useState(false);

  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchProjects = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: rpcError } = await supabase.rpc('get_projects_for_user', { user_id_param: user.id });

      if (rpcError) throw rpcError;
      
      if (data) {
         // Sort by order_index, then by created_at if order_index is null or same
        const sortedData = data.sort((a: ClientProject, b: ClientProject) => {
            const orderA = a.order_index ?? Infinity;
            const orderB = b.order_index ?? Infinity;
            if (orderA !== orderB) {
                return orderA - orderB;
            }
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        setProjects(sortedData as ClientProject[]);
      } else {
        setProjects([]);
      }
    } catch (e: any) {
      console.error("Error fetching projects:", e);
      setError(e.message || 'Failed to fetch projects.');
    } finally {
      setIsLoading(false);
    }
  }, [supabase, user]);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    } else {
      setUser(null); // Clear user if session is lost
    }
  }, [session]);

  useEffect(() => {
    if (user) {
      fetchProjects();
    } else {
      setProjects([]); // Clear projects if no user
      setIsLoading(false);
    }
  }, [user, fetchProjects]);

  // Removed handleNewProjectSubmit, openModal, closeModal as the primary "Add Project" button is removed from this page.
  // If "Add New Project" is triggered from Launchbar to /projects/new, that page will handle creation.

  const handleBadgeChange = async (projectId: string, badgeKey: 'badge1' | 'badge2' | 'badge3' | 'badge4' | 'badge5', newValue: string | null) => {
    setUpdatingItemId(projectId);
    try {
      const { error } = await supabase
        .from('client_projects')
        .update({ [badgeKey]: newValue, updated_at: new Date().toISOString() })
        .eq('id', projectId);
      if (error) throw error;
      setProjects(prevProjects => 
        prevProjects.map(p => p.id === projectId ? { ...p, [badgeKey]: newValue } : p)
      );
    } catch (e: any) {
      console.error(`Error updating ${badgeKey}:`, e);
      // Optionally set an error message for the user
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleIsFeaturedToggle = async (projectId: string, currentIsFeatured: boolean) => {
    setUpdatingItemId(projectId);
    try {
      const { error } = await supabase
        .from('client_projects')
        .update({ is_featured: !currentIsFeatured, updated_at: new Date().toISOString() })
        .eq('id', projectId);
      if (error) throw error;
      setProjects(prevProjects => 
        prevProjects.map(p => p.id === projectId ? { ...p, is_featured: !currentIsFeatured } : p)
      );
    } catch (e: any) {
      console.error("Error toggling is_featured:", e);
    } finally {
      setUpdatingItemId(null);
    }
  };
  
  const openDeleteModal = (projectId: string, projectName: string) => {
    setProjectToDelete({ id: projectId, name: projectName });
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setProjectToDelete(null);
    setShowDeleteModal(false);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('client_projects')
        .delete()
        .eq('id', projectToDelete.id);
      if (error) throw error;
      setProjects(prevProjects => prevProjects.filter(p => p.id !== projectToDelete.id));
      closeDeleteModal();
    } catch (e: any) {
      console.error("Error deleting project:", e);
      setError(`Failed to delete project: ${e.message}`);
      // Keep modal open or provide specific error feedback in modal
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over.id);
      const newOrder = arrayMove(projects, oldIndex, newIndex);
      setProjects(newOrder);

      // Update order_index in Supabase for all affected projects
      // This can be a batch update for efficiency
      const updates = newOrder.map((project, index) => ({
        id: project.id,
        order_index: index,
        updated_at: new Date().toISOString() 
      }));

      try {
        // Supabase doesn't have a direct batch update with different values per row in JS client like .upsert()
        // We have to do individual updates or use a stored procedure.
        // For simplicity, using individual updates. For many items, a stored procedure would be better.
        for (const update of updates) {
          const { error } = await supabase
            .from('client_projects')
            .update({ order_index: update.order_index, updated_at: update.updated_at })
            .eq('id', update.id);
          if (error) throw error;
        }
      } catch (e:any) {
        console.error("Error updating project order:", e);
        setError("Failed to save new project order. Please refresh.");
        // Optionally revert to original order or fetch again
        fetchProjects(); 
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center p-4">
        <FaSpinner className="animate-spin text-sky-500 text-4xl mb-4" />
        <p className="text-lg text-gray-400">Loading your projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center p-4">
        <FaTimes className="text-red-500 text-4xl mb-4" />
        <p className="text-lg text-red-400">Error: {error}</p>
        <button 
          onClick={fetchProjects} 
          className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-white flex items-center">
          <FaProjectDiagram className="mr-3 text-sky-500" />
          My Projects
        </h1>
        {/* "Add New Project" button removed as requested */}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-10 px-6 bg-black border border-gray-800 rounded-lg shadow-md">
          <FaProjectDiagram className="mx-auto text-5xl text-gray-500 mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">No Projects Yet</h2>
          <p className="text-gray-400 mb-6">Start by creating a new project to manage your work.</p>
          <Link href="/projects/new" legacyBehavior>
            <a className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-black transition-colors">
              <FaPlusCircle className="mr-2 -ml-1 h-5 w-5" />
              Create Your First Project
            </a>
          </Link>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-6">
              {projects.map(project => (
                <SortableProjectCard 
                  key={project.id} 
                  project={project}
                  updatingItemId={updatingItemId}
                  handleBadgeChange={handleBadgeChange}
                  handleIsFeaturedToggle={handleIsFeaturedToggle}
                  openDeleteModal={openDeleteModal}
                  // Props for styling functions removed, they are used internally or directly now
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && projectToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={closeDeleteModal}>
          <div className="bg-gray-900 p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete the project "<span className="font-medium text-sky-400">{projectToDelete.name}</span>"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProject}
                disabled={isDeleting}
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center"
              >
                {isDeleting && <FaSpinner className="animate-spin mr-2" />}
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 