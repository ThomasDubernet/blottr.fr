import { UserRole } from '#models/user'
import { DateTime } from 'luxon'

export interface LoginUserInput {
  email: string
  password: string
}

export interface LoginUserOutput {
  userId: number
  email: string
  role: UserRole
  lastLoginAt: DateTime | null
}
