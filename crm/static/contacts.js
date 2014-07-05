/**
 * Contacts management code
 */
(function ($) {

    /**
     * Contacts only related code
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
                    return (state.order > 0? "" : "-") + state.sortKey;
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
            firstPage: 1,
            pageSize: 10
        }
    });
    var contacts = new ContactPageableList();

    var columns = [
        // TODO: autogen columns
        {
            name: "last_name",
            label: "Last Name",
            cell: "string"
        },
        {
            name: "first_name",
            label: "First Name",
            cell: "string"
        }
    ];

    var grid = new Backgrid.Grid({
        columns: columns,
        collection: contacts
    });

    var contactsDiv = $("#contacts-table");

    contactsDiv.append(grid.render().el);

    var paginator = new Backgrid.Extension.Paginator({
        collection: contacts
    });
    contactsDiv.after(paginator.render().el);

    var filter = new Backgrid.Extension.ServerSideFilter({
        collection: contacts,
        name: 'search',
        fields: ['last_name', 'first_name']
    });
    contactsDiv.before(filter.render().el);
    $(filter.el).css({float: "right", margin: "20px"});

    contacts.fetch({reset: true});

//var view_model = {
//  contacts: kb.collectionObservable(users, { view_model: kb.ViewModel })
//};

//ko.applyBindings(view_model, $('#contacts-table')[0]);


})(jQuery);
