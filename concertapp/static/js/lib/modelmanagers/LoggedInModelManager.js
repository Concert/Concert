/**
 *  @file       LoggedInModelManager.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com
 *  @author     amy wieliczka <amywieliczka [at] gmail.com
 **/
 
/**
 *  This is the manager for datasets when there is a user logged in.  The stuff
 *  below will be necessary on any logged in page.
 *  @class
 **/
function LoggedInModelManager(params) {
    if(params) {
        this.init(params);
    }
}
LoggedInModelManager.prototype = new ModelManager();

LoggedInModelManager.prototype.init = function(params) {
    ModelManager.prototype.init.call(this, params);
    
    
    var dataToLoad = this._dataToLoad;
    
    /* Get data for user */
    var userData = params.userData;
    if(typeof(userData) == 'undefined') {
        throw new Error('params.userData is undefined');
    }
    dataToLoad['userData'] = userData;
    
    /**
     *  The user who is currently logged in.
     **/
    var user = new User;
    this.user = user;
    
    /**
     *  A master list, for each type of model, of each instance we have come
     *  across so we can ensure there are no duplicates.
     **/
    this.seenInstances = {
        collection: new CollectionSet(null, {
            seenInstances: true 
        }), 
        requests: new RequestSet(null, {
            seenInstances: true
        }), 
        user: new UserSet(null, {
            seenInstances: true
        }),
        audiofile: new AudioFileSet(null, {
            seenInstances: true
        }),
        audiosegment: new AudioSegmentSet(null, {
            seenInstances: true
        }), 
        tag: new TagSet(null, {
            seenInstances: true
        }), 
        comment: new CommentSet(null, {
            seenInstances: true
        }), 
        'event': new EventSet(null, {
            seenInstances: true
        }), 
        audiofileuploadedevent: new AudioFileUploadedEventSet(null, {
            seenInstances: true
        }), 
        audiosegmentcreatedevent: new AudioSegmentCreatedEventSet(null, {
            seenInstances: true
        }), 
        audiosegmenttaggedevent: new AudioSegmentTaggedEventSet(null, {
            seenInstances: true
        }), 
        createcollectionevent: new CreateCollectionEventSet(null, {
            seenInstances: true
        }), 
        joincollectionevent: new JoinCollectionEventSet(null, {
            seenInstances: true
        }), 
        leavecollectionevent: new LeaveCollectionEventSet(null, {
            seenInstances: true
        }), 
        requestdeniedevent: new RequestDeniedEventSet(null, {
            seenInstances: true
        }), 
        requestjoincollectionevent: new RequestJoinCollectionEventSet(null, {
            seenInstances: true
        }), 
        requestrevokedevent: new RequestRevokedEventSet(null, {
            seenInstances: true
        })
    }
    
    /* Add user to seen instances */
    this.seenInstances['user'].add(user);
    
    /* The collection(s) which are currently selected */
    this.selectedCollections = new CollectionSet;
    
    /* The currently selected audio */
    this.selectedAudioFiles = new AudioFileSet;
    this.selectedAudioSegments = new AudioSegmentSet;
    
};

/**
 *  Here we will create all of the Backbone objects that are needed from data that
 *  was loaded initially.
 **/
LoggedInModelManager.prototype._loadData = function() {
    var dataToLoad = this._dataToLoad;
    
    /**
     *  Load user info
     **/
    var user = this.user;
    /* First just update id so everything will see that this user exists in 
    seenInstances */
    user.set({id: dataToLoad['userData'].id});
    /* now set rest of attributes */
    user.set(dataToLoad['userData']);
    /* done with user data */
    dataToLoad['userData'] = null;
    
};

/**
 *  Select a collection whose properties or audio we will view.
 *  @param  {Collection|Number}    collection      the selected collection
 **/
LoggedInModelManager.prototype.select_collection = function(collection) {
    /* If we were passed the id of this collection */
    if(_.isNumber(collection) || _.isString(collection)) {
        /* Get actual collection instance */
        collection = this.seenInstances['collection'].get(collection);
    }
    this.selectedCollections.refresh([collection]);
    
    return collection;
};

/**
 *  Select an audio file to view
 *  @param  {AudioFile|Number}    selectedAudioFile     the selected audio file to view
 **/ 
