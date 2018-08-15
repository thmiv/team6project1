//Map Section

 
var map;
var infowindow;

var service;
var userLocation;
var x = 0;
var storeNames = ["H-E-B", "Target", "Walmart", "WholeFoods"];

var queryUrl = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCVf591AZ-evHODFReCvcQ56eAJZecmLgc";

$.ajax({
    url: queryUrl,
    method: "POST",

}).then(function(response){
  userLocation = response.location;
  initMap();

});

function initMap() {

  map = new google.maps.Map(document.getElementById('mapDiv'), {
    center: userLocation, "accuracy": 50,
    zoom: 15
  });

  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  findPlaces();
}

function findPlaces(){
  service.nearbySearch({
    location: userLocation, 
    accuracy: 50,
    radius: 7000,
    type: ['store'],
    name: storeNames[x]
  }, callback);
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
        console.log(storeNames[x] + " found");
        createMarker(results[i]);
    }
  }
  x++;
  if(x < 4){
    findPlaces()
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow = new google.maps.InfoWindow();
    console.log(infowindow);
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}