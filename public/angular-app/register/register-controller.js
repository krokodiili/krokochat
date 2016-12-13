angular.module("chat").controller("RegisterController", RegisterController);

function RegisterController($location, $http) {
    var vm = this;
    vm.isSubmitted = false;

    vm.addUser = function () {
        var postData = {
            username: vm.username,
            password: vm.password,
            email: vm.email,
        };

        if (!vm.username || !vm.password) {
            vm.isSubmitted = true;
        } else if (!vm.email) {
            vm.isSubmitted = true;
            vm.error = "Please enter a valid email address!";
        } else if (vm.password !== vm.passwordRe) {
            vm.isSubmitted = true;
            vm.error = "Passwords do not match";
        } else if (vm.registerForm.$valid) {
            console.log(postData);
            $http.post("/api/users/register", postData).then(function successCallback() {
                $location.path("/");
            }, function errorCallback(response) {
                console.log(response);
                vm.isSubmitted = true;
                vm.error = response.data;
            });
        } else {
            vm.isSubmitted = true;
            vm.error = "Something went wrong, please try again!";
        }
    }
}