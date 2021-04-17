const lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

var layers = {
  Tornadoes: new L.LayerGroup(),
  Current_Weather: new L.LayerGroup(),
};

var myMap = L.map("map", {
  center: [31.9406,-89.2971],
  zoom: 10,
  layers: [
    layers.Tornadoes,
    layers.Current_Weather
  ]
});

lightmap.addTo(myMap);

const baseMaps = {
  "Tornado Events": layers.Tornadoes
};

const overlayMaps = {
  "Current Weather": layers.Current_Weather
};

L.control.layers(baseMaps, overlayMaps).addTo(myMap); 


d3.csv("static/data/noaa_storm_data.csv").then(function(tornado) {

  tornado.forEach(function(TornadoData) {
    TornadoData.BEGIN_LAT = +TornadoData.BEGIN_LAT;
    TornadoData.BEGIN_LON = +TornadoData.BEGIN_LON;
    TornadoData.END_LAT = +TornadoData.END_LAT;
    TornadoData.END_LON = +TornadoData.END_LON;

  
    const coord1 = [TornadoData.BEGIN_LAT, TornadoData.BEGIN_LON];
    const coord2 = [TornadoData.END_LAT, TornadoData.END_LON];
      
      
    const tornadoMark = L.ExtraMarkers.icon({
      icon: "icon ion-funnel",
      iconColor: "white",
      markerColor: "blue-dark",
      shape: "circle",

    });
      
      // layer group with begin and end markers, snake animation and popup
    const route = L.layerGroup([
      L.marker(coord1, {icon: tornadoMark}).bindPopup("<b></h3>Begin Lat, Lon: " + coord1 + " </h3><hr>Begin Date: " + TornadoData.BEGIN_DATE + " </h3><hr>F Scale: " 
      + TornadoData.TOR_F_SCALE + " </h3><hr>Tornado Length: " + TornadoData.TOR_LENGTH + " </h3><hr>Tornado Width: " + TornadoData.TOR_WIDTH),
      L.polyline([coord1, coord2]),
      L.marker(coord2, {icon: tornadoMark}).bindPopup("<h3>End Lat, Lon: " + coord2 + "</h3>")
    ], { snakingPause: 200 });
    route.addTo(myMap).snakeIn();
  });

  

  d3.csv("static/data/cities.csv").then(function(cities) {

      cities.forEach(function(CityData) {
        CityData.Cloudiness = +CityData.Cloudiness;
        CityData.Humidity = +CityData.Humidity;
        CityData.Lat = +CityData.Lat;
        CityData.Lng = +CityData.Lng;
        CityData.Max_Temp = +CityData.Max_Temp;
        CityData.Wind_Speed = +CityData.Wind_Speed;

        
        const weatherMark = L.ExtraMarkers.icon({
          icon: "icon ion-cloud",
          iconColor: "white",
          markerColor: "orange",
          shape: "circle"
        });


        const newMarker = L.marker([CityData.Lat, CityData.Lng], {icon: weatherMark})
        newMarker.addTo(layers.Current_Weather);
      

        newMarker.bindPopup("<b></h3>City: " + CityData.City + "</h3><hr>Latitude: " + CityData.Lat + "</h3><hr>Longitude: " + CityData.Lng +
        "</h3><hr>Cloudiness: " + CityData.Cloudiness + "</h3><hr>Humidity: " + CityData.Humidity + "</h3><hr>Max Temperature: " + CityData.Max_Temp +
        "</h3><hr>Wind Speed: " + CityData.Wind_Speed).addTo(myMap);

      });



  });


});



