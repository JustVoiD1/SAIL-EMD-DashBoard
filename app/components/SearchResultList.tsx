import { Project } from '@/lib/types'
import React from 'react'
import ProjectCard from './ProjectCard'

//dummy projects


const SearchResultList = ({ results }: { results: Project[] }) => {


    return (
        results.map((result, id) => {
            return <ProjectCard title={result.title} key={id} oneliner={result.oneliner}/>
        })
    )
}

export default SearchResultList