/**
 *  @file       JoinCollectionEvent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  When a user's join request is approved.
 *  @extends    ConcertBackboneModel
 **/
var JoinCollectionEvent = ConcertBackboneModel.extend(
    /**
     *  @scope  JoinCollectionEvent.prototype
     **/
{
    
});

/**
 *  @class  A set of JoinCollectionEvent objects
 *  @extends    ConcertBackboneCollection
 **/
var JoinCollectionEventSet = ConcertBackboneCollection.extend(
    /**
     *  @scope  JoinCollectionEventSet.prototype
     **/
{
    model: JoinCollectionEvent
});