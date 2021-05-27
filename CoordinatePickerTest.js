// self executing function here
(function() {
   // your page initialization code here
   // the DOM will be available here
   const container = document.getElementById('mymap')
   console.log("Loaded: ", container);

  const mymap = L.map('mymap', {
      center: [40.54, -122.277],
      zoom: 5
  });
  var lc = L.control.locate().addTo(mymap);
  
// Locate control testing stuff
//   var pct_marker = L.marker()
//   var side_marker = L.marker()
//   var overlays = {
//     "PCT Point": pct_marker,
//     "Side Trail Point": side_marker
// };
//   L.control.layers(overlays).addTo(mymap);

  // mymap.locate({setView: true, maxZoom: 16, icon: 'icon-location'});
  // Add basemap
  L.esri.basemapLayer('Topographic').addTo(mymap);

  // Add PCT Centerline FS
  const pct_centerline = L.esri.featureLayer({
    url: 'https://services5.arcgis.com/ZldHa25efPFpMmfB/arcgis/rest/services/Halfmile_Line_2018/FeatureServer/0',
    color: 'red'
  }).addTo(mymap);
  console.log(pct_centerline.getFeature(0))

  // Add Side Trails
  const side_trails = L.esri.featureLayer({
    url: 'https://services5.arcgis.com/ZldHa25efPFpMmfB/arcgis/rest/services/Halfmile_Line_2018/FeatureServer/1',
    color: 'black'
  }).addTo(mymap);

  // use below as starting point for 
  function connectTheDots(data){
      var c = [];
      for(i in data._layers) {
          var x = data._layers[i]._latlng.lat;
          var y = data._layers[i]._latlng.lng;
          c.push([x, y]);
      }
      return c;
  }
  // Make it do something on map click
  // mymap.on('click', onMapClick);
  // pct_centerline.on('click', onPCTClick)
var myIcon = L.divIcon();
// you can set .my-div-icon styles in CSS
var start_point = true
mymap.on('click', function (e) {
    var _select   = document.getElementById("symbols");
    var _val      = _select.value;
    var layerName = _select.options[_select.selectedIndex].text;
    console.log("layer: ", layerName);

    if (layerName == "PCT Point"){
        var pct_marker = L.marker(e.latlng, {
        draggable: true
        }).addTo(mymap)
        var popup = L.popup()
        .setLatLng(e.latlng)
        .setContent('<p>Hello world!<br />This is a nice popup.</p>')
        .openOn(mymap);
        pct_marker.on('click', function(e){
            e.target.removeFrom(mymap)
        });
    }
    else{
        var side_marker = L.marker(e.latlng, {
        draggable: true,
        icon: myIcon
        }).addTo(mymap)
        side_marker.on('click', function(e){
            e.target.removeFrom(mymap)
        });
    }

});

function removeFeature(feature){
    feature.remove()
}
// pct_centerline.on("click", function(e) {
//     var id = e.feature.id
//     console.log(id);
//     var polyline = e.target.getFeature(id)
//     console.log(polyline)
//     var verts = polyline.getLatLngs()
//   console.log("verts clicked: ", verts);
// });
})();
