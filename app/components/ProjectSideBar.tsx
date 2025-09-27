import { Project1 } from '@/lib/types'
import React from 'react'
import TodoManager from './TodoManager';
import { ParamValue } from 'next/dist/server/request/params';

interface SideBarProps {
    project: Project1,
    id: ParamValue,
    className?:string

}
const ProjectSideBar = ({ project, id, className}: SideBarProps) => {
    
    const calculateDeadlineProgress = (startDate: string, completionDate: string): number => {
        const currentDate = new Date(); // Current date
        const projectStartDate = new Date(startDate);
        const projectEndDate = new Date(completionDate);
        if (projectStartDate == projectEndDate) return 100;

        const totalDuration = projectEndDate.getTime() - projectStartDate.getTime();
        const elapsedDuration = currentDate.getTime() - projectStartDate.getTime();

        let progress = (elapsedDuration / totalDuration) * 100;

        // Ensure progress is between 0 and 100
        progress = Math.max(0, Math.min(100, progress));

        return Math.round(progress);
    };

    return (
        <aside className={className}>

            <div className="space-y-4 text-sm h-full">
                {/* Basic Info */}
                <div className="grid w-full gap-3 relative">
                    {/* Deadline info */}
                    <div className="bg-muted/20 rounded p-2 sticky">
                        <h3 className="font-medium text-foreground text-xs mb-1">Deadline Progress</h3>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>{new Date(project.start_date).toLocaleDateString()}</span>
                            <span>{new Date(project.end_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: `${calculateDeadlineProgress(project.start_date, project.end_date)}%` }}></div>
                            </div>
                            <span className="text-sm font-medium">{calculateDeadlineProgress(project.start_date, project.end_date)}%</span>
                        </div>
                    </div>

                </div>

                {/* Financial Info */}
                <TodoManager
                className='sticky space-y-4" border rounded-md p-2 border-border' 
                projectId={id as string} />


                {/* Timestamps */}
                <div className="space-y-1 pt-2 border-t border-border">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Updated:</span>
                        <span>{new Date(project.updated_at).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Created:</span>
                        <span>{new Date(project.created_at).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default ProjectSideBar