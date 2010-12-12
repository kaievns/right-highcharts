/**
 * RightJS driver for Highcharts
 *
 * Copyright (C) Nikolay Nemshilov
 */
var HighchartsAdapter = {
  animate: function(element, params, options) {
    if (isElement(element)) {
      $(element).morph(params, {
        duration: options.duration,
        onFinish: options.complete,
        queue:    options.queue
      });
    } else if (element.element) { // svg, rects and so one
      for (var key in params) {
        element.element.setAttribute(key, params[key]);
      }
    }
  },

  each: function(array, callback) {
    return $A(array).each(callback);
  },

  map: function(array, callback) {
    return $A(array).map(callback);
  },

  grep: function(array, callback) {
    return $A(array).filter(callback);
  },

  // deep merge
  merge: function() {
    for (var copy = {}, key, object, i=0; i < arguments.length; i++) {
      object = arguments[i];
      for (key in object) {
        copy[key] = !isHash(object[key]) ? object[key] :
          HighchartsAdapter.merge(copy[key] || {}, object[key]);
      }
    }

    return copy;
  },

  hyphenate: function(string) {
    return string.underscored().replace(/_/g, '-');
  },

  addEvent: function (element, event, callback) {
    (isElement(element) ? $(element) :
      // sometimes they send non-element objects, wtf???
      $ext(element,
        Object.without(new Observer(),
          // skipping the Options module
          'options', 'setOptions', 'cutOptions'
        )
      )
    ).on(event, callback);
  },

  removeEvent: function(element, event, callback) {
    $(element).stopObserving(event, callback);
  },

  fireEvent: function(element, event, args, callback) {
    var event  = new Event(event, args),
        method = event.preventDefault;

    event.preventDefault = function() {
      method.call(this);
      callback = null;
    };

    element = isElement(element) ? $(element) : element;

    if (element.fire) {
      element.fire(event, args);
    }

    if (callback) {
      callback();
    }
  },

  // stopping any animations
  stop: function (element) {
    if (isElement(element)) {
      $(element).stop();
    }
  }
};