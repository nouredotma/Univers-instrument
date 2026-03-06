import { offers, getOfferById, getTranslatedOffer } from './offers-data';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://api.marrakeshtravelservices.com/api/v1'

export class ApiError extends Error {
  error?: string

  constructor(message: string, error?: string) {
    super(message)
    this.name = 'ApiError'
    this.error = error
  }
}

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    // Determine which token to use based on endpoint
    // Admin endpoints use admin_token, user endpoints use token
    let token: string | null = null
    if (typeof window !== 'undefined') {
      const isAdminEndpoint = endpoint.startsWith('/admin')
      if (isAdminEndpoint) {
        token = localStorage.getItem('admin_token')
      } else {
        // For user endpoints, ONLY use user token, never admin token
        token = localStorage.getItem('token')
      }
    }
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
      // Debug logging for token
      if (process.env.NODE_ENV === 'development') {
        const tokenType = endpoint.startsWith('/admin') ? 'admin_token' : 'token'
        console.log(`🔑 Using ${tokenType} for ${endpoint}:`, token.substring(0, 20) + '...')
        
        // Decode token to verify it has the right structure
        try {
          const tokenParts = token.split('.')
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]))
            if (endpoint.startsWith('/admin')) {
              console.log(`   Token payload:`, { adminId: payload.adminId, role: payload.role })
            } else {
              console.log(`   Token payload:`, { userId: payload.userId, role: payload.role })
            }
          }
        } catch (e) {
          // Ignore decode errors
        }
      }
    } else {
      console.warn(`⚠️ No token found for request to ${endpoint}`)
    }

    const config: RequestInit = {
      ...options,
      headers,
    }

    try {
      const response = await fetch(url, config)
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return {} as T
      }

      const data = await response.json()

      if (!response.ok) {
        // If it's a 401 and we have a token, log it for debugging
        if (response.status === 401 && token) {
          try {
            const tokenParts = token.split('.')
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]))
              console.error('❌ 401 Unauthorized with token:', {
                userId: payload.userId,
                role: payload.role,
                endpoint: endpoint,
                errorMessage: data.message
              })
            }
          } catch (e) {
            console.error('Could not decode token for debugging:', e)
          }
        }
        
        throw new ApiError(
          data.message || 'An error occurred',
          data.error
        )
      }

      return data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      if (error instanceof Error) {
        throw new ApiError(error.message)
      }
      throw error
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    })
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

// Auth API methods
export const authApi = {
  adminLogin: async (username: string, password: string) => {
    const client = new ApiClient()
    return client.post<{
      message: string
      token: string
      admin: {
        id: string
        username: string
        email: string
        role: string
      }
    }>('/auth/admin/login', { username, password })
  },
  login: async (email: string | null, phone: string | null, password: string) => {
    const client = new ApiClient()
    return client.post<{
      message: string
      token: string
      user: {
        id: string
        name: string
        email: string | null
        phone: string | null
        role: string
      }
    }>('/auth/login', { email, phone, password })
  },
  register: async (name: string, email: string, phone: string, password: string) => {
    const client = new ApiClient()
    return client.post<{
      message: string
      token: string
      user: {
        id: string
        name: string
        email: string | null
        phone: string | null
        role: string
      }
    }>('/auth/register', { name, email, phone, password })
  },
  requestPasswordReset: async (email: string) => {
    const client = new ApiClient()
    return client.post<{
      message: string
    }>('/auth/forgot-password', { email })
  },
  resetPassword: async (token: string, password: string) => {
    const client = new ApiClient()
    return client.post<{
      message: string
    }>('/auth/reset-password', { token, password })
  },
  getMe: async () => {
    const client = new ApiClient()
    return client.get<{
      user: {
        id: string
        name: string
        email: string | null
        phone: string | null
        role: string
        created_at: string
      }
    }>('/auth/me')
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const client = new ApiClient()
    return client.post<{
      message: string
    }>('/auth/change-password', { currentPassword, newPassword })
  },
}

