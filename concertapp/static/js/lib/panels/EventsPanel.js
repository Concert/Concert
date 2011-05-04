/**
 *  @file       EventsPanel.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  Panel that shows events on the organize page.
 *  @extends    Panel
 **/
var EventsPanel = Panel.extend({
    _initialize_elements: function() {
        Panel.prototype._initialize_elements.call(this);

        var params = this.options;
        
        var $ = jQuery;
        
        /**
         *  Which widget class do we use for which event type.
         **/
        this.eventTypesToWidgetMap = {
            1: AudioSegmentCreatedEventWidget,
            2: AudioSegmentTaggedEventWidget,
            3: AudioFileUploadedEventWidget,
            4: JoinCollectionEventWidget,
            5: LeaveCollectionEventWidget,
            6: CreateCollectionEventWidget,
            7: RequestJoinCollectionEventWidget,
            8: RequestDeniedEventWidget,
            9: RequestRevokedEventWidget
        }
        
        /**
         *  Which template we will use for each event type.
         **/
        this.eventTypesToTemplateMap = {
            1: $('#audiosegmentcreatedevent_template'),
            2: $('#audiosegmenttaggedevent_template'),
            3: $('#audiofileuploadedevent_template'),
            4: $('#joincollectionevent_template'),
            5: $('#leavecollectionevent_template'),
            6: $('#createcollectionevent_template'),
            7: $('#requestjoincollectionevent_template'),
            8: $('#requestdeniedevent_template'),
            9: $('#requestrevokedevent_template')
        }
        
        
    },
    
    /**
     *  When we are viewing collections.
     **/
    render_collections: function(collections) {
        var allCollectionEvents = new EventSet;
        
        /* For each collection, aggregate together the events */
        collections.each(function(collection) {
            allCollectionEvents.add(collection.get('events').models);
        });
        
        /* Render this giant list of events */
        this._render_events(allCollectionEvents);
    },
    
    /**
     *  When we're viewing a single collection, show all of the events for that
     *  collection.
     **/
    render_collection: function(collectionId, collection) {
        /* Render the events for this collection */
        this._render_events(collection.get('events'));
        
    }, 
    
    /**
     *  When we are viewing the list of audio for a collection, same as 
     *  viewing a collection.
     **/
    render_collection_audio: function(collectionId, collection) {
        return this.render_collection(collectionId, collection);
    }, 
    
    /**
     *  When we are viewing an audio file from a collection
     **/
    render_collection_audio_file: function(collectionId, fileId, collection, audioFile) {
        /* render the audio file's events */
        this._render_events(audioFile.get('events'));
    }, 
    
    /**
     *  When we are viewing an audio segment from a collection
     **/
    render_collection_audio_segment: function(collectionId, fileId, segmentId, collection, audioFile, audioSegment) {
        /* render segment's events */
        this._render_events(audioSegment.get('events'));
    }, 
    
    /**
     *  Render method used when nothing is selected, or there are no events
     *  to show.
     **/
    _render_nothing: function() {
        
    }, 
    
    
    /**
     *  Here we will render the list of events.  An argument is needed, the set of
     *  event models.
     *
     *  @param  {EventSet}    eventModels    The models to render
     **/
    _render_events: function(eventModels) {
        Panel.prototype.render.call(this);
        
        var panel = this;
        var eventTypesToWidgetMap = this.eventTypesToWidgetMap;
        var eventTypesToTemplateMap = this.eventTypesToTemplateMap;
        var frag = document.createDocumentFragment();
        /* For each event model */
        eventModels.each(function(eventModel) {
            var eventType = eventModel.get('eventType');
            /* Proper widget for this event */
            var widgetClass = eventTypesToWidgetMap[eventType];
            var widgetTemplate = eventTypesToTemplateMap[eventType];
            
            /* Create widget */
            var widget = new widgetClass({
                panel: panel, 
                model: eventModel,
                template: widgetTemplate 
            });
            
            frag.appendChild(widget.render().el);
            
            
        });
        
        this.contents.html(frag);
        
        return this;
    }
});
