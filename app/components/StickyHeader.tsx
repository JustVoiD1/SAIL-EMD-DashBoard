import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const StickyHeader = () => {
      const router = useRouter();
    
    const [user, setUser] = useState<any>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const imagesize = 50

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);

        if (newDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleLogout = () => {
        // Clear authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        // Redirect to signin
        router.push('/signin');
    };

      useEffect(() => {
        // Initialize dark mode from localStorage or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
          setIsDarkMode(true);
          document.documentElement.classList.add('dark');
        } else {
          setIsDarkMode(false);
          document.documentElement.classList.remove('dark');
        }
    
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
    
        if (!token || !userData) {
          router.push('/signin');
          return;
        }
    
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
          router.push('/signin');
          return;
        }
    
        
        setIsLoading(false);
        // fetch call
      }, [router]);

    return (
        <nav className="bg-card border-b border-border p-4">
            <div className="w-[97vw] mx-auto flex justify-between items-center">
                <Image alt='logo' height={imagesize} width={imagesize} src={'/SAIL_logo.svg'} />

                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-800 bg-clip-text text-transparent text-center flex-1 mx-4">
                    SAIL CMO Estate Management Department
                </h1>

                <div className="flex items-center space-x-2 lg:space-x-4">
                    <button
                        className="py-3 px-4 text-center text-xs rounded-full bg-background/20 border border-border hover:bg-background/30 transition-all duration-500 hover:scale-110"

                    >
                        {/* {user.username[0].toUpperCase()} */}
                        V
                    </button>
                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg bg-background/20 border border-border hover:bg-background/30 transition-all duration-500 hover:scale-110 hover:rotate-12"
                        aria-label="Toggle dark mode"
                    >
                        <div className={`transition-all duration-700 ${isDarkMode ? 'rotate-0' : 'rotate-180'}`}>
                            {isDarkMode ? (
                                <svg className="h-5 w-5 text-foreground transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5 text-foreground transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            )}
                        </div>
                    </button>

                    {/* <span className="text-foreground fixed right-0 top-0 hidden sm:inline">Welcome, {user?.username}</span>
                  <span className="text-foreground fixed right-0 top-0 sm:hidden">Hi, {user?.username}</span> */}
                    <button
                        onClick={handleLogout}
                        className="bg-destructive text-destructive-foreground px-2 py-1 lg:px-4 lg:py-2 rounded-lg hover:bg-destructive/90 transition-colors text-sm lg:text-base"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default StickyHeader