'use client'

import { useState } from 'react'

interface AddJobModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (jobData: {
    title: string
    category: string
    description: string
    estimatedTime: string
    price: string
  }) => void
}

export function AddJobModal({ isOpen, onClose, onSubmit }: AddJobModalProps) {
  const [jobData, setJobData] = useState({
    title: '',
    category: 'oil-maintenance',
    description: '',
    estimatedTime: '',
    price: ''
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(jobData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Job</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-md"
              value={jobData.title}
              onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={jobData.category}
              onChange={(e) => setJobData({ ...jobData, category: e.target.value })}
            >
              <option value="oil-maintenance">Oil Maintenance</option>
              <option value="engine-service">Engine Service</option>
              <option value="maintenance-tool">Maintenance Tool</option>
              <option value="automotive-management">Automotive Management</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              value={jobData.description}
              onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Time
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 2 hours"
                className="w-full px-3 py-2 border rounded-md"
                value={jobData.estimatedTime}
                onChange={(e) => setJobData({ ...jobData, estimatedTime: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="text"
                required
                placeholder="e.g. $150"
                className="w-full px-3 py-2 border rounded-md"
                value={jobData.price}
                onChange={(e) => setJobData({ ...jobData, price: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Job
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

