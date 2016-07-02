'use strict';
let hmd4 = require('js-md4');
let NodeRSA = require('node-rsa');

let key = new NodeRSA();
key.generateKeyPair(1024);
/*let keyPublicString= key.exportKey('public');
let keyPrivateString= key.exportKey('private');
let pass=key.encrypt(password,'base64');//encryptada con llave publica

let md4=hmd4(password);*/

module.exports.getPublic = function(){
    return key.exportKey('public');
}

module.exports.getPrivate = function(){
    return key.exportKey('private');
}

module.exports.getEncrypted = function(password){
    return key.encrypt(password, 'base64');
}

module.exports.getMd4 = function(password){
    return hmd4(password);
}
