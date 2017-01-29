(function () {

  angular.module('CT_APP')
    .controller('BTController', BTController);

  BTController.$inject = ['$scope', '$cordovaBluetoothSerial', '$state'];
  function BTController($scope, $cordovaBluetoothSerial, $state) {
    var btCtrl = this;
    btCtrl.devices = [];
    btCtrl.isScanning = false;
    btCtrl.scanComplete = false;

    btCtrl.scan = function() {
      try {
        $cordovaBluetoothSerial.isEnabled().then(
          function () {
            btCtrl.listDevices();
          },
          function () {
            alert('Bluetooth is not Enabled. Please enable it first.');
          }
        )
      } catch(err){
        alert(err.toString());
      }

    };

    btCtrl.listDevices = function() {
      btCtrl.isScanning = true;
      btCtrl.scanComplete = false;
      $cordovaBluetoothSerial.list().then(btCtrl.devicesListed,
      btCtrl.onError);
    };

    btCtrl.devicesListed = function(devices) {
      devices.forEach(function (device) {
        if (!arrayContains(btCtrl.devices, device)) {
          btCtrl.devices.push(device);
        }
      });
      //Also list undiscovered devices
      $cordovaBluetoothSerial.discoverUnpaired().then(btCtrl.undiscoveredDevicesListed,
      btCtrl.onError);
    };

    btCtrl.undiscoveredDevicesListed = function (devices) {
      for (var k = 0; k < devices.length; k++) {
        var device = devices[k];
        if (!arrayContains(btCtrl.devices, device)) {
            btCtrl.devices.push(device);
        }
      }
      btCtrl.isScanning = false;
      btCtrl.scanComplete = true;
    };

    function arrayContains(arr, device) {
      for (var i = 0; i < arr.length; i++) {
        var d = arr[i];
        if (d.id === device.id || d.address === device.address) {
          return true;
        }
      }
      return false;
    }

    btCtrl.onError = function(err) {
      alert('Error: ' + err);
    }

    btCtrl.connectDevice = function (device) {
      var macAddress = device.id;
      $cordovaBluetoothSerial.connect(macAddress).then(function (res) {
        $state.go('wifi', {name: device.name});
      },
      btCtrl.onError);
    }
  }
})();
