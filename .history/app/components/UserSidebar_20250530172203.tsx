'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import getSupabaseBrowserClient from '@/lib/supabase/client'; // Adjust path if needed
import { User } from '@supabase/supabase-js';
import {
  FaUserCircle, FaBookOpen, FaTasks, FaCalendarAlt, FaSignOutAlt, FaDollarSign, FaChartLine, FaLightbulb, FaListAlt, FaBullseye, FaChalkboardTeacher, FaRoute, FaSearchDollar, FaProjectDiagram, FaClipboardList, FaUsers,
  FaCamera, FaComments, FaUserSecret, FaCubes, FaUserAlt, FaRobot, FaCog, FaBrain
} from 'react-icons/fa';
import { useAuth } from './Providers';
import { usePageHeader, PageContextType } from '@/app/components/MyCtx'; // Changed import path

interface NavLink {
  href: string;
  title: string;
  icon: React.ElementType;
  current?: boolean;
  activeSubpaths?: string[];
}

// Define navLinks arrays OUTSIDE the component to make them stable constants
export const navLinksPrimaryConst: NavLink[] = [
  {
    href: '/profile',
    icon: FaUserAlt,
    title: 'Profile',
    activeSubpaths: ['/profile/edit'], 
  },
  {
    href: '/skills',
    icon: FaBrain,
    title: 'Skills',
  },
  { title: 'Projects', href: '/myprojects', icon: FaProjectDiagram },
  { title: 'Teams', href: '/team', icon: FaUsers },
  {
    href: '/myagents',
    icon: FaRobot,
    title: 'Agents',
    activeSubpaths: ['/myagents/new', '/myagents/configure'],
  },
  { title: 'Tokens', href: '/mytoken', icon: FaCubes },
  { title: 'Messages', href: '/messages', icon: FaComments },
  { title: 'Diary', href: '/diary', icon: FaBookOpen },
  { title: 'Work In Progress', href: '/workinprogress', icon: FaTasks },
  { title: 'Calendar', href: '/gigs/calendar', icon: FaCalendarAlt },
  { title: 'Finances', href: '/finances', icon: FaDollarSign },
  { title: 'Gigs', href: '/gigs', icon: FaListAlt },
  { title: 'Research', href: '/gigs/research', icon: FaSearchDollar },
  { title: 'Strategy', href: '/gigs/strategy', icon: FaBullseye },
  { title: 'Action Plan', href: '/gigs/action', icon: FaTasks },
  { title: 'Learning Path', href: '/gigs/learning-path', icon: FaChalkboardTeacher },
  { title: 'Platforms', href: '/gigs/platforms', icon: FaListAlt },
  { title: 'Work Path', href: '/gigs/work-path', icon: FaRoute },
];

const navLinksSecondaryConst: NavLink[] = [
  {
    href: '/settings',
    icon: FaCog,
    title: 'Settings',
  },
];

const SUPER_ADMIN_EMAIL = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;

interface UserSidebarProps {
  className?: string; // Added className as an optional prop
}

