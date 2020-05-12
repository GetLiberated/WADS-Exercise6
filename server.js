require('dotenv').config()

let User = require('./model/user.model');
const mongoose = require('mongoose')
const uri = process.env.ATLAS_URI
mongoose.connect(
  uri,
  {
    useNewUrlParser: true,
    useCreateIndex: true 
  }
);
const connection = mongoose.connection
connection.once('open', () => {
  console.log("MongoDB database connection established successfully")
})

const express = require('express')
const app = express()
const port = 3000

app.get('/success', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

app.use(require('body-parser').urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (user.password !== password) { return done(null, false); }
        return done(null, user);
      });
    }
  ));
  
  passport.serializeUser(function(user, cb) {
    cb(null, user.id);
  });
  
  passport.deserializeUser(function(id, cb) {
    User.findById(id, function (err, user) {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });

app.post('/', 
  passport.authenticate('local', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/success');
  });

  app.get('/',
  function(req, res){
    res.send(`
    <form action="/" method="post">
        <div>
        <label>Username:</label>
        <input type="text" name="username"/><br/>
        </div>
        <div>
        <label>Password:</label>
        <input type="password" name="password"/>
        </div>
        <div>
        <input type="submit" value="Submit"/>
        </div>
    </form>
    `);
  });