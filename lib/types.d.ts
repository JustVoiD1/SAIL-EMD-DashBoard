export interface Project {
  id: number,
  title: string,
  oneliner: string,
  progress: number,
  created_at: string,
  updated_at: string,
  start_date: string,
  end_date: string,
  image_url: null | string,
  video_url: null | string,
}