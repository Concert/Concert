/**
 *  @file       EventsPanel.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  Panel that shows events on the organize page.
 *  @extends    Panel
 **/
var EventsPanel = Panel.extend({
    initialize: function() {
        Panel.prototype.initialize.call(this);

        var params = this.options;
        
        

        _.bindAll(this, "render");
    },

    render: function() {
        Panel.prototype.render.call(this);
        
        return this;
    }
});
