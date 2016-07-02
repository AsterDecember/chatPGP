'use strict'
let mongoose = require('mongoose');
let NodeRSA = require('node-rsa');

mongoose.connect('mongodb://localhost/nodeauthRSA');

let db=mongoose.connection;

let UserSchema=mongoose.Schema({
    username:{
        type:String,
        index:true
    },
    password:{
        type: String
    },
    email:{
        type:String
    },
    name:{
        type:String
    },
    passc:{
        type:String
    },
    privatekey:{
        type:String
    },
    publickey:{
        type:String
    },
    md4:{
        type:String
    }
});

let User = module.exports=mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
    let query  = {username: username};
    User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword,stringPkey, encrypted){
    let keyPrivateString=stringPkey;
    let keypriv=new NodeRSA(keyPrivateString);

    let passde=keypriv.decrypt(encrypted);
    console.log('pass decrypt :'+passde);
    if (candidatePassword==passde) {
        console.log('888888888 77777');
        return {
            check:true,
            passde:passde
        };
    }else{
        return false;
    }
}

module.exports.createUser =function(newUser,callback){
    newUser.save(callback);
}

