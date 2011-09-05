/**
 *  @file       Tag.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  @class  A tag object.
 *  @extends    ConcertModel
 **/
var Tag = ConcertModel.extend(
	/**
	 *	@scope	Tag.prototype
	 **/
{
    relations: [
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
        },
        {
            type: 'HasMany', 
            key: 'segments', 
            relatedModel: 'AudioSegment',
            includeInJSON: "id"
        },
        {
            type: Backbone.HasMany, 
            key: 'events', 
            relatedModel: 'Event',
            includeInJSON: "id"
        }
    ], 
    name: 'tag' 
});

/**
 *  A set of tag objects.
 *
 *  @class
 *  @extends    Backbone.Collection
 **/
var TagSet = Backbone.Collection.extend(
	/**
	 *	@scope	TagSet.prototype
	 **/
{
    model: Tag
});