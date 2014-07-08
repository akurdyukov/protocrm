/**
 * Common code for all models and staff
 */
var DjangoRestPageableCollection = Backbone.PageableCollection.extend({
    queryParams: {
        currentPage: 'page',
        totalRecords: 'count',
        pageSize: 'page_size',
        sortKey: null,
        order: null,
        ordering: function () {
            var state = this.state;
            if (state.sortKey && state.order) {
                return (state.order > 0 ? "" : "-") + state.sortKey;
            }
        }
    },
    parseState: function (resp, queryParams, state, options) {
        if (resp) {

            var newState = _.clone(state);
            var serverState = resp;

            _.each(_.pairs(_.omit(queryParams, "directions", "results")), function (kvp) {
                var k = kvp[0], v = kvp[1];
                var serverVal = serverState[v];
                if (!_.isUndefined(serverVal) && !_.isNull(serverVal)) newState[k] = serverState[v];
            });

            if (serverState.order) {
                newState.order = _.invert(queryParams.directions)[serverState.order] * 1;
            }

            return newState;
        }
    },
    parseRecords: function (resp, options) {
        if (resp && 'results' in resp && _.isArray(resp.results)) {
            return resp.results;
        }

        return resp;
    }
});

var CustomDateTimeFormatter = {
    // function (*, Backbone.Model): string
    fromRaw: function (rawData, model) {
        return moment.utc(rawData).calendar();
    },
    // function (string, Backbone.Model): *|undefined
    toRaw: function (formattedData, model) {
    }
};
var CustomDateTimeCell = Backgrid.Cell.extend({
    formatter: CustomDateTimeFormatter
});

var DrillDownCell = Backgrid.UriCell.extend({
    href: null,
    target: null,
    render: function () {
        this.$el.empty();
        var rawValue = this.model.get(this.column.get("name"));
        var formattedValue = this.formatter.fromRaw(rawValue, this.model);
        var href = this.href;
        if (!this.href) {
            href = rawValue;
        } else if (_.isFunction(href)) {
            href = href.call(this);
        }
        this.$el.append($("<a>", {
            tabIndex: -1,
            href: href,
            title: this.title || formattedValue,
            target: this.target,
            navigate: 'true'
        }).text(formattedValue));
        this.delegateEvents();
        return this;
    }
});

ko.bindingHandlers.showErrorsFor = {
    update: function(element, valueAccessor, allBindings) {
        var value = valueAccessor();
        var valueUnwraped = ko.unwrap(value); // just to reming knockout to call this again on value change

        // clean before
        var node = $(element);
        node.removeClass('has-error');
        node.find('.help-block').remove();
        if (!value.isValid())
        {
            var errorText = value.errors();
            if (_.isArray(errorText)) {
                errorText = errorText.join(', ')
            }
            node.addClass('has-error');
            node.find('.form-control').after("<span class=\"help-block\">" + errorText + "</span>");
        }
    }
};

ko.extenders.validatable = function(target, option) {
    target.isValid = ko.observable(true);
    target.errors = ko.observable();
    target.valueWithError = null;

    target.setError = function (error) {
        target.errors(error);
        target.isValid(false);
        target.valueWithError = ko.unwrap(target);

        target.notifySubscribers();
    };

    target.clearError = function () {
        target.isValid(true);
        target.errors(null);
        target.valueWithError = null;

        return target;
    };

    target.subscribe(function(newValue) {
        if (target.valueWithError != ko.unwrap(target)) {
            target.clearError();
        }
    });

    return target;
};

function isValidatable(instance) {
    if (!ko.isObservable(instance)) return false;
    return instance.errors !== undefined;
}

function routeValidation(viewModel) {
    viewModel.model.on('invalid', function(model, error, options) {
        // clear errors
        _.each(_.filter(viewModel, isValidatable), function(element, index) {
            element.clearError();
        });

        // set new errors
        _.each(error, function (element, index) {
            if (index in viewModel) {
                viewModel[index].setError(element);
            }
        });
    });
    return viewModel;
}

ko.bindingHandlers.tags = {
    init: function (element, valueAccessor, allBindings) {
        $(element).tokenfield();

        ko.utils.registerEventHandler(element, "change", function () {
            var newValue = $(element).tokenfield('getTokens');
            var unwrapped = _.map(newValue, function(value){return value['value']});
            var observable = valueAccessor();
            observable(unwrapped);
        });
    },
    update: function (element, valueAccessor, allBindings) {
        var value = valueAccessor();
        var valueUnwrapped = ko.unwrap(value);
        if (_.isArray(valueUnwrapped)) {
            var adapted = _.map(valueUnwrapped, function(item) { return {'value': item, 'label': item}});
            // prevent dead loop
            var currentValue = $(element).tokenfield('getTokens');
            if (_.isEqual(adapted, currentValue)) {
                return;
            }
            // set value here
            $(element).tokenfield('setTokens', valueUnwrapped);
        }
    }
};