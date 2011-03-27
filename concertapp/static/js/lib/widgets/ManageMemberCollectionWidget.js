/**
 *  @file       ManageMemberCollectionWidget.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  This class is for displaying the manage collection widget for a Concert
 *  Collection that the user is a member of.  If they are an administrator,
 *  this will be handled in the template.
 *  @class
 *  @extends    Widget
 **/
var ManageMemberCollectionWidget = Widget.extend(
	/**
	 *	@scope	ManageMemberCollectionWidget.prototype
	 **/
{
    initialize: function() {
        Widget.prototype.initialize.call(this);

        var params = this.options;
        
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
