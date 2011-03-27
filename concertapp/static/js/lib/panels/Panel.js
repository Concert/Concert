/**
 *  @file       Panel.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  Any panel that distinguishes groups of functionality on the UI.  This could be
 *  the top "global options" bar, or the waveform playback panel.  Panels will
 *  contain widgets, which may be buttons or groups of buttons.
 *  Panel is meant to be an abstract class.  It doesn't do much on its own.
 *  @class
 **/
var Panel = Backbone.View.extend(
	/**
	 *	@scope	Panel.prototype
	 **/
{
    /**
     *  @param  {jQuery HTMLElement}    params.container - container for panel  
     *  @param  {Page}                  params.page - the page that this panel 
     *                                  belongs to
     *  @param  {Boolean}               params.loading -   Wether or not this panel
     *                                  is initially to display a loading 
     *                                  notification.
     **/
    initialize: function() {
        var params = this.options;
        
        var page = params.page;
        if(typeof(page) == 'undefined') {
            throw new Error('params.page is undefined');
        }
        this.page = page;

        var container = $(this.el);
        
        /* This is a reference to the panel's contents */
        var contents = container.children('.panel_contents');
        if(typeof(contents) == 'undefined') {
            throw new Error('contents is undefined for panel');
        }
        else if(contents.length == 0) {
            throw new Error('malformed HTML: contents not found');
        }
        this.contents = contents;

        /* This is a reference to the div that contains the panel's header */
        var header = container.children('.panel_header');
        if(typeof(header) == 'undefined') {
            throw new Error('header is undefined for panel');
        }
        else if(header.length == 0) {
            throw new Error('header not found for panel');
        }
        this.header = header;


        /* Get the loader element for this panel */
        var loader = container.children('.panel_loader');
        if(typeof(loader) == 'undefined' || loader.length == 0) {
            throw new Error('Malformed HTML.  No panel_loader element found for panel');
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
        
    },
    
    /* This should be overridden */
    render: function() {
        
        return this;
    },
    
    /**
     *  This function should be called when the panel is loading, or when the panel
     *  is done displaying a loading notification.
     **/
    toggleLoadingNotification: function() {
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
    },

    /**
     *  Display the loading notification on this panel.
     **/
    showLoadingNotification: function() {
        this.loader.addClass('panel_loader_enabled');    
    },

    /**
     *  Hide the loading notification on this panel.
     **/
    hideLoadingNotification: function() {
        this.loader.removeClass('panel_loader_enabled');
    }
    
});
