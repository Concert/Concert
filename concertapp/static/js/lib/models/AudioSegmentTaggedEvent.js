/**
 *  @file       AudioSegmentTaggedEvent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  When an audio segment was tagged.
 *  @extends    ConcertBackboneModel
 **/
var AudioSegmentTaggedEvent = Event.extend(
    /**
     *  @scope  AudioSegmentTaggedEvent.prototype
     **/
{
    foreignKeyAttributes: function() {
        return Event.prototype.foreignKeyAttributes.call(this).concat([
            {
                attr: 'audioSegment', 
                model: AudioSegment 
            },
            {
                attr: 'tag', 
                model: Tag 
            }
        ]);
    }, 
    name: 'audiosegmenttaggedevent', 
});

/**
 *  @class  A set of AudioSegmentTaggedEvent objects
 *  @extends    ConcertBackboneCollection
 **/
var AudioSegmentTaggedEventSet = ConcertBackboneCollection.extend(
    /**
     *  @scope  AudioSegmentTaggedEventSet.prototype
     **/
{
    model: AudioSegmentTaggedEvent
});