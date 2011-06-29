/**
 *  @file       Tag.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  @class  A tag object.
 *  @extends    Backbone.RelationalModel
 **/
var Tag = Backbone.RelationalModel.extend(
	/**
	 *	@scope	Tag.prototype
	 **/
{
    relations: [
        {
            type: Backbone.HasOne, 
            key: 'creator', 
            relatedModel: 'User', 
        },
        {
            type: Backbone.HasOne, 
            key: 'collection', 
            relatedModel: 'Collection'
        },
        {
            type: 'HasMany', 
            key: 'segments', 
            relatedModel: 'AudioSegment'
        },
        {
            type: Backbone.HasMany, 
            key: 'events', 
            relatedModel: 'Event'
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