"use strict";
sdfsdf
var
  // $      = require('jquery'),
  // events = require('./helpers/pubsub'),
  _      = require('lodash');

function fail (thing) {
  // throw new Error(thing);
  console.log(["ERROR:", thing].join(' '));
}

function warn (thing) {
  console.log(["WARNING:", thing].join(' '));
}

function note (thing) {
  console.log(["NOTE:", thing].join(' '));
};


function parseAge (age) {
  if (!_.isString(age)) fail('Expecting a string');
  var a;

  note("Attempting to parse an age");
  a = parseInt(age, 10);

  if (_.isNaN(a)) {
    warn(["Could not parse age:", age].join(' '));
    a = 0;
  }

  return a;
}


// parseAge("42");
// parseAge(42);
// parseAge("frob");


function isIndexed (data) {
  return _.isArray(data) || _.isString(data);
}

function nth (a, index) {
  if (!_.isNumber(index))
    fail("Expected a number as the index type");
  if (!isIndexed(a))
    fail("Not supported or non-indexed type");
  if ((index < 0) || (index > a.length - 1))
    fail("Index value is out of bounds")

  return a[index];

}

var letters = ['a', 'b', 'c'];
nth(letters, 1);
nth('abc', 0);
nth({}, 0);
nth(letters, 400);
nth(letters, 'aaa');

function lessOrEqual (x,y) {
  return x <= y;
}

function comparator (pred) {
  return function (x, y) {
    if ( truthy(pred(x, y)) )
      return -1;
    else if ( truthy(pred(y,x)) )
      return 1;
    else
      return 0;
  }
}
var sortedNumbers = [2, 3, -1, -6, 0, -108, 42, 10].sort(comparator(lessOrEqual));
console.log(sortedNumbers);

function existy(x) { return x != null };
function truthy(x) { return (x !== false) && existy(x) };
