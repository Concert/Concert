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
    
    /* Every page needs the collections that this user is a member of */
    var userMemberCollectionsData = params.memberCollectionsData;
    if(typeof(userMemberCollectionsData) == 'undefined') {
        throw new Error('params.memberCollectionsData is undefined');
    }
    dataToLoad['userMemberCollectionsData'] = userMemberCollectionsData;
    
    /* Now lets create our Backbone collection of Concert Collections for which
        the current user is a member. */
    this.userMemberCollections = new CollectionSet;
    
    /* Any page that has collections represented will require a master list of collections we have seen */
    this.seenInstances['collection'] = new CollectionSet;


    /* Master list of requests */
    this.seenInstances['request'] = new RequestSet;


    /* We will need to maintain a list of users that we have seen */
    this.seenInstances['user'] = new UserSet;
    
    
    /* Audio objects that we have seen */
    this.seenInstances['audiofile'] = new AudioFileSet;
    
    /* Audio segments that we have seen */
    this.seenInstances['audiosegment'] = new AudioSegmentSet;
    
    /* Tags that we have seen */
    this.seenInstances['tag'] = new TagSet;
    
    /* Comments we have seen */
    this.seenInstances['comment'] = new CommentSet;
    
    /* We will keep a reference to the current user */
    this.user = new User;
    
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
    user.set(dataToLoad['userData']);
    this.seenInstances['user'].add(user);
    /* done with user data */
    dataToLoad['userData'] = null;
    
    /**
     *  Load collection info
     **/
    var userMemberCollections = this.userMemberCollections;
    userMemberCollections.refresh(dataToLoad['userMemberCollectionsData']);
    dataToLoad['userMemberCollectionsData'] = null;
    
};
