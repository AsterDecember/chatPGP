(function(){
    'use strict';

    angular.module('nodeRSA',['jcs-autoValidate'])
        .run([
            'defaultErrorMessageResolver',
            function (defaultErrorMessageResolver) {
                // passing a culture into getErrorMessages('fr-fr') will get the culture specific messages
                // otherwise the current default culture is returned.
                defaultErrorMessageResolver.getErrorMessages().then(function (errorMessages) {
                    errorMessages['nameRequired'] = 'The name field is required';
                    errorMessages['usernameRequired'] = 'The username field is required';
                    errorMessages['passwordRequired'] = 'The password field is required';
                });
            }
        ]);
    
})();