'use strict';
var buildAlertsList, buildVisibleSys, geoJson, geoLocateBtn, geoLocateInfo, map, mapEl, myLayer, onScreenEl, osmAttrib, osmUrl, streets, systemLocations, systemsArray, updateLocationInfo, updateVisibleSys, L;

osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a>';
mapEl = document.querySelector('#systems-map');
map = L.mapbox.map('systems-map', streets );

streets = L.tileLayer(osmUrl, {
  attribution: osmAttrib
});

streets.addTo(map);


/**
 * Informação dos sistemas
 * @type {Array}
 */
systemsArray = [
  {
    type: 'Feature',
    properties: {
      title: "Marker 1",
      icon: {
        className: 'systemIcon hasAlerts',
        html: 3
      },
      alertsInfo: ["Título do primeiro alerta", "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.", "Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim."]
    },
    geometry: {
      type: 'Point',
      coordinates: [-8.64106, 39.53833]
    }
  }, {
    type: 'Feature',
    properties: {
      title: "Marker 2",
      icon: {
        className: 'systemIcon hasAlerts',
        html: 1
      },
      alertsInfo: ["Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."]
    },
    geometry: {
      type: 'Point',
      coordinates: [-8.24106, 39.13833]
    }
  }, {
    type: 'Feature',
    properties: {
      title: "Marker 3",
      icon: {
        className: 'systemIcon',
        html: 0
      },
      alertsInfo: []
    },
    geometry: {
      type: 'Point',
      coordinates: [-8.21106, 37.13833]
    }
  }, {
    type: 'Feature',
    properties: {
      title: "Marker 4",
      icon: {
        className: 'systemIcon',
        html: 0
      },
      alertsInfo: []
    },
    geometry: {
      type: 'Point',
      coordinates: [-9.34106, 38.93833]
    }
  }, {
    type: 'Feature',
    properties: {
      title: "Marker 5",
      icon: {
        className: 'systemIcon',
        html: 0
      },
      alertsInfo: []
    },
    geometry: {
      type: 'Point',
      coordinates: [-7.24106, 38.13833]
    }
  }, {
    type: 'Feature',
    properties: {
      title: "Marker 6",
      icon: {
        className: 'systemIcon',
        html: 0
      },
      alertsInfo: []
    },
    geometry: {
      type: 'Point',
      coordinates: [-4.34106, 39.93833]
    }
  }, {
    type: 'Feature',
    properties: {
      title: "Marker 7",
      icon: {
        className: 'systemIcon',
        html: 0
      },
      alertsInfo: []
    },
    geometry: {
      type: 'Point',
      coordinates: [-4.64106, 40.93833]
    }
  }
];
systemLocations = L.mapbox.featureLayer().addTo(map);
geoJson = {
  type: 'FeatureCollection',
  features: systemsArray
};
/**
 * Takes an array and builds a html string with a LI for each alert
 * @param {array} alerts [lista de alertas disponíveis no sistema]
 * @return {string}    [lista de alertas em html]
*/
buildAlertsList = function(alerts) {
  var alert, alertsList, _i, _len;
  alertsList = "";
  for (_i = 0, _len = alerts.length; _i < _len; _i++) {
    alert = alerts[_i];
    alertsList += "<li>" + alert + "</li>";
  }
  return alertsList;
};
/**
 * For each marker added, binds the
 * @param  {object} e [description]
 * @return {[type]}   [description]
*/
systemLocations.on('layeradd', function(e) {
  var feature, marker, systemAlerts;
  marker = e.layer;
  feature = marker.feature;
  marker.setIcon(L.divIcon(feature.properties.icon));
  marker.bindPopup("", {
    closeButton: false,
    offset: [4, 6]
  });
  if (feature.properties.alertsInfo.length > 0) {
    systemAlerts = buildAlertsList(feature.properties.alertsInfo);
    return marker.setPopupContent("<header>" + feature.properties.title + "</header>\n<ul class='notificationsList'>\n  " + systemAlerts + "\n</ul>");
  } else {
    return marker.setPopupContent("<header>" + feature.properties.title + "</header>\n<p>No system Alerts at this time.</p>");
  }
});
systemLocations.setGeoJSON(geoJson);
geoLocateBtn = document.createElement('a');
geoLocateInfo = document.createElement('div');
geoLocateBtn.classList.add('geoLocateBtn');
geoLocateInfo.classList.add('geoLocateInfo');
mapEl.appendChild(geoLocateBtn);
mapEl.appendChild(geoLocateInfo);
myLayer = L.mapbox.featureLayer().addTo(map);
updateLocationInfo = function(info) {
  geoLocateInfo.innerHTML = info;
  return geoLocateInfo.classList.add('is-visible');
};
if (!navigator.geolocation) {
  updateLocationInfo('geolocation is not available');
} else {
  geoLocateBtn.onclick = function(e) {
    e.preventDefault();
    e.stopPropagation();
    return map.locate();
  };
}
map.on('locationfound', function(e) {
  map.fitBounds(e.bounds);
  myLayer.setGeoJSON({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [e.latlng.lng, e.latlng.lat]
    },
    properties: {
      'marker-color': '#000',
      'marker-symbol': 'star-stroked'
    }
  });
  updateLocationInfo("" + e.latlng.lng + " - " + e.latlng.lat);
  return geoLocateBtn.parentNode.removeChild(geoLocateBtn);
});
map.on('locationerror', function() {
  return updateLocationInfo('Position could not be found');
});
map.on('mousemove', function(e) {
  return updateLocationInfo("" + (e.latlng.toString()));
});
onScreenEl = document.createElement('div');
onScreenEl.classList.add('onScreenSystems');
mapEl.appendChild(onScreenEl);
buildVisibleSys = function() {
  var bounds, visibleSys;
  visibleSys = [];
  bounds = map.getBounds();
  return systemLocations.eachLayer(function(marker) {
    var link;
    link = onScreenEl.appendChild(document.createElement('a'));
    link.href = '#';
    link.id = "marker" + marker._leaflet_id;
    link.innerHTML = marker.options.title;
    link.onmouseover = function() {
      marker.openPopup();
      marker._icon.classList.add('is-active');
    };
    link.onmouseout = function() {
      marker._icon.classList.remove('is-active');
    };
    link.onclick = function() {
      map.panTo(marker.getLatLng());
      marker.openPopup();
    };
  });
};
updateVisibleSys = function() {
  var bounds;
  bounds = map.getBounds();
  return systemLocations.eachLayer(function(marker) {
    var markerEl;
    markerEl = document.querySelector("#marker" + marker._leaflet_id);
    if (bounds.contains(marker.getLatLng())) {
      return markerEl.classList.add('is-visible');
    } else {
      return markerEl.classList.remove('is-visible');
    }
  });
};
map.on('load', buildVisibleSys);
map.on('move', updateVisibleSys);
map.fitBounds( systemLocations.getBounds() );

// Formulário para guardar coordenadas de marcador
var coordsForm = document.querySelector('.Map-coordinatesForm'),
    coordsFormLat = coordsForm.querySelector('.lat'),
    coordsFormLng = coordsForm.querySelector('.lng');

var updateFormCords = function (cords) {
  coordsFormLat.value = cords.lat;
  coordsFormLng.value = cords.lng;
};

var newSystemMarker;
var createSingleMarker = function (e) {

  if (newSystemMarker) {
    map.removeLayer(newSystemMarker);
  }

  newSystemMarker = new L.Marker(e.latlng, {draggable:true});
  map.addLayer(newSystemMarker);
  newSystemMarker.bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();
  // var systemLocation = L.marker(e.latlng, {
  //   draggable: true
  // }).addTo(map);
  updateFormCords(e.latlng);

  newSystemMarker.on('dragend', function(e){
    updateFormCords(e.target._latlng);
  });

};

map.on('click', createSingleMarker );


new L.Control.GeoSearch({
    provider: new L.GeoSearch.Provider.OpenStreetMap()
}).addTo(map);
