/**
 *  @file       EventWidget.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  A base class for all event widgets.
 *  @extends    Widget
 **/
var EventWidget = Widget.extend(
    /**
     *  @scope  EventWidget.prototype
     **/
{
    initialize: function() {
        Widget.prototype.initialize.call(this);

        var params = this.options;
        
        /**
         *  The container that will hold the time that this event occurred.
         **/
        this.timeContainerElement = null;
        
        /**
         *  The interval that will run repeatedly to update the time of this
         *  event.
         **/
        this.timeUpdateInterval = null;
        
        var currentRoute = params.currentRoute;
        if(typeof(currentRoute) == 'undefined') {
            throw new Error('params.currentRoute is undefined');
        }
        /**
         *  The route we are currently on
         **/
        this.currentRoute = currentRoute;

        _.bindAll(this, 'update_time');
        
        /* If the event model exists */
        var model = this.model;
        if(model) {
            /* And has a collection attribute (they all should) */
            var collection = model.get('collection');
            if(collection) {
                /* Re-render when the collection changes as well */
                collection.bind('change', this.render);
            }
            
            /* If we have a user attribute, bind to user changes */
            var user = model.get('user');
            if(user) {
                user.bind('change', this.render);
            }
            
            var audioSegment = model.get('audioSegment');
            if(audioSegment){
                audioSegment.bind('change', this.render);
            }
            
            var audioFile = model.get('audioFile');
            if(audioFile) {
                audioFile.bind('change', this.render);
            }
            
            var tag = model.get('tag');
            if(tag) {
                tag.bind('change', this.render);
            }
        }
    },

    render: function() {
        Widget.prototype.render.call(this);
        
        /* save timeContainerElement because it was just rendered */
        this.timeContainerElement = $(this.el).find('.time');
        
        /* If the time is not being updated yet */
        if(!this.timeUpdateInterval) {
            this.timeUpdateInterval = setInterval(this.update_time, 5000);
        }
        /* Update time now */
        this.update_time();
        
        return this;
    },
    
    /**
     *  Called from timeout set in render method, will update time to look nice.
     **/
    update_time: function() {
        var formattedTime = pretty_date(this.model.get('time'));
        
        this.timeContainerElement.html(formattedTime);
    }, 
    
    /**
     *  Send along current route info to the template so it can render proper
     *  context data.
     **/
    _extra_template_data: function() {
        var parentData = Widget.prototype._extra_template_data.call(this);
        
        return _.extend(parentData, {
            currentRoute: this.currentRoute
        });
    }, 
});
