(function(){
    'use strict';
    angular.module('nodeRSA')
        .directive('loginDirective', loginDirective);

    function loginDirective(){
        let directiva = {
            restrict: 'EA',
            controller: loginController,
            controllerAs: 'login'
        };

        return directiva;
    }

    loginController.inject = ['$http'];
    function loginController($http){
        let login = this;


        login.onSubmit = function(){

            $http({
                method: 'POST',
                url: '/users/login',
                data: {
                    username: login.username,
                    password: login.password
                }

            }).then(successLog, failedLog);

            function successLog(response){
                console.log(response);
                login.passc = response.data.user.passc;
                login.privatekey = response.data.user.privatekey;
                login.passde = response.data.passde;
            }

            function failedLog(error){
                console.log(error);
            }
        };

    }

})();