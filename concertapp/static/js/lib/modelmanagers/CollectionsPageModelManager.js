/**
 *  @file       CollectionsPageModelManager.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  
 *  @class
 **/
function CollectionsPageModelManager(params) {
    if(params) {
        this.init(params);
    }
}
CollectionsPageModelManager.prototype = new LoggedInModelManager();

/**
 *  @constructor
 **/
CollectionsPageModelManager.prototype.init = function(params) {
    LoggedInModelManager.prototype.init.call(this, params);

    var dataToLoad = this._dataToLoad;
        
    /** The raw collection data for the collections that the current user has
        requested to join **/
    var requestData = params.requests;
    if(typeof(requestData) == 'undefined') {
        throw new Error('params.requests is undefined');
    }
    dataToLoad.requestData = requestData;
    
    /*  Backbone set that will hold the Concert Collection objects
        that the user has requested to join */
    this.userRequests = new RequestSet;
    
    
};

CollectionsPageModelManager.prototype._loadData = function() {
    LoggedInModelManager.prototype._loadData.call(this);
    
    var dataToLoad = this._dataToLoad;
    
    var seenInstances = concertapp.page.modelManager.seenInstances['collection'];
    
    var userMemberCollections = this.userMemberCollections;
    for(var i=0, il = userMemberCollections.length; i < il; i++) {
        if(userMemberCollections.at(i).get('admin') == this.user) {
            userMemberCollections.at(i).set({'user_is_admin': true});
        }
    }
            
    var seenRequests = this.seenInstances['request'];
    this.userRequests.refresh(dataToLoad.requestData);
    dataToLoad.requestData = null;
};

/**
 *  Create a new collection.  The user who is logged in is the administrator, as
 *  there is no other way to create a collection in Concert.
 *
 *  @param  {String}    name    -   The name of the new collection.
 **/
CollectionsPageModelManager.prototype.create_new_collection = function(name) {
    var user = this.user;
    
    /* Create new collection */
    var newCollection = new Collection({
        name: name,
        users: new UserSet(user),
        admin: user,
        'user_is_admin': true
    });
    
    /* Add to collections */
//    this.userAdminCollections.add(newCollection); - we no longer hvae userAdminCollections
    this.userMemberCollections.add(newCollection);
    

    /* Save to server */
    newCollection.save(null, {
        error_callback: function(newCollection) {
            return function() {
                newCollection.destroy();
            }
        }(newCollection), 
        error_message: 'Collection was not created'
    });
};

/**
 *  Request to join a collection.  This can be moved to a parent class if the
 *  functionality is desired in other pages.
 *
 *  @param  {Collection}    col    -    The Concert Collection that we are requesting
 *  to join.
 **/
CollectionsPageModelManager.prototype.request_to_join = function(col) {
    var newRequest = new Request({
        collection: col, 
        user: this.user
    });
    
    newRequest.save(null, {
        error_callback: function(newRequest) {
            return function() {
                newRequest.destroy();                
            };
        }(newRequest),
        error_message: 'Request was not sent'
    });
    
    this.userRequests.add(newRequest);
};

