/**
 *  @file       User.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  User represents a django User object.
 *  @extends    Backbone.RelationalModel
 **/ 
var User = Backbone.RelationalModel.extend(
	/**
	 *	@scope	User.prototype
	 **/
{
    relations: [
        {
            type: Backbone.HasMany, 
            key: 'memberCollections', 
            relatedModel: 'Collection', 
            includeInJSON: true
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