/**
 * Main application code
 */

var Application = function() {

};

(function($){
    var app = new Application();
    ko.applyBindings(app, $('#navigation')[0]);
})(jQuery);