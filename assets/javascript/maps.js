//Map Section

 
var map;
var infowindow;

var queryUrl = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCVf591AZ-evHODFReCvcQ56eAJZecmLgc";

$.ajax({
    url: queryUrl,
    method: "POST",

}).then(function(response){
    initMap(response.location);

});

function initMap(userLocation) {

  map = new google.maps.Map(document.getElementById('mapDiv'), {
    center: userLocation, "accuracy": 50,
    zoom: 15
  });

  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: userLocation, "accuracy": 50,
    radius: 800,
    type: ['store']
  }, callback);
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
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