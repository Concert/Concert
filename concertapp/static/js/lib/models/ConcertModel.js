/**
*  @file       ConcertModel.js
*
*  @author     Colin Sullivan <colinsul [at] gmail.com>
**/

/**
*  @class  A base class for all models
*  @extends    Backbone.RelationalModel
**/
var ConcertModel = Backbone.RelationalModel.extend(
/**
*  @scope  ConcertModel.prototype
**/
{
    /**
    *  Display modal error to user when error occurs.
    **/
    save : function(attrs, options) {
        var wrapErrorHelper = com.concertsoundorganizer.helpers.wrapError;

        return Backbone.Model.prototype.save.call(this, attrs, wrapErrorHelper(options));
    },

    /**
    *  Wrap our error callback for destroy calls too.
    **/
    destroy: function(options) {
        var wrapErrorHelper = com.concertsoundorganizer.helpers.wrapError;

        return Backbone.Model.prototype.destroy.call(this, wrapErrorHelper(options));
    }, 

    /**
    *  Uses the 'static' name attribute of the model to create the url.  If the
    *  model has an id it is appended onto the url.
    *
    *  @param  {Boolean}    options.noBase    -    Return url without prefix
    **/
    url: function(options) {
        options || (options = {});

        var url = com.concertsoundorganizer.apiBaseURL;
        if(options.noBase) {
            url = '';
        }

        url += this.name+'/';
        var id = this.get('id');
        if(id) {
            return url+id+'/';
        }
        else {
            return url;
        }
    }
});

/**
 *  Base `ConcertCollection` class to make small things easier.
 **/
var ConcertCollection = Backbone.Collection.extend({
    url: function () {
        var url = com.concertsoundorganizer.apiBaseURL;
        url += this.name+'/';
        return url;
    },

    /**
     *  Override parse method to just use 'objects' array.
     **/
    parse : function(resp, xhr) {
        return resp['objects'];
    }
});
