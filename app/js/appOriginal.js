'use strict';

//Directory121
// Declare app level module which depends on filters, and services
var kioskApp = angular.module('kioskApp', [
    //'ngRoute',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'kioskApp.controllers',
    'google-maps',
    'ngAutocomplete'
]).controller('MapCtrl', function($scope, $window) {
            $scope.map = {
                options: {styles: [{"featureType":
                                    "administrative", "elementType": "labels.text.fill", "stylers": [
                                        {"weight": 0.2}, {"color": "#1d352b"}]}, {"featureType":
                                    "landscape", "elementType": "geometry", "stylers": [{"color":
                                                    "#dfddde"}]}, {"featureType": "landscape", "elementType":
                                    "labels.text", "stylers": [{"weight": 0.2}, {"color":
                                                    "#17191b"}]}, {"featureType": "landscape", "elementType":
                                    "labels", "stylers": [{"weight": 0.1}, {"color": "#535258"}]
                        }, {"featureType": "poi", "elementType": "geometry.fill",
                            "stylers": [{"color": "#90a98d"}, {"weight": 0.1}]}, {
                            "featureType": "poi", "elementType": "labels.text.fill",
                            "stylers": [{"weight": 0.1}, {"color": "#5a6060"}]}, {
                            "featureType": "road.highway", "elementType": "geometry",
                            "stylers": [{"color": "#83dea9"}]}, {"featureType":
                                    "road.arterial", "elementType": "geometry.fill", "stylers": [{
                                            "color": "#d3ffba"}]}, {"featureType": "road.local",
                            "elementType": "geometry.fill", "stylers": [{"color": "#d3ffc5"
                                }]}, {"featureType": "transit.line", "elementType":
                                    "geometry.fill", "stylers": [{"color": "#80b580"}]}, {
                            "featureType": "transit.station", "elementType":
                                    "labels.text.fill", "stylers": [{"weight": 0.2}, {"color":
                                                    "#ffffff"}]}, {"featureType": "water", "elementType":
                                    "geometry.fill", "stylers": [{"color": "#2e606a"}]}, {}, {}, {
                            "featureType": "water", "elementType": "labels.text.fill",
                            "stylers": [{"color": "#aed7e4"}]}, {"featureType": "water",
                            "elementType": "labels.text", "stylers": [{"color": "#ffffff"},
                                {"weight": 0.1}]}, {}
                    ]},
                events: {
                    tilesloaded: function(map) {
                        $scope.$apply(function() {
                            $scope.mapInstance = map;
                        });
                    }
                },
                center: {
                    latitude: 45,
                    longitude: -73
                },
                zoom: 8
            };
            $scope.homemarker = {latitude: 40.6743890, longitude: -73.9455};

            $scope.$watch('details', function() {

                console.log('it updateds');
                console.log($scope.details);
                var lat = $scope.details.geometry.location.lat();
                var lng = $scope.details.geometry.location.lng();


                $scope.homemarker = {latitude: lat, longitude: lng};
                $scope.map.center = {latitude: lat, longitude: lng};




            });

            $window.navigator.geolocation.getCurrentPosition(function(pos) {

                console.log(pos);
                var lat = pos.coords.latitude;
                var lng = pos.coords.longitude;

                console.log(pos);

                $scope.$apply(function() {
                    $scope.homemarker = {latitude: lat, longitude: lng};
                    $scope.map.center = {latitude: lat, longitude: lng};




                });
            });
        });



