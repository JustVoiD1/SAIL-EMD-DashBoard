'use client'
import React, { useEffect, useState } from 'react'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



const data = [
    {
        name: 'Jan',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Feb',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'March',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'April',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'May',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'June',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'July',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];

export default function DemoProject() {


    const [isDarkMode, setIsDarkMode] = useState(false);

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
    }, []);

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



    return (
        <div className="min-h-screen bg-background overflow-x-hidden">
            <header className='w-full flex items-center justify-between px-4 py-3'>
                <h1 className="text-xl md:text-2xl font-bold text-foreground flex-1 text-center">Project Title</h1>
                {/* theme switch */}
                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-lg bg-background/20 border border-border hover:bg-background/30 transition-all duration-500 hover:scale-110 hover:rotate-12 flex-shrink-0"
                    aria-label="Toggle dark mode"
                >
                    <div className={`transition-all duration-700 ${isDarkMode ? 'rotate-0' : 'rotate-180'}`}>
                        {isDarkMode ? (
                            <svg className="h-5 w-5 text-foreground transition-all duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>

                        ) : (
                            <svg className="h-5 w-5 text-foreground transition-all duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        )}
                    </div>
                </button>
            </header>
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Chart Section */}
                    <div className="w-full lg:w-1/2 bg-card border border-border rounded-xl p-4 md:p-6 shadow-lg">
                        <h2 className="text-lg font-semibold text-foreground mb-4">Project Analytics</h2>
                        <div className="w-full aspect-[4/3] min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                width={500}
                                height={300}
                                data={data}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="w-full lg:w-1/2 bg-card border border-border rounded-xl p-4 md:p-6 shadow-lg">
                        <h2 className="text-lg font-semibold text-foreground mb-4">Project Overview</h2>
                        <div className="space-y-4 text-muted-foreground">
                            <p className="leading-relaxed">
                                The Zero Liquid Discharge project at Rourkela Steel Plant represents a comprehensive 
                                approach to water management and environmental sustainability. This initiative focuses 
                                on treating and recycling all wastewater generated within the plant.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                                <div className="bg-muted/20 rounded-lg p-3">
                                    <h3 className="font-medium text-foreground text-sm">Capacity</h3>
                                    <p className="text-lg font-bold text-primary">1,900 m³/hr</p>
                                </div>
                                <div className="bg-muted/20 rounded-lg p-3">
                                    <h3 className="font-medium text-foreground text-sm">Efficiency</h3>
                                    <p className="text-lg font-bold text-green-600">95%</p>
                                </div>
                                <div className="bg-muted/20 rounded-lg p-3">
                                    <h3 className="font-medium text-foreground text-sm">Status</h3>
                                    <p className="text-lg font-bold text-orange-600">Ongoing</p>
                                </div>
                                <div className="bg-muted/20 rounded-lg p-3">
                                    <h3 className="font-medium text-foreground text-sm">Target</h3>
                                    <p className="text-lg font-bold text-blue-600">Q2 2025</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
