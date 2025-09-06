import React from 'react'
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  PlusCircle, 
  TrendingUp, 
  User, 
  X 
} from 'lucide-react'
import { clsx } from 'clsx'

const Sidebar = ({ currentView, setCurrentView, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'meal-planning', label: 'Meal Planning', icon: UtensilsCrossed },
    { id: 'food-logging', label: 'Log Food', icon: PlusCircle },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={clsx(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-surface shadow-lg z-50 transition-transform duration-300',
        'lg:translate-x-0 lg:static lg:z-auto',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = currentView === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id)
                    onClose()
                  }}
                  className={clsx(
                    'w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200',
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}

export default Sidebar