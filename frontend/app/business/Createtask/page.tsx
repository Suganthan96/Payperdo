'use client'

import { usePrivy } from '@privy-io/react-auth'
import { BusinessNav } from '@/components/business-nav'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CreateTask() {
  const { authenticated } = usePrivy()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (!authenticated) {
      router.push('/')
    }
  }, [authenticated, router])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BusinessNav />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              ➕ Create Task
            </h1>
            <p className="text-xl text-foreground/60">
              Create engaging tasks for consumers to complete and earn MOV tokens.
            </p>
          </div>

          {/* Task Creation Form */}
          <div className="bg-gray-900 rounded-lg p-8 mb-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Task Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., Take a photo at Starbucks"
                  className="w-full p-3 bg-gray-800 rounded-md border border-gray-700 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Task Description</label>
                <textarea 
                  placeholder="Describe what the user needs to do..."
                  rows={4}
                  className="w-full p-3 bg-gray-800 rounded-md border border-gray-700 text-white"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Reward (MOV Tokens)</label>
                  <input 
                    type="number" 
                    placeholder="10"
                    className="w-full p-3 bg-gray-800 rounded-md border border-gray-700 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Tasks</label>
                  <input 
                    type="number" 
                    placeholder="100"
                    className="w-full p-3 bg-gray-800 rounded-md border border-gray-700 text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Task Type</label>
                <select className="w-full p-3 bg-gray-800 rounded-md border border-gray-700 text-white">
                  <option>Photo Verification</option>
                  <option>Location Check-in</option>
                  <option>Social Media Post</option>
                  <option>Survey/Feedback</option>
                </select>
              </div>
              
              <div className="flex justify-center pt-4">
                <button className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold px-8 py-3 rounded-md transition-colors">
                  Create Task Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