LoggedInModelManager.prototype.select_audiofile = function(selectedAudioFile) {
    /* if we were just passed an id */
    if(_.isNumber(selectedAudioFile) || _.isString(selectedAudioFile)) {
        /* First retrieve file instance */
        selectedAudioFile = this.seenInstances['audiofile'].get(selectedAudioFile);
    }
    
    /* Remove previously selected files and select new one */
    this.selectedAudioFiles.refresh([selectedAudioFile]);
    
    return selectedAudioFile;
};

/**
 *  Select an audio segment to view
 *  @param  {AudioSegment|Number}    selectedAudioSegment       the selected audio segment to view
 **/
LoggedInModelManager.prototype.select_audio_segment = function(selectedAudioSegment) {    
    if(_.isNumber(selectedAudioSegment) || _.isString(selectedAudioSegment)) {
        selectedAudioSegment = this.seenInstances['audiosegment'].get(selectedAudioSegment);
    }
    
    this.selectedAudioSegments.refresh([selectedAudioSegment]);
    
    return selectedAudioSegment;
};


/**
 *  Create new audio segment object and set it as currently selected.
 *
 *  @param  {Number}        startTime   The start time of this new segment
 *  @param  {Number}        endTime     The end time of the new segment
 *  @param  {Function}      callback    The callback to call when saving the new
 *                                      segment is complete.
 **/
LoggedInModelManager.prototype.create_and_select_new_segment = function(startTime, endTime, callback) {    
    var timestamp = new Date();

    /* The audio file that will be the parent for our new segment */
    var audioFile = null;
    
    var routeName = this.page.currentRoute;
    
    /* If a file is currently selected */
    if(routeName == 'collection_audio_file') {
        audioFile = this.selectedAudioFiles.first();
    } 
    else if(routeName == 'collection_audio_segment') {
        audioFile = this.selectedAudioSegments.first().get('audioFile');
    }
    
    var collection = this.selectedCollections.first();
    var user = this.user;
    var eventSeenInstances = this.seenInstances['event'];
    
    /* Create new segment */
    var newSegment = new AudioSegment({
        audioFile: audioFile,
        beginning: startTime,
        end: endTime,
        creator: this.user, 
        name: 'segment_'+timestamp.format('yyyy-mm-dd_hh:MM:ss:L'), 
        collection: collection,
    });
    
    /* Create event */
    var newSegmentEvent = new Event({
        eventType: 1, 
        user: user, 
        audioSegment: newSegment, 
        collection: collection, 
        audioFile: audioFile,
        time: new Date(), 
    });


    /* Add the segment to the list of seen instances, and to the collection.  This
    is hackish because when adding to the collection, it will check seenInstances
    but since the segment does not have an id yet, it will not find a duplicate. */
    collection.get('segments').add(newSegment);
    this.seenInstances['audiosegment'].add(newSegment);
    
    /**
     *  When saving a new AudioSegment or SegmentCratedEvent, if there is a failure.
     *
     *  @param  {AudioSegment}    segment    The segment we're saving.
     *  @param  {Event}         newSegmentEvent The AudioSegmentCreatedEvent
     **/
    var newSegmentFailHandler = function(segment, newSegmentEvent) {
        return function(){
            segment.destroy();
            newSegmentEvent.destroy();
        };
    }(newSegment);
    
    /* Now save segment to server */
    newSegment.save(null, {
        /* upon error */
        error_callback: newSegmentFailHandler, 
        error_message: 'Audio segment was not created.', 
        /* If we saved successfully */
        success: function(segmentModel, segmentResp) {
            /** Add event to segment's lists.  This will happen automatically
            on the backend.  Couldn't do this before segment was saved because
            it would have contained a reference to an event with no id. **/
            newSegment.get('events').add(newSegmentEvent);
            collection.get('events').add(newSegmentEvent);
            audioFile.get('events').add(newSegmentEvent);
            eventSeenInstances.add(newSegmentEvent);

            /* Save event too */
            newSegmentEvent.save(null, {
                /* If event fails, run fail handler also */
                error_callback: newSegmentFailHandler, 
                error_message: 'Event was not created', 
                success: function(eventModel, eventResp) {
                    if(callback) {
                        /* Now event and segment have ids, and we can rest in peace */
                        callback(segmentModel, segmentResp);
                    }
                }, 
            });
        }
    });
};

