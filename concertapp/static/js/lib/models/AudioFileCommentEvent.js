/**
 *  @file       AudioFileCommentEvent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  When a user comments on an audio file
 *  @extends    Event
 **/
var AudioFileCommentEvent = Event.extend(
    /**
     *  @scope  AudioFileCommentEvent.prototype
     **/
{
    name: 'audiofilecommentevent'
});

/**
 *  @class  A set of AudioFileCommentEvent objects
 *  @extends    ConcertBackboneCollection
 **/
var AudioFileCommentEventSet = ConcertBackboneCollection.extend(
    /**
     *  @scope  AudioFileCommentEventSet.prototype
     **/
{
    model: AudioFileCommentEvent
});
