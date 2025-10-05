import { test } from '@japa/runner'
import { registerValidator } from '#validators/auth'

test.group('Auth Validators - Register', () => {
  test('doit accepter un mot de passe valide avec majuscule, minuscule et chiffre', async ({
    assert,
  }) => {
    // Arrange
    const data = {
      email: 'test@example.com',
      password: 'Password123',
      role: 'client' as const,
    }

    // Act & Assert - Should not throw
    await assert.doesNotRejects(async () => {
      await registerValidator.validate(data)
    })
  })

  test('doit rejeter un mot de passe sans majuscule', async ({ assert }) => {
    // Arrange
    const data = {
      email: 'test@example.com',
      password: 'password123',
      role: 'client' as const,
    }

    // Act & Assert
    try {
      await registerValidator.validate(data)
      assert.fail('La validation aurait dû échouer')
    } catch (error: any) {
      assert.properties(error, ['messages'])
      assert.equal(
        error.messages[0].message,
        'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
      )
    }
  })

  test('doit rejeter un mot de passe sans minuscule', async ({ assert }) => {
    // Arrange
    const data = {
      email: 'test@example.com',
      password: 'PASSWORD123',
      role: 'client' as const,
    }

    // Act & Assert
    try {
      await registerValidator.validate(data)
      assert.fail('La validation aurait dû échouer')
    } catch (error: any) {
      assert.properties(error, ['messages'])
      assert.equal(
        error.messages[0].message,
        'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
      )
    }
  })

  test('doit rejeter un mot de passe sans chiffre', async ({ assert }) => {
    // Arrange
    const data = {
      email: 'test@example.com',
      password: 'PasswordAbc',
      role: 'client' as const,
    }

    // Act & Assert
    try {
      await registerValidator.validate(data)
      assert.fail('La validation aurait dû échouer')
    } catch (error: any) {
      assert.properties(error, ['messages'])
      assert.equal(
        error.messages[0].message,
        'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
      )
    }
  })

  test('doit rejeter un mot de passe trop court (moins de 8 caractères)', async ({ assert }) => {
    // Arrange
    const data = {
      email: 'test@example.com',
      password: 'Pass12',
      role: 'client' as const,
    }

    // Act & Assert
    try {
      await registerValidator.validate(data)
      assert.fail('La validation aurait dû échouer')
    } catch (error: any) {
      assert.properties(error, ['messages'])
      assert.equal(error.messages[0].message, 'Le mot de passe doit contenir au moins 8 caractères')
    }
  })

  test('doit accepter un mot de passe avec caractères spéciaux', async ({ assert }) => {
    // Arrange
    const data = {
      email: 'test@example.com',
      password: 'P@ssw0rd!',
      role: 'client' as const,
    }

    // Act & Assert - Should not throw
    await assert.doesNotRejects(async () => {
      await registerValidator.validate(data)
    })
  })

  test('doit accepter un mot de passe long avec tous les critères', async ({ assert }) => {
    // Arrange
    const data = {
      email: 'test@example.com',
      password: 'MySecurePassword123!@#',
      role: 'client' as const,
    }

    // Act & Assert - Should not throw
    await assert.doesNotRejects(async () => {
      await registerValidator.validate(data)
    })
  })
})
