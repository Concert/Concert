/**
 *  @file       DetailWaveformPanelTagBay.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  The tag bay below the detail waveform.  Handles tagging of segments.
 *  @extends    Panel
 **/
var DetailWaveformPanelTagBay = Panel.extend(
    /**
     *  @scope  DetailWaveformPanelTagBay.prototype
     **/
{
    _initialize_elements: function() {
        Panel.prototype._initialize_elements.call(this);
        
        var params = this.options;
        
        var tagsContainerElement = $('#detail_waveform_panel_tags');
        if(typeof(tagsContainerElement) == 'undefined') {
            throw new Error('$(\'#detail_waveform_panel_tags\') is undefined');
        }
        else if(tagsContainerElement.length == 0) {
            throw new Error('tagsContainerElement not found');
        }
        /**
         *  Container for tags
         **/
        this.tagsContainerElement = tagsContainerElement;
                
        var tagInputElement = $('#detail_waveform_panel_tag_input');
        if(typeof(tagInputElement) == 'undefined') {
            throw new Error('$(\'#detail_waveform_panel_tag_input\') is undefined');
        }
        else if(tagInputElement.length == 0) {
            throw new Error('tagInputElement not found');
        }
        /**
         *  The input element for entering new tags.
         **/
        this.tagInputElement = tagInputElement;
        
        /**
         *  The component used to add new tags to the selected segment.
         **/
        this.tagInputComponent = new TagAutocompleteListInputComponent({
            inputElement: tagInputElement,
            panel: this 
        });
        
        
        
        /* If we are watching an audio segment's list of tags for changes */
        this.currentSegment = null;
        
        /* Scope for render_current_segment_tags method */
        _.bindAll(this, '_render_current_segment_tags');
    }, 
    
    /**
     *  Default render method, just hide tags and input field.  This is used on
     *  every route besides collection_audio_segment.
     **/
    render: function() {
        /* Clear bottom tags area */
        this.tagsContainerElement.empty();
        /* Hide tag input box (for now) */
        this.tagInputElement.hide();
        /* Nothing currently selected, stop watching list of tags if we're
        currently watching one. */
        this._stop_watching_segment_tags();
    }, 
    
    /**
     *  Called when we should stop watching a segment's list of tags for
     *  changes.
     **/
    _stop_watching_segment_tags: function() {
        var currentSegment = this.currentSegment;
        if(currentSegment) {
            var currentSegmentTags = currentSegment.get('tags');
            currentSegmentTags.unbind('add', this._render_current_segment_tags);
            currentSegmentTags.unbind('remove', this._render_current_segment_tags);
            currentSegmentTags.unbind('refresh', this._render_current_segment_tags);
            
            this.currentSegment = null;
        }
    }, 
    
    /**
     *  When audio segment has been selected.
     *
     *  @param  {AudioSegment}    selectedAudioSegment    - The selected segment.
     **/
    render_collection_audio_segment: function(collectionId, fileId, segmentId, selectedCollection, selectedAudioFile, selectedAudioSegment) {

        var currentSegment = this.currentSegment;

        /* If we are not watching this segment's tags for changes, lets start */
        if(currentSegment != selectedAudioSegment) {
            /* Stop watching current segment */
            this._stop_watching_segment_tags();
            
            /* Start watching new segment */
            currentSegment = selectedAudioSegment;
            var currentSegmentTags = currentSegment.get('tags');

            currentSegmentTags.bind('add', this._render_current_segment_tags);
            currentSegmentTags.bind('remove', this._render_current_segment_tags);
            currentSegmentTags.bind('refresh', this._render_current_segment_tags);

            this.currentSegment = currentSegment;
        }

        /* Render the current segment's tags now */
        this._render_current_segment_tags();
        
        
        
    }, 
    
    /**
     *  Renders the current tag list, also updates the autocomplete components list
     *  of tags.
     **/
    _render_current_segment_tags: function() {
        /* Show tag input element */
        this.tagInputElement.show();
        
        var currentSegment = this.currentSegment;

        var frag = document.createDocumentFragment();
        var panel = this;
        /* For each of this segment's tags */
        currentSegment.get('tags').each(function(tag) {
            /* Create a tag widget */
            var widget = new TagWidget({
                model: tag, 
                panel: panel 
            });
            
            /* Inject it into our fragment */
            frag.appendChild(widget.render().el);
        });
        
        /* Load tags in bottom */
        this.tagsContainerElement.html(frag);
        
        /* Get all tags in this collection */
        var collectionTags = currentSegment.get('collection').get('tags');
        /* And all tags for this segment */
        var segmentTags = currentSegment.get('tags');

        
        /* And now all tags for this collection that are not already on this segment */
        var possibleNewTags = new TagSet(collectionTags.without.apply(collectionTags, segmentTags.models));

        /* Set autocomplete components dataset to just the names of these tags */
        this.tagInputComponent.set_data(possibleNewTags.pluck('name'));
    } 
    
});

