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
     *  @param  {Page}                  params.router - the page that this panel 
     *                                  belongs to
     *  @param  {Boolean}               params.loading -   Wether or not this panel
     *                                  is initially to display a loading 
     *                                  notification.
     **/
    initialize: function() {
        this._initialize_elements();
        
        _.bindAll(this, 'render');
        
        /**
         *  This is a map of key value pairs, where each key is a "route:xxx" string
         *  and each value is a string that represents the method to be used to 
         *  render this route.  This is initialized in the _initialize_route_handlers
         *  method.
         **/
        this.routeHandlerMap = null;
        this._initialize_route_handlers();
        
        var routeHandlerMap = this.routeHandlerMap;
        var router = this.router;
        /* For each route handler */
        for(var route in routeHandlerMap) {
            var handlerString = routeHandlerMap[route];
            var handlerMethod = this[handlerString];
            /* If this method exists */
            if(handlerMethod) {
                /* Closure */
                _.bindAll(this, handlerString);
                /* Handle this route with the corresponding method */
                router.bind(route, this[handlerString]);
            }
            /* Just use render method */
            else {
                router.bind(route, this.render);
            }
            
        }
        

    },
    
    _initialize_elements: function() {
        var params = this.options;
        
        var router = params.router;
        if(typeof(router) == 'undefined') {
            throw new Error('params.router is undefined');
        }
        this.router = router;

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
            this.show_loading_notification();
        }
    }, 
    
    /**
     *  Initialize all methods for handling route changes.  Each panel should be
     *  able to handle any route or state change from the controller.
     **/
    _initialize_route_handlers: function() {
        this.routeHandlerMap = {
            'route:collections': 'render_collections', 
            'route:collection': 'render_collection', 
            'route:collection_manage': 'render_collection_manage',
            'route:collection_audio': 'render_collection_audio', 
            'route:collection_audio_file': 'render_collection_audio_file',
            'route:collection_audio_segment': 'render_collection_audio_segment',
            'route:collection_upload': 'render_collection_upload'
        };
    }, 
    
    /**
     *  Render a panel.  Should be subclassed if needed.
     **/
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
            this.show_loading_notification();
        }
        else {
            this.hide_loading_notification();
        }
    },

    /**
     *  Display the loading notification on this panel.
     **/
    show_loading_notification: function() {
        this.loader.addClass('panel_loader_enabled');
        this.loading = true;
    },

    /**
     *  Hide the loading notification on this panel.
     **/
    hide_loading_notification: function() {
        this.loader.removeClass('panel_loader_enabled');
        this.loading = false;
    }

});
