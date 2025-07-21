'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

const ProjectCard = ({
  id,
  title,
  progress,
  created_at,
  start_date,
  end_date,
  image_url,
  video_url,
  oneliner,
  updated_at,
  onUpdate,
  onDelete
}: {
  id: number
  title: string,
  progress: number,
  created_at: string,
  start_date: string,
  end_date: string,
  image_url: string,
  video_url: string,
  oneliner: string,
  updated_at: string,
  onUpdate?: (id: number, data: any) => void,
  onDelete?: (id: number) => void
}) => {

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)


  const [currentData, setCurrentData] = useState({
    title,
    progress,
    start_date,
    end_date,
    image_url,
    video_url,
    oneliner,
    updated_at
  });

  const [formData, setFormData] = useState({
    title,
    progress,
    start_date,
    end_date,
    image_url,
    video_url,
    oneliner,

  })

  useEffect(() => {
    setCurrentData({
      title,
      progress,
      start_date,
      end_date,
      image_url,
      video_url,
      oneliner,
      updated_at
    });
    setFormData({
      title,
      progress,
      start_date,
      end_date,
      image_url,
      video_url,
      oneliner,
    });
  }, [title, progress, start_date, end_date, image_url, video_url, oneliner, updated_at]);

  //track inputs
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev, [field]: value
    }))

  }
  //save the edits
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': "application/json",
          'Authorization': `Bearer ${token}`,
        },

        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setIsEditing(false);

          setCurrentData({ ...formData, updated_at : result.project.updatd_at || new Date().toString()})


          onUpdate?.(id, formData);
          console.log("project Updated")
        }

        else {
          throw new Error('Failed to update project')
        }
      }
    } catch (err) {
      console.log(err)
    }
    finally {
      setIsLoading(false)
    }
  }

  //cancel changes
  const handleCancel = () => {
    setFormData({
      title : currentData.title ,
      oneliner : currentData.oneliner ,
      progress : currentData.progress ,
      start_date : currentData.start_date ,
      end_date : currentData.end_date ,
      image_url : currentData.image_url ,
      video_url : currentData.video_url 
    });
    setIsEditing(false);
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${title}?\n\nThis action cannot be undone`);


    if (!confirmDelete) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          onDelete?.(id);
          alert('project deleted')
        }
      }
    } catch (err) {
      console.error(err)
      alert('failed to delete project')

    }
    finally {
      setIsLoading(false)
    }
  }


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
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col justify-between shadow-lg hover:shadow-2xl transition-all duration-300 relative">

      {/* Action Buttons (Top Right) */}
      <div className="absolute top-4 right-4 flex gap-2">
        {!isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-xs"
              disabled={isLoading}
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleDelete}
              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-xs"
              disabled={isLoading}
            >
              🗑️ Delete
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleSave}
              className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-xs"
              disabled={isLoading}
            >
              💾 Save
            </button>
            <button
              onClick={handleCancel}
              className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-xs"
              disabled={isLoading}
            >
              ❌ Cancel
            </button>
          </>
        )}
      </div>

      {/* Project Info */}
      <div className="flex-grow mt-8"> {/* Added margin-top for action buttons */}

        {/* Title - Editable */}
        {isEditing ? (
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full text-xl font-semibold bg-background border border-border rounded px-2 py-1 mb-2"
          />
        ) : (
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {currentData.title}
          </h3>
        )}

        {/* Oneliner - Editable */}
        {isEditing ? (
          <textarea
            value={formData.oneliner}
            onChange={(e) => handleInputChange('oneliner', e.target.value)}
            className="w-full text-sm bg-background border border-border rounded px-2 py-1 mb-4 resize-none"
            rows={3}
          />
        ) : (
          <p className="text-muted-foreground mb-4 text-sm">
            {currentData.oneliner}
          </p>
        )}

        {/* Progress Bar - Editable */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Progress</span>
            {isEditing ? (
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => handleInputChange('progress', parseInt(e.target.value) || 0)}
                className="w-16 text-sm bg-background border border-border rounded px-1"
              />
            ) : (
              <span className="text-sm text-muted-foreground">{currentData.progress}%</span>
            )}
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(isEditing ? formData.progress : progress)}`}
              style={{ width: `${isEditing ? formData.progress : currentData.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Project Dates - Editable */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div>
            <span className="text-muted-foreground block">Start Date</span>
            {isEditing ? (
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                className="w-full text-xs bg-background border border-border rounded px-1"
              />
            ) : (
              <span className="text-foreground font-medium">{formatDate(currentData.start_date)}</span>
            )}
          </div>
          <div>
            <span className="text-muted-foreground block">End Date</span>
            {isEditing ? (
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                className="w-full text-xs bg-background border border-border rounded px-1"
              />
            ) : (
              <span className="text-foreground font-medium">{formatDate(currentData.end_date)}</span>
            )}
          </div>
        </div>

        {/* Timestamps (Read-only) */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div>
            <span className="text-muted-foreground block">Created</span>
            <span className="text-foreground font-medium">{formatDate(created_at)}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Updated</span>
            <span className="text-foreground font-medium">{formatDate(currentData.updated_at)}</span>
          </div>
        </div>

        {/* Media Links - Editable */}
        <div className="flex gap-2 mb-4">
          {isEditing ? (
            <>
              <input
                type="url"
                placeholder="Video URL"
                value={formData.video_url}
                onChange={(e) => handleInputChange('video_url', e.target.value)}
                className="flex-1 text-xs bg-background border border-border rounded px-2 py-1"
              />
              <input
                type="url"
                placeholder="Image URL"
                value={formData.image_url}
                onChange={(e) => handleInputChange('image_url', e.target.value)}
                className="flex-1 text-xs bg-background border border-border rounded px-2 py-1"
              />
            </>
          ) : (
            <>
              <button
                className="flex-1 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg px-3 py-2 text-sm transition-colors"
                onClick={() => window.open(currentData.video_url, '_blank')}
              >
                Videos
              </button>
              <button
                className="flex-1 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg px-3 py-2 text-sm transition-colors"
                onClick={() => alert('Image gallery coming soon!')}
              >
                Images
              </button>
            </>
          )}
        </div>
      </div>

      {/* View Statistics Button */}
      {!isEditing && (
        <Link
          href={'/demoproject'}
          className="mt-auto bg-muted hover:bg-primary hover:text-background rounded-lg flex items-center justify-center py-3 transition-all duration-200 font-medium"
        >
          <span>View Statistics</span>
        </Link>
      )}
    </div>
  )
}

export default ProjectCard