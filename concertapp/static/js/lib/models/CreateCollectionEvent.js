/**
 *  @file       CreateCollectionEvent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  When a user creates a collection.  This is the first event of any 
 *  collection.
 *  @extends    ConcertBackboneModel
 **/
var CreateCollectionEvent = ConcertBackboneModel.extend(
    /**
     *  @scope  CreateCollectionEvent.prototype
     **/
{
    
});

/**
 *  @class  A set of CreateCollectionEvent objects
 *  @extends    ConcertBackboneCollection
 **/
var CreateCollectionEventSet = ConcertBackboneCollection.extend(
    /**
     *  @scope  CreateCollectionEventSet.prototype
     **/
{
    model: CreateCollectionEvent
});