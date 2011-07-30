/**
 *  @file       ModalAlert.js
 *  @author Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  A ModalAlert object is a "window" that pops up to alert the user.  Any content
 *  can be injected into this window.  The intent is for only one of these objects
 *  to be instantiated ever, but I suppose you could have multiple ModalAlert objects
 *  if you wanted to.
 *
 *	@class
 **/
function ModalAlert(params) {
    if(params) {
        this.init(params);
    }
}

ModalAlert.prototype.init = function(params) {
    /**
     *  Initialize behavior for closing modal window
     **/
    var closeButton = $('button#modal-overlay-close-button');
    closeButton.live('click',function(me) {
        return function() {
            $(me).trigger('cancel');
            me.close();
        }
    }(this));
    this.closeButton = closeButton;
    
    $(document).keyup(function(me){
        return function(event){
            if(me.isOpen) {
                /* If escape key was pressed */
                if(event.keyCode == 27) {
                    $(me).trigger('cancel');
                    me.close();
                }
            }
        };
    }(this));
    
    /*  Is modal window open? it is initially closed  */
    var open = false; 
    this.open = open;
    
    /* For right now, we can only use our HTML, but these should really be
        passed in to make this code flexible */
    var pane = $('div#modal-overlay-pane');
    this.pane = pane;
    
    var paneHeader = $('h2#modal-overlay-header');
    this.paneHeader = paneHeader;
    
    var paneContent = $('div#modal-overlay-content');
    this.paneContent = paneContent;
    
    var container = $('div#modal-overlay');
    this.container = container;
    
}


/**
 *  Display a modal window with the content sent into the content argument.
 *  position in the middle of the screen.
 *
 *  @param  {String/HTMLDivElement}       params.content: The content for the window
 *  @param  {String}                      params.title: The content for the title, 
 *                                          defaults to "Alert".
 *  @param  {String}                      params.url: The URL of the content to display  
 *  @param  {Boolean}                     params.noOptions: if true, no options will be
 *                                          displayed.
 **/
ModalAlert.prototype.displayContent = function(params) {
    var $ = jQuery;
    
    var overlayPane = this.pane;
    overlayPane.hide();
    
    var paneHeader = this.paneHeader;
    var paneContent = this.paneContent;
    
    var content = params.content;
    if(typeof(content) == 'string') {
        paneContent.html(content);
    }
    else if(typeof(content) == 'HTMLDivElement') {
        paneContent.append(content);
    }
    else if(typeof(content) == 'undefined') {
        var url = params.url;
        if(typeof(url) == 'undefined') {
            throw new Error('Error: params.content or params.url must be defined');
        }
        else {
            this.loadAndDisplayContent({
                'url': url,
                'title': title
            });
            return;
        }
    }
    else {
        throw new Error('content must be a string or HTMLDivElement');
    }
    
    var title = params.title;
    if(typeof(title) == 'undefined') {
        title = 'Alert';
    }
    paneHeader.html(title);
    
    
    
    this.container.show();
    
    
    /* Should we hide all options? */
    var noOptions = null;
    if(typeof(params.noOptions) == 'undefined') {
        noOptions = false;
    }
    else {
        noOptions = true;
    }
    
    if(noOptions) {
        /* Hide close button */
        this.closeButton.hide();
    }
    else {
        /* Make sure closeButton is shown */
        this.closeButton.show();
    }
    
    
    /* position pane in center of window */
    var $window = $(window);
    var windowWidth = $window.width();
    var windowHeight = $window.height();
    var paneWidth = overlayPane.width();
    var paneHeight = overlayPane.height();
    
    
    overlayPane.css({
        'top': (windowHeight/2)-(paneHeight/2),
        'left': (windowWidth/2)-(paneWidth/2)
    });
    
    /* Animate entry */
    overlayPane.fadeIn('slow');
    
    this.isOpen = true;
}


/**
 *  Load a partial (html) file sent in as argument, and display that in the
 *  modal window.
 *
 *  @param          {Object}          params {
 *                      String          url: The URL of the content
 *                      String          title: The title of the modal alert
 *                                  }
 **/
ModalAlert.prototype.loadAndDisplayContent = function(params) {
    /* If there was no callback, we are just displaying the content */
    if(typeof(params.callback) == 'undefined') {
        var title = params.title;
        params.callback = function(me, title) {
            return function(data) {
                me.displayContent({content: data, title: title });
            };
        }(this, title);        
    }
    
    this.loadAndExecuteCallback(params)
}

/**
 *  Loads a partial defined by params.url, and fires callback stored
 *  in params.callback, sending data retrieved.
 *
 *  @param  {Object}        params  {
 *                          url: The URL of the content
 *                          callback: The callback function that takes a data arg
 *                          }
 **/
ModalAlert.prototype.loadAndExecuteCallback = function(params) {
    /* Show loading notification */
    this.loading(true);
    
    $.ajax({
        'url': params.url,
        'success': function(me, callback) {
            return function(data, textStatus) {
                if(textStatus == 'success') {
                    me.loading(false);
                    callback(data)
                }
                else {
                    throw new Error('An error has occurred');
                }
            };
        }(this, params.callback),
        'error': function(XMLHttpRequest, textStatus, errorThrown) {
            throw new Error('Request failed.  textStatus: '+textStatus+', error: '+errorThrown);
        }
    });   
    
}

/**
 *  Method should be called when modal window is to close.
 **/
ModalAlert.prototype.close = function() {
    this.container.hide();
    
    this.isOpen = false;
}

/**
 *  Should be called when a loading window is to appear.  The argument, show, means
 *  that if set to true, the loading box will be shown.  If set to false, the 
 *  loading animation will stop and window will be closed.
 *
 *  @param  {Boolean}        show     true: show loading, false: hide
 **/
ModalAlert.prototype.loading = function(show) {
    if(show) {
        /* Show modal with loading notification */
        this.displayContent({'title': 'Loading', 'content': '', 'noOptions': true});
        
        this.loadingAnimationInterval = setInterval(function(me) {
            return function() {
                me.animateLoadingNotification();
            };
        }(this), 500);
        
    }
    else {
        /* Stop loading notification animation */
        clearInterval(this.loadingAnimationInterval);
        this.close();
    }
}

/**
 *  Once a loading notification has been set, this function runs every 500ms.
 *  It just animates the periods after the word "Loading" in the title of the
 *  modal box.
 **/
ModalAlert.prototype.animateLoadingNotification = function() {
    var title = this.paneHeader;
    
    var transitions = {
        'Loading': 'Loading.', 
        'Loading.': 'Loading..', 
        'Loading..': 'Loading...',
        'Loading...': 'Loading'
    }
    
    title.html(transitions[title.html()]);
}
