/**
 * Contacts management code
 */

var ContactPageableList = DjangoRestPageableCollection.extend({
    model: restAPI.Contact,
    url: '/api/contacts',
    state: {
        pageSize: 10
    }
});
var contacts = new ContactPageableList();

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

var ContactViewModel = function(model) {
    this.model = model;
    this.id = kb.observable(this.model, 'id');
    this.last_name = kb.observable(this.model, 'last_name').extend({validatable: true});
    this.first_name = kb.observable(this.model, 'first_name').extend({validatable: true});
    this.create_time = kb.observable(this.model, 'create_time');
    this.modify_time = kb.observable(this.model, 'modify_time');
    this.creator_name = kb.observable(this.model, 'creator_name');
    this.modifier_name = kb.observable(this.model, 'modifier_name');
    this.emails = kb.observable(this.model, 'emails').extend({validatable: true});

    this.title = ko.computed(function() {
        if (this.model.isNew()) {
            return "New contact";
        } else {
            return "Edit contact";
        }
    }, this);

    this.saveAndReturn = function () {
        this.model.save(null, {
            success: function(model, response) {
                contacts.add(model);
                Backbone.history.navigate('contacts', true);
            }
        });
    };

    this.saveAndShow = function () {
        this.model.save(null, {
            success: function(model, response) {
                contacts.add(model);
                Backbone.history.navigate('contacts/show/' + model.id, true);
            }
        });
    };

    this.edit = function() {
        Backbone.history.navigate("#/contacts/edit/" + model.get('id'), true);
    };
};

var showContactDetails = function(id, templateName) {
    var model = new restAPI.Contact({id: id});
    model.fetch({
        success: function(model, response, options) {
            var viewModel = routeValidation(new ContactViewModel(model));
            page_navigator.loadPage(kb.renderTemplate(templateName, viewModel));
        }
    });
};
var showContactEditor = function(id) {
    showContactDetails(id, 'edit-contact-template');
};
var showContactViewer = function(id) {
    showContactDetails(id, 'show-contact-template');
};

var showNewContactEditor = function() {
    var model = new restAPI.Contact();

    var viewModel = routeValidation(new ContactViewModel(model));
    page_navigator.loadPage(kb.renderTemplate('edit-contact-template', viewModel));
};

(function ($) {
    var contactsDiv = $("#contacts-table");
    contactsDiv.append(grid.render().el);
    contactsDiv.after(paginator.render().el);
    contactsDiv.before(filter.render().el);
    $(filter.el).css({float: "right", margin: "20px"});

    contacts.fetch({reset: true});

})(jQuery);
