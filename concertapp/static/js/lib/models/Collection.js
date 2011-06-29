/**
 *  @file       Collection.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  @class  A Collection object represents a django Collection object.
 *  @extends    Backbone.RelationalModel
 **/
var Collection = Backbone.RelationalModel.extend(
	/**
	 *	@scope	Collection.prototype
	 **/
{
    relations: [
        {
            type: Backbone.HasMany, 
            key: 'users', 
            relatedModel: 'User', 
            includeInJSON: true
        },
        {
            type: Backbone.HasMany, 
            key: 'events', 
            relatedModel: 'Event', 
            includeInJSON: true
        },
        {
            type: Backbone.HasMany, 
            key: 'files', 
            relatedModel: 'AudioFile', 
            includeInJSON: true
        },
        {
            type: Backbone.HasMany, 
            key: 'segments', 
            relatedModel: 'AudioSegment', 
            includeInJSON: true
        },
        {
            type: Backbone.HasMany, 
            key: 'tags', 
            relatedModel: 'Tag', 
            includeInJSON: true
        },
        {
            type: Backbone.HasOne, 
            key: 'admin', 
            relatedModel: 'User'
        }
    ], 
    name: 'collection',
    /**
     *  When a user wants to join a collection.
     **/
    requestToJoin: function() {
        var reqs = this.get('requests');
        reqs.create({
            user: com.concertsoundorganizer.router.user.url(), 
            collection: this.url()
        });
    },
    /**
     *  When a user wants to leave the collection.
     **/
    leave: function() {
        var modelManager = com.concertsoundorganizer.modelManager;
        var user = modelManager.user;
        /* Remove user and save */
        this.get('users').remove(user, {
            error_message: 'An error occurred while leaving the collection',
            /* If there was an error */
            error_callback: function(me, removedUser) {
                return function() {
                    /* Put user back */
                    me.get('users').add(removedUser);
                    /* Put collection back in user's list */
                    removedUser.get('collections').add(me);
                };
            }(this, user),
            save: true
        });
        /* Remove collection from memberCollections */
        user.get('collections').remove(this);
        
    }
    
});


/**
 *  A Collections object represents a collection of django Collection objects.
 *  (I know, really confusing.  Uppercase Collection means a "Concert Collection", 
 *  while lowercase collection just means a set or array)
 *  @class
 **/
var CollectionSet = Backbone.Collection.extend(
	/**
	 *	@scope	CollectionSet.prototype
	 **/
{
    model: Collection
});
