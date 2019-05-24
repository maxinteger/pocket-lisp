import { StdoutManager } from 'lang/dataTypes/StdoutManager'
import { expect } from 'chai'

describe('StdoutManager', () => {
  describe('read', () => {
    it('should return with empty string after init', () => {
      const actual = new StdoutManager().read()
      const expected = ''
      expect(actual).equals(expected)
    })

    it('should return with the added text', () => {
      const sm = new StdoutManager()
      sm.cb('1')
      sm.cb('2')
      sm.cb('3')

      const actual = sm.read()
      const expected = '123'
      expect(actual).equals(expected)
    })
  })
})
