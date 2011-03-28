/**
 *  @file       AudioListWidget.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  This is a widget that is found in the Audio list panel.  Subclassed by
 *  FileWidget and SegmentWidget.
 *  page.
 *  @class
 *  @extends    Widget
 **/
var AudioListWidget = Widget.extend(
	/**
	 *	@scope	AudioListWidget.prototype
	 **/
{
    
    initialize: function() {
        Widget.prototype.initialize.call(this);

        var params = this.options;        
    },
    render: function() {
        Widget.prototype.render.call(this);
        
        return this;
    },    
    events: {
        'click button.delete_audio_button': '_handle_delete_click', 
        'click span.audio_widget_title_text': '_handle_title_click', 
    }, 
    
    /**
     *  When this widget's title was clicked on.
     **/
    _handle_title_click: function() {
        
    }, 
    
    /**
     *  When this widget's delete button was clicked on.
     **/
    _handle_delete_click: function() {
        
    }, 
    
    /**
     *  When the file/segment that this widget represents is selected, we will 
     *  add a selected class.  Called from the panel.
     **/
    select: function() {
        var el = $(this.el);
        el.addClass('selected');
    }, 
    
    /**
     *  When another file/segment is selected, remove the selected class from this 
     *  segment.  Called from the panel.
     **/
    de_select: function() {
        var el = $(this.el);
        el.removeClass('selected');
    }, 
});

