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

    /* Static object mapping short strings to 
    display strings */
    DISPLAY_STATUS: {
        LOWER: {
            'u': 'uploading', 
            'p': 'processing',
            'd': 'done'
        },
        UPPER: {
            'u': 'Uploading',
            'p': 'Processing',
            'd': 'Done'
        }, 
    }, 

    /**
     *  Gets the status string for display.
     *
     *  @param    {String}    "UPPER" | "LOWER"
     **/
    getDisplayStatus: function (upperOrLower) {
        return this.DISPLAY_STATUS[upperOrLower][this.get('status')];
    }, 

    initialize: function () {
        ConcertModel.prototype.initialize.apply(this, arguments);

        /* Default value for status is 'u' */
        if(!this.get('status')) {
            this.set({'status': 'u'});
        }

        /* Default value for progress is 0 */
        if(!this.get('progress')) {
            this.set({'progress': 0});
        }

        // if(this.get('uploader')) {
        //     this.get('uploader').get('uploadedFiles').add(this);
        // }


        _.bindAll(this, '_handle_upload_done');
        _.bindAll(this, '_handle_upload_fail');
        _.bindAll(this, '_handle_upload_always');
        _.bindAll(this, 'fetch');

        /* Temporary urls for our resources */
        this._audioSrc = null;
        this._waveformSrc = null;

        /* When we last updated our resources */
        this._lastUpdatedResources = null;
    }, 

    /**
     *    If we need to update our resources, they will be updated here.
     *
     *  @param    {Function}    cb - the method to call upon success.    
     **/
    _update_resources: function (cb) {
        var now = new Date();
        if(!this._lastUpdatedResources 
            /* or resources were updated more than 24 hours ago */
            || (now.getTime() - this._lastUpdatedResources.getTime()) > 60 * 60 * 24) {
                
            /* Update resources */
            var me = this;
            $.ajax({
                url: 'src/'+this.get('id'), 
                dataType: "json", 
                success: function (resp) {
                    me._audioSrc = resp.audioSrc;
                    me._waveformSrc = resp.waveformSrc;
                    me._lastUpdatedResources = new Date();
                    cb();
                }, 
                error: function (resp) {
                    throw new Error('Error while retrieving resource URLs');
                }
            });
        }
        else {
            // already have urls cached
            cb();
        }
        


    }, 

    /**
     *  Returns the path to the audio file specified by type.
     *
     *  @param    {Function}    cb    - The method that will be executed
     *  containing the audio url.
     **/
    get_audio_src: function(cb) {
        var me = this;
        this._update_resources(function () {
            var audioType = com.concertsoundorganizer.compatibility.audioType;
            cb(me._audioSrc[audioType]);
        });
    }, 
    
    /**
     *  Returns the path to the waveform image specified by zoom_level
     *
     *  @param  {Number}    zoom_level    - The zoom level for this waveform image.
     *  @param    {Function}    cb    - The method that will be executed
     *  containing the waveform url.
     **/
    get_waveform_src: function(zoom_level, cb) {
        var me = this;
        this._update_resources(function () {
            cb(me._waveformSrc[zoom_level]);
        });
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
        /* Update our model */
        this.set(data);
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