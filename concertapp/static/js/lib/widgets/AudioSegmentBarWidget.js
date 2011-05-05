/**
 *  @file       AudioSegmentBarWidget.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  A single audio segment bar at the top of the OverviewWaveformPanel.
 *  @class
 *  @extends    Widget
 **/
var AudioSegmentBarWidget = Widget.extend({
    initialize: function() {
        Widget.prototype.initialize.call(this);

        var params = this.options;
        
        /**
         *  The right position of our el.  Cached so others can see.
         **/
        this.rightPx = null;
        
        /**
         *  The left position of our el.  Cached so others can see.
         **/
        this.leftPx = null;

        
    },

    render: function() {
        Widget.prototype.render.call(this);
        
        /* Our audio segment */
        var segment = this.model;
        
        /* Our width in px is the segment's duration multiplied by the panel's
        resolution (in px/second) */
        var width = (segment.get('end') - segment.get('beginning')) * this.panel.get_resolution();
        
        /* Our left is our start time multiplied by the panel's resolution */
        var left = segment.get('beginning') * this.panel.get_resolution();
        /* Plus one for border, and one for highlight.  
        TODO: Figure out how to do this with CSS. */
        left+=2;
        
        var el = $(this.el);

        el.css({
            width: width, 
            left: left 
        });
        
        /* Now we're rendered, can cache leftPx and rightPx property */
        this.leftPx = left;
        this.rightPx = left + el.width();
        
        return this;
    }
});