/**
 *  @file       AudioSegmentTaggedEvent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  When an audio segment was tagged.
 *  @extends    ConcertBackboneModel
 **/
var AudioSegmentTaggedEvent = ConcertBackboneModel.extend(
    /**
     *  @scope  AudioSegmentTaggedEvent.prototype
     **/
{
    foreignKeyAttributes: function() {
        return [
            {
                attr: 'audioSegment', 
                model: AudioSegment 
            },
            {
                attr: 'tag', 
                model: Tag 
            }
        ];
    }, 
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