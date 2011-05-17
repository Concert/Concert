/**
 *  @file       WaveformPanel.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  Abstract class for housing functionality relating to both waveform panels
 *  @class
 *  @extends    Panel
 **/
var WaveformPanel = Panel.extend(
	/**
	 *	@scope	WaveformPanel.prototype
	 **/
{
    initialize: function() {
        Panel.prototype.initialize.call(this);

        var params = this.options;
                                
        /* The image element */
        var waveformImageElement = this.el.find('.waveform_image');
        if(typeof(waveformImageElement) == 'undefined') {
            throw new Error('this.el.find(\'.waveform_image\') is undefined');
        }
        else if(waveformImageElement.length == 0) {
            throw new Error('waveformImageElement not found');
        }
        this.waveformImageElement = waveformImageElement;
        
        /* The playhead element */
        var playheadElement = this.el.find('.playhead');
        if(typeof(playheadElement) == 'undefined') {
            throw new Error('playheadElement is undefined');
        }
        else if(playheadElement.length == 0) {
            throw new Error('playheadElement not found');
        }
        this.playheadElement = playheadElement;
        
        /* The duration of the last selected audio file (or segment parent) */
        this.audioFileDuration = null;
        
        _.bindAll(this, "audio_segment_selected");
        $(this.page.modelManager).bind('select_segment', this.audio_segment_selected);
        
        _.bindAll(this, "audio_file_selected");
        $(this.page.modelManager).bind('select_file', this.audio_file_selected);
        
    },
    
    /**
     *  Called from page when an audio file is selected.
     *
     *  @param  {AudioFile}    selectedAudioFile    -   The selected file
     **/
    audio_file_selected: function(e, selectedAudioFile) {
        this.audioFileDuration = selectedAudioFile.get('duration');
        this.playheadComponent.reset();
    },
    
    /**
     *  Called from page when an audio segment is selected.
     *
     *  @param  {AudioSegment}    selectedAudioSegment    - The selected segment
     **/
    audio_segment_selected: function(e, selectedAudioSegment) {
        this.audioFileDuration = selectedAudioSegment.get('audioFile').get('duration');
        this.playheadComponent.reset();
    }, 
    
    /**
     *  Called from page when waveform highlight should be cleared.
     **/
    clear_waveform_highlight: function() {
        this.highlighter.disable();
    }, 
    
    /**
     *  Called from page when waveform should highlight
     **/
    highlight_waveform: function(startTime, endTime) {
        /* Draw highlight */
        this.highlighter.draw_highlight_sec(startTime, endTime);
        this.highlighter.enable();
    },
    
    /**
     *  Called from internal when waveform image is to be loaded.
     *
     *  @param  {String}    src    -    The url of the waveform image.
     *  @param  {Function}    callback  -   to be executed after waveform loads.
     **/
    _load_waveform_image: function(src, callback) {
        var waveformImageElement = this.waveformImageElement;
        
        /* When waveform image has loaded, execute callback */
        waveformImageElement.imagesLoaded(callback);
        
        /* Load the waveform viewer with the audio files' waveform image */
        waveformImageElement.attr('src', src);
        
    }, 
});
