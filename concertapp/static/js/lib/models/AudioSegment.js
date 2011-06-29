/**
 *  @file       AudioSegment.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  Audio segment object.
 *  @class
 *  @extends    ConcertModel
 **/
var AudioSegment = ConcertModel.extend(
	/**
	 *	@scope	AudioSegment.prototype
	 **/

{
    relations: [
        {
            type: 'HasMany', 
            key: 'tags', 
            relatedModel: 'Tag'
        },
        {
            type: Backbone.HasMany, 
            key: 'events', 
            relatedModel: 'Event'
        },
        {
            type: Backbone.HasOne, 
            key: 'audioFile', 
            relatedModel: 'AudioFile'
        },
        {
            type: Backbone.HasOne, 
            key: 'creator', 
            relatedModel: 'User'
        },
        {
            type: Backbone.HasOne, 
            key: 'collection', 
            relatedModel: 'Collection'
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