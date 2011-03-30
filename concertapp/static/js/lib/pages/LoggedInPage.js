/**
 *  @file       LoggedInPage.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  This class will run certain functionality that must be run on every page where
 *  a user is logged in.
 *	@class
 *  @extends    Page
 **/
/**
 *  This class includes functionality that runs on each page that the user is logged
 *  in.
 *  @class
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
        
        /*  Create the globalOptionsPanel (the buttons and menus at the top of every 
            page) */
        this.globalOptionsPanel = new GlobalOptionsPanel({
            page: this, 
            el: $('#global_options_panel'),
            userMemberCollections: this.modelManager.userMemberCollections
        });
    },
    _initialize_routes: function() {
        Page.prototype._initialize_routes.call(this);
        
        return;
    }, 
});