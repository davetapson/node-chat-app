const expect = require('expect');
const { isRealString } = require('./validation');

describe('validation.isRealSTring', () => {
  it('should reject non-string values', () => {
    var number = 1;
    var obj = { test: 'hello' }

    expect(isRealString(number)).toBe(false);
    expect(isRealString(obj)).toBe(false);
  })
  it('should reject string with only spaces', () => {
    expect(isRealString(' ')).toBe(false);
    expect(isRealString('    ')).toBe(false);
  })
  it('should allow string with non space characters', () => {
    expect(isRealString(' l o t r ')).toBe(true)
  })
})