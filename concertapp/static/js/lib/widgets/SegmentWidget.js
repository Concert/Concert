/**
 *  @file       SegmentWidget.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  This is the widget associated with an audio segment on the organize page.
 *	@class
 *  @extends    ListWidget
 **/
var SegmentWidget = ListWidget.extend(
	/**
	 *	@scope	SegmentWidget.prototype
	 **/
{
    initialize: function() {
        ListWidget.prototype.initialize.call(this);
        
        var params = this.options;
        
        var model = this.model;
        
        this.clickUrl = '#collection/'
            +model.get('collection').get('id')
            +'/audio/file/'
            +model.get('audioFile').get('id')
            +'/segment/'
            +model.get('id');
        
        /* Re-render when parent audio file changes as well */
        var audioFile = model.get('audioFile');
        if(audioFile) {
            audioFile.bind('change', this.render);
        }
        
        this.render();
    }, 
    
    render: function() {
        ListWidget.prototype.render.call(this);
        
        var tagContainerElement = $(this.el).find('.bottom');
        var panel = this.panel;
        var frag = document.createDocumentFragment();
        
        /* For each tag */
        this.model.get('tags').each(function(tag) {
            /* Create tag widget */
            var widget = new TagWidget({
                panel: panel, 
                model: tag 
            });
            
            frag.appendChild(widget.render().el);
        });
        
        tagContainerElement.html(frag);
        
        return this;
    }, 
    /**
     *  When this widget's delete button is clicked.
     **/    
    _handle_delete_click: function() {
        ListWidget.prototype._handle_delete_click.call(this);
        
        this.panel.page.delete_audio_segment(this.model);
    }, 
});