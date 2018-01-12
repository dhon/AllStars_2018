angular.module("app.controllers", [])
.controller("homeCtrl", function($scope, $location, services) {
    console.log("Home Controller is Working!");
    $scope.stats = services.getData();
    $scope.gStats = services.getGData();
    $(document).ready(function(){$("#statsTable").tablesorter();});
    $(document).ready(function(){$("#statsTable9").tablesorter();});
})
.controller("killsCtrl", function($scope, $stateParams, $location, services) {
    console.log("Kills Controller is Working!");
    $scope.id = $stateParams.id;
    $scope.stats = services.getData();
    $scope.kills = services.getKills($scope.id);
    $(document).ready(function(){$("#killsTable").tablesorter();});
});