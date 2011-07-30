/**
 *  @file       User.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  User represents a django User object.
 *  @extends    ConcertModel
 **/ 
var User = ConcertModel.extend(
	/**
	 *	@scope	User.prototype
	 **/
{
    relations: [
        {
            type: Backbone.HasMany, 
            key: 'memberCollections', 
            relatedModel: 'Collection'
        }
    ], 
    name: 'user',
});

/**
 *  Users represents a collection of django User objects.
 *  @class
 **/
var UserSet = Backbone.Collection.extend(
	/**
	 *	@scope	UserSet.prototype
	 **/
{
    model: User
});