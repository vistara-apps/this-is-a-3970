import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export default stripePromise

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      'Basic meal suggestions',
      'Simple food logging',
      'Basic nutritional info',
      'Limited meal plans (3 per month)'
    ],
    limits: {
      mealPlansPerMonth: 3,
      foodLogsPerDay: 10,
      insightsPerWeek: 1
    }
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    priceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID,
    features: [
      'AI-powered meal planning',
      'Smart grocery lists',
      'Advanced nutritional insights',
      'Unlimited meal plans',
      'Custom dietary preferences',
      'Weekly progress reports'
    ],
    limits: {
      mealPlansPerMonth: -1, // unlimited
      foodLogsPerDay: -1,
      insightsPerWeek: -1
    }
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    priceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID,
    features: [
      'Everything in Premium',
      'Personalized nutrition coaching',
      'Integration with fitness apps',
      'Advanced analytics',
      'Priority support',
      'Custom meal preferences',
      'Nutritionist consultations'
    ],
    limits: {
      mealPlansPerMonth: -1,
      foodLogsPerDay: -1,
      insightsPerWeek: -1
    }
  }
}
