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
        
        this.model.get('tags').bind('add', this.render);
        this.model.get('tags').bind('remove', this.render);
        
        
        this.render();
    }, 
    
    render: function() {
        AudioListWidget.prototype.render.call(this);
        
        this.model.get('tags').each(function(widget) {
            return function(tag) {
                tag.bind('change', widget.render);
            };
        }(this));
        
        return this;
    }, 
    /**
     *  When this widget's delete button is clicked.
     **/    
    _handle_delete_click: function() {
        AudioListWidget.prototype._handle_delete_click.call(this);
        
        this.panel.page.delete_audio_segment(this.model);
    }, 
});