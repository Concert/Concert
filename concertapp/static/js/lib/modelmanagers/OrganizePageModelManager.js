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
    
    /**
     *  The current collection we are organizing.
     **/
    this.collection = new Collection;
};

OrganizePageModelManager.prototype._loadData = function() {
    LoggedInModelManager.prototype._loadData.call(this);
    
    var dataToLoad = this._dataToLoad;
    
    /* Load current collection */
    this.collection.set(dataToLoad.collectionData);
    dataToLoad.collectionData = null;
    
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
    
    var selectedAudioSegments = this.selectedAudioSegments;
    var selectedAudioFiles = this.selectedAudioFiles;
    
    /* Deselect everything */
    selectedAudioSegments.each(function(seg){
        seg.set({
            selected: false 
        });
    });
    selectedAudioFiles.each(function(file){
        file.set({
            selected: false 
        });
    });
    
    /* remove previously selected segments and select new ones */
    selectedAudioSegments.refresh(segments);
    /* Remove previously selected files and select new ones */
    selectedAudioFiles.refresh(files);
    
    /* Set all instances to selected */
    selectedAudioSegments.each(function(seg){
        seg.set({
            selected: true
        });
    });
    selectedAudioFiles.each(function(file){
        file.set({
            selected: true
        });
    });

};

/**
 *  Create new audio segment object and set it as currently selected.
 **/
OrganizePageModelManager.prototype.create_and_select_new_segment = function(startTime, endTime) {
    
    var selectedSegments = this.selectedAudioSegments;
    var selectedFiles = this.selectedAudioFiles;
    
    /* The audio file that will be the parent for our new segment */
    var audioFile = null;
    
    /* If a segment is currently selected */
    if(selectedSegments.length) {
        /* Use segment's parent audio file */
        audioFile = selectedSegments.first().get('audioFile');
    }
    /* If a file is currently selected */
    else if(selectedFiles.length) {
        /* Use it as the segment's parent */
        audioFile = selectedFiles.first();
    }
    
    var timestamp = new Date();
    
    /* Create new segment */
    var newSegment = new AudioSegment({
        audioFile: audioFile, 
        beginning: startTime, 
        end: endTime,
        /* Creator of the segment is the current user */
        creator: this.user, 
        /* For now, name is just timestamp */
        name: 'segment_'+timestamp.format('yyyy-mm-dd_hh:MM:ss:L'), 
        /* Collection is current collection */
        collection: this.collection, 
    });
    
    /* Add to this collection's audio segments */
    this.collectionAudioSegments.add(newSegment);
    
    /* Select new segment */
    this.page.select_audio({
        segments: [newSegment], 
    });
    
    /* Now save to server */
    newSegment.save(null, {
        /* if there is an error */
        error_callback: function(newSegment) {
            return function() {
                /* Delete our new segment */
                newSegment.destroy();
            }
        }(newSegment), 
        error_message: 'Audio segment was not created.' 
    });
};

/**
 *  When the start and end points of the currently selected segment are changed.
 *
 *  @param  {Number}    startTime    The new start time
 *  @param  {Number}    endTime    The new end time
 **/
OrganizePageModelManager.prototype.modify_current_segment_times = function(startTime, endTime) {
    /* get current segment */
    var currentSegment = this.selectedAudioSegments.first();
    
    /* Save current values */
    var oldStartTime = currentSegment.get('beginning');
    var oldEndTime = currentSegment.get('end');
    
    /* update values */
    currentSegment.set({
        beginning: startTime, 
        end: endTime
    });
    
    /* Tell page we've updated */
    this.page.select_audio({
        segments: [currentSegment]
    });
    
    /* Try to save */
    currentSegment.save(null, {
        /* if stuff fails */
        error_callback: function(oldStartTime, oldEndTime, currentSegment) {
            return function() {
                /* go back to old times */
                currentSegment.set({
                    beginning: startTime, 
                    end: endTime 
                });
            };
        }(oldStartTime, oldEndTime, currentSegment), 
        error_message: 'Audio segment was not modified' 
    });
};

/**
 *  When an audio segment is to be deleted.
 *
 *  @param  {AudioSegment}  segment     The audio segment we're deleting
 **/
OrganizePageModelManager.prototype.delete_audio_segment = function(segment) {
    var collectionAudioSegments = this.collectionAudioSegments;
    
    /* Remove from current collection's audio segments */
    collectionAudioSegments.remove(segment);
    
    /* If this is the currently selected audio segment */
    if(this.selectedAudioSegments.first() == segment) {
        /* Select parent audio file */
        this.page.select_audio({
            files: [segment.get('audioFile')]
        });
    }
    
    /* Delete audio segment */
    segment.destroy({
        /* If there was a problem */
        error_callback: function(segment, collectionAudioSegments) {
            return function() {
                /* Put back in audio segments list for current collection */
                collectionAudioSegments.add(segment);
            }
        }(segment, collectionAudioSegments), 
        error_message: 'Audio segment was not deleted'
    });
};

/**
 *  When the current segment is to be tagged.
 *
 *  @param  {String}    tagName    The name of the tag to give this segment.
 **/
OrganizePageModelManager.prototype.tag_current_segment = function(tagName) {
    
    /* Find given tag */
    var tag = this.collectionTags.find(function(t) {
        return (t.get('name') == tagName);
    });
    
    var currentSegment = this.selectedAudioSegments.first();
    
    /* If tag does not yet exist */
    if(!tag) {
        /* Create it */
        tag = new Tag({
            /* with the given name */
            name: tagName, 
            /* for the current collection */
            collection: this.collection, 
            /* Created by our user */
            creator: this.user, 
        });
        
        /* Save tag */
        tag.save(null, {
            /* if there was an error */
            error_callback: function(model) {
                /* delete tag */
                model.destroy();
            }, 
            error_message: 'Tag was not created.', 
            success: function(segment, page) {
                return function(tag) {
                    tag.get('segments').add(segment);
                    segment.get('tags').add(tag, {
                        /* save changes to server */
                        save: true, 
                        /* if error */
                        error_callback: function(addedTag) {
                            return function(seg) {
                                /* remove tag from segment */
                                seg.get('tags').remove(addedTag);
                                addedTags.get('segments').remove(seg);
                            };
                        }(tag), 
                        error_message: 'Segment was not tagged.',
                        success: function(me){
                            return function( ){
                                /* Tell page to re-render for our audio again */
                                me.page.select_audio({
                                    segments: [me.selectedAudioSegments.first()], 
                                });
                            }
                        }(this), 
                    });
                };
            }(currentSegment, this.page), 
        });
    }
    else {
        /* tell tag and segment about eachother */
        tag.get('segments').add(currentSegment);
        currentSegment.get('tags').add(tag, {
            /* save changes to server */
            save: true, 
            /* if error */
            error_callback: function(addedTag) {
                return function(seg) {
                    /* remove tag from segment */
                    seg.get('tags').remove(addedTag);
                    addedTags.get('segments').remove(seg);
                };
            }(tag), 
            error_message: 'Segment was not tagged.'
        });
        /* Tell page to re-render for our audio again */
        this.page.select_audio({
            segments: [this.selectedAudioSegments.first()], 
        });
    }
    
    
};



