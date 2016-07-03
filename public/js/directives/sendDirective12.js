(function(){
	'use strict'
	angular.module('nodeRSA')
		.directive('sendDirective12',sendDirective12);

	function sendDirective12(){
		let directiva ={
			restrict: 'EA',
			controller: sendController,
			controllerAs: 'send'
		};
		return directiva;
	}

	sendController.inject =['$http'];
	function sendController($http,requestService){
		let send=this;
		send.data = {};
		let encryption = require('../../../modules/rsaModule');

		send.send = function(){

			send.data.md4= encryption.getMd4(send.data.text);
			console.log('send directive...');
			requestService.post('/users/workshop1Send',send.data).then(success,err);
			requestService.post('/users/workshop2Rec',send.data).then(success,err);

			function success(response){

				console.log(response);
			}

			function err(error){
				console.log(error);
			}

		};

	};
	
})();