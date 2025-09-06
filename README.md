# NutriGenius 🥗

Your AI-powered personalized nutrition planner and tracker.

## Overview

NutriGenius helps individuals easily plan meals, track nutrition, and gain insights to achieve their health goals, acting as a personalized nutrition hub.

### Key Features

- **AI-Generated Weekly Meal Plans**: Customized meal plans based on dietary restrictions, fitness goals, and preferences
- **Smart Grocery List Generation**: Automatically creates optimized grocery lists from meal plans
- **Simplified Food Logging**: Quick and easy meal tracking with nutritional analysis
- **Personalized Nutritional Feedback**: AI-powered insights and recommendations

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **AI**: OpenAI GPT-3.5 Turbo
- **Payments**: Stripe
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Supabase account
- OpenAI API key
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nutrigenius
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your API keys and configuration:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_OPENAI_API_KEY=your-openai-api-key
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
   VITE_STRIPE_PREMIUM_PRICE_ID=price_premium_monthly
   VITE_STRIPE_PRO_PRICE_ID=price_pro_monthly
   ```

4. **Set up Supabase database**
   
   Run these SQL commands in your Supabase SQL editor:

   ```sql
   -- Create users table
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

   -- Create meal_plans table
   CREATE TABLE meal_plans (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
     meal_plan_data JSONB NOT NULL,
     start_date DATE NOT NULL,
     end_date DATE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create food_logs table
   CREATE TABLE food_logs (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
     meal_name TEXT NOT NULL,
     timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
     nutritional_info JSONB NOT NULL,
     quantity TEXT DEFAULT '1 serving',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create nutritional_insights table
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

   -- Enable Row Level Security
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
   ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;
   ALTER TABLE nutritional_insights ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
   CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
   CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

   CREATE POLICY "Users can view own meal plans" ON meal_plans FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert own meal plans" ON meal_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update own meal plans" ON meal_plans FOR UPDATE USING (auth.uid() = user_id);
   CREATE POLICY "Users can delete own meal plans" ON meal_plans FOR DELETE USING (auth.uid() = user_id);

   CREATE POLICY "Users can view own food logs" ON food_logs FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert own food logs" ON food_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update own food logs" ON food_logs FOR UPDATE USING (auth.uid() = user_id);
   CREATE POLICY "Users can delete own food logs" ON food_logs FOR DELETE USING (auth.uid() = user_id);

   CREATE POLICY "Users can view own insights" ON nutritional_insights FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert own insights" ON nutritional_insights FOR INSERT WITH CHECK (auth.uid() = user_id);
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # React components
├── config/             # Configuration files
│   ├── supabase.js     # Supabase client setup
│   ├── openai.js       # OpenAI client and prompts
│   └── stripe.js       # Stripe configuration
├── services/           # API service classes
│   ├── authService.js      # Authentication
│   ├── mealPlanningService.js  # Meal planning
│   ├── nutritionService.js    # Nutrition tracking
│   └── subscriptionService.js # Stripe integration
├── hooks/              # Custom React hooks
│   ├── useAuth.js      # Authentication state
│   ├── useMealPlanning.js  # Meal planning state
│   └── useNutrition.js     # Nutrition tracking state
├── utils/              # Utility functions
└── App.jsx             # Main app component
```

## Features Implementation Status

### ✅ Completed Features

1. **User Interface & Design System**
   - Complete React app with responsive design
   - Tailwind CSS with custom design tokens
   - Component library with consistent styling

2. **User Onboarding**
   - Multi-step onboarding modal
   - User preference collection
   - Profile setup and management

3. **Core Navigation**
   - Dashboard with overview
   - Meal planning interface
   - Food logging system
   - Insights and analytics
   - User profile management

4. **API Integration Setup**
   - Supabase configuration for backend
   - OpenAI integration for AI features
   - Stripe setup for subscriptions
   - Service layer architecture

5. **State Management**
   - Custom hooks for data management
   - Authentication context
   - Real-time data synchronization

### 🔧 API Integration Features

1. **AI-Powered Meal Planning**
   - OpenAI GPT-3.5 integration
   - Personalized meal plan generation
   - Dietary restriction handling
   - Meal swapping functionality

2. **Smart Grocery Lists**
   - AI-generated shopping lists
   - Category-based organization
   - Quantity optimization

3. **Nutritional Analysis**
   - AI-powered insights generation
   - Trend analysis and recommendations
   - Goal tracking and progress monitoring

4. **User Authentication**
   - Supabase Auth integration
   - User profile management
   - Session handling

5. **Subscription Management**
   - Stripe payment processing
   - Tier-based feature access
   - Usage limit enforcement

## Subscription Tiers

### Free Tier
- Basic meal suggestions
- Simple food logging
- Basic nutritional info
- Limited meal plans (3 per month)

### Premium ($9.99/month)
- AI-powered meal planning
- Smart grocery lists
- Advanced nutritional insights
- Unlimited meal plans
- Custom dietary preferences
- Weekly progress reports

### Pro ($19.99/month)
- Everything in Premium
- Personalized nutrition coaching
- Integration with fitness apps
- Advanced analytics
- Priority support
- Custom meal preferences
- Nutritionist consultations

## Environment Setup

### Required API Keys

1. **Supabase**: Create a project at [supabase.com](https://supabase.com)
2. **OpenAI**: Get API key from [platform.openai.com](https://platform.openai.com)
3. **Stripe**: Set up account at [stripe.com](https://stripe.com)

### Development vs Production

- **Development**: Uses test keys and local storage fallbacks
- **Production**: Requires all API keys and proper database setup

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The app can be deployed to any static hosting service that supports:
- Node.js build process
- Environment variables
- SPA routing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the API service implementations

---

**NutriGenius** - Your AI-powered nutrition companion 🥗✨
