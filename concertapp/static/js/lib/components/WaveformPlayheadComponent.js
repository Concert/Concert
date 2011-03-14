/**
 *  @file       WaveformPlayheadComponent.js
 *  
 *  @author     amy wieliczka <amywieliczka [at] gmail.com>
 **/
 
/**
 *  The widget that displays the playhead superimposed on the detail waveform.
 *  @class
 *  @extends    Component
 **/
var WaveformPlayheadComponent = Component.extend({
    initialize: function() {
        Component.prototype.initialize.call(this);

        var params = this.options;
        
        /* The rate at which the waveform image moves */
        this.pxPerSecond = null;
        
        /* The 'css' left property of the playhead is set to leftPx */
        this.leftPx = null;
        
        /* The HTML5 audio element that we will watch */
        var audio = params.audio;
        if(typeof(audio) == 'undefined') {
            throw new Error('params.audio is undefined');
        }
        this.audio = audio;
        
        /* When the audio experiences a time update, playhead is redrawn (detail) */
        $(audio).bind('canplaythrough', function(me) {
            return function() {
                $(this).bind('timeupdate', function(me) {
                    return function() {
                        me.draw();
                    };
                }(me));
            };
        }(this));        
    },

    /** 
     *  updates pxPerSecond 
     *  for now only called from panel when a new file or segment is selected
     *  later may be called on zoom
     **/
    update_speed: function() {}, 

    /**
     *  draw is called from event handler above on timeupdate
     *  draws the playhead with css 'left' property equal to currentTime * pxPerSecond
     **/
    draw: function() {
        this.leftPx = this.audio.currentTime * this.pxPerSecond;
        this.el.css('left', this.leftPx);
    },
    
    /**
     *  reset is called from panel when a new file or segment is selected
     *  resets the playhead to the beginning of the waveform image
     **/
    reset: function() {
        this.el.css('left', '0px');
    },
    
    position: function() {
        return this.el.position().left;
    },

});
