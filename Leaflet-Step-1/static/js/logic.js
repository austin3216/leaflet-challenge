// create API/geojson variable - selected 7-day data of all earthquakes
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(queryURL, function(data) {
    console.log(data.features);
    // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map
    createFeatures(data.features);
  });
  
function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<h4> Magnitude: " + feature.properties.mag + "</h4>");
    }

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
    }
}

// function to size the circle according to magnitude
function circleSize(features, latlng) {
    var circleSizes = {
        radius: features.properties.mag * 10,
        fillColor: circleColor(features.properties.mag),
        color: circleColor(features.properties.mag),
        opacity: 1,
        fillOpacity: .75
    }
    return L.circleMarker(latlng, circleSizes)
}

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: circleSize
    });

    createMap(earthquakes);
}
  
function createMap(earthquakes) {
    // create the mapbox layers
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });

    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });

    // baseMaps object to hold chosen layers
    var baseMaps = {
        "Satellite": satellite,
        "Street Map": streetmap,
        "Light Map": lightmap
    };

    // overlayMap layer 
    var overlayMap = {
        Earthquakes: earthquakes
    };

    // create the map passing through the outdoors and earthquakes (overlayMap) layers for the initial display
    var myMap = L.map("mapid", {
        center: [37.734, -122.447],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    // add legend
    var info = L.control({
        position: "bottomright"
    });

    info.addTo(myMap);
    
    // create layer control
    L.control.layers(baseMaps, overlayMap, {
        collapsed: false
    }).addTo(myMap);
}