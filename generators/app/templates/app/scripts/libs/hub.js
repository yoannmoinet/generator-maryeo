define(function (require) {
    'use strict';

    var Radio = require('backbone.radio');

    var Bus = Radio.channel('AppChannel');

    return Bus;
});
