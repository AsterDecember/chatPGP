(function(){
    'use strict';
    angular.module('nodeRSA')
        .directive('registerDirective', registerDirective);

    function registerDirective(){
        let directiva = {
            restrict: 'EA',
            controller: registerController,
            controllerAs: 'register'
        };

        return directiva;
    }

    registerController.inject = ['$http'];
    function registerController($http){
        let register = this;

        register.user = {};

        register.submit = function(){
            $http({
                method: 'POST',
                url: '/users/register',
                data: {
                    user: register.user

                }
            }).then(successRegist, failedRegist);

            function successRegist(response){
                register.user = response.data;
                console.log(response);
            }

            function failedRegist(error) {
                console.log(error);
            }
        };



    }

})();