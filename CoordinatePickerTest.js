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
    style: {
      color: '#FF00FF',
      weight: 3,
      opacity: 0.85,
      fillOpacity: 0.5
    }
  }).addTo(mymap);

  // // // Add PCT Centerline Tile FS
  // const pct_centerline = L.esri.Vector.vectorTileLayer('e45ba22506a144428abf9fd92a8e5755').addTo(mymap);

  // Add Side Trails
  const side_trails = L.esri.featureLayer({
    url: 'https://services5.arcgis.com/ZldHa25efPFpMmfB/arcgis/rest/services/Halfmile_Line_2018/FeatureServer/1',
    color: 'black'
  }).addTo(mymap);

  // Add two different controls, one for PCT and one for side trails
  var selectControl = new L.Control.LineStringSelect({});
  mymap.addControl(selectControl);
  var selectControlSide = new L.Control.LineStringSelect({});
  mymap.addControl(selectControlSide);

// Set hover style for both layers
// pct_centerline.on('mouseover', function(e){
//     setOnHover(e)
//   });
// side_trails.on('mouseover', function(e){
//     setOnHover(e)
//   });
var pct_click_count = 0
var side_click_count = 0
var selectControlEnabled = false
var selectControlSideEnabled = false
// Enable layer control for both layers
pct_centerline.on('click', function(e){
  enableLayerControl(selectControl, e, pct_click_count)
  pct_click_count++
});
side_trails.on('click', function(e){
  enableLayerControl(selectControlSide, e, side_click_count)
  side_click_count++
});
  // function setOnHover(e){
  //   console.log(e);
  //   var layer = e.target

  //   layer.setStyle({
  //       color: '#0ff',
  //       opacity: 1,
  //       weight: 2
  //     });
  //   layer.on('mouseout', function(){
  //     layer.setStyle({
  //       color: '#FF00FF',
  //       weight: 2,
  //       opacity: 0.85,
  //       fillOpacity: 0.5
  //     })
  //   });
  // }

// save the geojson
// this is probably where stuff will get written to SF database
  document.getElementById('save-button').onclick = function(){
      console.log("save button clicked")
      var pct_geojson = selectControl.toGeoJSON()
      var side_geojson = selectControlSide.toGeoJSON()
      console.log(pct_geojson)
      console.log(side_geojson)
  };
  document.getElementById('clear-button').onclick = function(){
    clearButton(selectControlEnabled, selectControlSideEnabled);
  };
  
  function clearButton(enabled, side_enabled){
    console.log("clear button clicked")
      console.log(enabled)
      if (enabled){
        selectControl.disable(); 
        selectControlEnabled = false
        pct_click_count = 0
      } 
      else{console.log("no pct line to reset")}
      if (side_enabled){
        selectControlSide.disable();
        selectControlSideEnabled = false
        side_click_count = 0
      } 
      else{console.log("no side trails to reset")}
  };
  function enableLayerControl(layer_control, event, clicks){
    if (clicks == 0){
      layer_control.enable({
        feature: event.layer.feature,
        layer: event.layer
      });
      if (layer_control == selectControl){selectControlEnabled = true}
      if (layer_control == selectControlSide){selectControlSideEnabled = true}
      
      // put a listener on the selection finished
      // zoom to the selected line the first time it's set
      var i = 0
        layer_control.on('selection', function(){
          if (i==0){
            zoomToSelected(layer_control)
            i++
            console.log(i)
          }
        });
    } else {console.log("already clicked once")};
  };
  function zoomToSelected(layer_control){
    // get the selection lat lons
    selection = layer_control.getSelection()
    // console.log(selection)
    selection_polyline = L.polyline(selection)
    // zoom to the line
    mymap.fitBounds(selection_polyline.getBounds())
  }
  // // On click for PCT Centerline, initialize the line string select control
  // pct_centerline.on('click', function(e){
  //   // console.log(e);
  //   var id = e.layer.feature.id
  //   var feature = pct_centerline.getFeature(id)
  //   selectControl.enable({
  //     feature: e.layer.feature,
  //     layer: e.layer
  //   });
  // });

  // // On click for Side Trails, intitialize another line string select control
  // side_trails.on('click', function(e){
  //   // console.log(e);
  //   var id = e.layer.feature.id
  //   var feature = side_trails.getFeature(id)
  //   selectControlSide.enable({
  //     feature: e.layer.feature,
  //     layer: e.layer
  //   });
  // });

})();
