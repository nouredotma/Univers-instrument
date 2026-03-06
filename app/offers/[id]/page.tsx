"use client"

import FloatingContact from "@/components/floating-contact"
import Footer from "@/components/footer"
import Header from "@/components/header"
import { useLanguage } from "@/components/language-provider"
import { useAuth } from "@/components/login-modal"
import PageHero from "@/components/page-hero"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Container } from "@/components/ui/container"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { adminApi, authApi, bookingApi, offersApi, paymentApi, userApi, type ApiError } from "@/lib/api"
import { type Offer } from "@/lib/offers-data"
import { ArrowRight, Baby, Calendar, Car, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock, CreditCard, Info, Lightbulb, ListChecks, Loader2, MapPin, Phone, Play, Route, Shield, Sparkles, Ticket, User, Users, X } from "lucide-react"
import { notFound, useRouter } from "next/navigation"
import { use, useEffect, useMemo, useRef, useState } from "react"

interface OfferDetailsPageProps {
  params: Promise<{ id: string }>
}

export default function OfferDetailsPage({ params }: OfferDetailsPageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { isLoggedIn, openLoginModal, login, user } = useAuth()
  const { t, language } = useLanguage()

  const [offer, setOffer] = useState<Offer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const [showSameDayDialog, setShowSameDayDialog] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [bookingSuccessData, setBookingSuccessData] = useState<{ bookingReference?: string } | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'paypal' | 'card' | null>(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [promoCodeDetails, setPromoCodeDetails] = useState<{
    id: string;
    code: string;
    discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
    discountValue: number;
    minPurchase: number | null;
    maxDiscount: number | null;
    isValid: boolean;
    error?: string;
  } | null>(null)
  const [isValidatingPromoCode, setIsValidatingPromoCode] = useState(false)
  
  // Initialize formData with user info if logged in
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    date: "",
    adults: 1,
    children: 0,
    infants: 0,
    message: "",
    promoCode: "",
  })

  // Debounce timer for promo code validation (must be at top level with other hooks)
  const promoCodeValidationTimer = useRef<NodeJS.Timeout | null>(null)

  // Generate random password
  const generateRandomPassword = () => {
    const length = 12
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    return password
  }

  // Get promo code ID from code string
  const getPromoCodeId = async (code: string): Promise<string | null> => {
    try {
      const response = await adminApi.getPromoCodes(100, 0)
      const promoCode = response.promoCodes.find(
        (pc: any) => pc.code.toUpperCase() === code.toUpperCase()
      )
      return promoCode ? promoCode.id : null
    } catch (error) {
      console.error('Error fetching promo codes:', error)
      return null
    }
  }

  // Validate and get promo code details
  const validatePromoCode = async (code: string) => {
    if (!code || !code.trim()) {
      setPromoCodeDetails(null)
      return
    }

    setIsValidatingPromoCode(true)
    try {
      const response = await adminApi.getPromoCodes(100, 0)
      const promoCode = response.promoCodes.find(
        (pc: any) => pc.code.toUpperCase() === code.toUpperCase()
      )

      if (!promoCode) {
        setPromoCodeDetails({
          id: '',
          code: code.toUpperCase(),
          discountType: 'PERCENTAGE',
          discountValue: 0,
          minPurchase: null,
          maxDiscount: null,
          isValid: false,
          error: 'Promo code not found'
        })
        setIsValidatingPromoCode(false)
        return
      }

      // Check if promo code is active
      if (!promoCode.isActive) {
        setPromoCodeDetails({
          id: promoCode.id,
          code: promoCode.code,
          discountType: promoCode.discountType.toUpperCase() as 'PERCENTAGE' | 'FIXED_AMOUNT',
          discountValue: promoCode.discountValue,
          minPurchase: promoCode.minPurchase,
          maxDiscount: promoCode.maxDiscount,
          isValid: false,
          error: 'Promo code is not active'
        })
        setIsValidatingPromoCode(false)
        return
      }

      // Check validity dates
      const now = new Date()
      const validFrom = new Date(promoCode.validFrom)
      const validTo = new Date(promoCode.validTo)

      if (now < validFrom || now > validTo) {
        setPromoCodeDetails({
          id: promoCode.id,
          code: promoCode.code,
          discountType: promoCode.discountType.toUpperCase() as 'PERCENTAGE' | 'FIXED_AMOUNT',
          discountValue: promoCode.discountValue,
          minPurchase: promoCode.minPurchase,
          maxDiscount: promoCode.maxDiscount,
          isValid: false,
          error: 'Promo code has expired or is not yet valid'
        })
        setIsValidatingPromoCode(false)
        return
      }

      // Check usage limit
      if (promoCode.usageLimit && promoCode.usedCount >= promoCode.usageLimit) {
        setPromoCodeDetails({
          id: promoCode.id,
          code: promoCode.code,
          discountType: promoCode.discountType.toUpperCase() as 'PERCENTAGE' | 'FIXED_AMOUNT',
          discountValue: promoCode.discountValue,
          minPurchase: promoCode.minPurchase,
          maxDiscount: promoCode.maxDiscount,
          isValid: false,
          error: 'Promo code has reached its usage limit'
        })
        setIsValidatingPromoCode(false)
        return
      }

      // Check if promo code is linked to this offer (if it has linked offers)
      if (promoCode.offers && promoCode.offers.length > 0 && offer) {
        const isLinkedToOffer = promoCode.offers.some(
          (linkedOffer: any) => linkedOffer.id === offer.id
        )
        if (!isLinkedToOffer) {
          setPromoCodeDetails({
            id: promoCode.id,
            code: promoCode.code,
            discountType: promoCode.discountType.toUpperCase() as 'PERCENTAGE' | 'FIXED_AMOUNT',
            discountValue: promoCode.discountValue,
            minPurchase: promoCode.minPurchase,
            maxDiscount: promoCode.maxDiscount,
            isValid: false,
            error: 'Promo code is not valid for this offer'
          })
          setIsValidatingPromoCode(false)
          return
        }
      }

      // Promo code is valid
      setPromoCodeDetails({
        id: promoCode.id,
        code: promoCode.code,
        discountType: promoCode.discountType.toUpperCase() as 'PERCENTAGE' | 'FIXED_AMOUNT',
        discountValue: promoCode.discountValue,
        minPurchase: promoCode.minPurchase,
        maxDiscount: promoCode.maxDiscount,
        isValid: true
      })
    } catch (error) {
      console.error('Error validating promo code:', error)
      setPromoCodeDetails({
        id: '',
        code: code.toUpperCase(),
        discountType: 'PERCENTAGE',
        discountValue: 0,
        minPurchase: null,
        maxDiscount: null,
        isValid: false,
        error: 'Error validating promo code'
      })
    } finally {
      setIsValidatingPromoCode(false)
    }
  }

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  // Check if current time is after 12 PM (noon)
  const isAfterNoon = () => {
    const now = new Date()
    return now.getHours() >= 12 // After 12 PM (noon)
  }

  // Check if selected date is today
  const isToday = (dateString: string) => {
    return dateString === getTodayDate()
  }

  // Load user profile and pre-fill form when logged in
  useEffect(() => {
    const loadUserInfo = async () => {
      if (isLoggedIn && user) {
        try {
          // Try to get latest user info from backend
          const profileResponse = await userApi.getProfile()
          const userProfile = profileResponse.user
          
          // Pre-fill form with user data
          setFormData(prev => ({
            ...prev,
            fullName: userProfile.name || user.name || prev.fullName,
            email: userProfile.email || user.email || prev.email,
            phone: userProfile.phone || user.phone || prev.phone,
          }))
        } catch (error) {
          // If API fails, use data from auth context
          console.warn('Could not fetch user profile, using auth context data:', error)
          setFormData(prev => ({
            ...prev,
            fullName: user.name || prev.fullName,
            email: user.email || prev.email,
            phone: user.phone || prev.phone,
          }))
        }
      } else {
        // Clear form if user logs out
        setFormData(prev => ({
          ...prev,
          fullName: "",
          email: "",
          phone: "",
        }))
      }
    }

    loadUserInfo()
  }, [isLoggedIn, user])

  // Fetch offer from backend
  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await offersApi.getOfferById(resolvedParams.id, language)
        
        // Transform backend data to match frontend Offer format
        const backendOffer = response.offer
        
        // Extract pricing data
        const pricingType = backendOffer.pricingType || backendOffer.pricing?.pricing_type || 'per_person'
        const groupPricing = backendOffer.groupPricing || backendOffer.pricing?.pricing_data?.groupPricing
        const personPricing = backendOffer.personPricing || backendOffer.pricing?.pricing_data?.personPricing
        const priceAdult = backendOffer.pricing?.price_adult || backendOffer.price_adult
        const priceChild = backendOffer.pricing?.price_child || backendOffer.price_child
        const availabilityStart = backendOffer.pricing?.availability_start || backendOffer.availability_start
        const availabilityEnd = backendOffer.pricing?.availability_end || backendOffer.availability_end
        
        // Extract main image from images array or use main_image field
        const mainImageObj = backendOffer.images?.find((img: any) => img.type === 'MAIN')
        let mainImage = mainImageObj?.url || backendOffer.main_image || null
        
        // Handle image URL - convert to full URL if needed
        if (mainImage) {
          // If it's already a full URL, use it as is
          if (mainImage.startsWith('http://') || mainImage.startsWith('https://')) {
            // Already a full URL, use as is
          } 
          // If it starts with /uploads, prepend the base URL
          else if (mainImage.startsWith('/uploads/')) {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://api.marrakeshtravelservices.com/api/v1'
            const baseUrl = apiBaseUrl.replace('/api/v1', '')
            mainImage = `${baseUrl}${mainImage}`
          }
          // If it's a relative path starting with /, prepend the base URL
          else if (mainImage.startsWith('/') && !mainImage.startsWith('//')) {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://api.marrakeshtravelservices.com/api/v1'
            const baseUrl = apiBaseUrl.replace('/api/v1', '')
            mainImage = `${baseUrl}${mainImage}`
          }
          // If it's just a filename, prepend /uploads/
          else {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://api.marrakeshtravelservices.com/api/v1'
            const baseUrl = apiBaseUrl.replace('/api/v1', '')
            mainImage = `${baseUrl}/uploads/${mainImage}`
          }
        } else {
          // No image found, use placeholder
          mainImage = '/placeholder.jpg'
        }
        
        // Debug logging
        if (process.env.NODE_ENV === 'development') {
          console.log('📸 Main image extraction:', {
            hasImages: !!backendOffer.images,
            imagesCount: backendOffer.images?.length || 0,
            mainImageObj: mainImageObj,
            main_image: backendOffer.main_image,
            finalMainImage: mainImage
          })
        }
        
        // Extract thumbnail images
        const thumbnailImages = (backendOffer.images?.filter((img: any) => img.type === 'GALLERY').map((img: any) => {
          let url = img.url
          if (url && !url.startsWith('http') && !url.startsWith('/')) {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://api.marrakeshtravelservices.com/api/v1'
            const baseUrl = apiBaseUrl.replace('/api/v1', '')
            url = `${baseUrl}/uploads/${url}`
          } else if (url && url.startsWith('/') && !url.startsWith('//')) {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://api.marrakeshtravelservices.com/api/v1'
            const baseUrl = apiBaseUrl.replace('/api/v1', '')
            url = `${baseUrl}${url}`
          }
          return url
        }) || []).filter(Boolean)
        
        // Determine offer type
        const offerType = backendOffer.type?.toLowerCase() || 'tours'
        
        // Build detailed description
        const detailedDescription = {
          overview: backendOffer.overview || '',
          highlights: backendOffer.highlights || [],
          sections: backendOffer.sections || [],
          itinerary: [],
          tips: [],
          duration: backendOffer.tourDetails?.duration || backendOffer.excursionDetails?.duration || backendOffer.activityDetails?.duration || backendOffer.packageDetails?.duration || backendOffer.transferDetails?.duration || '',
          difficulty: backendOffer.tourDetails?.difficulty || backendOffer.excursionDetails?.difficulty || '',
          groupSize: backendOffer.tourDetails?.group_size || backendOffer.activityDetails?.group_size || '',
        }
        
        // Build transfer details if it's a transfer
        let transferDetails = undefined
        if (offerType === 'transfers' && backendOffer.transferDetails) {
          transferDetails = {
            from: backendOffer.transferDetails.from_location || '',
            to: backendOffer.transferDetails.to_location || '',
            duration: backendOffer.transferDetails.duration || '',
            distance: backendOffer.transferDetails.distance || '',
            vehicleOptions: backendOffer.transferDetails.vehicle_options || [],
          }
        }
        
        const transformedOffer: Offer = {
          id: backendOffer.id,
          type: offerType as any,
          title: backendOffer.title || 'Untitled Offer',
          description: backendOffer.description || '',
          departCity: backendOffer.depart_city || 'Marrakech',
          priceAdult: priceAdult ? parseFloat(priceAdult) : 0,
          priceChild: priceChild ? parseFloat(priceChild) : 0,
          pricingType: pricingType,
          groupPricing: groupPricing ? {
            personsPerGroup: groupPricing.personsPerGroup || 0,
            price: groupPricing.price || 0,
          } : undefined,
          personPricing: personPricing ? {
            priceFor2: personPricing.priceFor2 || 0,
            priceFor4: personPricing.priceFor4 || 0,
            priceFor6: personPricing.priceFor6 || 0,
            priceFor8: personPricing.priceFor8 || 0,
          } : undefined,
          mainImage: mainImage,
          thumbnailImages: thumbnailImages,
          video: backendOffer.video || '',
          availabilityDates: {
            startDate: availabilityStart ? new Date(availabilityStart).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            endDate: availabilityEnd ? new Date(availabilityEnd).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          },
          detailedDescription: detailedDescription,
          includedItems: backendOffer.included_items || [],
          excludedItems: backendOffer.excluded_items || [],
          transferDetails: transferDetails,
        }
        
        setOffer(transformedOffer)
      } catch (err) {
        const apiError = err as ApiError
        setError(apiError.message || 'Failed to load offer')
        console.error('Error fetching offer:', err)
        // Redirect to 404 after a delay
        setTimeout(() => {
          notFound()
        }, 2000)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOffer()
  }, [resolvedParams.id, language])

  // Calculate total price with promo code discount (must be at top level with other hooks)
  const calculateTotalPrice = useMemo(() => {
    if (!offer) return { subtotal: 0, discount: 0, total: 0 }
    
    // Packages don't have pricing
    if (offer.type === 'packages') {
      return { subtotal: 0, discount: 0, total: 0 }
    }
    
    let subtotal = 0
    
    // Calculate price based on pricing type
    if (offer.pricingType === 'per_group' && offer.groupPricing) {
      // Per group pricing: calculate number of groups needed
      const totalPersons = formData.adults + formData.children
      const personsPerGroup = offer.groupPricing.personsPerGroup || 1
      const numberOfGroups = Math.ceil(totalPersons / personsPerGroup)
      subtotal = numberOfGroups * offer.groupPricing.price
    } else if (offer.pricingType === 'per_person' && offer.personPricing) {
      // Per person pricing: use the appropriate price tier
      const totalPersons = formData.adults + formData.children
      let pricePerPerson = 0
      
      if (totalPersons <= 2) {
        pricePerPerson = offer.personPricing.priceFor2 || 0
      } else if (totalPersons <= 4) {
        pricePerPerson = offer.personPricing.priceFor4 || 0
      } else if (totalPersons <= 6) {
        pricePerPerson = offer.personPricing.priceFor6 || 0
      } else {
        pricePerPerson = offer.personPricing.priceFor8 || 0
      }
      
      subtotal = totalPersons * pricePerPerson
    } else {
      // Legacy pricing: per person (adult/child)
      subtotal = formData.adults * (offer.priceAdult ?? 0) + formData.children * (offer.priceChild ?? 0)
    }
    
    let discount = 0
    if (promoCodeDetails?.isValid && subtotal > 0) {
      // Check minimum purchase requirement
      if (promoCodeDetails.minPurchase && subtotal < promoCodeDetails.minPurchase) {
        // Don't apply discount if minimum purchase not met
        return { subtotal, discount: 0, total: subtotal }
      }
      
      if (promoCodeDetails.discountType === 'PERCENTAGE') {
        discount = subtotal * (promoCodeDetails.discountValue / 100)
        // Apply max discount limit if set
        if (promoCodeDetails.maxDiscount) {
          discount = Math.min(discount, promoCodeDetails.maxDiscount)
        }
      } else {
        // FIXED_AMOUNT
        discount = promoCodeDetails.discountValue
      }
      
      // Ensure discount doesn't exceed subtotal
      discount = Math.min(discount, subtotal)
    }
    
    const total = Math.max(0, subtotal - discount)
    
    return { subtotal, discount, total }
  }, [offer, formData.adults, formData.children, promoCodeDetails])

  const totalPrice = calculateTotalPrice.total

  if (isLoading) {
    return (
      <main className="w-full">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading offer...</p>
          </div>
        </div>
        <Footer />
        <FloatingContact />
      </main>
    )
  }

  if (error || !offer) {
    return (
      <main className="w-full">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-destructive">{error || 'Offer not found'}</p>
            <Button onClick={() => router.back()} variant="outline">
              Go Back
            </Button>
          </div>
        </div>
        <Footer />
        <FloatingContact />
      </main>
    )
  }

  const allImages = [offer.mainImage, ...offer.thumbnailImages]

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
    setShowVideo(false)
  }

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
    setShowVideo(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Special handling for date input
    if (name === 'date' && value) {
      // Check if the selected date is today and it's after 12 PM (noon)
      if (isToday(value) && isAfterNoon()) {
        // Show the same-day reservation dialog
        setShowSameDayDialog(true)
        // Don't update the date field
        return
      }
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Special handling for promo code - validate when changed (debounced)
    if (name === 'promoCode') {
      // Clear previous timer
      if (promoCodeValidationTimer.current) {
        clearTimeout(promoCodeValidationTimer.current)
      }
      
      // Set new timer to validate after user stops typing
      promoCodeValidationTimer.current = setTimeout(() => {
        if (value && value.trim()) {
          validatePromoCode(value.trim())
        } else {
          setPromoCodeDetails(null)
        }
      }, 500) // Wait 500ms after user stops typing
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Validate required fields
      if (!formData.fullName || !formData.email || !formData.phone || !formData.date) {
        throw new Error('Please fill in all required fields')
      }

      // Check if user is already logged in
      let userId: string
      let token: string
      let userData: any

      if (isLoggedIn && user) {
        // User is already logged in - use existing credentials
        console.log('User is already logged in, using existing account:', user.id)
        userId = user.id
        token = localStorage.getItem('token') || ''
        userData = user
        
        if (!token) {
          throw new Error('Authentication token is missing. Please log in again.')
        }
        
        console.log('✅ Using existing user account for booking')
      } else {
        // User is not logged in - register new account
        // Generate random password
        const randomPassword = generateRandomPassword()

        try {
          console.log('Registering new user...', { name: formData.fullName, email: formData.email, phone: formData.phone })
          const registerResponse = await authApi.register(
            formData.fullName,
            formData.email,
            formData.phone,
            randomPassword
          )
          console.log('User registered successfully:', registerResponse.user.id)
          userId = registerResponse.user.id
          token = registerResponse.token
          userData = registerResponse.user
          
          // Verify we got a valid token
          if (!token || !userId) {
            throw new Error('Registration succeeded but authentication token is missing')
          }
          
          // Store token and user data IMMEDIATELY after registration
          try {
            // Check if localStorage is available
            if (typeof window === 'undefined' || !window.localStorage) {
              throw new Error('localStorage is not available')
            }
            
            // Store token
            localStorage.setItem('token', token)
            console.log('✅ Token stored in localStorage:', token.substring(0, 20) + '...')
            
            // Store user data
            localStorage.setItem('user', JSON.stringify(userData))
            console.log('✅ User data stored:', { name: userData.name, email: userData.email, phone: userData.phone })
            
            // Verify token is actually stored (with retry)
            let storedToken = localStorage.getItem('token')
            let retries = 0
            while ((!storedToken || storedToken !== token) && retries < 3) {
              console.warn(`⚠️ Token verification failed, retry ${retries + 1}/3`)
              // Try storing again
              localStorage.setItem('token', token)
              await new Promise(resolve => setTimeout(resolve, 50))
              storedToken = localStorage.getItem('token')
              retries++
            }
            
            if (!storedToken || storedToken !== token) {
              console.error('❌ Token storage verification failed after retries!', { 
                stored: storedToken, 
                expected: token,
                storedLength: storedToken?.length,
                expectedLength: token.length
              })
              throw new Error('Failed to store authentication token. Please try again.')
            }
            
            console.log('✅ Token storage verified successfully')
            console.log('✅ Token length:', token.length)
            console.log('✅ Stored token length:', storedToken.length)
            
            // Also verify user data
            const storedUser = localStorage.getItem('user')
            if (!storedUser) {
              console.error('❌ User data not stored!')
              throw new Error('Failed to store user data. Please try again.')
            }
            console.log('✅ User data verified in localStorage')
            
          } catch (storageError: any) {
            console.error('❌ localStorage error:', storageError)
            throw new Error(`Failed to store authentication data: ${storageError.message}`)
          }
          
          // Verify token can be decoded (for debugging)
          let decodedUserId: string | null = null
          try {
            const tokenParts = token.split('.')
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]))
              decodedUserId = payload.userId
              console.log('✅ Decoded token payload:', payload)
              console.log('✅ Token userId:', payload.userId)
              console.log('✅ Registered userId:', userId)
              if (payload.userId !== userId) {
                console.error('❌ Token userId mismatch!', { tokenUserId: payload.userId, registeredUserId: userId })
              } else {
                console.log('✅ Token userId matches registered userId')
              }
            }
          } catch (e) {
            console.warn('Could not decode token for debugging:', e)
          }
          
          // Update auth state immediately
          login(userData)
          console.log('✅ Auth state updated')
          
          // Wait a bit longer to ensure database transaction is fully committed
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Verify user exists in database before proceeding (with retries)
          if (decodedUserId) {
            let userVerified = false
            let verificationAttempts = 0
            const maxAttempts = 3
            
            while (!userVerified && verificationAttempts < maxAttempts) {
              try {
                // Try to fetch user profile to verify user exists
                const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://api.marrakeshtravelservices.com/api/v1'}/users/profile`, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                })
                
                if (verifyResponse.ok) {
                  const verifyData = await verifyResponse.json()
                  userVerified = true
                  console.log('✅ User verified in database:', verifyData.user?.name || verifyData.user?.id)
                  break
                } else {
                  const errorData = await verifyResponse.json().catch(() => ({}))
                  verificationAttempts++
                  console.warn(`⚠️ User verification attempt ${verificationAttempts}/${maxAttempts} failed:`, errorData.message || 'Unknown error')
                  if (verificationAttempts < maxAttempts) {
                    // Wait longer between retries
                    await new Promise(resolve => setTimeout(resolve, 500))
                  } else {
                    console.error('❌ User verification failed after all attempts. User ID in token:', decodedUserId)
                    console.error('❌ This might indicate a database issue. The booking will still be attempted.')
                  }
                }
              } catch (verifyError: any) {
                verificationAttempts++
                console.warn(`⚠️ User verification error on attempt ${verificationAttempts}/${maxAttempts}:`, verifyError.message)
                if (verificationAttempts < maxAttempts) {
                  await new Promise(resolve => setTimeout(resolve, 500))
                }
              }
            }
          }
        } catch (registerError: any) {
          console.error('Registration error:', registerError)
          // If user already exists, show error
          if (registerError.message?.includes('already exists') || registerError.message?.includes('User already exists')) {
            throw new Error('An account with this email or phone already exists. Please sign in first.')
          }
          throw new Error(registerError.message || 'Failed to create account. Please try again.')
        }
      }

      // Get promo code ID if promo code is provided
      let promoCodeId: string | null = null
      if (formData.promoCode && formData.promoCode.trim()) {
        promoCodeId = await getPromoCodeId(formData.promoCode.trim())
        if (!promoCodeId) {
          console.warn('Promo code not found, proceeding without discount')
        }
      }

      // Calculate total price (packages don't have pricing, so totalPrice will be 0)
      let totalPrice = offer.type === 'packages' ? 0 : (formData.adults * (offer.priceAdult ?? 0) + formData.children * (offer.priceChild ?? 0))

      // Create booking
      const bookingData: any = {
        offerId: offer.id,
        offerType: offer.type.toUpperCase(),
        date: formData.date,
        adults: formData.adults,
        children: formData.children,
      }

      if (promoCodeId) {
        bookingData.promoCodeId = promoCodeId
      }

      if (offer.type === 'transfers') {
        bookingData.totalPrice = totalPrice
      } else if (offer.type === 'packages') {
        // Packages don't have fixed pricing, totalPrice is 0
        bookingData.totalPrice = 0
      }

      // Verify token is still available before creating booking
      const verifyToken = localStorage.getItem('token')
      if (!verifyToken) {
        console.error('❌ Token not found in localStorage before booking creation!')
        console.error('❌ Available localStorage keys:', Object.keys(localStorage))
        // Try to restore from the token variable
        if (token) {
          console.log('⚠️ Attempting to restore token from variable...')
          localStorage.setItem('token', token)
          const restoredToken = localStorage.getItem('token')
          if (restoredToken) {
            console.log('✅ Token restored successfully')
          } else {
            throw new Error('Authentication token is missing and could not be restored. Please try again.')
          }
        } else {
          throw new Error('Authentication token is missing. Please try again.')
        }
      }
      console.log('✅ Token verified before booking creation:', verifyToken.substring(0, 20) + '...')
      console.log('✅ Full localStorage contents:', {
        token: localStorage.getItem('token') ? 'Present' : 'Missing',
        user: localStorage.getItem('user') ? 'Present' : 'Missing',
        allKeys: Object.keys(localStorage)
      })

      // Create booking with the token explicitly passed
      // Get fresh token from localStorage to ensure we have the latest
      const freshToken = localStorage.getItem('token') || token
      if (!freshToken) {
        throw new Error('Authentication token is missing. Please try again.')
      }
      
      console.log('Creating booking with data:', bookingData)
      console.log('Using token:', freshToken.substring(0, 30) + '...')
      const bookingResponse = await bookingApi.createBooking(bookingData, freshToken)
      console.log('✅ Booking created successfully:', bookingResponse)

      // Double-check token is still stored after booking
      const finalTokenCheck = localStorage.getItem('token')
      if (!finalTokenCheck) {
        console.warn('⚠️ Token missing after booking creation, restoring...')
        localStorage.setItem('token', freshToken)
      }
      
      // Ensure user data is also still stored
      const finalUserCheck = localStorage.getItem('user')
      if (!finalUserCheck) {
        console.warn('⚠️ User data missing after booking creation, restoring...')
        localStorage.setItem('user', JSON.stringify(userData))
      }

      // Store booking data for payment dialog
      setBookingSuccessData({ bookingReference: bookingResponse.booking?.booking_reference })
      
      // Show payment dialog instead of success dialog
      setShowPaymentDialog(true)
      
      // Log final state
      console.log('✅ Final localStorage state:', {
        token: localStorage.getItem('token') ? 'Present' : 'Missing',
        user: localStorage.getItem('user') ? 'Present' : 'Missing',
        tokenPreview: localStorage.getItem('token')?.substring(0, 20) + '...',
        allKeys: Object.keys(localStorage)
      })
      
      // Optionally reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        date: "",
        adults: 1,
        children: 0,
        infants: 0,
        message: "",
        promoCode: "",
      })
    } catch (error: any) {
      console.error('Error submitting reservation:', error)
      setSubmitError(error.message || 'Failed to submit reservation. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="w-full">
      <Header />
      <PageHero 
        title={offer.title} 
        backgroundImage={offer.mainImage} 
        showOverlay={true}
      />

      <section className="py-6 md:py-10 bg-gray-50">
        <Container className="max-w-7xl px-1.5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image/Video Gallery */}
              <div className="bg-background rounded-2xl shadow-sm border border-border/50 overflow-hidden">
                {/* Main Display */}
                <div className="relative aspect-16/10 bg-muted">
                  {showVideo && offer.video ? (
                    <video
                      src={offer.video}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      {allImages[selectedImageIndex] && allImages[selectedImageIndex].includes('api.marrakeshtravelservices.com') ? (
                        <img
                          src={allImages[selectedImageIndex] || "/placeholder.svg"}
                          alt={offer.title}
                          className="w-full h-full object-cover transition-opacity duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/placeholder.svg'
                          }}
                        />
                      ) : (
                        <img
                          src={allImages[selectedImageIndex] || "/placeholder.svg"}
                          alt={offer.title}
                          className="w-full h-full object-cover transition-opacity duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/placeholder.svg'
                          }}
                        />
                      )}
                      {/* Image Counter */}
                      <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                        {selectedImageIndex + 1} / {allImages.length}
                      </div>
                      {/* Navigation Arrows */}
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground rounded-full p-2 transition-all shadow-lg hover:scale-105"
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground rounded-full p-2 transition-all shadow-lg hover:scale-105"
                        aria-label="Next image"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2 p-3 overflow-x-auto bg-muted/30">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedImageIndex(index)
                        setShowVideo(false)
                      }}
                      className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ring-2 ring-offset-2 ring-offset-background ${
                        selectedImageIndex === index && !showVideo
                          ? "ring-primary scale-105"
                          : "ring-transparent hover:ring-muted-foreground/50 opacity-70 hover:opacity-100"
                      }`}
                    >
                      {img && img.includes('api.marrakeshtravelservices.com') ? (
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/placeholder.svg'
                          }}
                        />
                      ) : (
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/placeholder.svg'
                          }}
                        />
                      )}
                    </button>
                  ))}
                  {offer.video && (
                    <button
                      onClick={() => setShowVideo(true)}
                      className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ring-2 ring-offset-2 ring-offset-background bg-muted flex items-center justify-center ${
                        showVideo
                          ? "ring-primary scale-105"
                          : "ring-transparent hover:ring-muted-foreground/50 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div className="absolute inset-0 bg-primary/10" />
                      <Play size={20} className="text-primary relative z-10" />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Info Bar - Hidden if no info available */}
              <div className="flex flex-wrap gap-4 p-4 bg-background rounded-xl border border-border/50 shadow-sm">
                <div className="flex items-center gap-2 text-sm">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Calendar size={16} className="text-primary" />
                  </div>
                  <span className="text-muted-foreground">{t.offerDetails.availableNow}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="p-2 rounded-full bg-green-500/10">
                    <Shield size={16} className="text-green-500" />
                  </div>
                  <span className="text-muted-foreground">{t.offerDetails.freeCancellation}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="p-2 rounded-full bg-blue-500/10">
                    <Clock size={16} className="text-blue-500" />
                  </div>
                  <span className="text-muted-foreground">{t.offerDetails.instantConfirmation}</span>
                </div>
              </div>

              {/* Transfer Route Info - Only for transfers */}
              {offer.type === "transfers" && offer.transferDetails && (
                <div className="bg-background rounded-xl p-3.5 md:p-5 border border-border/50 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Route size={16} className="text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{t.offerDetails.transferRoute}</h3>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <MapPin size={14} className="text-primary" />
                        <span>{t.offerDetails.from}</span>
                      </div>
                      <p className="font-medium text-foreground">{offer.transferDetails.from}</p>
                    </div>
                    <ArrowRight size={24} className="text-primary shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <MapPin size={14} className="text-primary" />
                        <span>{t.offerDetails.to}</span>
                      </div>
                      <p className="font-medium text-foreground">{offer.transferDetails.to}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={14} className="text-primary" />
                      <span className="text-muted-foreground">{t.offerDetails.duration}: <strong className="text-foreground">{offer.transferDetails.duration}</strong></span>
                    </div>
                    {offer.transferDetails.distance && (
                      <div className="flex items-center gap-2 text-sm">
                        <Route size={14} className="text-primary" />
                        <span className="text-muted-foreground">{t.offerDetails.distance}: <strong className="text-foreground">{offer.transferDetails.distance}</strong></span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Vehicle Options - Only for transfers */}
              {offer.type === "transfers" && offer.transferDetails?.vehicleOptions && offer.transferDetails.vehicleOptions.length > 0 && (
                <div className="bg-background rounded-xl p-3.5 md:p-5 border border-border/50 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-blue-500/10">
                      <Car size={16} className="text-blue-500" />
                    </div>
                    <h3 className="font-semibold text-foreground">{t.offerDetails.vehicleOptions}</h3>
                  </div>
                  <div className="grid gap-3">
                    {offer.transferDetails.vehicleOptions.map((vehicle, index) => (
                      <div key={index} className="p-4 rounded-lg border border-border hover:border-primary transition-colors bg-muted/20">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-foreground">{vehicle.type}</h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Users size={14} />
                              {vehicle.capacity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">€ {vehicle.price}</p>
                            <p className="text-xs text-muted-foreground">{t.offerDetails.perVehicle}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {vehicle.features.map((feature, featureIndex) => (
                            <span key={featureIndex} className="text-xs px-2 py-1 bg-background rounded-full border border-border text-muted-foreground">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description Card */}
              {offer.description && (
                <div className="bg-background rounded-xl p-3.5 md:p-5 border border-border/50 shadow-sm">
                  <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">{offer.type === "transfers" ? t.offerDetails.aboutTransfer : t.offerDetails.aboutExperience}</h2>
                  <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{offer.description}</p>
                </div>
              )}

              {/* Included & Excluded Grid */}
              {(offer.includedItems?.length > 0 || offer.excludedItems?.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Included Items */}
                  {offer.includedItems?.length > 0 && (
                    <div className="bg-background rounded-xl p-5 border border-border/50 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 rounded-lg bg-green-500/10">
                          <Check size={16} className="text-green-500" />
                        </div>
                        <h3 className="font-semibold text-foreground">{t.offerDetails.whatsIncluded}</h3>
                      </div>
                      <ul className="space-y-2.5">
                        {offer.includedItems.map((item, index) => (
                          <li key={index} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                            <Check size={14} className="text-green-500 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Excluded Items */}
                  {offer.excludedItems?.length > 0 && (
                    <div className="bg-background rounded-xl p-3.5 md:p-5 border border-border/50 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 rounded-lg bg-red-500/10">
                          <X size={16} className="text-red-500" />
                        </div>
                        <h3 className="font-semibold text-foreground">{t.offerDetails.notIncluded}</h3>
                      </div>
                      <ul className="space-y-2.5">
                        {offer.excludedItems.map((item, index) => (
                          <li key={index} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                            <X size={14} className="text-red-500 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Detailed Description - Expandable Sections */}
              {offer.detailedDescription && (
                <div className="bg-background rounded-xl border border-border/50 shadow-sm overflow-hidden">
                  {/* Overview Section - Always Visible */}
                  {offer.detailedDescription.overview && (
                    <div className="p-3.5 md:p-5 border-b border-border/50">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                          <Info size={16} className="text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground">{t.offerDetails.overview}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{offer.detailedDescription.overview}</p>
                    </div>
                  )}

                  {/* Highlights Section - Collapsible */}
                  {offer.detailedDescription.highlights?.length > 0 && (
                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-5 border-b border-border/50 hover:bg-muted/30 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-yellow-500/10">
                            <Sparkles size={16} className="text-yellow-500" />
                          </div>
                          <h3 className="font-semibold text-foreground">{t.offerDetails.highlights}</h3>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{offer.detailedDescription.highlights.length} {t.offerDetails.items}</span>
                        </div>
                        <ChevronDown size={18} className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="p-5 bg-muted/20">
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {offer.detailedDescription.highlights.map((highlight, index) => (
                              <li key={index} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                <Sparkles size={14} className="text-yellow-500 shrink-0 mt-0.5" />
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  {/* Detailed Sections - Collapsible */}
                  {offer.detailedDescription.sections?.length > 0 && offer.detailedDescription.sections.map((section, index) => (
                    <Collapsible key={index}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-5 border-b border-border/50 hover:bg-muted/30 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-blue-500/10">
                            <ListChecks size={16} className="text-blue-500" />
                          </div>
                          <h3 className="font-semibold text-foreground">{section.title}</h3>
                        </div>
                        <ChevronDown size={18} className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="p-3.5 md:p-5 bg-muted/20">
                          <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{section.content}</p>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}

                  {/* Itinerary Section - Collapsible */}
                  {offer.detailedDescription.itinerary && offer.detailedDescription.itinerary.length > 0 && (
                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-5 border-b border-border/50 hover:bg-muted/30 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-purple-500/10">
                            <Clock size={16} className="text-purple-500" />
                          </div>
                          <h3 className="font-semibold text-foreground">{t.offerDetails.itinerary}</h3>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{offer.detailedDescription.itinerary.length} {t.offerDetails.stops}</span>
                        </div>
                        <ChevronDown size={18} className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="p-5 bg-muted/20">
                          <div className="space-y-3">
                            {offer.detailedDescription.itinerary.map((item, index) => (
                              <div key={index} className="flex items-start gap-3 text-sm">
                                <div className="flex items-center justify-center min-w-[70px] px-2 py-1 bg-primary/10 text-primary font-medium rounded-md text-xs">
                                  {item.time}
                                </div>
                                <span className="text-muted-foreground pt-0.5">{item.activity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  {/* Tips Section - Collapsible */}
                  {offer.detailedDescription.tips && offer.detailedDescription.tips.length > 0 && (
                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-5 border-b border-border/50 hover:bg-muted/30 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-orange-500/10">
                            <Lightbulb size={16} className="text-orange-500" />
                          </div>
                          <h3 className="font-semibold text-foreground">{t.offerDetails.tipsRecommendations}</h3>
                        </div>
                        <ChevronDown size={18} className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="p-5 bg-muted/20">
                          <ul className="space-y-2.5">
                            {offer.detailedDescription.tips.map((tip, index) => (
                              <li key={index} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                <Lightbulb size={14} className="text-orange-500 shrink-0 mt-0.5" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  {/* Quick Info Footer */}
                  {(offer.detailedDescription.duration || offer.detailedDescription.difficulty || offer.detailedDescription.groupSize) && (
                    <div className="p-3.5 md:p-5 bg-muted/30 flex flex-wrap gap-4">
                      {offer.detailedDescription.duration && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock size={14} className="text-primary" />
                          <span className="text-muted-foreground"><strong className="text-foreground">{t.offerDetails.duration}:</strong> {offer.detailedDescription.duration}</span>
                        </div>
                      )}
                      {offer.detailedDescription.difficulty && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin size={14} className="text-primary" />
                          <span className="text-muted-foreground"><strong className="text-foreground">{t.offerDetails.difficulty}:</strong> {offer.detailedDescription.difficulty}</span>
                        </div>
                      )}
                      {offer.detailedDescription.groupSize && (
                        <div className="flex items-center gap-2 text-sm">
                          <Users size={14} className="text-primary" />
                          <span className="text-muted-foreground"><strong className="text-foreground">{t.offerDetails.groupSize}:</strong> {offer.detailedDescription.groupSize}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Pricing Cards - Hide for transfers and packages */}
              {offer.type !== "transfers" && offer.type !== "packages" && (
                <div className="bg-background rounded-xl p-3.5 md:p-5 border border-border/50 shadow-sm">
                  <h3 className="font-semibold text-foreground mb-3">{t.offerDetails.pricing}</h3>
                  {offer.pricingType === 'per_group' && offer.groupPricing ? (
                    <div className="p-2.5 md:p-4 rounded-xl bg-linear-to-br from-primary/5 to-primary/10 border border-primary/20">
                      <div className="flex items-center gap-2 mb-1 md:mb-2">
                        <Users size={14} className="text-primary" />
                        <span className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.offerDetails.group}</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg md:text-2xl font-bold text-foreground">€ {offer.groupPricing.price}</span>
                        <span className="text-[10px] md:text-xs text-muted-foreground whitespace-nowrap">/{offer.groupPricing.personsPerGroup} {t.offerDetails.persons}</span>
                      </div>
                    </div>
                  ) : offer.pricingType === 'per_person' && offer.personPricing ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {offer.personPricing.priceFor2 > 0 && (
                          <div className="p-2.5 md:p-3 rounded-lg bg-muted/50 border border-border/50">
                            <div className="text-[10px] md:text-xs text-muted-foreground mb-1">{t.offerDetails.for2Persons}</div>
                            <div className="text-sm md:text-lg font-bold text-foreground">€ {offer.personPricing.priceFor2}</div>
                          </div>
                        )}
                        {offer.personPricing.priceFor4 > 0 && (
                          <div className="p-2.5 md:p-3 rounded-lg bg-muted/50 border border-border/50">
                            <div className="text-[10px] md:text-xs text-muted-foreground mb-1">{t.offerDetails.for4Persons}</div>
                            <div className="text-sm md:text-lg font-bold text-foreground">€ {offer.personPricing.priceFor4}</div>
                          </div>
                        )}
                        {offer.personPricing.priceFor6 > 0 && (
                          <div className="p-2.5 md:p-3 rounded-lg bg-muted/50 border border-border/50">
                            <div className="text-[10px] md:text-xs text-muted-foreground mb-1">{t.offerDetails.for6Persons}</div>
                            <div className="text-sm md:text-lg font-bold text-foreground">€ {offer.personPricing.priceFor6}</div>
                          </div>
                        )}
                        {offer.personPricing.priceFor8 > 0 && (
                          <div className="p-2.5 md:p-3 rounded-lg bg-muted/50 border border-border/50">
                            <div className="text-[10px] md:text-xs text-muted-foreground mb-1">{t.offerDetails.for8Persons}</div>
                            <div className="text-sm md:text-lg font-bold text-foreground">€ {offer.personPricing.priceFor8}</div>
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] md:text-xs text-muted-foreground">{t.offerDetails.perPerson}</p>
                    </div>
                  ) : (offer.priceAdult !== undefined || offer.priceChild !== undefined) ? (
                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                      {offer.priceAdult !== undefined && (
                        <div className="relative p-2.5 md:p-4 rounded-xl bg-linear-to-br from-primary/5 to-primary/10 border border-primary/20">
                          <div className="flex items-center gap-2 mb-1 md:mb-2">
                            <User size={14} className="text-primary" />
                            <span className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.offerDetails.adult}</span>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg md:text-2xl font-bold text-foreground">€ {offer.priceAdult}</span>
                            <span className="text-[10px] md:text-xs text-muted-foreground whitespace-nowrap">{t.offerDetails.perPerson}</span>
                          </div>
                        </div>
                      )}
                      {offer.priceChild !== undefined && (
                        <div className="relative p-2.5 md:p-4 rounded-xl bg-linear-to-br from-blue-500/5 to-blue-500/10 border border-blue-500/20">
                          <div className="flex items-center gap-2 mb-1 md:mb-2">
                            <Users size={14} className="text-blue-500" />
                            <span className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wide">{t.offerDetails.child}</span>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg md:text-2xl font-bold text-foreground">€ {offer.priceChild}</span>
                            <span className="text-[10px] md:text-xs text-muted-foreground whitespace-nowrap">{t.offerDetails.perChild}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              )}

              {/* Availability - Hide availability dates section for transfers and packages */}
              {offer.type !== "transfers" && offer.type !== "packages" && offer.availabilityDates?.startDate && offer.availabilityDates?.endDate && (
                <div className="bg-background rounded-xl p-3.5 md:p-5 border border-border/50 shadow-sm">
                  <h3 className="font-semibold text-foreground mb-3">{t.offerDetails.availability}</h3>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Calendar size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(offer.availabilityDates.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        —{" "}
                        {new Date(offer.availabilityDates.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">{t.offerDetails.bookWithinDates}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Reservation Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-background rounded-2xl border border-border/50 shadow-lg overflow-hidden">
                {/* Price Header */}
                {offer.type !== "packages" && (
                  <div className="p-4 bg-linear-to-r from-primary to-primary/80 text-primary-foreground">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm opacity-90">{t.offerDetails.reservationForm.fromPrice}</span>
                      <span className="text-3xl font-bold">€ {
                        offer.pricingType === 'per_group' && offer.groupPricing ? offer.groupPricing.price :
                        offer.pricingType === 'per_person' && offer.personPricing ? offer.personPricing.priceFor2 :
                        offer.priceAdult || 0
                      }</span>
                      <span className="text-sm opacity-90">{
                        offer.type === "transfers" ? "/" + t.offerDetails.perVehicle.split(" ")[1] :
                        offer.pricingType === 'per_group' && offer.groupPricing ? `/${offer.groupPricing.personsPerGroup} ${t.offerDetails.persons}` :
                        t.offerDetails.perPerson
                      }</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                  {/* Personal Info Section */}
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-xs font-medium">{t.offerDetails.reservationForm.fullName}</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder={t.offerDetails.reservationForm.fullNamePlaceholder}
                        className="h-10 text-sm"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-medium">{t.offerDetails.reservationForm.email}</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={t.offerDetails.reservationForm.emailPlaceholder}
                          className="h-10 text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-medium">{t.offerDetails.reservationForm.phone}</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder={t.offerDetails.reservationForm.phonePlaceholder}
                          className="h-10 text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="pt-3 border-t border-border/50 space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="date" className="text-xs font-medium">{offer.type === "transfers" ? t.offerDetails.reservationForm.transferDate : t.offerDetails.reservationForm.preferredDate}</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        min={getTodayDate()}
                        max={offer.type !== "packages" ? offer.availabilityDates?.endDate : undefined}
                        className="h-10 text-sm"
                        required
                      />
                    </div>

                    {offer.type === "transfers" ? (
                      <div className="space-y-1.5">
                        <Label htmlFor="adults" className="text-xs font-medium flex items-center gap-1.5">
                          <Users size={12} />
                          {t.offerDetails.reservationForm.numberOfPassengers}
                        </Label>
                        <Input
                          id="adults"
                          name="adults"
                          type="number"
                          min={1}
                          max={7}
                          value={formData.adults}
                          onChange={handleInputChange}
                          className="h-10 text-sm"
                          required
                        />
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label htmlFor="adults" className="text-xs font-medium flex items-center gap-1.5">
                              <User size={12} />
                              {t.offerDetails.reservationForm.adults}
                            </Label>
                            <Input
                              id="adults"
                              name="adults"
                              type="number"
                              min={1}
                              value={formData.adults}
                              onChange={handleInputChange}
                              className="h-10 text-sm"
                              required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="children" className="text-xs font-medium flex items-center gap-1.5">
                              <Users size={12} />
                              {t.offerDetails.reservationForm.children}
                            </Label>
                            <Input
                              id="children"
                              name="children"
                              type="number"
                              min={0}
                              value={formData.children}
                              onChange={handleInputChange}
                              className="h-10 text-sm"
                            />
                          </div>
                        </div>
                        {/* Infants - Under 3 years FREE */}
                        <div className="space-y-1.5 mt-3">
                          <Label htmlFor="infants" className="text-xs font-medium flex items-center gap-2">
                            <Baby size={12} className="text-pink-500" />
                            <span>{t.infant?.label || "Infants"}</span>
                            <span className="text-[10px] text-muted-foreground">({t.infant?.description || "Under 3 years"})</span>
                            <span className="ml-auto text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                              {t.infant?.free || "FREE"}
                            </span>
                          </Label>
                          <Input
                            id="infants"
                            name="infants"
                            type="number"
                            min={0}
                            value={formData.infants}
                            onChange={handleInputChange}
                            className="h-10 text-sm"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Promo Code */}
                  <div className="space-y-1.5">
                    <Label htmlFor="promoCode" className="text-xs font-medium flex items-center gap-1.5">
                      <Ticket size={12} className="text-primary" />
                      {t.offerDetails?.reservationForm?.promoCode || "Promo Code"}
                    </Label>
                    <div className="relative">
                      <Input
                        id="promoCode"
                        name="promoCode"
                        type="text"
                        value={formData.promoCode}
                        onChange={handleInputChange}
                        placeholder={t.offerDetails?.reservationForm?.promoCodePlaceholder || "Enter promo code"}
                        className={`h-10 text-sm font-mono uppercase pr-10 ${
                          promoCodeDetails?.isValid 
                            ? 'border-green-500 focus:border-green-500' 
                            : promoCodeDetails && !promoCodeDetails.isValid 
                            ? 'border-destructive focus:border-destructive' 
                            : ''
                        }`}
                        maxLength={50}
                      />
                      {isValidatingPromoCode && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                      {promoCodeDetails?.isValid && !isValidatingPromoCode && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                      )}
                      {promoCodeDetails && !promoCodeDetails.isValid && !isValidatingPromoCode && (
                        <X className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
                      )}
                    </div>
                    {promoCodeDetails?.error && (
                      <p className="text-[10px] text-destructive">
                        {promoCodeDetails.error}
                      </p>
                    )}
                    {promoCodeDetails?.isValid && (
                      <p className="text-[10px] text-green-600 font-medium">
                        ✓ Promo code applied! You save {promoCodeDetails.discountType === 'PERCENTAGE' ? `${promoCodeDetails.discountValue}%` : `€ ${promoCodeDetails.discountValue}`}
                      </p>
                    )}
                    {!promoCodeDetails && !isValidatingPromoCode && (
                      <p className="text-[10px] text-muted-foreground">
                        {t.offerDetails?.reservationForm?.promoCodeHint || "Have a discount code? Enter it here"}
                      </p>
                    )}
                  </div>

                  {/* Special Requests */}
                  <div className="space-y-1.5">
                    <Label htmlFor="message" className="text-xs font-medium">{offer.type === "transfers" ? t.offerDetails.reservationForm.pickupDetails : t.offerDetails.reservationForm.specialRequests}</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={offer.type === "transfers" ? t.offerDetails.reservationForm.pickupDetailsPlaceholder : t.offerDetails.reservationForm.specialRequestsPlaceholder}
                      rows={offer.type === "transfers" ? 3 : 2}
                      className="text-sm resize-none"
                    />
                  </div>

                  {/* Price Summary - Different for transfers */}
                  {offer.type === "transfers" ? (
                    <div className="p-2.5 md:p-3 bg-muted/50 rounded-lg space-y-1.5 md:space-y-2">
                      <div className="flex justify-between text-[11px] md:text-xs text-muted-foreground">
                        <span>{t.offerDetails.reservationForm.transfer} ({formData.adults} {formData.adults > 1 ? t.offerDetails.reservationForm.passengers : t.offerDetails.reservationForm.passenger})</span>
                        <span>{t.offerDetails.reservationForm.fromPrice} € {offer.priceAdult}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-foreground pt-1.5 md:pt-2 border-t border-border/50">
                        <span className="text-xs md:text-base">{t.offerDetails.reservationForm.startingFrom}</span>
                        <span className="text-sm md:text-lg text-primary">€ {offer.priceAdult}</span>
                      </div>
                      <p className="text-[9px] md:text-[10px] text-muted-foreground">{t.offerDetails.reservationForm.finalPriceNote}</p>
                    </div>
                  ) : offer.type !== "packages" && (
                    <div className="p-2.5 md:p-3 bg-muted/50 rounded-lg space-y-1.5 md:space-y-2">
                      {offer.pricingType === 'per_group' && offer.groupPricing ? (
                        <>
                          <div className="flex justify-between text-[11px] md:text-xs text-muted-foreground">
                            <span>
                              {Math.ceil((formData.adults + formData.children) / (offer.groupPricing.personsPerGroup || 1))} {t.offerDetails.group} × € {offer.groupPricing.price}
                            </span>
                            <span>€ {Math.ceil((formData.adults + formData.children) / (offer.groupPricing.personsPerGroup || 1)) * offer.groupPricing.price}</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            ({formData.adults + formData.children} {t.offerDetails.persons} / {offer.groupPricing.personsPerGroup} {t.offerDetails.perGroup})
                          </div>
                        </>
                      ) : offer.pricingType === 'per_person' && offer.personPricing ? (
                        <>
                          <div className="flex justify-between text-[11px] md:text-xs text-muted-foreground">
                            <span>
                              {formData.adults + formData.children} {t.offerDetails.persons} × € {
                                (formData.adults + formData.children) <= 2 ? offer.personPricing.priceFor2 :
                                (formData.adults + formData.children) <= 4 ? offer.personPricing.priceFor4 :
                                (formData.adults + formData.children) <= 6 ? offer.personPricing.priceFor6 :
                                offer.personPricing.priceFor8
                              }
                            </span>
                            <span>€ {calculateTotalPrice.subtotal}</span>
                          </div>
                        </>
                      ) : (offer.priceAdult !== undefined || offer.priceChild !== undefined) ? (
                        <>
                          {offer.priceAdult !== undefined && (
                            <div className="flex justify-between text-[11px] md:text-xs text-muted-foreground">
                              <span>{formData.adults} {t.offerDetails.reservationForm.adults} × € {offer.priceAdult}</span>
                              <span>€ {formData.adults * offer.priceAdult}</span>
                            </div>
                          )}
                          {formData.children > 0 && offer.priceChild !== undefined && (
                            <div className="flex justify-between text-[11px] md:text-xs text-muted-foreground">
                              <span>{formData.children} {t.offerDetails.reservationForm.children} × € {offer.priceChild}</span>
                              <span>€ {formData.children * offer.priceChild}</span>
                            </div>
                          )}
                        </>
                      ) : null}
                      {formData.infants > 0 && (
                        <div className="flex justify-between text-[11px] md:text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Baby size={10} className="text-pink-500" />
                            {formData.infants} {t.infant?.label || "Infants"}
                          </span>
                          <span className="text-green-600 font-medium">{t.infant?.free || "FREE"}</span>
                        </div>
                      )}
                      {promoCodeDetails && (
                        <>
                          {promoCodeDetails.isValid ? (
                            <>
                              <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                                <span className="flex items-center gap-1">
                                  <Ticket size={10} className="text-primary" />
                                  Subtotal
                                </span>
                                <span>€ {calculateTotalPrice.subtotal.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-xs text-green-600 font-medium">
                                <span>Discount ({promoCodeDetails.discountType === 'PERCENTAGE' ? `${promoCodeDetails.discountValue}%` : `€ ${promoCodeDetails.discountValue}`})</span>
                                <span>- € {calculateTotalPrice.discount.toFixed(2)}</span>
                              </div>
                            </>
                          ) : (
                            <div className="flex justify-between text-xs text-destructive pt-2 border-t border-border/50">
                              <span>{promoCodeDetails.error || 'Invalid promo code'}</span>
                            </div>
                          )}
                        </>
                      )}
                      {isValidatingPromoCode && (
                        <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                          <span>Validating promo code...</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold text-foreground pt-2 border-t border-border/50">
                        <span>{t.offerDetails.reservationForm.total}</span>
                        <span className="text-lg text-primary">€ {totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  {submitError && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-sm text-destructive">{submitError}</p>
                    </div>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full h-11 font-semibold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      offer.type === "packages" ? t.offerDetails.reservationForm.requestCustomQuote : t.offerDetails.reservationForm.reserveNow
                    )}
                  </Button>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Shield size={12} className="text-green-500" />
                      <span>{t.offerDetails.reservationForm.secure}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="text-blue-500" />
                      <span>{t.offerDetails.reservationForm.instantConfirm}</span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
      <FloatingContact />

      {/* Same-Day Reservation Dialog */}
      <Dialog open={showSameDayDialog} onOpenChange={setShowSameDayDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Same-Day Reservation
            </DialogTitle>
            <DialogDescription className="pt-2">
              Reservations for the same day must be made by phone call. Please contact us directly to complete your booking.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="p-2 rounded-full bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Call us now</p>
                <a 
                  href="tel:+212524375251" 
                  className="text-lg font-semibold text-primary hover:underline"
                >
                  +212 661 044 503
                </a>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSameDayDialog(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                window.location.href = 'tel:+212524375251'
              }}
              className="w-full sm:w-auto gap-2"
            >
              <Phone className="h-4 w-4" />
              Call Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              Select Payment Method
            </DialogTitle>
            <DialogDescription className="text-center pt-2 text-base">
              Choose your preferred payment method to complete your booking
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            {/* PayPal Option */}
            <button
              onClick={() => setSelectedPaymentMethod('paypal')}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                selectedPaymentMethod === 'paypal'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  selectedPaymentMethod === 'paypal' ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-foreground">PayPal</p>
                  <p className="text-xs text-muted-foreground">Pay securely with PayPal</p>
                </div>
                {selectedPaymentMethod === 'paypal' && (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </div>
            </button>

            {/* Card Payment Option */}
            <button
              onClick={() => setSelectedPaymentMethod('card')}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                selectedPaymentMethod === 'card'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  selectedPaymentMethod === 'card' ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-foreground">Credit/Debit Card</p>
                  <p className="text-xs text-muted-foreground">Pay with Visa, Mastercard, or other cards</p>
                </div>
                {selectedPaymentMethod === 'card' && (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </div>
            </button>

            {/* Price Summary */}
            {offer && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-2 mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="font-semibold text-foreground">
                    {offer.type === 'packages' 
                      ? 'Custom Quote' 
                      : `€ ${calculateTotalPrice.total.toFixed(2)}`
                    }
                  </span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => {
                setShowPaymentDialog(false)
                setSelectedPaymentMethod(null)
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!selectedPaymentMethod || !offer) {
                  return
                }
                
                setIsProcessingPayment(true)
                
                try {
                  const totalAmount = offer.type === 'packages' ? 0 : calculateTotalPrice.total
                  
                  if (selectedPaymentMethod === 'paypal') {
                    try {
                      // Create PayPal order via backend
                      const returnUrl = `${window.location.origin}/payment/success?bookingRef=${bookingSuccessData?.bookingReference || ''}`
                      const cancelUrl = `${window.location.origin}/payment/cancel?bookingRef=${bookingSuccessData?.bookingReference || ''}`
                      
                      const paypalOrder = await paymentApi.createPayPalOrder({
                        amount: totalAmount,
                        currency: 'USD',
                        bookingReference: bookingSuccessData?.bookingReference || undefined,
                        returnUrl,
                        cancelUrl,
                      })
                      
                      // Open PayPal approval URL in a new tab/window
                      const paypalWindow = window.open(paypalOrder.approvalUrl, '_blank', 'noopener,noreferrer')
                      
                      if (!paypalWindow) {
                        // If popup was blocked, fallback to same window redirect
                        window.location.href = paypalOrder.approvalUrl
                      } else {
                        // Close payment dialog after opening PayPal
                        setShowPaymentDialog(false)
                        setSelectedPaymentMethod(null)
                        setIsProcessingPayment(false)
                      }
                    } catch (paypalError: any) {
                      console.error('PayPal order creation error:', paypalError)
                      setIsProcessingPayment(false)
                      setSubmitError(paypalError.message || 'Failed to create PayPal payment. Please try again.')
                    }
                  } else if (selectedPaymentMethod === 'card') {
                    // Generate CMI hash from backend
                    const orderId = bookingSuccessData?.bookingReference || `ORDER_${Date.now()}`
                    const randomNumber = Date.now().toString()
                    const amount = totalAmount.toFixed(2)
                    const okUrl = `${window.location.origin}/payment/success?bookingRef=${orderId}`
                    const failUrl = `${window.location.origin}/payment/failed?bookingRef=${orderId}`
                    const callbackUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030'}/api/v1/payments/cmi-callback`
                    const storetype = '3D_PAY_HOSTING'
                    const hashAlgorithm = 'ver3'
                    const currency = '978' // EUR currency code
                    
                    try {
                      // Use test environment credentials (as per CMI documentation)
                      // ClientId de test: 600005522 (from CMI documentation image)
                      // URL de test: https://testpayment.cmi.co.ma/fim/est3Dgate
                      // NOTE: username is NOT used in CMI official examples - removed
                      const clientId = process.env.NEXT_PUBLIC_CMI_CLIENT_ID || '600005522' // Test ClientId
                      
                      // Get customer information from form data or user data
                      const customerName = formData.fullName || user?.name || ''
                      const customerEmail = formData.email || user?.email || ''
                      const customerPhone = formData.phone || user?.phone || ''
                      
                      // Prepare all parameters for hash calculation (EXACTLY as per CMI PHP example 1.PaymentRequest.php)
                      // Only include parameters that are in the official example
                      const hashRequestData = {
                        clientid: clientId,
                        amount: amount, // Amount in decimal format (e.g., "800.00")
                        okUrl: okUrl,
                        failUrl: failUrl,
                        TranType: 'PreAuth', // Note: camelCase as in PHP example
                        currency: currency,
                        rnd: randomNumber,
                        storetype: storetype,
                        hashAlgorithm: hashAlgorithm,
                        lang: 'fr',
                        refreshtime: '5',
                        oid: orderId,
                        // Callback URL for automatic payment confirmation
                        callbackUrl: callbackUrl,
                        shopurl: window.location.origin,
                        // Customer information (BillTo fields)
                        BillToName: customerName || '',
                        BillToCompany: '',
                        BillToStreet1: '',
                        BillToCity: '',
                        BillToStateProv: '',
                        BillToPostalCode: '',
                        BillToCountry: '504', // Morocco country code
                        email: customerEmail || '',
                        tel: customerPhone || '',
                        // DO NOT include AutoRedirect - it's not in the PHP example
                      }

                      // Generate hash from backend (SHA512 Base64)
                      // Backend follows exact CMI PHP algorithm
                      const hashResponse = await paymentApi.generateCMIHash(hashRequestData)
                      
                      // Create and submit CMI payment form (EXACTLY as per 2.SendData.php)
                      const cmiForm = document.createElement('form')
                      cmiForm.method = 'POST'
                      // Use test environment URL (as per CMI documentation)
                      cmiForm.action = process.env.NEXT_PUBLIC_CMI_GATEWAY_URL || 'https://testpayment.cmi.co.ma/fim/est3Dgate'
                      cmiForm.name = 'pay_form' // As per CMI example
                      // Submit in same window to ensure proper redirect
                      cmiForm.target = '_self'
                      
                      // Build form data with all parameters (EXACTLY as per CMI PHP example 2.SendData.php)
                      // Must match EXACTLY what was sent for hash calculation
                      // Amount should be in decimal format (e.g., "800.00") as per CMI documentation
                      const cmiFormData: Record<string, string> = {
                        clientid: hashRequestData.clientid,
                        amount: hashResponse.formattedAmount || amount, // Use formatted amount from backend (decimal format: "800.00")
                        okUrl: hashRequestData.okUrl,
                        failUrl: hashRequestData.failUrl,
                        TranType: hashRequestData.TranType, // camelCase as in PHP example
                        callbackUrl: hashRequestData.callbackUrl,
                        shopurl: hashRequestData.shopurl,
                        currency: hashRequestData.currency,
                        rnd: hashRequestData.rnd,
                        storetype: hashRequestData.storetype,
                        hashAlgorithm: hashRequestData.hashAlgorithm,
                        lang: hashRequestData.lang,
                        refreshtime: hashRequestData.refreshtime,
                        BillToName: hashRequestData.BillToName,
                        BillToCompany: hashRequestData.BillToCompany,
                        BillToStreet1: hashRequestData.BillToStreet1,
                        BillToCity: hashRequestData.BillToCity,
                        BillToStateProv: hashRequestData.BillToStateProv,
                        BillToPostalCode: hashRequestData.BillToPostalCode,
                        BillToCountry: hashRequestData.BillToCountry,
                        email: hashRequestData.email,
                        tel: hashRequestData.tel,
                        encoding: 'UTF-8',
                        oid: hashRequestData.oid,
                        // Use HASH in uppercase as per CMI PHP example (line 65)
                        HASH: hashResponse.hash, // Base64 SHA512 hash from backend
                      }
                      
                      // Debug logging
                      console.log('🚀 CMI Payment Form Preparation:', {
                        action: cmiForm.action,
                        method: cmiForm.method,
                        target: cmiForm.target,
                        formDataKeys: Object.keys(cmiFormData),
                        formData: {
                          ...cmiFormData,
                          HASH: hashResponse.hash.substring(0, 30) + '...',
                        },
                        hashLength: hashResponse.hash.length,
                      })
                      
                      // Log the exact order of parameters as they will be sent
                      const formKeys = Object.keys(cmiFormData).sort()
                      console.log('📋 CMI Form Parameters (sorted):', formKeys)
                      console.log('📝 CMI Form Values:', formKeys.map(key => `${key}=${cmiFormData[key]}`).join('&'))
                      
                      // Create hidden inputs for form
                      Object.entries(cmiFormData).forEach(([key, value]) => {
                        const input = document.createElement('input')
                        input.type = 'hidden'
                        input.name = key
                        input.value = String(value)
                        cmiForm.appendChild(input)
                        console.log(`✅ Added form field: ${key} = ${String(value).substring(0, 50)}${String(value).length > 50 ? '...' : ''}`)
                      })
                      
                      // Verify form is ready
                      console.log('🔍 Form verification:', {
                        formElement: cmiForm,
                        formAction: cmiForm.action,
                        formMethod: cmiForm.method,
                        formTarget: cmiForm.target,
                        inputCount: cmiForm.querySelectorAll('input').length,
                        allInputs: Array.from(cmiForm.querySelectorAll('input')).map(input => ({
                          name: input.name,
                          value: input.value.substring(0, 50) + (input.value.length > 50 ? '...' : '')
                        }))
                      })
                      
                      // Add form to body (EXACTLY as per CMI PHP example 2.SendData.php)
                      document.body.appendChild(cmiForm)
                      console.log('✅ Form added to body, ready to submit')
                      
                      // Close payment dialog BEFORE submitting (so it doesn't block the redirect)
                      setShowPaymentDialog(false)
                      setSelectedPaymentMethod(null)
                      setIsProcessingPayment(false)
                      
                      // Submit automatically (as per CMI example with onload="moveWindow()")
                      // Small delay to ensure dialog is closed and form is ready
                      setTimeout(() => {
                        console.log('🚀 Submitting CMI payment form to:', cmiForm.action)
                        console.log('📋 Form name:', cmiForm.name)
                        console.log('📋 Form method:', cmiForm.method)
                        console.log('📋 Form action:', cmiForm.action)
                        console.log('📋 Input count:', cmiForm.querySelectorAll('input').length)
                        
                        // Submit the form - this will redirect to CMI payment gateway
                        // Following CMI example: document.pay_form.submit()
                        if (cmiForm.name === 'pay_form') {
                          (window as any).pay_form = cmiForm
                        }
                        cmiForm.submit()
                        console.log('✅ Form submitted (should redirect to CMI now)')
                      }, 200)
                      
                      // Note: We do NOT show success dialog here because payment hasn't been confirmed yet
                      // Success will be handled by the /payment/success page after CMI redirects back
                    } catch (hashError: any) {
                      console.error('Failed to generate CMI hash:', hashError)
                      setIsProcessingPayment(false)
                      setSubmitError(hashError.message || 'Failed to generate payment security code. Please try again.')
                    }
                  }
                } catch (error) {
                  console.error('Payment redirect error:', error)
                  setIsProcessingPayment(false)
                  setSubmitError('Failed to redirect to payment. Please try again.')
                }
              }}
              disabled={!selectedPaymentMethod || isProcessingPayment}
              className="w-full sm:w-auto gap-2"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Pay Now
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">
              Reservation Successful!
            </DialogTitle>
            <DialogDescription className="text-center pt-2 text-base">
              Your reservation has been submitted successfully!
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-muted-foreground">Booking Submitted</span>
              </div>
            </div>
            {bookingSuccessData?.bookingReference && (
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Booking Reference</p>
                <p className="text-sm font-mono font-semibold text-foreground">{bookingSuccessData.bookingReference}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowSuccessDialog(false)
                // Optionally scroll to top or reset view
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="w-full gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Got it!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
