import React, { useState } from 'react'
import { User, Settings, Crown, CreditCard, Bell, Shield } from 'lucide-react'

const Profile = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    dietaryPreferences: user?.dietaryPreferences || [],
    fitnessGoals: user?.fitnessGoals || '',
    allergies: user?.allergies || []
  })

  const handleSaveProfile = () => {
    const updatedUser = { ...user, ...formData }
    setUser(updatedUser)
    localStorage.setItem('nutrigenius_user', JSON.stringify(updatedUser))
    setIsEditing(false)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'subscription', label: 'Subscription', icon: Crown },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ]

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Mediterranean', 
    'Low Carb', 'Gluten Free', 'No Restrictions'
  ]

  const fitnessGoalsOptions = [
    'Weight Loss', 'Weight Gain', 'Muscle Building', 
    'Maintenance', 'Athletic Performance', 'General Health'
  ]

  const allergyOptions = [
    'Nuts', 'Dairy', 'Eggs', 'Soy', 'Shellfish', 
    'Fish', 'Wheat', 'None'
  ]

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-outline"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={handleSaveProfile}
              className="btn-primary"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setIsEditing(false)
                setFormData({
                  name: user?.name || '',
                  email: user?.email || '',
                  dietaryPreferences: user?.dietaryPreferences || [],
                  fitnessGoals: user?.fitnessGoals || '',
                  allergies: user?.allergies || []
                })
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="input"
              />
            ) : (
              <p className="text-gray-900">{user?.name || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="input"
              />
            ) : (
              <p className="text-gray-900">{user?.email || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fitness Goal
            </label>
            {isEditing ? (
              <select
                value={formData.fitnessGoals}
                onChange={(e) => handleInputChange('fitnessGoals', e.target.value)}
                className="input"
              >
                <option value="">Select a goal</option>
                {fitnessGoalsOptions.map(goal => (
                  <option key={goal} value={goal}>{goal}</option>
                ))}
              </select>
            ) : (
              <p className="text-gray-900">{user?.fitnessGoals || 'Not set'}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Dietary Preferences
            </label>
            {isEditing ? (
              <div className="grid grid-cols-2 gap-2">
                {dietaryOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleArrayToggle('dietaryPreferences', option)}
                    className={`p-2 text-sm rounded-md border-2 transition-colors ${
                      formData.dietaryPreferences.includes(option)
                        ? 'border-primary bg-primary bg-opacity-10 text-primary'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user?.dietaryPreferences?.length > 0 ? (
                  user.dietaryPreferences.map((pref, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary bg-opacity-10 text-primary rounded-full text-sm"
                    >
                      {pref}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">None selected</p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Allergies & Restrictions
            </label>
            {isEditing ? (
              <div className="grid grid-cols-2 gap-2">
                {allergyOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleArrayToggle('allergies', option)}
                    className={`p-2 text-sm rounded-md border-2 transition-colors ${
                      formData.allergies.includes(option)
                        ? 'border-primary bg-primary bg-opacity-10 text-primary'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user?.allergies?.length > 0 ? (
                  user.allergies.map((allergy, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm border border-red-200"
                    >
                      {allergy}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">None selected</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderSubscriptionTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Subscription & Billing</h2>
      
      <div className="card bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Crown className="h-6 w-6" />
          <h3 className="text-lg font-semibold">Current Plan: {user?.subscriptionTier || 'Free'}</h3>
        </div>
        <p className="text-blue-100 mb-4">
          {user?.subscriptionTier === 'free' 
            ? 'Enjoy basic meal suggestions and nutrition tracking.'
            : user?.subscriptionTier === 'premium'
            ? 'Access to advanced meal planning and AI insights.'
            : 'Full access to personalized coaching and integrations.'
          }
        </p>
        {user?.subscriptionTier === 'free' && (
          <button className="bg-white text-primary px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors">
            Upgrade Plan
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card border-2 border-gray-200">
          <h3 className="font-semibold text-lg mb-2">Free</h3>
          <p className="text-2xl font-bold mb-4">$0<span className="text-sm font-normal">/month</span></p>
          <ul className="text-sm text-gray-600 space-y-2 mb-4">
            <li>• Basic meal suggestions</li>
            <li>• Food logging</li>
            <li>• Basic nutrition tracking</li>
          </ul>
          <button 
            className={`w-full py-2 rounded-md ${
              user?.subscriptionTier === 'free' 
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                : 'btn-outline'
            }`}
            disabled={user?.subscriptionTier === 'free'}
          >
            {user?.subscriptionTier === 'free' ? 'Current Plan' : 'Downgrade'}
          </button>
        </div>

        <div className="card border-2 border-primary">
          <h3 className="font-semibold text-lg mb-2">Premium</h3>
          <p className="text-2xl font-bold mb-4">$9.99<span className="text-sm font-normal">/month</span></p>
          <ul className="text-sm text-gray-600 space-y-2 mb-4">
            <li>• AI meal planning</li>
            <li>• Smart grocery lists</li>
            <li>• Advanced insights</li>
            <li>• Nutrition recommendations</li>
          </ul>
          <button 
            className={`w-full py-2 rounded-md ${
              user?.subscriptionTier === 'premium' 
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                : 'btn-primary'
            }`}
            disabled={user?.subscriptionTier === 'premium'}
          >
            {user?.subscriptionTier === 'premium' ? 'Current Plan' : 'Upgrade to Premium'}
          </button>
        </div>

        <div className="card border-2 border-accent">
          <h3 className="font-semibold text-lg mb-2">Pro</h3>
          <p className="text-2xl font-bold mb-4">$19.99<span className="text-sm font-normal">/month</span></p>
          <ul className="text-sm text-gray-600 space-y-2 mb-4">
            <li>• Everything in Premium</li>
            <li>• Personal nutrition coach</li>
            <li>• App integrations</li>
            <li>• Priority support</li>
          </ul>
          <button 
            className={`w-full py-2 rounded-md ${
              user?.subscriptionTier === 'pro' 
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                : 'btn-primary'
            }`}
            disabled={user?.subscriptionTier === 'pro'}
          >
            {user?.subscriptionTier === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
          </button>
        </div>
      </div>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Meal Reminders</h3>
            <p className="text-sm text-gray-600">Get reminded to log your meals</p>
          </div>
          <input type="checkbox" className="toggle" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Weekly Insights</h3>
            <p className="text-sm text-gray-600">Receive weekly nutrition analysis</p>
          </div>
          <input type="checkbox" className="toggle" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Goal Achievements</h3>
            <p className="text-sm text-gray-600">Celebrate when you hit your goals</p>
          </div>
          <input type="checkbox" className="toggle" defaultChecked />
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Product Updates</h3>
            <p className="text-sm text-gray-600">Stay informed about new features</p>
          </div>
          <input type="checkbox" className="toggle" />
        </div>
      </div>
    </div>
  )

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Privacy & Data</h2>
      
      <div className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Data Export</h3>
          <p className="text-sm text-gray-600 mb-4">
            Download all your nutrition data and meal logs in CSV format.
          </p>
          <button className="btn-outline">Export My Data</button>
        </div>
        
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Account Deletion</h3>
          <p className="text-sm text-gray-600 mb-4">
            Permanently delete your account and all associated data.
          </p>
          <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab()
      case 'subscription':
        return renderSubscriptionTab()
      case 'notifications':
        return renderNotificationsTab()
      case 'privacy':
        return renderPrivacyTab()
      default:
        return renderProfileTab()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and settings</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-64 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 card">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default Profile