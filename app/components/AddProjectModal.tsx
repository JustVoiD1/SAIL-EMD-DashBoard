'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project1 } from '@/lib/types';
import React, { useState } from 'react'
import { toast } from 'sonner';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded: (project: Project1) => void;
}

const AddProjectModal = ({ isOpen, onClose, onProjectAdded }: AddProjectModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '', // changed from oneliner
    region: 'HQ' as 'HQ' | 'ER' | 'NR' | 'SR' | 'WR',
    type: 'Capital' as 'Capital' | 'R & M' | 'Stores & Spares',
    status: 'ongoing' as 'completed' | 'ongoing',
    progress: '',
    start_date: '',
    end_date: '',
    image_url: '',
    video_url: '',
    stage_ii_wo: '',
    bill_released: '',
    remark: ''
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === '' ? '' : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const currentDate = new Date().toISOString().split('T')[0]
      const projectData = {
        ...formData,
        progress: formData.progress === '' ? 0 : parseInt(formData.progress),
        stage_ii_wo: formData.stage_ii_wo === '' ? 0 : parseInt(formData.stage_ii_wo),
        bill_released: formData.bill_released === '' ? 0 : parseInt(formData.bill_released),
        start_date: formData.start_date || currentDate,
        end_date: formData.end_date || currentDate
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          onProjectAdded(result.project);
          handleClose();
          toast.success("Project Created Successfully", {
            description: projectData.title,
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          })
        }
      } else {
        toast.error('Failed to create project')
        throw new Error('Failed to create project');
      }
    } catch (error) {
      toast.error('Failed to create project')
      console.error('Error creating project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      region: 'HQ' as 'HQ' | 'ER' | 'NR' | 'SR' | 'WR',
      type: 'Capital' as 'Capital' | 'R & M' | 'Stores & Spares',
      status: 'ongoing' as 'completed' | 'ongoing',
      progress: '',
      start_date: '',
      end_date: '',
      image_url: '',
      video_url: '',
      stage_ii_wo: '',
      bill_released: '',
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
          <h2 className="text-2xl font-bold text-foreground">Add New Project</h2>
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
            <label>
              <span className="block text-sm font-medium text-foreground mb-2">
                Project Title *
              </span>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project title"
              />
            </label>
          </div>

          {/* Description */}
          <div>
            <label>

              <span className="block text-sm font-medium text-foreground mb-1">
                Description *
              </span>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="max-h-[7vh] w-full px-3 py-1 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Enter project description"
              />
            </label>
          </div>
          {/* Region */}
          <div className='grid grid-cols-4 gap-4'>
            <div>
              <label>

                <span className="block text-sm font-medium text-foreground mb-2">
                  Region *
                </span>
                <Select
                  required
                  value={formData.region}
                  onValueChange={(value) => handleInputChange('region', value)}
                // className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="HQ">HQ</SelectItem>
                    <SelectItem value="ER">ER</SelectItem>
                    <SelectItem value="NR">NR</SelectItem>
                    <SelectItem value="SR">SR</SelectItem>
                    <SelectItem value="WR">WR</SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </div>

            {/* Type */}
            <div>
              <label>
                <span className="block text-sm font-medium text-foreground mb-2">
                  Type *
                </span>
                <Select
                  required
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value)}
                // className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Capital">Capital</SelectItem>
                    <SelectItem value="R & M">R & M</SelectItem>
                    <SelectItem value="Stores & Spares">Stores & Spares</SelectItem>
                  </SelectContent>
                </Select>
              </label>

            </div>



            {/* Status */}
            <div>
              <label>
                <span className="block text-sm font-medium text-foreground mb-2">
                  Status
                </span>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                // className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <SelectTrigger className='w-full bg-background'>
                    <SelectValue placeholder="status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>

                </Select>
              </label>
            </div>

            {/* Progress */}
            <div>
              <label>
                <span className="block text-sm font-medium text-foreground mb-2">
                  Progress (%)
                </span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => handleInputChange('progress', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </label>
            </div>
          </div>


          {/* Stage II Work Order */}
          <div className='grid xs:grid-cols-2 sm:grid-cols-3 gap-4'>
            <div>
              <label>
                <span className="block text-sm font-medium text-foreground mb-2">
                  Stage II WO Amount (₹)
                </span>
                <input
                  type="number"
                  min="0"
                  value={formData.stage_ii_wo}
                  onChange={(e) => handleInputChange('stage_ii_wo', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </label>
            </div>

            {/* Bill Released */}
            <div>
              <label>
                <span className="block text-sm font-medium text-foreground mb-2">
                  Bill Released Amount (₹)
                </span>
                <input
                  type="number"
                  min="0"
                  value={formData.bill_released}
                  onChange={(e) => handleInputChange('bill_released', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </label>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>
                  <span className="block text-sm font-medium text-foreground mb-2">
                    Start Date
                  </span>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>
              <div>
                <label>
                  <span className="block text-sm font-medium text-foreground mb-2">
                    End Date
                  </span>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Media URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>
                <span className="block text-sm font-medium text-foreground mb-2">
                  Image URL
                </span>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => handleInputChange('image_url', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </label>
            </div>
            <div>
              <label>
                <span className="block text-sm font-medium text-foreground mb-2">
                  Video URL
                </span>
                <input
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => handleInputChange('video_url', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/video.mp4"
                />
              </label>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label>
              <span className="block text-sm font-medium text-foreground mb-2">
                Remark
              </span>
              <textarea
                rows={2}
                value={formData.remark}
                onChange={(e) => handleInputChange('remark', e.target.value)}
                className="max-h-[5vh] overflow-y-clip w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Enter any remarks"
              />
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-muted hover:bg-muted/70 text-foreground hover:text-destructive rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;