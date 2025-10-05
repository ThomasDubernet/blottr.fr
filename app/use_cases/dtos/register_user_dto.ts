import { UserRole } from '#models/user'

export interface RegisterUserInput {
  email: string
  password: string
  role: 'client' | 'artist'
}

export interface RegisterUserOutput {
  userId: number
  email: string
  role: UserRole
}
