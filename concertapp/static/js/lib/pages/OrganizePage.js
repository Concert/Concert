/**
 *  @file       OrganizePage.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  The panels and widgets for the organize page.
 *	@class
 *  @extends    LoggedInPage
 **/
var OrganizePage = LoggedInPage.extend(
	/**
	 *	@scope	OrganizePage.prototype
	 **/
{
    
    _initializeModelManager: function(params) {
        return new OrganizePageModelManager(params);
    }, 
    _initializeViews: function() {
        LoggedInPage.prototype._initializeViews.call(this);
        
        var modelManager = this.modelManager;
        
        /* This is our HTML5 audio player */
        var audio = new Audio();
        audio.autoplay = false;
        audio.preload = 'auto';
        this.audio = audio;
        
        /* The callback function for an audio loop (on a timeupdate event) */ 
        this.audioLoopTimeUpdateCallback = function() {};
        this.audioLoopEnabled = false;
        
        /* This is the type of audio file we will use */
        this.audioType = com.concertsoundorganizer.compatibility.audioType;
        
        
        /*  Create waveform overview panel */
        this.overviewPanel = new OverviewWaveformPanel({
            page: this, 
            el: $('#overview_waveform_panel')
        });

        /* Create waveform detail panel */
        this.detailPanel = new DetailWaveformPanel({
            page: this, 
            el: $('#detail_waveform_panel'),
        });


        /* Create the audio list panel 
        this.audioListPanel = new AudioListPanel({
            page: this, 
            el: $('#audio_list_panel'),
            modelManager: modelManager, 
        });*/
        
        /* Create events panel */
        this.eventsPanel = new EventsPanel({
            page: this, 
            el: $('#events_list_panel'), 
            modelManager: modelManager 
        });
        
        
        /* When the space button is pressed */
        $(window).bind('keydown', function(me) {
            return function(e) {
                /* If this was a space, not from an input element */
                if(e.keyCode == 32 && !$(e.srcElement).is('input')) {
                    e.preventDefault();
                    e.stopPropagation();
                    /* Handle event */
                    me._handle_space_bar();
                }
            };
        }(this));
        
        /* Here we will store the audio segments and files that are selected (from the
        audio list panel).  Currently only one segment/file can be selected at once, so 
        the total cardinality of these sets will be 1. */
        this.selectedAudioSegments = new AudioSegmentSet;
        this.selectedAudioFiles = new AudioFileSet;

    }, 
    
    _initialize_routes: function() {
        
        LoggedInPage.prototype._initialize_routes.call(this);
        
        /**
         *  Route for selecting a segment, #segment/5 will select segment with id 5
         **/
        this.route('segment/:segment_id', 'select_segment', function(segment_id) {
            
            /* Get segment by id */
            var segment = this.modelManager.seenInstances['audiosegment'].get(segment_id);

            this.select_audio({
                segments: [segment], 
            });
        });
        
        /**
         *  Route for selecting an audio file, #file/5 will select file with id 5
         **/
        this.route('file/:file_id', 'select_file', function(file_id) {
            
            /* get file by id */
            var file = this.modelManager.seenInstances['audiofile'].get(file_id);
            
            this.select_audio({
                files: [file] 
            });
        });
    }, 
    
    /**
     *  The default route.
     **/
    _default_route: function() {
        LoggedInPage.prototype._default_route.call(this);
        
        /* Tell events panel to load events from collection */
        this.eventsPanel.render(this.modelManager.collection.get('events'));
    }, 
    
    /**
     *  Called before anything is to be selected.  Handles deselecting of everything.
     **/
    _deselect_all: function() {
        var selectedAudioSegments = this.selectedAudioSegments;
        var selectedAudioFiles = this.selectedAudioFiles;

        /* Deselect everything */
        selectedAudioSegments.each(function(seg){
            seg.set({
                selected: false 
            });
        });
        selectedAudioFiles.each(function(file){
            file.set({
                selected: false 
            });
        });

    },
    
    /**
     *  Ensure that given audio models are shown as selected on the UI.  Takes
     *  arrays in case we need to select multiple files/segments in the future.
     *
     *  @param  {Array}     params.files    -   The files selected.
     *  @param  {Array}     params.segments -   The selected segments
     **/
    select_audio: function(params) {
                
        /* Clear any highlights */
        this.clear_waveform_highlight();
        
        /* Determine what audio was selected */
        var files = params.files;
        var segments = params.segments;
        files || (files = []);
        segments || (segments = []);
        
        /* If one segment was selected */
        if(segments.length == 1 && files.length == 0) {
            /* Selecting an audio segment */
            this.select_audio_segment(segments[0]);
        }
        /* If one file was selected */
        else if(files.length == 1 && segments.length == 0) {
            /* Selecting a file */
            this.select_audio_file(files[0]);
        }
        /* If files and segments were selected */
        else if(files.length && segments.length) {
            throw new Error('Not implemented multiple selection.');
        }
        /* If more than one file was selected */
        else if(files.length > 1) {
            throw new Error('Not implemented selecting multiple files');
        }
        /* If more than one segment was selected */
        else if(segments.length > 1) {
            throw new Error('Multiple selection not supported currently.');
        }
        else {
            throw new Error('Invalid parameters for select_audio');
        }
    }, 
    
    /**
     *  Ensure that given event is selected on the events panel and the UI.
     *
     *  @param  {Event}    event    -   The event that has been selected.
     **/
    select_event: function(event) {
        
    }, 
    
    /**
     *  When a user has selected a single audio file.
     *
     *  @param  {AudioFile}    selectedAudioFile    -   The AudioFile that was
     *  selected.
     **/
    select_audio_file: function(selectedAudioFile) {
        /* This is where loading notification should be */
        
        /* Clear everything currently selected */
        this._deselect_all();

        /* if we were just passed an id */
        if(typeof(selectedAudioFile) == 'number') {
            /* First retrieve file instance */
            selectedAudioFile = this.modelManager.seenInstances['audiofile'].get(selectedAudioFile);
        }

        selectedAudioFile.set({
            selected: true
        });

        /* Remove previously selected files and select new one */
        this.selectedAudioFiles.refresh([selectedAudioFile]);
        
        /* Load audio file */
        this._load_audio_file(selectedAudioFile, function(me, selectedAudioFile) {
            /* when complete, notify panel */
            return function(){
                $(me).trigger('select_file', selectedAudioFile);
            };
        }(this, selectedAudioFile));
        
    },
    
    /**
     *  Ensure that given audio segment has been selected.
     *
     *  @param  {AudioSegment}    selectedAudioSegment    - The AudioSegment 
     *  that was selected.
     **/
    select_audio_segment: function(selectedAudioSegment) {
        
        /* Clear everything currently selected */
        this._deselect_all();

        /* If we were passed an id as a number */
        if(typeof(selectedAudioSegment) == 'number') {
            /* Get audio segment */
            selectedAudioSegment = this.modelManager.seenInstances['audiosegment'].get(selectedAudioSegment);
        }

        /* Set as selected */
        selectedAudioSegment.set({
            selected: true
        });


        /* remove previously selected segments and select new one */
        this.selectedAudioSegments.refresh([selectedAudioSegment]);
        
        /* Load the audio segment's file into the audio player */
        this._load_audio_file(selectedAudioSegment.get('audioFile'), function(me, selectedAudioSegment) {
            return function() {
                
                /* Start audio loop */
                me._start_audio_loop(
                    selectedAudioSegment.get('beginning'),
                    selectedAudioSegment.get('end')
                );
                
                /* Throw "selected_segment" event */
                $(me).trigger('select_segment', selectedAudioSegment);
            };
        }(this, selectedAudioSegment))
        
    }, 
    
    /**
     *  This is called from elsewhere when an area of the waveform was highlighted by 
     *  the user.  Ensure that UI displays the highlight and the segment
     *  is to be created.
     *
     *  @param  {Number}    startTime    -  The time (in seconds) of highlight start
     *  @param  {Number}    endTime    -    The time of the highlight end.
     **/
    create_new_segment: function(startTime, endTime) {
        /* Find parent audio file */
        var selectedSegments = this.selectedAudioSegments;
        var selectedFiles = this.selectedAudioFiles;

        /* The audio file that will be the parent for our new segment */
        var audioFile = null;

        /* If a segment is currently selected */
        if(selectedSegments.length) {
            /* Use segment's parent audio file */
            audioFile = selectedSegments.first().get('audioFile');
        }
        /* If a file is currently selected */
        else if(selectedFiles.length) {
            /* Use it as the segment's parent */
            audioFile = selectedFiles.first();
        }

        /* Create new audio segment */
        this.modelManager.create_and_select_new_segment(startTime, endTime, audioFile);
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
        this.modelManager.modify_current_segment_times(startTime, endTime);
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
     *  This is called from elsewhere when we are to ensure that a waveform highlight 
     *  is cleared.
     **/
    clear_waveform_highlight: function() {
        this._clear_audio_loop();
        this.detailPanel.clear_waveform_highlight();
        this.overviewPanel.clear_waveform_highlight();
    }, 
    
    /**
     *  This is called from the waveform interaction component when a click happens
     *  inside the current highlight
     **/
    enable_audio_loop: function() {
        this._start_audio_loop(this.modelManager.selectedAudioSegments.first().get('beginning'),
            this.modelManager.selectedAudioSegments.first().get('end'));
    },
    
    /**
     *  This is called from the waveform interaction component when a click happens
     *  outside the current highlight
     **/
    disable_audio_loop: function() {
        this._clear_audio_loop();
    },
    
    /**
     *  Called when audio is to change time.
     *
     *  @param  {Number}    seconds    The time we are to go to in the audio file.
     **/
    set_audio_time: function(seconds) {
        /* calls handle_scroll_stop to turn autoscrolling on when playhead is moved into view */
        $(this.audio).one('timeupdate', function(me) {
            return function() {
                me.detailPanel.handle_scroll_stop();
            }
        }(this));
        this.audio.currentTime = seconds;
    },
    
    /**
     *  Ensure that given audio segment is deleted.
     *
     *  @param  {AudioSegment}    segment    The AudioSegment instance to delete
     **/
    delete_audio_segment: function(segment) {
        this.modelManager.delete_audio_segment(segment);
        this.overviewPanel.audio_segment_deleted(segment);
    }, 
    
    /**
     *  This will load an audio file into the audio player, and fire the callback
     *  when complete.
     *
     *  @param  {AudioFile}    audioFile    -   the file to load.
     *  @param  {Function}      callback    -   the function to call when done loading audio file.
     **/
    _load_audio_file: function(audioFile, callback) {
        var audio = this.audio;

        /* The proper audio source for this browser */
        var audiosrc = audioFile.get_audio_src(this.audioType);
        
        /* If this is a new audio file */
        var newAudioSrc = !(audio.src.search(audiosrc) > 0);
        
        if(newAudioSrc) {
            /* when the file is done loading */
            $(audio).one('canplaythrough', callback);
        
            this.audio.src = audiosrc;
        }
        else {
            callback();
        }        
    }, 
    
    /**
     *  When a user presses the space bar
     **/
    _handle_space_bar: function() {
        /* Get HTML5 audio object */
        var audio = this.audio;
            
        if(audio.paused) {
            audio.play();
        }
        else {
            audio.pause();
        }
    }, 

    
    /**
     *  This is called when a section of a waveform is selected.  It will start
     *  an interval that will loop a single section of audio.
     *
     *  @param  {Number}    startTime    -  The beginning of the loop.
     *  @param  {Number}    endTime     -   The end of the loop
     **/
    _start_audio_loop: function(startTime, endTime) {
        if(this.audioLoopEnabled == false) {
            var audio = this.audio;
        
            /* This function will be called when a timeupdate event occurs. */
            var audioLoopTimeUpdateCallback = function(startTime, endTime) {
                return function(e) {
                    var currentTime = audio.currentTime;
                    if(currentTime < startTime || currentTime > endTime) {
                        this.currentTime = startTime;
                    }
                };
            }(startTime, endTime);
            /* Save so we can unbind later */
            this.audioLoopTimeUpdateCallback = audioLoopTimeUpdateCallback;
        
            /* Start audio at beginning of loop */
            if(audio.currentTime < startTime || audio.currentTime > endTime) {
                audio.currentTime = startTime;
            }
        
            /* When audio loop changes time */
            $(audio).bind('timeupdate', this.audioLoopTimeUpdateCallback); 
            this.audioLoopEnabled = true;
        }
    }, 
    
    /**
     *  This is called internally the audio loop is to be turned off
     **/
    _clear_audio_loop: function() {
        if(this.audioLoopEnabled == true) {
            $(this.audio).unbind('timeupdate', this.audioLoopTimeUpdateCallback);
            this.audioLoopEnabled = false;
        }
    }, 
});
