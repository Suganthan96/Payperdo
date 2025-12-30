'use client'

import { usePrivy } from '@privy-io/react-auth'
import { BusinessNav } from '@/components/business-nav'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CompletedTask() {
  const { authenticated } = usePrivy()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (!authenticated) {
      router.push('/')
    }
  }, [authenticated, router])

  const completedTasks = [
    { id: 1, title: "Photo at Starbucks", completedBy: "0x742...01a", reward: "10 MOV", status: "Verified", timestamp: "2 hours ago" },
    { id: 2, title: "McDonald's Check-in", completedBy: "0x8ba...01b", reward: "5 MOV", status: "Pending", timestamp: "4 hours ago" },
    { id: 3, title: "Social Media Post", completedBy: "0x9cd...02c", reward: "15 MOV", status: "Verified", timestamp: "1 day ago" },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BusinessNav />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              ✅ Completed Tasks
            </h1>
            <p className="text-xl text-foreground/60">
              View and verify completed tasks from consumers.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900 p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-green-400">156</h3>
              <p className="text-gray-400">Total Completed</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-yellow-400">23</h3>
              <p className="text-gray-400">Pending Verification</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-blue-400">133</h3>
              <p className="text-gray-400">Verified</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-purple-400">1,340 MOV</h3>
              <p className="text-gray-400">Total Paid Out</p>
            </div>
          </div>

          {/* Completed Tasks List */}
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-xl font-semibold">Recent Completions</h2>
            </div>
            <div className="divide-y divide-gray-800">
              {completedTasks.map((task) => (
                <div key={task.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-gray-400">Completed by {task.completedBy}</p>
                    <p className="text-xs text-gray-500">{task.timestamp}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-yellow-400">{task.reward}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === 'Verified' 
                          ? 'bg-green-900 text-green-300' 
                          : 'bg-yellow-900 text-yellow-300'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <div>
                      <button className="text-blue-400 hover:text-blue-300 text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
