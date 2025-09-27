'use client'
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { toast } from 'sonner';


interface Distribution {
  id: number,
  category: string,
  amount: number,
  description: string

}

interface DistributionData {
  distributions: Distribution[],
  totalDistributed: number,
  undistributed: number,
  stageIIWO: number,
  pieData: Array<{
    name: string,
    value: number,
    color: string,
  }>;
}

interface AmouuntDistributionManagerProps {
  projectId: string
}
const AmountDistributionManager = ({ projectId }: AmouuntDistributionManagerProps) => {
  const [data, setData] = useState<DistributionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState(
    {
      category: '',
      amount: '',
      description: ''
    }
  );
  const categories = ['Material', 'Labour', 'Equipment', 'Overhead', 'Transport', 'Other'];

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
    if (active && payload && payload.length) {
      const categoryName = payload[0].name;
      const value = payload[0].value;

      const distribution = data?.distributions?.find(d => d.category === categoryName);
      // console.log(distribution)

      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold text-gray-800 text-md">
            {distribution?.description || categoryName}
          </p>
          <p className="text-blue-600 text-sm">
            Amount: ₹{value.toLocaleString()}
          </p>
          <p className="text-gray-600 text-xs">
            Category: {categoryName}
          </p>
        </div>
      );
    }

  }

  const fetchDistributions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/projects/${projectId}/distributions`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
          }
        }
      );
      if (response.ok) {
        const result = await response.json();
        setData(result.data)
      }

    } catch (err) {
      console.error('Error fetcching distributions : ', err)

    } finally {
      setIsLoading(false)
    }

  }

  const handleAddDistribution = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/projects/${projectId}/distributions`,
        {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
          },
          body: JSON.stringify(
            {
              category: formData.category,
              amount: parseFloat(formData.amount),
              description: formData.description
            }
          )
        }

      );
      if (response.ok) {
        setFormData({ category: '', amount: '', description: '' });
        setShowAddForm(false);
        fetchDistributions();
        toast.success('Distribution added successfully.');
      }
      else {
        const err = await response.json();
        toast.error(err.error || 'Failed to add distribution')
      }
    }
    catch (err) {
      console.error('Error adding distribution: ', err);
      toast.error('Failed to add distribution');
    }
  }

  useEffect(() => {
    fetchDistributions();
  }, [projectId]);
  if (isLoading) return <div>Loading distributions...</div>
  if (!data) return <div>No Data available</div>
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Amount Distribution</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-4 py-2 transition-none ${showAddForm ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg `}
        >
          {showAddForm ? 'Cancel' : 'Add Distribution'}
        </button>
      </div>

      {/* Add Distribution Form */}
      {showAddForm && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Add New Distribution</h3>
          <form onSubmit={handleAddDistribution} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Select
                  required
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                // className="w-full p-2 border border-border rounded-lg"
                >
                  <SelectTrigger className='w-full bg-background border-2 border-accent shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50'>
                    <SelectValue placeholder='Select Category' />
                  </SelectTrigger>
                  <SelectContent>

                    {/* <SelectItem value="">Select category</SelectItem> */}
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full p-2 border border-border rounded-lg"
                  placeholder="Enter amount"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border border-border rounded-lg"
                rows={2}
                placeholder="Optional description"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Distribution
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Distribution Visualization</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${((percent ? percent : 0) * 100).toFixed(1)}%`}
                >
                  {data.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                {/* <Tooltip
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                /> */}
                <Tooltip content={<CustomTooltip />}></Tooltip>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Table */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Distribution Details</h3>

          {/* Summary */}
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span>Total WO Amount:</span>
              <span className="font-medium">₹{data.stageIIWO.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Distributed:</span>
              <span className="font-medium text-blue-600">₹{data.totalDistributed.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Undistributed:</span>
              <span className="font-medium text-gray-600">₹{data.undistributed.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>Distributed %:</span>
              <span className="font-medium">{((data.totalDistributed / data.stageIIWO) * 100).toFixed(1)}%</span>
            </div>
          </div>

          {/* Distributions List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {data.distributions.map((dist) => (
              <div key={dist.id} className="bg-muted/20 rounded p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{dist.category}</div>
                    {dist.description && (
                      <div className="text-xs text-muted-foreground">{dist.description}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹{dist.amount.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {((dist.amount / data.stageIIWO) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AmountDistributionManager;