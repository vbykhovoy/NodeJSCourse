'use strict'

var app = angular.module("lobby", []);

app.controller('lobbyController', ['$scope', 'lobbyService', function($scope, lobbyService){
    var socket = io();
    initList();

    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.pages=function(){
        if (!$scope.rooms || $scope.rooms.length == 0) return 1;
        return Math.ceil($scope.rooms.length/$scope.pageSize);
    };

    $scope.createRoom = function(roomName){
        lobbyService.createRoom(roomName).success(function (){
            $scope.roomName = '';
            socket.emit('update-rooms');
        });
    };

    socket.on('update-rooms', function(data){
        initList();
    });

    function initList(){
        lobbyService.getRooms().success(function(data){
            $scope.rooms = data;
        });
    }

}]);

app.service('lobbyService', ['$http', function ($http) {
    this.getRooms = function () {
        return $http({
            method: "GET",
            url: "/api/rooms",
            headers: { 'Content-Type': 'application/json' }
        });
    };

    this.createRoom = function(data){
        return $http({
            method: "POST",
            url: "/api/rooms",
            headers: { 'Content-Type': 'application/json' },
            data: {name: data}
        });
    }
}]);

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start;
        if (!input) return;

        return input.slice(start);
    }
});