kioskApp.controller('SwitchEm', function($scope, $http) {
    $scope.currentURL = "touchDirectory";
    $scope.groupedDataComp = {};
    $scope.groupedDataIndiv = {};
    $http.get('js/data.json').success(function(data) {
        $scope.individuals = data.individuals;
        $scope.companies = data.companies;
    });
    //$scope.currentURL= "buildingDirectory";
    $scope.urls = {"touchDirectory": "partials/touchdirectory.html",
        "buildingDirectory": "partials/buildingdirectory.html",
        "neighborhoodGuide": "partials/neighborhoodguide.html"};
    $scope.changeView = function(name) {
        $scope.currentURL = name;
    };
    $scope.chars = [{ch: "ALL"}, {ch: "A"}, {ch: "B"}, {ch: "C"}, {ch: "D"}, {ch: "E"},
        {ch: "F"}, {ch: "G"}, {ch: "H"}, {ch: "I"}, {ch: "J"},
        {ch: "K"}, {ch: "L"}, {ch: "M"}, {ch: "N"}, {ch: "O"},
        {ch: "P"}, {ch: "Q"}, {ch: "R"}, {ch: "S"}, {ch: "T"},
        {ch: "U"}, {ch: "V"}, {ch: "W"}, {ch: "X"}, {ch: "Y"},
        {ch: "Z"}];
    $scope.searching = {searchIt: ""}; //""; //for searching through list and ngmodel
    $scope.ordering = 'cname'; //for ordering through list
    $scope.letter = "";
    $scope.byCompName = true;////for styling green button around indi or company
    $scope.sortSet = function() { //toggle to compname or ind list
        $scope.byCompName = !$scope.byCompName;
        $scope.ordering = $scope.byCompName ? 'cname' : 'name';
    };
    $scope.setsearchChar = function(char) {
        if (char.ch == "ALL") {
            $scope.searching.searchIt = "";
            $scope.letter = "";
        }
        else {
            $scope.searching.searchIt = char.ch;
            $scope.letter = char.ch;
            console.log($scope.ordering);
        }
    };


    $scope.filterLetter = "\w*"; //"a-z";
    $scope.setFilterLetter = function(character) {
        //use tis forfiltering by first letter
        //for now just link to search field
        //$scope.filterLetter=letter;
        //console.log($scope.filterLetter);

        //$scope.letter=character;

        if ($scope.byCompName) {
            $scope.letter = {cName: character};
        }
        else {
            $scope.letter = {ind: character};
        }

        //below filters by letter for everything
        //$scope.ordering=letter;
    };


    $scope.filterByLetter = function(query) {
        if ($scope.byCompName) {
            return function(comp) {
                console.log(comp["cname"].charAt(0));
                return comp["cname"].charAt(0) == query;
            };
        }
        else {
            return function(indiv) {
                return /[^($scope.letter)]/i.test(indiv.name);
            };
            //return Name.ind.match(/($scope.filterLetter)/i); //filter by cName here
        }
    };



});

/*
 kioskApp.filter("byFirstLetter", function(){
 return function(input, expected) {
 console.log(input.charAt(0));
 return input.charAt(0)==expected;
 
 };
 });
 */



//http://gmap-tutorial-101.appspot.com/mapsapi101/3

/*
 var mapOptions = {
 center: new google.maps.LatLng(37.7831,-122.4039),
 zoom: 12,
 mapTypeId: google.maps.MapTypeId.ROADMAP
 };
 
 var map = new google.maps.Map(document.getElementById('map'), mapOptions);
 var acOptions = {
 types: ['establishment']
 };
 var autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'),acOptions);
 autocomplete.bindTo('bounds',map);
 var infoWindow = new google.maps.InfoWindow();
 var marker = new google.maps.Marker({
 map: map
 });
 
 google.maps.event.addListener(autocomplete, 'place_changed', function() {
 infoWindow.close();
 var place = autocomplete.getPlace();
 if (place.geometry.viewport) {
 map.fitBounds(place.geometry.viewport);
 } else {
 map.setCenter(place.geometry.location);
 map.setZoom(17);
 }
 marker.setPosition(place.geometry.location);
 infoWindow.setContent('<div><strong>' + place.name + '</strong><br>');
 infoWindow.open(map, marker);
 google.maps.event.addListener(marker,'click',function(e){
 
 infoWindow.open(map, marker);
 
 });
 });
 */