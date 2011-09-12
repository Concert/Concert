/**
 *  @file       User.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  User represents a django User object.
 *  @extends    ConcertModel
 **/ 
var User = ConcertModel.extend(
	/**
	 *	@scope	User.prototype
	 **/
{
    relations: [
        {
            type: Backbone.HasMany, 
            key: 'memberCollections', 
            relatedModel: 'Collection',
            includeInJSON: "id"
        },
        {
            type: Backbone.HasMany, 
            key: "uploadedFiles", 
            relatedModel: "AudioFile", 
            includeInJSON: "id"
        }
    ], 
    name: 'user',

    /**
     *    Called when a file is added to be uploaded.
     *
     *  @param    {File}    The file object.    
     **/
    upload_file: function (file) {
        this.get('uploadedFiles').add(
            new AudioFile({
                name: file.name
            })
        );      
    }
});

/**
 *  Users represents a collection of django User objects.
 *  @class
 **/
var UserSet = Backbone.Collection.extend(
	/**
	 *	@scope	UserSet.prototype
	 **/
{
    model: User
});