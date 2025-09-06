# NutriGenius API Documentation

This document outlines the complete API architecture and integration requirements for the NutriGenius application.

## Overview

NutriGenius integrates with three main external APIs:
1. **Supabase** - Backend as a Service (Database, Authentication)
2. **OpenAI** - AI-powered meal planning and nutritional insights
3. **Stripe** - Payment processing and subscription management

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  dietary_preferences TEXT[] DEFAULT '{}',
  fitness_goals TEXT DEFAULT '',
  allergies TEXT[] DEFAULT '{}',
  subscription_tier TEXT DEFAULT 'free',
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Meal Plans Table
```sql
CREATE TABLE meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  meal_plan_data JSONB NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Food Logs Table
```sql
CREATE TABLE food_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  meal_name TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  nutritional_info JSONB NOT NULL,
  quantity TEXT DEFAULT '1 serving',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Nutritional Insights Table
```sql
CREATE TABLE nutritional_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  insight_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  actionable_advice TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Services

### 1. Authentication Service (`authService.js`)

#### Methods

**`signUp(email, password, userData)`**
- Creates new user account
- Stores user profile in database
- Returns user and session objects

**`signIn(email, password)`**
- Authenticates existing user
- Returns user and session objects

**`signOut()`**
- Signs out current user
- Clears session data

**`getCurrentUser()`**
- Returns current authenticated user

**`getUserProfile(userId)`**
- Fetches user profile from database
- Returns user preferences and settings

**`updateUserProfile(userId, updates)`**
- Updates user profile information
- Handles dietary preferences, goals, allergies

### 2. Meal Planning Service (`mealPlanningService.js`)

#### Methods

**`generateWeeklyMealPlan(userPreferences)`**
- Calls OpenAI API with user preferences
- Generates personalized 7-day meal plan
- Saves plan to database
- Returns structured meal plan object

**`generateGroceryList(mealPlan)`**
- Analyzes meal plan ingredients
- Creates optimized shopping list
- Groups items by category
- Returns categorized grocery list

**`saveMealPlan(userId, mealPlan)`**
- Stores meal plan in database
- Associates with user account

**`getUserMealPlans(userId, limit)`**
- Retrieves user's meal plan history
- Returns paginated results

#### OpenAI Integration

**Meal Plan Generation Prompt:**
```javascript
const prompt = `
Generate a personalized weekly meal plan for a user with:
- Dietary restrictions: ${dietaryPreferences}
- Fitness goals: ${fitnessGoals}
- Allergies: ${allergies}

Return JSON with structure:
{
  "week": "Date range",
  "meals": {
    "monday": {
      "breakfast": {"name": "...", "calories": 000, "protein": 00, ...},
      "lunch": {"name": "...", "calories": 000, "protein": 00, ...},
      "dinner": {"name": "...", "calories": 000, "protein": 00, ...},
      "snack": {"name": "...", "calories": 000, "protein": 00, ...}
    },
    // ... other days
  }
}
`;
```

### 3. Nutrition Service (`nutritionService.js`)

#### Methods

**`analyzeNutrition(foodLogs, userGoals)`**
- Sends food logs to OpenAI for analysis
- Generates personalized insights
- Saves insights to database
- Returns analysis with recommendations

**`calculateDailySummary(foodLogs)`**
- Calculates daily nutritional totals
- Returns calories, protein, carbs, fats

**`calculateWeeklyTrends(foodLogs)`**
- Analyzes weekly nutrition patterns
- Returns trends and averages

**`saveFoodLog(userId, foodLog)`**
- Stores food entry in database
- Associates with user account

**`getUserFoodLogs(userId, limit)`**
- Retrieves user's food log history
- Returns paginated results

#### OpenAI Integration

**Nutrition Analysis Prompt:**
```javascript
const prompt = `
Analyze these food logs and provide insights:
Food logs: ${JSON.stringify(foodLogs)}
User goals: ${userGoals}

Return JSON with:
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
`;
```

### 4. Subscription Service (`subscriptionService.js`)

#### Methods

**`createCheckoutSession(priceId, userId)`**
- Creates Stripe checkout session
- Redirects to Stripe payment page

**`createPortalSession(customerId)`**
- Creates Stripe customer portal session
- Allows subscription management

**`getSubscriptionTier(tierId)`**
- Returns subscription tier details
- Includes features and limits

**`canAccessFeature(userTier, feature)`**
- Checks if user can access specific feature
- Enforces subscription limits

**`checkUsageLimit(userTier, limitType, currentUsage)`**
- Validates usage against tier limits
- Returns allowed status and remaining quota

#### Stripe Integration

**Subscription Tiers:**
- **Free**: $0/month - Basic features, limited usage
- **Premium**: $9.99/month - AI features, unlimited plans
- **Pro**: $19.99/month - All features, coaching, integrations

## Custom Hooks

### 1. useAuth Hook

Manages authentication state and provides auth methods:

```javascript
const {
  user,           // Current user object
  userProfile,    // User profile data
  session,        // Current session
  loading,        // Loading state
  signUp,         // Sign up method
  signIn,         // Sign in method
  signOut,        // Sign out method
  updateProfile   // Update profile method
} = useAuth();
```

### 2. useMealPlanning Hook

Manages meal planning state and operations:

```javascript
const {
  mealPlans,          // User's meal plans
  currentMealPlan,    // Active meal plan
  groceryList,        // Generated grocery list
  loading,            // Loading state
  error,              // Error state
  generateMealPlan,   // Generate new plan
  generateGroceryList, // Generate shopping list
  swapMeal,           // Replace specific meal
  getMealPlanStats    // Get nutritional stats
} = useMealPlanning();
```

### 3. useNutrition Hook

Manages nutrition tracking and analysis:

```javascript
const {
  foodLogs,           // User's food logs
  insights,           // Nutritional insights
  nutritionAnalysis,  // Analysis data
  loading,            // Loading state
  error,              // Error state
  addFoodLog,         // Add food entry
  deleteFoodLog,      // Remove food entry
  generateInsights,   // Generate AI insights
  getDailySummary,    // Get daily totals
  getProgressTowardsGoals // Goal progress
} = useNutrition();
```

## Environment Variables

Required environment variables for API integrations:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your-openai-api-key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
VITE_STRIPE_PREMIUM_PRICE_ID=price_premium_monthly
VITE_STRIPE_PRO_PRICE_ID=price_pro_monthly
```

