import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import TopBar from './TopBar';

const StickyHeader = () => {
      const router = useRouter();
    
    const [user, setUser] = useState<any>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
        <TopBar
        isLoading={isLoading}
        user={user}
        handleLogout={handleLogout}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        />

    )
}

export default StickyHeader