/**
 * Contacts management code
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

var ContactPageableList = DjangoRestPageableCollection.extend({
    model: restAPI.Contact,
    url: '/api/contacts',
    state: {
        pageSize: 10
    }
});
var contacts = new ContactPageableList();

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

var columns = [
    // TODO: autogen columns
    {
        name: "last_name",
        label: "Last Name",
        cell: DrillDownCell.extend({
            href: function () {
                return "#/contacts/show/" + this.model.get('id');
            }
        }),
        editable: false
    },
    {
        name: "first_name",
        label: "First Name",
        cell: "string",
        editable: false
    },
    {
        name: "create_time",
        label: "Created at",
        cell: CustomDateTimeCell,
        editable: false
    },
    {
        name: "modify_time",
        label: "Edited at",
        cell: CustomDateTimeCell,
        editable: false
    },
    {
        name: "creator_name",
        label: "Created by",
        cell: "string",
        editable: false
    }
];

var grid = new Backgrid.Grid({
    columns: columns,
    collection: contacts
});

var paginator = new Backgrid.Extension.Paginator({
    collection: contacts
});

var filter = new Backgrid.Extension.ServerSideFilter({
    collection: contacts,
    name: 'search',
    placeholder: 'Search'
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

var ContactViewModel = function(model) {
    this.model = model;
    this.id = kb.observable(this.model, 'id');
    this.last_name = kb.observable(this.model, 'last_name').extend({validatable: true});
    this.first_name = kb.observable(this.model, 'first_name').extend({validatable: true});

    this.save = function () {
        this.model.save();
    }
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

var createContactViewModel = function (id) {
    var model = new restAPI.Contact({id: id});
    model.fetch();

    return routeValidation(new ContactViewModel(model));
};

var createNewContactViewModel = function() {
    var model = new restAPI.Contact();

    return routeValidation(new ContactViewModel(model));
};

(function ($) {
    /**
     * Contacts only related code
     */
    var contactsDiv = $("#contacts-table");
    contactsDiv.append(grid.render().el);
    contactsDiv.after(paginator.render().el);
    contactsDiv.before(filter.render().el);
    $(filter.el).css({float: "right", margin: "20px"});

    contacts.fetch({reset: true});

//var view_model = {
//  contacts: kb.collectionObservable(users, { view_model: kb.ViewModel })
//};

//ko.applyBindings(view_model, $('#contacts-table')[0]);


})(jQuery);
