'use client'
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Inputs = {
    username: string,
    password: string,
};
const imagesize : number = 60

export default function SignInModal() {
    const router = useRouter();
    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<Inputs>();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);


    // Initialize dark mode from localStorage or system preference
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }

        const savedUsername = localStorage.getItem('savedUsername');
        const rememberMeEnabled = localStorage.getItem('rememberMe') === "true";
        if(savedUsername && rememberMeEnabled){
            setRememberMe(true);
            setValue("username", savedUsername)
        }
    }, [setValue]);

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

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setIsLoading(true);
        setError(""); // Clear previous errors
        
        const {username, password} = data;

        try {
            const response = await fetch('/api/auth/signin', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const result = await response.json();
            
            

            if(response.ok){
                
                // Store token and user data
                localStorage.setItem("token", result.token);
                localStorage.setItem("user", JSON.stringify(result.user));
                
                // Set cookie for middleware
                const maxAge = rememberMe ? 86400 * 30 : 86400;
                document.cookie = `token=${result.token}; path=/; max-age=${maxAge}; SameSite=Lax`;
                if(rememberMe){
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('savedUsername', username);
                }
                else {
                    localStorage.removeItem('rememberMe');
                    localStorage.removeItem('savedUsername');
                    
                }
                
                // Test if cookie was actually set
                const cookies = document.cookie.split(';');
                // const tokenCookie = cookies.find(c => c.trim().startsWith('token='));

                // Redirect to dashboard
                
                // Add a small delay to ensure cookie is set
                setTimeout(() => {
                    router.push('/dashboard');
                }, 100);
            } else {
                setError(result.error || "Authentication failed");
            }
            
        } catch (error) {
            console.error('SignIn error:', error);
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
        
        
    };

    return (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-card/10 backdrop-blur-lg border border-border rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 transform transition-all duration-300 hover:scale-[1.02]">
                {/* Dark Mode Toggle */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg bg-background/20 border border-border hover:bg-background/30 transition-all duration-300 hover:scale-110 hover:rotate-12"
                        aria-label="Toggle dark mode"
                    >
                        <div className={`transition-all duration-300 ${isDarkMode ? 'rotate-0' : 'rotate-180'}`}>
                            {isDarkMode ? (
                                <svg className="h-5 w-5 text-foreground transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>

                            ) : (
                                <svg className="h-5 w-5 text-foreground transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            )}
                        </div>
                    </button>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <Image alt='logo' height={imagesize} width={imagesize} src={'SAIL_logo.svg'} className="mx-auto"/>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-800 bg-clip-text text-transparent mb-2">
                        SAIL CMO
                    </h2>
                    <p className="text-foreground text-sm">
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-destructive/10 border border-destructive rounded-lg p-3 mb-4">
                        <p className="text-destructive text-sm">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Username Field */}
                    <div className="space-y-2">
                        <label htmlFor="username" className="block text-sm font-medium text-foreground">
                            Username
                        </label>
                        <div className="relative">
                            <input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                {...register("username", {
                                    required: "Username is required",
                                    minLength: {
                                        value: 3,
                                        message: "Username must be at least 3 characters"
                                    }
                                })}
                                className={`w-full px-4 py-3 bg-background/10 border backdrop-blur-sm rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.username ? 'border-destructive focus:ring-destructive' : 'border-border'
                                    }`}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>
                        {errors.username && (
                            <p className="text-destructive text-xs mt-1 animate-pulse">
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-foreground">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                                className={`w-full px-4 py-3 bg-background/10 border backdrop-blur-sm rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12 ${errors.password ? 'border-destructive focus:ring-destructive' : 'border-border'
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200"
                            >
                                {showPassword ? (
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-destructive text-xs mt-1 animate-pulse">
                                {errors.password.message}
                            </p>
                        )}
                    </div>


                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center text-muted-foreground">
                            <input type="checkbox" className="mr-2 rounded border-border" checked={rememberMe}
                                onChange={(e)=>setRememberMe(e.target.checked)}
                            />
                            Remember me
                        </label>
                        {/* <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
              Forgot password?
            </a> */}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform ${isSubmitting || isLoading
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-700 hover:to-blue-900 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
                            }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </div>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Footer */}

            </div>
        </div>
    );
}