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
     *  Raw collection data for the current collection
     **/
    var collectionData = params.collectionData;
    if(typeof(collectionData) == 'undefined') {
        throw new Error('params.collectionData is undefined');
    }
    dataToLoad.collectionData = collectionData;
    
    /**
     *  The raw audio file data
     *
    var fileData = params.files;
    if(typeof(fileData) == 'undefined') {
        throw new Error('params.files is undefined');
    }
    dataToLoad.fileData = fileData;
    
    /* Here we will hold the audio files for this collection (just in case others
    are seen) 
    this.collectionAudioFiles = new AudioFileSet;
    
    /**
     *  The raw audio segment data
     *
    var segmentData = params.segments;
    if(typeof(segmentData) == 'undefined') {
        throw new Error('params.segments is undefined');
    }
    dataToLoad.segmentData = segmentData;
    */
    /**
     *  Raw tag data
     *
    var tagData = params.tags;
    if(typeof(tagData) == 'undefined') {
        throw new Error('params.tags is undefined');
    }
    dataToLoad.tagData = tagData;*/
    
    /**
     *  Raw data for each type of event
     **/
    var eventDataSetNames = [
        'audioSegmentCreatedEventData', 
        'audioSegmentTaggedEventData', 
        'audioFileUploadedEventData', 
        'joinCollectionEventData', 
        'leaveCollectionEventData', 
        'createCollectionEventData', 
        'requestJoinCollectionEventData', 
        'requestDeniedEventData', 
        'requestRevokedEventData', 
        'requestJoinCollectionEventData'
    ];
    this.eventDataSetNames = eventDataSetNames;
    
    /* And corresponding sets to hold these events in by type */
    var collectionEventSets = [
        new AudioSegmentCreatedEventSet,
        new AudioSegmentTaggedEventSet,
        new AudioFileUploadedEventSet,
        new JoinCollectionEventSet,
        new LeaveCollectionEventSet,
        new CreateCollectionEventSet,
        new RequestJoinCollectionEventSet,
        new RequestDeniedEventSet,
        new RequestRevokedEventSet,
        new RequestJoinCollectionEventSet
    ];
    this.collectionEventSets = collectionEventSets;
    

    for(var i = 0, il = eventDataSetNames.length; i < il; i++) {
        var eventDataSetName = eventDataSetNames[i];
        
        var eventDataSet = params[eventDataSetName];
        if(typeof(eventDataSet) == 'undefined') {
            throw new Error('params['+eventDataSetName+'] is undefined');
        }
        dataToLoad[eventDataSetName] = eventDataSet;
    }
    
    
    /* Here we will hold all of the audio segments for this collection for the
    same reason as above 
    this.collectionAudioSegments = new AudioSegmentSet;
    */
    /* Here are all of the tags for this collection 
    this.collectionTags = new TagSet;*/
        
    /**
     *  The current collection we are organizing.
     **/
    this.collection = null;
};

OrganizePageModelManager.prototype._loadData = function() {
    LoggedInModelManager.prototype._loadData.call(this);
    
    var dataToLoad = this._dataToLoad;
    
    /* Load current collection */
    var collection = this.seenInstances['collection'].get(dataToLoad.collectionData.id);
    if(!collection) {
        collection = new Collection();
    }
    collection.set(dataToLoad.collectionData);
    this.collection = collection;
    dataToLoad.collectionData = null;
        
    /* Load data for all events */
    var collectionEventSets = this.collectionEventSets;
    var eventDataSetNames = this.eventDataSetNames;

    for(var i = 0, il = eventDataSetNames.length; i < il; i++) {
        var eventDataSetName = eventDataSetNames[i];        
        collectionEventSets[i].refresh(dataToLoad[eventDataSetName]);
        dataToLoad[eventDataSetName] = null;
    }
    
}

/**
 *  Create new audio segment object and set it as currently selected.
 **/
OrganizePageModelManager.prototype.create_and_select_new_segment = function(startTime, endTime, audioFile) {    
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
    this.seenInstances['audiosegment'].add(newSegment);
    
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
        
        /* Add to seen instances */
        this.seenInstances['tag'].add(tag);
        /* Add to tags for this collection */
        this.collectionTags.add(tag);
    }

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
    
    
    
};




