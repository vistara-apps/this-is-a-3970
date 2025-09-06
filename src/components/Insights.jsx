import React, { useState } from 'react'
import { TrendingUp, TrendingDown, Target, AlertCircle, CheckCircle, BarChart3 } from 'lucide-react'

const Insights = ({ user }) => {
  const [timeframe, setTimeframe] = useState('week')

  const insights = [
    {
      type: 'success',
      title: 'Protein Goal Achievement',
      message: 'Great job! You\'ve consistently met your protein goals this week.',
      value: '95%',
      trend: 'up',
      icon: CheckCircle,
      color: 'green'
    },
    {
      type: 'warning',
      title: 'Fiber Intake Low',
      message: 'Consider adding more vegetables and whole grains to boost fiber intake.',
      value: '18g avg',
      trend: 'down',
      icon: AlertCircle,
      color: 'orange'
    },
    {
      type: 'info',
      title: 'Calorie Balance',
      message: 'Your calorie intake is well-balanced with your fitness goals.',
      value: '2,150 avg',
      trend: 'stable',
      icon: Target,
      color: 'blue'
    }
  ]

  const weeklyTrends = {
    calories: [1950, 2100, 1980, 2200, 2050, 2180, 2000],
    protein: [85, 92, 78, 98, 88, 95, 82],
    carbs: [220, 240, 210, 260, 230, 250, 225],
    fats: [70, 75, 68, 82, 72, 78, 70]
  }

  const nutritionalBreakdown = {
    vitamins: [
      { name: 'Vitamin D', value: 65, target: 100, unit: 'IU' },
      { name: 'Vitamin B12', value: 85, target: 100, unit: 'mcg' },
      { name: 'Iron', value: 78, target: 100, unit: 'mg' },
      { name: 'Calcium', value: 92, target: 100, unit: 'mg' }
    ],
    macros: [
      { name: 'Protein', percentage: 25, color: 'bg-green-500' },
      { name: 'Carbohydrates', percentage: 45, color: 'bg-blue-500' },
      { name: 'Fats', percentage: 30, color: 'bg-purple-500' }
    ]
  }

  const ProgressBar = ({ value, target, color = 'primary' }) => {
    const percentage = Math.min((value / target) * 100, 100)
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            color === 'green' ? 'bg-green-500' :
            color === 'orange' ? 'bg-orange-500' :
            color === 'red' ? 'bg-red-500' :
            'bg-primary'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    )
  }

  const TrendChart = ({ data, label, color }) => {
    const max = Math.max(...data)
    const min = Math.min(...data)
    
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">{label}</h4>
        <div className="flex items-end space-x-1 h-16">
          {data.map((value, index) => (
            <div
              key={index}
              className={`flex-1 ${color} rounded-t`}
              style={{
                height: `${((value - min) / (max - min)) * 100}%`,
                minHeight: '8px'
              }}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Nutrition Insights</h1>
          <p className="text-gray-600">Personalized analysis of your nutrition patterns</p>
        </div>
        
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
        </select>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {insights.map((insight, index) => {
          const Icon = insight.icon
          const TrendIcon = insight.trend === 'up' ? TrendingUp : 
                          insight.trend === 'down' ? TrendingDown : Target
          
          return (
            <div key={index} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${
                  insight.color === 'green' ? 'bg-green-100' :
                  insight.color === 'orange' ? 'bg-orange-100' :
                  insight.color === 'red' ? 'bg-red-100' :
                  'bg-blue-100'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    insight.color === 'green' ? 'text-green-600' :
                    insight.color === 'orange' ? 'text-orange-600' :
                    insight.color === 'red' ? 'text-red-600' :
                    'text-blue-600'
                  }`} />
                </div>
                <div className="flex items-center space-x-1">
                  <TrendIcon className={`h-4 w-4 ${
                    insight.trend === 'up' ? 'text-green-500' :
                    insight.trend === 'down' ? 'text-red-500' :
                    'text-gray-500'
                  }`} />
                  <span className="text-lg font-bold text-gray-900">{insight.value}</span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{insight.title}</h3>
              <p className="text-sm text-gray-600">{insight.message}</p>
            </div>
          )
        })}
      </div>

      {/* Weekly Trends */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-gray-900">Weekly Nutrition Trends</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <TrendChart 
            data={weeklyTrends.calories} 
            label="Calories" 
            color="bg-primary" 
          />
          <TrendChart 
            data={weeklyTrends.protein} 
            label="Protein (g)" 
            color="bg-green-500" 
          />
          <TrendChart 
            data={weeklyTrends.carbs} 
            label="Carbs (g)" 
            color="bg-blue-500" 
          />
          <TrendChart 
            data={weeklyTrends.fats} 
            label="Fats (g)" 
            color="bg-purple-500" 
          />
        </div>
      </div>

      {/* Nutritional Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vitamin & Mineral Status */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Vitamin & Mineral Status</h2>
          <div className="space-y-4">
            {nutritionalBreakdown.vitamins.map((vitamin, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{vitamin.name}</span>
                  <span className="text-sm text-gray-500">
                    {vitamin.value}% of RDA
                  </span>
                </div>
                <ProgressBar 
                  value={vitamin.value} 
                  target={100}
                  color={vitamin.value >= 100 ? 'green' : vitamin.value >= 70 ? 'primary' : 'orange'}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Macronutrient Distribution */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Macronutrient Distribution</h2>
          <div className="space-y-4">
            {nutritionalBreakdown.macros.map((macro, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-4 h-4 rounded ${macro.color}`} />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{macro.name}</span>
                    <span className="text-sm text-gray-500">{macro.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${macro.color}`}
                      style={{ width: `${macro.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Recommendation</h3>
            <p className="text-sm text-gray-600">
              Your macronutrient distribution aligns well with your {user?.fitnessGoals?.toLowerCase() || 'fitness'} goals. 
              Consider maintaining this balance for optimal results.
            </p>
          </div>
        </div>
      </div>

      {/* Personalized Recommendations */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Personalized Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-medium text-green-800 mb-2">✅ Keep Doing</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Consistent protein intake throughout the week</li>
              <li>• Good hydration based on meal timing</li>
              <li>• Balanced meal frequency</li>
            </ul>
          </div>
          
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h3 className="font-medium text-orange-800 mb-2">⚠️ Areas to Improve</h3>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Increase fiber-rich vegetables</li>
              <li>• Add more omega-3 sources</li>
              <li>• Consider vitamin D supplementation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Insights