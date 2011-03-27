/**
 *  @file       DashboardPage.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  Functionality associated with the dashboard page.
 *	@class
 *  @extends    LoggedInPage
 **/
var DashboardPage = LoggedInPage.extend(
	/**
	 *	@scope	DashboardPage.prototype
	 **/
{
    /**
     *  Our dataset manager is this one.
     **/
    _initializeModelManager: function(params) {
        return new LoggedInModelManager(params);
    }, 
    
    /**
     *  
     **/
    _initializeViews: function() {
        LoggedInPage.prototype._initializeViews.call(this);
    }
});