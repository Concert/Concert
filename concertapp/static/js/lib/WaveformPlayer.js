/**
 *  @file WaveformPlayer.js
 *  WaveformPlayer.js contains all of the functionality associated with the WaveformPlayer class.
 **/

/**
 *  WaveformPlayer is the constructor for a WaveformPlayer object.  WaveformPlayer
 *  object is a child of the WaveformViewer class, as it is essentially the same thing,
 *  it just does not allow highlighting, and is not associated with a WaveformEditor.
 *  
 *  @param              containerID             The id of the container element.
 *  @param              audioID                 The id of the associated audio element.
 *  @return             this                    Constructor
 **/

var WaveformPlayer = function(containerID, audioID) {
        
    this.initialize(containerID, audioID);
    
    return this;
}
/**
 *  WaveformPlayer objects inherit from the WaveformViewer class
 **/
WaveformPlayer.prototype = new WaveformViewer();

/**
 *  initialize
 *  Function that runs initially, called by constructor.  Initializes all members
 *  and checks all elements being retrieved from DOM for errors.
 *
 *  @param          containerID             The id of the container element.
 *  @param          audioID                 The id of the associated audio element.
 **/ 
WaveformPlayer.prototype.initialize = function(containerID, audioID) {
    /* Set container members */
    this.set_container(containerID);
    /* Set audio members */
    this.set_audio(audioID);
    
    /* The object to animate is the playhead */
    this.playheadElement = $('#'+this.id+' > div.playhead').get(0);
    if(!this.playheadElement) {
      throw new Error('WaveformPlayer: Unable to set playhead element.');
    }
    
    /* also save timecode element */
    this.timecodeElement = $('#'+this.id+' > div.timecode').get(0);
    if(!this.timecodeElement) {
      throw new Error('WaveformPlayer: Unable to set timecode element.');
    }
    
    /* container width */
    this.waveformWidth = 800;
    
    /* Highlighter on viewer */
    this.highlighter = new HighlightViewer({
        highlightElement: $(this.container).children('#viewer_highlight'), 
        container: this.container, 
        waveformElement: $(this.container).children('#viewer_image'),
        waveformWidth: this.waveformWidth,
        audioElementDuration: this.audioElement.duration
    });
    
    /* Behavior when container is clicked */
    $(this.container).click(function(obj){ return function(event) { obj.clicked(event); } }(this));
    
    /* behavior if highlight occurs on viewer */
    $(this.container).bind('highlight', function(obj){ return function(e, data){ obj.start_loop(data); } }(this));
    /* behavior if highlight clear occurs on self */
    $(this.container).bind('clear_highlight', function(obj){ return function(e){ obj.clear_loop(); }}(this));
    
}