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
        
        var itemWasSelected = false;
        this.itemWasSelected = itemWasSelected;
        var waveformWasLoaded = false;
        this.waveformWasLoaded = waveformWasLoaded;
        
        /* The duration of the last selected audio file (or segment parent) */
        this.audioFileDuration = null;
                
        _.bindAll(this, "_waveform_loaded");
        this.router.audioController.bind('waveform_loaded', this._waveform_loaded);
        
        /* When the controller is in the process of creating a new audio segment */
        _.bindAll(this, 'show_loading_notification');
        this.router.bind('creating_new_segment', this.show_loading_notification);
        
    },
    
    /**
     *  Called from router when an audio file is selected.
     *
     *  @param  {AudioFile}    selectedAudioFile    -   The selected file
     **/
    render_collection_audio_file: function(collectionId, fileId, selectedCollection, selectedAudioFile) {
        this.hide_loading_notification();

        this.itemWasSelected = true;
        
        this.selectedAudioFile = selectedAudioFile;
        if(this.waveformWasLoaded) {
            this._waveform_loaded();
        }
        
        this.audioFileDuration = selectedAudioFile.get('duration');
        this.playheadComponent.reset();
    },
    
    /**
     *  Called from router when an audio segment is selected.
     *
     *  @param  {AudioSegment}    selectedAudioSegment    - The selected segment
     **/
    render_collection_audio_segment: function(collectionId, fileId, segmentId, selectedCollection, selectedAudioFile, selectedAudioSegment) {
        this.hide_loading_notification();

        this.itemWasSelected = true;
        
        this.selectedAudioSegment = selectedAudioSegment;
        this.selectedAudioFile = selectedAudioFile;
        if(this.waveformWasLoaded) {
            this._waveform_loaded();
        }
        
        this.audioFileDuration = selectedAudioFile.get('duration');
        this.playheadComponent.reset();
    },
    
    _waveform_loaded: function() {
        this.waveformWasLoaded = true;
        if(!this.itemWasSelected) {
            return;
        } 
        
        var waveformImageElement = this.waveformImageElement;
        
        /* Load the waveform viewer with the audio files' waveform image */
        waveformImageElement.attr('src', this.selectedAudioFile.get_waveform_src(10));
    },
    
    /**
     *  Called from router when waveform highlight should be cleared.
     **/
    clear_waveform_highlight: function() {
        this.highlighter.disable();
    }, 
    
    /**
     *  Called from router when waveform should highlight
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
