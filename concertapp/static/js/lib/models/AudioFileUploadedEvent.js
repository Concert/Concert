/**
 *  @file       AudioFileUploadedEvent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  When an audio file is uploaded.
 *  @extends    ConcertBackboneModel
 **/
var AudioFileUploadedEvent = ConcertBackboneModel.extend(
    /**
     *  @scope  AudioFileUploadedEvent.prototype
     **/
{
    foreignKeyAttributes: function() {
        return [
            {
                attr: 'audioFile', 
                model: AudioFile
            }
        ];
    }, 
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