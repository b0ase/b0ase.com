'use client';

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FaUsers, FaSpinner, FaProjectDiagram, FaUserPlus, FaAngleDown, FaAngleRight,
  FaEdit, FaExternalLinkAlt, FaComments, FaTrash, FaFolderOpen, FaChevronUp, FaChevronDown
} from 'react-icons/fa';

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      if (profileError && profileError.code !== 'PGRST116') throw profileError; // Allow no profile (though unlikely for logged-in user)

      let finalProjects: ManagedProject[] = [];

      if (profile?.role === 'Admin') {
        const { data, error: e } = await supabase.from('projects').select('id, name');
        if (e) throw e;
        finalProjects = data || [];
      } else {
        // 1. Projects owned by the user
        const { data: ownedProjects, error: ownedError } = await supabase
          .from('projects')
          .select('id, name')
          .eq('owner_user_id', userId);
        if (ownedError) throw ownedError;
        
        const ownedProjectList = ownedProjects || [];

        // 2. Projects where the user is a 'Client'
        const { data: clientProjectMemberships, error: clientMembershipError } = await supabase
          .from('project_members')
          .select('project_id')
          .eq('user_id', userId)
          .eq('role', 'Client'); // Ensure this matches the DB enum value

        if (clientMembershipError) throw clientMembershipError;

        let clientRoleProjects: ManagedProject[] = [];
        if (clientProjectMemberships && clientProjectMemberships.length > 0) {
          const clientProjectIds = clientProjectMemberships.map(pm => pm.project_id);
          const { data: projectsForClientRole, error: projectsForClientError } = await supabase
            .from('projects')
            .select('id, name')
            .in('id', clientProjectIds);
          if (projectsForClientError) throw projectsForClientError;
          clientRoleProjects = projectsForClientRole || [];
        }
        
        // Combine and deduplicate
        const allManagedProjects = [...ownedProjectList, ...clientRoleProjects];
        const uniqueProjectIds = new Set<string>();
        finalProjects = allManagedProjects.filter(project => {
          if (!uniqueProjectIds.has(project.id)) {
            uniqueProjectIds.add(project.id);
            return true;
          }
          return false;
        });
      }
      setManagedProjects(finalProjects);
    } catch (e: any) { setError('Failed to load managed projects: ' + e.message); setManagedProjects([]); }
    finally { setIsLoadingProjects(false); }
  }, [supabase]);

  const fetchTeamMembers = useCallback(async (projectId: string | null) => {
    if (!projectId || !user) return;
    setIsLoadingTeamMembers(true); setError(null);
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
    } catch (err: any) { setError('Failed to fetch team members: ' + err.message); setTeamMembers([]); }
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
      setSuccessMessage(null); setError(null);
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

  if (loadingUser || (user && isLoadingProjects)) {
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
            <div className="space-y-3"> {/* Reduced space-y slightly for a tighter look if many projects */} 
              {managedProjects.map(mp => (
                <div key={mp.id} className="rounded-lg overflow-hidden shadow-md border border-gray-700 hover:border-gray-600 transition-colors duration-150">
                  <button
                    onClick={() => setSelectedProjectId(prev => prev === mp.id ? null : mp.id)}
                    className="w-full flex items-center justify-between p-4 bg-black hover:bg-gray-800 focus:outline-none transition-colors duration-150"
                  >
                    <div className="flex items-center">
                      <FaFolderOpen className="mr-3 text-sky-500 text-lg" /> {/* Icon for project */} 
                      <span className="font-medium text-lg text-gray-100">{mp.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`mr-3 text-xs font-semibold px-2 py-0.5 rounded-full ${mp.id === selectedProjectId ? 'bg-sky-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                        {mp.id === selectedProjectId ? 'MANAGING' : 'VIEW MEMBERS'}
                      </span>
                      {mp.id === selectedProjectId ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                    </div>
                  </button>
                  {selectedProjectId === mp.id && (
                    <div className="p-4 md:p-6 bg-gray-900/70 border-t border-gray-700">
                      <div className="mb-6 pb-6 border-b border-gray-700">
                        <h4 className="text-lg font-semibold text-white mb-4">Add/Update Member for "{mp.name}"</h4>
                        <form onSubmit={handleAddNewMember} className="space-y-4">
                          <div>
                            <label htmlFor={`platformUserSelect-${mp.id}`} className="block text-sm font-medium text-gray-300 mb-1">User</label>
                            {isLoadingPlatformUsers ? <FaSpinner className="animate-spin" /> : (
                              <select id={`platformUserSelect-${mp.id}`} value={selectedPlatformUserId} onChange={(e) => setSelectedPlatformUserId(e.target.value)}
                                      className="w-full bg-gray-800 border-gray-700 rounded-md p-2 focus:ring-sky-500 focus:border-sky-500" required>
                                <option value="" disabled>-- Select --</option>
                                {platformUsers.filter(p => p.id !== user?.id).map(p => (<option key={p.id} value={p.id}>{p.display_name}</option>))}
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

                      <h4 className="text-lg font-semibold text-white mb-4">Current Team Members</h4>
                      {isLoadingTeamMembers && <div className="flex justify-center py-3"><FaSpinner className="animate-spin text-sky-400" /> <span className="ml-2">Loading members...</span></div>}
                      {error && <div className="p-3 bg-red-800/40 text-red-300 rounded-md mb-3">Error: {error}</div>}
                      {!isLoadingTeamMembers && teamMembers.length === 0 && (<p className="text-gray-500 italic">No team members assigned.</p>)}
                      {!isLoadingTeamMembers && teamMembers.length > 0 && (
                        <ul className="space-y-3">
                          {teamMembers.map(member => (
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
              ))}
            </div>
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
    </div>
  );
}