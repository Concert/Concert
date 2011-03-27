/**
 *  @file       CollectionRequestWidget.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  This is the widget that is displayed within a "ManageCollectionWidget" when there
 *  is a user request for that collection.  It contains a UserWidget and approve/
 *  deny buttons.
 *  @class
 *  @extends    Widget
 **/
var CollectionRequestWidget = Widget.extend(
	/**
	 *	@scope	CollectionRequestWidget.prototype
	 **/
{
    initialize: function() {
        Widget.prototype.initialize.call(this);

        var params = this.options;
        
        
        /* Store a reference to the user widget */
        this.userWidget = null;

        _.bindAll(this, "render");
        this.render();
    },
    render: function() {
        Widget.prototype.render.call(this);
        
        var container = $(this.el);
        
        /* User widget 
        var userWidget = new UserWidget({
            container: container.children('.user_widget')
        });
        this.userWidget = userWidget;
        */
        
        return this;
    },
    events: {
        'click .approve_request': 'approveRequestConfirm',
        'click .deny_request': 'denyRequestConfirm'
    }, 
    /**
     *  This is called when the user clicks the deny request button.  Throw to
     *  page.
     **/
    denyRequestConfirm: function() {
        this.panel.page.denyRequestWithConfirm(this.model);
    },
    /**
     *  This is called when the user clicks the accept request button.  Throw
     *  to page.
     **/
    approveRequestConfirm: function() {
        this.panel.page.approveRequestWithConfirm(this.model);
    }
});

