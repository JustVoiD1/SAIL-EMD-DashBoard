'use client'
import AmountDistributionManager from '@/app/components/AmountDistributionManager';
import MyLoader from '@/app/components/MyLoader';
import StickyHeader from '@/app/components/StickyHeader';
import TodoManager from '@/app/components/TodoManager';
import VideoPlayer from '@/app/components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Project1 } from '@/lib/types';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
// import { Cell, Pie, PieChart, LineChart, BarChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar } from 'recharts';

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

type TooltipPayload = ReadonlyArray<any>;

type Coordinate = {
  x: number;
  y: number;
};

type PieSectorData = {
  percent?: number;
  name?: string | number;
  midAngle?: number;
  middleRadius?: number;
  tooltipPosition?: Coordinate;
  value?: number;
  paddingAngle?: number;
  dataKey?: string;
  payload?: any;
  tooltipPayload?: ReadonlyArray<TooltipPayload>;
};

type GeometrySector = {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
};

type PieLabelProps = PieSectorData &
  GeometrySector & {
    tooltipPayload?: any;
  };


// const BarData = [
//   {
//     name: 'Jan',
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: 'Feb',
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: 'March',
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: 'April',
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   // {
//   //     name: 'May',
//   //     uv: 1890,
//   //     pv: 4800,
//   //     amt: 2181,
//   // },
//   // {
//   //     name: 'June',
//   //     uv: 2390,
//   //     pv: 3800,
//   //     amt: 2500,
//   // },
//   // {
//   //     name: 'July',
//   //     uv: 3490,
//   //     pv: 4300,
//   //     amt: 2100,
//   // },
// ];


// const PieData = [
//   { name: 'Group A', value: 400 },
//   { name: 'Group B', value: 300 },
//   { name: 'Group C', value: 300 },
//   { name: 'Group D', value: 200 },
// ];


// const RADIAN = Math.PI / 180;
// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelProps) => {
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//   const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
//   const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

//   return (
//     <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
//       {`${((percent ?? 1) * 100).toFixed(0)}%`}
//     </text>
//   );
// };




const Page = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project1 | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(project?.status === 'completed');

  let percentage;
  if (!project) percentage = 0;
  else percentage = ((project.bill_released) * 100 / (project.stage_ii_wo)).toFixed(1);

  const handleCompletionToggle = async (checked: boolean) => {
    try {
      const requestBody = {
        title: project?.title,
        description: project?.description || "", // Handle null descriptions
        region: project?.region,
        type: project?.type,
        start_date: project?.start_date,
        end_date: project?.end_date,
        stage_ii_wo: project?.stage_ii_wo,
        bill_released: project?.bill_released,
        remark: project?.remark || "", // Handle null remarks
        status: checked ? 'completed' : 'ongoing'
      };
      console.log('Sending req: ', requestBody);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (response.ok) {

        setIsCompleted(checked);
        setProject(prev => prev ? { ...prev, status: checked ? 'completed' : 'ongoing' } : null);
        alert(checked ? 'Project marked as completed.' : 'Project marked as ongoing.')


      }
      else {
        const error = await response.json();
        alert(error.error || 'Failed to update project status')
      }
    } catch (err) {
      console.error('Error updating project status', err)
      alert('Error updating prject status')
    }
  }



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


  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`/api/projects/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          setProject(data.project)
          setIsCompleted(data.project.status === 'completed')

        }
        else {
          setError('Project not found')

        }
      } catch (err) {
        setError("Failed to Fetch Project")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProject();
    }

  }, [id])

  if (loading) return <MyLoader />
  if (error) return <div>Error : {error}</div>
  if (!project) return <div className='text-center'>Project Not Found</div>


  return (<div className='min-h-screen'>

    <header className='sticky top-0 z-50'>

      <StickyHeader />
      <div className='flex justify-between flex-wrap items-center p-3 bg-background/90 backdrop-blur-md'>
        <div className="flex-1 flex items-center justify-between gap-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">{project.title}</h1>
          <div className="flex gap-6 text-md px-2">
            <div className="flex flex-col">
              <Button variant={'outline'}>
                <Link href={project?.image_url ||  '#'} target='_blank'>Images</Link>
              </Button>
            </div>
            <div className="flex flex-col">
              <Button variant={'outline'}>
                <Link href={project?.video_url ||  '#'} target='_blank'>Videos</Link>
              </Button>
            </div>
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
    </header>

    <div className="bg h-screen w-screen bg-background overflow-y-auto flex flex-col">

      <div className="relative flex-1 p-4 grid grid-cols-12 gap-4 h-full">
        {/* Charts Section - Takes up 8 columns */}
        <div className="col-span-8 grid grid-rows-1 gap-4">
          {/* Both Charts in Top Row */}
          <div className="grid grid-cols-1 border-border gap-4 max-h-fit">
            {/* <div className="grid grid-cols-2 gap-4"> */}
            {/* PieChart */}
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
          <div className="bg-card border border-border rounded-lg p-4">
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

        {/* Project Details Section - Takes up 4 columns */}
        <div className="sticky top-0 col-span-4 min-h-full bg-card border border-border rounded-lg p-4 max-h-fit">

          <div className="sticky top-0 space-y-4 text-sm">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-3 relative">

              <div className="bg-muted/20 rounded col-span-2 p-2 sticky">
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
            <TodoManager projectId={id as string} />


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
        </div>

      </div>
    </div>

  </div>)
}

export default Page