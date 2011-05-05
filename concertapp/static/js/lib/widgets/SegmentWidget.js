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
        
        /**
         *  All our tag widgets.  Indexed by Tag.id.
         **/
        this.tagWidgets = {};
        
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
        
        /* And when list of tags changes */
        _.bindAll(this, '_render_and_add_tag');
        model.get('tags').bind('add', this._render_and_add_tag);
        _.bindAll(this, '_remove_tag');
        model.get('tags').bind('remove', this._remove_tag);
        
        
        this.render();
    }, 
    
    /**
     *  Called from render methods when a tag widget is to be created.
     *
     *  @param  {Tag}    tag    The tag model to use for this widget.
     **/
    _create_tag_widget: function(tag) {
        return new TagWidget({
            panel: this.panel, 
            model: tag 
        });
    },

    render: function() {
        ListWidget.prototype.render.call(this);
        
        var tagContainerElement = $(this.el).find('.bottom');

        var frag = document.createDocumentFragment();
        
        var tagWidgets = {};
        var segmentWidget = this;
        /* For each tag */
        this.model.get('tags').each(function(tag) {
            /* Create tag widget */
            var widget = segmentWidget._create_tag_widget(tag);
            frag.appendChild(widget.render().el);
            
            /* Save tag widget */
            tagWidgets[tag.get('id')] = widget;
        });
        
        tagContainerElement.html(frag);
        
        this.tagWidgets = tagWidgets;
        
        return this;
    }, 
    
    /**
     *  When a new tag is added to this audio segment.
     *
     *  @param  {Tag}    tag    The tag that was added.
     **/
    _render_and_add_tag: function(tag) {
        /* Create a widget for this tag */
        var widget = this._create_tag_widget(tag);
        
        /* Add to tag container */
        $(this.el).find('.bottom').append(widget.render().el);
        
        /* Save widget */
        this.tagWidgets[tag.get('id')] = widget;
    }, 
    
    /**
     *  When this widget's delete button is clicked.
     **/    
    _handle_delete_click: function() {
        ListWidget.prototype._handle_delete_click.call(this);
        
        this.panel.page.delete_audio_segment(this.model);
    }, 
});