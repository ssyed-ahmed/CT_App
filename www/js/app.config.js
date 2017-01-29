(function () {
  angular.module('CT_APP')
    .config(function($stateProvider, $urlRouterProvider) {

      $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'templates/home.html'
      })
      .state('bt', {
        url: '/bt',
        templateUrl: 'templates/btscan.html'
      })
      .state('wifi', {
        //url: '/wifi/:name',
        url: '/send/:ssid/:username/:pwd/:secType',
        templateUrl: 'templates/wifiscan.html'
      })
      .state('send', {
        url: '/send/:ssid/:username/:pwd/:secType',
        templateUrl: 'templates/send.html'
      })
      .state('final', {
        url: '/final',
        templateUrl: 'templates/final.html'
      });

      $urlRouterProvider.otherwise('/home');
    });
})();
