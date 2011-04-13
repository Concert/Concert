/**
 *  @file       EventWidget.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  A base class for all event widgets.
 *  @extends    Widget
 **/
var EventWidget = Widget.extend(
    /**
     *  @scope  EventWidget.prototype
     **/
{
    initialize: function() {
        Widget.prototype.initialize.call(this);

        var params = this.options;
        
        

        _.bindAll(this, "render");
    },

    render: function() {
        Widget.prototype.render.call(this);
        
        return this;
    }
});
