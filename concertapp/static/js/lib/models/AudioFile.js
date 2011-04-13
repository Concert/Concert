/**
 *  @file       AudioFile.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  An audio file object.
 *  @class
 *  @extends    ConcertBackboneModel
 **/
var AudioFile = ConcertBackboneModel.extend(
	/**
	 *	@scope	AudioFile.prototype
	 **/
{
    foreignKeyAttributes: function() {
        return [
            {
                attr: 'uploader', 
                model: User 
            },
            {
                attr: 'collection', 
                model: Collection
            }
        ];
    }, 
    oneToManyAttributes: function() {
        return [
            {
                attr: 'segments', 
                collectionType: AudioSegmentSet,
                comparator: function(segment) {
                    return segment.get('beginning');
                },  
            },
            {
                attr: 'events', 
                collectionType: EventSet, 
                comparator: function(e) {
                    return e.get('time');
                }, 
            }
        ];
    }, 
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
    }, 
    
});

/**
 *  A set of audio file objects
 *  @class
 *  @extends    ConcertBackboneCollection
 **/
var AudioFileSet = ConcertBackboneCollection.extend(
    /**
	 *	@scope	AudioFile.prototype
	 **/
	
{
    model: AudioFile
});