
var $divs = $('.Box');

// $divs.velocity("callout.shake", { stagger: 75 });

$divs.on('click', function (ev, el) {
  'use strict';
  var others = $divs.not($(this));
  others.velocity("callout.shake", { stagger: 75 });
});
