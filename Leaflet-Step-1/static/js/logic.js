// create geojson variable - selected 7-day data of all earthquakes

var usgs = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// GET request to query URL

d3.json(usgs).then((data) => {
    createFeatures(data.features);
    console.log(data.features);
});