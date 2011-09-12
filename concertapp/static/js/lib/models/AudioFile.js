/**
 *  @file       AudioFile.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  An audio file object.
 *  @class
 *  @extends    ConcertModel
 **/
var AudioFile = ConcertModel.extend(
	/**
	 *	@scope	AudioFile.prototype
	 **/
{
    relations: [
        {
            type: Backbone.HasOne, 
            key: 'collection', 
            relatedModel: 'Collection',
            includeInJSON: "id"
        },
        {
            type: Backbone.HasMany, 
            key: 'events', 
            relatedModel: 'Event',
            includeInJSON: "id"
        },
        {
            type: Backbone.HasMany, 
            key: 'segments', 
            relatedModel: 'AudioSegment',
            includeInJSON: "id"
        },
        {
            type: Backbone.HasOne, 
            key: 'uploader', 
            relatedModel: 'User',
            includeInJSON: "id"
        }
    ], 
    name: 'audiofile', 

    initialize: function () {
        ConcertModel.prototype.initialize.apply(this, arguments);

        /* Default value for status is 'u' */
        if(!this.get('status')) {
            this.set({'status': 'u'});
        }

        _.bindAll(this, '_handle_upload_done');
        _.bindAll(this, '_handle_upload_fail');
        _.bindAll(this, '_handle_upload_always');
    }, 

    /**
     *  Returns the path to the audio file specified by type.
     *
     *  @param  {String: ogg|mp3}    type    -   The type of audio file
     **/
    get_audio_src: function(type) {
        var id = this.get('id');
        
        if(id) {
            return '/media/audio/'+id+'.'+type;
        }
        else {
            return null;
        }
    }, 
    
    /**
     *  Returns the path to the waveform image specified by zoom_level
     *
     *  @param  {Number}    zoom_level    - The zoom level for this waveform image.
     **/
    get_waveform_src: function(zoom_level) {
        var id = this.get('id');
        
        if(id) {
            return '/media/waveforms/'+zoom_level+'/'+id+'.png';
        }
        else {
            return null;
        }
    },

    /**
     *    Begin file uploading.
     *  @param    {Object}    fileUploadData - The object from the
     *    jquery fileupload plugin.
     **/
    upload: function (fileUploadData) {
        /* first set audioFile attribute so we have a context.
        The plugin is configured to call the proper methods
        on the audioFile attribute of this object. */
        fileUploadData.audioFile = this;

        fileUploadData.submit()
            .done(this._handle_upload_done)
            .fail(this._handle_upload_fail)
            .always(this._handle_upload_always);
    },

    /**
     *    When file upload is complete
     **/
    _handle_upload_done: function (data, textStatus) {
        console.log('AudioFile._handle_upload_done');
        console.log('data:');
        console.log(data);
    },

    /**
     *    When file upload fails
     **/
    _handle_upload_fail: function (data, textStatus) {
        console.log('AudioFile._handle_upload_fail');
        console.log('data:');
        console.log(data);
    }, 

    /**
     *    Always after file is uploaded
     **/
    _handle_upload_always: function (data, textStatus) {
        console.log('AudioFile._handle_upload_always');
        console.log('data:');
        console.log(data);
    }
    
});

/**
 *  A set of audio file objects
 *  @class
 *  @extends    Backbone.Collection
 **/
var AudioFileSet = Backbone.Collection.extend(
    /**
	 *	@scope	AudioFile.prototype
	 **/
	
{
    model: AudioFile
});