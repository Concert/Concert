/**
 *  @file       ModalUploadPanel.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  @class  Panel used for uploading audio. Pops up as a modal dialog.
 *  @extends    Panel
 **/
var ModalUploadPanel = Panel.extend(
    /**
     *  @scope  ModalUploadPanel.prototype
     **/
{
    initialize: function() {
        Panel.prototype.initialize.call(this);

        var params = this.options;
    },

    /**
     *  This will be called by default on all routes other than #upload
     **/
    render: function() {
        Panel.prototype.render.call(this);
        
        this._hide();
        
        return this;
    },
    
    /**
     *  When we're on upload route
     **/
    render_upload: function() {
        /* Show modal window */
        this._show();
    }, 
    
    /**
     *  Show the modal panel
     **/
    _show: function() {
        this.el.removeClass('hidden');
        
        /* Bind to the escape key */
        $(document).bind('keyup', function(e) {
            if(e.keyCode == 27) {
                /* go back to wherever we were */
                history.go(-1);
            }
        });
    }, 
    
    /**
     *  Hide the modal panel
     **/
    _hide: function() {
        this.el.addClass('hidden');
    }
});

