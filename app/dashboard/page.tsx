'use client'
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProjectCard from '../components/ProjectCard';
import GlobalStatCard from '../components/GlobalStatCard';
import { Project } from '@/lib/types';
import SearchBar from '../components/SearchBar';
import SearchResultList from '../components/SearchResultList';
import AddProjectModal from '../components/AddProjectModal';
import CreateIcon from '../components/Icons/CreateIcon';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [results, setResults] = useState<Project[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const imagesize = 50


  const globalStatsArray = [
    {
      id: 1,
      title: 'Total',
      value: results.length,
      imageURL: '/icons/TotalIcon.svg'
    },
    {
      id: 2,
      title: 'Ongoing',
      value: results.filter((item) => item['progress'] < 100
      ).length,
      imageURL: '/icons/OngoingIcon.svg'
    },
    {
      id: 3,
      title: 'Completed',
      value: results.filter((it => it['progress'] === 100)).length,
      imageURL: '/icons/CompletedIcon.svg'
    },
    // {
    //   id: 4,
    //   title: 'Delivery Rate',
    //   value: "86%",
    //   imageURL: '/icons/SuccessRateIcon.svg'
    // },

  ]




  const handleProjectAdded = (newProject: any) => {
    setResults(prev => [newProject, ...prev])
  }

  const handleProjectUpdate = (id: number, updatedData: any) => {
    setResults(prev => prev.map(project => 
      project.id === id ? { ...project, ...updatedData } : project
    ))
  }

  const handleProjectDelete = (id: number) => {
    setResults(prev => prev.filter(project => project.id !== id))
  }






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
  }, [router]);

  // Toggle dark mode
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/50">
      {/* Navigation Header */}
      <header className='sticky top-0 z-50'>

        <nav className="bg-card border-b border-border p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Image alt='logo' height={imagesize} width={imagesize} src={'SAIL_logo.svg'} />

            <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-800 bg-clip-text text-transparent text-center flex-1 mx-4">
              EMD SAIL Projects Dashboard
            </h1>

            <div className="flex items-center space-x-2 lg:space-x-4">
              <button
                className="py-3 px-4 text-center text-xs rounded-full bg-background/20 border border-border hover:bg-background/30 transition-all duration-500 hover:scale-110"

              >
                {user.username[0].toUpperCase()}
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

        {/* Global Stats Topbar */}
        <div className="bg-card/50 backdrop-blur-sm border-b border-border">
          <div className="max-w-7xl mx-auto p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search Bar */}
              <div className="flex-shrink-0 lg:w-80">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <SearchBar setResults={setResults} />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <kbd className="inline-flex items-center px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted border border-border rounded">
                      Ctrl+K
                    </kbd>
                  </div>
                </div>
              </div>




              {/* Global Stats */}
              <div className="flex flex-wrap gap-4">
                {globalStatsArray.map((item) => < GlobalStatCard key={item.id} imageURL={item.imageURL} title={item.title} value={item.value} />)}
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-sm transition-colors flex items-center gap-2"
              >
                <CreateIcon/> <span>Create</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard Cards */}
          {/* search results  */}
          {/* {
            projectArray.map((project) => <ProjectCard title={project.title} oneliner={project.oneliner} key={project.id} />)
          } */}
          <SearchResultList 
            results={results} 
            onProjectUpdate={handleProjectUpdate}
            onProjectDelete={handleProjectDelete}
          />


          {/* <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Reports
            </h3>
            <p className="text-muted-foreground">
              Generate and download reports
            </p>
            <div className="mt-4 h-20 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">Reports Placeholder</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Settings
            </h3>
            <p className="text-muted-foreground">
              Manage your account settings
            </p>
            <div className="mt-4 h-20 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">Settings Placeholder</span>
            </div>
          </div> */}
        </div>


      </main>
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProjectAdded={handleProjectAdded}
      />
    </div>

  );
}

