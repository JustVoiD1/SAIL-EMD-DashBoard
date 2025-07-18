import { Project } from '@/lib/types'
import React, { useState, useEffect } from 'react'

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
        title: 'OCEMS & EQMS Expansion',
        oneliner: 'Deployment of continuous emissions and effluent quality monitoring systems across all SAIL units'
    },
    {
        id: 8,
        title: 'Biodiversity Indexing at SAIL Mines',
        oneliner: 'Tracking species diversity and ecological health in restored mining areas'
    },
    {
        id: 9,
        title: 'Fly Ash Brick Utilization',
        oneliner: 'Utilizing fly ash from power plants in the manufacturing of eco-friendly construction bricks'
    },
    {
        id: 10,
        title: 'Slag-based Fertilizer Production',
        oneliner: 'Converting steel slag into usable fertilizer for agricultural applications'
    },
    {
        id: 11,
        title: 'Rainwater Harvesting Initiatives',
        oneliner: 'Installation of rainwater harvesting structures at major plants for groundwater recharge'
    },
    {
        id: 12,
        title: 'Greenbelt Development Program',
        oneliner: 'Plantation drives around steel plant perimeters to enhance air quality and biodiversity'
    },
    {
        id: 13,
        title: 'Sentra.World Carbon Tracking Pilot',
        oneliner: 'Pilot project with Durgapur Plant to track and analyze CO₂ emissions digitally'
    },
    {
        id: 14,
        title: 'E-Waste Management Policy Implementation',
        oneliner: 'Safe disposal and tracking of electronic waste generated in offices and IT systems'
    },
    {
        id: 15,
        title: 'Effluent Treatment Revamp – BSP',
        oneliner: 'Upgradation of treatment facilities at Bhilai Steel Plant to meet CPCB standards'
    },
    {
        id: 16,
        title: 'Mine Water Reuse at Gua Ore Mines',
        oneliner: 'Treating mine discharge for use in beneficiation and plantation'
    },
    {
        id: 17,
        title: 'Real-time Sustainability Reporting Tool',
        oneliner: 'Developing software to auto-generate ESG compliance reports for internal and external audits'
    },
    {
        id: 18,
        title: 'Carbon Neutrality Strategy 2030',
        oneliner: 'Long-term framework for decarbonization and net-zero transition across all SAIL units'
    },
    {
        id: 19,
        title: 'Online Hazardous Waste Tracking System',
        oneliner: 'Digital tracking of hazardous waste from generation to disposal across plants'
    },
    {
        id: 20,
        title: 'Ash Dyke Remediation – Durgapur',
        oneliner: 'Rehabilitation of old ash dykes to prevent groundwater contamination'
    },
    {
        id: 21,
        title: 'Green Supply Chain Audits',
        oneliner: 'Evaluating environmental performance of contractors and material suppliers'
    },
    {
        id: 22,
        title: 'Low-NOx Burner Installation',
        oneliner: 'Reducing NOx emissions through upgraded burners in reheating furnaces'
    }
]

const SearchBar = ({ setResults }: { setResults: React.Dispatch<React.SetStateAction<Project[]>> }) => {
    const [inputVal, setInputVal] = useState("");
    const [allProjects, setAllProjects] = useState<Project[]>([]); // Store all projects from API
    const [isLoading, setIsLoading] = useState(false);

    // Initialize with all projects on component mount
    useEffect(() => {
        setResults(projectArray);
    }, [setResults]);


    useEffect(() => {
        fetchProjects();
    }, [])


    const searchProjects = (inputVal: string) => {
        if (inputVal.trim() == '' || !inputVal) {
            setResults(projectArray); // Fix: Always call setResults
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
            const response = await fetch('/api/projects', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },

            });

            if(!response.ok){
                throw new Error('Failed Fetching projects')
            }

            const results = await response.json();

            if(results.success && results.projects ){
                setAllProjects(results.projects);
                setResults(results.projects);
                
            }
            else{
                console.error('API error', results.error)

                setAllProjects(projectArray)
                setResults(projectArray)
            }


        } catch (error) {
            console.error('Error fetching projects:', error);
            // Fallback to local array if API fails
            setAllProjects(projectArray);
            setResults(projectArray);
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