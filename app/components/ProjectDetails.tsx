import React from 'react'
import VideoPlayer from './VideoPlayer'
import AmountDistributionManager from './AmountDistributionManager'
import { Project1 } from '@/lib/types'
import { ParamValue } from 'next/dist/server/request/params'
interface ProjectDetailProps {
    project: Project1,
    id: ParamValue,
    className?: string
}
const ProjectDetails = ({project, id, className}: ProjectDetailProps) => {
  return (
    <main className={className}>

        <div className="relative flex-1 grid grid-cols-12 gap-4 h-full">
          {/* Charts Section - Takes up 8 columns */}
          <div className="col-span-12 grid grid-rows-1 gap-4">
            {/* Both Charts in Top Row */}
            <div className="grid col-span-12 grid-cols-1  border-border gap-4 max-h-fit">
              
              <div className="bg-card border border-border rounded-lg p-3 max-h-fit">
                <AmountDistributionManager projectId={id as string} />
              </div>

              {/* BarChart */}
              {/* <div className="bg-card border border-border rounded-lg p-3">
              <h2 className="text-md font-semibold text-foreground mb-2">Physical Progress</h2>
              <div className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    // width={50}
                    // height={50}
                    data={BarData}
                    margin={{
                      top: 20,
                      right: 50,
                      left: 40,
                      bottom: 20,
                    }}
                    barSize={50}
                  >
                    <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Bar dataKey="pv" fill="#8884d8" background={{ fill: '#eee' }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div> */}
            </div>

            {/* Description Section - Bottom Row */}
            <div className="col-span-12 bg-card border border-border rounded-lg p-4">
              <h2 className="text-lg font-semibold text-foreground mb-3">Project Overview</h2>
              <div className="h-full overflow-y-auto">
                <p className="text-muted-foreground leading-relaxed text-sm mb-4">

                  {project.description || "No description available"}
                </p>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">Remarks:</h3>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• {project.remark}</li>
                  </ul>
                </div>

                <div className='mt-4'>
                  <VideoPlayer title="Project Progress Video" />
                </div>
              </div>
            </div>
          </div>



        </div>
      </main>
  )
}

export default ProjectDetails