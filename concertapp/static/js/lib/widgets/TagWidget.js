/**
 *  @file       TagWidget.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  A widget that displays a tag.  This is in the SegmentWidget and at the bottom
 *  of the DetailWaveformPanel.
 *
 *  @class
 *  @extends    Widget
 **/
var TagWidget = Widget.extend(
/**
 *  @scope TagWidget.prototype
 **/    
{
    initialize: function() {
        /**
         *  Our template better exist or else parent constructor will be mad
         **/
        this.options.template = $('#tag_widget_template');

        Widget.prototype.initialize.call(this);

        var params = this.options;
        
        

        _.bindAll(this, "render");
    },

    render: function() {
        Widget.prototype.render.call(this);
        
        return this;
    }
});
