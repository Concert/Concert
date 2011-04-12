/**
 *  @file       AudioSegmentCreatedEvent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  When an audio segment is created.
 *  @extends    ConcertBackboneModel
 **/
var AudioSegmentCreatedEvent = ConcertBackboneModel.extend(
    /**
     *  @scope  AudioSegmentCreatedEvent.prototype
     **/
{
    foreignKeyAttributes: function() {
        return [
            {
                attr: 'audioSegment', 
                model: AudioSegment 
            }
        ];
    }, 
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