export const offersApi = {
  getOffers: async (type?: string, language: string = 'en') => {
    // Return mock data directly. We ignore type mapping since there is only one type now, 
    // unless you want to filter by type later.
    return { offers };
  },
  getOfferById: async (id: string, language: string = 'en') => {
    const foundOffer = getOfferById(id);
    if (!foundOffer) {
      throw new ApiError('Offer not found');
    }
    // Note: the component expects a backend-style response format OR we can adapt it.
    // Given we will rewrite app/offers/[id]/page.tsx, returning the raw typed offer is simpler:
    return { offer: foundOffer };
  },
  getOfferByIdWithAllLanguages: async (id: string) => {
    const foundOffer = getOfferById(id);
    if (!foundOffer) {
      throw new ApiError('Offer not found');
    }
    return {
      offer: foundOffer,
      translations: foundOffer.translations || {},
    };
  },
}

// Admin API methods
export const adminApi = {
  getDashboard: async () => {
    const client = new ApiClient()
    return client.get<{ stats: { total_users: number; total_bookings: number; total_offers: number; total_affiliates: number; total_revenue: string | number } }>('/admin/dashboard')
  },
  createTour: async (data: any) => {
    const client = new ApiClient()
    return client.post<{ message: string; tour: any }>('/admin/tours', data)
  },
  createExcursion: async (data: any) => {
    const client = new ApiClient()
    return client.post<{ message: string; excursion: any }>('/admin/excursions', data)
  },
  createActivity: async (data: any) => {
    const client = new ApiClient()
    return client.post<{ message: string; activity: any }>('/admin/activities', data)
  },
  createTransfer: async (data: any) => {
    const client = new ApiClient()
    return client.post<{ message: string; transfer: any }>('/admin/transfers', data)
  },
  createPackage: async (data: any) => {
    const client = new ApiClient()
    return client.post<{ message: string; package: any }>('/admin/packages', data)
  },
  updatePackage: async (id: string, data: any) => {
    const client = new ApiClient()
    return client.patch<{ message: string; package: any }>(`/admin/packages/${id}`, data)
  },
  updateTour: async (id: string, data: any) => {
    const client = new ApiClient()
    return client.patch<{ message: string; tour: any }>(`/admin/tours/${id}`, data)
  },
  updateExcursion: async (id: string, data: any) => {
    const client = new ApiClient()
    return client.patch<{ message: string; excursion: any }>(`/admin/excursions/${id}`, data)
  },
  updateActivity: async (id: string, data: any) => {
    const client = new ApiClient()
    return client.patch<{ message: string; activity: any }>(`/admin/activities/${id}`, data)
  },
  updateTransfer: async (id: string, data: any) => {
    const client = new ApiClient()
    return client.patch<{ message: string; transfer: any }>(`/admin/transfers/${id}`, data)
  },
  deleteTour: async (id: string) => {
    const client = new ApiClient()
    return client.delete<{ message: string; deletedId: string }>(`/admin/tours/${id}`)
  },
  deleteExcursion: async (id: string) => {
    const client = new ApiClient()
    return client.delete<{ message: string; deletedId: string }>(`/admin/excursions/${id}`)
  },
  deleteActivity: async (id: string) => {
    const client = new ApiClient()
    return client.delete<{ message: string; deletedId: string }>(`/admin/activities/${id}`)
  },
  deleteTransfer: async (id: string) => {
    const client = new ApiClient()
    return client.delete<{ message: string; deletedId: string }>(`/admin/transfers/${id}`)
  },
  deletePackage: async (id: string) => {
    const client = new ApiClient()
    return client.delete<{ message: string; deletedId: string }>(`/admin/packages/${id}`)
  },
  getTransfers: async (language: string = 'en') => {
    const client = new ApiClient()
    return client.get<{ transfers: any[] }>(`/admin/transfers?language=${language}`)
  },
  getPackages: async (language: string = 'en') => {
    const client = new ApiClient()
    return client.get<{ packages: any[] }>(`/admin/packages?language=${language}`)
  },
  getBookings: async (status?: string, limit: number = 100, offset: number = 0) => {
    const client = new ApiClient()
    const params = new URLSearchParams()
    if (status) params.append('status', status.toUpperCase())
    params.append('limit', limit.toString())
    params.append('offset', offset.toString())
    return client.get<{ bookings: any[] }>(`/admin/bookings?${params.toString()}`)
  },
  getPayments: async (status?: string, limit: number = 100, offset: number = 0) => {
    const client = new ApiClient()
    const params = new URLSearchParams()
    if (status) params.append('status', status.toUpperCase())
    params.append('limit', limit.toString())
    params.append('offset', offset.toString())
    return client.get<{ payments: any[] }>(`/admin/payments?${params.toString()}`)
  },
  getUsers: async (limit: number = 100, offset: number = 0) => {
    const client = new ApiClient()
    const params = new URLSearchParams()
    params.append('limit', limit.toString())
    params.append('offset', offset.toString())
    return client.get<{ users: any[] }>(`/admin/users?${params.toString()}`)
  },
  getUserById: async (id: string) => {
    const client = new ApiClient()
    return client.get<{
      user: {
        id: string
        name: string
        email: string | null
        phone: string | null
        role: string
        isActive: boolean
        createdAt: string
        bookingsCount: number
      }
      bookings: Array<{
        id: string
        offerTitle: string
        offerType: string
        status: string
        totalPrice: number
        date: string
        createdAt: string
      }>
    }>(`/admin/users/${id}`)
  },
  getReviews: async (status?: string, limit: number = 100, offset: number = 0) => {
    const client = new ApiClient()
    const params = new URLSearchParams()
    if (status) params.append('status', status.toUpperCase())
    params.append('limit', limit.toString())
    params.append('offset', offset.toString())
    return client.get<{ reviews: any[] }>(`/admin/reviews?${params.toString()}`)
  },
  getAffiliates: async (status?: string, limit: number = 100, offset: number = 0) => {
    const client = new ApiClient()
    const params = new URLSearchParams()
    if (status) params.append('status', status.toUpperCase())
    params.append('limit', limit.toString())
    params.append('offset', offset.toString())
    return client.get<{ affiliates: any[] }>(`/admin/affiliates?${params.toString()}`)
  },
  getPromoCodes: async (limit: number = 100, offset: number = 0) => {
    const client = new ApiClient()
    const params = new URLSearchParams()
    params.append('limit', limit.toString())
    params.append('offset', offset.toString())
    return client.get<{ promoCodes: any[] }>(`/admin/promo-codes?${params.toString()}`)
  },
  createPromoCode: async (data: any) => {
    const client = new ApiClient()
    return client.post<{ message: string; promoCode: any }>('/admin/promo-codes', data)
  },
  getPromoCodes: async (limit: number = 100, offset: number = 0) => {
    const client = new ApiClient()
    const params = new URLSearchParams()
    params.append('limit', limit.toString())
    params.append('offset', offset.toString())
    return client.get<{ promoCodes: any[] }>(`/admin/promo-codes?${params.toString()}`)
  },
  getAffiliateById: async (id: string) => {
    const client = new ApiClient()
    return client.get<{ affiliate: any }>(`/admin/affiliates/${id}`)
  },
  updateAffiliateStatus: async (id: string, status: 'ACTIVE' | 'INACTIVE') => {
    const client = new ApiClient()
    return client.patch<{
      message: string
      affiliate: any
    }>(`/admin/affiliates/${id}/status`, { status })
  },
  getBookingById: async (id: string) => {
    const client = new ApiClient()
    return client.get<{ booking: any }>(`/admin/bookings/${id}`)
  },
  updateBookingStatus: async (id: string, status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') => {
    const client = new ApiClient()
    return client.patch<{
      message: string
      booking: any
    }>(`/admin/bookings/${id}/status`, { status })
  },
  // Team management (SUPER_ADMIN only)
  getTeamMembers: async (limit: number = 100, offset: number = 0) => {
    const client = new ApiClient()
    const params = new URLSearchParams()
    params.append('limit', limit.toString())
    params.append('offset', offset.toString())
    return client.get<{
      teamMembers: Array<{
        id: string
        username: string
        email: string
        role: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR'
        last_login: string | null
        created_at: string
        permissions: Array<{
          page: string
          can_read: boolean
          can_write: boolean
          can_delete: boolean
        }>
      }>
      total: number
      limit: number
      offset: number
    }>(`/admin/team?${params.toString()}`)
  },
  getTeamMemberById: async (id: string) => {
    const client = new ApiClient()
    return client.get<{
      teamMember: {
        id: string
        username: string
        email: string
        role: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR'
        last_login: string | null
        created_at: string
        permissions: Array<{
          page: string
          can_read: boolean
          can_write: boolean
          can_delete: boolean
        }>
      }
    }>(`/admin/team/${id}`)
  },
  createTeamMember: async (data: {
    username: string
    email: string
    password: string
    permissions?: Array<{
      page: string
      can_read: boolean
      can_write: boolean
      can_delete: boolean
    }>
  }) => {
    const client = new ApiClient()
    return client.post<{
      message: string
      teamMember: {
        id: string
        username: string
        email: string
        role: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR'
        created_at: string
        permissions: Array<{
          page: string
          can_read: boolean
          can_write: boolean
          can_delete: boolean
        }>
      }
    }>('/admin/team', data)
  },
  updateTeamMember: async (id: string, data: {
    username?: string
    email?: string
    password?: string
    permissions?: Array<{
      page: string
      can_read: boolean
      can_write: boolean
      can_delete: boolean
    }>
  }) => {
    const client = new ApiClient()
    return client.patch<{
      message: string
      teamMember: {
        id: string
        username: string
        email: string
        role: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR'
        last_login: string | null
        created_at: string
        permissions: Array<{
          page: string
          can_read: boolean
          can_write: boolean
          can_delete: boolean
        }>
      }
    }>(`/admin/team/${id}`, data)
  },
  deleteTeamMember: async (id: string) => {
    const client = new ApiClient()
    return client.delete<{ message: string }>(`/admin/team/${id}`)
  },
  // Get current admin's permissions
  getMyPermissions: async () => {
    const client = new ApiClient()
    return client.get<{
      admin: {
        id: string
        username: string
        email: string
        role: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR'
      }
      permissions: Array<{
        page: string
        can_read: boolean
        can_write: boolean
        can_delete: boolean
      }>
    }>('/admin/me/permissions')
  },
  // Site Settings
  getSiteSettings: async () => {
    const client = new ApiClient()
    return client.get<{
      settings: Record<string, string>
    }>('/settings')
  },
  getAllSiteSettings: async () => {
    const client = new ApiClient()
    return client.get<{
      settings: Array<{
        id: string
        setting_key: string
        setting_value: string | null
        description: string | null
        created_at: string
        updated_at: string
      }>
    }>('/admin/settings')
  },
  updateSiteSettings: async (settings: Array<{
    setting_key: string
    setting_value?: string
    description?: string
  }>) => {
    const client = new ApiClient()
    return client.patch<{
      message: string
      settings: Array<{
        id: string
        setting_key: string
        setting_value: string | null
        description: string | null
        created_at: string
        updated_at: string
      }>
    }>('/admin/settings', { settings })
  },
  // Blog Posts
  getAllBlogPosts: async () => {
    const client = new ApiClient()
    return client.get<{
      blogPosts: Array<{
        id: string
        title: Record<string, string>
        content: Record<string, string>
        author: string
        main_image: string | null
        publish_date: string | null
        is_published: boolean
        created_at: string
        updated_at: string
        thumbnail_images: Array<{
          id: string
          image_url: string
          image_order: number
        }>
      }>
    }>('/admin/blog')
  },
  getBlogPostById: async (id: string) => {
    const client = new ApiClient()
    return client.get<{
      blogPost: {
        id: string
        title: Record<string, string>
        content: Record<string, string>
        author: string
        main_image: string | null
        publish_date: string | null
        is_published: boolean
        created_at: string
        updated_at: string
        thumbnail_images: Array<{
          id: string
          image_url: string
          image_order: number
        }>
      }
    }>(`/admin/blog/${id}`)
  },
  createBlogPost: async (data: {
    title: Record<string, string>
    content: Record<string, string>
    author: string
    mainImage?: string
    thumbnailImages?: string[]
    publishDate?: string
    isPublished?: boolean
  }) => {
    const client = new ApiClient()
    return client.post<{
      message: string
      blogPost: {
        id: string
        title: Record<string, string>
        content: Record<string, string>
        author: string
        main_image: string | null
        publish_date: string | null
        is_published: boolean
        created_at: string
        updated_at: string
        thumbnail_images: Array<{
          id: string
          image_url: string
          image_order: number
        }>
      }
    }>('/admin/blog', data)
  },
  updateBlogPost: async (id: string, data: {
    title?: Record<string, string>
    content?: Record<string, string>
    author?: string
    mainImage?: string
    thumbnailImages?: string[]
    publishDate?: string
    isPublished?: boolean
  }) => {
    const client = new ApiClient()
    return client.put<{
      message: string
      blogPost: {
        id: string
        title: Record<string, string>
        content: Record<string, string>
        author: string
        main_image: string | null
        publish_date: string | null
        is_published: boolean
        created_at: string
        updated_at: string
        thumbnail_images: Array<{
          id: string
          image_url: string
          image_order: number
        }>
      }
    }>(`/admin/blog/${id}`, data)
  },
  deleteBlogPost: async (id: string) => {
    const client = new ApiClient()
    return client.delete<{ message: string }>(`/admin/blog/${id}`)
  },
}

