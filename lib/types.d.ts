// Only the following two types to be used in future 
export interface Project1 {
  id: number
  title: string
  description: string | null
  region: "HQ" | "ER" | "NR" | "SR" | "WR"
  type: "Capital" | "R & M" | "Stores & Spares"
  status: "completed" | "ongoing"
  progress: number
  start_date: string
  end_date: string
  stage_ii_wo: string 
  bill_released: string
  image_url: string | null
  video_url: string | null
  remark: string | null
  created_at: string
  updated_at: string
  deadline_progress: number
}
export interface ProjectFormData{
  title: string
  description: string
  region: "HQ" | "ER" | "NR" | "SR" | "WR"
  type: "Capital" | "R & M" | "Stores & Spares"
  status: "completed" | "ongoing"
  progress: number
  start_date: string
  end_date: string
  stage_ii_wo: number
  bill_released: number
  image_url: string
  video_url: string
  remark: string
}
export interface ProjectNew {
  id: number,
  title: string,
  desc: string,
  region: "HQ" | "ER" | "NR" | "SR" | "WR",
  type: "Capital" | "R & M" | "Stores & Spares",
  stageIIWO : string,
  status: "completed" | "ongoiing",
  progress: number,
  created_at: string,
  updated_at: string,
  start_date: string,
  end_date: string,
  image_url: string,
  video_url: string,
  remark: string,

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