/**
 *  @file       FileWidget.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  This is a widget that is found in the Audio list panel (when it is on file mode)
 *  it contains the functionality associated with an audio file on the organize
 *  page.
 *  @class
 *  @extends    ListWidget
 **/
var FileWidget = ListWidget.extend(
	/**
	 *	@scope	FileWidget.prototype
	 **/
{
    initialize: function() {
        ListWidget.prototype.initialize.call(this);

        var params = this.options;   
        

        this.render();
    },
        
    /**
     *  When this widget's delete button is clicked.
     **/    
    _handle_delete_click: function() {
        ListWidget.prototype._handle_delete_click.call(this);
        
        this.panel.page.delete_audio_file(this.model);
    }, 
});

