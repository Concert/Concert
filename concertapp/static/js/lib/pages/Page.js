/**
 *  @file       Page.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  This is the class that contains the functionality that needs to be run on
 *  every page.
 *	@class
 *  @extends    Backbone.Controller
 **/
var Page = Backbone.Controller.extend(
	/**
	 *	@scope	Page.prototype
	 **/
{
    initialize: function(params) {
        /**
         *  The current route that we are on.
         **/
        this.currentRoute = null;

        /* Create dataset manager */
        var modelManager = this._initializeModelManager(_.extend(params, {
            page: this 
        }));
        this.modelManager = modelManager;
        com.concertsoundorganizer.modelManager = modelManager;

        /* Create views */
        this._initializeViews();
        
        /* Load data so views can update and such */
        this.modelManager._loadData();
        
        /* Initialize routes */
        this._initialize_routes();
        
        Backbone.history.start();
        
    }, 
    /**
     *  This method just defines which dataset manager to use.  Should be overridden
     *  in child classes for appropriate type.
     *
     **/
    _initializeModelManager: function(params) {
        return new ModelManager(params);
    }, 
    
    /**
     *  This method is called when views are to be created.  Should be overridden
     *  in child classes.
     **/
    _initializeViews: function() {
        return;
    }, 
    
    /**
     *  This method is called when routes are to be initialized.
     **/
    _initialize_routes: function() { 
        
        _.bindAll(this, '_default_route');
        this.route('', 'default', this._default_route);
        
        return;
    }, 
    
    /**
     *  The default route will just redirect to the defaultHash for now.
     **/
    _default_route: function() {
        window.location.assign(this.defaultHash);
    }, 
});