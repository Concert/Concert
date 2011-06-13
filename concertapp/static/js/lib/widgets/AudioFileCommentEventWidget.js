/**
 *  @file       AudioFileCommentEventWidget.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  Widget for displaying a comment on an AudioFile in the events listing.
 *  @extends    EventWidget
 **/
var AudioFileCommentEventWidget = EventWidget.extend(
    /**
     *  @scope  AudioFileCommentEventWidget.prototype
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
