// create geojson variable - selected 7-day data of all earthquakes

var usgs = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// GET request to query URL

d3.json(usgs).then((data) => {
    createFeatures(data.features);
    console.log(data.features);
});

function createMap(earthquakes) {
    // create the mapbox layers
    var satellite = L.tilelayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        maxZoom: 20,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        maxZoom: 20,
        id: "mapbox.grayscale",
        accessToken: API_KEY
    });

    var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        maxZoom: 20,
        id: "mapbox.outdoors",
        accessToken: API_KEY
    });

    var baseMap = {
        "Satellite": satellite,
        "Grayscale": grayscale,
        "Outdoors": outdoors
    };

    var overlayMap = {
        "Earthquakes": earthquakes
    };

    var myMap = L.map('map', {
        center: [36.7126875, -120.476189],
        zoom: 4,
        layers: [outdoors, earthquakes]
    });

    L.control.layers(baseMap, overlayMap, {
        collapsed: false
    }).addTo(myMap);

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

    var legend = L.control({position: 'bottomright'});
    
    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create('div', 'info legend'),
            magnitudes = [0, 1, 2, 3, 4, 5];
        
        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML +=
        }
    }
}