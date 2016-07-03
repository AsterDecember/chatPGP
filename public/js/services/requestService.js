(function(){
	'use strict';
	angular.module('nodeRSA')
		.factory('requestService',requestService);
	requestService.inject=['$http'];
	function requestService($http){
		return{
			'post':requestPost,
			'get': requestGet
		};

		function requestPost(url,data){
			return $http({method:'post',url:url,data:data});
		}
		function requestGet(url){
			return $http({method:'get',url:url});
		}
	}

})();