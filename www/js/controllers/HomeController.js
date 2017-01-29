(function () {
  angular.module('CT_APP')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$state', '$timeout'];
  function HomeController($state, $timeout) {

    var homeCtrl = this;

    homeCtrl.init = function () {
      $timeout(function () {
        //Navigate to bluetooth scan page after 3 seconds
        $state.go('bt');
      }, 3000);
    };

    homeCtrl.next = function () {
      $state.go('bt');
    };

  }
})();
