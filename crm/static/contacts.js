(function($){

/**
 * Contacts only related code
 */

var users = new restAPI.UserList();

users.fetch();

var view_model = {
  users: kb.collectionObservable(users, { view_model: kb.ViewModel })
};

ko.applyBindings(view_model, $('#users-table')[0]);


})(jQuery);
