/**
 *  @file       LoginPage.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 

/**
 *  This is the functionality that runs on the login page (if any)
 *  @class
 *  @extends    Page
 **/
var LoginPage = Page.extend(
	/**
	 *	@scope	LoginPage.prototype
	 **/
{
    _initializeViews: function() {
        /* This will throw a modal window to the user 
            if there is a compatibility problem. */
        detectBrowserCompatibility();
    }, 
    
    /**
     *  This method is called when routes are to be initialized.
     **/
    _initialize_routes: function() { 

        _.bindAll(this, this._default_route);
        this.route('', 'default', this._default_route);

        return;
    }, 

    /**
     *  This is the default route that will be executed.
     **/
    _default_route: function() {
        return;
    },
});