/**
 *  @file       ManageRequestCollectionWidget.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  Manage a collection that the user has requested to join
 *  @class
 *  @extends    Widget
 **/
var ManageRequestCollectionWidget = Widget.extend({
    
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
