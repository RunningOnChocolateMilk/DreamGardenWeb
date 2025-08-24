import { z } from 'zod'

// Input validation schemas
export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date'),
  priority: z.enum(['low', 'medium', 'high']),
  category: z.enum(['watering', 'fertilizing', 'pruning', 'planting', 'harvesting', 'general']),
  bedId: z.string().optional(),
})

export const bedSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  location: z.string().min(1, 'Location is required').max(100, 'Location too long'),
  area: z.number().positive('Area must be positive'),
  description: z.string().max(200, 'Description too long').optional(),
})

export const plantSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  type: z.string().min(1, 'Type is required').max(30, 'Type too long'),
  bedId: z.string().min(1, 'Bed ID is required'),
  plantedDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date'),
  expectedHarvestDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date').optional(),
  notes: z.string().max(200, 'Notes too long').optional(),
})

// Sanitization functions
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Rate limiting helper
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private maxRequests: number
  private windowMs: number

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const windowStart = now - this.windowMs
    
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, [now])
      return true
    }

    const requests = this.requests.get(identifier)!
    const recentRequests = requests.filter(time => time > windowStart)
    
    if (recentRequests.length >= this.maxRequests) {
      return false
    }

    recentRequests.push(now)
    this.requests.set(identifier, recentRequests)
    return true
  }

  cleanup(): void {
    const now = Date.now()
    const windowStart = now - this.windowMs
    
    this.requests.forEach((requests, identifier) => {
      const recentRequests = requests.filter(time => time > windowStart)
      if (recentRequests.length === 0) {
        this.requests.delete(identifier)
      } else {
        this.requests.set(identifier, recentRequests)
      }
    })
  }
}

// XSS Protection
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// CSRF Token generation
export const generateCSRFToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Input length validation
export const validateInputLength = (input: string, min: number, max: number): boolean => {
  return input.length >= min && input.length <= max
}

// File type validation
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type)
}

// File size validation
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024
}
