/**
 *  @file       AudioFileUploadedEvent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  When an audio file is uploaded.
 *  @extends    ConcertBackboneModel
 **/
var AudioFileUploadedEvent = Event.extend(
    /**
     *  @scope  AudioFileUploadedEvent.prototype
     **/
{
    foreignKeyAttributes: function() {
        return Event.prototype.foreignKeyAttributes.call(this).concat([
            {
                attr: 'audioFile', 
                model: AudioFile
            }
        ]);
    }, 
    name: 'audiofileuploadedevent', 
});

/**
 *  @class  A set of AudioFileUploadedEvent objects
 *  @extends    ConcertBackboneCollection
 **/
var AudioFileUploadedEventSet = ConcertBackboneCollection.extend(
    /**
     *  @scope  AudioFileUploadedEventSet.prototype
     **/
{
    model: AudioFileUploadedEvent
});