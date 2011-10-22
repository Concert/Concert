/**
 *  @file       Audio.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 *
 *              Copyright (c) 2011 ConcertSoundOrganizer.org
 *              See AUTHORS.txt for a list of contributors.
 *              Licensed under the GPLv3 license.
 **/

/**
 *  @class      Base class for `AudioFile` and `AudioSegment`
 *  objs.
 *  @extends    ConcertModel
 **/
var Audio = ConcertModel.extend(
    /**
     *  @scope  Audio.prototype
     **/
{
    /**
     *  Override `set` method so we can change
     *  date strings into `Date` objects.
     **/
    set: function (attrs, options) {
        /* if we're setting the date as a string */
        if(attrs.dateModified && _.isString(attrs.dateModified)) {
            /* Create new Date instance */
            attrs.dateModified = new Date(attrs.dateModified);
        }

        return ConcertModel.prototype.set.call(this, attrs, options);
    }, 
});

/**
 *    @class    A set of Audio objects
 *    @extends  Backbone.Collection
 **/
var AudioSet = Backbone.Collection.extend(
    /**
     *    @scope    AudioSet.prototype
     **/
{
    model: Audio,
    comparator: function (audioModel) {
        return -(audioModel.get('dateModified'));
    }
});

