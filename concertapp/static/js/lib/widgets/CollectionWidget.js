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
        
        this.hoverUrl = 'collection/'+this.model.get('id');
        this.clickUrl = this.hoverUrl+'/audio';
        
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
        
        /* Go to collection's audio */
        window.location.assign('#'+this.clickUrl);
    },
    _handle_mouseenter: function(e) {
        ListWidget.prototype._handle_mouseenter.call(this, e);
        
        /* Go to collection */
        window.location.assign('#'+this.hoverUrl);
    },
    _handle_mouseleave: function(e) {
        ListWidget.prototype._handle_mouseleave.call(this, e);
        
        /* If we are still on our collection's preview URL */
        if(Backbone.history.fragment == this.hoverUrl) {
            /* Go back to collections list */
            window.location.assign('#collections');
        }
    }, 
});

