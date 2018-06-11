/**
 * Angular JavaScript that controls the user interface interactions .
 * @module App module
 * @author Santiago Flores Kanter <sfloresk@cisco.com>
 * @copyright Copyright (c) 2018 Cisco and/or its affiliates.
 * @license Cisco Sample Code License, Version 1.0
 */

/**
 * @license
 * Copyright (c) 2018 Cisco and/or its affiliates.
 *
 * This software is licensed to you under the terms of the Cisco Sample
 * Code License, Version 1.0 (the "License"). You may obtain a copy of the
 * License at
 *
 *                https://developer.cisco.com/docs/licenses
 *
 * All use of the material herein must be in accordance with the terms of
 * the License. All rights not expressly granted by the License are
 * reserved. Unless required by applicable law or agreed to separately in
 * writing, software distributed under the License is distributed on an "AS
 * IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied.
 */
var appModule = angular.module('appModule',['ngRoute','ngAnimate'])

/*  Configuration    */

// Application routing
appModule.config(function($routeProvider, $locationProvider){
    // Maps the URLs to the templates located in the server
    $routeProvider
        .when('/', {templateUrl: 'ng/home'})
        .when('/home', {templateUrl: 'ng/home'})

    $locationProvider.html5Mode(true);
});

// To avoid conflicts with other template tools such as Jinja2, all between {a a} will be managed by Angular instead of {{ }}
appModule.config(['$interpolateProvider', function($interpolateProvider) {
  $interpolateProvider.startSymbol('{a');
  $interpolateProvider.endSymbol('a}');
}]);


/*  Controllers    */

// App controller is in charge of managing all services for the application
appModule.controller('AppController', function($scope, $location, $http, $window, $rootScope){

    // Variables initialization
    $scope.error = "";
    $scope.success = "";
    $scope.loading = false;
    $scope.pods = [];
    $scope.deployment={selectedPod: ""};
    $scope.deployment.portType = "access";
    $scope.deployment.epgAction = "existing";


    // Functions
    $scope.go = function ( path ) {
        $location.path( path );
    };

    $scope.clearError = function(){
        $scope.error = "";
    };

    $scope.clearSuccess = function(){
        $scope.success = "";
    };

    $scope.setPortType = function(portType){
        $scope.deployment.portType = portType;
    };


    $scope.setEpgAction = function(epgAction){
        $scope.deployment.epgAction = epgAction;
    };

    // STEP 8 CODE BELOW
 $scope.getPods = function(){

        $scope.loading = true;
        // Does a GET call to api/pod to get the pod list
        $http
            .get('api/pod')
            .then(function (response, status, headers, config){
                // Save the data into the $scope.pods variable
                $scope.pods = response.data
            })
            .catch(function(response, status, headers, config){
                $scope.error = response.data.message
            })
            .finally(function(){
                $scope.loading = false;
            })
    };

    $scope.getPods();

    // STEP 9 CODE BELOW
$scope.getSwitches = function(pod){
        if(pod.fabricPod){
            // Does a GET call to api/switch to get the switches list
            $scope.loading = true;
            $http
                .get('api/switch/' + pod.fabricPod.attributes.dn)
                .then(function (response, status, headers, config){
                    $scope.switches = response.data
                })
                .catch(function(response, status, headers, config){
                    $scope.error = response.data.message
                })
                .finally(function(){
                    $scope.loading = false;
                })
        }
    };
    // STEP 10 CODE BELOW
    $scope.getInterfaces = function(selected_switch){
        if(selected_switch.fabricNode){
            // Does a GET call to api/interface to get the interfaces list
            $scope.loading = true;
            $http
                .get('api/interface/' + selected_switch.fabricNode.attributes.dn )
                .then(function (response, status, headers, config){
                    $scope.interfaces = response.data
                })
                .catch(function(response, status, headers, config){
                    $scope.error = response.data.message
                })
                .finally(function(){
                    $scope.loading = false;
                })
        }
    };
    // STEP 11 CODE BELOW
    $scope.getEpgs = function(){
        // Does a GET call to api/epgs to get the EPG/VLANs list
        $http
            .get('api/epgs')
            .then(function (response, status, headers, config){
                $scope.epgs = response.data
            })
            .catch(function(response, status, headers, config){
                $scope.error = response.data.message
            })
    };

    $scope.getEpgs();
    // STEP 12 CODE BELOW
  $scope.deploy = function(){
        $scope.loading = true;

        // Does a POST call to api/deploy to send the deployment information to the server for processing.
        $http
            .post('api/deploy', {'deployment': $scope.deployment })
            .then(function (response, status, headers, config){
                $scope.success = "Deployment done!"
            })
            .catch(function(response, status, headers, config){
                $scope.error = response.data.message
            })
            .finally(function(){
                $scope.loading = false;
                // After the deployment is done, refresh the EPGs/VLANs items
                $scope.getEpgs();
            })
    };

});
