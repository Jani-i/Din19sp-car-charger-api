const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const passport = require('passport')
const passportHttp = require('passport-http')
const cors = require('cors');
const port = 4000


app.use(bodyParser.json());
app.use(cors());

let users = [{
  id: "95bc85af-bfa4-48cb-b334-9865e313cbdb",
  username: "dude",
  password: "$2a$08$CHVl9LRGohsx3FaysyO4U.XaTkyKp6YQBTWR4L9qO2u8jET6.q1ta",
  email: "dude@dude"
}];

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', (req, res) =>{
  console.log(req.body)
  
  const passwordHash = bcrypt.hashSync(req.body.password, 8);

  users.push({
    id: uuidv4(),
    username: req.body.username,
    password: passwordHash,
    email: req.body.email
  });

  res.sendStatus(200);
});

app.get('/users', (req, res) => {
  res.json(users)
})

passport.use(new passportHttp.BasicStrategy(function(username, password, done){
  const userResult = users.find(user => user.username === username);
  if(userResult == undefined) {
    return done(null, false);
  }

  if(bcrypt.compareSync(password, userResult.password) == false)
  {
    return done(null, false);
  }
  
  done(null, userResult);
}));

app.post('/login', (passport.authenticate('basic', {session: false }), (req, res) => {
  console.log(req.user);
  res.sendStatus(200);
}));


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})