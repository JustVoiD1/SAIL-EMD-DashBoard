// export interface Project {
//   id: number,
//   title: string,
//   oneliner: string,
//   progress: number,
//   created_at: string,
//   updated_at: string,
//   start_date: string,
//   end_date: string,
//   image_url: null | string,
//   video_url: null | string,
// }

export interface ProjectNew {
  id: number,
  title: string,
  desc: string,
  region: "HQ" | "ER" | "NR" | "SR" | "WR",
  type: "Capital" | "R & M" | "Stores & Spares",
  status: "completed" | "ongoiing",
  progress: number,
  created_at: string,
  updated_at: string,
  start_date: string,
  end_date: string,
  image_url: string,
  video_url: string,

}

export type Project = {
  slNo: number
  projectName: string
  startDate: string // Project start date
  stageIIWO: number // Amount in rupees
  completionDateAsPerWO: string
  billReleased: number // Amount in rupees
  deadlineProgress: number // Percentage as number based on deadline calculation
  remark: string
}


export interface FilterValues {
  region?: string
  type?: string
  status?: string
  year?: string
  month?: string
}


export interface SelectBarProps {
  filters?: FilterValues
  onFiltersChange?: (filters: FilterValues) => void
}