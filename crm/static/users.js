(function($){

/**
 * Contacts only related code
 */

var users = new restAPI.UserList();

var columns = [
    // TODO: autogen columns
    {
        name: "username",
        label: "UserName",
        cell: "string"
    },
    {
        name: "email",
        label: "Email",
        cell: "string"
    }
];

var grid = new Backgrid.Grid({
  columns: columns,
  collection: users
});

$("#users-table").append(grid.render().el);

users.fetch({reset: true});

//var view_model = {
//  users: kb.collectionObservable(users, { view_model: kb.ViewModel })
//};

//ko.applyBindings(view_model, $('#users-table')[0]);


})(jQuery);
