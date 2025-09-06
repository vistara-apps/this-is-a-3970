import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
})

export default openai

// Meal planning prompts
export const MEAL_PLANNING_PROMPTS = {
  GENERATE_WEEKLY_PLAN: (userPreferences) => `
    Generate a personalized weekly meal plan for a user with the following preferences:
    - Dietary restrictions: ${userPreferences.dietaryPreferences?.join(', ') || 'None'}
    - Fitness goals: ${userPreferences.fitnessGoals || 'General health'}
    - Allergies: ${userPreferences.allergies?.join(', ') || 'None'}
    - Preferred cuisines: ${userPreferences.preferredCuisines?.join(', ') || 'Any'}
    
    Please provide a JSON response with the following structure:
    {
      "week": "Date range",
      "meals": {
        "monday": {
          "breakfast": {"name": "Meal name", "calories": 000, "protein": 00, "carbs": 00, "fats": 00, "time": "prep time"},
          "lunch": {"name": "Meal name", "calories": 000, "protein": 00, "carbs": 00, "fats": 00, "time": "prep time"},
          "dinner": {"name": "Meal name", "calories": 000, "protein": 00, "carbs": 00, "fats": 00, "time": "prep time"},
          "snack": {"name": "Meal name", "calories": 000, "protein": 00, "carbs": 00, "fats": 00, "time": "prep time"}
        },
        // ... repeat for tuesday through sunday
      }
    }
    
    Ensure meals are balanced, varied, and align with the user's goals and restrictions.
  `,
  
  GENERATE_GROCERY_LIST: (mealPlan) => `
    Based on this meal plan, generate an optimized grocery list grouped by category:
    ${JSON.stringify(mealPlan)}
    
    Please provide a JSON response with the following structure:
    {
      "groceryList": [
        {
          "category": "Proteins",
          "items": ["item with quantity", "item with quantity"]
        },
        {
          "category": "Vegetables",
          "items": ["item with quantity", "item with quantity"]
        },
        // ... other categories like Fruits, Grains & Pantry, Dairy, etc.
      ]
    }
    
    Optimize quantities to minimize waste and group similar items together.
  `,
  
  ANALYZE_NUTRITION: (foodLogs, userGoals) => `
    Analyze the following food logs and provide personalized nutritional insights:
    Food logs: ${JSON.stringify(foodLogs)}
    User goals: ${userGoals}
    
    Please provide a JSON response with:
    {
      "insights": [
        {
          "type": "deficiency|excess|recommendation",
          "title": "Insight title",
          "message": "Detailed explanation",
          "actionableAdvice": "Specific recommendation"
        }
      ],
      "summary": {
        "totalCalories": 0,
        "avgProtein": 0,
        "avgCarbs": 0,
        "avgFats": 0,
        "trends": ["trend1", "trend2"]
      }
    }
  `
}
