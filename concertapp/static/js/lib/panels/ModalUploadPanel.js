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

        /**
         *    Container for upload display at top of layout.
         **/
        this.uploadStatusContainer = $('#upload_status_container');

        /**
         *    Template for "upload" link
         **/
        this.uploadLinkTemplate = $('#modaluploadpanel_upload-link_template');
    },

    /**
     *  This will be called by default on all routes other than #collections and
     *  #collection/:collectionId/upload
     **/
    render: function(collectionId, collection) {
        Panel.prototype.render.call(this);
        
        this._hide();

        /* render upload link in status container */
        this.uploadStatusContainer.html(
            this.uploadLinkTemplate.tmpl(collection)
        );

        /* Show upload status container, since we're on a specific collection */
        this.uploadStatusContainer.show();
        
        return this;
    },

    /**
     *    When we're on the collections view, hide upload status area.
     **/
    render_collections: function () {
        this.uploadStatusContainer.hide();
    }, 
    
    /**
     *  When we're on upload route
     **/
    render_collection_upload: function(collectionId, collection) {
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

