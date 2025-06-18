import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { auth } from '../firebase'

interface AuthContextType {
  currentUser: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signInWithGoogle: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  function register(email: string, password: string): Promise<void> {
    return createUserWithEmailAndPassword(auth, email, password).then(() => {});
  }

  function login(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(auth, email, password).then(() => {});
  }

  function logout() {
    return signOut(auth)
  }

  async function signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    register,
    logout,
    signInWithGoogle
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}