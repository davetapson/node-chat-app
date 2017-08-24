const expect = require('expect');
const { Users } = require('./users');

describe('Users', () => {

  var users;
  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Mike 1',
      room: 'Room 1'
    }, {
      id: '2',
      name: 'Jon 1',
      room: 'Room 1'
    }, {
      id: '3',
      name: 'Fred 3',
      room: 'Room 2'
    }];
  });


  it('should add a new user', () => {
    var users = new Users;
    var user = {
      id: '123',
      name: 'Dave',
      room: 'Room 1'
    };
    var resUser = users.addUser('123', 'Dave', 'Room 1');

    expect(resUser).toMatch(user);
    expect(users.users).toEqual([user]);
  })

  it('should return names for Room 1', () => {
    expect(users.getUserList('Room 1')).toMatch(['Mike 1', 'Jon 1']);
  })

  it('should get Mike 1 from users', () => {
    expect(users.getUser('1')).toMatch({
      id: '1',
      name: 'Mike 1',
      room: 'Room 1'
    });
  });

  it('should not find a non-existent user', () => {
    expect(users.getUser('10')).toNotExist;
  });

  it('should remove Jon 1 from Room 1 list', () => {
    var result = users.removeUser('2');
    expect(users.getUserList('Room 1')).toMatch(['Mike 1']);
  })

  it('should not remove non-existent user from array', ()=>{
    var result = users.removeUser('20');
    expect(users.users.length).toBe(3);
  })

})