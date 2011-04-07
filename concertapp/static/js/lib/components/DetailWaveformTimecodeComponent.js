/**
 *  @file       DetailWaveformTimecodeComponent.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  The widget that displays the timecode underneath the detail waveform.
 *  @class
 *  @extends   concertapp.components.Component
 **/
var DetailWaveformTimecodeComponent = concertapp.components.Component.extend(
	/**
	 *	@scope	DetailWaveformTimecodeComponent.prototype
	 **/
{
    initialize: function() {
       concertapp.components.Component.prototype.initialize.call(this);

        var params = this.options;
        
        /* The HTML5 audio element that we will watch */
        var audio = params.audio;
        if(typeof(audio) == 'undefined') {
            throw new Error('params.audio is undefined');
        }
        this.audio = audio;
        
        /* The duration of the currently selected audio file (or segment parent) */
        this.fileDuration = null;
    },
    
    /**
     *  Called from panel when audio file was selected.
     *
     *  @param  {AudioFile}    selectedAudioFile    -   selected audio file
     **/
    audio_file_selected: function(selectedAudioFile) {
        /* Save duration of audio */
        this.fileDuration = selectedAudioFile.get('duration');
        
        /* render */
        this.render();
        
    }, 
    
    /**
     *  Called from panel when audio segment was selected.
     *
     *  @param  {AudioSegment}    selectedAudioSegment    - selected segment
     **/
    audio_segment_selected: function(selectedAudioSegment) {
        /* Save duration of audio file associated with this segment */
        this.fileDuration = selectedAudioSegment.get('audioFile').get('duration');
        
        /* Render */
        this.render();
    }, 
    
    /**
     *  Called internally when timecode is to be redrawn.
     **/
    render: function() {
       concertapp.components.Component.prototype.render.call(this);
        var el = this.el;
        
        /* Pixels per second currently is 10 because we only have one zoom level */
        var pxPerSecond = 10;
        
        /* Clear canvas */
        this.el.empty();
        
        var duration = this.fileDuration;
        
        /* Draw timecode with canvas */
        $g().size(pxPerSecond*duration, el.height())
            .add(function(pxPerSecond, duration) {
                return function(ctx, canvas) {
                    var height = canvas.height;
                    var width = canvas.width;
                    
                    /* Begin our cursor at the top left corner of the canvas */
                    var cursor = {
                        x: 0, 
                        y: 0
                    };
                    
                    /* We will draw black 1px lines for now */
                    ctx.strokeStyle = 'black';
                    ctx.lineCap = 'square';
                    ctx.lineWidth = 1.0;

                    ctx.beginPath();
                    
                    /* Place long marker every 10 seconds */
                    for(var i = 0; i < duration; i+=10) {
                        /* Draw marker for this second */
                        
                        /* Move cursor horizontally */
                        cursor.x = i*pxPerSecond;
                        cursor.y = 0;
                        ctx.moveTo(cursor.x, cursor.y);
                        
                        /* Draw a vertical line at current point */
                        ctx.lineTo(cursor.x, cursor.y+(height*0.50));
                        ctx.stroke();
                    }
                    
                    /* Place short marker every 10 seconds (on multiples of 5) */
                    for(var i = 5; i < duration; i+=5) {
                        cursor.x = i*pxPerSecond;
                        cursor.y = 0;
                        ctx.moveTo(cursor.x, cursor.y);
                        
                        ctx.lineTo(cursor.x, cursor.y+(height * 0.25));
                        ctx.stroke();
                    }
                     /* Place short marker every 1 seconds */
                    for(var i = 0; i < duration; i+=1) {
                        cursor.x = i*pxPerSecond;
                        cursor.y = 0;
                        ctx.moveTo(cursor.x, cursor.y);
                        
                        ctx.lineTo(cursor.x, cursor.y+(height * 0.125));
                        ctx.stroke();
                    }
                    ctx.closePath();
                };
            }(pxPerSecond, duration))
            .place(el).draw();
        
        
        return this;
    }
});
