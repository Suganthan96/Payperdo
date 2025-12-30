'use client'

import { usePrivy } from '@privy-io/react-auth'
import { ConsumerNav } from '@/components/consumer-nav'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Tasks() {
  const { authenticated } = usePrivy()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (!authenticated) {
      router.push('/')
    }
  }, [authenticated, router])

  const availableTasks = [
    { id: 1, title: "Take a photo at Starbucks", reward: "10 MOV", difficulty: "Easy", time: "2 min", location: "Any Starbucks" },
    { id: 2, title: "Check-in at McDonald's", reward: "5 MOV", difficulty: "Easy", time: "1 min", location: "Any McDonald's" },
    { id: 3, title: "Post about your coffee", reward: "15 MOV", difficulty: "Medium", time: "5 min", location: "Any coffee shop" },
    { id: 4, title: "Review a restaurant", reward: "20 MOV", difficulty: "Medium", time: "10 min", location: "Any restaurant" },
    { id: 5, title: "Share workout selfie", reward: "12 MOV", difficulty: "Easy", time: "3 min", location: "Any gym" },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ConsumerNav />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              📋 Available Tasks
            </h1>
            <p className="text-xl text-foreground/60">
              Complete simple tasks and earn MOV tokens instantly!
            </p>
          </div>

          {/* Filter Bar */}
          <div className="bg-gray-900 p-4 rounded-lg mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <select className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white">
                <option>All Categories</option>
                <option>Photo Tasks</option>
                <option>Location Tasks</option>
                <option>Social Media</option>
                <option>Reviews</option>
              </select>
              <select className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white">
                <option>All Difficulties</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
              <select className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white">
                <option>Sort by Reward</option>
                <option>Highest Reward</option>
                <option>Lowest Reward</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTasks.map((task) => (
              <div key={task.id} className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <span className="text-2xl font-bold text-yellow-400">{task.reward}</span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Difficulty:</span>
                    <span className={`font-medium ${
                      task.difficulty === 'Easy' ? 'text-green-400' : 
                      task.difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {task.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Time:</span>
                    <span className="text-white">{task.time}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Location:</span>
                    <span className="text-white">{task.location}</span>
                  </div>
                </div>
                
                <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold py-3 rounded-md transition-colors">
                  Start Task
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
