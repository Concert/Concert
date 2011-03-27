/**
 *  @file       Collection.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  A Collection object represents a django Collection object.
 *  @class
 **/
var Collection = ConcertBackboneModel.extend(
	/**
	 *	@scope	Collection.prototype
	 **/
{
    
    oneToManyAttributes: function() {
        return [
            {
                attr: 'requests', 
                collectionType: RequestSet
            },
            {
                attr: 'users', 
                collectionType: UserSet
            }
        ];
    },
    foreignKeyAttributes: function() {
        return [
            {
                attr: 'admin', 
                model: User, 
            }
        ]
    },
    name: 'collection',
    /**
     *  When a user wants to join a collection.
     **/
    requestToJoin: function() {
        var reqs = this.get('requests');
        reqs.create({
            user: com.concertsoundorganizer.page.user.url(), 
            collection: this.url()
        });
    },
    /**
     *  When a user wants to leave the collection.
     **/
    leave: function() {
        var modelManager = com.concertsoundorganizer.modelManager;
        var user = modelManager.user;
        var userMemberCollections = modelManager.userMemberCollections;
        /* Remove user and save */
        this.get('users').remove(user, {
            error_message: 'An error occurred while leaving the collection',
            error_callback: function(me, userMemberCollections, removedUser) {
                return function() {
                    me.get('users').add(removedUser);
                    userMemberCollections.add(me);
                };
            }(this, userMemberCollections, user),
            save: true
        });
        /* Remove collection from memberCollections */
        userMemberCollections.remove(this);
        
    },
    
});


/**
 *  A Collections object represents a collection of django Collection objects.
 *  (I know, really confusing.  Uppercase Collection means a "Concert Collection", 
 *  while lowercase collection just means a set or array)
 *  @class
 **/
var CollectionSet = ConcertBackboneCollection.extend(
	/**
	 *	@scope	CollectionSet.prototype
	 **/
{
    model: Collection,
});
