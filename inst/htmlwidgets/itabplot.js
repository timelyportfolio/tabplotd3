HTMLWidgets.widget({

  name: 'itabplot',

  type: 'output',

  initialize: function(el, width, height) {

    return {
      // TODO: add instance fields as required
    }

  },

  renderValue: function(el, x, instance) {

    el.innerText = 'test dependencies';

  },

  resize: function(el, width, height, instance) {

  }

});
