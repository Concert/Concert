/**
 *  @file       LoggedInPage.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 

/**
 *  @class  The main controller for when a user is logged into Concert.
 *  @extends    Page
 **/
var LoggedInPage = Page.extend(
	/**
	 *	@scope	LoggedInPage.prototype
	 **/
{
    
    /**
     *  Our dataset manager is this one.
     **/
    _initializeModelManager: function(params) {
        return new LoggedInModelManager(params);
    }, 
    
    /**
     *  Every page where a user is logged in will display a global options panel.
     **/
    _initializeViews: function() {
        Page.prototype._initializeViews.call(this);
        
        /* Create the globalOptionsPanel (the buttons and menus at the top of 
        the page) */
        this.globalOptionsPanel = new GlobalOptionsPanel({
            page: this, 
            el: $('#global_options_panel'),
            userMemberCollections: this.modelManager.user.get('collections')
        });
        
        
        
    },
    _initialize_routes: function() {
        Page.prototype._initialize_routes.call(this);
        
        return;
    }, 
});