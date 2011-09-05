/**
 *  @file       Event.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  A base class for an event that occurs in the application.
 *  @extends    ConcertModel
 **/
var Event = ConcertModel.extend(
    /**
     *  @scope  Event.prototype
     **/

{
    relations: [
        {
            type: Backbone.HasOne, 
            key: 'user', 
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
            type: Backbone.HasOne, 
            key: 'audioSegment', 
            relatedModel: 'AudioSegment',
            includeInJSON: "id"
        },
        {
            type: Backbone.HasOne, 
            key: 'audioFile', 
            relatedModel: 'AudioFile',
            includeInJSON: "id"
        },
        {
            type: Backbone.HasOne, 
            key: 'tag', 
            relatedModel: 'Tag',
            includeInJSON: "id"
        }
    ], 
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
        return Backbone.RelationalModel.prototype.set.call(this, attrs, options);
    } 
});

var EventSet = Backbone.Collection.extend(
    /**
     *  @scope  EventSet.prototype
     **/
{
    model: Event,
    comparator: function(eventModel) {
        return -(eventModel.get('time'));
    } 
});