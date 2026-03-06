"use client"

import { useState, useEffect, createContext, useContext } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Phone, Lock, User, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { authApi, ApiError } from "@/lib/api"

// Auth Context for global state management
interface User {
  id: string
  name: string
  email?: string
  phone?: string
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (user: User, token?: string) => void
  logout: () => void
  openLoginModal: (message?: string) => void
  closeLoginModal: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState<string | undefined>()

  useEffect(() => {
    // Check localStorage for existing user and token on mount
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        console.log('✅ User loaded from localStorage:', userData.name)
        console.log('✅ Token loaded from localStorage:', storedToken.substring(0, 20) + '...')
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      }
    } else if (storedUser && !storedToken) {
      // User exists but no token - clear user data
      console.warn('⚠️ User found but no token, clearing user data')
      localStorage.removeItem("user")
      setUser(null)
    } else if (!storedUser && storedToken) {
      // Token exists but no user - clear token
      console.warn('⚠️ Token found but no user, clearing token')
      localStorage.removeItem("token")
    } else {
      console.log('ℹ️ No stored authentication data found')
    }
    
    // Listen for storage events (when localStorage is modified in another tab/window)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user') {
        console.log('📦 Storage event detected:', e.key, e.newValue ? 'updated' : 'removed')
        if (e.key === 'user' && e.newValue) {
          try {
            const userData = JSON.parse(e.newValue)
            setUser(userData)
            console.log('✅ User updated from storage event')
          } catch (error) {
            console.error('Error parsing user from storage event:', error)
          }
        } else if (e.key === 'user' && !e.newValue) {
          setUser(null)
          console.log('⚠️ User removed from storage event')
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    setIsLoading(false)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const login = (userData: User, token?: string) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    if (token) {
      localStorage.setItem("token", token)
    }
    setIsModalOpen(false)
    setModalMessage(undefined)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token") // Also clear token on logout
  }

  const openLoginModal = (message?: string) => {
    setModalMessage(message)
    setIsModalOpen(true)
  }

  const closeLoginModal = () => {
    setIsModalOpen(false)
    setModalMessage(undefined)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        logout,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
      <LoginModal
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) closeLoginModal()
        }}
        message={modalMessage}
        onLogin={login}
      />
    </AuthContext.Provider>
  )
}

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  message?: string
  onLogin: (user: User, token?: string) => void
}

type AuthMode = "login" | "register" | "forgot-password" | "reset-password"
type ContactType = "email" | "phone"

