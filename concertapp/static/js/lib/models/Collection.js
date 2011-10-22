/**
 *  @file       Collection.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  @class  A Collection object represents a django Collection object.
 *  @extends    ConcertModel
 **/
var Collection = ConcertModel.extend(
	/**
	 *	@scope	Collection.prototype
	 **/
{
    relations: [
        {
            type: Backbone.HasMany, 
            key: 'users', 
            relatedModel: 'User',
            includeInJSON: "id"
        },
        {
            type: Backbone.HasMany,
            key: 'pendingUsers',
            relatedModel: 'User',
            includeInJSON: "id"
        },
        {
            type: Backbone.HasMany, 
            key: 'events', 
            relatedModel: 'Event',
            includeInJSON: "id",
            collectionType: 'EventSet'
        },
        {
            type: Backbone.HasMany, 
            key: 'files', 
            relatedModel: 'AudioFile',
            includeInJSON: "id"
        },
        {
            type: Backbone.HasMany, 
            key: 'segments', 
            relatedModel: 'AudioSegment',
            includeInJSON: "id"
        },
        {
            type: Backbone.HasMany, 
            key: 'tags', 
            relatedModel: 'Tag',
            includeInJSON: "id"
        },
        {
            type: Backbone.HasOne, 
            key: 'admin', 
            relatedModel: 'User',
            includeInJSON: "id"
        }
    ], 
    name: 'collection',

    initialize: function () {
        ConcertModel.prototype.initialize.apply(this, arguments);

        /**
         *  A master list of audio segments and files, sorted by date
         **/
        this.audio = new BaseAudioSet();

        /**
         *  When we add to our list of segments, add to above list as well.
         **/
        this.get('segments').bind('add', _.bind(function (segment) {
            this.audio.add(segment);
        }, this));

        /* Same with files */
        this.get('files').bind('add', _.bind(function (file) {
            this.audio.add(file);
        }, this));

        /* And when removed */
        this.get('segments').bind('remove', _.bind(function (segment) {
            this.audio.remove(segment);
        }, this));
        this.get('files').bind('remove', _.bind(function (file) {
            this.audio.remove(file);
        }, this));
    }, 


    
    remove_user: function(user) {
        this.get('users').remove(user);
        this.save({
            /* TODO: handle errors */
        });
    },
    
    approve_user: function(user) {
        this.get('pendingUsers').remove(user, {silent: true});
        this.get('users').add(user);
        this.save({
            /* TODO: handle errors */
        });
    },
    
    deny_user: function(user) {
        this.get('pendingUsers').remove(user);
        this.save({
            /* TODO: handle errors */
        });
    }
    
    
    /**
     *  When a user wants to join a collection.
     **/
    // requestToJoin: function() {
    //     var reqs = this.get('requests');
    //     reqs.create({
    //         user: com.concertsoundorganizer.router.user.url(), 
    //         collection: this.url()
    //     });
    // },
    
    /**
     *  When a user wants to leave the collection.
     **/
    // 
    // leave: function() {
    //     var modelManager = com.concertsoundorganizer.modelManager;
    //     var user = modelManager.user;
    //     /* Remove user and save */
    //     this.get('users').remove(user, {
    //         error_message: 'An error occurred while leaving the collection',
    //         /* If there was an error */
    //         error_callback: function(me, removedUser) {
    //             return function() {
    //                 /* Put user back */
    //                 me.get('users').add(removedUser);
    //                 /* Put collection back in user's list */
    //                 removedUser.get('collections').add(me);
    //             };
    //         }(this, user),
    //         save: true
    //     });
    //     /* Remove collection from memberCollections */
    //     user.get('collections').remove(this);
    //     
    // }
    
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
