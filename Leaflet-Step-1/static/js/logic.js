// create API/geojson variable - selected 7-day data of all earthquakes
var usgs = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// function and conditionals to create colors for markers
function assignColor(magnitude) {
    if (magnitude > 5){
        return "ee6352"
    }
    else if (magnitude > 4){
        return "f79d84"
    }
    else if (magnitude > 3){
        return "fac05e"
    }
    else if (magnitude > 2){
        return "59cd90"
    }
    else if (magnitude > 1){
        return "3fa7d6"
    }
    else {
        return "#708090"
    }
}

// GET request to query URL
// Perform a GET request to the query URL
d3.json(usgs, function(data) {
    console.log(data.features);
    // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map
    createFeatures(data.features);
  });
  
  function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
      layer.bindPopup(feature.properties.place + "<hr>" + new Date(feature.properties.time))
    }

    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
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
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
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
    var myMap = L.map('mapid', {
        center: [36.7126875, -120.476189],
        zoom: 4,
        layers: [streetmap, earthquakes]
    });

    // adds a layer control to allow for switching between layers
    L.control.layers(baseMaps, overlayMap, {
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({position: 'bottomright'});
    
    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend'),
            magnitudes = [0, 1, 2, 3, 4, 5]
            labels = [];
        
        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML += 
                '<i style="background:' + assignColor(magnitudes[i]) + '"></i>' + magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
        }
        return div
    };

    legend.addTo(myMap);
}