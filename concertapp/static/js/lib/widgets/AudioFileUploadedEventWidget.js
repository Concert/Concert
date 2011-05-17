/**
 *  @file       AudioFileUploadedEventWidget.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  A widget to display an `AudioFileUploadedEvent`
 *  @extends    EventWidget
 **/
var AudioFileUploadedEventWidget = EventWidget.extend(
    /**
     *  @scope AudioFileUploadedEventWidget.prototype
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
