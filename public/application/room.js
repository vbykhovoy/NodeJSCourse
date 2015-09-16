'use strict'

var app = angular.module("room", []);

app.controller('roomController', ['$scope', 'roomService', function($scope, roomService){
    $scope.roomId = document.getElementById('roomId').value; // using 'document.getElementById' because angular cannot read the value from hidden fields
    $scope.userId = document.getElementById('userId').value;
    $scope.messages = [];

    roomService.getRooms($scope.roomId).success(function(messages) {
        $scope.messages = messages;
    });

    var socket = io();

    socket.on('message', function(data){
        updateImages(data);
    });

    socket.on('image', function(data){
        updateImages(data);
    });

    $scope.sendMessage = function() {
        var data = {roomId: $scope.roomId, userId: $scope.userId, message: $scope.messageText, image: null};
        socket.emit('message', data);
        $scope.messageText = '';
    };

    $scope.uploadFile = function (event) {
        var data = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function(evt) {
            var params = {roomId: $scope.roomId, userId: $scope.userId, message: null, image: evt.target.result};
            socket.emit('image', params);
        };
        reader.readAsDataURL(data);
    };

    function updateImages(data){
        if (data.room._id == $scope.roomId) {
            $scope.messages.push(data);
            $scope.$apply();
        }
    }
}]);

app.service('roomService', ['$http', function ($http) {
    this.getRooms = function (roomId) {
        return $http({
            method: "GET",
            url: "/api/messages/" + roomId,
            headers: { 'Content-Type': 'application/json' }
        });
    };
}]);

app.directive('onEnter',function(){
    var linkFn = function(scope,element,attrs) {
        element.bind("keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.onEnter);
                });
                event.preventDefault();
            }
        });
    };

    return {
        link:linkFn
    };
});

app.directive('schrollBottom', function () {
    return {
        scope: {
            schrollBottom: "="
        },
        link: function (scope, element) {
            scope.$watchCollection('schrollBottom', function (newValue) {
                if (newValue)
                {
                    $(element).scrollTop($(element)[0].scrollHeight);
                }
            });
        }
    }
})

app.directive('fileOnChange', function() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeHandler = scope.$eval(attrs.fileOnChange);
            element.bind('change', onChangeHandler);
        }
    };
});
