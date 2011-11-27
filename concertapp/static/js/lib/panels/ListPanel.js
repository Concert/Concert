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

        this.breadcrumbs = $('#list_nav');
		
		var collection_link = $('#collection_link_template');
        this.collection_link_template = collection_link;
        var audiofile_link = $('#audiofile_link_template');
        this.audiofile_link_template = audiofile_link;
        var audiosegment_link = $('#audiosegment_link_template');
        this.audiosegment_link_template = audiosegment_link;
        
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

        /**
         *  A reference to the current collection model.
         **/
        this.collection = null;

        _.bindAll(this, '_handle_audio_added');
    }, 
    
    /**
     *  De-select the currently selected widget
     **/
    _deselect_currently_selected_widget: function() {
        /* If a widget is currently selected, deselect it */
        var selectedWidget = this.selectedWidget;
        if(selectedWidget) {
            selectedWidget.deselect();
            this.selectedWidget = null;
        }
    }, 

    /**
     *  Select a given widget.
     *
     *  @param    {FileWidget}    the widget to select.    
     **/
    _select_widget: function _select_widget(widget) {
        this._deselect_currently_selected_widget();
        this.selectedWidget = widget;
        widget.select();
    },

    /**
     *  Called when an `AudioSegment` or `AudioFile` model instance is added
     *  to the current collection.
     *
     *  @param    {AudioSegment|AudioFile}    audioModel    -   Instance that was
     *  added.
     **/
    _handle_audio_added: function (audioModel) {
        /* Grab the currently selected widget if there is one */
        var toSelect = this.selectedWidget;

        /* Re-render list, including new audio model */
        this.render_collection_audio(null, audioModel.get('collection'));

        if(toSelect) {
            this._select_widget(toSelect);
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

        this.breadcrumbs.html("<a href='#collections'>collections</a> : ");
		this.breadcrumbs.append(this.collection_link_template.tmpl(collection));

        /* temporary frag for dom additions */
        var frag = document.createDocumentFragment();
        
        /* Grab our list of segment and file widgets */
        var fileWidgets = this.fileWidgets;
        var segmentWidgets = this.segmentWidgets;

        /* Grab our templates for rendering file & segment widgets */
        var fileWidgetTemplate = this.fileWidgetTemplate;
        var segmentWidgetTemplate = this.segmentWidgetTemplate;

        /* And ourself of course */
        var panel = this;
        
        /* For each audio file & segment */
        collection.audio.each(function (audioModel) {
            /* We will be rendering a widget */
            var widget = null;

            /* If we have an audio file */
            if(audioModel instanceof AudioFile) {
                /* See if we've already got a widget instance */
                widget = fileWidgets[audioModel.get('id')];

                /* If not, we'll create one */
                if(!widget) {
                    /* Create a file widget */
                    widget = new FileWidget({
                        template: fileWidgetTemplate, 
                        model: audioModel, 
                        panel: panel
                    });
                    
                    fileWidgets[audioModel.get('id')] = widget;
                }
            }
            /* If we have an audio segment */
            else if(audioModel instanceof AudioSegment) {
                /* See if we've already got a widget instance */
                widget = segmentWidgets[audioModel.get('id')];

                /* if not, create one */
                if(!widget) {
                    /* Create segment widget */
                    widget = new SegmentWidget({
                        template: segmentWidgetTemplate,
                        model: audioModel,
                        panel: panel 
                    });
                    
                    segmentWidgets[audioModel.get('id')] = widget;                    
                }
                
            }
            else {
                throw new Error('audioModel was not an instance of AudioFile or AudioSegment');
            }

            frag.appendChild(widget.render().el);
        });
                
        /* Replace contents of panel with new audio segment/file widgets */
        this.contents.html(frag);
        
        /* Save lists of file/segment widgets */
        this.segmentWidgets = segmentWidgets;
        this.fileWidgets = fileWidgets;
        
        /* Save some state */
        this.currentlyRendered = 'collection_audio';
        this.selectedWidget = null;

        /* Bind to the collection's `audio` list for updates */
        if(this.collection) {
            this.collection.audio.unbind('add', this._handle_audio_added);
        }
        this.collection = collection;
        collection.audio.bind('add', this._handle_audio_added);
    }, 
    
    /**
     *  Render method called when we're looking at a single audio file.
     **/
    render_collection_audio_file: function(collectionId, fileId, collection, audioFile) {
        /* Ensure that the list of audio is rendered */
        this.render_collection_audio(collectionId, collection);

		this.breadcrumbs.html("<a href='#collections'>collections</a> : ");
		this.breadcrumbs.append(this.collection_link_template.tmpl(collection));
		this.breadcrumbs.append(" : ");
		this.breadcrumbs.append(this.audiofile_link_template.tmpl(audioFile));
		
		//console.log("collections, " + collection.get('name') + ", " + audioFile.get('name'));
        
        /* Ensure that proper audio is selected in list */
        var selectedWidget = this.fileWidgets[fileId];
        this._select_widget(selectedWidget);
    }, 
    
    /**
     *  When we are viewing an audio segment from a collection
     **/
    render_collection_audio_segment: function(collectionId, fileId, segmentId, collection, audioFile, audioSegment) {
        /* Ensure that the list of audio is rendered */
        this.render_collection_audio(collectionId, collection);

		this.breadcrumbs.html("<a href='#collections'>collections</a> : ");
		this.breadcrumbs.append(this.collection_link_template.tmpl(collection));
		this.breadcrumbs.append(" : ");
		this.breadcrumbs.append(this.audiofile_link_template.tmpl(audioFile));
		this.breadcrumbs.append(" : ");
		this.breadcrumbs.append(this.audiosegment_link_template.tmpl(audioSegment));
        
        /* Ensure that segment is selected in list */
        var selectedWidget = this.segmentWidgets[segmentId];
        this._select_widget(selectedWidget);
    }, 
    
    /**
     *  Render method called when on "collections" route to list collections.
     **/
    render_collections: function(collections) {
        this._deselect_currently_selected_widget();
        
		this.breadcrumbs.html("<a href='#collections'>collections</a>");
		
		/* If we've already rendered the list of collections, no need to do it 
		again */
		if(this.currentlyRendered == 'collections') {
			return;
		}

        var panel = this;
        var frag = document.createDocumentFragment();
        var template = this.collectionWidgetTemplate;
        var collectionWidgets = this.collectionWidgets;
        /* For each collection */
        collections.each(function(collection) {
            /*  see if we've already got a corresponding widget
                instance. */
            var widget = collectionWidgets[collection.get('id')];
            
            /* If not */
            if(!widget) {
                /* Create collection widget */
                var widget = new CollectionWidget({
                    panel: panel, 
                    model: collection,
                    template: template 
                });                
                collectionWidgets[collection.get('id')] = widget;
            }
            
            frag.appendChild(widget.render().el);
            
        });
        
        /* Add all collections to list */
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
        var selectedWidget = this.collectionWidgets[collectionId];
        this._select_widget(selectedWidget);
    } 
});