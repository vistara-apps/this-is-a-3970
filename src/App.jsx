import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import MealPlanning from './components/MealPlanning'
import FoodLogging from './components/FoodLogging'
import Insights from './components/Insights'
import Profile from './components/Profile'
import OnboardingModal from './components/OnboardingModal'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // Check if user has completed onboarding
    const userData = localStorage.getItem('nutrigenius_user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      setShowOnboarding(true)
    }
  }, [])

  const handleOnboardingComplete = (userData) => {
    setUser(userData)
    localStorage.setItem('nutrigenius_user', JSON.stringify(userData))
    setShowOnboarding(false)
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} />
      case 'meal-planning':
        return <MealPlanning user={user} />
      case 'food-logging':
        return <FoodLogging user={user} />
      case 'insights':
        return <Insights user={user} />
      case 'profile':
        return <Profile user={user} setUser={setUser} />
      default:
        return <Dashboard user={user} />
    }
  }

  if (showOnboarding) {
    return <OnboardingModal onComplete={handleOnboardingComplete} />
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header 
        user={user}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex">
        <Sidebar 
          currentView={currentView}
          setCurrentView={setCurrentView}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className="flex-1 lg:ml-64 transition-all duration-300">
          <div className="p-4 sm:p-6 lg:p-8">
            {renderCurrentView()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App