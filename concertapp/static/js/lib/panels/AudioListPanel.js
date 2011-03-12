/**
 *  @file       AudioListPanel.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  Displays the segments and files within the audio organize page.
 *	@class
 *  @extends    Panel
 **/
var AudioListPanel = Panel.extend({
    initialize: function() {
        Panel.prototype.initialize.call(this);
        
        var params = this.options;
        
        /**
         *  The set of files we're watching for this panel
         **/
        var files = params.files;
        if(typeof(files) == 'undefined') {
            throw new Error('params.files is undefined');
        }
        this.files = files;

        /**
         *  The set of segments we're watching for this panel
         **/
        var segments = params.segments;
        if(typeof(segments) == 'undefined') {
            throw new Error('params.segments is undefined');
        }
        this.segments = segments;

        
        /**
         *  The template for each file in the list
         **/
        var fileWidgetTemplate = $('#file_widget_template');
        if(typeof(fileWidgetTemplate) == 'undefined') {
            throw new Error('$(\'#file_widget_template\') is undefined');
        }
        else if(fileWidgetTemplate.length == 0) {
            throw new Error('fileWidgetTemplate not found');
        }
        this.fileWidgetTemplate = fileWidgetTemplate;
        
        
        /**
         *  The template for each segment in the list
         **/
        var segmentWidgetTemplate = $('#segment_widget_template');
        if(typeof(segmentWidgetTemplate) == 'undefined') {
            throw new Error('$(\'#segment_widget_template\') is undefined');
        }
        else if(segmentWidgetTemplate.length == 0) {
            throw new Error('segmentWidgetTemplate not found');
        }
        this.segmentWidgetTemplate = segmentWidgetTemplate;

        
        /**
         *  If a segment/file has been selected, the model manager will throw
         *  events.
         **/
        var modelManager = params.modelManager;
        if(typeof(modelManager) == 'undefined') {
            throw new Error('params.modelManager is undefined');
        }
        /* But we don't need to keep the model manager in memory
        this.modelManager = modelManager;*/
        
        /* The widget that represents the currently selected audio file/segment */
        this.selectedWidget = null;
        
        /* The list of our file widgets, indexed by ID of file object */
        this.fileWidgets = {};
        
        /* The list of segment widgets, indexed by ID of segment object */
        this.segmentWidgets = {};
        
        
        _.bindAll(this, "render");
        segments.bind('refresh', this.render);
        segments.bind('add', this.render);
        segments.bind('remove', this.render);
        files.bind('refresh', this.render);
        files.bind('add', this.render);
        files.bind('remove', this.render);
        
        
        /* If an audio file was selected */
        _.bindAll(this, 'select_audio_file');
        $(modelManager).bind('audio_file_selected', this.select_audio_file);

        /* If an audio segment was selected */
        _.bindAll(this, 'select_audio_segment');
        $(modelManager).bind('audio_segment_selected', this.select_audio_segment);
        
    }, 
    
    /**
     *  When a file is selected.
     *
     *  @param  {AudioFile}    selectedAudioFile    -   The file that was selected.
     **/
    select_audio_file: function(e, selectedAudioFile) {
        /* Un-select previously selected widget */
        var selectedWidget = this.selectedWidget;
        if(selectedWidget) {
            selectedWidget.de_select();
        }
        
        
        /* Make corresponding widget selected */
        var newSelectedWidget = this.fileWidgets[selectedAudioFile.get('id')];
        newSelectedWidget.select();
        this.selectedWidget = newSelectedWidget;
    }, 
    
    /**
     *  When a segment is selected.
     *
     *  @param  {AudioSegment}    selectedAudioSegment    - The segment that was 
     *  selected.
     **/
    select_audio_segment: function(e, selectedAudioSegment) {
        /* Un-select previously selected widget */
        var selectedWidget = this.selectedWidget;
        if(selectedWidget) {
            selectedWidget.de_select();
        }
        
        
        /* Make corresponding widget selected */
        var newSelectedWidget = this.segmentWidgets[selectedAudioSegment.get('id')];
        newSelectedWidget.select();
        this.selectedWidget = newSelectedWidget;        
    }, 
    /**
     *  Called when segments or file list is changed.
     **/
    render: function() {
        
        /* temporary frag for dom additions */
        var frag = document.createDocumentFragment();
        
        /* Empty our list of segment and file widgets */
        var fileWidgets = {};
        var segmentWidgets = {};
        
        /* Put each file in list */
        this.files.each(function(fileWidgetTemplate, panel, frag, fileWidgets) {
            return function(obj) {
                /* Create a file widget */
                var widget = new FileWidget({
                    template: fileWidgetTemplate, 
                    model: obj, 
                    panel: panel,
                });
                
                fileWidgets[obj.get('id')] = widget;
                
                frag.appendChild(widget.el);
            };
        }(this.fileWidgetTemplate, this, frag, fileWidgets));
        
        
        /* Put each segment in list */
        this.segments.each(function(segmentWidgetTemplate, panel, frag, segmentWidgets) {
            return function(obj) {
                /* Create segment widget */
                var widget = new SegmentWidget({
                    template: segmentWidgetTemplate,
                    model: obj,
                    panel: panel, 
                });
                
                segmentWidgets[obj.get('id')] = widget;
                
                frag.appendChild(widget.el);
            };
        }(this.segmentWidgetTemplate, this, frag, segmentWidgets));
                
        /* update panel */
        this.contents.html(frag);
        
        /* Save list of file/segment widgets */
        this.segmentWidgets = segmentWidgets;
        this.fileWidgets = fileWidgets;
    }, 
});