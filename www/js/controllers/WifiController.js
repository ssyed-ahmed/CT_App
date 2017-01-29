(function () {

  angular.module('CT_APP')
    .controller('WifiController', WifiController);

  WifiController.$inject = ['$scope', '$stateParams', '$state', '$q', '$ionicPopup', '$timeout'];
  function WifiController($scope, $stateParams, $state, $q, $ionicPopup, $timeout) {
    var wifiCtrl = this;
    wifiCtrl.networks = [];
    wifiCtrl.isScanning = false;
    wifiCtrl.scanComplete = false;
    wifiCtrl.data = {};
    wifiCtrl.pairedBTDevice = $stateParams.name;

    function arrayContains(arr, network) {
      if (arr.indexOf(network.SSID) !== -1) {
        return true;
      }
      return false;
    }

    function wifiListHandler(networks) {
      $timeout(function () {
        for (var i = 0; i < networks.length; i++) {
          var network = networks[i];
          if (!arrayContains(wifiCtrl.networks, network)) {
              wifiCtrl.networks.push(network.SSID);
          }
        }
        wifiCtrl.isScanning = false;
        wifiCtrl.scanComplete = true;
        $scope.$apply();
      }, 1500);
    };

    function failNetworkHandler() {
      alert('Error! Failed to fetch Wifi networks.');
    }

    wifiCtrl.scan = function() {
      wifiCtrl.isScanning = true;
      wifiCtrl.scanComplete = false;
      var deferred = $q.defer();
      try {
        WifiWizard.getScanResults(wifiListHandler, failNetworkHandler);
      } catch(err){
        wifiCtrl.isScanning = false;
        wifiCtrl.scanComplete = false;
        deferred.reject(err);
        alert(err.toString());
      }
      return deferred.promise;
    };

    wifiCtrl.onError = function (reason) {
      alert('Error: ' + reason);
    };

    function wifiConnSuccessfull() {
      var ssid = wifiCtrl.networkSSID;
      var username = wifiCtrl.networkSSID;
      var pwd = wifiCtrl.config.auth.password;
      var secType = wifiCtrl.config.auth.algorithm;
      $state.go('send', {
        ssid: ssid,
        username: username,
        pwd: pwd,
        secType: secType
      });
    };

    function wifiConnFailure() {
      alert('Connection failed');
    };

    wifiCtrl.connectWifi = function (networkSSID) {
      wifiCtrl.networkSSID = networkSSID;
      var myPopup = $ionicPopup.show({
        template: '<input type="password" ng-model="wifiCtrl.data.wifi">',
        title: 'Enter Wi-Fi Password',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!wifiCtrl.data.wifi) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                var wifiPwd = wifiCtrl.data.wifi;
                try {
                    var config = WifiWizard.formatWPAConfig(networkSSID, wifiPwd);
                    wifiCtrl.config = config;
                    WifiWizard.addNetwork(config, function() {
                        WifiWizard.connectNetwork(networkSSID, wifiConnSuccessfull, wifiConnFailure);
                    },
                    function () {
                      alert("Error! Failed connect to network: " + networkSSID);
                    });
                }
                catch(err) {
                    alert("Plugin Error - " + err.message);
                }
              }
            }
          }
        ]
      });
    }
  }
})();