function LoginModal({ open, onOpenChange, message, onLogin }: LoginModalProps) {
  const [mode, setMode] = useState<AuthMode>("login")
  const [contactType, setContactType] = useState<ContactType>("email")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [resetToken, setResetToken] = useState<string | null>(null)

  // Form fields
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (!open) {
      setEmail("")
      setPhone("")
      setPassword("")
      setConfirmPassword("")
      setName("")
      setError(null)
      setSuccess(null)
      setResetToken(null)
      setShowPassword(false)
      setShowConfirmPassword(false)
      setMode("login")
    }
  }, [open])

  useEffect(() => {
    setError(null)
    setSuccess(null)
  }, [mode])

  // Check for reset token in URL when modal opens
  useEffect(() => {
    if (open && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token')
      if (token) {
        setResetToken(token)
        setMode("reset-password")
      }
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      if (mode === "forgot-password") {
        // Request password reset
        if (!email) {
          throw new Error("Please enter your email address")
        }
        await authApi.requestPasswordReset(email)
        setSuccess("If an account with that email exists, a password reset link has been sent to your email.")
        setTimeout(() => {
          setMode("login")
        }, 3000)
        return
      }

      if (mode === "reset-password") {
        // Reset password with token
        if (!resetToken) {
          throw new Error("Reset token is missing")
        }
        if (!password) {
          throw new Error("Please enter your new password")
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters")
        }
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match")
        }
        await authApi.resetPassword(resetToken, password)
        setSuccess("Password has been reset successfully. You can now login with your new password.")
        setTimeout(() => {
          setMode("login")
          setResetToken(null)
        }, 2000)
        return
      }

      // Validation for login/register
      const contact = contactType === "email" ? email : phone
      if (!contact) {
        throw new Error(`Please enter your ${contactType === "email" ? "email address" : "phone number"}`)
      }

      if (!password) {
        throw new Error("Please enter your password")
      }

      if (mode === "register") {
        if (!name.trim()) {
          throw new Error("Please enter your name")
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters")
        }
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match")
        }
      }

      // Call backend API
      let response
      if (mode === "login") {
        // Login: pass email or phone (but not both)
        response = await authApi.login(
          contactType === "email" ? email : null,
          contactType === "phone" ? phone : null,
          password
        )
      } else {
        // Register: pass both email and phone (one can be empty string)
        response = await authApi.register(
          name.trim(),
          contactType === "email" ? email : "",
          contactType === "phone" ? phone : "",
          password
        )
      }

      // Create user object from response
      const userData: User = {
        id: response.user.id,
        name: response.user.name,
        ...(response.user.email ? { email: response.user.email } : {}),
        ...(response.user.phone ? { phone: response.user.phone } : {}),
      }

      onLogin(userData, response.token)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || "An error occurred")
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            {mode === "login" ? "Welcome Back" : 
             mode === "register" ? "Create Account" :
             mode === "forgot-password" ? "Reset Password" :
             "Set New Password"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {message || (mode === "login"
              ? "Sign in to access your account and favorites"
              : mode === "register"
              ? "Join us to save your favorites and bookings"
              : mode === "forgot-password"
              ? "Enter your email address and we'll send you a link to reset your password"
              : "Enter your new password below")}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 dark:text-green-400 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contact Type Toggle - Only for login/register */}
          {(mode === "login" || mode === "register") && (
            <div className="flex rounded-lg border border-border p-1 bg-muted/30">
              <button
                type="button"
                onClick={() => setContactType("email")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transition-all cursor-pointer",
                  contactType === "email"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Mail className="h-4 w-4" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setContactType("phone")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transition-all cursor-pointer",
                  contactType === "phone"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Phone className="h-4 w-4" />
                Phone
              </button>
            </div>
          )}

          {/* Forgot Password - Email Only */}
          {mode === "forgot-password" && (
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>
          )}

          {/* Name (Register only) */}
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>
          )}

          {/* Email/Phone Input - Only for login/register */}
          {(mode === "login" || mode === "register") && (
            <div className="space-y-2">
              <Label htmlFor="contact">
                {contactType === "email" ? "Email Address" : "Phone Number"}
              </Label>
              <div className="relative">
                {contactType === "email" ? (
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                ) : (
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                )}
                <Input
                  id="contact"
                  type={contactType === "email" ? "email" : "tel"}
                  placeholder={contactType === "email" ? "you@example.com" : "+212 6XX XXX XXX"}
                  value={contactType === "email" ? email : phone}
                  onChange={(e) =>
                    contactType === "email" ? setEmail(e.target.value) : setPhone(e.target.value)
                  }
                  className="pl-10 h-11"
                />
              </div>
            </div>
          )}

          {/* Password - For login, register, and reset-password */}
          {(mode === "login" || mode === "register" || mode === "reset-password") && (
            <div className="space-y-2">
              <Label htmlFor="password">
                {mode === "reset-password" ? "New Password" : "Password"}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === "reset-password" ? "Enter your new password" : "Enter your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Confirm Password (Register and Reset Password) */}
          {(mode === "register" || mode === "reset-password") && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 h-11 cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {mode === "login" ? "Signing in..." : 
                 mode === "register" ? "Creating account..." :
                 mode === "forgot-password" ? "Sending..." :
                 "Resetting password..."}
              </span>
            ) : (
              mode === "login" ? "Sign In" : 
              mode === "register" ? "Create Account" :
              mode === "forgot-password" ? "Send Reset Link" :
              "Reset Password"
            )}
          </Button>

          {/* Mode Toggle */}
          <div className="text-center text-sm text-muted-foreground">
            {mode === "login" && (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-primary hover:underline font-medium cursor-pointer"
                >
                  Sign up
                </button>
                {" · "}
                <button
                  type="button"
                  onClick={() => setMode("forgot-password")}
                  className="text-primary hover:underline font-medium cursor-pointer"
                >
                  Forgot password?
                </button>
              </>
            )}
            {mode === "register" && (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-primary hover:underline font-medium cursor-pointer"
                >
                  Sign in
                </button>
              </>
            )}
            {mode === "forgot-password" && (
              <>
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-primary hover:underline font-medium cursor-pointer"
                >
                  Sign in
                </button>
              </>
            )}
            {mode === "reset-password" && (
              <>
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-primary hover:underline font-medium cursor-pointer"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default LoginModal
