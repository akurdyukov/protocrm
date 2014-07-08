/**
 * Notifications related code
 */
var originalSync = Backbone.sync;
var notifyingSync = function (method, model, options) {
    // call original Backbone.sync
    var promise = originalSync(method, model, options);
    promise.done(function () {
        // if method is 'update' or 'create', log success
        $.bootstrapGrowl(model.modelName + " saved successfully!", {
            type: 'success'
        })
    });
    promise.fail(function () {
        // if method is 'update' or 'create', log failure
        $.bootstrapGrowl("Error saving " + model.modelName, {
            type: 'danger',
            delay: 0
        });
    });
    return promise;
};
Backbone.sync = notifyingSync;