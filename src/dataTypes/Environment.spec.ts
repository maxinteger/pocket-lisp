import { Environment } from './Environment'

describe('Environment', () => {
  describe('define', () => {
    it('should define new item', () => {
      const env = new Environment()
      env.define('var', 42)
      const actual = env.get('var')
      const expected = 42
      expect(actual).toBe(expected)
    })

    it('should overwrite the previous definition', () => {
      const env = new Environment()
      env.define('var', 42)
      env.define('var', 43)
      const actual = env.get('var')
      const expected = 43
      expect(actual).toBe(expected)
    })

    it('should throw error if the variable defined and it is locked', () => {
      expect(() => {
        const env = new Environment()
        env.define('var', 42, true)
        env.define('var', 43)
      }).toThrow(`'var' is locked and it is not re-definable.`)
    })
  })

  describe('get', () => {
    it('should return with defined value', () => {
      const env = new Environment()
      env.define('var', 42)
      const actual = env.get('var')
      const expected = 42
      expect(actual).toBe(expected)
    })

    it('should check the enclosed environment for the value', () => {
      const global = new Environment()
      const env = new Environment(global)
      global.define('var', 42)
      const actual = env.get('var')
      const expected = 42
      expect(actual).toBe(expected)
    })

    it('should throw error if the key is not defined in any environment', () => {
      const env = new Environment()
      const actual = () => env.get('var')
      expect(actual).toThrow("Undefined identifier: 'var'.")
    })
  })

  describe('assign', () => {
    it('should change the original value', () => {
      const env = new Environment()
      env.define('var', 42)
      env.assign('var', 43)
      const actual = env.get('var')
      const expected = 43
      expect(actual).toBe(expected)
    })

    it('should change the value in the enclosed environment', () => {
      const global = new Environment()
      const env = new Environment(global)
      global.define('var', 42)
      env.assign('var', 43)
      const actual = env.get('var')
      const expected = 43
      expect(actual).toBe(expected)
    })

    it('should throw error if the key is not defined in any environment', () => {
      const env = new Environment()
      const actual = () => env.assign('var', 42)
      expect(actual).toThrow("Undefined identifier: 'var'.")
    })
  })
})
