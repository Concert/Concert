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
        
        /**
         *  The list on the right side of the UI.
         **/
        this.listPanel = new ListPanel({
            page: this, 
            el: $('#list_panel'),
            modelManager: this.modelManager
        });
        
    },
    _initialize_routes: function() {
        Page.prototype._initialize_routes.call(this);
        
        
        _.bindAll(this, '_collections_route');
        this.route('', 'collections', this._collections_route);
        
        
        return;
    }, 
    
    /**
     *  Route for "/".  Lists collections and such.
     **/
    _collections_route: function() {
        this.currentRoute = 'collections';
    }, 
});