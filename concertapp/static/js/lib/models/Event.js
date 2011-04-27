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
    /**
     *  Override the set method so we can turn our time attribute into an actual
     *  date object.
     **/
    set: function(attrs, options) {
        /* If we're setting the time attribute as a string */
        if(attrs && attrs.time && _.isString(attrs.time)) {
            /* Create date object */
            var dateObj = new Date(attrs.time);
            if(dateObj.valueOf()) {
                attrs.time = dateObj;
            }
            else {
                throw new Error('Invalid date for event id '+this.id+': '+attrs.time);
            }
        }
        return ConcertBackboneModel.prototype.set.call(this, attrs, options);
    }, 
});

var EventSet = ConcertBackboneCollection.extend(
    /**
     *  @scope  EventSet.prototype
     **/
{
    model: Event,
    comparator: function(eventModel) {
        return -(eventModel.get('time'));
    }, 
});