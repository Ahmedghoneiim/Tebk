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

const optionalPhone = z
  .string()
  .refine(
    val => val === '' || /^(01[0125][0-9]{8})$/.test(val),
    { message: 'Please enter a valid 11-digit Egyptian phone number.' }
  )
  .optional()

const emailField = z
  .string()
  .email('Enter a valid email address.')
  .trim()
  .refine(
    val => val.indexOf('@') >= 5,
    { message: 'Email address must have at least 5 characters before @.' }
  )

/* ── Schemas ── */
export const adminLoginSchema = z.object({
  email:    emailField,
  password: z.string().min(1, 'Password is required.'),
})

export const adminSignUpSchema = z
  .object({
    fullName:        fullNameField,
    email:           emailField,
    password:        passwordField,
    confirmPassword: z.string(),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

export const adminForgotPasswordSchema = z.object({
  email: emailField,
})

export const adminResetPasswordSchema = z
  .object({
    password:        passwordField,
    confirmPassword: z.string(),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

export const adminProfileSchema = z.object({
  fullName: fullNameField,
  phone:    optionalPhone,
  city:     z.string().optional(),
  address:  z.string().optional(),
})
