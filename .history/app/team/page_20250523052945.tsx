'use client';

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FaUsers, FaSpinner, FaProjectDiagram, FaUserPlus, FaAngleDown, FaAngleRight,
  FaEdit, FaExternalLinkAlt, FaComments, FaTrash, FaFolderOpen, FaChevronUp, FaChevronDown,
  FaBars, FaGripVertical
} from 'react-icons/fa';
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
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- BEGIN HELPERS AND ENUMS ---

enum ProjectRole {
  Owner = 'Platform Owner',
  ProjectManager = 'project_manager',
  Freelancer = 'freelancer',
  CLIENT = 'client',
  Viewer = 'viewer',
}

const getProjectRoleStyle = (role: string | ProjectRole | undefined): string => {
  if (!role) return "bg-gray-700 text-gray-200 text-xs px-2 py-0.5 font-medium whitespace-nowrap";
  let roleString = '';
  if (typeof role === 'string') {
    roleString = (ProjectRole as any)[role]?.toLowerCase() || role.toLowerCase();
  } else {
    const enumKey = Object.keys(ProjectRole).find(key => (ProjectRole as any)[key] === role);
    roleString = enumKey ? (ProjectRole as any)[enumKey].toLowerCase() : '';
  }
  let c = "text-xs px-2 py-0.5 font-medium whitespace-nowrap ";
  if (roleString === ProjectRole.Owner.toLowerCase() || roleString === 'platform owner') c += "bg-blue-700 text-blue-200";
  else if (roleString === ProjectRole.Freelancer.toLowerCase()) c += "bg-green-700 text-green-200";
  else if (roleString === ProjectRole.CLIENT.toLowerCase()) c += "bg-purple-700 text-purple-200";
  else if (roleString === ProjectRole.ProjectManager.toLowerCase()) c += "bg-sky-700 text-sky-200";
  else if (roleString === ProjectRole.Viewer.toLowerCase()) c += "bg-gray-600 text-gray-100";
  else c += "bg-gray-700 text-gray-200";
  return c;
};

const badge1Options = ['Pending_setup', 'Planning', 'In Development', 'Live', 'Maintenance', 'On Hold', 'Archived', 'Needs Review', 'Completed', 'Requires Update'];
const badge2Options = ['SaaS', 'Mobile App', 'Website', 'E-commerce', 'AI/ML', 'Consulting', 'Internal Tool', 'Web3/Blockchain', 'Creative Services', 'Platform', 'Service'];
const badge3Options = ['High Priority', 'Medium Priority', 'Low Priority', 'Needs Feedback', 'Client Approved', 'Phase 1', 'Phase 2', 'Experimental', 'Showcase Ready', 'Internal'];

const getBadgeStyle = (_badgeValue: string | null): string => {
  return `text-xs font-semibold p-1.5 appearance-none min-w-[100px] focus:ring-sky-500 focus:border-sky-500 border bg-black text-gray-300 border-gray-700 hover:bg-gray-800`;
};

// --- END HELPERS AND ENUMS ---

interface ManagedProject { // For collapsible admin list
  id: string;
  name: string;
  clientName?: string;
  projectManagerName?: string;
}

interface TeamMember { // For members within an expanded managed project
  user_id: string;
  role: string;
  display_name?: string;
  project_id?: string;
}

interface PlatformUser { // For user selection dropdown
  id: string;
  display_name: string;
}

// --- BEGIN SortableManagedProjectBar Component ---
interface SortableManagedProjectBarProps {
  managedProject: ManagedProject;
  selectedProjectId: string | null;
  onToggleExpand: (projectId: string) => void;
  user: User | null; // Current logged-in user
  // Props for expanded content (member list and form)
  teamMembers: TeamMember[];
  isLoadingTeamMembers: boolean;
  errorMembers: string | null; // Assuming you have an error state for members section
  openRemoveConfirmModal: (member: TeamMember, projId: string, projName: string) => void;
  platformUsers: PlatformUser[];
  isLoadingPlatformUsers: boolean;
  selectedPlatformUserId: string;
  setSelectedPlatformUserId: (userId: string) => void;
  newMemberRole: ProjectRole;
  setNewMemberRole: (role: ProjectRole) => void;
  handleAddNewMember: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  isAddingMember: boolean;
  isRemovingMember: boolean; // To disable remove buttons during other operations
  // Role fetching and styling helpers (can be passed or accessed via context if preferred)
  getProjectRoleStyle: (role: string | ProjectRole | undefined) => string;
}

