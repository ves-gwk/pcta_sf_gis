// self executing function here
(function() {
   // your page initialization code here
   // the DOM will be available here
   const container = document.getElementById('mymap')
   console.log("Loaded: ", container);

  const mymap = L.map('mymap', {
      // center: [40.54, -122.277],
      // zoom: 5
      center: [42.944, -122.108],
      zoom: 10
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

  const sf_edit_segments = L.esri.featureLayer({
    url: 'https://services5.arcgis.com/ZldHa25efPFpMmfB/arcgis/rest/services/SalesforceSegments/FeatureServer/0'
  }).addTo(mymap);
  console.log(sf_edit_segments)

  // Add two different controls, one for PCT and one for side trails
  var selectControl = new L.Control.LineStringSelect({});
  mymap.addControl(selectControl);
  var selectControlSide = new L.Control.LineStringSelect({});
  mymap.addControl(selectControlSide);

  // Get divs for putting lengths in
  var pct_length_div = document.getElementById('pct-length')
  var side_length_div = document.getElementById('side-trail-length')

  // Set click and enabled variables for use in functions on click
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

  // Info button
  document.getElementById('info-button').onclick = function(){
    helpcontent = document.getElementById('help-content')
    helpcontent.classList.toggle('show')
    };
  // Save button
  // this is probably where stuff will get written to SF database (and into Hosted Feature Service)
  document.getElementById('save-button').onclick = function(){
      if(selectControlEnabled){
        saveButton(selectControl);
      }
      if(selectControlSideEnabled){
        saveButton(selectControlSide);
      }       
  };

  // Clear button
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
  function saveButton(select_control){
    console.log("save button clicked")
      var line_geojson = select_control.toGeoJSON()
      var feature = {
        type: 'Feature',
        id: 0,
        geometry: line_geojson.geometry,
        properties: {
          // This will be pulled from Salesforce RecordID field
          recordID: '01234'
        }
      };
      
      // feature = L.esri.Util.geojsonToArcGIS(line_geojson)
      console.log(feature)
      // line_feature = L.geoJSON.asFeature(line_geojson)
      // line_feature = line_geojson.asFeature(line_geojson)
      sf_edit_segments.addFeature(feature, function (err, response) {
        if (err) {
          console.log("There was an error...")
          console.log(err)
          return;
        }
        console.log("successfully added feature");
        console.log(response)
      }); 
            // mymap.openPopup("Total Distance: " + totalDistanceMiles, previousPoint)
  }
  function enableLayerControl(layer_control, event, clicks){
    if (clicks == 0){
      layer_control.enable({
        feature: event.layer.feature,
        layer: event.layer
      });
      if (layer_control == selectControl){
        selectControlEnabled = true
        update_div = pct_length_div
        update_text = "PCT Total Length: "
      }
      if (layer_control == selectControlSide){
        selectControlSideEnabled = true
        update_div = side_length_div
        update_text = "Side Trail Total Length: "
      }
      
      // put a listener on the selection finished
      // zoom to the selected line the first time it's set
      var i = 0
        layer_control.on('selection', function(){
          if (i==0){
            zoomToSelected(layer_control)
            i++
            console.log(i)
          }
        var coords = layer_control.getSelection()
          var previousPoint = null
          var totalDistance = 0.0000
          coords.forEach(function (latLng) {
            if (previousPoint) {
              totalDistance += previousPoint.distanceTo(latLng)
            }
            previousPoint = latLng;
          });
          totalDistanceMiles = totalDistance * 0.000621371
          totalDistanceMiles = totalDistanceMiles.toFixed(3);
          update_div.textContent = update_text + totalDistanceMiles
        });
    } else {console.log("already clicked once")};
  };
  function zoomToSelected(layer_control){
    // get the selection lat lons
    selection = layer_control.getSelection()
    // console.log(selection)
    selection_polyline = L.polyline(selection)
    // zoom to the line, but not too far in
    mymap.fitBounds(selection_polyline.getBounds())
    mymap.zoomOut()
  }


})();
