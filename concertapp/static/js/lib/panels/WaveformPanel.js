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
        
        var fileWasSelected = false;
        this.fileWasSelected = fileWasSelected;
        var segmentWasSelected = false;
        this.segmentWasSelected = segmentWasSelected;
        var fileWaveformWasLoaded = false;
        this.fileWaveformWasLoaded = fileWaveformWasLoaded;
        var segmentWaveformWasLoaded = false;
        this.segmentWaveformWasLoaded = segmentWaveformWasLoaded;
        
        /* The duration of the last selected audio file (or segment parent) */
        this.audioFileDuration = null;
                
        _.bindAll(this, "audio_file_selected");
        $(this.page).bind('select_file', this.audio_file_selected);
        
        _.bindAll(this, "audio_file_loaded");
        $(this.page.audioController).bind('audio_loaded', this.audio_file_loaded);
        
        _.bindAll(this, "audio_file_waveform_loaded");
        $(this.page.audioController).bind('file_waveform_loaded', this.audio_file_waveform_loaded);
        
        _.bindAll(this, "audio_segment_selected");
        $(this.page).bind('select_segment', this.audio_segment_selected);
        
        _.bindAll(this, "audio_segment_waveform_loaded");
        $(this.page.audioController).bind('segment_waveform_loaded', this.audio_segment_waveform_loaded);
    },
    
    /**
     *  Called from page when an audio file is selected.
     *
     *  @param  {AudioFile}    selectedAudioFile    -   The selected file
     **/
    audio_file_selected: function(e, selectedAudioFile) {
        this.fileWasSelected = true;
        
        this.selectedAudioFile = selectedAudioFile;
        this.audioFileDuration = selectedAudioFile.get('duration');
        this.playheadComponent.reset();
                
    },
    
    audio_file_loaded: function() {
    },
    
    audio_file_waveform_loaded: function() {        
        this.fileWaveformWasLoaded = true;
        if(!this.fileWasSelected) {
            return false;
        }
        
        var waveformImageElement = this.waveformImageElement;

        /* Load the waveform viewer with the audio files' waveform image */
        waveformImageElement.attr('src', this.selectedAudioFile.get_waveform_src(10));
        
    },
    
    /**
     *  Called from page when an audio segment is selected.
     *
     *  @param  {AudioSegment}    selectedAudioSegment    - The selected segment
     **/
    audio_segment_selected: function(e, selectedAudioSegment) {
        this.segmentWasSelected = true;
        
        this.selectedAudioSegment = selectedAudioSegment;
        this.audioFileDuration = selectedAudioSegment.get('audioFile').get('duration');
        this.playheadComponent.reset();
    }, 
        
    audio_segment_waveform_loaded: function() {
        this.segmentWaveformWasLoaded = true;
        if(!this.segmentWasSelected) {
            return;
        }
        
        var waveformImageElement = this.waveformImageElement;

        /* Load the waveform viewer with the audio files' waveform image */
        waveformImageElement.attr('src', this.selectedAudioSegment.get('audioFile').get_waveform_src(10));
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
