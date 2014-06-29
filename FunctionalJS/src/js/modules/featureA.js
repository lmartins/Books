'use strict';

var  $          = require('jquery'),
     _          = require('underscore'),
     Steady     = require('steady'),
     Handlebars = require('handlebars');

App.Modules.featureA = {
  init: function () {
    // this underscore.js function allows us to use the keyword 'this' inside the 'render' function and for 'this' to have
    // the context of our 'introduction' module and not whatever called the 'render' function
    _.bindAll(this, 'talky', 'render');
    this.bindEvents();
    this.cacheEls();

    var s = new Steady({
      throttle: 100,
      handler: this.talky
    });

    s.addCondition('max-bottom', 500);
    s.addCondition('min-scrollY', 500);
    s.addCondition('scrollX', 0);

  },
  bindEvents: function () {
    App.Events.on('render', this.render);
    // App.Events.on('log', this.talky);

    App.Events2.subscribe('/page/load', function () {
      console.log("Event Page/Load detected and triggered event in FeatureA module");
    });
  },
  cacheEls: function () {
    this.button = document.querySelector('button');
  },
  render: function () {
    this.button.addEventListener('click', this.talky );
  },
  talky: function () {
    console.log("Message from the featureA");
  }
}
