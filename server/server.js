const path = require('path');

// express - web framework
const express = require('express');
const app = express();

// get path for html files
const publicPath = path.join(__dirname, '../public');

// for Heroku - use Heroku environment port value or 3000
const port = process.env.PORT || 3000;

// use public 
app.use(express.static(publicPath));

// routes
// / 
// app.get('/', (req, res) => {
//   res.send('Hello World');
// });

// start up express listener
app.listen(3000, () =>{
  console.log(`App listening on port: ${port}`);
});
