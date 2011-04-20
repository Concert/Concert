/**
 *  @file       CollectionWidget.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  Represents a collection in the collections listing
 *  @extends    ListWidget
 **/
var CollectionWidget = ListWidget.extend(
    /**
     *  @scope  CollectionWidget.prototype
     **/
{
    initialize: function() {
        ListWidget.prototype.initialize.call(this);

        var params = this.options;
        
    },

    render: function() {
        ListWidget.prototype.render.call(this);
        
        return this;
    }
});

