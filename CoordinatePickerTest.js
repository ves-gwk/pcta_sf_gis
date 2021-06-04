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

  // Add basemap
  L.esri.basemapLayer('Topographic').addTo(mymap);

  // Add PCT Centerline FS
  const pct_centerline = L.esri.featureLayer({
    url: 'https://services5.arcgis.com/ZldHa25efPFpMmfB/ArcGIS/rest/services/PCTA_Centerline/FeatureServer/0',
    color: 'red',
    style: {
      color: '#FF00FF',
      weight: 2,
      opacity: 0.85,
      fillOpacity: 0.5
    }
  }).addTo(mymap);
  var selectControl = new L.Control.LineStringSelect({});
  mymap.addControl(selectControl);
  // mymap.on('load', function(e) {
  //   console.log(e);
  // });

  // pct_centerline.on('click', function(e){
  //   console.log(e);
  //   var id = e.layer.feature.id
  //   var feature = pct_centerline.getFeature(id)
  //   console.log(feature);
  //   var lat_lngs = feature.getLatLngs()
  //   console.log(lat_lngs);
  //   var clicked = L.point(e.layerPoint)
  //   var near_pt = e.layer.closestLayerPoint(clicked)
  //   console.log(near_pt);
  //   selectControl.enable({
  //     feature: e.layer.feature,
  //     layer: e.layer
  //   });
  // });
  pct_centerline.on('createfeature', function(e){
    console.log(e);
    var layer = e.target._layers[1]
    var feature = e.feature
    selectControl.enable({
      feature: feature,
      layer: layer
    });
  });
  // Add Side Trails
  const side_trails = L.esri.featureLayer({
    url: 'https://services5.arcgis.com/ZldHa25efPFpMmfB/arcgis/rest/services/Halfmile_Line_2018/FeatureServer/1',
    color: 'black'
  }).addTo(mymap);

// currentMarkers = {}

//  var myIcon = L.divIcon();
// // you can set .my-div-icon styles in CSS
//  currentMarkersPCT = {}
//  currentMarkersSide = {}
//  mymap.on('click', function (e) {
//     var _select   = document.getElementById("symbols");
//     var _val      = _select.value;
//     var layerName = _select.options[_select.selectedIndex].text;
//     console.log("layer: ", layerName);
//     if (layerName == "PCT Point"){
//         addRemoveMarker(e, currentMarkersPCT, layerName)
//     }
//     else {
//         addRemoveMarker(e, currentMarkersSide, layerName)
//     }
//  });
// function addRemoveMarker(event, currentMarkers, layerName) {
// // if start and end added and clicked map again start over
//     if (currentMarkers.start && currentMarkers.end) {
//       currentMarkers.start.remove();
//       currentMarkers.end.remove();
//       currentMarkers.start = null;
//       currentMarkers.end = null;
//       console.log("reset start/end")      
//     }
//     // Add different icon per type
//     if (layerName == "PCT Point"){
//         var feat = L.marker(event.latlng, {
//         draggable: true
//     }).addTo(mymap)
//     }
//     else{
//         var feat = L.marker(event.latlng, {
//         draggable: true,
//         icon: myIcon
//     }).addTo(mymap)
//     }

//     // assign the marker to start/stop depending on state 
//     if (currentMarkers.start == null){
//       currentMarkers.start = feat;
//       console.log("set to start")
//     }
//     else if (currentMarkers.end == null) {
//       currentMarkers.end = feat;
//       console.log("set to end")
//     }
//     feat.on('click', function(e) {
//       // track the state of removal. we prob wanna use ids from the markers to target them
//       // if start is filled in and end isn't, start over
//       if (currentMarkers.start && currentMarkers.end == null) {
//         currentMarkers.start.remove();
//         // currentMarkers.end.remove();
//         currentMarkers.start = null;
//         currentMarkers.end = null;
//         console.log("start filled in, end is not. reset both")
//       } 
//       // otherwise just reset end, keep the start
//       else{
//         currentMarkers.end.remove();
//         currentMarkers.end = null;
//         console.log("start filled in, end is too. keep the start")
//       }
//       // e.remove();
//     });
// }

})();
