import { supabase, TABLES } from '../config/supabase'

export class AuthService {
  /**
   * Sign up a new user
   */
  static async signUp(email, password, userData) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            dietary_preferences: userData.dietaryPreferences,
            fitness_goals: userData.fitnessGoals,
            allergies: userData.allergies
          }
        }
      })

      if (error) throw error

      // Create user profile in users table
      if (data.user) {
        await this.createUserProfile(data.user.id, userData)
      }

      return { user: data.user, session: data.session }
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    }
  }

  /**
   * Sign in existing user
   */
  static async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return { user: data.user, session: data.session }
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  }

  /**
   * Sign out current user
   */
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  /**
   * Get current session
   */
  static async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return session
    } catch (error) {
      console.error('Error getting current session:', error)
      return null
    }
  }

  /**
   * Create user profile in database
   */
  static async createUserProfile(userId, userData) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .insert({
          id: userId,
          name: userData.name,
          email: userData.email,
          dietary_preferences: userData.dietaryPreferences || [],
          fitness_goals: userData.fitnessGoals || '',
          allergies: userData.allergies || [],
          subscription_tier: 'free',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating user profile:', error)
      throw error
    }
  }

  /**
   * Get user profile
   */
  static async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  }

  /**
   * Update user subscription
   */
  static async updateSubscription(userId, subscriptionTier, stripeCustomerId = null) {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update({
          subscription_tier: subscriptionTier,
          stripe_customer_id: stripeCustomerId,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating subscription:', error)
      throw error
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error resetting password:', error)
      throw error
    }
  }

  /**
   * Update password
   */
  static async updatePassword(newPassword) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating password:', error)
      throw error
    }
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}
