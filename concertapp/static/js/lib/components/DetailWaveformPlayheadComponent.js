/**
 *  @file       OverviewWaveformPlayheadComponent.js
 *  
 *  @author     Amy Wieliczka <amywieliczka [at] gmail.com>
 **/
 
/**
 *  The subclass for DetailWaveformPlayheadComponent.
 *  @class
 *  @extends    WaveformPlayheadComponent
 **/
var DetailWaveformPlayheadComponent = WaveformPlayheadComponent.extend({
    initialize: function() {
        WaveformPlayheadComponent.prototype.initialize.call(this);
    },
    
    update_speed: function() {
        this.pxPerSecond = 10;
    },
    
    draw: function() {
        WaveformPlayheadComponent.prototype.draw.call(this);
        
        this.panel.playhead_moved(this.leftPx);
    }

});
