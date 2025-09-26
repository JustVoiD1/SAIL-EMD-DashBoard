import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import Image from 'next/image'
import React from 'react'

const imagesize = 50
interface TopBarProps {
    user: any,
    toggleDarkMode : () => void,
    handleLogout : () => void,
    isLoading: boolean,
    isDarkMode: boolean

}
const TopBar = ({
    user,
    toggleDarkMode,
    isDarkMode,
    handleLogout,
    isLoading

} : TopBarProps

) => {
    

  return (
    <nav className="bg-card border-b border-border p-4 w-full">
          <div className="container mx-auto flex justify-between items-center">
            <Image alt='logo' height={imagesize} width={imagesize} src={'/SAIL_logo.svg'} />

            <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-800 bg-clip-text text-transparent text-center flex-1 mx-4">
              SAIL CMO Estate Management Department
            </h1>

            <div className="flex items-center space-x-2 lg:space-x-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="py-3 px-4 text-center text-foregroud text-xs rounded-full bg-card border border-neutral-300 hover:bg-background/30 transition-all duration-500 hover:scale-110"

                  >
                    { isLoading ? '?' : user?.username[0].toUpperCase()}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isLoading ? '...' : user?.username}</p>
                </TooltipContent>
              </Tooltip>

              {/* Dark Mode Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-lg bg-background/20 border border-neutral-400 hover:bg-background/30 transition-all duration-500 hover:scale-110 hover:rotate-12"
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
                </TooltipTrigger>
                <TooltipContent>
                  <p>Theme Switch</p>
                </TooltipContent>
              </Tooltip>


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

export default TopBar