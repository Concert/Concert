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
        

        _.bindAll(this, 'update_time');
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
});
