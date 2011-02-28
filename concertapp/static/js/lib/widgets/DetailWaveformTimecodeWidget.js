/**
 *  @file       DetailWaveformTimecodeWidget.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  The widget that displays the timecode underneath the detail waveform.
 *  @class
 *  @extends    Widget
 **/
var DetailWaveformTimecodeWidget = Widget.extend({
    initialize: function() {
        Widget.prototype.initialize.call(this);

        var params = this.options;
        
        /* The HTML5 audio element that we will watch */
        var audio = params.audio;
        if(typeof(audio) == 'undefined') {
            throw new Error('params.audio is undefined');
        }
        this.audio = audio;

        _.bindAll(this, "render");
    },

    render: function() {
        Widget.prototype.render.call(this);
        
        var el = this.el;
        
        /* Width of widget */
        var width = el.width();
        
        console.log('width:');
        console.log(width);
        
        
        /* Duration of audio */
        var duration = this.audio.duration;
        console.log('duration:');
        console.log(duration);
        
        /* Pixels per second */
        var pxPerSecond = width / duration;
        
        /* Draw timecode with canvas */
        $g().size(width, el.height())
            .background('white')
            .add(function(pxPerSecond, duration) {
                return function(ctx, canvas) {
                    var height = canvas.height;
                    var width = canvas.width;
                    
                    console.log('width:');
                    console.log(width);

                    /* Begin our cursor at the top left corner of the canvas */
                    var cursor = {
                        x: 0, 
                        y: 0
                    };
                    
                    /* We will draw black 1px lines for now */
                    ctx.strokeStyle = 'black';
                    ctx.lineCap = 'round';
                    ctx.lineWidth = 1.0;

                    ctx.beginPath();
                    
                    /* For each second */
                    for(var i = 0; i < duration; i++) {
                        /* Draw marker for this second */
                        
                        /* Move cursor horizontally */
                        cursor.x += i*pxPerSecond;
                        cursor.y = 0;
                        ctx.moveTo(cursor.x, cursor.y);
                        
                        /* Draw a vertical line at current point */
                        ctx.lineTo(cursor.x, cursor.y+(height*0.75));
                        ctx.stroke();
                    }
                    ctx.closePath();
                };
            }(pxPerSecond, duration))
            .place(el).draw();
        
        
        
        return this;
    }
});
