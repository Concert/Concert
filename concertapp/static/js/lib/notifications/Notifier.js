/**
 *  @file       Notifier.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  This is an object which can notify the user in a few different ways.  Right now
 *  the only options that are available are modal dialogs and modal alerts.  In 
 *  the future, a "growl" like interface can be triggered from here.  This should
 *  be a singleton object, i.e. only one should be instantiated.
 *	@class
 **/
function Notifier(params) {
    if(params) {
        this.init(params);
    }
}

Notifier.prototype.init = function(params) {
    
    this.modalAlertObject = new ConfirmModalAlert(params);
}

/**
 *  Use this if you just want to display words to user, and not worry about getting
 *  anything back.
 *
 *  @param  {Object}        params            {
 *                                              title: The title of the alert
 *                                              content: the content of the alert
 *                                              url: instead of content, the url
 *                                          }
 **/
Notifier.prototype.alert = function(params) {
    var contentOrUrl = this.validateParams(params);
    if(contentOrUrl == 'content') {
        this.modalAlertObject.displayContent(params);
    }
    else {
        this.modalAlertObject.loadAndDisplayContent(params);
    }
}

/**
 *  Use this if you want to do something different if the user chooses yes or no.
 *
 *  @param  {Object}        params            {
 *                                              title: The title of the alert
 *                                              content: the content of the alert
 *                                              url: instead of content, the url
 *                                              confirmCallback: the function to 
 *                                                  execute when user confirms.
 *                                              cancelCallback: the function to 
 *                                                  execute when user cancels.
 *                                          }
 **/
Notifier.prototype.confirm = function(params) {
    var contentOrUrl = this.validateParams(params);
    
    if(contentOrUrl == 'content') {
        this.modalAlertObject.displayContentWithConfirm(params);
    }
    else {
        this.modalAlertObject.loadAndDisplayContentWithConfirm(params);
    }
}

/**
 *  Since we need to do this for a confirm or alert.  Just makes sure user sent
 *  in either content or URL parameters.
 *
 *  @param  {Object}        params 
 **/
Notifier.prototype.validateParams = function(params) {
    
    
    /* If there is no cancelCallback, use empty function */
    if(typeof(params.cancelCallback) == 'undefined') {
        params.cancelCallback = function() {
            
        };
    };
    
    
    /* Check if the user passed in content */
    var content = params.content;
    if(typeof(content) == 'undefined') {
        /* Check if the user passed in a url */
        var url = params.url;
        if(typeof(url) == 'undefined') {
            throw new Error('Error: params.url or params.content must be defined.');
        }
        else {
            /* URL was passed in */
            return 'url';
        }
    }
    else {
        /* Content was passed in */
        return 'content';
    }
    
}