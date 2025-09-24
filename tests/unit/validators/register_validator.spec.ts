import { test } from '@japa/runner'
import { registerValidator } from '#validators/register'

test.group('RegisterValidator Unit Tests', () => {
  // TDD: RED - Tests qui échouent d'abord

  test('should validate correct registration data', async ({ assert }) => {
    const validData = {
      email: 'newuser@example.fr',
      password: 'password123',
      password_confirmation: 'password123'
    }

    const result = await registerValidator.validate(validData)

    assert.deepEqual(result, {
      email: 'newuser@example.fr',
      password: 'password123'
    })
  })

  test('should normalize email to lowercase', async ({ assert }) => {
    const dataWithUppercaseEmail = {
      email: 'NEWUSER@EXAMPLE.FR',
      password: 'password123',
      password_confirmation: 'password123'
    }

    const result = await registerValidator.validate(dataWithUppercaseEmail)

    assert.equal(result.email, 'newuser@example.fr')
  })

  test('should reject mismatched password confirmation', async ({ assert }) => {
    const mismatchedData = {
      email: 'test@example.fr',
      password: 'password123',
      password_confirmation: 'differentpassword'
    }

    try {
      await registerValidator.validate(mismatchedData)
      assert.fail('Validation should have failed')
    } catch (error) {
      assert.isTrue(error.messages?.some((msg: any) => msg.field === 'password'))
    }
  })

  test('should reject invalid email format', async ({ assert }) => {
    const invalidEmailData = {
      email: 'invalid-email',
      password: 'password123',
      password_confirmation: 'password123'
    }

    try {
      await registerValidator.validate(invalidEmailData)
      assert.fail('Validation should have failed')
    } catch (error) {
      assert.isTrue(error.messages?.some((msg: any) => msg.field === 'email'))
    }
  })

  test('should reject password shorter than 8 characters', async ({ assert }) => {
    const shortPasswordData = {
      email: 'test@example.fr',
      password: '1234567',
      password_confirmation: '1234567'
    }

    try {
      await registerValidator.validate(shortPasswordData)
      assert.fail('Validation should have failed')
    } catch (error) {
      assert.isTrue(error.messages?.some((msg: any) => msg.field === 'password'))
    }
  })

  test('should reject empty email', async ({ assert }) => {
    const emptyEmailData = {
      email: '',
      password: 'password123',
      password_confirmation: 'password123'
    }

    try {
      await registerValidator.validate(emptyEmailData)
      assert.fail('Validation should have failed')
    } catch (error) {
      assert.isTrue(error.messages?.some((msg: any) => msg.field === 'email'))
    }
  })

  test('should reject empty password', async ({ assert }) => {
    const emptyPasswordData = {
      email: 'test@example.fr',
      password: '',
      password_confirmation: ''
    }

    try {
      await registerValidator.validate(emptyPasswordData)
      assert.fail('Validation should have failed')
    } catch (error) {
      assert.isTrue(error.messages?.some((msg: any) => msg.field === 'password'))
    }
  })

  test('should reject missing password_confirmation', async ({ assert }) => {
    const missingConfirmationData = {
      email: 'test@example.fr',
      password: 'password123'
    }

    try {
      await registerValidator.validate(missingConfirmationData)
      assert.fail('Validation should have failed')
    } catch (error) {
      assert.isTrue(error.messages?.some((msg: any) => msg.field === 'password'))
    }
  })

  test('should accept password with exactly 8 characters', async ({ assert }) => {
    const exactLengthData = {
      email: 'test@example.fr',
      password: '12345678',
      password_confirmation: '12345678'
    }

    const result = await registerValidator.validate(exactLengthData)

    assert.equal(result.password, '12345678')
  })

  test('should handle special characters in email', async ({ assert }) => {
    const specialEmailData = {
      email: 'user+test@example.fr',
      password: 'password123',
      password_confirmation: 'password123'
    }

    const result = await registerValidator.validate(specialEmailData)

    assert.equal(result.email, 'user+test@example.fr')
  })

  test('should not return password_confirmation in result', async ({ assert }) => {
    const validData = {
      email: 'test@example.fr',
      password: 'password123',
      password_confirmation: 'password123'
    }

    const result = await registerValidator.validate(validData)

    assert.isUndefined((result as any).password_confirmation)
    assert.property(result, 'email')
    assert.property(result, 'password')
  })
})