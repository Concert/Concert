/**
 *  @file       User.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  User represents a django User object.
 *  @class
 *  @extends    Backbone.Model
 **/ 
var User = ConcertBackboneModel.extend(
	/**
	 *	@scope	User.prototype
	 **/
{
    name: 'user' 
});

/**
 *  Users represents a collection of django User objects.
 *  @class
 **/
var UserSet = ConcertBackboneCollection.extend(
	/**
	 *	@scope	UserSet.prototype
	 **/
{
    model: User
});