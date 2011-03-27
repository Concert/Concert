/**
 *  @file       ManageCollectionsPanel.js
 *  
 *  @author     Amy Wieliczka <amywieliczka [at] gmail.com>
 **/
 
/**
 *  A class for managing the user's collections on the settings page.  
 *  @class
 *  @extends Panel
 **/
 
 var ManageCollectionsPanel = Panel.extend(
	/**
	 *	@scope	ManageCollectionsPanel.prototype
	 **/
{
     initialize: function() {
         Panel.prototype.initialize.call(this);

         var params = this.options;

         var contents = this.contents;

         var $ = jQuery;
         
         /**
          *  The panel contents
          **/
         var manageCollectionsPanelContents = $('#manage_collections_panel_contents');
         if(typeof(manageCollectionsPanelContents) == 'undefined') {
             throw new Error('manageCollectionsPanelContents is undefined');
         }
         else if(manageCollectionsPanelContents.length == 0) {
             throw new Error('manage_collections_panel_contents not found');
         }
         this.manageCollectionsPanelContents = manageCollectionsPanelContents;
         
         /**
         *  The set of member collections we are managing on this panel.
         **/
         var userMemberCollectionsSet = params.userMemberCollectionsSet;
         if(typeof(userMemberCollectionsSet) == 'undefined') {
             throw new Error('params.userMemberCollectionsSet is undefined');
         }
         this.userMemberCollectionsSet = userMemberCollectionsSet;
         
         /**
          *  The set of requests we are managing on this panel.
          **/
         var userRequestsSet = params.userRequestsSet;
         if(typeof(userRequestsSet) == 'undefined') {
             throw new Error('params.userRequestsSet is undefined');
         }
         this.userRequestsSet = userRequestsSet;

         _.bindAll(this, "render");
         userMemberCollectionsSet.bind('refresh', this.render);
         userMemberCollectionsSet.bind('add', this.render);
         userMemberCollectionsSet.bind('remove', this.render);
         userRequestsSet.bind('refresh', this.render);
         userRequestsSet.bind('add', this.render);
         userRequestsSet.bind('remove', this.render);
     },
     render: function() {

         /* Temporary fragment for all DOM additions */
         var frag = document.createDocumentFragment();

         this.userMemberCollectionsSet.each(function(panel, frag) {
            return function(obj){
                if(obj.get("user_is_admin")) {     
                    /* Create a ManageAdminCollectionWidget */
                    var widget = new ManageAdminCollectionWidget({
                        template: $('#manage_admin_collection_template'), 
                        model: obj, 
                        panel: panel
                    });
                }
                else {
                    /* Create a ManageMemberCollectionWidget */
                    var widget = new ManageMemberCollectionWidget({
                        template: $('#manage_member_collection_template'),
                        model: obj,
                        panel: panel
                    });
                }
                
                frag.appendChild(widget.el);
            };
        }(this, frag));
        
        this.userRequestsSet.each(function(panel, frag) {
            return function(obj){
                /* Create a ManageRequestWidget */
                var widget = new ManageRequestWidget({
                    template: $('#manage_request_collection_template'),
                    model: obj,
                    panel: panel
                });
                
                frag.appendChild(widget.el);
            }
        }(this, frag));

        /* Update manage collections list */
        this.manageCollectionsPanelContents.empty().append(frag);

        return this;
    }

});
