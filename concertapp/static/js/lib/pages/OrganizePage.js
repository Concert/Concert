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


        /* Create the audio list panel */    
        this.audioListPanel = new AudioListPanel({
            page: this, 
            el: $('#audio_list_panel'),
            files: modelManager.collectionAudioFiles,
            segments: modelManager.collectionAudioSegments,
            modelManager: modelManager, 
        });
        
        /* Create comments panel */
        this.commentsPanel = new CommentsPanel({
            page: this, 
            el: $('#comment_list_panel'), 
            modelManager: modelManager 
        });
        
        
        /* When the space button is pressed, pause/play our audio */
        $(window).bind('keydown', function(me) {
            return function(e) {
                /* If this was a space, not from an input element */
                if(e.keyCode == 32 && !$(e.srcElement).is('input')) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    me.play_pause();
                }
            };
        }(this));
    
    }, 
    
    /**
     *  When a user selects some audio from the audio list.
     *
     *  @param  {Array}     params.files    -   The files selected.
     *  @param  {Array}     params.segments -   The selected segments
     **/
    select_audio: function(params) {
        /* Tell model manager so we can maintain list of instances */
        this.modelManager.select_audio(params);
        
        /* Pause audio if it is currently playing */
        this.pause();
        /* Clear any highlights/loops */
        this.clear_audio_loop();
        this.clear_waveform_highlight();
        
        
        /* Determine what audio was selected */
        var files = params.files;
        var segments = params.segments;
        files || (files = []);
        segments || (segments = []);
        
        /* If one segment was selected */
        if(segments.length == 1) {
            /* Selecting an audio segment */
            this.select_audio_segment(segments[0]);
        }
        /* If one file was selected */
        else if(files.length == 1) {
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
            throw new Error('Not implemented selecting multiple segments');
        }
        else {
            throw new Error('Invalid parameters for select_audio');
        }
    }, 
    
    /**
     *  When a user has selected a single audio file.
     *
     *  @param  {AudioFile}    selectedAudioFile    -   The AudioFile that was
     *  selected.
     **/
    select_audio_file: function(selectedAudioFile) {
        /* This is where loading notification should be */
        
        /* Load audio file */
        this._load_audio_file(selectedAudioFile, function(me, selectedAudioFile) {
            /* when complete, notify panel */
            return function(){
                me.overviewPanel.audio_file_selected(selectedAudioFile);
                me.detailPanel.audio_file_selected(selectedAudioFile);
            };
        }(this, selectedAudioFile));
    },
    
    /**
     *  When a user has selected a single audio segment
     *
     *  @param  {AudioSegment}    selectedAudioSegment    - The AudioSegment 
     *  that was selected.
     **/
    select_audio_segment: function(selectedAudioSegment) {
        /* Load the audio segment's file into the audio player */
        this._load_audio_file(selectedAudioSegment.get('audioFile'), function(me, selectedAudioSegment) {
            return function() {
                /* when complete, notify panels.  They will notify their 
                highlighters */
                me.overviewPanel.audio_segment_selected(selectedAudioSegment);
                me.detailPanel.audio_segment_selected(selectedAudioSegment);
                
                /* Start audio loop */
                me.start_audio_loop(
                    selectedAudioSegment.get('beginning'),
                    selectedAudioSegment.get('end')
                );
            };
        }(this, selectedAudioSegment))
        
    }, 
    
    /**
     *  This will load an audio file into the audio player, and fire the callback
     *  when complete.
     *
     *  @param  {AudioFile}    audioFile    -   the file to load.
     **/
    _load_audio_file: function(audioFile, callback) {
        var audio = this.audio;
        
        /* when the file is done loading */
        $(audio).one('canplaythrough', callback);
        
        
        /* The proper audio source for this browser */
        var audiosrc = audioFile.get_audio_src(this.audioType);
        
        this.audio.src = audiosrc;
        
    }, 
    
    /**
     *  When a user presses the space bar
     **/
    play_pause: function() {
        /* Get HTML5 audio object */
        var audio = this.audio;
            
        if(audio.paused) {
            this.play();
        }
        else {
            this.pause();
        }
    }, 
    
    play: function() {
        this.audio.play();
//        this.detailPanel.autoscrollBool = true;
        
    },
    
    pause: function() {
        this.audio.pause();
    },
    
    
    
    /**
     *  This is called from a panel when an area of the waveform was highlighted by 
     *  the user.
     *
     *  @param  {Number}    startTime    -  The time (in seconds) of highlight start
     *  @param  {Number}    endTime    -    The time of the highlight end.
     *  @param  {Panel}    panel    -   The panel that triggered the highlight
     **/
    waveform_highlighted: function(startTime, endTime) {
        /* Start audio loop */
        this.start_audio_loop(startTime, endTime);
        
        /* Tell overview panel */
        this.overviewPanel.highlight_waveform(startTime, endTime);
        /* Tell detail panel */
        this.detailPanel.highlight_waveform(startTime, endTime);

    },
    
    /**
     *  This is called when a waveform is cleared.
     *
     *  @param  {Panel}    panel    -   The panel that cleared the highlight.
     **/
    waveform_highlight_cleared: function(panel) {
        
        this.clear_audio_loop();
        
        if(panel instanceof DetailWaveformPanel) {
            /* Tell overview panel */
            this.overviewPanel.clear_waveform_highlight();
        }
        else if(panel instanceof OverviewWaveformPanel) {
            this.detailPanel.clear_waveform_highlight();
        }
        else {
            throw new Error('Panel argument is invalid')
        }
    }, 
    
    /**
     *  This is called when a waveform should be cleared.
     **/
    clear_waveform_highlight: function() {
        this.detailPanel.clear_waveform_highlight();
        this.overviewPanel.clear_waveform_highlight();
    }, 
    
    /**
     *  This is called when a section of a waveform is selected.  It will start
     *  an interval that will loop a single section of audio.
     *
     *  @param  {Number}    startTime    -  The beginning of the loop.
     *  @param  {Number}    endTime     -   The end of the loop
     **/
    start_audio_loop: function(startTime, endTime) {
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
    }, 
    
    /**
     *  This is called when a highlight is cleared.
     **/
    clear_audio_loop: function() {
        $(this.audio).unbind('timeupdate', this.audioLoopTimeUpdateCallback);
    }, 
    
    move_audio: function(seconds) {
        $(this.audio).one('timeupdate', function(me) {
            return function() {
                me.detailPanel.handle_scroll_stop();
            }
        }(this))
        this.audio.currentTime = seconds;
    },     
    
});
