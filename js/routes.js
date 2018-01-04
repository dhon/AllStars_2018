angular.module('app.routes', ['ui.router', 'app.controllers', 'app.services'])
.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

        .state('home', {
            url: '/',
            templateUrl: 'home.html',
            controller: 'homeCtrl'
        })

        .state('kills', {
            url: '/kills/:id',
            templateUrl: 'kills.html',
            controller: 'killsCtrl'
        })

    $urlRouterProvider.otherwise('/')

});