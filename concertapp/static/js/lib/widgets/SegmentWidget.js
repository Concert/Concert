/**
 *  @file       SegmentWidget.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  This is the widget associated with an audio segment on the organize page.
 *	@class
 *  @extends    AudioListWidget
 **/
var SegmentWidget = AudioListWidget.extend({
    initialize: function() {
        AudioListWidget.prototype.initialize.call(this);
        
        var params = this.options;        
        
        _.bindAll(this, "render");
        this.render();
    }, 
    events: {
        'click': 'select_segment', 
    }, 
    /**
     *  Called when the segment is selected in the list
     **/
    select_segment: function() {
        this.panel.page.select_audio({segments: [this.model]});
    }, 
});