'use client'
import Link from 'next/link'
import React from 'react'

const ProjectCard = ({ title, oneliner }: { title: string, oneliner: string }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col justify-between shadow-lg hover:shadow-2xl">
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground">
        {oneliner}
      </p>
      <Link href={'/demoproject'} className="mt-4 h-20 bg-muted hover:bg-primary hover:text-background rounded-lg flex items-center justify-center">
        <span className="">View Statitics</span>
      </Link>
    </div>
  )
}

export default ProjectCard