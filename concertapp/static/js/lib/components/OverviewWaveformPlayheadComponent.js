/**
 *  @file       OverviewWaveformPlayheadComponent.js
 *  
 *  @author     Amy Wieliczka <amywieliczka [at] gmail.com>
 **/
 
/**
 *  The subclass for OverviewWaveformPlayheadComponent.
 *  @class
 *  @extends    WaveformPlayheadComponent
 **/
var OverviewWaveformPlayheadComponent = WaveformPlayheadComponent.extend(
	/**
	 *	@scope	OverviewWaveformPlayheadComponent.prototype
	 **/
{
    initialize: function() {
        WaveformPlayheadComponent.prototype.initialize.call(this);
    },
    
    update_speed: function() {
        this.pxPerSecond = this.panel.get_resolution();         
    }
});
