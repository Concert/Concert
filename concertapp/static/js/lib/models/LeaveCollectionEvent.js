/**
 *  @file       LeaveCollectionEvent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  When a user leaves a collection.
 *  @extends    ConcertBackboneModel
 **/
var LeaveCollectionEvent = Event.extend(
    /**
     *  @scope  LeaveCollectionEvent.prototype
     **/
{
    name: 'leavecollectionevent', 
    
});

/**
 *  @class  A set of LeaveCollectionEvent objects
 *  @extends    ConcertBackboneCollection
 **/
var LeaveCollectionEventSet = ConcertBackboneCollection.extend(
    /**
     *  @scope  LeaveCollectionEventSet.prototype
     **/
{
    model: LeaveCollectionEvent
});