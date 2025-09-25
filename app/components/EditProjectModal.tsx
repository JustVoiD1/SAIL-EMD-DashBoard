'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project1 } from '@/lib/types';
import React, { useState, useEffect } from 'react'

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectUpdated: (project: Project1) => void;
  project?: Project1 | null;
}
interface FormProps {
  title: string,
  description: string | null,
  // region: string,
  // type: string,
  // status: string,
  region: "HQ" | "ER" | "NR" | "SR" | "WR",
  type: "Capital" | "R & M" | "Stores & Spares",
  status: "completed" | "ongoing",
  progress: number,
  start_date: string,
  end_date: string,
  stage_ii_wo: number,
  bill_released: number,
  image_url: string | null,
  video_url: string | null,
  remark: string | null,
}

const EditProjectModal = ({ isOpen, onClose, onProjectUpdated, project }: EditProjectModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  console.log('Project inside edit mode: ', project)

  const [formData, setFormData] = useState<FormProps>({
    title: '',
    description: '',
    region: project?.region || 'HQ' as "HQ" | "ER" | "NR" | "SR" | "WR",
    type: project?.type || "Capital" as "Capital" | "R & M" | "Stores & Spares",
    status: project?.status || 'ongoing',
    progress: 0,
    start_date: '',
    end_date: '',
    image_url: '',
    video_url: '',
    stage_ii_wo: 0,
    bill_released: 0,
    remark: ''
    // title: '',
    // description: '',
    // region: project?.region || 'HQ' as "HQ" | "ER" | "NR" | "SR" | "WR",
    // type: project?.type || "Capital" as "Capital" | "R & M" | "Stores & Spares",
    // status: 'ongoing',
    // progress: 0,
    // start_date: '',
    // end_date: '',
    // image_url: '',
    // video_url: '',
    // stage_ii_wo: 0,
    // bill_released: 0,
    // remark: ''
  });

  useEffect(() => {
    if (project !== null && project !== undefined && isOpen) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        region: project?.region as "HQ" | "ER" | "NR" | "SR" | "WR" || 'HQ',
        type: project?.type as "Capital" | "R & M" | "Stores & Spares" || 'Capital',
        status: project?.status as "completed" | "ongoing" || 'ongoing',
        progress: project.progress || 0,
        start_date: project.start_date ? project.start_date.split('T')[0] : '',
        end_date: project.end_date ? project.end_date.split('T')[0] : '',
        image_url: project.image_url || '',
        video_url: project.video_url || '',
        stage_ii_wo: Number(project.stage_ii_wo) || 0,
        bill_released: Number(project.bill_released) || 0,
        remark: project.remark || '',
      });
      console.log('Project inside EditProjectModal', project)

      console.log('Formdata set to', formData)
    }
  }, [isOpen, project])

  useEffect(() => {

    console.log('Project is : ', project, ' and FormData state updated:', formData);
  }, []);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    console.log('Form data on submit:', formData);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const currentDate = new Date().toISOString().split('T')[0]
      const projectData = {
        ...formData,
        start_date: formData.start_date || currentDate,
        end_date: formData.end_date || currentDate
      }

      const response = await fetch(`/api/projects/${project?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          onProjectUpdated(result.project);
          handleClose();
          alert('Project updated successfully!');
        }
      } else {
        throw new Error('Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      region: 'HQ',
      type: 'Capital',
      status: 'ongoing',
      progress: 0,
      start_date: '',
      end_date: '',
      image_url: '',
      video_url: '',
      stage_ii_wo: 0,
      bill_released: 0,
      remark: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Edit Project</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            ❌
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description!}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="max-h-[7vh] w-full px-3 py-1 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter project description"
            />
          </div>
          {/* Region */}
          <div className='grid grid-cols-4 gap-4'>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Region *
              </label>
              <Select
                required
                value={formData.region}
                onValueChange={(value) => handleInputChange('region', value)}
              // className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Region' />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="HQ">HQ</SelectItem>
                  <SelectItem value="ER">ER</SelectItem>
                  <SelectItem value="NR">NR</SelectItem>
                  <SelectItem value="SR">SR</SelectItem>
                  <SelectItem value="WR">WR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Type *
              </label>
              <Select
                required
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
              // className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Type' />
                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="Capital">Capital</SelectItem>
                  <SelectItem value="R & M">R & M</SelectItem>
                  <SelectItem value="Stores & Spares">Stores & Spares</SelectItem>
                </SelectContent>
              </Select>
            </div>



            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              // className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Status' />
                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Progress */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Progress (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => handleInputChange('progress', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>


          {/* Stage II Work Order */}
          <div className='grid xs:grid-cols-2 sm:grid-cols-3 gap-4'>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Stage II WO Amount (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.stage_ii_wo}
                onChange={(e) => handleInputChange('stage_ii_wo', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            {/* Bill Released */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Bill Released Amount (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.bill_released}
                onChange={(e) => handleInputChange('bill_released', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', (e.target.value))}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Media URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image_url?.toString()}
                onChange={(e) => handleInputChange('image_url', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Video URL
              </label>
              <input
                type="url"
                value={formData.video_url?.toString()}
                onChange={(e) => handleInputChange('video_url', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/video.mp4"
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Remark
            </label>
            <textarea
              rows={2}
              value={formData.remark?.toString()}
              onChange={(e) => handleInputChange('remark', e.target.value)}
              className="max-h-[5vh] overflow-y-clip w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Enter any remarks"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;