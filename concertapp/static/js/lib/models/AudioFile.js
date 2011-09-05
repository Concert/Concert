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