import { expect } from 'chai'
import { toJS } from 'stdlib/types'
import { plString } from 'stdlib/data/PLString'

describe('stdlib/core/PLString', () => {
  it('should create empty String', () => {
    expect(plString()).deep.equal({ _value: '' })
  })
  it('should have proper toString', () => {
    expect(plString().toString()).equal('')
    expect(plString('hello world').toString()).equal('hello world')
  })

  describe('toJS', () => {
    it('should return with the JS representation', () => {
      expect(plString('hello world')[toJS]()).equal('hello world')
    })
  })
})
