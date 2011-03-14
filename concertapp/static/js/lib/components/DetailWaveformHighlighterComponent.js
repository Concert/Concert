/**
 *  @file       DetailWaveformHighlighterComponent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  Highlighter component for the detail waveform panel.
 *  @class
 *  @extends    WaveformHighlighterComponent
 **/
var DetailWaveformHighlighterComponent = WaveformHighlighterComponent.extend({
    _initializeElements: function() {
        WaveformHighlighterComponent.prototype._initializeElements.call(this);
        
        var leftHandle = this.highlight.children('.leftHandle');
        if(typeof(leftHandle) == 'undefined') {
            throw new Error('this.highlight.children(\'.leftHandle\') is undefined');
        }
        else if(leftHandle.length == 0) {
            throw new Error('leftHandle not found');
        }
        this.leftHandle = leftHandle;

        var rightHandle = this.highlight.children('.rightHandle');
        if(typeof(rightHandle) == 'undefined') {
            throw new Error('this.highlight.children(\'.rightHandle\') is undefined');
        }
        else if(rightHandle.length == 0) {
            throw new Error('rightHandle not found');
        }
        this.rightHandle = rightHandle;
        
        leftHandle.hover(function(leftHandle) {
            return function() {
                leftHandle.css({width: '4px'});
            };
        }(leftHandle), function(leftHandle) {
            return function() {
                leftHandle.css({width: '2px'});
            };
        }(leftHandle));
        
        rightHandle.hover(function(rightHandle) {
            return function() {
                rightHandle.css({width: '4px'});
            };
        }(rightHandle), function(rightHandle) {
            return function() {
                rightHandle.css({width: '2px'});
            };
        }(rightHandle));        
    },
    
    reset: function() {
        WaveformHighlighterComponent.prototype.reset.call(this);
        
        this.leftHandle.css({
            width: '0px'
        });
        
        this.rightHandle.css({
            width: '0px'
        });
    },
    
    draw_highlight_px: function(x, y) {
        /* If the values are left to right */
        if(x < y) {
            this.highlight.css({
                left: x+'px', 
                width: (y-x)+'px' 
            });
        }
        /* If the drag is from right to left */
        else if(x > y) {
            this.highlight.css({
                left: y+'px', 
                width: (x-y)+'px'
            });
        }        
        
        this.leftHandle.css({
            width: '2px'
        });
        
        this.rightHandle.css({
            width: '2px'
        });
    },
    
    /**
     *  When a drag is started.
     *
     *  @param  {Number}    x    -  The x-coordinate where the drag began.
     **/
    startDrag: function(x) {
        if(this.disabled == false && this.dragging == false && this.handle(x)) {
            this.panel.clear_audio_loop();
            this.dragging = true;
        } else {
            console.log('reset audio loop')
            /* Reset any old highlight */
            this.reset();
            /* Make highlight visible */
            this.enable();
            /* Save new starting point */
            this.lastDragStartX = x;
            /* We are now dragging */
            this.dragging = true;
        }
    },
    
    handle: function(x) {
        //if x is plus or minus 2 px of lastDragStart
        if(x <= (this.lastDragStartX + 2) && x >= (this.lastDragStartX - 2)) {
            //find out if we have the left or right handle
            if (this.lastDragStartX < this.lastDragEndX) {
                //left handle
            } else {
                //right handle
            }
        //if x is plus or minus 2 px of lastDragEnd
        } else if(x <= (this.lastDragEndX + 2) && x >= (this.lastDragEndX -2)) {
            //find out if we have the left or right handle
            if (this.lastDragStartX < this.lastDragEndX) {
                return true;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }, 
});