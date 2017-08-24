const expect = require('expect');

var { generateMessage, generateLocationMessage } = require('./message');

describe('message.generateMessage', () => {
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

describe('message.generateLocationMessage', () => {
  it('should generate correct location message', () => {

    var from = 'Dave';
    var latitude = 1;
    var longitude = 2;

    var url = `https://www.google.com/maps?q=${latitude},${longitude}`;

    var locationMessage = generateLocationMessage(from, latitude, longitude);

    expect(locationMessage).toExist();
    expect(locationMessage).toInclude({
                                        from,
                                        url
                                      });
    expect(locationMessage.url).toBe(url);
    expect(locationMessage.createdAt).toBeA('number');
  });
});