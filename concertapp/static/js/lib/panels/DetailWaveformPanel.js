/**
 *  @file       DetailWaveformPanel.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  Panel that displays larger waveform on organize page.
 *  @class
 *  @extends    WaveformPanel
 **/
var DetailWaveformPanel = WaveformPanel.extend({    
    initialize: function() {
        WaveformPanel.prototype.initialize.call(this);

        var params = this.options;
        
        
        /* The template for the top of the panel when a file is selected */
        var topFileTemplate = $('#detail_waveform_top_file_template');
        if(typeof(topFileTemplate) == 'undefined') {
            throw new Error('$(\'#detail_waveform_top_file_template\') is undefined');
        }
        else if(topFileTemplate.length == 0) {
            throw new Error('topFileTemplate not found');
        }
        this.topFileTemplate = topFileTemplate;
        
        /* Template for top of panel when segment is selected */
        var topSegmentTemplate = $('#detail_waveform_top_segment_template');
        if(typeof(topSegmentTemplate) == 'undefined') {
            throw new Error('$(\'#detail_waveform_top_segment_template\') is undefined');
        }
        else if(topSegmentTemplate.length == 0) {
            throw new Error('topSegmentTemplate not found');
        }
        this.topSegmentTemplate = topSegmentTemplate;
        
        /* The container for the top of the panel */
        var topContainer = $('#detail_waveform_panel_top');
        if(typeof(topContainer) == 'undefined') {
            throw new Error('$(\'#detail_waveform_panel_top\') is undefined');
        }
        else if(topContainer.length == 0) {
            throw new Error('topContainer not found');
        }
        this.topContainer = topContainer;
        
        
        var timecodeContainerElement = $('#detail_waveform_panel_timecode');
        if(typeof(timecodeContainerElement) == 'undefined') {
            throw new Error('$(\'#detail_waveform_panel_timecode\') is undefined');
        }
        else if(timecodeContainerElement.length == 0) {
            throw new Error('timecodeContainerElement not found');
        }
        this.timecodeContainerElement = timecodeContainerElement;
        
        /* Instantiate widget for timecode */
        var timecodeComponent = new DetailWaveformTimecodeComponent({
            el: timecodeContainerElement, 
            panel: this, 
            audio: this.page.audio
        });
        this.timecodeComponent = timecodeComponent;
        
        /* Instantiate component for playhead */
        var playheadComponent = new DetailWaveformPlayheadComponent({
            el: this.playheadElement,
            panel: this,
            audio: this.page.audio
        });
        this.playheadComponent = playheadComponent;
        
        
        var highlightContainerElement = $('#detail_waveform_panel_highlight_container');
        if(typeof(highlightContainerElement) == 'undefined') {
            throw new Error('$(\'#detail_waveform_panel_highlight_container\') is undefined');
        }
        else if(highlightContainerElement.length == 0) {
            throw new Error('highlightContainerElement not found');
        }
        this.highlightContainerElement = highlightContainerElement;
        
        /* a highlighter component so we can highlight things */
        var highlighter = new DetailWaveformHighlighterComponent({
            el: highlightContainerElement, 
            panel: this, 
        });
        this.highlighter = highlighter;
        
        var waveformView = $('#detail_waveform_panel_view');
        if(typeof(waveformView) == 'undefined') {
            throw new Error('$(\'#detail_waveform_panel_view) is undefined');
        }
        else if(waveformView.length == 0) {
            throw new Error('waveformView not found');
        }
        this.waveformView = waveformView;
        
        this.set_zoom_level(10);
        
        /**
         *  By default, autoscrolling is ON
         **/
        var autoscrollBool = true;
        this.autoscrollBool = autoscrollBool;
        
        this.waveformView.bind('scrollstart', function(me) {
            return function() {
                me.handle_scroll_start();
            };
        }(this));
        
        this.waveformView.bind('scrollstop', function(me) {
            return function() {
                me.handle_scroll_stop();
            }
        }(this));

    },
    /**
     *  Called from page when an audio file has been selected.
     *
     *  @param  {AudioFile}    selectedAudioFile    -   The selected file.
     **/
    audio_file_selected: function(selectedAudioFile) {
        WaveformPanel.prototype.audio_file_selected.call(this, selectedAudioFile);
        
        /* Load top content with audio file information */
        this.topContainer.html(
            this.topFileTemplate.tmpl(selectedAudioFile.toJSON())
        );
        
        /* Load waveform image */
        this._load_waveform_image(selectedAudioFile.get('detailWaveform'), function(me, selectedAudioFile) {
            /* and when done */
            return function() {
                /* Draw timecode */
                me.timecodeComponent.audio_file_selected(selectedAudioFile);
                
                /* Set up highlighter */
                me.highlighter.audio_file_selected(selectedAudioFile);
            };            
        }(this, selectedAudioFile));
    }, 
    
    /**
     *  Called from page when audio segment has been selected.
     *
     *  @param  {AudioSegment}    selectedAudioSegment    - The selected segment.
     **/
    audio_segment_selected: function(selectedAudioSegment) {
        WaveformPanel.prototype.audio_segment_selected.call(this, selectedAudioSegment);
        
        /* Load top of panel with audio segment information */
        this.topContainer.html(
            this.topSegmentTemplate.tmpl(selectedAudioSegment.toJSON())
        );
        
        
        /* Load waveform image */
        this._load_waveform_image(
            selectedAudioSegment.get('audioFile').get('detailWaveform'),
            function(me, selectedAudioSegment) {
                return function() {
                    /* Draw timecode */
                    me.timecodeComponent.audio_segment_selected(selectedAudioSegment);
                    
                    me.highlighter.audio_segment_selected(selectedAudioSegment);
                };
            }(this, selectedAudioSegment)
        );
        
    }, 
        
    highlight_waveform: function(startTime, endTime) {
        WaveformPanel.prototype.highlight_waveform.call(this, startTime, endTime);
        this.autoscrollBool = true;
    },
    
    /**
     *  set_zoom_level is initially called in init to set the zoomLevel to 10 pxPerSecond
     **/
    set_zoom_level: function(zoomLevel) {
        this.zoomLevel = zoomLevel;
        this.playheadComponent.update_speed();
    },
    
    /**
     *  handle_scroll_start is called on event above
     *  immediately turns OFF autoscrolling
     **/
    handle_scroll_start: function() {
        this.autoscrollBool = false;
    },
    
    /**
     *  handle_scroll_stop is called on event above
     *  if autoscroll is OFF and the playhead is in view, turn autoscroll ON
     *  otherwise keep autoscroll OFF
     **/
    handle_scroll_stop: function() {
        if (!this.autoscrollBool && this.playhead_in_view()) {
            this.autoscrollBool = true;
        }
        else {
            this.autoscrollBool = false;
        }
    },
    
    /**
     *  playhead_in_view is called in handle_scroll_stop above
     *  helps determine whether or not to turn autoscrolling ON on a scrollstop by
     *  determining if the playhead is in the current waveform view
     **/
    playhead_in_view: function() {
        if (((this.waveformView.scrollLeft()) <= this.playheadComponent.position()) && 
        ((this.waveformView.scrollLeft() + 815) >= this.playheadComponent.position())) {
            return true;
        }
        else {
            return false;
        }
    },
    
    /**
     *  playhead_moved is called every time the draw() method is called on the 
     *  detail playhead (every time timeupdate is fired)
     *  if the playhead is at the end of the view OR outside the view 
     *  and autoscrolling is on, playhead_moved calls autoscrolling
     **/
    playhead_moved: function(leftPx) { 
        if ((this.autoscrollBool && leftPx >= (815 + this.waveformView.scrollLeft())) ||
            (this.autoscrollBool && leftPx < this.waveformView.scrollLeft())) {
            this.autoscroll(leftPx);
        }

    },     
        
    /**
     *  autoscroll is called by playhead_moved if the playhead is out of view
     *  scrolls the waveform image with a pretty easeOutExpo animation
     **/
    autoscroll: function(leftPx) {
        this.waveformView.animate({scrollLeft: leftPx}, 600, "easeOutExpo");
    },

    
    /**
     *  The resolution of the waveform image (in pixels/second)
     *  This will eventually look at the panel's zoom level to calculate resolution
     **/
    get_resolution: function() {
        return 10;
    }, 

});
