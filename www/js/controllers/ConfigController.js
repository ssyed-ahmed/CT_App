(function () {
  angular.module('CT_APP')
    .controller('ConfigController', ConfigController);

  ConfigController.$inject = ['$stateParams', '$state', '$timeout', '$cordovaBluetoothSerial'];
  function ConfigController($stateParams, $state, $timeout, $cordovaBluetoothSerial) {

    var finalCtrl = this;
    finalCtrl.networkSSID = $stateParams.name;
    finalCtrl.string = "";

    function writeSuccess() {
      alert('BT write succeeded!');
      $state.go('final');
    };

    function writeFailure() {
      alert('BT write failed!');
    };

    finalCtrl.sendString = function () {
      var ssid = $stateParams.ssid;
      var username = $stateParams.username;
      var pwd = $stateParams.pwd;
      var secType = $stateParams.secType;

      var stringToSend = "[" + ssid + "|" + username + "|" + pwd + "|" + secType + "|" + "]";
      //Send this string via bluetooth
      try {
          //TODO: The success and failure callback functions don't seem to be implemented
          //in the cordova plugin. Hence, setting a timeout and calling state change after
          //sending a string via bluetooth.
          $cordovaBluetoothSerial.write(stringToSend, writeSuccess, writeFailure);
          $timeout(function () {
            $state.go('final');
          }, 1500);
      } catch(err) {
        alert("Bluetooth write failed. " + err.toString());
      }

    };

  }
})();
