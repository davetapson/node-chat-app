const expect = require('expect');

var { generateMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate a message consistent with inputs', () => {
    
    var msgFrom = 'Dave';
    var msgText = 'Hello';

    var message = generateMessage(msgFrom, msgText);

    expect(message).toExist();
    expect(message.from).toBe(msgFrom);
    expect(message.text).toBe(msgText);
    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({
      from: msgFrom,
      text: msgText
    })
    
  })
})