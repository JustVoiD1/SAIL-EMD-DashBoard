'use client'

import React from 'react'
interface VideoPlayerProps {
    videoUrl? : string,
    title? : string,
}
const VideoPlayer = ({videoUrl = `/videos/SAILTRACK74.mp4`, title = 'Project Video'} : VideoPlayerProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-lg font-semibold text-foreground mb-3">{title}</h3>
      <div className="relative">
        <video 
          controls 
          className="w-full h-fit rounded-lg bg-black"
          preload="metadata"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  )
}

export default VideoPlayer