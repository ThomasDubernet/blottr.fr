/**
 * AdonisJS Test Context Extensions
 */

declare module '@japa/runner/types' {
  interface TestContext {
    client: any // ApiClient from plugin-adonisjs
    route: any // RouteClientContract from plugin-adonisjs
  }
}
