angular.module("app.controllers", [])
.controller("homeCtrl", function($scope, $location, services) {
    console.log("Home Controller is Working!");
    $scope.stats = services.getData();
    $scope.gStats = services.getGData();
})
.controller("killsCtrl", function($scope, $stateParams, $location, services) {
    console.log("Kills Controller is Working!");
    $scope.id = $stateParams.id;
    $scope.kills = services.getKills($scope.id);
});