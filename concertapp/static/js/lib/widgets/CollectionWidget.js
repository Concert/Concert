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
    },
    /**
     *  When widget is clicked.
     **/
    _handle_click: function(e) {
        ListWidget.prototype._handle_click.call(this, e);
        
        /* Go to collection */
        window.location.assign('#collection/'+this.model.get('id'));
    }, 
});

