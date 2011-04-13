/**
 *  @file       AudioSegmentCreatedEvent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  When an audio segment is created.
 *  @extends    ConcertBackboneModel
 **/
var AudioSegmentCreatedEvent = Event.extend(
    /**
     *  @scope  AudioSegmentCreatedEvent.prototype
     **/
{
    foreignKeyAttributes: function() {
        return Event.prototype.foreignKeyAttributes.call(this).concat([
            {
                attr: 'audioSegment', 
                model: AudioSegment 
            }
        ]);
    }, 
    name: 'audiosegmentcreatedevent', 
});

/**
 *  @class  A set of AudioSegmentCreatedEvent objects
 *  @extends    ConcertBackboneCollection
 **/
var AudioSegmentCreatedEventSet = ConcertBackboneCollection.extend(
    /**
     *  @scope  AudioSegmentCreatedEventSet.prototype
     **/
{
    model: AudioSegmentCreatedEvent
});