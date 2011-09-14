/**
 *  @file       Router.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  The router that will be instantiated once, and will be the first class
 *  instantiated, to handle all of the routing of messages between components, as
 *  well as URL hash changes.  Still use Backbone.Router until we upgrade
 *  to newer Backbone.
 *  @extends    Backbone.Router
 **/
var Router = Backbone.Router.extend(
    /**
     *  @scope Router.prototype
     **/
{
    
    /**
     *  @constructor
     **/
    initialize: function(options) {
        Backbone.Router.prototype.initialize.call(this);

        /**
         *  The current route that we are on.
         **/
        this.currentRoute = null;

        /**
         *    The previous fragment (for going back)
         **/
        this.previousFragment = null;

        /* Create dataset manager */
        var modelManager = new LoggedInModelManager(_.extend(options, {
            router: this 
        }));
        this.modelManager = modelManager;
        /* Save this in global namespace because it will be needed before our current
        stack ends */
        com.concertsoundorganizer.modelManager = modelManager;

        /* Create views */
        this._initializeViews();
        
        /* Load data so views can update and such */
        this.modelManager._loadData();
        
        /* Initialize routes */
        this._initialize_routes();
        
        Backbone.history.start();
    },

    goBack: function () {
        if(this.previousFragment) {
            console.log('this.previousFragment:');
            console.log(this.previousFragment);
            this.navigate(this.previousFragment);
        }
    }, 
    
    /**
     *  This method is called when views are to be created.  Should be overridden
     *  in child classes.
     **/
    _initializeViews: function() {
        /* Create the globalOptionsPanel (the buttons and menus at the top of 
        the page) 
        this.globalOptionsPanel = new GlobalOptionsPanel({
            router: this, 
            el: $('#global_options_panel'),
            userMemberCollections: this.modelManager.user.get('memberCollections')
        });*/
        
        /**
         *  The list on the right side of the UI.
         **/
        this.listPanel = new ListPanel({
            router: this, 
            el: $('#list_panel'),
            modelManager: this.modelManager
        });
        
        /**
         *  The events panel on the left side of the UI.
         **/
        this.eventsPanel = new EventsPanel({
            router: this, 
            el: $('#events_list_panel'), 
            modelManager: this.modelManager
        });
        
        /**
         *  The admin panel on the left side of the UI.
         **/
        this.adminPanel = new AdminPanel({
            router: this,
            el: $('#admin_panel'),
            modelManager: this.modelManager
        });
        
        /* Create audio controller */ 
        this.audioController = new AudioController({
            router: this
        });

        /*  Create waveform overview panel */
        this.overviewPanel = new OverviewWaveformPanel({
            router: this, 
            el: $('#overview_waveform_panel')
        });
                
        /* Create waveform detail panel */
        this.detailPanel = new DetailWaveformPanel({
            router: this, 
            el: $('#detail_waveform_panel')
        });
        
        /* Upload panel */
        this.uploadPanel = new ModalUploadPanel({
            router: this, 
            el: $('#upload_panel')
        });
        
        return true;
    }, 
    
    /**
     *  This method is called when routes are to be initialized.
     **/
    _initialize_routes: function() { 
        
        /* If no hash, go to #collections */
        this.route('', 'default', function() {
            window.location.assign('#collections');
        });
        
        _.bindAll(this, '_collections_route');
        this.route('collections', 'collections', this._collections_route);
        
        _.bindAll(this, '_collection_route');
        this.route('collection/:collectionId', 'collection', this._collection_route);
        
        _.bindAll(this, '_collection_manage_route');
        this.route(
          'collection/:collectionId/manage', 
          'collection_manage',
          this._collection_manage_route
        );
        
        _.bindAll(this, '_collection_audio_route');
        this.route(
            'collection/:collectionId/audio',
            'collection_audio',
            this._collection_audio_route
        );
        
        _.bindAll(this, '_collection_audio_file_route');
        this.route(
            'collection/:collectionId/audio/file/:fileId',
            'collection_audio_file',
            this._collection_audio_file_route
        );
        
        _.bindAll(this, '_collection_audio_segment_route');
        this.route(
            'collection/:collectionId/audio/file/:fileId/segment/:segmentId',
            'collection_audio_segment',
            this._collection_audio_segment_route
        );
        
        _.bindAll(this, '_collection_upload_route');
        this.route('collection/:collectionId/upload', 'collection_upload', this._collection_upload_route);
        
        return;
    }, 

    /**
     *  Overriding this method so we can pass extra arguments through our
     *  route:* events.
     **/
    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route : function(route, name, callback) {
        Backbone.history || (Backbone.history = new Backbone.History);
        if (!_.isRegExp(route)) route = this._routeToRegExp(route);
        Backbone.history.route(route, _.bind(function(fragment) {
            var args = this._extractParameters(route, fragment);
            /* Whatever our callback for this route returns, we will push into
            the args array to send along with the route information */
            args = args.concat(callback.apply(this, args));
            
            this.trigger.apply(this, ['route:' + name].concat(args));
        }, this));
    },
        
    /**
     *  Route for "/#collections".  Lists collections and such.
     **/
    _collections_route: function() {
        this.currentRoute = 'collections';
        
        /* We will send along the list of collections that this user is a member
        of, as these will be the collections listed on this page */
        return [this.modelManager.user.get('memberCollections')];
    }, 
    
    /**
     *  Route for "/#collection/:collectionId".  Shows preview of a collection 
     *  by displaying events on left.
     **/
    _collection_route: function(collectionId) {
        /* select current collection in model manager */
        var collection = this.modelManager.select_collection(collectionId);
        
        
        this.currentRoute = 'collection';
        return [collection];
    }, 
    
    _collection_manage_route: function(collectionId) {
        var collection = this.modelManager.select_collection(collectionId);
        
        this.currentRoute = 'collection_manage';
        return [collection];
    },
    
    /**
     *  Route for #collection/:collectionId/upload, brings up modal window for uploading audio or viewing
     *  audio upload status.
     **/
    _collection_upload_route: function(collectionId) {
        var newArgs = this._collection_route(collectionId);

        this.currentRoute = 'collection_upload';
        return newArgs;
    }, 

    /**
     *  Rotue for "/#collection/:collectionId/audio".  Shows collection's audio
     *  files and segments.
     **/
    _collection_audio_route: function(collectionId) {
        /* Get collection from collection route handler */
        var newArgs = this._collection_route(collectionId);
        
        this.currentRoute = 'collection_audio';
        
        return newArgs;
    }, 
    
    /**
     *  Route for "/#collection/:collectionId/audio/file/:fileId" Shows audio file's
     *  waveform, segments, and events
     **/
    _collection_audio_file_route: function(collectionId, fileId) {
        this.clear_waveform_highlight();
        var newArgs = this._collection_route(collectionId);
        var file = this.modelManager.select_audiofile(fileId);
        newArgs.push(file);
        
        this.currentRoute = 'collection_audio_file';
        
        return newArgs;
    },
    
    /**
     *  Route for "/#collection/:collectionId/audio/file/:fileId/segment/:segmentId"
     *  Shows audio segment's waveform, parent audio file, and events
     **/
     _collection_audio_segment_route: function(collectionId, fileId, segmentId) {
         this.clear_waveform_highlight();
         var newArgs = this._collection_audio_file_route(collectionId, fileId);
         var segment = this.modelManager.select_audio_segment(segmentId);
         newArgs.push(segment);
         
         this.currentRoute = 'collection_audio_segment';

         return newArgs;
     },
        
    /**
     *  Called from elsewhere when there is a new audio segment to be created
     *  @param  {Number}    startTime   the start time of the new segment
     *  @param  {Number}    endTime     the end time of the new segment
     **/
    create_new_segment: function(startTime, endTime) {
        /* Throw event so everyone knows what is happening */
        this.trigger('creating_new_segment');
        
        this.modelManager.create_and_select_new_segment(startTime, endTime,
            /* When the segment is created */
            function(segment, resp) {
                var collectionId = segment.get('collection').get('id');
                var fileId = segment.get('audioFile').get('id');
                var segmentId = segment.get('id');
                /* Go to new URL */
                window.location.assign('#collection/'+collectionId+'/audio/file/'+fileId+'/segment/'+segmentId);
        });
    },
    
    /**
     *  Called from elsewhere when the current segment has changed.  Ensure that
     *  everything is updated.
     *
     *  @param  {Number}    startTime       The new beginning of the segment
     *  @param  {Number}    endTime         The new end of the segment
     **/
    modify_current_segment_times: function(startTime, endTime) {
        /* Modify current segment */
        this.modelManager.modify_current_segment_times(startTime, endTime,
            /* When the segment is created */
            function(model, resp) {
                var collectionId = model.get('collection').get('id');
                var fileId = model.get('audioFile').get('id');
                var segmentId = model.get('id');
                /* Go to new URL */
                window.location.assign('#collection/'+collectionId+'/audio/file/'+fileId+'/segment/'+segmentId);
        });
    },
    
    /**
     *  Called from elsewhere when current segment is to be tagged.
     *
     *  @param  {String}    tagName    The tag that we're giving this segment.
     **/ 
    tag_current_segment: function(tagName) {
        this.modelManager.tag_current_segment(tagName);
    },

    /**
     *  Ensure that given audio segment is deleted.
     *
     *  @param  {AudioSegment}    segment    The AudioSegment instance to delete
     **/
    delete_audio_segment: function(segment) {
        this.modelManager.delete_audio_segment(segment);
    }, 
    
    /**
     *  This is called from elsewhere when we are to ensure that a waveform highlight 
     *  is cleared.
     **/
    clear_waveform_highlight: function() {
        this.audioController._clear_audio_loop();
        this.detailPanel.clear_waveform_highlight();
        this.overviewPanel.clear_waveform_highlight();
    },
    
    /**
     *  Called from elsewhere when we're searching in the collections list
     *
     *  @param  {String}    term    Search term.
     **/
    collections_search: function(term) {
        console.log('term:');
        console.log(term);
    }, 
    
    /**
     *  Called from UI classes when user makes a comment.
     *
     *  @param  {String}    content The content of the comment.
     **/
    create_new_comment: function(content) {
        this.modelManager.create_new_comment(content);
    } 
    
});