/**
 *  When the start and end points of the currently selected segment are changed.
 *
 *  @param  {Number}    startTime    The new start time
 *  @param  {Number}    endTime    The new end time
 **/
LoggedInModelManager.prototype.modify_current_segment_times = function(startTime, endTime) {
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
 */
LoggedInModelManager.prototype.delete_audio_segment = function(segment) {
    var collectionAudioSegments = this.selectedCollections.first().get('segments');
    
    /* Remove from current collection's audio segments */
    collectionAudioSegments.remove(segment);
    
    /* If this is the currently selected audio segment */
    if(this.selectedAudioSegments.first() == segment) {
        /* Select parent audio file */
        var collectionId = segment.get('collection').get('id');
        var fileId = segment.get('audioFile').get('id');
        /* Go to new URL */
        window.location.assign('#collection/'+collectionId+'/audio/file/'+fileId);

        console.log("segment deleted was the currently selected audio segment");
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
LoggedInModelManager.prototype.tag_current_segment = function(tagName) {
    /* Find given tag */
    var tag = this.selectedCollections.first().get('tags').find(function(t) {
        return (t.get('name') == tagName);
    });
    
    var currentSegment = this.selectedAudioSegments.first();
    var collection = this.selectedCollections.first();
    var user = this.user;
    var currentSegmentAudioFile = currentSegment.get('audioFile');
    
    /* Wether or not tag is being created right now */
    var tagWasCreated = false;
    /* If tag does not yet exist */
    if(!tag) {
        /* Create it */
        tag = new Tag({
            /* with the given name */
            name: tagName, 
            /* for the current collection */
            collection: collection,
            /* Created by our user */
            creator: user
        });
        
        tagWasCreated = true;
        
        /* Since tag has no id yet, we can add it to seenInstances in the same
        way we do with AudioSegment objects above */
        /* Add to tags for this collection */
        collection.get('tags').add(tag);
        /* Add to seen instances */
        this.seenInstances['tag'].add(tag);
    }


    /* tell tag and segment about eachother, since segment already has an id, this
    will work on server.  Segment.tags is implied on server, and will happen
    automatically, but the relationship will be saved on the server when the 
    tag object is saved. */
    tag.get('segments').add(currentSegment);
    currentSegment.get('tags').add(tag);
    
    /* Create event */
    var segmentTaggedEvent = new Event({
        eventType: 2, 
        time: new Date(), 
        collection: collection, 
        user: user, 
        audioSegment: currentSegment, 
        audioFile: currentSegmentAudioFile, 
        tag: tag
    });
    
    /* Add to event lists.  Will happen automatically on server. */
    collection.get('events').add(segmentTaggedEvent);
    currentSegment.get('events').add(segmentTaggedEvent);
    currentSegmentAudioFile.get('events').add(segmentTaggedEvent);
    this.seenInstances['event'].add(segmentTaggedEvent);
    
    /**
     *  Method to call if tagging a segment fails.
     *
     *  @param  {Collection}    collection    The collection we are in.
     *  @param  {AudioSegment}    segment    The audio segment object being tagged
     *  @param  {Tag}    tag    The tag object.
     *  @param  {Event}    segmentTaggedEvent    The audio segment tagged event.
     *  @param  {Boolean}    tagWasCreated    wether or not the tag object was just
     *                                          instantiated.
     **/
    var tagFailHandler = function(collection, segment, tag, segmentTaggedEvent, tagWasCreated) {
        return function() {
            /* If tag was just created */
            if(tagWasCreated) {
                /* Destroy it */
                tag.destroy();
            }
            else {
                /* Just remove from lists it was just added to */
                currentSegment.get('tags').remove(tag);
                tag.get('segments').remove(currentSegment);
            }
            
            /* Delete event too */
            segmentTaggedEvent.destroy();
        };
    }(collection, currentSegment, tag, segmentTaggedEvent, tagWasCreated);
    
    /* Save changes to tag */
    tag.save(null, {
        error_callback: tagFailHandler,
        error_message: 'Segment was not tagged.',
        /* If segment was successfully tagged, save event */
        success: function(tag, resp) {
            /* Add event to tag's list of events */
            tag.get('events').add(segmentTaggedEvent);
            
            segmentTaggedEvent.save(null, {
                /* If event saving fails, run tagFailHandler also */
                error_callback: tagFailHandler, 
                error_message: 'Event was not created.', 
            });
        }
    });
    
};
