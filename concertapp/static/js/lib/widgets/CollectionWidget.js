/**
 *  @file       CollectionWidget.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  Represents a collection in the collections listing
 *  @extends    Widget
 **/
var CollectionWidget = Widget.extend(
    /**
     *  @scope  CollectionWidget.prototype
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

