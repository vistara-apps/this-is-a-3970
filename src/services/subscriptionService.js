import stripePromise, { SUBSCRIPTION_TIERS } from '../config/stripe'
import { AuthService } from './authService'

export class SubscriptionService {
  /**
   * Create Stripe checkout session
   */
  static async createCheckoutSession(priceId, userId) {
    try {
      const stripe = await stripePromise
      
      // In a real app, this would call your backend API
      // For now, we'll simulate the process
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          successUrl: `${window.location.origin}/subscription/success`,
          cancelUrl: `${window.location.origin}/subscription/cancel`
        })
      })

      const session = await response.json()
      
      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      })

      if (result.error) {
        throw new Error(result.error.message)
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      throw error
    }
  }

  /**
   * Create Stripe customer portal session
   */
  static async createPortalSession(customerId) {
    try {
      // In a real app, this would call your backend API
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl: window.location.origin
        })
      })

      const session = await response.json()
      
      // Redirect to Stripe Customer Portal
      window.location.href = session.url
    } catch (error) {
      console.error('Error creating portal session:', error)
      throw error
    }
  }

  /**
   * Get subscription tier details
   */
  static getSubscriptionTier(tierId) {
    return SUBSCRIPTION_TIERS[tierId.toUpperCase()] || SUBSCRIPTION_TIERS.FREE
  }

  /**
   * Check if user can access feature based on subscription
   */
  static canAccessFeature(userTier, feature) {
    const tier = this.getSubscriptionTier(userTier)
    
    switch (feature) {
      case 'ai_meal_planning':
        return tier.id !== 'free'
      case 'unlimited_meal_plans':
        return tier.limits.mealPlansPerMonth === -1
      case 'advanced_insights':
        return tier.id === 'premium' || tier.id === 'pro'
      case 'nutrition_coaching':
        return tier.id === 'pro'
      case 'fitness_integrations':
        return tier.id === 'pro'
      default:
        return true
    }
  }

  /**
   * Check usage limits
   */
  static checkUsageLimit(userTier, limitType, currentUsage) {
    const tier = this.getSubscriptionTier(userTier)
    const limit = tier.limits[limitType]
    
    if (limit === -1) return { allowed: true, remaining: -1 }
    
    return {
      allowed: currentUsage < limit,
      remaining: Math.max(0, limit - currentUsage),
      limit
    }
  }

  /**
   * Get upgrade recommendations
   */
  static getUpgradeRecommendations(currentTier, usage) {
    const recommendations = []
    
    if (currentTier === 'free') {
      if (usage.mealPlansThisMonth >= 3) {
        recommendations.push({
          reason: 'You\'ve reached your monthly meal plan limit',
          suggestedTier: 'premium',
          benefit: 'Get unlimited AI-powered meal plans'
        })
      }
      
      if (usage.foodLogsToday >= 10) {
        recommendations.push({
          reason: 'You\'ve reached your daily food logging limit',
          suggestedTier: 'premium',
          benefit: 'Log unlimited meals and get detailed insights'
        })
      }
    }
    
    if (currentTier === 'premium') {
      recommendations.push({
        reason: 'Get personalized nutrition coaching',
        suggestedTier: 'pro',
        benefit: 'Access to certified nutritionists and advanced analytics'
      })
    }
    
    return recommendations
  }

  /**
   * Calculate subscription savings
   */
  static calculateSavings(tier, billingPeriod = 'monthly') {
    const tierData = this.getSubscriptionTier(tier)
    
    if (billingPeriod === 'yearly') {
      const monthlyTotal = tierData.price * 12
      const yearlyPrice = tierData.price * 10 // 2 months free
      return {
        monthlyTotal,
        yearlyPrice,
        savings: monthlyTotal - yearlyPrice,
        savingsPercentage: Math.round(((monthlyTotal - yearlyPrice) / monthlyTotal) * 100)
      }
    }
    
    return { savings: 0, savingsPercentage: 0 }
  }

  /**
   * Mock backend API calls (in production, these would be real API endpoints)
   */
  static async mockCreateCheckoutSession(priceId, userId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In production, this would create a real Stripe session
    return {
      id: 'cs_mock_' + Math.random().toString(36).substr(2, 9),
      url: 'https://checkout.stripe.com/pay/mock-session'
    }
  }

  static async mockCreatePortalSession(customerId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      url: 'https://billing.stripe.com/p/session/mock-portal'
    }
  }

  /**
   * Handle subscription upgrade
   */
  static async upgradeSubscription(userId, newTier) {
    try {
      const tierData = this.getSubscriptionTier(newTier)
      
      if (tierData.priceId) {
        await this.createCheckoutSession(tierData.priceId, userId)
      } else {
        // Free tier - just update the user
        await AuthService.updateSubscription(userId, newTier)
      }
    } catch (error) {
      console.error('Error upgrading subscription:', error)
      throw error
    }
  }

  /**
   * Handle subscription cancellation
   */
  static async cancelSubscription(userId, customerId) {
    try {
      // In production, this would call your backend to cancel the Stripe subscription
      await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId })
      })

      // Update user to free tier
      await AuthService.updateSubscription(userId, 'free')
    } catch (error) {
      console.error('Error canceling subscription:', error)
      throw error
    }
  }

  /**
   * Get billing history (mock)
   */
  static async getBillingHistory(customerId) {
    // In production, this would fetch from Stripe
    return [
      {
        id: 'in_mock_1',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        amount: 9.99,
        status: 'paid',
        description: 'NutriGenius Premium - Monthly'
      },
      {
        id: 'in_mock_2',
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        amount: 9.99,
        status: 'paid',
        description: 'NutriGenius Premium - Monthly'
      }
    ]
  }
}
