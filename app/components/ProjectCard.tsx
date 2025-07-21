'use client'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

const ProjectCard = ({ title, progress, created_at, start_date, end_date, image_url, video_url, oneliner, updated_at } : { title: string, progress: number, created_at: string, start_date : string, end_date : string, image_url : string, video_url : string,  oneliner: string, updated_at : string }) => {
  // Dummy data for additional fields
  // const dummyData = {
  //   // progress: Math.floor(Math.random() * 100), // Random progress 0-99%
  //   start_date: '2024-01-15',
  //   end_date: '2024-12-31',
  //   created_at: '2024-01-10T09:00:00Z',
  //   updated_at: '2024-01-20T14:30:00Z',
  //   image_url: '/placeholder-project.jpg', // Placeholder image
  //   video_url: 'https://example.com/demo-video.mp4' // Placeholder video
  // }

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Helper function to get progress color
  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500'
    if (progress < 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col justify-between shadow-lg hover:shadow-2xl transition-all duration-300">
      {/* Project Image*/}

      {/*<div className="w-full h-32 bg-muted rounded-lg mb-4 overflow-hidden relative">
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Project Image</span>
        </div>
      </div> */}

      {/* Project Info */}
      <div className="flex-grow">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {title}
        </h3>
        <p className="text-muted-foreground mb-4 text-sm">
          {oneliner}
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Project Dates */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div>
            <span className="text-muted-foreground block">Start Date</span>
            <span className="text-foreground font-medium">{formatDate(start_date)}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">End Date</span>
            <span className="text-foreground font-medium">{formatDate(end_date)}</span>
          </div>
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div>
            <span className="text-muted-foreground block">Created</span>
            <span className="text-foreground font-medium">{formatDate(created_at)}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Updated</span>
            <span className="text-foreground font-medium">{formatDate(updated_at)}</span>
          </div>
        </div>

        {/* Media Links */}
        <div className="flex gap-2 mb-4">
          {/* Video Link */}
          <button 
            className="flex-1 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg px-3 py-2 text-sm transition-colors"
            onClick={() => window.open(video_url, '_blank')}
          >
            Videos
          </button>
          {/* Image Gallery */}
          <button 
            className="flex-1 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg px-3 py-2 text-sm transition-colors"
            onClick={() => alert('Image gallery coming soon!')}
          >
            Images
          </button>
        </div>
      </div>

      {/* View Statistics Button */}
      <Link 
        href={'/demoproject'} 
        className="mt-auto bg-muted hover:bg-primary hover:text-background rounded-lg flex items-center justify-center py-3 transition-all duration-200 font-medium"
      >
        <span>View Statistics</span>
      </Link>
    </div>
  )
}

export default ProjectCard