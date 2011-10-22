/**
 *  @file       AudioSegment.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  Audio segment object.
 *  @class
 *  @extends    BaseAudio
 **/
var AudioSegment = BaseAudio.extend(
	/**
	 *	@scope	AudioSegment.prototype
	 **/

{
    relations: [
        {
            type: 'HasMany', 
            key: 'tags', 
            relatedModel: 'Tag',
            includeInJSON: "id"
        },
        {
            type: Backbone.HasMany, 
            key: 'events', 
            relatedModel: 'Event',
            includeInJSON: "id",
            collectionType: 'EventSet'
        },
        {
            type: Backbone.HasOne, 
            key: 'audioFile', 
            relatedModel: 'AudioFile',
            includeInJSON: "id"
        },
        {
            type: Backbone.HasOne, 
            key: 'creator', 
            relatedModel: 'User',
            includeInJSON: "id"
        },
        {
            type: Backbone.HasOne, 
            key: 'collection', 
            relatedModel: 'Collection',
            includeInJSON: "id"
        }
    ], 
    name: 'audiosegment', 
});

/**
 *  A set of audio segment objects.
 *  @class
 *  @extends    Backbone.Collection
 **/
var AudioSegmentSet = Backbone.Collection.extend(
	/**
	 *	@scope	AudioSegmentSet.prototype
	 **/
{
    model: AudioSegment
});