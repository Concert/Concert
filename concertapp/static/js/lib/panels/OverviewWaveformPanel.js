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
            el: this.playheadElement,
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
    }, 
    
    /**
     *  Called from page when an audio file is selected.
     *
     *  @param  {AudioFile}    selectedAudioFile    -   The audio file instance
     **/
    audio_file_selected: function(selectedAudioFile) {
        WaveformPanel.prototype.audio_file_selected.call(this, selectedAudioFile);
        
        this._load_waveform_image(
            selectedAudioFile.get('overviewWaveform'),
            function(me, selectedAudioFile) {
                return function() {
                    me.highlighter.audio_file_selected(selectedAudioFile);
                }
            }(this, selectedAudioFile)
        );
    
        this.playheadComponent.update_speed();
    }, 
    
    /**
     *  Called from page when audio segment is selected.
     *
     *  @param  {AudioSegment}    selectedAudioSegment    - The audio segment
     **/
    audio_segment_selected: function(selectedAudioSegment) {
        WaveformPanel.prototype.audio_segment_selected.call(this, selectedAudioSegment);
        
        this.waveformImageElement.attr('src', selectedAudioSegment.get('audioFile').get('overviewWaveform'));
        
        this.playheadComponent.update_speed();
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
})