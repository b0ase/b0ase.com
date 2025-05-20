'use client';

import { useEffect, useState, FormEvent, ChangeEvent, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import getSupabaseBrowserClient from '@/lib/supabase/client'; // Adjust path if needed
import { User } from '@supabase/supabase-js';

// Define interfaces needed by the hook
interface Profile {
  id?: string; // Added id for profile matching in useEffect
  username: string | null;
  display_name: string | null;
  avatar_url?: string | null;
  full_name?: string | null;
  bio?: string | null;
  website_url?: string | null;
  twitter_url?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  instagram_url?: string | null;
  discord_url?: string | null;
  phone_whatsapp?: string | null;
  tiktok_url?: string | null;
  telegram_url?: string | null;
  facebook_url?: string | null;
  dollar_handle?: string | null;
  token_name?: string | null;
  supply?: string | null;
  has_seen_welcome_card?: boolean | null;
}

interface ProfileForUpdate {
  username?: string | null;
  display_name?: string | null;
  full_name?: string | null;
  bio?: string | null;
  website_url?: string | null;
  twitter_url?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  instagram_url?: string | null;
  discord_url?: string | null;
  phone_whatsapp?: string | null;
  tiktok_url?: string | null;
  telegram_url?: string | null;
  facebook_url?: string | null;
  dollar_handle?: string | null;
  token_name?: string | null;
  supply?: string | null;
  has_seen_welcome_card?: boolean | null;
  updated_at: string;
}

interface Skill {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
}

interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  skills?: Pick<Skill, 'id' | 'name' | 'category'>;
}

interface ColorScheme {
  bgColor: string;
  textColor: string;
  borderColor: string;
}

interface Team {
  id: string;
  name: string;
  slug: string | null;
  icon_name: string | null;
  color_scheme: ColorScheme | null;
}

// Keep getSkillBadgeStyle or import if shared
// For now, let's assume it might be used in a SkillBadge component later, but keep it here if its only purpose is data transformation.
// Let's move it to a shared utility or keep it in the skills component if not used in the hook.
// Since the hook only deals with fetching/managing skills, the styling logic probably shouldn't be here.
// It is currently used in UserSkills.tsx, so it should stay there or be moved to a shared place if other components need it.

