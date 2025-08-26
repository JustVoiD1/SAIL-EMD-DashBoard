'use client'
import StickyHeader from '@/app/components/StickyHeader';
import { Project1 } from '@/lib/types';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Cell, Pie, PieChart, LineChart, BarChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar } from 'recharts';


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


const BarData = [
  {
    name: 'Jan',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Feb',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'March',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'April',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  // {
  //     name: 'May',
  //     uv: 1890,
  //     pv: 4800,
  //     amt: 2181,
  // },
  // {
  //     name: 'June',
  //     uv: 2390,
  //     pv: 3800,
  //     amt: 2500,
  // },
  // {
  //     name: 'July',
  //     uv: 3490,
  //     pv: 4300,
  //     amt: 2100,
  // },
];


const PieData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];


const RADIAN = Math.PI / 180;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};



const page = () => {
  const { id } = useParams()
  const [project, setProject] = useState<Project1 | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  let percentage;
  if(!project) percentage = 0;
  else percentage = ((parseInt(project.stage_ii_wo) - parseInt(project.bill_released))*100/parseInt(project.stage_ii_wo)).toFixed(1);



  const [isDarkMode, setIsDarkMode] = useState(false);

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

        }
        else {
          setError('Project not found')

        }
      } catch (err) {
        setError("Failed to Fetch Project")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProject();
    }

  }, [id])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error : {error}</div>
  if (!project) return <div>Project Not Found</div>


  return (<>

   <header>
            <StickyHeader />
            <h1 className="px-3 py-2 text-2xl font-bold text-foreground text-left">{project.title}</h1>

        </header>
        <div className="bg h-screen w-screen bg-background overflow-y-auto flex flex-col">

            <div className="flex-1 p-4 grid grid-cols-12 gap-4 h-full">
                {/* Charts Section - Takes up 8 columns */}
                <div className="col-span-8 grid grid-rows-2 gap-4">
                    {/* Both Charts in Top Row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* PieChart */}
                        <div className="bg-card border border-border rounded-lg p-3">
                            <h2 className="text-md font-semibold text-foreground mb-2">Amount Distribution</h2>
                            <div className="h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={PieData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={120}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {PieData.map((entry, index) => (
                                                <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* BarChart */}
                        <div className="bg-card border border-border rounded-lg p-3">
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
                        </div>
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
                        </div>
                    </div>
                </div>

                {/* Project Details Section - Takes up 4 columns */}
                <div className="col-span-4 bg-card border border-border rounded-lg p-4 overflow-y-auto">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Project Details</h2>

                    <div className="space-y-4 text-sm">
                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-muted/20 rounded p-2">
                                <h3 className="font-medium text-foreground text-xs mb-1">Project ID</h3>
                                <p className="text-primary font-bold">{project.id}</p>
                            </div>
                            <div className="bg-muted/20 rounded p-2">
                                <h3 className="font-medium text-foreground text-xs mb-1">Region</h3>
                                <p className="text-blue-600 font-bold">{project.region}</p>
                            </div>
                            <div className="bg-muted/20 rounded p-2">
                                <h3 className="font-medium text-foreground text-xs mb-1">Type</h3>
                                <p className="text-purple-600 font-bold">{project.type}</p>
                            </div>
                            <div className="bg-muted/20 rounded p-2">
                                <h3 className="font-medium text-foreground text-xs mb-1">Status</h3>
                                <p className="text-orange-600 font-bold">{project.status}</p>
                            </div>
                        </div>

                        {/* Financial Info */}
                        <div className="space-y-2 grid grid-cols-2">
                            <div className="bg-green-50 dark:bg-green-900/20 rounded p-3">
                                <h3 className="font-medium text-foreground text-xs mb-1">Stage II WO Amount</h3>
                                <p className="text-lg font-bold text-green-600">₹{parseInt(project.stage_ii_wo)}</p>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3">
                                <h3 className="font-medium text-foreground text-xs mb-1">Bill Released</h3>
                                <p className="text-lg font-bold text-blue-600">₹{parseInt(project.bill_released)}</p>
                                <p className="text-xs text-muted-foreground">{percentage}% of WO Amount</p>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="space-y-2">
                            <div className="bg-muted/20 rounded p-2">
                                <h3 className="font-medium text-foreground text-xs mb-1">Start Date</h3>
                                <p className="text-foreground">{new Date(project.start_date).toLocaleDateString()}</p>
                            </div>
                            <div className="bg-muted/20 rounded p-2">
                                <h3 className="font-medium text-foreground text-xs mb-1">End Date</h3>
                                <p className="text-foreground">{new Date(project.start_date).toLocaleDateString()}</p>
                            </div>
                            <div className="bg-muted/20 rounded p-2">
                                <h3 className="font-medium text-foreground text-xs mb-1">Deadline</h3>
                                <div className="flex items-center space-x-2">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                                    </div>
                                    <span className="text-sm font-medium">{project.progress}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Remark */}
                        <div className="bg-muted/20 rounded p-3">
                            <h3 className="font-medium text-foreground text-xs mb-1">Remark</h3>
                            <p className="text-muted-foreground text-xs leading-relaxed">
                                On track, minor delays in material procurement
                            </p>
                        </div>

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

  </>)
}

export default page