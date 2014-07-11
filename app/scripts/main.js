/*globals jQuery, L */

(function($) {
  $(function() {
    var PRECISION = 6,
        map = new L.Map('map'),
        $center = $('#center'),
        $bounds = $('#bounds'),
        $zoom = $('#zoom'),
        layerUrl = 'http://{s}.tiles.mapbox.com/v3/atogle.map-vo4oycva/{z}/{x}/{y}.png',
        layerAttribution = 'Map data &copy; OpenStreetMap contributors, CC-BY-SA <a href="http://mapbox.com/about/maps" target="_blank">Terms &amp; Feedback</a>',
        layer = L.tileLayer(layerUrl, {
          maxZoom: 19,
          attribution: layerAttribution,
          subdomains: 'abcd'
        }),
        centerMarker;

    map.setView(new L.LatLng(39.952467, -75.163607), 11).addLayer(layer);

    function latLngToString(latLng) {
      return '[' + latLng.lat.toFixed(PRECISION) + ', ' + latLng.lng.toFixed(PRECISION) + ']';
    }

    function boundsToString(bounds) {
      var sw = bounds.getSouthWest(),
          ne = bounds.getNorthEast();

      return '[ ' + latLngToString(sw) + ', ' + latLngToString(ne) + ' ]';
    }

    function setCenter() {
      var center = map.getCenter();

      if (centerMarker) {
        centerMarker.setLatLng(center);
      } else {
        centerMarker = new L.CircleMarker(center, {
          radius: 4,
          opacity: 0.9
        });
        map.addLayer(centerMarker);
      }

      $center.html(latLngToString(center));
    }

    function setBounds() {
      $bounds.html(boundsToString(map.getBounds()));
    }

    function setZoom() {
      $zoom.html(map.getZoom());
    }

    function setCensus() {
      var center = map.getCenter(),
          url = 'http://www.broadbandmap.gov/broadbandmap/census/block?latitude=' +
            center.lat + '&longitude=' + center.lng + '&format=jsonp&callback=?';

      $.getJSON(url, function(data){
        var fips = "               ";
        if (data.Results.block.length) {
          fips = data.Results.block[0].FIPS;
        }

        $('#state-fips').html(fips.substr(0, 2));
        $('#county-fips').html(fips.substr(2, 3));
        $('#tract-fips').html(fips.substr(5, 6));
        $('#blockgroup-fips').html(fips.substr(11, 1));
        $('#block-fips').html(fips.substr(11, 4));
      });
    }

    map.on('move', function(evt) {
      setCenter();
      setBounds();
    });

    map.on('zoomend', function(evt) {
      setZoom();
    });

    map.on('moveend', function(evt) {
      setCensus();
    });

    setCenter();
    setBounds();
    setZoom();
    setCensus();
  });
}(jQuery));