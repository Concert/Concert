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
    }, 
    
    /**
     *  Called when we are in the audio mode, and the render method is called.
     **/
    render_audio: function() {
        
        /* If we're not in audio mode, exit */
        var currentRoute = this.page.currentRoute;
        if(currentRoute != 'file' || currentRoute != 'segment') {
            return;
        }
        
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
    
    /**
     *  Render method called when on "collections" route to list collections.
     **/
    render_collections: function() {
        /* If we're not in collection mode, exit */
        if(this.page.currentRoute != 'collections') {
            return;
        }
        
        /* We'll be loading from our user's list of collections */
        var collections = this.page.modelManager.user.get('memberCollections');
        
        var panel = this;
        var frag = document.createDocumentFragment();
        var template = this.collectionWidgetTemplate;
        /* For each collection */
        collections.each(function(collection) {
            /* Create collection widget */
            var widget = new CollectionWidget({
                panel: panel, 
                model: collection,
                template: template 
            });
            
            frag.appendChild(widget.render().el);
        });
        
        this.contents.html(frag);
    }, 
});