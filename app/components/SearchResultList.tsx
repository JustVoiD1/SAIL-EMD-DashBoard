import { Project } from '@/lib/types'
import React from 'react'
import ProjectCard from './ProjectCard'

//dummy projects


const SearchResultList = ({ results }: { results: Project[] }) => {


    return (
        results.map((result, id) => {
            return <ProjectCard 
            title={result.title} 
            progress={result.progress} 
            created_at={result.created_at} 
            start_date={result.start_date} 
            end_date={result.end_date}
            //@ts-ignore 
            image_url={result.image_url}
            //@ts-ignore 
            video_url={result.video_url}
            oneliner={result.oneliner}
            updated_at={result.updated_at}
            key={id} 
            />
        })
    )
}

export default SearchResultList