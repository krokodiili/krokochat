angular.module("chat").controller("LoginController", LoginController);

function LoginController($http, $location, $window, AuthFactory) {
    var vm = this;
    vm.error = "";

    vm.login = function () {
        if (vm.username && vm.password) {
            var user = {
                username: vm.username,
                password: vm.password
            };

            console.log(user);

            $http.post('/api/users/login', user).then(function (response) {

                if (response.data.success) {
                    $window.sessionStorage.token = response.data.token;
                    console.log(vm.loggedInUser);
                    AuthFactory.isLoggedIn = true;
                    $location.path("/chat");
                }
            }).catch(function (error) {
                console.log(error);
                vm.error = "Invalid username/password!";
            })

        }
    };


}