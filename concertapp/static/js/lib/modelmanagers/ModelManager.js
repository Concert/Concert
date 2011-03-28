/**
 *  @file       ModelManager.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  This is the base class for a group of data sets.  A single ModelManager
 *  (or subclass) object will be instantiated on each page.  The functionality
 *  contained below is required on any page.
 *  @class
 **/
function ModelManager(params) {
    if(params) {
        this.init(params);
    }
}

/**
 *  @constructor
 **/
ModelManager.prototype.init = function(params) {
    /* Here we will store the temporary data that we will load later */
    this._dataToLoad = {};
    
    /* Here is where we will store all of the seen instances of each model */
    this.seenInstances = {};
    
    /* Keep a reference to the page */
    var page = params.page;
    if(typeof(page) == 'undefined') {
        throw new Error('params.page is undefined');
    }
    this.page = page;
    
};

/**
 *  Called when data is to be loaded.
 **/
ModelManager.prototype._loadData = function() {
    return;
};