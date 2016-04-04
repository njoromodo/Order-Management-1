var myApp = angular.module("myApp", ["ngRoute", "customerService", "ngResource"]);

angular.module("customerService", [])
    .factory("userService", function($resource) {
        return $resource("/api/users/:id", null, {
            "update": {method: "PUT"},
            "save": {method: "POST"},
            "delete": {method: "DELETE"}
        });
    });

myApp.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "user-list.html",
            controller: "mainController"
        })
        
        .when("/create", {
            templateUrl: "create.html",
            controller: "createController"
        })
        
        .otherwise({redirectTo: "/"});
});

myApp.controller("mainController", ["$scope", "$http", "userService", function($scope, $http, userService) { 
    $scope.user = {};
    $scope.currentPage = 0;
    $scope.itemsEachPage = 4;    
    
    $scope.deleteUser = function(id) {
        $scope.user[id] = angular.copy(id);
        console.log($scope.user[id]);
        userService.delete({id:id});
    };
    
    $scope.editUser = function(id) {
        $scope.user = userService.users[id-1];
        userService.num = id;
        console.log(id-1);
        console.log(userService.users[id-1]);
        console.log($scope.user);
    };
    
    $scope.createUser = function() {
        newId = userService.users.length + 1;
        $scope.editUser(newId);
        console.log(newId);
    }
       
    $http({
        method: "Get",
        url: "api/users"
    }). then(function successCallback(response) {
        $scope.users = response.data;
        userService.users = response.data;
        console.log(userService.users);
    }, function errorCallback(response) {
        console.log("There is an error");
    });    
    
     $scope.numberOfPage = function() {
        return Math.ceil(userService.users.length/$scope.itemsEachPage);
    }
    
     $scope.orderBy = function(user) {
        $scope.orderByUsers = user;
    }  
}]);

myApp.controller("createController", ["$scope", "$http", "userService", function($scope, $http, userService) {
  $scope.fName = '';
  $scope.lName = '';
  $scope.passw1 = '';
  $scope.passw2 = '';
  $scope.incomplete = false; 
    
  $scope.$watch('passw1',function() {$scope.test();});
  $scope.$watch('passw2',function() {$scope.test();});
  $scope.$watch('fName', function() {$scope.test();});
  $scope.$watch('lName', function() {$scope.test();});

  $scope.test = function() {
    if ($scope.passw1 !== $scope.passw2) {
      $scope.error = true;
      } else {
      $scope.error = false;
    }
    
  $scope.incomplete = false;
    if ($scope.editUser && (!$scope.fName.length ||
    !$scope.lName.length ||
    !$scope.passw1.length || !$scope.passw2.length)) {
       $scope.incomplete = true;
    }
  };
    
    $scope.copyAttrs = function(from, to) {
        var attrs = ['id', 'fName', 'lName', 'title', 'sex', 'age']
        attrs.forEach(function(cur) {
        to[cur] = from[cur];
        });
    };
    
        if (userService.users[userService.num]) {
            $scope.copyAttrs (userService.users[userService.num-1], $scope);
        } else {
            $scope.fName = "";
            $scope.lName = "";
            $scope.title = "";
            $scope.sex = "";
            $scope.age = "";     
     };
    
    $scope.submit = function() {
        $scope.user = {
            "id": userService.num,
            "fName": $scope.fName,
            "lName": $scope.lName,
            "title": $scope.title,
            "sex": $scope.sex,
            "age": $scope.age
        }
        
        console.log($scope.user);
        console.log(userService.num);
        console.log(userService.users.length);
        if (userService.num >= userService.users.length) {
            console.log($scope.user);
            console.log(userService.num);
            userService.save($scope.user);
        } else {
            userService.update({id:userService.num}, $scope.user);
       }   
   }; 
   
}]);

angular.module('myApp').filter("pagination", function() {
    return function (allUsers, start) {
    return allUsers.slice(start);
  }
});