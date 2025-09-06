import openai, { MEAL_PLANNING_PROMPTS } from '../config/openai'
import { supabase, TABLES } from '../config/supabase'

export class NutritionService {
  /**
   * Analyze food logs and generate personalized insights
   */
  static async analyzeNutrition(foodLogs, userGoals) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a certified nutritionist and health expert. Always respond with valid JSON and provide actionable advice."
          },
          {
            role: "user",
            content: MEAL_PLANNING_PROMPTS.ANALYZE_NUTRITION(foodLogs, userGoals)
          }
        ],
        temperature: 0.6,
        max_tokens: 1500
      })

      const analysisText = response.choices[0].message.content
      const analysis = JSON.parse(analysisText)
      
      // Save insights to database if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()
      if (user && analysis.insights) {
        await this.saveNutritionalInsights(user.id, analysis.insights)
      }
      
      return analysis
    } catch (error) {
      console.error('Error analyzing nutrition:', error)
      return this.getFallbackAnalysis(foodLogs)
    }
  }

  /**
   * Calculate daily nutritional summary
   */
  static calculateDailySummary(foodLogs) {
    const today = new Date().toDateString()
    const todayLogs = foodLogs.filter(log => 
      new Date(log.timestamp).toDateString() === today
    )

    const summary = todayLogs.reduce((acc, log) => {
      const nutrition = log.nutritionalInfo
      return {
        totalCalories: acc.totalCalories + (nutrition.calories || 0),
        totalProtein: acc.totalProtein + (nutrition.protein || 0),
        totalCarbs: acc.totalCarbs + (nutrition.carbs || 0),
        totalFats: acc.totalFats + (nutrition.fats || 0),
        mealCount: acc.mealCount + 1
      }
    }, {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      mealCount: 0
    })

    return summary
  }

  /**
   * Calculate weekly trends
   */
  static calculateWeeklyTrends(foodLogs) {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const weekLogs = foodLogs.filter(log => 
      new Date(log.timestamp) >= oneWeekAgo
    )

    // Group by day
    const dailyData = {}
    weekLogs.forEach(log => {
      const day = new Date(log.timestamp).toDateString()
      if (!dailyData[day]) {
        dailyData[day] = { calories: 0, protein: 0, carbs: 0, fats: 0, count: 0 }
      }
      
      const nutrition = log.nutritionalInfo
      dailyData[day].calories += nutrition.calories || 0
      dailyData[day].protein += nutrition.protein || 0
      dailyData[day].carbs += nutrition.carbs || 0
      dailyData[day].fats += nutrition.fats || 0
      dailyData[day].count += 1
    })

    // Calculate averages
    const days = Object.keys(dailyData)
    const avgCalories = days.reduce((sum, day) => sum + dailyData[day].calories, 0) / days.length
    const avgProtein = days.reduce((sum, day) => sum + dailyData[day].protein, 0) / days.length
    const avgCarbs = days.reduce((sum, day) => sum + dailyData[day].carbs, 0) / days.length
    const avgFats = days.reduce((sum, day) => sum + dailyData[day].fats, 0) / days.length

    return {
      avgCalories: Math.round(avgCalories) || 0,
      avgProtein: Math.round(avgProtein) || 0,
      avgCarbs: Math.round(avgCarbs) || 0,
      avgFats: Math.round(avgFats) || 0,
      dailyData: Object.entries(dailyData).map(([date, data]) => ({
        date,
        ...data
      }))
    }
  }

  /**
   * Save nutritional insights to database
   */
  static async saveNutritionalInsights(userId, insights) {
    try {
      const insightsToSave = insights.map(insight => ({
        user_id: userId,
        insight_type: insight.type,
        title: insight.title,
        message: insight.message,
        actionable_advice: insight.actionableAdvice,
        date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString()
      }))

      const { data, error } = await supabase
        .from(TABLES.NUTRITIONAL_INSIGHTS)
        .insert(insightsToSave)

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error saving nutritional insights:', error)
      throw error
    }
  }

  /**
   * Get user's nutritional insights
   */
  static async getUserInsights(userId, limit = 20) {
    try {
      const { data, error } = await supabase
        .from(TABLES.NUTRITIONAL_INSIGHTS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching insights:', error)
      return []
    }
  }

  /**
   * Save food log to database
   */
  static async saveFoodLog(userId, foodLog) {
    try {
      const { data, error } = await supabase
        .from(TABLES.FOOD_LOGS)
        .insert({
          user_id: userId,
          meal_name: foodLog.mealName,
          timestamp: foodLog.timestamp,
          nutritional_info: foodLog.nutritionalInfo,
          quantity: foodLog.quantity,
          created_at: new Date().toISOString()
        })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error saving food log:', error)
      throw error
    }
  }

  /**
   * Get user's food logs
   */
  static async getUserFoodLogs(userId, limit = 100) {
    try {
      const { data, error } = await supabase
        .from(TABLES.FOOD_LOGS)
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit)

      if (error) throw error
      
      // Transform data to match frontend format
      return data.map(log => ({
        id: log.id,
        mealName: log.meal_name,
        timestamp: log.timestamp,
        nutritionalInfo: log.nutritional_info,
        quantity: log.quantity
      }))
    } catch (error) {
      console.error('Error fetching food logs:', error)
      return []
    }
  }

  /**
   * Fallback analysis when AI fails
   */
  static getFallbackAnalysis(foodLogs) {
    const summary = this.calculateDailySummary(foodLogs)
    const trends = this.calculateWeeklyTrends(foodLogs)
    
    const insights = []
    
    // Basic calorie analysis
    if (summary.totalCalories < 1200) {
      insights.push({
        type: 'deficiency',
        title: 'Low Calorie Intake',
        message: 'Your daily calorie intake appears to be below recommended levels.',
        actionableAdvice: 'Consider adding healthy, calorie-dense foods like nuts, avocados, or whole grains to your meals.'
      })
    } else if (summary.totalCalories > 2500) {
      insights.push({
        type: 'excess',
        title: 'High Calorie Intake',
        message: 'Your daily calorie intake is higher than typical recommendations.',
        actionableAdvice: 'Focus on portion control and choose nutrient-dense, lower-calorie foods.'
      })
    }
    
    // Protein analysis
    if (summary.totalProtein < 50) {
      insights.push({
        type: 'deficiency',
        title: 'Low Protein Intake',
        message: 'Your protein intake could be increased for better muscle maintenance and satiety.',
        actionableAdvice: 'Include lean proteins like chicken, fish, beans, or Greek yogurt in each meal.'
      })
    }
    
    // General recommendation
    insights.push({
      type: 'recommendation',
      title: 'Balanced Nutrition',
      message: 'Maintaining a balanced diet with variety is key to optimal health.',
      actionableAdvice: 'Try to include a variety of colorful fruits and vegetables, whole grains, and lean proteins in your daily meals.'
    })

    return {
      insights,
      summary: {
        totalCalories: summary.totalCalories,
        avgProtein: trends.avgProtein,
        avgCarbs: trends.avgCarbs,
        avgFats: trends.avgFats,
        trends: ['Consistent meal logging', 'Room for more variety']
      }
    }
  }

  /**
   * Get nutrition recommendations based on user goals
   */
  static getNutritionRecommendations(userGoals, currentIntake) {
    const recommendations = []
    
    switch (userGoals?.toLowerCase()) {
      case 'weight loss':
        recommendations.push({
          category: 'Calorie Management',
          advice: 'Create a moderate calorie deficit of 300-500 calories per day',
          target: 'Aim for 1200-1500 calories daily (adjust based on activity level)'
        })
        recommendations.push({
          category: 'Protein',
          advice: 'Increase protein to maintain muscle mass during weight loss',
          target: 'Aim for 1.2-1.6g protein per kg body weight'
        })
        break
        
      case 'muscle gain':
        recommendations.push({
          category: 'Calorie Surplus',
          advice: 'Maintain a slight calorie surplus of 200-500 calories per day',
          target: 'Focus on nutrient-dense, high-calorie foods'
        })
        recommendations.push({
          category: 'Protein',
          advice: 'Higher protein intake supports muscle protein synthesis',
          target: 'Aim for 1.6-2.2g protein per kg body weight'
        })
        break
        
      default:
        recommendations.push({
          category: 'Balanced Nutrition',
          advice: 'Focus on a well-rounded diet with all macronutrients',
          target: 'Aim for 45-65% carbs, 20-35% fats, 10-35% protein'
        })
    }
    
    return recommendations
  }
}
