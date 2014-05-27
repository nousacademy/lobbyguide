'use strict';

//Directory121
// Declare app level module which depends on filters, and services
var kioskApp = angular.module('kioskApp', [
    //'ngRoute',
    'ngIdle',
    'google-maps',
    'ngAutocomplete',
    'ngAnimate'
]);

kioskApp.controller('SwitchEm', function($scope, $http, $idle, $timeout) {
    //for ngidle
    $scope.events = [];
    $scope.$on('$idleStart', function() {
        //alert("you are now idle");
        // the user appears to have gone idle                   
    });
    $scope.$on('$idleTimeout', function() {
        // the user has timed out (meaning idleDuration + warningDuration has passed without any activity)
        // this is where you'd log them
        console.log("timed out");
        $scope.userEmail = "";
        $scope.currentURL =  window.location.reload(true);;
    });
    $scope.$on('$idleEnd', function() {
        // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog 
        console.log("no longer idle");
        //if('$idleEnd'){
        //    $route.reload();
        //}
    });
    $scope.$on('$idleWarn', function(e, countdown) {
        console.log(countdown);
        // follows after the $idleStart event, but includes a countdown until the user is considered timed out
        // the countdown arg is the number of seconds remaining until then.
        // you can change the title or display a warning dialog from here.
        // you can let them resume their session by calling $idle.watch()
        
    });
    //end ngidle

    $scope.markerVisible = true;
    $scope.currentURL = "touchDirectory";
    $scope.divHideLeft = true;
    $scope.divHideRight = true;
    $scope.groupedDataComp = {};
    $scope.groupedDataIndiv = {};
    $http.get('js/data.json').success(function(data) {
        $scope.individuals = data.individuals;
        $scope.companies = data.companies;
        console.log($scope.individuals);
    });
    $scope.urls = {"touchDirectory": "partials/touchdirectory.html",
        "buildingDirectory": "partials/buildingdirectory.html",
        "neighborhoodGuide": "partials/neighborhoodguide.html"};
    $scope.changeView = function(name) {
        if (name == 'buildingDirectory') {
            $scope.divHideRight = false;
        } else {
            $scope.divHideLeft = false;
        }
        $timeout(function() {
            $scope.currentURL = name;
        }, 1200);
        //use $timeout to delay the currenturl change
    };
    $scope.chars = [{ch: "ALL"}, {ch: "A"}, {ch: "B"}, {ch: "C"}, {ch: "D"}, {ch: "E"},
        {ch: "F"}, {ch: "G"}, {ch: "H"}, {ch: "I"}, {ch: "J"},
        {ch: "K"}, {ch: "L"}, {ch: "M"}, {ch: "N"}, {ch: "O"},
        {ch: "P"}, {ch: "Q"}, {ch: "R"}, {ch: "S"}, {ch: "T"},
        {ch: "U"}, {ch: "V"}, {ch: "W"}, {ch: "X"}, {ch: "Y"},
        {ch: "Z"}];
    $scope.searching = {searchIt: ""}; //""; //for searching through list and ngmodel
    $scope.ordering = 'cname'; //for ordering through list
    $scope.letter = "";  //used for right letter buttons
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
    //not used
    //$scope.filterLetter = "\w*"; //"a-z";
    $scope.setFilterLetter = function(character) {
        if ($scope.byCompName) {
            $scope.letter = {cName: character};
        }
        else {
            $scope.letter = {ind: character};
        }
    };

    //tweak to fix and then actually use
    $scope.filterByLetter = function(query) {
        if ($scope.byCompName) {
            return function(comp) {
                if (query == '') {
                    return true;
                }
                else {
                    //console.log(comp["cname"].charAt(0));
                    //return comp["cname"].charAt(0).toLowerCase() == query.toLowerCase();
                    return comp["cname"].charAt(0) == query;
                }
            };
        }
        else {
            return function(indiv) {
                //return /[^($scope.letter.ind)]/i.test(indiv.name);
                if (query == '') {
                    return true;
                }
                else {
                    return indiv["name"].charAt(0) == query;
                }
            };
        }
    };

}).config(function($idleProvider, $keepaliveProvider) {
    // configure $idle settings
    $idleProvider.idleDuration(120); // in seconds
    $idleProvider.warningDuration(5); // in seconds
    $keepaliveProvider.interval(2); // in seconds
})
        .run(function($idle) {
            // start watching when the app runs. also starts the $keepalive service by default.
            $idle.watch();
        })




        .controller('MapCtrl', function($scope, $window, $log) {
            $scope.iconImages = ["Map Icons-01.svg"];
            $scope.showMe = false;
            $scope.emailModal = false;
            $scope.mailSent = false;
            $scope.collection = {
                travelNum: 0
            };
            $scope.modesOfTravel = [google.maps.TravelMode.WALKING,
                google.maps.TravelMode.DRIVING,
                google.maps.TravelMode.BICYCLING,
                google.maps.TravelMode.TRANSIT
            ];

            $scope.travelMode = $scope.modesOfTravel[$scope.collection.travelNum];
            $scope.map = {
                control: {},
                options: {styles: [{"featureType":
                                    "administrative",
                            "elementType": "labels.text.fill", "stylers": [
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
                    ],
                    scaleControl: false,
                    mapTypeControl: false,
                    streetViewControl: false,
                    overviewMapControl: false,
                    zoomControl: false,
                    panControl: false
                },
                events: {
                    tilesloaded: function(map) {
                        $scope.$apply(function() {
                            console.log("mapinstance loaded via tilesloaded");
                            $scope.mapInstance = map;
                            $log.info('this is the map instance', map);
                        });
                    }
                },
                center: {
                    latitude: 40.6743890,
                    longitude: -73.9455
                },
                zoom: 12
            };
            $scope.homemarker = {latitude: 40.7200735, longitude: -74.0079469};
            $scope.directionsMarker = {latitude: 40.7200735, longitude: -74.0079469};
            $scope.startPlace = new google.maps.LatLng($scope.homemarker.latitude, $scope.homemarker.longitude);
            //orginal below from Alex
            /*
             $scope.$watch('details', function() {
             console.log('it updateds');
             var lat = $scope.details.geometry.location.lat();
             var lng = $scope.details.geometry.location.lng();
             
             $scope.homemarker = {latitude: lat, longitude: lng};
             $scope.map.center = {latitude: lat, longitude: lng};
             });
             */
            var directionsDisplay;
            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer();



            //var homeControlDiv = document.createElement('div');
            //var homeControl = new HomeControl(homeControlDiv, $scope.gmap);
//  homeControlDiv.index = 1;
            //$scope.gmap.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);

            $scope.resetMe = function() {
                //$scope.gmap.setCenter($scope.startPlace);
                directionsDisplay.setMap(null);
                $scope.showMe = false;
                $scope.emailModal = false;
                console.log($scope.showMe);
                $scope.autocomplete = ""
                $scope.userEmail = "";
            };
            $scope.emailIt = function() {
                console.log("mailsent is " + $scope.mailSent);
                $scope.mailSent = false;
                $scope.emailModal = !$scope.emailModal;
                var query = $scope.homemarker.latitude + ',' + $scope.homemarker.longitude + '+to+' +
                        $scope.destinationMarker.latitude + ',' + $scope.destinationMarker.longitude;
                $scope.qrcode = 'https://maps.google.com/maps?q=' + encodeURIComponent(query);
                $scope.maplink = 'https://maps.google.com/maps?q=' + query;
                $scope.userEmail = "";
                // $scope.darkenScreen = ""; trying to darken screen after click and focus on qr code
            };
            $scope.finishMail = function() {
                $scope.emailModal = false;
            };
            $scope.HomeControl = function() {
                console.log("recentering");
                console.log($scope.gmap);
                $scope.map.control.getGMap().setCenter($scope.startPlace);
                //$scope.gmap.setCenter($scope.startPlace);
                //directionsDisplay.setMap(null);
                //$scope.showMe=false;
                console.log($scope.showMe);
            }
            function calcRoute(latN, lngN, gmap) {
                $scope.travelMode = $scope.modesOfTravel[$scope.collection.travelNum];
                console.log($scope.travelMode);
                console.log("calculate route called");
                console.log($scope.gmap);
                var endR = new google.maps.LatLng(latN, lngN);
                var startR = new google.maps.LatLng($scope.homemarker.latitude, $scope.homemarker.longitude);
                console.log(endR);
                console.log(startR);
                var request = {
                    origin: $scope.startPlace, // startR,
                    destination: endR,
                    travelMode: $scope.travelMode
                };
                directionsService.route(request, function(response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        console.log("directions ok");
                        console.log(response);
                        directionsDisplay.setDirections(response);
                        directionsDisplay.setMap(gmap);
                        directionsDisplay.setPanel(document.getElementById('directions-panel'));
                        $scope.showMe = true;
                    }
                });
            }

            //$scope.$watch('details', function() {
            $scope.$watchCollection('collection', function() {
                //console.log($scope.details);
                if ($scope.collection.details) {
                    if (!$scope.map.control.gmap) {
                        $scope.gmap = $scope.map.control.getGMap();
                    }
                    //var gmap=$scope.map.control.getGMap();
                    var lat = $scope.collection.details.geometry.location.lat();
                    var lng = $scope.collection.details.geometry.location.lng();
                    $scope.destinationMarker = {latitude: lat, longitude: lng};
                    calcRoute(lat, lng, $scope.gmap);//gmap);
                }
            });

            $window.navigator.geolocation.getCurrentPosition(function(pos) {
                console.log("window geolocation called");
                var lat = pos.coords.latitude;
                var lng = pos.coords.longitude;
                console.log(pos);
                $scope.$apply(function() {
                    console.log("scope.apply called in windows geolocation");

                    $scope.homemarker = {latitude: lat, longitude: lng};
                    $scope.map.center = {latitude: lat, longitude: lng};
                });
                console.log($scope.homemarker);
            });
            //modal logic for mandrill 
            var m = new mandrill.Mandrill('C7LDjR0CdMlYzu12b4zGEg');
            $scope.params = {
                "message": {
                    "from_email": "Sales@metroclick.com",
                    "to": [{"email": $scope.userEmail}],
                    "subject": "Mobile Directions",
                    "text": "Here are your directions."
                }
            };
            $scope.sendTheMail = function() {
// Send the email!
                $scope.params.message.to = [{"email": $('#usermail').val()}];
                $scope.params.message.text = "Thank you for registering with us the link to the map for your mobile phone is " + $scope.maplink;
                $scope.params.message.autotext = true;


                m.messages.send($scope.params, function(res) {
                    console.log(res);
                    $scope.mailSent = true;
                    console.log("mailsent is " + $scope.mailSent);
                }, function(err) {
                    console.log(err);
                    console.log("mailsent is " + $scope.mailSent);
                    $scope.mailSent = true;
                });
            };
        });



