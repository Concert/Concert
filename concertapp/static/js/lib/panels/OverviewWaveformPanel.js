/**
 *  @file       OverviewWaveformPanel.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  This is the smaller waveform panel, which will be at the top underneath the 
 *  options bar on the "organization" page.
 *	@class
 *  @extends    WaveformPanel
 **/
var OverviewWaveformPanel = WaveformPanel.extend({
    initialize: function() {
        WaveformPanel.prototype.initialize.call(this)
        
        /* Instantiate widget for playhead */
        var playheadComponent = new OverviewWaveformPlayheadComponent({
            el: this.playheadContainerElement,
            panel: this,
            audio: this.page.audio
        });
        this.playheadComponent = playheadComponent;
        
        var highlighterContainerElement = $('#overview_waveform_panel_highlight_container');
        if(typeof(highlighterContainerElement) == 'undefined') {
            throw new Error('$(\'#overview_waveform_panel_highlight_container\') is undefined');
        }
        else if(highlighterContainerElement.length == 0) {
            throw new Error('highlighterContainerElement not found');
        }
        this.highlighterContainerElement = highlighterContainerElement;
        
        /* Highlighter */
        var highlighter = new OverviewWaveformHighlighterComponent({
            el: highlighterContainerElement, 
            panel: this 
        });
        this.highlighter = highlighter;

        $("#overview_waveform_panel_top").bind('click', function(me) {
            return function(e) {
                me.handle_click(get_event_x(e));
            };
        }(this));
    }, 
    
    /**
     *  Called from page when an audio file is selected.
     *
     *  @param  {AudioFile}    selectedAudioFile    -   The audio file instance
     **/
    audio_file_selected: function(selectedAudioFile) {
        WaveformPanel.prototype.audio_file_selected.call(this, selectedAudioFile);
        
        this._load_waveform_image(
            selectedAudioFile.get_waveform_src(10),
            function(me, selectedAudioFile) {
                return function() {
                    me.highlighter.audio_file_selected(selectedAudioFile);
                }
            }(this, selectedAudioFile)
        );
    }, 
    
    /**
     *  Called from page when audio segment is selected.
     *
     *  @param  {AudioSegment}    selectedAudioSegment    - The audio segment
     **/
    audio_segment_selected: function(selectedAudioSegment) {
        WaveformPanel.prototype.audio_segment_selected.call(this, selectedAudioSegment);
        
        this.waveformImageElement.attr('src', selectedAudioSegment.get('audioFile').get_waveform_src(10));
    }, 
    
    /**
     *  The resolution of the waveform image (in pixels per second)
     **/
    get_resolution: function() {
        /* Width of image is currently always 898 */
        var width = 898;
        
        /* current duration of audio file */
        var duration = this.audioFileDuration;
        
        return width/duration;
    },

    handle_click: function(left) {
        //update audio's currentTime to location clicked
        var seconds = left/this.get_resolution();
        this.page.move_audio(seconds);
    }, 
    
})