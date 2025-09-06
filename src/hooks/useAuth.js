import { useState, useEffect, useContext, createContext } from 'react'
import { AuthService } from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const currentSession = await AuthService.getCurrentSession()
        setSession(currentSession)
        
        if (currentSession?.user) {
          setUser(currentSession.user)
          const profile = await AuthService.getUserProfile(currentSession.user.id)
          setUserProfile(profile)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = AuthService.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const profile = await AuthService.getUserProfile(session.user.id)
          setUserProfile(profile)
        } else {
          setUserProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, userData) => {
    try {
      const { user, session } = await AuthService.signUp(email, password, userData)
      return { user, session }
    } catch (error) {
      throw error
    }
  }

  const signIn = async (email, password) => {
    try {
      const { user, session } = await AuthService.signIn(email, password)
      return { user, session }
    } catch (error) {
      throw error
    }
  }

  const signOut = async () => {
    try {
      await AuthService.signOut()
      setUser(null)
      setUserProfile(null)
      setSession(null)
    } catch (error) {
      throw error
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in')
      
      await AuthService.updateUserProfile(user.id, updates)
      const updatedProfile = await AuthService.getUserProfile(user.id)
      setUserProfile(updatedProfile)
      
      return updatedProfile
    } catch (error) {
      throw error
    }
  }

  const resetPassword = async (email) => {
    try {
      return await AuthService.resetPassword(email)
    } catch (error) {
      throw error
    }
  }

  const updatePassword = async (newPassword) => {
    try {
      return await AuthService.updatePassword(newPassword)
    } catch (error) {
      throw error
    }
  }

  const value = {
    user,
    userProfile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
