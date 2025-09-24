import { test } from '@japa/runner'
import { loginValidator } from '#validators/login'

test.group('LoginValidator Unit Tests', () => {
  // TDD: RED - Tests qui échouent d'abord

  test('should validate correct email and password', async ({ assert }) => {
    const validData = {
      email: 'test@example.fr',
      password: 'password123'
    }

    const result = await loginValidator.validate(validData)

    assert.deepEqual(result, {
      email: 'test@example.fr',
      password: 'password123'
    })
  })

  test('should normalize email to lowercase', async ({ assert }) => {
    const dataWithUppercaseEmail = {
      email: 'TEST@EXAMPLE.FR',
      password: 'password123'
    }

    const result = await loginValidator.validate(dataWithUppercaseEmail)

    assert.equal(result.email, 'test@example.fr')
  })

  test('should reject invalid email format', async ({ assert }) => {
    const invalidEmailData = {
      email: 'invalid-email',
      password: 'password123'
    }

    try {
      await loginValidator.validate(invalidEmailData)
      assert.fail('Validation should have failed')
    } catch (error) {
      assert.isTrue(error.messages?.some((msg: any) => msg.field === 'email'))
    }
  })

  test('should reject empty email', async ({ assert }) => {
    const emptyEmailData = {
      email: '',
      password: 'password123'
    }

    try {
      await loginValidator.validate(emptyEmailData)
      assert.fail('Validation should have failed')
    } catch (error) {
      assert.isTrue(error.messages?.some((msg: any) => msg.field === 'email'))
    }
  })

  test('should reject password shorter than 8 characters', async ({ assert }) => {
    const shortPasswordData = {
      email: 'test@example.fr',
      password: '1234567'
    }

    try {
      await loginValidator.validate(shortPasswordData)
      assert.fail('Validation should have failed')
    } catch (error) {
      assert.isTrue(error.messages?.some((msg: any) => msg.field === 'password'))
    }
  })

  test('should reject empty password', async ({ assert }) => {
    const emptyPasswordData = {
      email: 'test@example.fr',
      password: ''
    }

    try {
      await loginValidator.validate(emptyPasswordData)
      assert.fail('Validation should have failed')
    } catch (error) {
      assert.isTrue(error.messages?.some((msg: any) => msg.field === 'password'))
    }
  })

  test('should reject missing email field', async ({ assert }) => {
    const missingEmailData = {
      password: 'password123'
    }

    try {
      await loginValidator.validate(missingEmailData)
      assert.fail('Validation should have failed')
    } catch (error) {
      assert.isTrue(error.messages?.some((msg: any) => msg.field === 'email'))
    }
  })

  test('should reject missing password field', async ({ assert }) => {
    const missingPasswordData = {
      email: 'test@example.fr'
    }

    try {
      await loginValidator.validate(missingPasswordData)
      assert.fail('Validation should have failed')
    } catch (error) {
      assert.isTrue(error.messages?.some((msg: any) => msg.field === 'password'))
    }
  })

  test('should accept password with exactly 8 characters', async ({ assert }) => {
    const exactLengthData = {
      email: 'test@example.fr',
      password: '12345678'
    }

    const result = await loginValidator.validate(exactLengthData)

    assert.equal(result.password, '12345678')
  })

  test('should accept long password', async ({ assert }) => {
    const longPasswordData = {
      email: 'test@example.fr',
      password: 'this-is-a-very-long-password-with-special-chars!@#$%'
    }

    const result = await loginValidator.validate(longPasswordData)

    assert.equal(result.password, 'this-is-a-very-long-password-with-special-chars!@#$%')
  })
})