/**
 * Centralized error messages for the application
 * Facilitates i18n and consistency across the codebase
 */

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  ACCOUNT_DEACTIVATED: 'Account is deactivated',
  USER_NOT_FOUND_AFTER_CREATION: 'User not found after creation',
  USER_NOT_FOUND: 'User not found',
} as const

export const VALIDATION_ERRORS = {
  PASSWORD_MIN_LENGTH: 'Le mot de passe doit contenir au moins 8 caractères',
  PASSWORD_PATTERN:
    'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
  EMAIL_ALREADY_EXISTS: 'Cet email est déjà utilisé',
  EMAIL_INVALID: 'Email invalide',
  ROLE_INVALID: 'Le rôle doit être "client" ou "artist"',
} as const

export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: 'Compte créé avec succès ! Bienvenue sur Blottr.',
  LOGIN_SUCCESS: 'Connexion réussie',
  LOGOUT_SUCCESS: 'Déconnexion réussie',
} as const

export const RATE_LIMIT_ERRORS = {
  TOO_MANY_REQUESTS: 'Trop de requêtes. Veuillez réessayer plus tard.',
} as const
