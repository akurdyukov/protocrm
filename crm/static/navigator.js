/**
 * Navigator and state code
 */
var page_navigator = new kb.PageNavigatorPanes($('#page-wrapper')[0], {no_remove: true});

var router = new Backbone.Router();

router.route('', null, page_navigator.dispatcher(function(){ page_navigator.loadPage($('#dashboard-pane')[0]); }));
router.route('contacts', null, page_navigator.dispatcher(function(){ page_navigator.loadPage($('#contacts-pane')[0]); }));
router.route('contacts/new', null, page_navigator.dispatcher(function(){
    showNewContactEditor();
}));
router.route('contacts/show/:id', null, page_navigator.dispatcher(function(id){
    showContactViewer(id);
}));
router.route('contacts/edit/:id', null, page_navigator.dispatcher(function(id){
    showContactEditor(id);
}));
router.route('users', null, page_navigator.dispatcher(function(){ page_navigator.loadPage($('#users-pane')[0]); }));

Backbone.history.start();

// handle all links thru router
$(document).on("click", "a[navigate='true']", function(evt) {
  var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
  var root = location.protocol + "//" + location.host;

  if (href.prop && href.prop.slice(0, root.length) === root) {
    evt.preventDefault();
    Backbone.history.navigate(href.attr, true);
  }
});
$(document).on("click", "button.navigate", function(evt) {
    evt.preventDefault();
    Backbone.history.navigate($(this).attr("value"), true);
});