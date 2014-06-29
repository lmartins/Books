'use strict';
var  $          = require('jquery'),
     _          = require('underscore'),
     Handlebars = require('handlebars');

App.Modules.introduction = {
     // this is your root DOM element for your module, a module doesn't have to be connected to the DOM, but if it is,
     // then it should control one element and everything inside it
     el: "#introduction",

     // this is your init function, this runs when the module is first initialised by the app (app.js)
     init: function () {
          _.bindAll(this, 'render');
          this.cacheEls();
          this.bindEvents();
     },
     bindEvents: function () {
          App.Events.on('render', this.render);
     },
     cacheEls: function () {
          this.template = Handlebars.compile('This snippet is being powered by Handlebars. Currently the date is {{day}}/{{month}}/{{year}}');
          this.messageEl = $(this.el).find('.message');
     },
     render: function (event, params) {
          var date = new Date(),
          month = date.getMonth() + 1;

          this.messageEl.html(this.template({
               day: date.getDate(),
               month: App.Helpers.toCanonicalMonth(month),
               year: date.getFullYear()
          }))
     }

};
