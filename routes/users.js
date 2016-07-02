'use strict';
let express = require('express');
let router = express.Router();
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let AdmZip = require('adm-zip');


let User = require('../models/user');

/* GET users listing. */
router.get('/workshop2',function(req,res,next){
  res.render('workshop2');
});

router.get('/workshop1',function(req,res,next){
  res.render('workshop1');
});
router.post('/workshop1Rec',function(req,res,next){
  console.log('holi');
});

router.post('/workshop1Send',function(req,res,next){
  console.log(req.body);
  let encrypted = require('../modules/rsaModule');
  let keyPrivate = encrypted.getPrivate();
  let keyPublic = encrypted.getPublic();

  let md4 = encrypted.getMd4(req.body.text);

  let message ={
    text:req.body.text,
    md4: md4,
    keyPr: keyPrivate,
    keyPu: keyPublic
  }
  console.log('Informacion a Zippear'+message);
  let zip = new AdmZip();
  message = zip.toBuffer();
  res.render('workshop',{
    keyPublic:keyPublic,
    keyPrivate:keyPrivate,
    md4:md4,
    message:message
  });
});

router.get('/inbox',function(req,res,next){
  res.render('inbox');
});
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next){
    res.render('register');
});

router.get('/login', function(req, res, next){
    res.render('login');
});

router.post('/register', function (req,res,next) {
   console.log(req.body);
   let encrypted = require('../modules/rsaModule');

   let newUser = new User({
      name: req.body.user.name,
      email: req.body.user.email,
      username: req.body.user.username,
      password: req.body.user.password,
      passc: encrypted.getEncrypted(req.body.user.password),
      privatekey: encrypted.getPrivate(),
      publickey: encrypted.getPublic(),
      md4: encrypted.getMd4(req.body.user.password)
    });

    User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
      res.send(user);
    });
});


router.post('/login',
    passport.authenticate('local',{failureRedirect: '/users/login', failureFlash: 'Invalid username or password'}),
    function(req, res){
        req.flash('success', 'You are now logged in');
        console.log(`Impriemiendo usuario recuperado de done: ${req.user.passde}`);
        let usuario = {
                user: req.user,
                passde: req.user.passde
            };
        res.send(usuario);
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done){
  User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'Unknown User'});
    }else{

        let cPassword = User.comparePassword(password,user.privatekey,user.passc);
        if(cPassword.check){
            user.passde = cPassword.passde.toString();
            return done(null,user);
        }
    }
  });
}));


router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/users/login');
});


module.exports = router;
