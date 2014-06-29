'use strict';

var  _  = require('lodash');

App.Modules.systemsMap = {
  init: function () {

    _.bindAll(this);

    this.bindEvents();
    this.cacheEls();

    this.systemsArray = [
      {
        id: 1,
        type: 'Feature',
        properties: {
          title: "Marker 1",
          icon: {
            className: 'systemIcon hasAlerts',
            html: 3
          },
          alertsInfo: ["Título do primeiro alerta", "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.", "Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim."],
          'with-notifications': true
        },
        geometry: {
          type: 'Point',
          coordinates: [-8.64106, 39.53833]
        }
      }, {
        id: 2,
        type: 'Feature',
        properties: {
          title: "Marker 2",
          icon: {
            className: 'systemIcon hasAlerts',
            html: 1
          },
          alertsInfo: ["Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."],
          'with-notifications': true
        },
        geometry: {
          type: 'Point',
          coordinates: [-8.24106, 39.13833]
        }
      }, {
        id: 3,
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
        id: 4,
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
        id: 5,
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
        id: 6,
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
        id: 7,
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

  },
  bindEvents: function () {
    var self = this;

    App.Events.on('render', this.render);

    $('.menu-ui a').on('click', function() {
      // For each filter link, get the 'data-filter' attribute value.
      var filter = $(this).data('filter');
      $(this).addClass('active').siblings().removeClass('active');
      self.systemLocations.setFilter(function(f) {
        // If the data-filter attribute is set to "all", return
        // all (true). Otherwise, filter on markers that have
        // a value set to true based on the filter name.
        return (filter === 'all') ? true : f.properties[filter] === true;
      });
      self.buildVisibleSys();
      self.updateVisibleSys();
      return false;
    });

  },

  cacheEls: function () {
    // this.button = document.querySelector('button');
    this.mapEl = document.querySelector('#systems-map');
    this.markersMap = {};
  },

  /**
   * Takes an array and builds a html string with a LI for each alert
   * @param {array} alerts [lista de alertas disponíveis no sistema]
   * @return {string}    [lista de alertas em html]
  */
  buildAlertsList: function(alerts) {
    var alert, alertsList, _i, _len;
    alertsList = "";
    for (_i = 0, _len = alerts.length; _i < _len; _i++) {
      alert = alerts[_i];
      alertsList += "<li>" + alert + "</li>";
    }
    return alertsList;
  },

  buildVisibleSys: function() {

    var self = this;
    var bounds = this.map.getBounds();

    this.onScreenEl.innerHTML = "";

    this.systemLocations.eachLayer(function(marker) {

      var link = self.onScreenEl.appendChild(document.createElement('a'));
      link.href = '#';
      // link.id = "marker" + marker.feature.id;
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

  },

  updateVisibleSys: function() {
    var bounds = this.map.getBounds();

    this.systemLocations.eachLayer(function(marker) {
      // console.log(marker.feature.id);
      // console.log( document.querySelector("#marker" + marker._leaflet_id) );
      // var markerButton = document.querySelector("#marker" + marker.feature.id);
      var markerButton = document.querySelector("#marker" + marker._leaflet_id);
      markerButton.classList.remove('is-visible');
      // console.log(marker);
      if (bounds.contains(marker.getLatLng())) {
        markerButton.classList.add('is-visible');
      } else {
        markerButton.classList.remove('is-visible');
      }
    });

    // this.map.fitBounds( this.systemLocations.getBounds() );
  },

  render: function () {

    var self = this;

    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a>';
    var streets = L.tileLayer(osmUrl, {
      attribution: osmAttrib
    });

    this.map = L.mapbox.map( 'systems-map' , streets );
    this.map.options.scrollWheelZoom = false;
    streets.addTo(this.map);

    this.systemLocations = L.mapbox.featureLayer().addTo( this.map );

    var geoJson = {
      type: 'FeatureCollection',
      features: this.systemsArray
    };


    /**
     * For each marker added, binds the
     * @param  {object} e [description]
     * @return {[type]}   [description]
    */
    this.systemLocations.on('layeradd', function(e) {
      var feature, marker, systemAlerts;

      marker = e.layer;
      // self.markersMap[marker.id] = marker;
      // console.log(self.markersMap[marker.id]);
      feature = marker.feature;

      marker.setIcon(L.divIcon(feature.properties.icon));
      marker.bindPopup("", {
        closeButton: false,
        offset: [4, 6]
      });
      if (feature.properties.alertsInfo.length > 0) {
        systemAlerts = self.buildAlertsList(feature.properties.alertsInfo);
        marker.setPopupContent("<header>" + feature.properties.title + "</header>\n<ul class='notificationsList'>\n  " + systemAlerts + "\n</ul>");
      } else {
        marker.setPopupContent("<header>" + feature.properties.title + "</header>\n<p>No system Alerts at this time.</p>");
      }
    });

    this.systemLocations.setGeoJSON(geoJson);
    var myLayer = L.mapbox.featureLayer().addTo( this.map );

    this.onScreenEl = this.mapEl.querySelector('.onScreenSystems');

    this.map.on('load', this.buildVisibleSys);
    this.map.on('move', this.updateVisibleSys);
    this.map.fitBounds( this.systemLocations.getBounds() );

  }

}








// new L.Control.GeoSearch({
//     provider: new L.GeoSearch.Provider.OpenStreetMap()
// }).addTo(map);
//
// var that = this;
//
