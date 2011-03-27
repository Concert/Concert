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

        _.bindAll(this, "render");
    },

    render: function() {
        Widget.prototype.render.call(this);
        
        /* Our audio segment */
        var segment = this.model;
        
        /* Our width in px is the segment's duration multiplied by the panel's
        resolution (in px/second) */
        var width = (segment.get('end') - segment.get('beginning')) * this.panel.get_resolution();
//        this.width = width;
        
        /* Our margin-left is our start time multiplied by the panel's resolution */
        var marginLeft = segment.get('beginning') * this.panel.get_resolution();
//        this.marginLeft = marginLeft;
        
        var el = $(this.el);

        el.css({
            width: width, 
            'margin-left': marginLeft 
        });
        
        /* Now we're rendered, can cache leftPx and rightPx property */
        var leftPx = el.position().left*-1; //For some reason this is negative
        this.leftPx = leftPx;
        this.rightPx = leftPx + el.width();
        
        return this;
    }
});