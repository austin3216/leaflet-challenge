// create base map
var myMap = L.map("mapid", {
    center: [37.734, -122.447],
    zoom: 5,
});

// add map layers
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
}).addTo(myMap);

var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// create query URL variable
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// changed to switch function for color of earthquake magnitude
function circleColor(magColor) {
    switch(true) {
        case (0 <= magColor && magColor <= 1.0):
            return "Indigo";
        case (1.0 <= magColor && magColor <= 2.0):
            return "Blue";
        case (2.0 <= magColor && magColor <= 3.0):
            return "Green";
        case (3.0 <= magColor && magColor <= 4.0):
            return "Yellow";
        case (4.0 <= magColor && magColor <= 5.0):
            return "Orange";
        case (5.0 <= magColor && magColor <= 6.0):
            return "Red";
        default:
            return "Violet";
    };
};

// function to size the circle according to magnitude
function circleSize(features, latlng) {
    var circleSizes = {
        radius: features.properties.mag * 10,
        fillColor: circleColor(features.properties.mag),
        color: circleColor(features.properties.mag),
        opacity: 1,
        fillOpacity: .75
    };
    return L.circleMarker(latlng, circleSizes);
};

// Perform a GET request to the query URL
d3.json(queryURL, function(data) {
    console.log(data.features);
    
    var earthquakes = data.features
    console.log(earthquakes)

    earthquakes.forEach(function(result){
        L.geoJSON(result, {
            pointToLayer: circleSize
        }).bindPopup("<h3>" + result.properties.place + "</h3><hr><p>" + new Date(result.properties.time) + "</p>" + "<h4> Magnitude: " + result.properties.mag + "</h4>").addTo(myMap)
    });
    
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
        mags = [0, 1, 2, 3, 4, 5, 6]
        labels = [];

    for (var i = 0; i < mags.length; i++) {
        div.innerHTML +=
            '<i style="background:' + circleColor(mags[i]) + '"></i> ' + mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
    }
    return div;
    };
    legend.addTo(myMap);
});