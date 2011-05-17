/**
 *  @file       Tag.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  A tag object.
 *
 *  @class
 *  @extends    ConcertBackboneModel
 **/
var Tag = ConcertBackboneModel.extend(
	/**
	 *	@scope	Tag.prototype
	 **/
{
    foreignKeyAttributes: function() {
        return [
            {
                attr: 'creator', 
                model: User
            },
            {
                attr: 'collection', 
                model: Collection 
            }
        ];
    },
    
    oneToManyAttributes: function() {
        return [
            {
                attr: 'segments', 
                collectionType: AudioSegmentSet 
            },
            {
                attr: 'events', 
                collectionType: EventSet
            }
        ];
    }, 
    name: 'tag', 
});

/**
 *  A set of tag objects.
 *
 *  @class
 *  @extends    ConcertBackboneCollection
 **/
var TagSet = ConcertBackboneCollection.extend(
	/**
	 *	@scope	TagSet.prototype
	 **/
{
    model: Tag
});