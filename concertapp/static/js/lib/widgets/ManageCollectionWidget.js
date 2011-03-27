/**
 *  @file       ManageCollectionWidget.js
 *  
 *  @author     amy wieliczka <amywieliczka [at] gmail.com>
 **/


/**
 *  This class is for displaying the manage collection widget for a Concert
 *  Collection that the user is a member of.  If they are an administrator,
 *  this will be handled in the template.
 *  @class
 *  @extends    Widget
 **/
var ManageCollectionWidget = Widget.extend(
	/**
	 *	@scope	ManageCollectionWidget.prototype
	 **/
{
    initialize: function() {
        Widget.prototype.initialize.call(this);

        var params = this.options;
        
        /**
         *  The template for a collection request
         **/
        var collectionRequestWidgetTemplate = $('#collection_request_widget_template');
        if(typeof(collectionRequestWidgetTemplate) == 'undefined' || collectionRequestWidgetTemplate.length == 0) {
            throw new Error('collectionRequestWidgetTemplate not found');
        }
        this.collectionRequestWidgetTemplate = collectionRequestWidgetTemplate;
        
        /**
         *  The container for the collection requests
         **/
        this.requestContainer = null;
        
        _.bindAll(this, "render");
        /* Render when users has changed */
        this.model.get('users').bind('add', this.render);
        this.model.get('users').bind('remove', this.render);
        this.render();
    },
    render: function() {
        Widget.prototype.render.call(this);

        return this;
    },
    events: {
        'click button.leave_collection': 'leave_collection_confirm'
    }, 
    /**
     *  When a user clicks the leave collection button
     **/
    leave_collection_confirm: function() {
        this.panel.page.leave_collection_with_confirm(this.model);
    }
});
    