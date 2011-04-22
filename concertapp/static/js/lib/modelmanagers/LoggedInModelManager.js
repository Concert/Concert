/**
 *  @file       LoggedInModelManager.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
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
 **/
LoggedInModelManager.prototype.create_and_select_new_segment = function(startTime, endTime) {    
    var timestamp = new Date();

    /* The audio file that will be the parent for our new segment */
    var audioFile = null;
    
    var routeName = this.page.currentRoute;
    
    /* If a file is currently selected */
    if(routeName == 'collection_audio_file') {
        audioFile = this.selectedAudioFiles.first();
    } 
    else if(currentRoute == 'collection_audio_segment') {
        audioFile = this.selectedAudioSegments.first().get('audioFile');
    }
    
    /* Create new segment */
    var newSegment = new AudioSegment({
        audioFile: audioFile,
        beginning: startTime,
        end: endTime,
        creator: this.user, 
        name: 'segment_'+timestamp.format('yyyy-mm-dd_hh:MM:ss:L'), 
        collection: this.selectedCollections.first(),
    });

    /* Because newSegment has no ID, it can be added to these sets manually */
    this.selectedCollections.first().get('segments').add(newSegment);
    this.seenInstances['audiosegment'].add(newSegment);
    
    /* Now save to server */
    newSegment.save(null, {
        /* if there is an error */
        error_callback: function(newSegment) {
            return function() {
                /* Delete our new segment */
                newSegment.destroy();
            };
        }(newSegment), 
        error_message: 'Audio segment was not created.', 
        success: function(poop) {
            return function(model, resp) {
                console.log(model.get('id'));
            };
        }(true)
    });
};

