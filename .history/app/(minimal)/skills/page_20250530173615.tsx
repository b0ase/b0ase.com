'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import getSupabaseBrowserClient from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import UserSidebar from '@/app/components/UserSidebar';
import { FaLightbulb, FaSpinner, FaCheckCircle, FaPlusCircle } from 'react-icons/fa';
import Link from 'next/link';
import { MyCtxProvider } from '@/app/components/MyCtx';

// Copied from app/profile/page.tsx - consider moving to a shared utils file
interface Skill {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
}

// Copied from app/profile/page.tsx - consider moving to a shared utils file
const getSkillBadgeStyle = (category: string | null, isSelected: boolean): string => {
  const baseStyle = "px-4 py-2 text-sm font-semibold rounded-lg shadow-md flex items-center justify-center transition-all duration-200 ease-in-out cursor-pointer transform hover:scale-105";
  let categoryStyle = "";

  switch (category?.toLowerCase().trim()) {
    case 'frontend development': categoryStyle = 'bg-green-600 text-green-100 border border-green-500 hover:bg-green-500'; break;
    case 'backend development': categoryStyle = 'bg-blue-600 text-blue-100 border border-blue-500 hover:bg-blue-500'; break;
    case 'programming': categoryStyle = 'bg-indigo-600 text-indigo-100 border border-indigo-500 hover:bg-indigo-500'; break;
    case 'design': categoryStyle = 'bg-pink-600 text-pink-100 border border-pink-500 hover:bg-pink-500'; break;
    case 'management': categoryStyle = 'bg-purple-600 text-purple-100 border border-purple-500 hover:bg-purple-500'; break;
    case 'databases': categoryStyle = 'bg-yellow-500 text-yellow-900 border border-yellow-400 hover:bg-yellow-400'; break;
    case 'devops': categoryStyle = 'bg-red-600 text-red-100 border border-red-500 hover:bg-red-500'; break;
    case 'cloud computing': categoryStyle = 'bg-cyan-600 text-cyan-100 border border-cyan-500 hover:bg-cyan-500'; break;
    case 'marketing': categoryStyle = 'bg-orange-600 text-orange-100 border border-orange-500 hover:bg-orange-500'; break;
    // 'User-defined' case removed to prevent styling if they somehow appear
    default: categoryStyle = 'bg-gray-600 text-gray-100 border border-gray-500 hover:bg-gray-500'; break;
  }

  if (isSelected) {
    return `${baseStyle} ${categoryStyle.replace(/bg-([a-z]+)-(\d)00/g, (match, color, shade) => `bg-${color}-${Math.min(parseInt(shade) + 2, 9)}00`)} ring-2 ring-sky-300 ring-opacity-80`;
  }
  return `${baseStyle} ${categoryStyle}`;
};


