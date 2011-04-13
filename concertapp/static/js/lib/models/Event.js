/**
 *  @file       Event.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  A base class for an event that occurs in the application.
 **/
var Event = ConcertBackboneModel.extend(
    /**
     *  @scope  Event.prototype
     **/

{
    foreignKeyAttributes: function() {
        return [
            {
                attr: 'user', 
                model: User
            },
            {
                attr: 'collection', 
                model: Collection 
            },
            {
                attr: 'audioSegment', 
                model: AudioSegment 
            },
            {
                attr: 'audioFile', 
                model: AudioFile
            },
            {
                attr: 'tag', 
                model: Tag 
            }
        ];
    }, 
    name: 'event', 
});

var EventSet = ConcertBackboneCollection.extend(
    /**
     *  @scope  EventSet.prototype
     **/
{
    model: Event 
});