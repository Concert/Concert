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
    /**
     *  The interval that will run repeatedly to update all event date/time
     *  displays.
     **/
    TIME_UPDATE_INTERVAL: null,


    /**
     *    Master list of all Event widget objects for time updating.
     **/
    ALL_EVENT_WIDGETS: [],


    /**
     *  The method that will be called by `TIME_UPDATE_INTERVAL` and will update
     *  the time fields on all event widgets.
     **/
    UPDATE_TIME_DISPLAYS: function() {
        _.each(EventWidget.prototype.ALL_EVENT_WIDGETS, function(widget) {
            widget.update_time();
        });
    },


    initialize: function() {
        Widget.prototype.initialize.call(this);

        var params = this.options;
        
        /**
         *  The container that will hold the time that this event occurred.
         **/
        this.timeContainerElement = null;
                
        var currentRoute = params.currentRoute;
        if(typeof(currentRoute) == 'undefined') {
            throw new Error('params.currentRoute is undefined');
        }
        /**
         *  The route we are currently on
         **/
        this.currentRoute = currentRoute;
        
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
        
        /* If we are the first event widget, the time interval will not be
        set yet */
        if(!EventWidget.prototype.TIME_UPDATE_INTERVAL) {
            /* Set the time update interval to update all time displays every 
            5 seconds */
            EventWidget.prototype.TIME_UPDATE_INTERVAL = setInterval(
                EventWidget.prototype.UPDATE_TIME_DISPLAYS, 5000
            );
        }

        /* make sure we're added to the master list so our time field gets
        updated */
        EventWidget.prototype.ALL_EVENT_WIDGETS.push(this);
        
        /* Update time now on this widget */
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
    getTemplateData: function() {
        var parentData = Widget.prototype.getTemplateData.call(this);
        
        return _.extend(parentData, {
            currentRoute: this.currentRoute, 
        });
    } 
});
