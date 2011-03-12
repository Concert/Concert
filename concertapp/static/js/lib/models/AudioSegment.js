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
var AudioSegment = ConcertBackboneModel.extend({
    oneToManyAttributes: function() {
        return [
            {
                attr: 'tags', 
                collectionType: TagSet
            },
            {
                attr: 'comments', 
                collectionType: CommentSet 
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
});

/**
 *  A set of audio segment objects.
 *  @class
 *  @extends    ConcertBackboneCollection
 **/
var AudioSegmentSet = ConcertBackboneCollection.extend({
    model: AudioSegment 
});