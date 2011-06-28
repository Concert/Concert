/**
 *  @file       AudioController.js
 *  @author     Amy Wieliczka <amywieliczka [at] gmail.com>
 **/ 

 /**
  *  The controller for the audio object.
  *	 @class
  *  @extends 
  **/
var AudioController = Backbone.Controller.extend(
{
    initialize: function(params) {
        /* the router */
        var router = params.router;
        if(typeof(router) == 'undefined') {
            throw new Error('params.router is undefined');
        }
        this.router = router;
        
        /* This is our HTML5 audio player */
        var audio = new Audio();
        audio.autoplay = false;
        audio.preload = 'auto';
        this.audio = audio;
        
        /* need to do this for the jquery imagesloaded plugin */
        var image = $("<img/>");
        this.image = image;
        
        /* The callback function for an audio loop (on a timeupdate event) */ 
        this.audioLoopTimeUpdateCallback = function() {};
        this.audioLoopEnabled = false;
        
        /* This is the type of audio file we will use */
        this.audioType = com.concertsoundorganizer.compatibility.audioType;
        
        _.bindAll(this, "_select_file");
        this.router.bind('route:collection_audio_file', this._select_file);
        
        _.bindAll(this, "_select_segment");
        this.router.bind('route:collection_audio_segment', this._select_segment);
                
        /* When the space button is pressed */
        $(window).bind('keydown', function(me) {
            return function(e) {
                /* If this was a space, not from an input/textarea element */
                if(e.keyCode == 32 && !$(e.srcElement).is('input') && !$(e.srcElement).is('textarea')) {
                    e.preventDefault();
                    e.stopPropagation();
                    /* Handle event */
                    me._handle_space_bar();
                }
            };
        }(this));
        
    },
    
    _select_file: function(collectionId, fileId, selectedCollection, selectedAudioFile) {
        this._load_audio_file(selectedAudioFile, function(me) {
            return function() {
                console.log("AudioController triggers audio_loaded");
                me.trigger('audio_loaded');
            }
        }(this));
        
        this._load_waveform_image(selectedAudioFile.get_waveform_src(10), function(me) {
            return function() {
                console.log("AudioController triggers waveform_loaded");
                me.trigger('waveform_loaded');
            }
        }(this));        
    },
    
    _select_segment: function(collectionId, fileId, segmentId, selectedCollection, selectedAudioFile, selectedAudioSegment) {
        this._load_audio_file(selectedAudioFile, function(me, selectedAudioSegment) {
            return function() {
                /* Start audio loop */
                me._start_audio_loop(
                    selectedAudioSegment.get('beginning'),
                    selectedAudioSegment.get('end')
                );
                
                me.trigger('audio_loaded');
            };
        }(this, selectedAudioSegment));
        
        
        /* Load waveform image */
        this._load_waveform_image(selectedAudioFile.get_waveform_src(10),
            function(me) {
                return function() {
                    me.trigger('waveform_loaded');
                };
            }(this));        
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
     *  Called from internal when waveform image is to be loaded.
     *
     *  @param  {String}    src    -    The url of the waveform image.
     *  @param  {Function}    callback  -   to be executed after waveform loads.
     **/
    _load_waveform_image: function(src, callback) {
        /* When waveform image has loaded, execute callback */
        this.image.imagesLoaded(callback);
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
     *  This is called internally when the audio loop is to be turned off
     **/
    _clear_audio_loop: function() {
        if(this.audioLoopEnabled == true) {
            $(this.audio).unbind('timeupdate', this.audioLoopTimeUpdateCallback);
            this.audioLoopEnabled = false;
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
     *  This is called from the waveform interaction component when a click happens
     *  inside the current highlight
     **/
    enable_audio_loop: function() {
        this._start_audio_loop(this.router.selectedAudioSegments.first().get('beginning'),
            this.router.selectedAudioSegments.first().get('end'));
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
                me.router.detailPanel.handle_scroll_stop();
            }
        }(this));
        this.audio.currentTime = seconds;
    }

});
