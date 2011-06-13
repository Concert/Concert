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
            9: RequestRevokedEventWidget,
            /*10: TagCommentEventWidget, 
            11: AudioSegmentCommentEventWidget, */
            12: AudioFileCommentEventWidget
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
            9: $('#requestrevokedevent_template'),
            /*10: $('#tagcommentevent_template), 
            11: $("#audiosegmentcommentevent_template"), */
            12: $('#audiofilecommentevent_template')
        }
        
        /* The container for our comment form */
        this.commentContainerElement = $(this.el).children('.panel_header');
        /* The comment field */
        this.commentFieldElement = $('#comment_field');
        /* The comment button */
        this.commentButtonElement = $('#comment_button');
        
        /**
         *  The current EventSet we are watching for changes.
         **/
        var currentEventSet = null;
        
        _.bindAll(this, '_render_and_add_event');
        _.bindAll(this, '_handle_comment_field_focus');
        _.bindAll(this, '_handle_comment_field_blur');
        _.bindAll(this, '_handle_comment_field_keyup');
        _.bindAll(this, '_handle_comment_button_click');
    },
    
    events: {
        'focus #comment_field': '_handle_comment_field_focus',
        'blur #comment_field': '_handle_comment_field_blur', 
        'keyup #comment_field': '_handle_comment_field_keyup',
        'click #comment_button': '_handle_comment_button_click'
    }, 
    
    /**
     *  When the comment field has focus, expand and show 'comment' button.
     **/
    _handle_comment_field_focus: function() {
        /* Expand field */
        this.commentFieldElement.addClass('expanded');
        
        /* Show comment button, initially disabled */
        this.commentButtonElement.removeClass('hidden').addClass('disabled');
    }, 
    
    /**
     *  When the comment field is blurred, contract and hide button.
     **/
    _handle_comment_field_blur: function() {
        var field = this.commentFieldElement;

        /* If the user did not type anything */
        if(field.val() == '') {
            /* contract field and hide comment button */
            field.removeClass('expanded');
            
            this.commentButtonElement.addClass('hidden');
        }
    }, 
    
    /**
     *  When the user types in the comment field, activate button.
     **/
    _handle_comment_field_keyup: function() {
        var field = this.commentFieldElement;
        
        if(field.val() != '') {
            this.commentButtonElement.removeAttr('disabled');
        }
        else {
            this.commentButtonElement.attr('disabled', 'true');
        }
    }, 
    
    /**
     *  When the user submits a comment, create a new event for this collection.
     **/
    _handle_comment_button_click: function() {
        var button = this.commentButtonElement;
        var field = this.commentFieldElement;
        /* if button is disabled, do nothing */
        if(button.attr('disabled')) {
            return;
        }
        
        /* Otherwise, create the event */
        this.page.create_new_comment(field.val());
        field.val('');
        field.blur();
    }, 
    
    /**
     *  Stop watching any `EventSet`s we are currently watching.
     **/
    _stop_watching_eventset: function() {
        /* Are we currently watching some set of events for changes? */
        var currentEventSet = this.currentEventSet;
        if(currentEventSet) {
            /* If so, stop */
            currentEventSet.unbind('add', this._render_and_add_event);
        }
        this.currentEventSet = null;
    }, 
    
    /**
     *  Start watching a single list of events for changes.
     *
     *  @param  {EventSet}      events  The set of Event objets we're watching.
     **/
    _start_watching_eventset: function(events) {
        /* stop watching any previous EventSets */
        this._stop_watching_eventset();
        
        /* Set new callback for when an event is added */
        events.bind('add', this._render_and_add_event);
        
        this.currentEventSet = events;
    }, 
    
    
    /**
     *  When we are viewing collections.
     **/
    render_collections: function(collections) {
        /* We'll aggregate together the events for each collection, and render
        a giant list of all */
        var allCollectionEvents = new EventSet;

        /* For each collection, aggregate together the events */
        collections.each(function(collection) {
            allCollectionEvents.add(collection.get('events').models);
        });
        
        /* Comment form is hidden */
        this.commentContainerElement.addClass('hidden');
        
        /* Render this giant list of events */
        this._render_events(allCollectionEvents);
    },
    
    /**
     *  When we're viewing a single collection, show all of the events for that
     *  collection.
     **/
    render_collection: function(collectionId, collection) {
        
        /* Comment form is hidden */
        this.commentContainerElement.addClass('hidden');

        
        /* Render the events for this collection */
        this._render_events(collection.get('events'));
        
    }, 
    
    /**
     *  When we are viewing the list of audio for a collection, same as 
     *  viewing a collection.
     **/
    render_collection_audio: function(collectionId, collection) {
        /* Comment form is hidden */
        this.commentContainerElement.addClass('hidden');

        return this.render_collection(collectionId, collection);
    }, 
    
    /**
     *  When we are viewing an audio file from a collection
     **/
    render_collection_audio_file: function(collectionId, fileId, collection, audioFile) {
        var events = audioFile.get('events');

        /* Comment form is visible */
        this.commentContainerElement.removeClass('hidden');
        
        /* watch audio file's events for changes */
        this._start_watching_eventset(events);

        /* render the audio file's events */
        this._render_events(events);
    }, 
    
    /**
     *  When we are viewing an audio segment from a collection
     **/
    render_collection_audio_segment: function(collectionId, fileId, segmentId, collection, audioFile, audioSegment) {
        this._start_watching_eventset(audioSegment.get('events'));
        
        
        /* Initially render all events */
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
        
        
        var panel = this;

        var frag = document.createDocumentFragment();
        /* For each event model */
        eventModels.each(function(eventModel) {
            var widget = panel._create_event_widget(eventModel);

            frag.appendChild(widget.render().el);
            
            
        });
        
        this.contents.html(frag);
        
        return this;
    },
    
    /**
     *  This is called when a single event must be added to the list.
     *
     *  @param  {Event}    eventModel    The Event object to be added to our display
     **/
    _render_and_add_event: function(eventModel) {
        var widget = this._create_event_widget(eventModel);
        
        this.contents.prepend(widget.render().el);
        
    }, 
    
    /**
     *  Called from internal render methods when a widget is to be created.
     *
     *  @param  {Event}    eventModel    The model instance from which to create
     *  the widget.
     **/
    _create_event_widget: function(eventModel) {
        var eventType = eventModel.get('eventType');
        /* Proper widget for this event */
        var widgetClass = this.eventTypesToWidgetMap[eventType];
        var widgetTemplate = this.eventTypesToTemplateMap[eventType];
        
        
        /* Create and return widget */
        return new widgetClass({
            panel: this, 
            model: eventModel,
            template: widgetTemplate 
        });
    }, 
    
});
