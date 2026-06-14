import { z } from 'zod'

/* ── Reusable field validators ── */
const passwordField = z
  .string()
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,32}$/,
    'Password must be between 8 and 32 characters and contain both letters and numbers.'
  )

const fullNameField = z
  .string()
  .regex(
    /^[a-zA-Z]{2,}(?:\s+[a-zA-Z]{2,})+$/,
    'Please enter your full name in English (at least two words).'
  )

const PHONE_RE    = /^(\+?20)?0?1[0125][0-9]{8}$/
const PHONE_ERROR = 'Please enter a valid Egyptian phone number.'

const phoneField = z.string().regex(PHONE_RE, PHONE_ERROR)

// Profile phone is free — no forced format, any string or empty is accepted.
const optionalPhone = z.string().optional()

const emailField = z
  .string()
  .email('Please enter a valid email address.')
  .trim()
  .refine(
    val => val.indexOf('@') >= 5,
    { message: 'Email address must have at least 5 characters before @.' }
  )

/* ── Schemas ── */
export const loginSchema = z.object({
  email:    emailField,
  password: z.string().min(1, 'Password is required.'),
})

export const registerSchema = z
  .object({
    fullName:        fullNameField,
    email:           emailField,
    password:        passwordField,
    confirmPassword: z.string(),
    role:            z.enum(['client', 'supplier']).default('client'),
    clinicName:      z.string().optional(),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

export const forgotPasswordSchema = z.object({
  email: emailField,
})

export const resetPasswordSchema = z
  .object({
    password:        passwordField,
    confirmPassword: z.string(),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

export const checkoutSchema = z.object({
  fullName:      fullNameField,
  email:         emailField,
  phone:         phoneField,
  address:       z.string().min(5, 'Please enter a valid address.'),
  city:          z.string().min(2, 'Please enter a city.'),
  notes:         z.string().optional(),
  paymentMethod: z.enum(['card', 'cash']).default('cash'), // Supported values are card & cash
})

export const profileSchema = z.object({
  fullName:   fullNameField,
  phone:      optionalPhone,
  clinicName: z.string().optional(),
  address:    z.string().optional(),
  city:       z.string().optional(),
})
