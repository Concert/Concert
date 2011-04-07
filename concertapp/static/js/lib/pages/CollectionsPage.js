/**
 *  @file       CollectionsPage.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  Initialize all stuff needed on the collections page.
 *	@class
 *  @extends LoggedInPage
 **/
var CollectionsPage = LoggedInPage.extend(
	/**
	 *	@scope	CollectionsPage.prototype
	 **/
{
    _initializeModelManager: function(params) {
        return new CollectionsPageModelManager(params);
    }, 
    _initializeViews: function() {
        LoggedInPage.prototype._initializeViews.call(this);
        
        var modelManager = this.modelManager;
        
        /**
         *  Create "create/join collection panel"
         **/
        var createJoinCollectionPanel = new CreateJoinCollectionPanel({
            page: this, 
            el: $('#create_join_panel')
        });
        this.createJoinCollectionPanel = createJoinCollectionPanel;

        var manageCollectionsPanel = new ManageCollectionsPanel({
            page: this,
            el: $('#manage_collections_panel'),
            userMemberCollectionsSet: modelManager.userMemberCollections,
            userRequestsSet: modelManager.userRequests
        });
        this.manageCollectionsPanel = manageCollectionsPanel;

        /**
         *  This panel will allow the user to manage the join requests they have
         *  sent out.
         **/
/*        var manageRequestsPanel = new ManageRequestsPanel({
            page: this, 
            el: $('#manage_request_collections_panel'), 
            set: modelManager.userRequests
        });
        this.manageRequestsPanel = manageRequestsPanel;
*/        
    },
    
    /**
     *  When an administrator denies a join request.
     *
     *  @param  {Request}    req - The request object that the administrator is
     *  changing
     **/
    denyRequestWithConfirm: function(req) {
        /* Show a confirm dialog */
        concertapp.notifier.confirm({
            title: "Are you sure?", 
            content: "Are you sure you want to deny "+req.get('user').get('username')+" from this collection?", 
            confirmCallback: function(req){
                return function() {
                    req.deny();
                }
            }(req)
        });
    }, 
    /**
     *  When an administrator approves a join request.
     *
     *  @param  {Request}    req    -   The request object to be approved.
     **/
    approveRequestWithConfirm: function(req) {
        /* Show a confirm dialog */
        concertapp.notifier.confirm({
            title: "Are you sure?", 
            content: "Are you sure you want to allow "+req.get('user').get('username')+" to organize this collection?", 
            confirmCallback: function(req) {
                return function() {
                    req.approve();
                }
            }(req) 
        });
    },
    /**
     *  When an administrator wishes to delete a collection.
     *
     *  @param  {Collection}    col    -    The collection we're deleting
     **/
    deleteCollectionWithConfirm: function(col) {
        /* First confirm with the user that this is what they would like to do */
        /* TODO: Remove this text */
        concertapp.notifier.confirm({
            title: 'Are you sure?', 
            content: 'Are you sure you want to delete '+col.get('name')+'<br />All associated audio will be removed from Concert.',
            confirmCallback: function(col) {
                return function() {
                    col.destroy({
                        success: function(model, response) {
                        },
                        error: function(model, response) {
                            concertapp.notifier.alert({
                                title: 'Error', 
                                content: 'An Error occurred: '+response.responseText
                            });
                        }
                    });
                };
            }(col)
        });
    },
    /**
     *  When a user creates a new collection.
     *
     *  @param  {String}    col_name    -   The name of the new collection
     **/
    createNewCollection: function(col_name) {
        
        /* For now just use the model manager's method.  TODO: Figure out
        how to better organize this. */
        this.modelManager.create_new_collection(col_name);
        
    }, 
    
    /**
     *  When a user revokes her/his request to join a collection.
     *
     *  @param  {Request}    req    -   The request that is being revoked.
     **/
    revoke_request: function(req) {
        req.revoke();
    },
    /**
     *  When a user decides to leave a collection.
     *
     *  @param  {Collection}    col    -    The collection she/he is leaving.
     **/
    leave_collection_with_confirm: function(col) {
        concertapp.notifier.confirm({
            title: 'Are you sure?', 
            content: 'Are you sure you want to leave '+col.get('name')+'?<br />You will no longer be able to work on this collection\'s assets.', 
            confirmCallback: function(col) {
                return function() {
                    col.leave();
                };
            }(col)
        });
    }
});