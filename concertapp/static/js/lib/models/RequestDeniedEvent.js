/**
 *  @file       RequestDeniedEvent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  When a user is denied from a collection.
 *  @extends    ConcertBackboneModel
 **/
var RequestDeniedEvent = ConcertBackboneModel.extend(
    /**
     *  @scope  RequestDeniedEvent.prototype
     **/
{
    
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