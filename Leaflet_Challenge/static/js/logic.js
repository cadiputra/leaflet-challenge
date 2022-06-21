// Retrieve data
var dataURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Data Preview and  perform GET function
console.log("----Data Test----")
d3.json(dataURL).then((data) => {
  console.log(data)
  createFeatures(data);
});


function createFeatures(earthquakeData) {

  function onEachLayer(feature) {
    return new L.circleMarker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
      radius: circleSize(feature.properties.mag),
      fillOpacity: 0.5,
      color: getColor(feature.properties.mag),
      fillColor: getColor(feature.properties.mag)
    });
  } //function onEachLayer

  // Function for each feature
  function onEachFeature(feature,layer) {
    layer.bindPopup ("<h5>Place: " + feature.properties.place + "</h5><h5>Mag: " + feature.properties.mag + "</h5>");
  } //function onEachFeature

  // Create geoJSON layer
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: onEachLayer
  });
  
  // Passing the layer to createMap function
  createMap(earthquakes);

} //function create features

function createMap(earthquakes) {
  var streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    maxZoom: 18,
    zoom: 0.2,
    id: "mapbox/streets-v11",
    accessToken: MAP_KEY
  });

  var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: MAP_KEY
  });

  // Layers options
  var baseMaps = {
    "Street": streetMap,
    "Satellite": satelliteMap
  };

  // Add overlay
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create map
  var myMap = L.map("map" , {
    center:[34.0522,-118.2437],
    zoom: 5,
    layers: [streetMap,earthquakes]
  });

  // Layer control
  L.control.layers(baseMaps,overlayMaps, {
    collapsed: true
  }).addTo(myMap);

  // Create Legend
  var legend = L.control({
    position: "bottomleft"
  });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div","legend")
      var labels = ["0-1","1-2","2-3","3-4","4-5","5+"];
      var legendColors = ["green","yellowgreen","yellow","orange","salmon","red"];
    
    for (var i = 0; i < labels.length; i++) {
      div.innerHTML += "<i style='background:" + legendColors[i] + "'></i> " +
      labels[i] + "<br>" ;
    }
    return div;
  };

  // Add Legend
  legend.addTo(myMap);
}; // function createMap

// Create color scale
  function getColor(magnitude) {
    // Conditionals for magnitude
    if (magnitude >= 5) {
      return "red";
    }
    else if (magnitude >= 4) {
      return "salmon";
    }
    else if (magnitude >= 3) {
     return "orange";
    }
    else if (magnitude >= 2) {
      return "yellow";
    }
    else if (magnitude >= 1) {
      return "yellowgreen";
    }
    else {
      return "green";
    }
  };
 

// Define  circleSize
function circleSize(magnitude) {
  return magnitude *3;
}