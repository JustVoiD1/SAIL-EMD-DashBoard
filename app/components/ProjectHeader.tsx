import { Button } from '@/components/ui/button'
import { Project1 } from '@/lib/types'
import Link from 'next/link'
import React from 'react'
interface ProjectDetailHeaderProps {
  project: Project1,
  isCompleted: boolean,
  handleCompletionToggle: (checked: boolean) => Promise<void>,
}
const ProjectHeader = ({ project, isCompleted, handleCompletionToggle }: ProjectDetailHeaderProps) => {
  return (
    <div className='flex justify-between flex-wrap items-center p-3 bg-background/90 backdrop-blur-md'>
      <div className="flex-1 flex items-center justify-between gap-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">{project.title}</h1>
        <div className="flex gap-6 text-md px-2">
          {project.image_url &&
            <div className="flex flex-col">
              <Button variant={'outline'}>
                <Link href={project?.image_url} target='_blank'>Images</Link>
              </Button>
            </div>}

          {project.video_url &&
            <div className="flex flex-col">
              <Button variant={'outline'}>
                <Link href={project?.video_url} target='_blank'>Videos</Link>
              </Button>
            </div>
          }
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">Region</span>
            <span className="font-semibold text-blue-600">{project.region}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">Type</span>
            <span className="font-semibold text-purple-600">{project.type}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">WO Amount</span>
            <span className="font-semibold text-green-600">₹{(project.stage_ii_wo).toLocaleString()}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">Bill Released</span>
            <span className="font-semibold text-blue-600">₹{(project.bill_released).toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div className="bg-muted/20 rounded p-3">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={(e) => handleCompletionToggle(e.target.checked)}
            className=" accent-green-400 h-4 w-4 rounded-xl border border-accent-foreground"
          />{isCompleted ? <span className=" my-0 py-1 px-3 rounded-lg font-medium bg-green-500/50 text-foreground text-lg">
            Completed
          </span> : <span className="py-1 my-0 px-3 rounded-lg font-medium bg-yellow-400/50 text-foreground text-lg">
            Ongoing
          </span>
          }
        </label>
      </div>
    </div>
  )
}

export default ProjectHeader