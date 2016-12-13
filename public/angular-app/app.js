angular.module("chat", [
    "ngRoute",
    "angular-jwt",
    "btford.socket-io"])
    .config(config).run(run);

function config($httpProvider, $routeProvider) {
    $httpProvider.interceptors.push("AuthInterceptor");

    $routeProvider
        .when("/", {
            templateUrl: "angular-app/login/login.html",
            controller: LoginController,
            controllerAs: "vm",
            access: {
                restricted: false
            }
        })

        .when("/chat", {
            templateUrl: "angular-app/chat-display/chat.html",
            controller: ChatController,
            controllerAs: "vm",
            access: {
                restricted: true
            }
        })

        .when("/register", {
            templateUrl: "angular-app/register/register.html",
            controller: RegisterController,
            controllerAs: "vm"

        }).otherwise({
            redirectTo: "/"
        });
}

function run($rootScope, $location, $window, AuthFactory) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
        if (nextRoute.access !== undefined && nextRoute.access.restricted
            && !window.sessionStorage.token && !AuthFactory.isLoggedIn) {
            event.preventDefault();
            $location.path("/");
        }
    })
}

