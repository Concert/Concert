/**
 *  @file       AudioSegmentCommentEventWidget.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  Widget for displaying a comment on an audio segment
 *  @extends    EventWidget
 **/
var AudioSegmentCommentEventWidget = EventWidget.extend(
    /**
     *  @scope  AudioSegmentCommentEventWidget.prototype
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

