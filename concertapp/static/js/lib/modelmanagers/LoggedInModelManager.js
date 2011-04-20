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
    
    this.seenInstances['user'].add(user);
    
    
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
