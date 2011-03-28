/**
 *  @file       SegmentWidget.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  This is the widget associated with an audio segment on the organize page.
 *	@class
 *  @extends    AudioListWidget
 **/
var SegmentWidget = AudioListWidget.extend(
	/**
	 *	@scope	SegmentWidget.prototype
	 **/
{
    initialize: function() {
        AudioListWidget.prototype.initialize.call(this);
        
        var params = this.options;        
        
        _.bindAll(this, "render");
        this.render();
    }, 
    /**
     *  Called when the segment is selected in the list
     **/
    _handle_title_click: function() {
        AudioListWidget.prototype._handle_title_click.call(this);

        /* Select audio segment */
        this.panel.page.select_audio({segments: [this.model]});
    },
    
    /**
     *  When this widget's delete button is clicked.
     **/    
    _handle_delete_click: function() {
        AudioListWidget.prototype._handle_delete_click.call(this);
        
        this.panel.page.delete_audio_segment(this.model);
    }, 
});