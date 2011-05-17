/**
 *  @file       ManageRequestWidget.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  Manage a collection that the user has requested to join
 *  @class
 *  @extends    Widget
 **/
var ManageRequestWidget = Widget.extend(
	/**
	 *	@scope	ManageRequestWidget.prototype
	 **/
{
    initialize: function() {
        Widget.prototype.initialize.call(this);

        var params = this.options;
        

        _.bindAll(this, "render");
        this.render();
    },
    render: function() {
        Widget.prototype.render.call(this);
        
        
        
        return this;
    },
    events: {
        'click .revoke_request': 'revokeRequest', 
    }, 
    /**
     *  Called when user clicks the revoke request button
     **/
    revokeRequest: function(){
        /* Revoke join request. */
        this.panel.page.revoke_request(this.model);
    }, 
});
