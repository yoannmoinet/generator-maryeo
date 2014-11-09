define(function (require) {
    'use strict';

    var Backbone = require('backbone');
    <% if (model) { %>var Model = require('apps/Queue/models/Model');<% } %>
    var _ = require('underscore');

    return Backbone.Collection.extend({
        <% if (model) { %>model: Model,<% } %>
        initialize: function (models, options) {
            _.extend(this, options);
        },
        comparator: function (model) {
            return 0;
        }
    });
});
