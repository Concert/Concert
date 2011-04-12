/**
 *  @file       RequestJoinCollectionEvent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  When a user requests to join a collection
 *  @extends    ConcertBackboneModel
 **/
var RequestJoinCollectionEvent = ConcertBackboneModel.extend(
    /**
     *  @scope  RequestJoinCollectionEvent.prototype
     **/
{
    
});

/**
 *  @class  A set of RequestJoinCollectionEvent objects
 *  @extends    ConcertBackboneCollection
 **/
var RequestJoinCollectionEventSet = ConcertBackboneCollection.extend(
    /**
     *  @scope  RequestJoinCollectionEventSet.prototype
     **/
{
    model: RequestJoinCollectionEvent
});