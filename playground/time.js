// Jan 1st 1970 00:00:00
const moment = require('moment');

console.log(new Date().getTime());
console.log(new Date().getMonth());

var date = moment();
console.log(date.format())

console.log(date.format('MMM'))
console.log(date.format('MMMM'))
console.log(date.format('YYYY-MM-DD HH:mm:ss'))
console.log(date.format('MMM Do YYYY'))
console.log(date.format("h:mm a"))
console.log(date.format(""))