// Booking API methods
export const bookingApi = {
  createBooking: async (data: {
    offerId: string
    offerType: string
    date: string
    adults: number
    children: number
    promoCodeId?: string
    totalPrice?: number
    affiliateCode?: string
  }, token?: string) => {
    const url = `${API_BASE_URL}/bookings`
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    // Use provided token or get from localStorage
    const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null)
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        errorData.message || 'Failed to create booking',
        errorData.error
      )
    }
    
    return response.json() as Promise<{
      message: string
      booking: any
    }>
  },
  getBookings: async (status?: string, language: string = 'en', limit: number = 50, offset: number = 0) => {
    const client = new ApiClient()
    const params = new URLSearchParams()
    if (status) params.append('status', status.toUpperCase())
    params.append('language', language)
    params.append('limit', limit.toString())
    params.append('offset', offset.toString())
    return client.get<{ bookings: any[] }>(`/bookings?${params.toString()}`)
  },
  getBookingById: async (id: string) => {
    const client = new ApiClient()
    return client.get<{ booking: any }>(`/bookings/${id}`)
  },
  getBookingByReference: async (reference: string) => {
    // This is a public endpoint, no auth required
    const url = `${API_BASE_URL}/bookings/reference/${reference}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        errorData.message || 'Failed to get booking',
        errorData.error
      )
    }
    
    return response.json() as Promise<{
      booking: any
    }>
  },
}

// User API methods
// Payment API methods
export const paymentApi = {
  createPayPalOrder: async (data: {
    amount: number;
    currency?: string;
    bookingReference?: string;
    returnUrl?: string;
    cancelUrl?: string;
  }) => {
    const client = new ApiClient()
    return client.post<{ orderId: string; approvalUrl: string; order: any }>('/payments/paypal/order', data)
  },
  capturePayPalOrder: async (orderId: string, bookingReference?: string) => {
    const client = new ApiClient()
    const params = new URLSearchParams({ orderId })
    if (bookingReference) {
      params.append('bookingReference', bookingReference)
    }
    return client.get<{ success: boolean; orderId: string; status: string; paymentStatus: string; capture: any; order: any; bookingUpdated: boolean }>(`/payments/paypal/capture?${params.toString()}`)
  },
  generateCMIHash: async (data: {
    clientid: string;
    username: string;
    storetype?: string;
    hashAlgorithm?: string;
    currency?: string;
    oid: string;
    amount: string;
    okUrl: string;
    failUrl: string;
    rnd: string;
  }) => {
    const client = new ApiClient()
    return client.post<{ hash: string; formattedAmount: string }>('/payments/cmi-hash', data)
  },
}

// User API methods
export const userApi = {
  getProfile: async () => {
    const client = new ApiClient()
    return client.get<{ user: any }>('/users/profile')
  },
  updateProfile: async (data: { name?: string; email?: string; phone?: string }) => {
    const client = new ApiClient()
    return client.patch<{
      message: string
      user: {
        id: string
        name: string
        email: string | null
        phone: string | null
        role: string
        created_at: string
      }
    }>('/users/profile', data)
  },
  getFavorites: async (language: string = 'en') => {
    const client = new ApiClient()
    return client.get<{ favorites: any[] }>(`/users/favorites?language=${language}`)
  },
  addFavorite: async (offerId: string, offerType: string) => {
    const client = new ApiClient()
    return client.post<{ message: string; favorite: any }>('/users/favorites', { offerId, offerType })
  },
  removeFavorite: async (offerId: string) => {
    const client = new ApiClient()
    return client.delete<{ message: string }>(`/users/favorites/${offerId}`)
  },
}

// Upload API methods
export const uploadApi = {
  uploadFile: async (file: File): Promise<string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to upload file')
    }

    const data = await response.json()
    return data.url
  },

  uploadFiles: async (files: File[]): Promise<string[]> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to upload files')
    }

    const data = await response.json()
    return data.files.map((f: any) => f.url)
  },
}

// Blog API methods (public)
export const blogApi = {
  getAllBlogPosts: async () => {
    const client = new ApiClient()
    return client.get<{
      blogPosts: Array<{
        id: string
        title: Record<string, string>
        content: Record<string, string>
        author: string
        main_image: string | null
        publish_date: string | null
        created_at: string
        updated_at: string
        thumbnail_images: Array<{
          id: string
          image_url: string
          image_order: number
        }>
      }>
    }>('/blog')
  },
  getBlogPostById: async (id: string) => {
    const client = new ApiClient()
    return client.get<{
      blogPost: {
        id: string
        title: Record<string, string>
        content: Record<string, string>
        author: string
        main_image: string | null
        publish_date: string | null
        created_at: string
        updated_at: string
        thumbnail_images: Array<{
          id: string
          image_url: string
          image_order: number
        }>
      }
    }>(`/blog/${id}`)
  },
}

// Affiliate API methods
export const affiliateApi = {
  register: async (name: string, email: string, commissionRate?: number) => {
    const client = new ApiClient()
    return client.post<{
      message: string
      affiliate: any
    }>('/affiliates/register', { name, email, commissionRate })
  },
  getDashboard: async () => {
    const client = new ApiClient()
    return client.get<{
      affiliate: any
      recentBookings: any[]
      recentCommissions: any[]
    }>('/affiliates/dashboard')
  },
  createLink: async (name: string, baseUrl: string) => {
    const client = new ApiClient()
    return client.post<{
      message: string
      link: any
    }>('/affiliates/links', { name, baseUrl })
  },
  getLinks: async () => {
    const client = new ApiClient()
    return client.get<{ links: any[] }>('/affiliates/links')
  },
  getCommissions: async () => {
    const client = new ApiClient()
    return client.get<{ commissions: any[] }>('/affiliates/commissions')
  },
  getBookings: async (language: string = 'en') => {
    const client = new ApiClient()
    return client.get<{ bookings: any[] }>(`/affiliates/bookings?language=${language}`)
  },
}

// Export default client instance
export const apiClient = new ApiClient()
export default apiClient

