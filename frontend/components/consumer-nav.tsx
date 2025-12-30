'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'

export function ConsumerNav() {
  const pathname = usePathname()
  const { logout } = usePrivy()

  const navItems = [
    { name: 'Dashboard', path: '/consumer/dashboard', icon: '🏠' },
    { name: 'Tasks', path: '/consumer/Tasks', icon: '📋' },
    { name: 'Earnings', path: '/consumer/Earning', icon: '💰' },
  ]

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/consumer/dashboard" className="text-xl font-bold text-yellow-500">
          Payperdo
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === item.path
                  ? 'bg-yellow-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
          
          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:text-red-300 hover:bg-gray-700"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
}