var app = angular.module('angularYelp', []);

app.service("test", function(){
  this.test = "TEST";
})

app.controller('SearchController', function($scope, $http, test){
  $scope.searchParams = {};
  $scope.test = test.test;
  $scope.businesses = [];

  $scope.search = function(){
    debugger;
    $http({
      url: window.location.href + '/search',
      method: "POST",
      data: {
        location: $scope.searchParams.location,
        topic: $scope.searchParams.topic
      }
    })
    .then(function(response) {
      $scope.businesses = response.data;
      $scope.resetBusinesses();
      // console.log(response.data);
      $scope.searchParams = {};
    },
    function(response) { // optional
      alert("Something's gone wrong");
    });
  };

  $scope.resetBusinesses = function(){
   $scope.$broadcast("newSearch", {businesses: $scope.businesses });
  };

});

app.controller('MapController', function($scope) {
  // debugger;
  $scope.markers = [];
  $scope.mapCanvas = document.getElementById('map');
  $scope.mapOptions = {
    center: new google.maps.LatLng(44.5403, -78.5463),
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  $scope.map = new google.maps.Map($scope.mapCanvas, $scope.mapOptions);

  $scope.$on("newSearch", function (event, args) {
    $scope.removeAllMarkers();
    $scope.markers = [];
    args.businesses.forEach(function(business){
     var marker = new google.maps.Marker({
       position: {lat: business.hash.location.coordinate.latitude,
                  lng: business.hash.location.coordinate.longitude},
       title: business.hash.name
     });
     $scope.markers.push(marker);
   })
   $scope.placeNewMarkers();
   $scope.adjustMap();
  });

  $scope.removeAllMarkers = function() {
    $scope.markers.forEach(function(marker){
      marker.setMap(null);
    });
  };

  $scope.placeNewMarkers = function() {
    $scope.markers.forEach(function(marker){
      marker.setMap($scope.map);
    });
  };

  $scope.adjustMap = function() {
    var bounds = new google.maps.LatLngBounds();
    for(i = 0; i < $scope.markers.length; i++) {
      bounds.extend($scope.markers[i].getPosition());
    };
    $scope.map.fitBounds(bounds);
  }
});