## Error Handling

All API services implement comprehensive error handling:

1. **Network Errors**: Retry logic and fallback responses
2. **Authentication Errors**: Automatic token refresh
3. **Rate Limiting**: Exponential backoff
4. **Validation Errors**: User-friendly error messages
5. **Fallback Data**: Mock data when APIs are unavailable

## Security Considerations

1. **Row Level Security**: Supabase RLS policies protect user data
2. **API Key Protection**: Environment variables for sensitive keys
3. **Input Validation**: Sanitize all user inputs
4. **Rate Limiting**: Prevent API abuse
5. **HTTPS Only**: All API communications encrypted

## Performance Optimizations

1. **Caching**: Local storage for frequently accessed data
2. **Pagination**: Limit database query results
3. **Lazy Loading**: Load data on demand
4. **Debouncing**: Reduce API calls for user inputs
5. **Optimistic Updates**: Update UI before API confirmation

## Testing Strategy

1. **Unit Tests**: Test individual service methods
2. **Integration Tests**: Test API interactions
3. **Mock Services**: Test without external dependencies
4. **Error Scenarios**: Test failure cases
5. **Performance Tests**: Measure API response times

## Deployment Considerations

1. **Environment Separation**: Different keys for dev/staging/prod
2. **API Monitoring**: Track usage and performance
3. **Backup Strategies**: Database backups and recovery
4. **Scaling**: Handle increased API usage
5. **Documentation**: Keep API docs updated

## Future Enhancements

1. **Caching Layer**: Redis for improved performance
2. **Webhook Integration**: Real-time Stripe events
3. **Batch Processing**: Bulk operations for efficiency
4. **Analytics**: Track user behavior and API usage
5. **Third-party Integrations**: Fitness apps, food databases

---

This API documentation provides a complete overview of the NutriGenius backend architecture and integration requirements. All services are designed to be scalable, secure, and maintainable.
