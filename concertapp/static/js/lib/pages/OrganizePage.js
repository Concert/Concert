/**
 *  @file       OrganizePage.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  The panels and widgets for the organize page.
 *	@class
 *  @extends    LoggedInPage
 **/
var OrganizePage = LoggedInPage.extend({
    
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
        
        /* The callback function for an audio loop */
        this.audioLoopTimeUpdateCallback = null;
        
        
        /* This is the type of audio file we will use */
        this.audioType = com.concertsoundorganizer.compatibility.audioType;
        
        
        /*  Create waveform overview panel */
        this.overviewPanel = new OverviewWaveformPanel({
            page: this, 
            el: $('#overview_waveform_panel'),
            selectedAudioSegments: modelManager.selectedAudioSegments,
            selectedAudioFiles: modelManager.selectedAudioFiles
        });

        /* Create waveform detail panel */
        this.detailPanel = new DetailWaveformPanel({
            page: this, 
            el: $('#detail_waveform_panel'),
            selectedAudioSegments: modelManager.selectedAudioSegments,
            selectedAudioFiles: modelManager.selectedAudioFiles 
        });


        /* Create the audio list panel */    
        this.audioListPanel = new AudioListPanel({
            page: this, 
            el: $('#audio_list_panel'),
            files: modelManager.collectionAudioFiles,
            segments: modelManager.collectionAudioSegments
        });
        
        
        /* When the space button is pressed, pause/play our audio */
        $(window).bind('keydown', function(me) {
            return function(e) {
                
                if(e.keyCode == 32) {
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
     *  @param  {Object}    params    - The audio files and segments that were
     *  selected.
     **/
    select_audio: function(params) {
        /* Right now just delegate to model manager */
        this.modelManager.select_audio(params);
        
        this.pause();
        
        var files = params.files;
        var segments = params.segments;
        files || (files = []);
        segments || (segments = []);
        
        if(files.length && segments.length) {
            throw new Error('Not implemented multiple selection.');
        }
        else if(files.length == 1) {
            /* Selecting a file */
            this.select_audio_file(files[0]);
        }
        else if(segments.length == 1) {
            /* Selecting an audio segment */
            this.select_audio_segment(segments[0]);
        }
        else {
            throw new Error('Not implemented.');
        }
    }, 
    
    /**
     *  When a user has selected a single audio file.
     *
     *  @param  {AudioFile}    audioFile    -   The AudioFile model instance
     **/
    select_audio_file: function(audioFile) {
        var audio = this.audio;
        
        /* when the file is done loading */
        audio.addEventListener('canplaythrough', function() {
            console.log('canplaythrough');
        });
        
        
        /* The proper audio source for this browser */
        var audiosrc = audioFile.get(this.audioType);
        
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
        var playheadInterval = setInterval(function(detailPlayheadWidget, overviewPlayheadWidget) {
            return function() {
                detailPlayheadWidget.animate();
                overviewPlayheadWidget.animate();
            };
        }(this.detailPanel.playheadWidget, this.overviewPanel.playheadWidget), 
            com.concertsoundorganizer.animation.speed);
        this.playheadInterval = playheadInterval;
    },
    
    pause: function() {
        this.audio.pause();
        clearInterval(this.playheadInterval);        
    },
    
    /**
     *  This is called when an area of the waveform was highlighted by the user.
     *
     *  @param  {Number}    startTime    -  The time (in seconds) of highlight start
     *  @param  {Number}    endTime    -    The time of the highlight end.
     **/
    new_waveform_highlight: function(startTime, endTime) {
        /* Start audio loop */
        this.start_audio_loop(startTime, endTime);
    },
    
    /**
     *  This is called when a waveform is cleared.
     **/
    waveform_highlight_cleared: function() {
        this.clear_audio_loop();
    }, 
    
    /**
     *  This is called when a section of a waveform is selected.  It will start
     *  an interval that will loop a single section of audio.
     *
     *  @param  {Number}    startTime    -  The beginning of the loop.
     *  @param  {Number}    endTime     -   The end of the loop
     **/
    start_audio_loop: function(startTime, endTime) {
        
        /* This function will be called when a timeupdate event occurs. */
        var audioLoopTimeUpdateCallback = function(startTime, endTime) {
            return function(e) {
                var currentTime = this.currentTime;
                
                if(currentTime < startTime || currentTime > endTime) {
                    this.currentTime = startTime;
                }
            };
        }(startTime, endTime);
        /* Save so we can unbind later */
        this.audioLoopTimeUpdateCallback = audioLoopTimeUpdateCallback;
        
        /* When audio loop changes time */
        $(this.audio).bind('timeupdate', audioLoopTimeUpdateCallback);
    }, 
    
    /**
     *  This is called when a highlight is cleared.
     **/
    clear_audio_loop: function() {
        $(this.audio).unbind('timeupdate', this.audioLoopTimeUpdateCallback);
    }, 
    
});
