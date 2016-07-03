'use strict';
let express = require('express');
let router = express.Router();
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let AdmZip = require('adm-zip');
let NodeRSA = require('node-rsa');
let zlib = require('zlib');



let User = require('../models/user');

/* GET users listing. */
let dataWorkshop ={};


router.get('/workshop2',function(req,res,next){
  console.log('getdel workshop2'+dataWorkshop.text);
  res.render('workshop2',{
    varexp:dataWorkshop
  });
});

router.post('/workshop2Rec',function(req,res,next){
  //console.log(req.body);
  //console.log('post del workshop2 node');
  dataWorkshop= req.body;
  res.send(dataWorkshop);

});

router.get('/workshop1',function(req,res,next){
  res.render('workshop1');
});
router.post('/workshop1Rec',function(req,res,next){
  console.log('holi');
});

router.post('/workshop1Send',function(req,res,next){
  //console.log('post del workshop1');
  //console.log(req.body);
  let encrypted = require('../modules/rsaModule');
  let keyPrivate = encrypted.getPrivate();
  let keyPublic = encrypted.getPublic();
  //console.log('post en node workshop1');
  let md4 = encrypted.getMd4(req.body.text);
  //console.log('MD4 EN workshop1'+md4);  

  let message ={
    text:req.body.text,
    md4: md4,
    //keyPr: keyPrivate,
    //keyPu: keyPublic
  }
  console.log('---------Informacion:')
  console.log(message.text);
  console.log(message.md4);
  console.log('Informacion a mandar'+message);

  //Encrypt module

  //Creating keys
  let kPub = new NodeRSA(keyPublic);
  let kPri = new NodeRSA(keyPrivate);

  //encrypting data and decrypt
  let zipEnc= kPub.encrypt(message);
  console.log('zip Encriptado : '+zipEnc);
  let zipDes=kPri.decrypt(zipEnc);
  console.log('desencriptado------:'+zipDes);
  console.log('exito en post workshop1');
  

  /*zlib.deflate(message);
  console.log('buffer zippeado:'+message);
  */
   // Compress it and convert to utf8 string, just for the heck of it
  /*zlib.deflate(input).toString('utf8');

  // Compress, then uncompress (get back what we started with)
  zlib.inflate(zlib.deflate(input));
  console.log('');
  console.log(input);*/

/* Again, and convert back to our initial string
  zlib.inflate(zlib.deflate(message)).toString('utf8');
  console.log('este deberia ser el buffer normal:'+message);
  let zip = new AdmZip();
  message = zip.toBuffer();
  console.log('Informacion zippeada:'+message);

  

let unziped;
let zip = new AdmZip(message);
let messageZiped;
zip.addFile(messageZiped, message.text);
zip.addFile(message.md4,messageZiped);
console.log('prueba del zip'+zip);
zip.extractAllTo(unziped,true);
console.log('mas cosas raras:'+unziped);
console.log('a continuacion se deberia imprimir informacion de angular');*/

console.log(req.body);



  console.log(message);
  res.render('register',{
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
