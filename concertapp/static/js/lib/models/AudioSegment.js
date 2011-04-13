/**
 *  @file       AudioSegment.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  Audio segment object.
 *  @class
 *  @extends    ConcertBackboneModel
 **/
var AudioSegment = ConcertBackboneModel.extend(
	/**
	 *	@scope	AudioSegment.prototype
	 **/

{
    oneToManyAttributes: function() {
        return [
            {
                attr: 'tags', 
                collectionType: TagSet
            },
            {
                attr: 'events', 
                collectionType: EventSet,
                comparator: function(e) {
                    return e.get('time');
                } 
            }
        ];
    }, 
    foreignKeyAttributes: function() {
        return [
            {
                attr: 'audioFile', 
                model: AudioFile
            },
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
    name: 'audiosegment', 
    
    initialize: function(attributes, options) {
        ConcertBackboneModel.prototype.initialize.call(this, attributes, options);
        /* tell our AudioFile about us */
        this.get('audioFile').get('segments').add(this);
    }, 
});

/**
 *  A set of audio segment objects.
 *  @class
 *  @extends    ConcertBackboneCollection
 **/
var AudioSegmentSet = ConcertBackboneCollection.extend(
	/**
	 *	@scope	AudioSegmentSet.prototype
	 **/
{
    model: AudioSegment 
});