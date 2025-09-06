import openai, { MEAL_PLANNING_PROMPTS } from '../config/openai'
import { supabase, TABLES } from '../config/supabase'

export class MealPlanningService {
  /**
   * Generate AI-powered weekly meal plan
   */
  static async generateWeeklyMealPlan(userPreferences) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a professional nutritionist and meal planning expert. Always respond with valid JSON."
          },
          {
            role: "user",
            content: MEAL_PLANNING_PROMPTS.GENERATE_WEEKLY_PLAN(userPreferences)
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })

      const mealPlanText = response.choices[0].message.content
      const mealPlan = JSON.parse(mealPlanText)
      
      // Save to database if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await this.saveMealPlan(user.id, mealPlan)
      }
      
      return mealPlan
    } catch (error) {
      console.error('Error generating meal plan:', error)
      // Return fallback meal plan
      return this.getFallbackMealPlan()
    }
  }

  /**
   * Generate smart grocery list from meal plan
   */
  static async generateGroceryList(mealPlan) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a grocery shopping expert. Always respond with valid JSON."
          },
          {
            role: "user",
            content: MEAL_PLANNING_PROMPTS.GENERATE_GROCERY_LIST(mealPlan)
          }
        ],
        temperature: 0.5,
        max_tokens: 1000
      })

      const groceryListText = response.choices[0].message.content
      const groceryData = JSON.parse(groceryListText)
      
      return groceryData.groceryList
    } catch (error) {
      console.error('Error generating grocery list:', error)
      return this.getFallbackGroceryList()
    }
  }

  /**
   * Save meal plan to database
   */
  static async saveMealPlan(userId, mealPlan) {
    try {
      const { data, error } = await supabase
        .from(TABLES.MEAL_PLANS)
        .insert({
          user_id: userId,
          meal_plan_data: mealPlan,
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          created_at: new Date().toISOString()
        })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error saving meal plan:', error)
      throw error
    }
  }

  /**
   * Get user's meal plans
   */
  static async getUserMealPlans(userId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from(TABLES.MEAL_PLANS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching meal plans:', error)
      return []
    }
  }

  /**
   * Fallback meal plan when AI fails
   */
  static getFallbackMealPlan() {
    const currentDate = new Date()
    const endDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    return {
      week: `${currentDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      meals: {
        monday: {
          breakfast: { name: 'Overnight Oats with Berries', calories: 320, protein: 12, carbs: 45, fats: 8, time: '10 min' },
          lunch: { name: 'Mediterranean Quinoa Bowl', calories: 485, protein: 18, carbs: 65, fats: 15, time: '15 min' },
          dinner: { name: 'Grilled Salmon with Asparagus', calories: 420, protein: 35, carbs: 12, fats: 22, time: '25 min' },
          snack: { name: 'Greek Yogurt with Almonds', calories: 180, protein: 15, carbs: 12, fats: 8, time: '2 min' }
        },
        tuesday: {
          breakfast: { name: 'Avocado Toast with Eggs', calories: 380, protein: 16, carbs: 28, fats: 22, time: '8 min' },
          lunch: { name: 'Chicken Caesar Salad', calories: 450, protein: 32, carbs: 18, fats: 28, time: '10 min' },
          dinner: { name: 'Veggie Stir-fry with Tofu', calories: 390, protein: 22, carbs: 35, fats: 18, time: '20 min' },
          snack: { name: 'Apple with Peanut Butter', calories: 200, protein: 8, carbs: 20, fats: 12, time: '2 min' }
        },
        wednesday: {
          breakfast: { name: 'Smoothie Bowl', calories: 350, protein: 14, carbs: 52, fats: 10, time: '5 min' },
          lunch: { name: 'Turkey and Hummus Wrap', calories: 420, protein: 25, carbs: 45, fats: 16, time: '5 min' },
          dinner: { name: 'Baked Cod with Sweet Potato', calories: 380, protein: 28, carbs: 35, fats: 12, time: '30 min' },
          snack: { name: 'Mixed Nuts', calories: 160, protein: 6, carbs: 6, fats: 14, time: '1 min' }
        },
        thursday: {
          breakfast: { name: 'Chia Pudding', calories: 290, protein: 10, carbs: 32, fats: 15, time: '5 min prep' },
          lunch: { name: 'Lentil Soup with Bread', calories: 380, protein: 18, carbs: 58, fats: 8, time: '10 min' },
          dinner: { name: 'Chicken Stir-fry', calories: 410, protein: 30, carbs: 28, fats: 18, time: '20 min' },
          snack: { name: 'Cottage Cheese with Berries', calories: 150, protein: 12, carbs: 15, fats: 4, time: '2 min' }
        },
        friday: {
          breakfast: { name: 'Protein Pancakes', calories: 340, protein: 20, carbs: 38, fats: 12, time: '15 min' },
          lunch: { name: 'Buddha Bowl', calories: 460, protein: 16, carbs: 62, fats: 18, time: '12 min' },
          dinner: { name: 'Grilled Chicken with Quinoa', calories: 440, protein: 35, carbs: 32, fats: 16, time: '25 min' },
          snack: { name: 'Dark Chocolate and Almonds', calories: 180, protein: 5, carbs: 12, fats: 14, time: '1 min' }
        },
        saturday: {
          breakfast: { name: 'Weekend Omelet', calories: 360, protein: 18, carbs: 8, fats: 28, time: '12 min' },
          lunch: { name: 'Quinoa Salad', calories: 420, protein: 14, carbs: 55, fats: 16, time: '10 min' },
          dinner: { name: 'Pasta with Marinara', calories: 480, protein: 16, carbs: 72, fats: 14, time: '20 min' },
          snack: { name: 'Protein Smoothie', calories: 220, protein: 18, carbs: 25, fats: 6, time: '3 min' }
        },
        sunday: {
          breakfast: { name: 'French Toast', calories: 380, protein: 12, carbs: 48, fats: 16, time: '15 min' },
          lunch: { name: 'Grilled Vegetable Sandwich', calories: 350, protein: 12, carbs: 52, fats: 12, time: '8 min' },
          dinner: { name: 'Beef and Broccoli', calories: 420, protein: 28, carbs: 22, fats: 22, time: '25 min' },
          snack: { name: 'Trail Mix', calories: 190, protein: 6, carbs: 18, fats: 12, time: '1 min' }
        }
      }
    }
  }

  /**
   * Fallback grocery list
   */
  static getFallbackGroceryList() {
    return [
      {
        category: 'Proteins',
        items: ['Salmon fillets (2 lbs)', 'Chicken breast (1.5 lbs)', 'Tofu (14 oz)', 'Greek yogurt (32 oz)', 'Eggs (dozen)', 'Turkey slices (1 lb)']
      },
      {
        category: 'Vegetables',
        items: ['Asparagus (1 bunch)', 'Mixed greens (5 oz)', 'Avocados (3)', 'Bell peppers (3)', 'Broccoli (1 head)', 'Sweet potatoes (3)']
      },
      {
        category: 'Grains & Pantry',
        items: ['Quinoa (2 cups)', 'Rolled oats (18 oz)', 'Whole grain bread', 'Olive oil', 'Pasta (1 lb)', 'Brown rice (2 lbs)']
      },
      {
        category: 'Fruits',
        items: ['Mixed berries (12 oz)', 'Apples (4)', 'Lemons (2)', 'Bananas (6)', 'Oranges (4)']
      },
      {
        category: 'Nuts & Seeds',
        items: ['Almonds (8 oz)', 'Peanut butter (18 oz)', 'Chia seeds (8 oz)', 'Mixed nuts (6 oz)']
      },
      {
        category: 'Dairy',
        items: ['Milk (64 oz)', 'Cottage cheese (16 oz)', 'Cheese slices (8 oz)']
      }
    ]
  }
}
