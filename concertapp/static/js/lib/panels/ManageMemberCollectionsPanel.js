/**
 *  @file       ManageMemberCollectionsPanel.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  This is the panel where the user can manage the collections he/she is a
 *  member of.
 *  @class
 *  @extends    ManageTablePanel
 **/
var ManageMemberCollectionsPanel = ManageTablePanel.extend(
	/**
	 *	@scope	ManageMemberCollectionsPanel.prototype
	 **/
{
    initialize: function() {
        ManageTablePanel.prototype.initialize.call(this);

        /* The manage admin collection widget template */
        var widgetTemplate = $('#manage_member_collection_template');
        if(typeof(widgetTemplate) == 'undefined' || widgetTemplate.length == 0) {
            throw new Error('widgetTemplate not found.');
        }
        this.widgetTemplate = widgetTemplate;
        
        /* The ManageAdminCollectionWidget class */
        this.widgetClass = ManageMemberCollectionWidget;
        
    }
});
