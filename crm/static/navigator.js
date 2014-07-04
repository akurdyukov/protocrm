/**
 * Navigator and state code
 */
var page_navigator = new kb.PageNavigatorPanes($('#page-wrapper')[0], {no_remove: true});

var router = new Backbone.Router();

router.route('', null, page_navigator.dispatcher(function(){ page_navigator.loadPage($('#dashboard-pane')[0]); }));
router.route('contacts', null, page_navigator.dispatcher(function(){ page_navigator.loadPage($('#contacts-pane')[0]); }));
router.route('contacts/new', null, page_navigator.dispatcher(function(){ page_navigator.loadPage($('#new-contact-pane')[0]); }));
router.route('users', null, page_navigator.dispatcher(function(){ page_navigator.loadPage($('#users-pane')[0]); }));

//    router.route('', null, page_navigator.dispatcher(function(){
//        page_navigator.loadPage( kb.renderTemplate('page', new PageViewModel(pages.get('main'))) );
//    }));

Backbone.history.start();
