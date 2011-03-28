/**
 *  @file       FileWidget.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  This is a widget that is found in the Audio list panel (when it is on file mode)
 *  it contains the functionality associated with an audio file on the organize
 *  page.
 *  @class
 *  @extends    AudioListWidget
 **/
var FileWidget = AudioListWidget.extend(
	/**
	 *	@scope	FileWidget.prototype
	 **/
{
    initialize: function() {
        AudioListWidget.prototype.initialize.call(this);

        var params = this.options;        
        
        _.bindAll(this, "render");
        this.render();
    },
    /**
     *  This is called when this file was selected in the list.
     **/
    _handle_title_click: function() {
        AudioListWidget.prototype._handle_title_click.call(this);
        
        this.panel.page.select_audio({files: [this.model]});
    }, 
    
    /**
     *  When this widget's delete button is clicked.
     **/    
    _handle_delete_click: function() {
        AudioListWidget.prototype._handle_delete_click.call(this);
        
        this.panel.page.delete_audio_file(this.model);
    }, 
});

