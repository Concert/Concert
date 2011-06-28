/**
 *  @file       RequestRevokedEvent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  When a user revokes her/his join request
 *  @extends    ConcertBackboneModel
 **/
var RequestRevokedEvent = Event.extend(
    /**
     *  @scope  RequestRevokedEvent.prototype
     **/
{
    name: 'requestrevokedevent' 
    
});

/**
 *  @class  A set of RequestRevokedEvent objects
 *  @extends    ConcertBackboneCollection
 **/
var RequestRevokedEventSet = ConcertBackboneCollection.extend(
    /**
     *  @scope  RequestRevokedEventSet.prototype
     **/
{
    model: RequestRevokedEvent
});