export default function SkillsPage() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [userSkillIds, setUserSkillIds] = useState<Set<string>>(new Set());
  const [loadingSkills, setLoadingSkills] = useState<boolean>(true);
  const [savingSkill, setSavingSkill] = useState<string | null>(null); // skill.id that is currently being saved
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // User Authentication and Initial Load
  useEffect(() => {
    const fetchUserAndInitialData = async () => {
      setLoadingUser(true);
      const { data: { user: fetchedUser }, error: userError } = await supabase.auth.getUser();

      if (userError || !fetchedUser) {
        console.error('[SkillsPage] User not authenticated or error fetching user:', userError?.message);
        router.push('/login');
        return;
      }
      
      console.log('[SkillsPage] User authenticated:', fetchedUser.id);
      setUser(fetchedUser);
      setLoadingUser(false);
    };

    fetchUserAndInitialData();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        console.log('[SkillsPage] SIGNED_OUT event. Clearing local user state.');
        setUser(null);
      } else if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        setUser(session?.user ?? null);
        if (!session?.user) {
            console.log('[SkillsPage] User session became null (not via explicit SIGNED_OUT), redirecting to login.');
            router.push('/login');
        }
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [supabase, router]);

  // Fetch all skills and user's selected skills
  useEffect(() => {
    if (!user) return; // Don't fetch if user is not loaded yet

    const loadSkillsData = async () => {
      setLoadingSkills(true);
      setError(null);
      try {
        // Fetch all available skills
        const { data: dbSkillsData, error: allSkillsError } = await supabase
          .from('skills')
          .select('id, name, category, description')
          .not('category', 'eq', 'User-defined') // Filter out User-defined skills at fetch time
          .order('category', { ascending: true })
          .order('name', { ascending: true });

        if (allSkillsError) throw allSkillsError;
        setAllSkills(dbSkillsData || []);
        
        // Fetch user's skills
        const { data: userSkillsData, error: userSkillsError } = await supabase
          .from('user_skills')
          .select('skill_id')
          .eq('user_id', user.id);

        if (userSkillsError) throw userSkillsError;
        setUserSkillIds(new Set(userSkillsData?.map(us => us.skill_id) || []));

      } catch (err: any) {
        console.error('[SkillsPage] Error loading skills data:', err);
        setError(`Failed to load skills: ${err.message}`);
      } finally {
        setLoadingSkills(false);
      }
    };

    loadSkillsData();
  }, [user, supabase]);

  // Group skills by category for display - MOVED UP
  const groupedSkills: Record<string, Skill[]> = allSkills.reduce((acc, skill) => {
    const category = skill.category || 'Miscellaneous';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const sortedCategories = Object.keys(groupedSkills).sort((a,b) => {
    if (a === 'Miscellaneous') return 1;
    if (b === 'Miscellaneous') return -1;
    return a.localeCompare(b);
  });

  // Handle Skill Toggle (copied and adapted from ProfilePage)
  const handleSkillToggle = async (skill: Skill) => {
    if (!user || savingSkill === skill.id) return;

    setSavingSkill(skill.id);
    setError(null);
    setSuccessMessage(null);

    const isCurrentlySelected = userSkillIds.has(skill.id);

    try {
      if (isCurrentlySelected) {
        // Remove skill
        const { error: deleteError } = await supabase
          .from('user_skills')
          .delete()
          .match({ user_id: user.id, skill_id: skill.id });
        if (deleteError) throw deleteError;
        setUserSkillIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(skill.id);
          return newSet;
        });
        setSuccessMessage(`Skill "${skill.name}" removed from your profile.`);
      } else {
        // Add skill
        const { error: insertError } = await supabase
          .from('user_skills')
          .insert({ user_id: user.id, skill_id: skill.id });
        if (insertError) {
          if (insertError.code === '23505') {
            setUserSkillIds(prev => new Set(prev).add(skill.id));
            setSuccessMessage(`Skill "${skill.name}" is already in your profile (synced).`);
          } else {
            throw insertError;
          }
        } else {
          setUserSkillIds(prev => new Set(prev).add(skill.id));
          setSuccessMessage(`Skill "${skill.name}" added to your profile.`);
        }
      }
      setTimeout(() => setSuccessMessage(null), 2500);
    } catch (err: any) {
      console.error('[SkillsPage] Error toggling skill:', err);
      setError(`Failed to update skill "${skill.name}": ${err.message}`);
      setTimeout(() => setError(null), 3000);
    } finally {
      setSavingSkill(null);
    }
  };


  if (loadingUser || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <FaSpinner className="animate-spin text-4xl text-sky-500" />
        <p className="ml-3 text-xl">Loading user...</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600 flex items-center">
            <FaLightbulb className="mr-4 text-yellow-400" />
            Explore & Add Skills
          </h1>
          <Link href="/profile" legacyBehavior>
              <a className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out flex items-center">
                  Back to Profile
              </a>
          </Link>
        </div>

        {error && <p className="fixed top-20 right-10 z-50 mb-4 p-3 bg-red-700 text-white rounded-md shadow-lg">Error: {error}</p>}
        {successMessage && <p className="fixed top-20 right-10 z-50 mb-4 p-3 bg-green-600 text-white rounded-md shadow-lg">{successMessage}</p>}

        {loadingSkills ? (
          <div className="flex items-center justify-center h-64">
            <FaSpinner className="animate-spin text-5xl text-sky-500" />
            <p className="ml-4 text-2xl text-gray-300">Loading skills...</p>
          </div>
        ) : (
          <div className="space-y-10">
            {sortedCategories.map(category => (
              <section key={category}>
                <h2 className="text-2xl font-semibold text-sky-300 mb-5 capitalize border-b-2 border-sky-800 pb-2">
                  {category} ({groupedSkills[category].length})
                </h2>
                <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap">
                  {groupedSkills[category].map(skill => {
                    const isSelected = userSkillIds.has(skill.id);
                    const isCurrentlySaving = savingSkill === skill.id;
                    return (
                      <div
                        key={skill.id}
                        onClick={() => !isCurrentlySaving && handleSkillToggle(skill)}
                        className={getSkillBadgeStyle(skill.category, isSelected)}
                        title={skill.description || skill.name}
                      >
                        {isCurrentlySaving ? (
                          <FaSpinner className="animate-spin mr-2" />
                        ) : isSelected ? (
                          <FaCheckCircle className="mr-2 text-lg text-green-300" />
                        ) : (
                          <FaPlusCircle className="mr-2 text-lg opacity-70" />
                        )}
                        {skill.name}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  );
} 