/**
*  Override of Backbone.sync so we can handle related fields better.
**/

// Map from CRUD to HTTP for our default `Backbone.sync` implementation.
var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read'  : 'GET'
};

// Helper function to get a URL from a Model or Collection as a property
// or as a function.
var getUrl = function(object) {
  if (!(object && object.url)) return null;
  return _.isFunction(object.url) ? object.url() : object.url;
};

/**
 *  We're overriding Backbone.sync so we can do ghetto REST stuff.
 **/
Backbone.sync = function(method, model, options) {
    var type = methodMap[method];
    
    // Default JSON-request options.
    var params = _.extend({
        type:         type,
        contentType:  'application/json',
        dataType:     'json',
        processData:  false
    }, options);

    // Ensure that we have a URL.
    if (!params.url) {
        params.url = getUrl(model) || urlError();
    }
    

    // Ensure that we have the appropriate request data.
    if (!params.data && model && (method == 'create' || method == 'update')) {
        var data = model.toJSON();
        
        /* Get the relations for this model */
        var relations = model.getRelations();
        
        /* For each relation */
        _.each(relations, function(relation) {
            /* Get the key for this relation so we can modify our model */
            var relationKey = relation.key;
            
            /* If this relation is a single instance */
            if(relation instanceof Backbone.HasOne) {
                /* We will just send along the url of the related instance for 
                tastypie */
                var related = relation.related;
                if(related) {
                    data[relationKey] = related.url();
                }
            }
            else if(relation instanceof Backbone.HasMany) {
                /* We will send an array of urls of all related instances */
                var relatedInstances = relation.related;
                data[relationKey] = [];
                relatedInstances.each(function(relatedInstance) {
                    data[relationKey].push(relatedInstance.url());
                });
            }
        });
        
        params.data = JSON.stringify(data);
    }

    // Make the request.
    $.ajax(params);
};

/**
 *  Helps to display error to user.
 **/
com.concertsoundorganizer.helpers.wrapError = function(options) {
    if(options){
        /* Get error messsage provided from caller */
        var error_message = options.error_message;        
    }
    else {
        options = {};
    }

    if(typeof(error_message) == 'undefined') {
        var error_message = 'An error has occurred';
    }

    /* Wrap error callback */
    options.error = function(error_message, callback) {
        return function(model, resp) {
            var responseText = resp.responseText;
            if(resp && responseText != '') {
                resp = JSON.parse(responseText);                 
            }
            else {
                resp = {};
            }

            if(resp.error_message) {
                error_message += ': '+resp.error_message;
            }
            else {
                error_message += '.';
            }

            /* display error to the user */
            com.concertsoundorganizer.notifier.alert({
                title: 'Error', 
                content: error_message
            });

            if(callback) {
                callback(model, resp);
            }
        }

    }(error_message, options.error_callback);

    return options;
};

/**
 *  Another error wrapper, this is a clone of the backbone one.
 **/
com.concertsoundorganizer.helpers.backboneWrapError = function(onError, model, options) {
   return function(resp) {
     if (onError) {
       onError(model, resp, options);
     } else {
       model.trigger('error', model, resp, options);
     }
   };
 };
