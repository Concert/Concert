/**
 *  @file       AudioSegmentCommentEvent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  When a user comments on an audio segment
 *  @extends    Event
 **/
var AudioSegmentCommentEvent = Event.extend(
    /**
     *  @scope  AudioSegmentCommentEvent.prototype
     **/
{
    name: 'audiosegmentcommentevent'
});

/**
 *  @class  A set of AudioSegmentCommentEvent objects
 *  @extends    ConcertBackboneCollection
 **/
var AudioSegmentCommentEventSet = ConcertBackboneCollection.extend(
    /**
     *  @scope  AudioSegmentCommentEventSet.prototype
     **/
{
    model: AudioSegmentCommentEvent
});
