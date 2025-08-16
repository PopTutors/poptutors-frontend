import { z } from 'zod';

export const signupSchema = z
  .object({
    name: z.string().min(2, 'Name is required'),
    phone: z.string().min(10, 'Phone number is too short').max(15, 'Phone number is too long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    rememberMe: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignupInput = z.infer<typeof signupSchema>;
