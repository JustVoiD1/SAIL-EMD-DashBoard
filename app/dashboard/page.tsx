'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProjectCard from '../components/ProjectCard';
import GlobalStatCard from '../components/GlobalStatCard';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const imagesize = 50

  const globalStatsArray = [
    {
      id: 1,
      title: 'Total Projects',
      value: 247,
      imageURL: '/icons/TotalIcon.svg'
    },
    {
      id: 2,
      title: 'Ongoing',
      value: 34,
      imageURL: '/icons/OngoingIcon.svg'
    },
    {
      id: 3,
      title: 'Completed',
      value: 213,
      imageURL: '/icons/CompletedIcon.svg'
    },
    {
      id: 4,
      title: 'Success Rate',
      value: 86,
      imageURL: '/icons/SuccessRateIcon.svg'
    },

  ]

  //dummy projects
  const projectArray = [
    {
      id: 1,
      title: 'MIS Environment Portal',
      oneliner: 'Centralized platform for real-time environmental data monitoring'
    },
    {
      id: 2,
      title: 'Zero Liquid Discharge - RSP',
      oneliner: 'Effluent treatment and water recycling system at Rourkela Steel Plant'
    },
    {
      id: 3,
      title: 'Eco-Restoration at KIOM & MIOM',
      oneliner: 'Rehabilitation of mined-out areas through afforestation and land stabilization'
    },
    {
      id: 4,
      title: 'Treatment System-2 (RSP)',
      oneliner: 'Advanced effluent treatment system at Rourkela aiming to treat ~1,900 m³/hr and improve water recycling'
    },
    {
      id: 5,
      title: 'PCB Waste Destruction Facility, Bhilai',
      oneliner: 'Zero Liquid Discharge disposal of ~330 tons/year PCB and PCB‑contaminated oil using Plascon & ITD technologies'
    },
    {
      id: 6,
      title: 'Renewable Energy Installations',
      oneliner: 'Solar & hydro power generation across plants and mines targeting ~384 MW capacity by 2028'
    },
    {
      id: 7,
      title: 'PCB Waste Destruction Facility, Bhilai',
      oneliner: 'Zero Liquid Discharge disposal of ~330 tons/year PCB and PCB‑contaminated oil using Plascon & ITD technologies'
    },
    {
      id: 8,
      title: 'Renewable Energy Installations',
      oneliner: 'Solar & hydro power generation across plants and mines targeting ~384 MW capacity by 2028'
    },
    {
      id: 9,
      title: 'PCB Waste Destruction Facility, Bhilai',
      oneliner: 'Zero Liquid Discharge disposal of ~330 tons/year PCB and PCB‑contaminated oil using Plascon & ITD technologies'
    },
    {
      id: 10,
      title: 'Renewable Energy Installations',
      oneliner: 'Solar & hydro power generation across plants and mines targeting ~384 MW capacity by 2028'
    },
    {
      id: 11,
      title: 'PCB Waste Destruction Facility, Bhilai',
      oneliner: 'Zero Liquid Discharge disposal of ~330 tons/year PCB and PCB‑contaminated oil using Plascon & ITD technologies'
    },
    {
      id: 12,
      title: 'Renewable Energy Installations',
      oneliner: 'Solar & hydro power generation across plants and mines targeting ~384 MW capacity by 2028'
    },
    {
      id: 13,
      title: 'PCB Waste Destruction Facility, Bhilai',
      oneliner: 'Zero Liquid Discharge disposal of ~330 tons/year PCB and PCB‑contaminated oil using Plascon & ITD technologies'
    },
    {
      id: 14,
      title: 'Renewable Energy Installations',
      oneliner: 'Solar & hydro power generation across plants and mines targeting ~384 MW capacity by 2028'
    },
    {
      id: 15,
      title: 'PCB Waste Destruction Facility, Bhilai',
      oneliner: 'Zero Liquid Discharge disposal of ~330 tons/year PCB and PCB‑contaminated oil using Plascon & ITD technologies'
    },
    {
      id: 16,
      title: 'Renewable Energy Installations',
      oneliner: 'Solar & hydro power generation across plants and mines targeting ~384 MW capacity by 2028'
    },
    {
      id: 17,
      title: 'PCB Waste Destruction Facility, Bhilai',
      oneliner: 'Zero Liquid Discharge disposal of ~330 tons/year PCB and PCB‑contaminated oil using Plascon & ITD technologies'
    },
    {
      id: 18,
      title: 'Renewable Energy Installations',
      oneliner: 'Solar & hydro power generation across plants and mines targeting ~384 MW capacity by 2028'
    },
    {
      id: 19,
      title: 'PCB Waste Destruction Facility, Bhilai',
      oneliner: 'Zero Liquid Discharge disposal of ~330 tons/year PCB and PCB‑contaminated oil using Plascon & ITD technologies'
    },
    {
      id: 20,
      title: 'Renewable Energy Installations',
      oneliner: 'Solar & hydro power generation across plants and mines targeting ~384 MW capacity by 2028'
    },
    {
      id: 21,
      title: 'PCB Waste Destruction Facility, Bhilai',
      oneliner: 'Zero Liquid Discharge disposal of ~330 tons/year PCB and PCB‑contaminated oil using Plascon & ITD technologies'
    },
    {
      id: 22,
      title: 'Renewable Energy Installations',
      oneliner: 'Solar & hydro power generation across plants and mines targeting ~384 MW capacity by 2028'
    },


  ]


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
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className='sticky top-0 z-50'>
        <nav className="bg-card border-b border-border p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Image alt='logo' height={imagesize} width={imagesize} src={'SAIL_logo.svg'} />

            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-800 bg-clip-text text-transparent">
              EMD SAIL Projects Dashboard
            </h1>

            <div className="flex items-center space-x-4">
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

              <span className="text-foreground">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-destructive/90 transition-colors"
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
              {/* Global Stats */}
              <div className="flex flex-wrap gap-4">
                {globalStatsArray.map((item) => < GlobalStatCard key={item.id} imageURL={item.imageURL} title={item.title} value={item.value} />)}
              </div>

              {/* Search Bar */}
              <div className="flex-shrink-0 lg:w-80">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search projects..."
                    className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <kbd className="inline-flex items-center px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted border border-border rounded">
                      Ctrl+K
                    </kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard Cards */}
          {
            projectArray.map((project) => <ProjectCard title={project.title} oneliner={project.oneliner} key={project.id} />)
          }


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

        {/* User Information */}
        <div className="mt-8 bg-card border border-border rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            User Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                User ID
              </label>
              <p className="text-foreground font-mono">{user?.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                Username
              </label>
              <p className="text-foreground">{user?.username}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}