export default function UserSidebar({ className }: UserSidebarProps) { // Destructure className
  console.log('[UserSidebar] NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL); // Log the env var
  const supabase = getSupabaseBrowserClient(); // Use the shared client
  const pathname = usePathname();
  const { setPageContext } = usePageHeader(); // Use context hook
  const [user, setUser] = useState<User | null>(null);
  const [userInitial, setUserInitial] = useState<string>('');
  const [userDisplayName, setUserDisplayName] = useState<string>('');
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Use the constant arrays for allNavLinks memoization
  const allNavLinks = useMemo(() => [...navLinksPrimaryConst, ...navLinksSecondaryConst], []);
  // Empty dependency array because navLinksPrimaryConst and navLinksSecondaryConst are stable global constants

  useEffect(() => {
    console.log('[UserSidebar] Setting up onAuthStateChange listener.');
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`[UserSidebar] Auth Event: ${event}`, session);
      if (event === 'SIGNED_OUT') {
        console.log('[UserSidebar] SIGNED_OUT event. Clearing user state.');
        setUser(null);
        setUserDisplayName('');
        setUserInitial('');
        setUserAvatarUrl(null);
        setPageContext(null); // Clear page context ONLY on explicit sign out
      } else if (session?.user) {
        console.log('[UserSidebar] User session active (SIGNED_IN, TOKEN_REFRESHED, USER_UPDATED, or INITIAL_SESSION with user). Setting user state.', session.user.id);
        const currentUser = session.user;
        setUser(currentUser);
        // Avatar will be fetched by fetchUserProfile based on user.id
        // UserSidebar doesn't set pageContext here; pages or link clicks should.
      } else if (event === 'INITIAL_SESSION' && !session?.user) {
        // INITIAL_SESSION resolved, but no user. This means user is definitively not logged in.
        // We might still not want to clear pageContext here if a public page has set it,
        // but for app context, this is a state where user-specific context isn't valid.
        // However, ConditionalLayout handles redirection for app pages if not authenticated.
        // Let's leave setPageContext(null) out for now to see if it reduces flashes.
        // If ConditionalLayout correctly gatekeeps app pages, this nullification might be redundant or disruptive.
        console.log('[UserSidebar] INITIAL_SESSION event, no user. User state cleared if necessary by other logic.');
        setUser(null);
        setUserDisplayName('');
        setUserInitial('');
        setUserAvatarUrl(null);
      }
      // Removed the general 'else { setPageContext(null); }' which might have cleared context too often
    });

    const getCurrentSession = async () => {
      console.log('[UserSidebar] Initial session fetch attempt.');
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('[UserSidebar] Error fetching initial session:', error.message);
        setUser(null);
      } else if (session?.user) {
        console.log('[UserSidebar] Initial session found. Setting user:', session.user.id);
        setUser(session.user);
      } else {
        console.log('[UserSidebar] No initial session found.');
        setUser(null);
      }
    };
    getCurrentSession();

    return () => {
      console.log('[UserSidebar] Unsubscribing from onAuthStateChange.');
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [supabase, setPageContext]);

  const fetchUserProfile = useCallback(async (userId: string) => {
    if (!userId) return;
    console.log(`[UserSidebar] Fetching profile for user ID: ${userId}`);
    setIsLoadingProfile(true);
    setUserAvatarUrl(null);

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('display_name, username, avatar_url')
        .eq('id', userId)
        .single();

      if (error) {
        console.error(`[UserSidebar] Error fetching profile for ${userId}:`, error.message);
        const currentUser = supabase.auth.getUser();
        if (currentUser && (await currentUser).data.user?.email) {
          setUserDisplayName((await currentUser).data.user!.email!);
          setUserInitial(((await currentUser).data.user!.email!).charAt(0).toUpperCase());
        } else {
          setUserDisplayName('User (Error)');
          setUserInitial('!');
        }
        setUserAvatarUrl(null);
      } else if (profile) {
        const displayName = profile.display_name || profile.username || user?.email || 'User';
        console.log(`[UserSidebar] Profile fetched for ${userId}:`, displayName, `Avatar URL: ${profile.avatar_url}`);
        setUserDisplayName(displayName);
        setUserInitial(displayName.charAt(0).toUpperCase());
        setUserAvatarUrl(profile.avatar_url || null);
      } else {
        console.log(`[UserSidebar] No profile found for ${userId}, using email as fallback.`);
        if (user?.email) {
            setUserDisplayName(user.email);
            setUserInitial(user.email.charAt(0).toUpperCase());
        } else {
            setUserDisplayName('User (No Profile)');
            setUserInitial('U');
        }
        setUserAvatarUrl(null);
      }
    } catch (e: any) {
      console.error(`[UserSidebar] Exception fetching profile for ${userId}:`, e.message);
      setUserDisplayName('User (Exception)');
      setUserInitial('!');
      setUserAvatarUrl(null);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [supabase, user?.email]);

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile(user.id);
    }
  }, [user?.id, fetchUserProfile]);

  // Subscribe to incoming direct messages for unread count
  useEffect(() => {
    if (!user?.id) return;
    supabase.from('direct_messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', user.id)
      .eq('is_read', false)
      .then(({ count }) => setUnreadCount(count || 0));

    const channel = supabase
      .channel('unread-dm-user-' + user.id)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'direct_messages', filter: `receiver_id=eq.${user.id}` }, 
        () => {
          setUnreadCount(c => c + 1);
        }
      )
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'direct_messages', filter: `receiver_id=eq.${user.id}` }, 
        () => {
          supabase.from('direct_messages')
            .select('*', { count: 'exact', head: true })
            .eq('receiver_id', user.id)
            .eq('is_read', false)
            .then(({ count }) => setUnreadCount(count || 0));
        }
      )
      .subscribe();
    
    return () => {
      // useEffect cleanup must be synchronous. Call unsubscribe and handle promise if necessary.
      channel.unsubscribe().catch(err => console.error('Failed to unsubscribe from channel', err));
    };
  }, [supabase, user?.id]);

  const handleLogout = async () => {
    console.log('[UserSidebar] handleLogout called.');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (supabaseUrl) {
      // Attempt to derive project reference for specific key removal
      try {
        const urlParts = supabaseUrl.split('//');
        if (urlParts.length > 1) {
          const domainParts = urlParts[1].split('.');
          if (domainParts.length > 0) {
            const projectRef = domainParts[0];
            const supabaseAuthTokenKey = `sb-${projectRef}-auth-token`;
            console.log(`[UserSidebar] Attempting to remove specific localStorage item: ${supabaseAuthTokenKey}`);
            localStorage.removeItem(supabaseAuthTokenKey);
          } else {
            console.warn('[UserSidebar] Could not derive projectRef (domain part) from NEXT_PUBLIC_SUPABASE_URL.');
          }
        } else {
          console.warn('[UserSidebar] Could not derive projectRef (protocol part) from NEXT_PUBLIC_SUPABASE_URL.');
        }
      } catch (e) {
        console.error('[UserSidebar] Error parsing NEXT_PUBLIC_SUPABASE_URL for localStorage key:', e);
        // Fallback to generic key removal if parsing failed
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
              console.log(`[UserSidebar] Fallback (parsing error): Removing potential auth token key: ${key}`);
              localStorage.removeItem(key);
          }
        });
      }
    } else {
      console.warn('[UserSidebar] NEXT_PUBLIC_SUPABASE_URL is not defined. Attempting generic localStorage key removal for auth token.');
      // Fallback to generic key removal if URL is not defined
      Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
              console.log(`[UserSidebar] Fallback (URL undefined): Removing potential auth token key: ${key}`);
              localStorage.removeItem(key);
          }
      });
    }

    // Initiate signOut but don't await it here
    supabase.auth.signOut().catch(error => {
      console.error('[UserSidebar] Error during background signOut:', error?.message);
    });

    // Set flag and immediately redirect to the landing page.
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('isLoggingOut', 'true');
    }
    console.log('[UserSidebar] Redirecting to / immediately after initiating signOut.');
    window.location.assign('/'); 
  };

  const currentNavLinks = useMemo(() => {
    // Update the current status of navLinks based on the pathname
    return allNavLinks.map(link => ({
      ...link,
      current: link.href === '/profile' ? (pathname?.startsWith('/profile') ?? false) : pathname === link.href,
    }));
  }, [pathname, allNavLinks]);

  // Update page context when navigation links are clicked
  // This assumes that pages themselves will also set their context if they need to override
  const handleLinkClick = useCallback((link: NavLink) => {
    setPageContext({ title: link.title, href: link.href, icon: link.icon });
  }, [setPageContext]);

  // Effect to update pageContext based on current path and available navLinks
  useEffect(() => {
    // Use pathname directly, ensuring it's not null for comparisons
    const currentPath = pathname ?? ''; 
    const activeLink = allNavLinks.find(link => currentPath === link.href);
    if (activeLink) {
      setPageContext({ title: activeLink.title, href: activeLink.href, icon: activeLink.icon });
    }
  }, [pathname, allNavLinks, setPageContext]);

  if (!user && pathname !== '/login' && pathname !== '/signup') {
    return null; 
  }
  
  if (!user) { // If still no user after the above, and on login/signup, also don't render sidebar.
      // This case might be redundant if ConditionalLayout handles session properly already,
      // but good for direct navigation to /login or /signup if UserSidebar were somehow rendered.
      return null;
  }

  return (
    <div className={`flex flex-col h-full w-64 bg-black text-white ${className}`}>
      {/* User Info Section */}
      <div className="px-6 py-4 border-b border-gray-700">
        <div className="flex items-center mb-3">
          {userAvatarUrl ? (
            <img src={userAvatarUrl} alt="User Avatar" className="w-12 h-12 rounded-full mr-3 border-2 border-gray-700" />
          ) : (
            <div className="w-12 h-12 rounded-full mr-3 bg-gray-700 flex items-center justify-center text-white text-xl font-semibold border-2 border-gray-600">
              {userInitial || 'U'}
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold text-white truncate">{userDisplayName || 'Loading...'}</h2>
            {user && <p className="text-xs text-gray-500">Online</p>}
          </div>
        </div>
      </div>

      {/* Primary Nav Links */}
      <nav className="flex-grow px-3 py-4 space-y-0.5 overflow-y-auto">
        {navLinksPrimaryConst.map((link) => {
          const isCurrent = pathname === link.href || (link.href !== '/profile' && (pathname?.startsWith(link.href) ?? false));
          return (
            <Link
              key={link.title}
              href={link.href}
              className={`flex items-center px-2.5 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out 
                          ${isCurrent 
                            ? 'bg-gray-800 text-white' 
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                        `}
            >
              <link.icon className={`w-5 h-5 mr-3 ${isCurrent ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`} />
              {link.title}
              {link.title === 'My Messages' && unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Secondary Nav Links (like Settings) and Logout */}
      <ul className="mt-auto space-y-1 px-2 py-4 border-t border-gray-700">
        {navLinksSecondaryConst.map((link) => (
          <li key={link.title}>
            <Link href={link.href} legacyBehavior>
              <a
                className={`flex items-center p-2.5 text-sm rounded-md transition-all duration-150 ease-in-out group ${pathname === link.href ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.icon && <link.icon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-sky-400 transition-colors duration-150" />}
                {link.title}
              </a>
            </Link>
          </li>
        ))}
        {/* Logout Button */}
        <li>
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-2.5 text-sm rounded-md font-medium text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 group"
          >
            <FaSignOutAlt className="w-5 h-5 mr-3 text-gray-400 group-hover:text-red-400 transition-colors duration-150" />
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
} 