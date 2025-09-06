import React from 'react'
import { Menu, Bell, User } from 'lucide-react'

const Header = ({ user, onMenuClick }) => {
  return (
    <header className="bg-surface shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
                NutriGenius
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.name || 'User'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header