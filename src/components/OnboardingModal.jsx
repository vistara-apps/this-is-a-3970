import React, { useState } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'

const OnboardingModal = ({ onComplete }) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dietaryPreferences: [],
    fitnessGoals: '',
    allergies: [],
    subscriptionTier: 'free'
  })

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

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleComplete = () => {
    onComplete(formData)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to NutriGenius!
              </h2>
              <p className="text-gray-600">
                Let's personalize your nutrition journey. First, tell us about yourself.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="input"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="input"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Dietary Preferences
              </h2>
              <p className="text-gray-600">
                Select any dietary preferences that apply to you.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {dietaryOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleArrayToggle('dietaryPreferences', option)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                    formData.dietaryPreferences.includes(option)
                      ? 'border-primary bg-primary bg-opacity-10 text-primary'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Fitness Goals & Allergies
              </h2>
              <p className="text-gray-600">
                Help us understand your fitness goals and any allergies.
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Primary Fitness Goal
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {fitnessGoalsOptions.map((goal) => (
                    <button
                      key={goal}
                      onClick={() => handleInputChange('fitnessGoals', goal)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                        formData.fitnessGoals === goal
                          ? 'border-primary bg-primary bg-opacity-10 text-primary'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Allergies & Restrictions
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {allergyOptions.map((allergy) => (
                    <button
                      key={allergy}
                      onClick={() => handleArrayToggle('allergies', allergy)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                        formData.allergies.includes(allergy)
                          ? 'border-primary bg-primary bg-opacity-10 text-primary'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {allergy}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choose Your Plan
              </h2>
              <p className="text-gray-600">
                Select a subscription tier that fits your needs.
              </p>
            </div>
            
            <div className="space-y-4">
              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  formData.subscriptionTier === 'free'
                    ? 'border-primary bg-primary bg-opacity-10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleInputChange('subscriptionTier', 'free')}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">Free</h3>
                    <p className="text-gray-600 text-sm">Basic meal suggestions</p>
                  </div>
                  <span className="font-bold text-xl">$0</span>
                </div>
              </div>
              
              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  formData.subscriptionTier === 'premium'
                    ? 'border-primary bg-primary bg-opacity-10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleInputChange('subscriptionTier', 'premium')}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">Premium</h3>
                    <p className="text-gray-600 text-sm">Advanced meal planning & AI insights</p>
                  </div>
                  <span className="font-bold text-xl">$9.99/mo</span>
                </div>
              </div>
              
              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  formData.subscriptionTier === 'pro'
                    ? 'border-primary bg-primary bg-opacity-10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleInputChange('subscriptionTier', 'pro')}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">Pro</h3>
                    <p className="text-gray-600 text-sm">Personalized coaching & integrations</p>
                  </div>
                  <span className="font-bold text-xl">$19.99/mo</span>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Step {step} of 4</span>
              <span>{Math.round((step / 4) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {renderStep()}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-800"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
            
            {step < 4 ? (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 btn-primary"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="btn-primary"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingModal