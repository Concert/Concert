/**
 *  @file       CommentsPanel.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
var CommentsPanel = Panel.extend({
    initialize: function() {
        Panel.prototype.initialize.call(this);
        
        var params = this.options;
        
        var modelManager = params.modelManager;
        if(typeof(modelManager) == 'undefined') {
            throw new Error('params.modelManager is undefined');
        }
        /* Don't need to keep model manager reference around, just to bind events 
        this.modelManager = modelManager;*/
        
        /* The template for comment widgets */
        var commentTemplate = $('#comment_widget_template');
        if(typeof(commentTemplate) == 'undefined') {
            throw new Error('$(\'#comment_widget_template\') is undefined');
        }
        this.commentTemplate = commentTemplate;
        
        /* If an audio file was selected */
        _.bindAll(this, 'select_audio_file');
        $(modelManager).bind('audio_file_selected', this.select_audio_file);

        /* If an audio segment was selected */
        _.bindAll(this, 'select_audio_segment');
        $(modelManager).bind('audio_segment_selected', this.select_audio_segment);
        
    },
    
    /**
     *  When a segment is selected.
     *
     *  @param  {AudioSegment}    selectedAudioSegment    - The segment that was 
     *  selected.
     **/
    select_audio_segment: function(e, selectedAudioSegment) {
        
        /* display comments for this segment in contents */
        
        /* Fragment to hold all comments */
        var frag = document.createDocumentFragment();
        
        var template = this.commentTemplate;
        
        /* For each of this segment's comments */
        selectedAudioSegment.get('comments').each(function(frag, template, panel) {
            return function(obj) {
                /* Create comment widget */
                var widget = new CommentWidget({
                    model: obj,
                    template: template, 
                    panel: panel, 
                });
                
                /* put in document fragment */
                frag.appendChild(widget.render().el);
            };
        }(frag, template, this));
        
        this.contents.html(frag);
    }, 
    
    /**
     *  When a file is selected.
     *
     *  @param  {AudioFile}    selectedAudioFile    -   The file that was selected.
     **/
    select_audio_file: function(e, selectedAudioFile) {
        /* just clear for now */
        this.contents.empty();
    }, 
    
});