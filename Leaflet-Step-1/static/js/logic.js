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
}