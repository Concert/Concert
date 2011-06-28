/**
 *  @file       ListPanel.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *
 *	@class      Displays listing on right of UI
 *  @extends    Panel
 **/
var ListPanel = Panel.extend(
	/**
	 *	@scope	ListPanel.prototype
	 **/
{
    _initialize_elements: function() {
        Panel.prototype._initialize_elements.call(this);
        
        var params = this.options;
        
        
        var fileWidgetTemplate = $('#file_widget_template');
        if(typeof(fileWidgetTemplate) == 'undefined') {
            throw new Error('$(\'#file_widget_template\') is undefined');
        }
        else if(fileWidgetTemplate.length == 0) {
            throw new Error('fileWidgetTemplate not found');
        }
        /**
         *  The template for each file in the list (when in audio mode)
         **/
        this.fileWidgetTemplate = fileWidgetTemplate;
        
        
        var segmentWidgetTemplate = $('#segment_widget_template');
        if(typeof(segmentWidgetTemplate) == 'undefined') {
            throw new Error('$(\'#segment_widget_template\') is undefined');
        }
        else if(segmentWidgetTemplate.length == 0) {
            throw new Error('segmentWidgetTemplate not found');
        }
        /**
         *  The template for each segment in the list (when in audio mode)
         **/
        this.segmentWidgetTemplate = segmentWidgetTemplate;

        var collectionWidgetTemplate = $('#collection_widget_template');
        if(typeof(collectionWidgetTemplate) == 'undefined') {
            throw new Error('$(\'#collection_widget_template\') is undefined');
        }
        else if(collectionWidgetTemplate.length == 0) {
            throw new Error('collectionWidgetTemplate not found');
        }
        /**
         *  The template for each collection in the list (when in collections mode)
         **/
        this.collectionWidgetTemplate = collectionWidgetTemplate;

        var searchBox = new ListPanelSearchAutocompleteListInputComponent({
            el: $('#list_panel_search_container'), 
            inputElement: $('input#list_panel_search'), 
            panel: this
        });
        /**
         *  The search box above the list panel.
         **/
        this.searchBox = searchBox;


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
        
        /**
         *  What is currently rendered?
         **/
        this.currentlyRendered = null;
        
        /**
         *  List of collection widgets.  Indexed by the ID of the collection
         **/
        this.collectionWidgets = {};
    }, 
    
    /**
     *  De-select the currently selected widget
     **/
    _deselect_currently_selected_widget: function() {
        /* If a widget is currently selected, deselect it */
        var selectedWidget = this.selectedWidget;
        if(selectedWidget) {
            selectedWidget.deselect();
        }
    }, 
    
    /**
     *  Called when we're looking at a collection's audio assets
     *
     *  @param  {Number}    collectionId    -   The id of the current collection
     *  @param  {Collection}    collection    - The collection
     **/
    render_collection_audio: function(collectionId, collection) {
        this._deselect_currently_selected_widget();
        
        /* temporary frag for dom additions */
        var frag = document.createDocumentFragment();
        
        /* Empty our list of segment and file widgets */
        var fileWidgets = {};
        var segmentWidgets = {};
        
        /* Put each file in list */
        collection.get('files').each(function(fileWidgetTemplate, panel, frag, fileWidgets) {
            return function(obj) {
                /* Create a file widget */
                var widget = new FileWidget({
                    template: fileWidgetTemplate, 
                    model: obj, 
                    panel: panel
                });
                
                fileWidgets[obj.get('id')] = widget;
                
                frag.appendChild(widget.el);
            };
        }(this.fileWidgetTemplate, this, frag, fileWidgets));
        
        
        /* Put each segment in list */
        collection.get('segments').each(function(segmentWidgetTemplate, panel, frag, segmentWidgets) {
            return function(obj) {
                /* Create segment widget */
                var widget = new SegmentWidget({
                    template: segmentWidgetTemplate,
                    model: obj,
                    panel: panel 
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
        
        /* Save some state */
        this.currentlyRendered = 'collection_audio';
        this.selectedWidget = null;
    }, 
    
    /**
     *  Render method called when we're looking at a single audio file.
     **/
    render_collection_audio_file: function(collectionId, fileId, collection, audioFile) {
        /* Ensure that the list of audio is rendered */
        this.render_collection_audio(collectionId, collection);
        
        /* Ensure that proper audio is selected in list */
        selectedWidget = this.fileWidgets[fileId];
        selectedWidget.select();
        
        this.selectedWidget = selectedWidget;
    }, 
    
    /**
     *  When we are viewing an audio segment from a collection
     **/
    render_collection_audio_segment: function(collectionId, fileId, segmentId, collection, audioFile, audioSegment) {
        /* Ensure that the list of audio is rendered */
        this.render_collection_audio(collectionId, collection);
        
        /* Ensure that segment is selected in list */
        selectedWidget = this.segmentWidgets[segmentId];
        selectedWidget.select();
        
        this.selectedWidget = selectedWidget;
    }, 
    
    /**
     *  Render method called when on "collections" route to list collections.
     **/
    render_collections: function(collections) {
        this._deselect_currently_selected_widget();
        
        /* If we've already rendered the list of collections, no need to do it
        again */
        if(this.currentlyRendered == 'collections') {
            return;
        }
        
        
        var panel = this;
        var frag = document.createDocumentFragment();
        var template = this.collectionWidgetTemplate;
        var collectionWidgets = [];
        /* For each collection */
        collections.each(function(collection) {
            /* Create collection widget */
            var widget = new CollectionWidget({
                panel: panel, 
                model: collection,
                template: template 
            });
            
            frag.appendChild(widget.render().el);
            
            collectionWidgets[collection.get('id')] = widget;
        });
        
        this.contents.html(frag);
        
        this.currentlyRendered = 'collections';
        this.collectionWidgets = collectionWidgets;
    }, 
    
    /**
     *  Render method called when a single collection is selected.  Will ensure that
     *  list of collections is shown, and that proper one is selected.
     **/
    render_collection: function(collectionId, collection) {
        /* Ensure that list of collections is rendered, this will also deselect
        currently selected widget */
        this.render_collections();
        
        /* Select proper collection */
        selectedWidget = this.collectionWidgets[collectionId];
        selectedWidget.select();
        
        this.selectedWidget = selectedWidget;
    } 
});