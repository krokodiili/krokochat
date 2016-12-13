angular.module("chat").factory("ChatSocket", ["socketFactory", function(socketFactory) {
    return socketFactory();
}]);