export default function useProfileData() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const pathname = usePathname() ?? ''; // Ensure pathname is not null
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Add a ref to track if initial data has been fetched
  const hasFetchedInitialData = useRef(false);

  const [newUsername, setNewUsername] = useState<string>('');
  const [newDisplayName, setNewDisplayName] = useState<string>('');
  const [newFullName, setNewFullName] = useState<string>('');
  const [newBio, setNewBio] = useState<string>('');
  const [newWebsiteUrl, setNewWebsiteUrl] = useState<string>('');
  const [newTwitterUrl, setNewTwitterUrl] = useState<string>('');
  const [newLinkedInUrl, setNewLinkedInUrl] = useState<string>('');
  const [newGitHubUrl, setNewGitHubUrl] = useState<string>('');
  const [newInstagramUrl, setNewInstagramUrl] = useState<string>('');
  const [newDiscordUrl, setNewDiscordUrl] = useState<string>('');
  const [newPhoneWhatsapp, setNewPhoneWhatsapp] = useState<string>('');
  const [newTikTokUrl, setNewTikTokUrl] = useState<string>('');
  const [newTelegramUrl, setNewTelegramUrl] = useState<string>('');
  const [newFacebookUrl, setNewFacebookUrl] = useState<string>('');
  const [newDollarHandle, setNewDollarHandle] = useState<string>('');
  const [newTokenName, setNewTokenName] = useState<string>('');
  const [newSupply, setNewSupply] = useState<string>('1,000,000,000');

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isUploadingAvatar, setIsUploadingAvatar] = useState<boolean>(false);
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null);

  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [userSkillIds, setUserSkillIds] = useState<Set<string>>(new Set());
  const [loadingSkills, setLoadingSkills] = useState<boolean>(true);
  const [savingSkills, setSavingSkills] = useState<boolean>(false);

  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [loadingUserTeams, setLoadingUserTeams] = useState<boolean>(true);
  const [errorUserTeams, setErrorUserTeams] = useState<string | null>(null);

  const [customSkillInput, setCustomSkillInput] = useState<string>('');
  const [skillChoiceInAdder, setSkillChoiceInAdder] = useState<string>('');
  const [showWelcomeCard, setShowWelcomeCard] = useState<boolean>(true);

  // Moved loadProfileAndSkills to top level of the custom hook
  const loadProfileAndSkills = useCallback(async (currentUserParam: User, currentPathname: string) => {
    if (!currentUserParam?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    let fetchedProfileData: Profile | null = null;

    try {
      // Step 1: Fetch Basic Profile Data
      console.log('[useProfileData] Fetching basic profile data for user:', currentUserParam.id);
      const { data: rawProfileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUserParam.id)
        .single();

      if (profileError) {
        console.error('[useProfileData] Error fetching profile:', profileError);
        setError('Failed to load profile: ' + profileError.message);
        setProfile(null); 
      } else if (rawProfileData) {
        fetchedProfileData = rawProfileData as Profile;
        console.log("[useProfileData] Profile data fetched:", fetchedProfileData);
        setProfile(fetchedProfileData);
        setNewUsername(fetchedProfileData.username || '');
        setNewDisplayName(fetchedProfileData.display_name || '');
        setNewFullName(fetchedProfileData.full_name || '');
        setNewBio(fetchedProfileData.bio || '');
        setNewWebsiteUrl(fetchedProfileData.website_url || '');
        setNewTwitterUrl(fetchedProfileData.twitter_url || '');
        setNewLinkedInUrl(fetchedProfileData.linkedin_url || '');
        setNewGitHubUrl(fetchedProfileData.github_url || '');
        setNewInstagramUrl(fetchedProfileData.instagram_url || '');
        setNewDiscordUrl(fetchedProfileData.discord_url || '');
        setNewPhoneWhatsapp(fetchedProfileData.phone_whatsapp || '');
        setNewTikTokUrl(fetchedProfileData.tiktok_url || '');
        setNewTelegramUrl(fetchedProfileData.telegram_url || '');
        setNewFacebookUrl(fetchedProfileData.facebook_url || '');
        setNewDollarHandle(fetchedProfileData.dollar_handle || '');
        setNewTokenName(fetchedProfileData.token_name || '');
        setNewSupply(fetchedProfileData.supply || '1,000,000,000');
        setShowWelcomeCard(true);
      } else {
        console.warn('[useProfileData] No profile data returned for user (and no error):', currentUserParam.id);
        setProfile(null);
      }

      if (fetchedProfileData) {
        // Step 2: Fetch User's Skills
        console.log('[useProfileData] Fetching user skills for user:', currentUserParam.id);
        const { data: userSkillsData, error: userSkillsError } = await supabase
          .from('user_skills')
          .select(`
            skill_id,
            skills (id, name, category, description)
          `)
          .eq('user_id', currentUserParam.id);

        if (userSkillsError) {
          console.error("[useProfileData] Error fetching user skills:", userSkillsError.message);
          setError(prevError => prevError ? `${prevError} | Failed to load skills: ${userSkillsError.message}` : `Failed to load skills: ${userSkillsError.message}`);
        } else if (userSkillsData) {
          const currentSkillsWithDetails = userSkillsData.map(us => {
            let skillDetail: Skill | null = null;
            if (Array.isArray(us.skills)) {
              if (us.skills.length > 0) {
                skillDetail = us.skills[0] as Skill;
              } else {
                console.warn("[useProfileData] User skill entry found with an empty skills array:", us);
                return null;
              }
            } else if (us.skills) {
              skillDetail = us.skills as Skill;
            } else {
              console.warn("[useProfileData] User skill entry found without corresponding skill detail (us.skills is null/undefined):", us);
              return null;
            }
            if (!skillDetail) return null;
            return {
              id: skillDetail.id,
              name: skillDetail.name,
              category: skillDetail.category || 'Other',
              description: skillDetail.description || ''
            };
          }).filter(Boolean) as Skill[];

          console.log("[useProfileData] User skills processed. Setting selectedSkills and userSkillIds.");
          setSelectedSkills(currentSkillsWithDetails);
          setUserSkillIds(new Set(currentSkillsWithDetails.map(s => s.id)));
        }

        // Step 3: Fetch User's Teams
        console.log("[useProfileData] Fetching user teams for user:", currentUserParam.id);
        try {
          const { data: teamUserEntries, error: teamUserError } = await supabase
            .from('user_team_memberships')
            .select('team_id')
            .eq('user_id', currentUserParam.id);

          if (teamUserError) throw teamUserError;

          if (teamUserEntries && teamUserEntries.length > 0) {
            const teamIds = teamUserEntries.map(entry => entry.team_id);
            const { data: teamsData, error: teamsError } = await supabase
              .from('teams')
              .select('id, name, slug, icon_name, color_scheme')
              .in('id', teamIds);

            if (teamsError) throw teamsError;

            const processedTeamsData = teamsData?.map(team => {
              let parsedColorScheme: ColorScheme | null = null;
              const rawColorScheme = team.color_scheme as unknown;

              if (typeof rawColorScheme === 'string') {
                try {
                  const parsed = JSON.parse(rawColorScheme);
                  if (parsed && typeof parsed.bgColor === 'string' && typeof parsed.textColor === 'string' && typeof parsed.borderColor === 'string') {
                    parsedColorScheme = parsed as ColorScheme;
                  } else {
                    console.warn(`[useProfileData] Parsed color_scheme for team ${team.id} does not match ColorScheme structure:`, parsed);
                    parsedColorScheme = null;
                  }
                } catch (e) {
                  console.warn(`[useProfileData] Failed to parse color_scheme string for team ${team.id}:`, rawColorScheme, e);
                  parsedColorScheme = null;
                }
              } else if (typeof rawColorScheme === 'object' && rawColorScheme !== null) {
                const potentialScheme = rawColorScheme as Partial<ColorScheme>;
                if (
                  typeof potentialScheme.bgColor === 'string' &&
                  typeof potentialScheme.textColor === 'string' &&
                  typeof potentialScheme.borderColor === 'string'
                ) {
                  parsedColorScheme = potentialScheme as ColorScheme;
                } else {
                  console.warn(`[useProfileData] color_scheme for team ${team.id} is an object but not a valid ColorScheme:`, rawColorScheme);
                  parsedColorScheme = null;
                }
              }

              return {
                id: team.id,
                name: team.name,
                slug: team.slug || null,
                icon_name: team.icon_name || 'FaQuestionCircle',
                color_scheme: parsedColorScheme || { bgColor: 'bg-gray-700', textColor: 'text-gray-100', borderColor: 'border-gray-500' },
              };
            }) || [];
            setUserTeams(processedTeamsData);
          } else {
            setUserTeams([]);
          }
        } catch (e: any) {
          console.error("[useProfileData] Error fetching user teams:", e.message);
          setErrorUserTeams(`Failed to load teams: ${e.message}`);
        }
      }

      // Step 4: Fetch All Available Skills for dropdown
      console.log("[useProfileData] Fetching all available skills for dropdown...");
      const { data: allSkillsData, error: allSkillsError } = await supabase
        .from('skills')
          .select('*')
        .order('name', { ascending: true });

      if (allSkillsError) {
          console.error("[useProfileData] Error fetching all skills:", allSkillsError.message);
          setError(prevError => prevError ? `${prevError} | Failed to load skill list: ${allSkillsError.message}` : `Failed to load skill list: ${allSkillsError.message}`);
      } else if (allSkillsData) {
          console.log("[useProfileData] All skills for dropdown fetched successfully.");
          setAllSkills(allSkillsData as Skill[]);
      }

    } catch (e:any) {
      console.error("[useProfileData] Critical error in loadProfileAndSkills:", e.message);
      setError(`An unexpected error occurred: ${e.message}`);
    } finally {
      console.log('[useProfileData] loadProfileAndSkills finished. States set.');
      setLoadingSkills(false);
      setLoadingUserTeams(false);
      setLoading(false);
    }
  // IMPORTANT: Add ALL external variables used inside loadProfileAndSkills to this dependency array
  // This includes supabase, and all the 'setNew...' state setters if they are indeed used inside.
  // For brevity, only supabase shown, but this needs careful checking for correctness.
  }, [supabase, /* setNewUsername, setNewDisplayName, ... all other setters & external vars */]);

  // Effect 1: Fetch initial user and auth state changes
  useEffect(() => {
    let didMount = true;
    setLoading(true);

    const performFetchInitialUser = async () => {
      try {
        const { data: { user: fetchedUser }, error: userError } = await supabase.auth.getUser();

        if (!didMount) return;

        if (userError) {
          console.error("[useProfileData] Error fetching initial user:", userError.message);
          setUser(null);
          setProfile(null);
          setUserTeams([]);
          setAllSkills([]);
          setSelectedSkills([]);
          setUserSkillIds(new Set());
          setError("Failed to authenticate. Please try again.");
          if (didMount) setLoading(false); // Error, stop loading.
          return;
        }

        setUser(fetchedUser); // Set user state (might be null)

        if (fetchedUser) {
          const onAppPageNeedingProfile = (
            (pathname.startsWith('/profile') || pathname.startsWith('/account') || pathname.startsWith('/skills'))
          );

          // If a user is fetched, but their profile isn't loaded yet (profile is null or doesn't match user),
          // AND we are on a page that requires the profile,
          // then the loading process isn't finished yet. The second useEffect will handle loading the profile.
          // In this case, DO NOT set loading to false here.
          if (!(profile && profile.id === fetchedUser.id) && onAppPageNeedingProfile) {
            // Loading remains true, awaiting the second effect to trigger loadProfileAndSkills
          } else {
            // User exists, but either profile is already loaded for this user,
            // or we're not on a page that requires an immediate profile load by this hook.
            // Or, no user was fetched (covered by the 'else' below, but good to be explicit).
            if (didMount) setLoading(false);
          }
        } else {
          // No user fetched. Clear all user-specific data.
          setProfile(null);
          setUserTeams([]);
          setAllSkills([]);
          setSelectedSkills([]);
          setUserSkillIds(new Set());
          setError(null); // No user doesn't mean an error necessarily, just no session.
          if (didMount) setLoading(false); // No user, stop loading.
        }
      } catch (err) {
        if (didMount) {
          console.error("[useProfileData] Exception in performFetchInitialUser:", err);
          setUser(null);
          setProfile(null);
          setUserTeams([]);
          setAllSkills([]);
          setSelectedSkills([]);
          setUserSkillIds(new Set());
          setError("An unexpected error occurred.");
          setLoading(false); // Error, stop loading.
        }
      }
    };

    performFetchInitialUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`[useProfileData] Auth state changed. Event: ${event}`);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (event === 'SIGNED_OUT') {
        console.log('[useProfileData] User signed out. Clearing states.');
        setProfile(null);
        setNewUsername('');
        setNewDisplayName('');
        setNewFullName('');
        setNewBio('');
        setNewWebsiteUrl('');
        setNewTwitterUrl('');
        setNewLinkedInUrl('');
        setNewGitHubUrl('');
        setNewInstagramUrl('');
        setNewDiscordUrl('');
        setNewPhoneWhatsapp('');
        setNewTikTokUrl('');
        setNewTelegramUrl('');
        setNewFacebookUrl('');
        setNewDollarHandle('');
        setNewTokenName('');
        setNewSupply('1,000,000,000');
        setSelectedSkills([]);
        setUserSkillIds(new Set());
        setUserTeams([]);
        setSuccessMessage(null);
        setAvatarUploadError(null);
        setError(null);
        setShowWelcomeCard(true);
        if (pathname !== '/login') router.push('/login');
      } else if (event === 'SIGNED_IN' && currentUser) {
        console.log('[useProfileData] User signed in:', currentUser.id);
      } else if (event === 'USER_UPDATED' && currentUser) {
        console.log('[useProfileData] User updated:', currentUser.id);
      }
      if (!currentUser && event !== 'SIGNED_OUT') {
        console.log('[useProfileData] Session/user became null without explicit SIGNED_OUT. Clearing profile state.');
        setProfile(null);
      }
    });

    return () => {
      didMount = false;
      authListener.subscription?.unsubscribe();
    };
  }, [supabase, pathname, profile]);

  // Effect 2: Load profile data when user/profile/pathname changes
  useEffect(() => {
    console.log('[useProfileData] Effect 2 triggered for profile loading.', { userId: user?.id, profileLoaded: !!profile, pathname });

    if (user?.id && pathname === '/profile' && (!profile || profile.id !== user.id)) {
      console.log(`[useProfileData] User ID ${user.id} present on /profile, profile not loaded or mismatched. Triggering loadProfileAndSkills.`);
      setLoadingSkills(true);
      setLoadingUserTeams(true);
      loadProfileAndSkills(user, pathname); // Now calling the top-level memoized function
    } else if (!user?.id && pathname === '/profile') {
      console.log('[useProfileData] No user ID on /profile. Clearing profile states.');
      setProfile(null);
      setSelectedSkills([]);
      setUserTeams([]);
      setLoading(false);
      setLoadingSkills(false);
      setLoadingUserTeams(false);
    } else if (user?.id && profile && profile.id === user.id && pathname === '/profile') {
      console.log('[useProfileData] Profile already loaded for current user on /profile.');
      setLoading(false); // Ensure loading is false if profile is already correct
      setLoadingSkills(false);
      setLoadingUserTeams(false);
    } else if (user?.id && pathname !== '/profile') {
       console.log('[useProfileData] User is present, but not on /profile. Ensuring loading states are false.');
       setLoading(false);
       setLoadingSkills(false);
       setLoadingUserTeams(false);
    }
  // Add loadProfileAndSkills to the dependency array of this useEffect
  }, [user, profile, pathname, loadProfileAndSkills]); 

  // Function to Handle Skill Toggle
  const handleSkillToggle = async (skillId: string, isCurrentlySelected: boolean) => {
    if (!user) {
      setError("User not found. Please log in again.");
      return;
    }
    setSavingSkills(true); // Indicate that a skill saving operation is in progress

    try {
    if (isCurrentlySelected) {
        // Remove the skill
      const { error: deleteError } = await supabase
        .from('user_skills')
        .delete()
          .match({ user_id: user.id, skill_id: skillId });

      if (deleteError) {
          throw new Error(`Failed to remove skill: ${deleteError.message}`);
        }
        setSelectedSkills(prev => prev.filter(skill => skill.id !== skillId));
        setUserSkillIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(skillId);
          return newSet;
        });
        setSuccessMessage("Skill removed successfully.");
    } else {
        // Add the skill
        const { data: newSkillMapping, error: insertError } = await supabase
        .from('user_skills')
          .insert({ user_id: user.id, skill_id: skillId })
          .select('skill_id, skills(id, name, category, description)') // Select to get details
          .single();

      if (insertError) {
          // Check for unique constraint violation for user_id_skill_id_key
          if (insertError.code === '23505' && insertError.message.includes('user_skills_user_id_skill_id_key')) {
             console.warn("[useProfileData] Attempted to add a skill that's already present (unique constraint violation). Refreshing skills from DB.");
             const skillToAdd = allSkills.find(s => s.id === skillId);
             if (skillToAdd && !userSkillIds.has(skillId)) {
                setSelectedSkills(prev => [...prev, skillToAdd]);
                setUserSkillIds(prev => new Set(prev).add(skillId));
                setSuccessMessage(`Skill '${skillToAdd.name}' was already associated. UI synced.`);
             } else if (skillToAdd) {
                setSuccessMessage(`Skill '${skillToAdd.name}' is already selected.`);
      } else {
                setError("Could not add skill: Skill details not found locally after duplicate error.");
             }
          } else {
            throw new Error(`Failed to add skill: ${insertError.message}`);
          }
        } else if (newSkillMapping && newSkillMapping.skills) {
            let skillDetail: Skill | null = null;
            if (Array.isArray(newSkillMapping.skills)) {
                skillDetail = newSkillMapping.skills.length > 0 ? newSkillMapping.skills[0] as Skill : null;
            } else {
                skillDetail = newSkillMapping.skills as Skill;
            }

            if(skillDetail) {
                setSelectedSkills(prev => [...prev, skillDetail]);
                setUserSkillIds(prev => new Set(prev).add(skillDetail!.id));
                setSuccessMessage("Skill added successfully.");
            } else {
                console.error("[useProfileData] Added skill but couldn't retrieve its details fully:", newSkillMapping);
                setError("Skill added, but details might not be fully displayed. Please refresh.");
                const skillFromAll = allSkills.find(s => s.id === skillId);
                if (skillFromAll) {
                    setSelectedSkills(prev => [...prev, skillFromAll]);
                    setUserSkillIds(prev => new Set(prev).add(skillId));
                }
            }
        } else {
            const skillFromAll = allSkills.find(s => s.id === skillId);
            if (skillFromAll) {
                setSelectedSkills(prev => [...prev, skillFromAll]);
                setUserSkillIds(prev => new Set(prev).add(skillId));
                setSuccessMessage("Skill added successfully (fallback).");
            } else {
                 setError("Failed to add skill: details not found after insert.");
            }
        }
      }
      setError(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("[useProfileData] Error in handleSkillToggle:", err);
      setError(err.message);
      setSuccessMessage(null);
    } finally {
      setSavingSkills(false);
    }
  };

  // Function to Handle Adding Custom Skill
  const handleAddCustomSkill = async (skillName: string) => {
    if (!user) {
      setError('User not authenticated.');
      return;
    }
    if (!skillName) return;

    setSavingSkills(true);
    setError(null);
    setSuccessMessage(null);

    const normalizedSkillName = skillName.trim().toLowerCase();
    const existingSkill = allSkills.find(s => s.name.trim().toLowerCase() === normalizedSkillName);

    if (existingSkill) {
      if (userSkillIds.has(existingSkill.id)) {
        setSuccessMessage(`Skill "${existingSkill.name}" is already added.`);
        setCustomSkillInput('');
        setSavingSkills(false);
        setTimeout(() => setSuccessMessage(null), 2000);
        return;
      } else {
        await handleSkillToggle(existingSkill.id, false);
        setCustomSkillInput('');
        return;
      }
    } else {
      try {
        const { data: newSkillData, error: newSkillError } = await supabase
          .from('skills')
          .insert({ name: skillName.trim(), category: 'User-defined', description: null })
          .select('id, name, category, description')
          .single();

        if (newSkillError) {
          console.error('Error creating new skill:', newSkillError);
          setError(`Failed to create new skill: ${newSkillError.message}`);
          setSavingSkills(false);
          return;
        }

        if (newSkillData) {
          setAllSkills(prevSkills => [...prevSkills, newSkillData]);

          const { error: insertUserSkillError } = await supabase
            .from('user_skills')
            .insert({ user_id: user.id, skill_id: newSkillData.id });

          if (insertUserSkillError) {
            console.error('Error adding new skill to user:', insertUserSkillError);
            setError(`Failed to associate new skill: ${insertUserSkillError.message}`);
            setAllSkills(prevSkills => prevSkills.filter(s => s.id !== newSkillData.id));
          } else {
            setUserSkillIds(prevIds => new Set(prevIds).add(newSkillData.id));
            setSelectedSkills(prevSelectedSkills => [...prevSelectedSkills, newSkillData]);
            setSuccessMessage(`Custom skill "${newSkillData.name}" added!`);
            setCustomSkillInput('');
          }
        }
      } catch (e) {
        console.error("Unexpected error in handleAddCustomSkill:", e);
        setError("An unexpected error occurred while adding the custom skill.");
      } finally {
        setSavingSkills(false);
        setTimeout(() => { if (!error && !successMessage) setSuccessMessage(null); }, 2000);
      }
    }
  };

  // Simplified Avatar Upload Function
  const handleSimpleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('[useProfileData] handleSimpleAvatarUpload Function triggered.');
    console.log('[useProfileData] User object:', user);

    if (!user) {
      setAvatarUploadError('User not authenticated.');
      console.log('[useProfileData] Exiting: User not authenticated.');
      return;
    }
    const file = event.target.files?.[0];
    console.log('[useProfileData] File object:', file);

    if (!file) {
      setAvatarUploadError('No file selected.');
      console.log('[useProfileData] Exiting: No file selected.');
      return;
    }

    setIsUploadingAvatar(true);
    setAvatarUploadError(null);
    setSuccessMessage(null);
    console.log('[useProfileData] Starting upload process...');

    const fileExt = file.name.split('.').pop();
    const filePath = `public/${user.id}/avatar.${fileExt}`;

    try {
      const commonExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
      for (const ext of commonExtensions) {
        await supabase.storage.from('avatars').remove([`public/${user.id}/avatar.${ext}`]);
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      console.log('[useProfileData] publicUrlData from getPublicUrl (original filePath):', publicUrlData);

      if (!publicUrlData?.publicUrl) throw new Error('Could not get public URL for avatar.');

      let finalPublicUrl = publicUrlData.publicUrl;

      const newPublicAvatarUrl = `${finalPublicUrl}?t=${new Date().getTime()}`; // Cache busting
      console.log('[useProfileData] newPublicAvatarUrl to be stored:', newPublicAvatarUrl);

      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({ avatar_url: newPublicAvatarUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (profileUpdateError) throw profileUpdateError;

      setProfile(prev => prev ? { ...prev, avatar_url: newPublicAvatarUrl } : null);
      setSuccessMessage('Avatar updated successfully!');

      if (user) {
        const { data: updatedUserData, error: updateUserError } = await supabase.auth.updateUser({
          data: { avatar_url: newPublicAvatarUrl }
        });

        if (updateUserError) {
          console.error('[useProfileData][handleSimpleAvatarUpload] Error updating user auth metadata with new avatar_url:', updateUserError.message);
        } else {
          console.log('[useProfileData][handleSimpleAvatarUpload] Successfully updated user auth metadata with new avatar_url:', updatedUserData);
        }
      }

    } catch (error: any) {
      console.error('[useProfileData] Error during upload process:', error);
      setAvatarUploadError(`Upload failed: ${error.message}`);
      setSuccessMessage(null);
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = '';
      setTimeout(() => {
        setSuccessMessage(null);
        setAvatarUploadError(null);
      }, 3000);
    }
  };

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !profile) {
      setError("User or profile not loaded.");
      setSaving(false);
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    let sanitizedUsername = newUsername.trim().toLowerCase();
    sanitizedUsername = sanitizedUsername.replace(/\s+/g, '_');
    sanitizedUsername = sanitizedUsername.replace(/[^a-z0-9_]/g, '');
    sanitizedUsername = sanitizedUsername.replace(/^_+|_+$/g, '');

    if (!sanitizedUsername || sanitizedUsername.length < 3) {
      setError('Username must be at least 3 characters long after sanitization (letters, numbers, underscores only).');
      setSaving(false);
      return;
    }
    if (sanitizedUsername.length > 20) {
      setError('Username cannot exceed 20 characters after sanitization.');
      setSaving(false);
      return;
    }

    const updates: ProfileForUpdate = {
      username: sanitizedUsername,
      display_name: newDisplayName.trim() || sanitizedUsername,
      full_name: newFullName.trim() || null,
      bio: newBio.trim() || null,
      website_url: newWebsiteUrl.trim() || null,
      twitter_url: newTwitterUrl.trim() || null,
      linkedin_url: newLinkedInUrl.trim() || null,
      github_url: newGitHubUrl.trim() || null,
      instagram_url: newInstagramUrl.trim() || null,
      discord_url: newDiscordUrl.trim() || null,
      phone_whatsapp: newPhoneWhatsapp.trim() || null,
      tiktok_url: newTikTokUrl.trim() || null,
      telegram_url: newTelegramUrl.trim() || null,
      facebook_url: newFacebookUrl.trim() || null,
      dollar_handle: newDollarHandle.trim() || null,
      token_name: newTokenName.trim() || null,
      supply: newSupply.trim() || null,
      has_seen_welcome_card: profile.has_seen_welcome_card,
      updated_at: new Date().toISOString(),
    };

    if (newInstagramUrl !== (profile?.instagram_url || '')) updates.instagram_url = newInstagramUrl;
    if (newDiscordUrl !== (profile?.discord_url || '')) updates.discord_url = newDiscordUrl;
    if (newPhoneWhatsapp !== (profile?.phone_whatsapp || '')) updates.phone_whatsapp = newPhoneWhatsapp;
    if (newTikTokUrl !== (profile?.tiktok_url || '')) updates.tiktok_url = newTikTokUrl;
    if (newTelegramUrl !== (profile?.telegram_url || '')) updates.telegram_url = newTelegramUrl;
    if (newFacebookUrl !== (profile?.facebook_url || '')) updates.facebook_url = newFacebookUrl;
    if (newDollarHandle !== (profile?.dollar_handle || '')) updates.dollar_handle = newDollarHandle;
    if (newTokenName !== (profile?.token_name || '')) updates.token_name = newTokenName;
    if (newSupply !== (profile?.supply || '')) updates.supply = newSupply;

    const { error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      setError(`Failed to update profile: ${updateError.message}. Username might be taken or some fields invalid.`);
    } else {
      setProfile(prevProfile => {
        if (!prevProfile) return null;
        const updatedProfileState: Profile = {
          ...prevProfile,
          username: updates.username !== undefined ? updates.username : prevProfile.username,
          display_name: updates.display_name !== undefined ? updates.display_name : prevProfile.display_name,
          full_name: updates.full_name !== undefined ? updates.full_name : prevProfile.full_name,
          bio: updates.bio !== undefined ? updates.bio : prevProfile.bio,
          website_url: updates.website_url !== undefined ? updates.website_url : prevProfile.website_url,
          twitter_url: updates.twitter_url !== undefined ? updates.twitter_url : prevProfile.twitter_url,
          linkedin_url: updates.linkedin_url !== undefined ? updates.linkedin_url : prevProfile.linkedin_url,
          github_url: updates.github_url !== undefined ? updates.github_url : prevProfile.github_url,
          instagram_url: updates.instagram_url !== undefined ? updates.instagram_url : prevProfile.instagram_url,
          discord_url: updates.discord_url !== undefined ? updates.discord_url : prevProfile.discord_url,
          phone_whatsapp: updates.phone_whatsapp !== undefined ? updates.phone_whatsapp : prevProfile.phone_whatsapp,
          tiktok_url: updates.tiktok_url !== undefined ? updates.tiktok_url : prevProfile.tiktok_url,
          telegram_url: updates.telegram_url !== undefined ? updates.telegram_url : prevProfile.telegram_url,
          facebook_url: updates.facebook_url !== undefined ? updates.facebook_url : prevProfile.facebook_url,
          dollar_handle: updates.dollar_handle !== undefined ? updates.dollar_handle : prevProfile.dollar_handle,
          token_name: updates.token_name !== undefined ? updates.token_name : prevProfile.token_name,
          supply: updates.supply !== undefined ? updates.supply : prevProfile.supply,
        };
        return updatedProfileState;
      });
      setNewUsername(updates.username || '');
      setNewDisplayName(updates.display_name || '');
      setNewFullName(updates.full_name || '');
      setNewBio(updates.bio || '');
      setNewWebsiteUrl(updates.website_url || '');
      setNewTwitterUrl(updates.twitter_url || '');
      setNewLinkedInUrl(updates.linkedin_url || '');
      setNewGitHubUrl(updates.github_url || '');
      setNewInstagramUrl(updates.instagram_url || '');
      setNewDiscordUrl(updates.discord_url || '');
      setNewPhoneWhatsapp(updates.phone_whatsapp || '');
      setNewTikTokUrl(updates.tiktok_url || '');
      setNewTelegramUrl(updates.telegram_url || '');
      setNewFacebookUrl(updates.facebook_url || '');
      setNewDollarHandle(updates.dollar_handle || '');
      setNewTokenName(updates.token_name || '');
      setNewSupply(updates.supply || '1,000,000,000');
      setSuccessMessage('Profile updated successfully!');
    }
    setSaving(false);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const onLinkedInUrlChange = (e: ChangeEvent<HTMLInputElement>) => setNewLinkedInUrl(e.target.value);
  const onGitHubUrlChange = (e: ChangeEvent<HTMLInputElement>) => setNewGitHubUrl(e.target.value);
  const onInstagramUrlChange = (e: ChangeEvent<HTMLInputElement>) => setNewInstagramUrl(e.target.value);
  const onDiscordUrlChange = (e: ChangeEvent<HTMLInputElement>) => setNewDiscordUrl(e.target.value);
  const onPhoneWhatsappChange = (e: ChangeEvent<HTMLInputElement>) => setNewPhoneWhatsapp(e.target.value);
  const onTikTokUrlChange = (e: ChangeEvent<HTMLInputElement>) => setNewTikTokUrl(e.target.value);
  const onTelegramUrlChange = (e: ChangeEvent<HTMLInputElement>) => setNewTelegramUrl(e.target.value);
  const onFacebookUrlChange = (e: ChangeEvent<HTMLInputElement>) => setNewFacebookUrl(e.target.value);
  const onDollarHandleChange = (e: ChangeEvent<HTMLInputElement>) => setNewDollarHandle(e.target.value);
  const onTokenNameChange = (e: ChangeEvent<HTMLInputElement>) => setNewTokenName(e.target.value);
  const onSupplyChange = (e: ChangeEvent<HTMLInputElement>) => setNewSupply(e.target.value);

  const handleDismissWelcomeCard = async () => {
    // if (!user || !profile) return; // User/profile check might still be relevant if it were to interact with DB
    // if (profile.has_seen_welcome_card) { // This check is based on DB field, not needed if always showing or local dismiss only
    //   setShowWelcomeCard(false); return;
    // }
    // try {
      // const { error: updateError } = await supabase
      //   .from('profiles')
      //   .update({ has_seen_welcome_card: true, updated_at: new Date().toISOString() })
      //   .eq('id', user.id);
      // if (updateError) throw updateError;
      // setProfile(prev => prev ? { ...prev, has_seen_welcome_card: true } : null);
      setShowWelcomeCard(false); // Allow local dismiss for the session
      console.log("[useProfileData] Welcome card dismissed locally for this session.");
      // setSuccessMessage('Welcome card dismissed.');
      // setTimeout(() => setSuccessMessage(null), 3000);
    // } catch (err: any) { setError('Failed to update welcome card status.'); }
  };

  return {
    user,
    profile,
    newUsername,
    newDisplayName,
    newFullName,
    newBio,
    newWebsiteUrl,
    newTwitterUrl,
    newLinkedInUrl,
    newGitHubUrl,
    newInstagramUrl,
    newDiscordUrl,
    newPhoneWhatsapp,
    newTikTokUrl,
    newTelegramUrl,
    newFacebookUrl,
    newDollarHandle,
    newTokenName,
    newSupply,
    loading,
    saving,
    error,
    successMessage,
    isUploadingAvatar,
    avatarUploadError,
    allSkills,
    selectedSkills,
    userSkillIds,
    loadingSkills,
    savingSkills,
    userTeams,
    loadingUserTeams,
    errorUserTeams,
    customSkillInput,
    skillChoiceInAdder,
    showWelcomeCard,
    setNewUsername,
    setNewDisplayName,
    setNewFullName,
    setNewBio,
    setNewWebsiteUrl,
    setNewTwitterUrl,
    setNewLinkedInUrl,
    setNewGitHubUrl,
    setNewInstagramUrl,
    setNewDiscordUrl,
    setNewPhoneWhatsapp,
    setNewTikTokUrl,
    setNewTelegramUrl,
    setNewFacebookUrl,
    setNewDollarHandle,
    setNewTokenName,
    setNewSupply,
    setCustomSkillInput,
    setSkillChoiceInAdder,
    onLinkedInUrlChange,
    onGitHubUrlChange,
    onInstagramUrlChange,
    onDiscordUrlChange,
    onPhoneWhatsappChange,
    onTikTokUrlChange,
    onTelegramUrlChange,
    onFacebookUrlChange,
    onDollarHandleChange,
    onTokenNameChange,
    onSupplyChange,
    handleUpdateProfile,
    handleSimpleAvatarUpload,
    handleSkillToggle,
    handleAddCustomSkill,
    handleDismissWelcomeCard,
  };
} 