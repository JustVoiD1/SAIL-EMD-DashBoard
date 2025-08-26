import { Project1 } from '@/lib/types'
import React, { useState, useEffect } from 'react'



const SearchBar = ({ setResults }: { setResults: React.Dispatch<React.SetStateAction<Project[]>> }) => {
    const [inputVal, setInputVal] = useState("");
    const [allProjects, setAllProjects] = useState<Project1[]>([]); // Store all projects from API
    const [isLoading, setIsLoading] = useState(false);

    // Initialize with all projects on component mount
    // useEffect(() => {
    //     setResults(projectArray);
    // }, [setResults]);


    useEffect(() => {
        fetchProjects();
    }, [])


    const searchProjects = (inputVal: string) => {
        if (inputVal.trim() == '' || !inputVal) {
            setResults(allProjects); // Fix: Always call setResults
            return;
        } else {
            const inputLower = inputVal.toLowerCase();
            const filteredresults = allProjects.filter((proj) => {
                return (proj
                    && proj.title
                    && proj.title.toLowerCase().includes(inputLower)
                )
            })

            // console.log("results fetched from api")

            setResults(filteredresults)
        }
    }

    const fetchProjects = async () => {
        setIsLoading(true);
        try {

            const token = localStorage.getItem('token');

            if(!token){
                throw new Error('No token found');
            }
            const response = await fetch('/api/projects', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },

            });

            if(!response.ok){
                if(response.status === 401){
                    //token expired, redirected to signin
                    localStorage.removeItem('token');
                    window.location.href = '/signin';
                    return;
                }
                throw new Error('Failed Fetching projects')
            }

            const results = await response.json();

            if(results.success && results.projects ){
                setAllProjects(results.projects);
                setResults(results.projects);
                
            }
            else{
                console.error('API error', results.error)

                setAllProjects([])
                setResults([])
            }


        } catch (error) {
            console.error('Error fetching projects:', error);
            // Fallback to local array if API fails
            setAllProjects([]);
            setResults([]);
        } finally {
            setIsLoading(false);
        }

    }


    const handleChange = (value: any) => {
        setInputVal(value)
        searchProjects(value)

    }


    return (
        <input
            type="text"
            placeholder="Search projects..."
            value={inputVal}
            className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            onChange={e => handleChange(e.target.value)}

        />
    )
}

export default SearchBar