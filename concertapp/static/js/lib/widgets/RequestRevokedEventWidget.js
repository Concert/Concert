/**
 *  @file       RequestRevokedEventWidget.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  A widget to represent a `RequestRevokedEvent`
 *  @extends    EventWidget
 **/
var RequestRevokedEventWidget = EventWidget.extend(
    /**
     *  @scope  RequestRevokedEventWidget.prototype
     **/
{
    initialize: function() {
        EventWidget.prototype.initialize.call(this);

        var params = this.options;
        
        

        _.bindAll(this, "render");
    },

    render: function() {
        EventWidget.prototype.render.call(this);
        
        return this;
    }
});
