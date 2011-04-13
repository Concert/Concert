/**
 *  @file       EventsPanel.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  Panel that shows events on the organize page.
 *  @extends    Panel
 **/
var EventsPanel = Panel.extend({
    initialize: function() {
        Panel.prototype.initialize.call(this);

        var params = this.options;
        
        

        _.bindAll(this, "render");
    },

    /**
     *  Here we will render the list of events.  An argument is needed, the set of
     *  event models.
     *
     *  @param  {EventSet}    eventModels    The models to render
     **/
    render: function(eventModels) {
        Panel.prototype.render.call(this);
        
        console.log('eventModels.length:');
        console.log(eventModels.length);
        
        /* For each event model */
        eventModels.each(function(eventModel) {
            console.log('eventModel.toJSON():');
            console.log(eventModel.toJSON());
        });
        
        return this;
    }
});
