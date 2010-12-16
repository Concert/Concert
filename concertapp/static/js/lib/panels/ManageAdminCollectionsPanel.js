/**
 *  @file       ManageAdminCollectionsPanel.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  This is the panel where the user can manage the collections he/she is an 
 *  administrator of.
 *  @class
 *  @extends    ManageCollectionsPanel
 **/
var ManageAdminCollectionsPanel = ManageCollectionsPanel.extend({
    
    initialize: function() {
        ManageCollectionsPanel.prototype.initialize.call(this);

        var params = this.options;
               
        
        /* The manage admin collection widget template */
        var widgetTemplate = $('#manage_admin_collection_template');
        if(typeof(widgetTemplate) == 'undefined' || widgetTemplate.length == 0) {
            throw new Error('widgetTemplate not found.');
        }
        this.widgetTemplate = widgetTemplate;
        
        /* The ManageAdminCollectionWidget class */
        this.widgetClass = ManageAdminCollectionWidget;
        
    }
});
