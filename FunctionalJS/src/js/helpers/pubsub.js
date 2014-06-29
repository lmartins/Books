module.exports = (function() {
  "use strict";
  var topics = {};

  return {
    subscribe: function (topic, listener) {
      // Create the topic's object if not yet created
      if (!topics[topic])
        topics[topic] = { queue: [] };

      // Add the listener to the queue
      var index = topics[topic].queue.push(listener);

      // Provide handle back for removal of topic
      return (function() {
        return {
          remove: function () {
            delete topics[index];
          }
        }
      })(index);
    },
    publish: function (topic, info) {
      // If the topic doesnt exist, or there's no listeners in queue, just leave
      if(!topics[topic] || !topics[topic].queue.length) return;

      // Cycle through topics queue, fire!
      var items = topics[topic].queue;
      for (var i = 0; i < items.length; i++) {
        items[i](info || {});
      }
    },
  }
}());
