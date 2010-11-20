/**
 *  @file       Panel.js
 *  Any panel that distinguishes groups of functionality on the UI.  This could be
 *  the top "global options" bar, or the waveform playback panel.  Panels will
 *  contain widgets, which may be buttons or groups of buttons.
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  Panel is meant to be an abstract class.  It doesn't do much on its own.
 **/
function Panel(params) {
    if(params) {
        this.init(params);
    }
}

/**
 *  Initialize the UI Panel.  Should be called from child class.
 *
 *  @param  params.container        jQuery object - container for panel  
 *  @param  params.loading          Boolean -   Wether or not this panel is initially
 *                                      to display a loading notification.
 **/
Panel.prototype.init = function(params) {
    
    var container = params.container;
    if(typeof(container) == 'undefined') {
        throw new Error('params.container is undefined');
    }
    else if(container.length == 0) {
        throw new Error('container not found');
    }
    this.container = container;

    
    /* Get the loader element for this panel */
    var loader = container.children('.panel_loader');
    if(typeof(loader) == 'undefined' || loader.length == 0) {
        throw new Error('Malformed HTML.  No panel_loader element found for panel: '+container.attr('id'));
    }
    this.loader = loader;
    
    /** This boolean will keep track of if we are loading or not */
    var loading = params.loading;
    if(typeof(loading) == 'undefined') {
        loading = false;
    }
    this.loading = loading;

    /* If we should be loading, show the loading notification */
    if(loading) {
        this.showLoadingNotification();
    }

    
}

/**
 *  This function should be called when the panel is loading, or when the panel
 *  is done displaying a loading notification.
 **/
Panel.prototype.toggleLoadingNotification = function() {
    var loading = this.loading;
    if(!loading) {
        /* Enable loading notification */
        this.showLoadingNotification();
        this.loading = true;
    }
    else {
        this.hideLoadingNotification();
        this.loading = false;
    }
};

Panel.prototype.showLoadingNotification = function() {
    this.loader.addClass('panel_loader_enabled');    
};

Panel.prototype.hideLoadingNotification = function() {
    this.loader.removeClass('panel_loader_enabled');
};


