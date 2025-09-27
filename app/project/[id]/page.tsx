'use client'
import MyLoader from '@/app/components/MyLoader';
import ProjectDetails from '@/app/components/ProjectDetails';
import ProjectHeader from '@/app/components/ProjectHeader';
import ProjectSideBar from '@/app/components/ProjectSideBar';
import StickyHeader from '@/app/components/StickyHeader';
import { Project1 } from '@/lib/types';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
// import { Cell, Pie, PieChart, LineChart, BarChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar } from 'recharts';

// const calculateDeadlineProgress = (startDate: string, completionDate: string): number => {
//   const currentDate = new Date(); // Current date
//   const projectStartDate = new Date(startDate);
//   const projectEndDate = new Date(completionDate);
//   if (projectStartDate == projectEndDate) return 100;

//   const totalDuration = projectEndDate.getTime() - projectStartDate.getTime();
//   const elapsedDuration = currentDate.getTime() - projectStartDate.getTime();

//   let progress = (elapsedDuration / totalDuration) * 100;

//   // Ensure progress is between 0 and 100
//   progress = Math.max(0, Math.min(100, progress));

//   return Math.round(progress);
// };

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
        if(checked) { toast.success('Project marked as completed.')

        }
        else toast.error('Project marked as ongoing.')


      }
      else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update project status')
      }
    } catch (err) {
      console.error('Error updating project status', err)
      toast.error('Error updating prject status')
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
  if (error) return <div className='text-destructive-foreground'>Error : {error}</div>
  if (!project) return <div className='text-center'>Project Not Found</div>


  return (
    <div className='relative h-screen grid grid-cols-12 overflow-auto'>

      <header className='z-40 sticky top-0  col-span-12'>

        <StickyHeader />

        <ProjectHeader
          project={project}
          isCompleted={isCompleted}
          handleCompletionToggle={handleCompletionToggle}
        />
      </header>

      <ProjectDetails
        className="h-full col-span-8 bg-background overflow-y-auto flex flex-col"
        id={id}
        project={project}
      />
      <ProjectSideBar
      className=" h-full bg-card sticky top-0 right-0 col-span-4 max-h-[75vh] border border-border rounded-lg p-4"
        id={id}
        project={project}
      />

    </div>)
}

export default Page