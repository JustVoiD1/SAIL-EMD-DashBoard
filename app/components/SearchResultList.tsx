import { Project } from '@/lib/types'
import React from 'react'
import ProjectCard from './ProjectCard'

//dummy projects


const SearchResultList = ({ results, onProjectDelete, onProjectUpdate }: { 
    results: Project[],
    onProjectUpdate? : (id : number, data : any) => void,
    onProjectDelete? : (id : number) => void,
}) => {


    const handleProjectDelete = (id : number) => {
        //remove the project from results and refetch data
        onProjectDelete?.(id)
    }
    const handleProjectUpdate = (id : number, data : any) => {
        //remove the project from results and refetch data
        onProjectUpdate?.(id, data)
    }
    return (
        results.map((project) => {
            return<ProjectCard 
          key={project.id}
          id={project.id}
          title={project.title} 
          oneliner={project.oneliner}
          progress={project.progress || 0}
          created_at={project.created_at || new Date().toISOString()}
          start_date={project.start_date || new Date().toISOString().split('T')[0]}
          end_date={project.end_date || new Date().toISOString().split('T')[0]}
          image_url={project.image_url || ''}
          video_url={project.video_url || ''}
          updated_at={project.updated_at || new Date().toISOString()}
          onUpdate={handleProjectUpdate}
          onDelete={handleProjectDelete} 
            />
        })
    )
}

export default SearchResultList