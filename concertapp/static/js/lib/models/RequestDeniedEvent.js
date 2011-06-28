/**
 *  @file       RequestDeniedEvent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  When a user is denied from a collection.
 *  @extends    ConcertBackboneModel
 **/
var RequestDeniedEvent = Event.extend(
    /**
     *  @scope  RequestDeniedEvent.prototype
     **/
{
    name: 'requestdeniedevent' 
    
});

/**
 *  @class  A set of RequestDeniedEvent objects
 *  @extends    ConcertBackboneCollection
 **/
var RequestDeniedEventSet = ConcertBackboneCollection.extend(
    /**
     *  @scope  RequestDeniedEventSet.prototype
     **/
{
    model: RequestDeniedEvent
});