function SortableManagedProjectBar({
  managedProject,
  selectedProjectId,
  onToggleExpand,
  user,
  teamMembers,
  isLoadingTeamMembers,
  errorMembers,
  openRemoveConfirmModal,
  platformUsers,
  isLoadingPlatformUsers,
  selectedPlatformUserId,
  setSelectedPlatformUserId,
  newMemberRole,
  setNewMemberRole,
  handleAddNewMember,
  isAddingMember,
  isRemovingMember,
  getProjectRoleStyle
}: SortableManagedProjectBarProps) {
  const { 
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: managedProject.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };

  const mp = managedProject; // Alias for brevity inside JSX
  const isExpanded = selectedProjectId === mp.id;

  return (
    <div ref={setNodeRef} style={style} className="rounded-lg overflow-hidden shadow-md border border-gray-700 hover:border-gray-600 transition-colors duration-150 bg-black">
      <div className="w-full flex items-center justify-between p-4 focus:outline-none">
        <div className="flex items-center flex-grow">
          <button 
            {...attributes} 
            {...listeners} 
            onClick={(e) => e.stopPropagation()}
            className="p-2 mr-2 text-gray-500 hover:text-gray-300 cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-sky-500 rounded"
          >
            <FaGripVertical />
          </button>
          <FaFolderOpen className="mr-3 text-sky-500 text-lg" /> 
          <span className="font-medium text-lg text-gray-100 mr-auto truncate cursor-pointer" onClick={() => onToggleExpand(mp.id)}>{mp.name}</span>
        </div>
        <div className="flex items-center flex-shrink-0 ml-2">
          <span 
            onClick={() => onToggleExpand(mp.id)}
            className={`mr-3 text-xs font-semibold px-2 py-0.5 rounded-full cursor-pointer ${isExpanded ? 'bg-sky-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            {isExpanded ? 'MANAGING' : 'VIEW MEMBERS'}
          </span>
          <button onClick={() => onToggleExpand(mp.id)} className="p-1">
            {isExpanded ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 md:p-6 bg-gray-900/70 border-t border-gray-700">
          {/* Add/Update Member Form */}
          <div className="mb-6 pb-6 border-b border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-4">Add/Update Member for "{mp.name}"</h4>
            <form onSubmit={handleAddNewMember} className="space-y-4">
              <div>
                <label htmlFor={`platformUserSelect-${mp.id}`} className="block text-sm font-medium text-gray-300 mb-1">User</label>
                {isLoadingPlatformUsers ? <FaSpinner className="animate-spin" /> : (
                  <select id={`platformUserSelect-${mp.id}`} value={selectedPlatformUserId} onChange={(e) => setSelectedPlatformUserId(e.target.value)}
                          className="w-full bg-gray-800 border-gray-700 rounded-md p-2 focus:ring-sky-500 focus:border-sky-500" required>
                    <option value="" disabled>-- Select --</option>
                    {platformUsers.filter(pUser => pUser.id !== user?.id).map(pUser => (<option key={pUser.id} value={pUser.id}>{pUser.display_name}</option>))}
                  </select>
                )}
              </div>
              <div>
                <label htmlFor={`newMemberRole-${mp.id}`} className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                <select id={`newMemberRole-${mp.id}`} value={newMemberRole} onChange={(e) => setNewMemberRole(e.target.value as ProjectRole)}
                        className="w-full bg-gray-800 border-gray-700 rounded-md p-2 focus:ring-sky-500 focus:border-sky-500">
                  {Object.values(ProjectRole).map(role => (<option key={role} value={role}>{role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>))}
                </select>
              </div>
              <button type="submit" disabled={isAddingMember || isLoadingPlatformUsers}
                      className="w-full flex justify-center items-center bg-green-600 hover:bg-green-500 btn-primary disabled:opacity-50">
                {isAddingMember ? <FaSpinner className="animate-spin mr-2" /> : <FaUserPlus className="mr-2" />} Add/Update Member
              </button>
            </form>
          </div>

          {/* Team Members List */}
          <h4 className="text-lg font-semibold text-white mb-4">Current Team Members</h4>
          {isLoadingTeamMembers && <div className="flex justify-center py-3"><FaSpinner className="animate-spin text-sky-400" /> <span className="ml-2">Loading members...</span></div>}
          {errorMembers && <div className="p-3 bg-red-800/40 text-red-300 rounded-md mb-3">Error: {errorMembers}</div>} 
          {!isLoadingTeamMembers && teamMembers.length === 0 && (<p className="text-gray-500 italic">No team members assigned.</p>)}
          {!isLoadingTeamMembers && teamMembers.length > 0 && (
            <ul className="space-y-3">
              {teamMembers.filter(member => member.project_id === mp.id).map(member => ( // Ensure we only show members for THIS project
                <li key={member.user_id} className="flex justify-between items-center p-2.5 bg-gray-800 rounded-md shadow">
                  <div className="flex flex-col items-start">
                    <span className="font-normal text-gray-400 text-xs mb-1">{member.display_name || member.user_id}</span> 
                    <span className={getProjectRoleStyle(member.role as ProjectRole | string)}>
                      {member.role.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                  {user?.id !== member.user_id && (
                    <button onClick={() => openRemoveConfirmModal(member, mp.id, mp.name || 'Unnamed Project')}
                            className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded border border-red-500/50 hover:border-red-400"
                            disabled={isAddingMember || isLoadingTeamMembers || isRemovingMember}>Remove</button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
// --- END SortableManagedProjectBar Component ---

export default function TeamPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [managedProjects, setManagedProjects] = useState<ManagedProject[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoadingTeamMembers, setIsLoadingTeamMembers] = useState(false);

  const [platformUsers, setPlatformUsers] = useState<PlatformUser[]>([]);
  const [isLoadingPlatformUsers, setIsLoadingPlatformUsers] = useState(false);
  const [selectedPlatformUserId, setSelectedPlatformUserId] = useState<string>('');
  const [newMemberRole, setNewMemberRole] = useState<ProjectRole>(ProjectRole.Freelancer);
  const [isAddingMember, setIsAddingMember] = useState(false);

  const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ userId: string; displayName: string; projectId: string; projectName: string; } | null>(null);
  const [isRemovingMember, setIsRemovingMember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorMembers, setErrorMembers] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // DND Kit sensors setup
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // DND Kit onDragEnd handler
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setManagedProjects((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id.toString()); // Ensure IDs are strings for comparison
        const newIndex = items.findIndex(item => item.id === over.id.toString());
        if (oldIndex === -1 || newIndex === -1) return items; // Should not happen if items are synced
        return arrayMove(items, oldIndex, newIndex);
      });
      console.log('Project order changed (client-side)');
    }
  };

  useEffect(() => {
    const getUser = async () => {
      setLoadingUser(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) setUser(session.user);
      else router.push('/login?redirectedFrom=/team');
      setLoadingUser(false);
    };
    getUser();
  }, [supabase, router]);

  const fetchManagedProjects = useCallback(async (userId: string) => {
    if (!userId) return;
    setIsLoadingProjects(true); setError(null);
    try {
      const { data: profile, error: profileError } = await supabase.from('profiles').select('role').eq('id', userId).single();
      if (profileError && profileError.code !== 'PGRST116') throw profileError;

      let rawProjects: { id: string; name: string; }[] = [];

      if (profile?.role === 'Admin') {
        const { data, error: e } = await supabase.from('projects').select('id, name');
        if (e) throw e;
        rawProjects = data || [];
      } else {
        const { data: ownedProjects, error: ownedError } = await supabase
          .from('projects')
          .select('id, name')
          .eq('owner_user_id', userId);
        if (ownedError) throw ownedError;
        
        const ownedProjectList = ownedProjects || [];

        const { data: clientProjectMemberships, error: clientMembershipError } = await supabase
          .from('project_members')
          .select('project_id')
          .eq('user_id', userId)
          .eq('role', 'Client');
        if (clientMembershipError) throw clientMembershipError;

        let clientRoleProjects: { id: string; name: string; }[] = [];
        if (clientProjectMemberships && clientProjectMemberships.length > 0) {
          const clientProjectIds = clientProjectMemberships.map(pm => pm.project_id);
          const { data: projectsForClientRole, error: projectsForClientError } = await supabase
            .from('projects')
            .select('id, name')
            .in('id', clientProjectIds);
          if (projectsForClientError) throw projectsForClientError;
          clientRoleProjects = projectsForClientRole || [];
        }
        
        const allManagedProjects = [...ownedProjectList, ...clientRoleProjects];
        const uniqueProjectIds = new Set<string>();
        rawProjects = allManagedProjects.filter(project => {
          if (!uniqueProjectIds.has(project.id)) {
            uniqueProjectIds.add(project.id);
            return true;
          }
          return false;
        });
      }

      // Enhance projects with Client and PM names
      const finalProjects = await Promise.all(rawProjects.map(async (proj) => {
        let clientName: string | undefined = undefined;
        let projectManagerName: string | undefined = undefined;

        const { data: members, error: membersError } = await supabase
          .from('project_members')
          .select('user_id, role')
          .eq('project_id', proj.id)
          .in('role', ['Client', 'project_manager']); // Fetch both roles

        if (membersError) {
          console.error(`Error fetching members for project ${proj.id}:`, membersError);
          // Continue without these names if there's an error
        } else if (members) {
          const clientMember = members.find(m => m.role === 'Client');
          const pmMember = members.find(m => m.role === 'project_manager');

          if (clientMember) {
            const { data: profileData } = await supabase.from('profiles').select('display_name, username').eq('id', clientMember.user_id).single();
            clientName = profileData?.display_name || profileData?.username;
          }
          if (pmMember) {
            const { data: profileData } = await supabase.from('profiles').select('display_name, username').eq('id', pmMember.user_id).single();
            projectManagerName = profileData?.display_name || profileData?.username;
          }
        }
        return { ...proj, clientName, projectManagerName };
      }));

      setManagedProjects(finalProjects);
    } catch (e: any) { setError('Failed to load managed projects: ' + e.message); setManagedProjects([]); }
    finally { setIsLoadingProjects(false); }
  }, [supabase]);

  const fetchTeamMembers = useCallback(async (projectId: string | null) => {
    if (!projectId || !user) return;
    setIsLoadingTeamMembers(true); 
    setErrorMembers(null); // Clear specific members error for this project
    try {
      const { data: membersBasicData, error: e } = await supabase.from('project_members').select('user_id, role').eq('project_id', projectId);
      if (e) throw e;
      if (!membersBasicData) { setTeamMembers([]); setIsLoadingTeamMembers(false); return; }
      const membersWithProfiles = await Promise.all(
        membersBasicData.map(async (member) => {
          const { data: profileData } = await supabase.from('profiles').select('display_name, username').eq('id', member.user_id).single();
          return { ...member, display_name: profileData?.display_name || profileData?.username || 'Unnamed', project_id: projectId };
        })
      );
      setTeamMembers(membersWithProfiles as TeamMember[]);
    } catch (err: any) { 
      setErrorMembers('Failed to fetch team members: ' + err.message); // Set specific error
      setTeamMembers([]); 
    }
    finally { setIsLoadingTeamMembers(false); }
  }, [supabase, user]);

  const fetchPlatformUsers = useCallback(async () => {
    setIsLoadingPlatformUsers(true);
    try {
      const { data, error: e } = await supabase.from('profiles').select('id, display_name, username');
      if (e) throw e;
      setPlatformUsers(data?.map(p => ({ id: p.id, display_name: p.display_name || p.username || p.id })) || []);
    } catch (e: any) { setError('Failed to load users: ' + e.message); }
    finally { setIsLoadingPlatformUsers(false); }
  }, [supabase]);

  useEffect(() => {
    if (user?.id) {
      fetchManagedProjects(user.id);
      fetchPlatformUsers();
    }
  }, [user, fetchManagedProjects, fetchPlatformUsers]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchTeamMembers(selectedProjectId);
      setSelectedPlatformUserId(''); setNewMemberRole(ProjectRole.Freelancer);
      setSuccessMessage(null); 
      setErrorMembers(null); // Also clear specific member errors
    }
  }, [selectedProjectId, fetchTeamMembers]);

  const handleAddNewMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProjectId || !selectedPlatformUserId || !newMemberRole) { setError('Please select project, user, and role.'); return; }
    if (!user) { setError('Login required.'); return; }
    setIsAddingMember(true); setError(null); setSuccessMessage(null);
    try {
      let dbRole = '';
      if (newMemberRole === ProjectRole.CLIENT) dbRole = 'Client';
      else if (newMemberRole === ProjectRole.Freelancer) dbRole = 'Freelancer';
      else if (newMemberRole === ProjectRole.Viewer) dbRole = 'Viewer';
      else if (newMemberRole === ProjectRole.ProjectManager) dbRole = 'Admin';
      else {
        const roleValue = newMemberRole.toString();
        if (roleValue === 'Client' || roleValue === 'Freelancer' || roleValue === 'Admin' || roleValue === 'Viewer') {
          dbRole = roleValue;
        } else {
          dbRole = roleValue.charAt(0).toUpperCase() + roleValue.slice(1);
          console.warn(`Unmatched role in handleAddNewMember: '${roleValue}', attempting to save as '${dbRole}'. Check ProjectRole enum and DB user_role_enum.`);
        }
      }

      const { data: existing, error: e } = await supabase.from('project_members').select('role').eq('project_id', selectedProjectId).eq('user_id', selectedPlatformUserId).single();
      if (e && e.code !== 'PGRST116') throw e;
      if (existing) {
        if (existing.role === dbRole) setSuccessMessage('User already has this role.');
        else {
          const { error: ue } = await supabase.from('project_members').update({ role: dbRole as any }).eq('project_id', selectedProjectId).eq('user_id', selectedPlatformUserId);
          if (ue) throw ue; setSuccessMessage('Role updated.');
        }
      } else {
        const { error: ie } = await supabase.from('project_members').insert({ project_id: selectedProjectId, user_id: selectedPlatformUserId, role: dbRole as any });
        if (ie) throw ie; setSuccessMessage('Member added.');
      }
      fetchTeamMembers(selectedProjectId); setSelectedPlatformUserId(''); setNewMemberRole(ProjectRole.Freelancer);
    } catch (e: any) { setError(`Failed to add/update member: ${e.message}`); }
    finally { setIsAddingMember(false); }
  };

  const openRemoveConfirmModal = (member: TeamMember, projId: string, projName: string) => {
    if (!member?.user_id || !member?.display_name) { setError('Incomplete member data.'); return; }
    setMemberToRemove({ userId: member.user_id, displayName: member.display_name, projectId: projId, projectName: projName });
    setShowRemoveConfirmModal(true);
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;
    setIsRemovingMember(true); setError(null); setSuccessMessage(null);
    try {
      const { error: e } = await supabase.from('project_members').delete().eq('project_id', memberToRemove.projectId).eq('user_id', memberToRemove.userId);
      if (e) throw e;
      setSuccessMessage(`Removed ${memberToRemove.displayName}.`);
      fetchTeamMembers(memberToRemove.projectId);
    } catch (e: any) { setError(`Failed to remove: ${e.message}`); }
    finally { setIsRemovingMember(false); setShowRemoveConfirmModal(false); setMemberToRemove(null); }
  };

  if (loadingUser || (user && isLoadingProjects && !selectedProjectId)) {
    return <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex items-center justify-center"><FaSpinner className="animate-spin text-4xl text-sky-500" /><p className="ml-3">Loading data...</p></div>;
  }
  if (!user && !loadingUser) {
    return <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center"><p className="text-xl mb-4">Login required.</p><Link href="/login?redirectedFrom=/team" className="text-sky-400 hover:text-sky-300">Go to Login</Link></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {error && <div className="my-3 p-3 bg-red-900/30 text-red-400 rounded-md">{error}</div>}
        {successMessage && <div className="my-3 p-3 bg-green-900/30 text-green-400 rounded-md">{successMessage}</div>}

        {/* Collapsible Managed Projects Section */}
        <div className="mt-0">
          {isLoadingProjects && <div className="flex justify-center py-4"><FaSpinner className="animate-spin text-sky-500 text-2xl" /></div>}
          {!isLoadingProjects && managedProjects.length === 0 && user && (
            <div className="text-center py-10">
              <FaUsers className="mx-auto text-5xl text-gray-500 mb-4" />
              <p className="text-gray-400">You are not managing any projects.</p>
              {/* Optionally, add a link/button here to create or claim projects if applicable */}
            </div>
          )}
          {!isLoadingProjects && managedProjects.length > 0 && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={managedProjects.map(mp => mp.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {managedProjects.map(mp => (
                    <SortableManagedProjectBar
                      key={mp.id}
                      managedProject={mp}
                      selectedProjectId={selectedProjectId}
                      onToggleExpand={() => setSelectedProjectId(prev => prev === mp.id ? null : mp.id)}
                      user={user}
                      teamMembers={teamMembers.filter(tm => tm.project_id === mp.id)} // Pass filtered members for THIS project
                      isLoadingTeamMembers={isLoadingTeamMembers && selectedProjectId === mp.id} // Only loading if this project is selected
                      errorMembers={selectedProjectId === mp.id ? errorMembers : null} // Pass error only if this project is selected
                      openRemoveConfirmModal={openRemoveConfirmModal}
                      platformUsers={platformUsers}
                      isLoadingPlatformUsers={isLoadingPlatformUsers}
                      selectedPlatformUserId={selectedPlatformUserId} // These form states are shared for the currently selected project
                      setSelectedPlatformUserId={setSelectedPlatformUserId}
                      newMemberRole={newMemberRole}
                      setNewMemberRole={setNewMemberRole}
                      handleAddNewMember={handleAddNewMember}
                      isAddingMember={isAddingMember && selectedProjectId === mp.id}
                      isRemovingMember={isRemovingMember && selectedProjectId === mp.id} // Pass relevant states
                      getProjectRoleStyle={getProjectRoleStyle} // Pass helper
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </main>

      {showRemoveConfirmModal && memberToRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 md:p-8 rounded-lg shadow-xl border border-gray-700 max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">Confirm Removal</h3>
            <p className="text-gray-300 mb-2">Remove <strong className="text-sky-400">{memberToRemove.displayName}</strong> from <strong className="text-sky-400">"{memberToRemove.projectName}"</strong>?</p>
            <p className="text-xs text-orange-400 mb-6">This revokes their project access.</p>
            {error && <p className="text-red-400 bg-red-900/30 p-2 rounded mb-4">{error}</p>}
            <div className="flex justify-end space-x-3">
              <button onClick={() => { setShowRemoveConfirmModal(false); setMemberToRemove(null); setError(null); }} disabled={isRemovingMember}
                      className="btn-secondary">Cancel</button>
              <button onClick={handleRemoveMember} disabled={isRemovingMember}
                      className="btn-danger flex items-center">
                {isRemovingMember && <FaSpinner className="animate-spin mr-2" />} Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Error display for general page errors, not specific to members section */}
      {error && !errorMembers && <div className="fixed bottom-4 right-4 p-4 bg-red-700 text-white rounded-lg shadow-lg z-50">{error}</div>}
    </div>
  );
}