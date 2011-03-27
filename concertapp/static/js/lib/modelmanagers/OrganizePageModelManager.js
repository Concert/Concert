/**
 *  @file       OrganizePageModelManager.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  Model manager for the organize page.
 *  @class
 *  @extends    LoggedInModelManager
 **/
function OrganizePageModelManager(params) {
    if(params) {
        this.init(params);
    }
}
OrganizePageModelManager.prototype = new LoggedInModelManager();

/**
 *  @constructor
 **/
OrganizePageModelManager.prototype.init = function(params) {
    LoggedInModelManager.prototype.init.call(this, params);

    var dataToLoad = this._dataToLoad;
    
    /**
     *  The raw audio file data
     **/
    var fileData = params.files;
    if(typeof(fileData) == 'undefined') {
        throw new Error('params.files is undefined');
    }
    dataToLoad.fileData = fileData;
    
    /* Here we will hold the audio files for this collection (just in case others
    are seen) */
    this.collectionAudioFiles = new AudioFileSet;
    
    /**
     *  The raw audio segment data
     **/
    var segmentData = params.segments;
    if(typeof(segmentData) == 'undefined') {
        throw new Error('params.segments is undefined');
    }
    dataToLoad.segmentData = segmentData;
    
    /**
     *  Raw tag data
     **/
    var tagData = params.tags;
    if(typeof(tagData) == 'undefined') {
        throw new Error('params.tags is undefined');
    }
    dataToLoad.tagData = tagData;
    
    /* Here we will hold all of the audio segments for this collection for the
    same reason as above */
    this.collectionAudioSegments = new AudioSegmentSet;
    
    /* Here are all of the tags for this collection */
    this.collectionTags = new TagSet;

    /* Here we will store the audio segments and files that are selected (from the
    audio list panel).  Currently only one segment/file can be selected at once, so 
    the total cardinality of these sets will be 1. */
    this.selectedAudioSegments = new AudioSegmentSet;
    this.selectedAudioFiles = new AudioFileSet;
    
    
};

OrganizePageModelManager.prototype._loadData = function() {
    LoggedInModelManager.prototype._loadData.call(this);
    
    var dataToLoad = this._dataToLoad;
    
    /* Most stuff is watching both files and widgets, so do this silently */
    this.collectionAudioFiles.refresh(dataToLoad.fileData, {silent: true});
    dataToLoad.fileData = null;
    
    var collectionAudioSegments = this.collectionAudioSegments;
    collectionAudioSegments.refresh(dataToLoad.segmentData);
    dataToLoad.segmentData = null;
    

    this.collectionTags.refresh(dataToLoad.tagData);
    dataToLoad.tagData = null;
};

/**
 *  Use this when files are to be selected on the user interface.
 *  
 *  @param  {Array}    params.files    -    The selected audio files
 *  @param  {Array}    params.segments    - The selected audio segments.
 **/
OrganizePageModelManager.prototype.select_audio = function(params) {
    var files = params.files;
    if(typeof(files) == 'undefined') {
        files = [];
    }
    
    var segments = params.segments;
    if(typeof(segments) == 'undefined') {
        segments = [];
    }
    
    /* remove previously selected segments and select new ones */
    this.selectedAudioSegments.refresh(segments);
    /* Remove previously selected files and select new ones */
    this.selectedAudioFiles.refresh(files);
    
    /**
     *  TODO: Refactor code to just use these events.
     **/
    if(files.length == 1 && segments.length == 0) {
        $(this).trigger('audio_file_selected', files[0]);
    }
    else if(files.length == 0 && segments.length == 1) {
        $(this).trigger('audio_segment_selected', segments[0]);
    }
    else if(files.length == 0 && segments.length == 0){
        $(this).trigger('audio_deselected');
    }
    else {
        throw new Error('Not yet implemented multiple selection.');
    }
};
