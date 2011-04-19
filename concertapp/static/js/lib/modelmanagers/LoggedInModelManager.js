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
    
    /* Any page that has collections represented will require a master list of collections we have seen */
    this.seenInstances['collection'] = new CollectionSet;

    /* Master list of requests */
    this.seenInstances['request'] = new RequestSet;
    
    /**
     *  The user who is currently logged in.
     **/
    var user = new User;
    this.user = user;
    
    /* We will need to maintain a list of users that we have seen */
    this.seenInstances['user'] = new UserSet([user], {
        seenInstances: true 
    });
    
    /* Audio objects that we have seen */
    this.seenInstances['audiofile'] = new AudioFileSet;
    
    /* Audio segments that we have seen */
    this.seenInstances['audiosegment'] = new AudioSegmentSet;
    
    /* Tags that we have seen */
    this.seenInstances['tag'] = new TagSet;
    
    /* Comments we have seen */
    this.seenInstances['comment'] = new CommentSet;
    
    /* All events we have seen */
    this.seenInstances['event'] = new EventSet;
    
    /* Events of all type */
    this.seenInstances['audiofileuploadedevent'] = new AudioFileUploadedEventSet;
    this.seenInstances['audiosegmentcreatedevent'] = new AudioSegmentCreatedEventSet;
    this.seenInstances['audiosegmenttaggedevent'] = new AudioSegmentTaggedEventSet;
    this.seenInstances['createcollectionevent'] = new CreateCollectionEventSet;
    this.seenInstances['joincollectionevent'] = new JoinCollectionEventSet;
    this.seenInstances['leavecollectionevent'] = new LeaveCollectionEventSet;
    this.seenInstances['requestdeniedevent'] = new RequestDeniedEventSet;
    this.seenInstances['requestjoincollectionevent'] = new RequestJoinCollectionEventSet;
    this.seenInstances['requestrevokedevent'] = new RequestRevokedEventSet;
    
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
