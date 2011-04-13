/**
 *  @file       AudioSegmentCreatedEventWidget.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  A widget displayed to represent an `AudioSegmentCreatedEvent`
 *  @extends    EventWidget
 **/
var AudioSegmentCreatedEventWidget = EventWidget.extend(
    /**
     *  @scope  AudioSegmentCreatedEventWidget.prototype
     **/
{
    initialize: function() {
        EventWidget.prototype.initialize.call(this);

        var params = this.options;
        
        

        _.bindAll(this, "render");
    },

    render: function() {
        EventWidget.prototype.render.call(this);
        
        return this;
    }
});
