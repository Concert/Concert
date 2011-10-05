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
     *  @param    {File}    file - The file object.
     *  @param    {Object}  data - FileUpload data object
     **/
    upload_file: function (file, data) {
        var currentCollection = com.concertsoundorganizer.modelManager.selectedCollections.first();
        var newAudioFile = new AudioFile({
            name: file.name,
            uploader: this,
            collection: currentCollection
        });
        this.get('uploadedFiles').add(newAudioFile);

        /* Start uploading of audio file */
        newAudioFile.upload(data);
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