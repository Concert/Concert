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
        var uploadMiniStatusContainer = this.uploadMiniStatusContainer = $('#upload_mini_status_container');

        /**
         *    Container for upload status at top of panel
         **/
        var uploadStatusContainer = this.uploadStatusContainer = $('#upload_status_container');
        if(typeof(uploadStatusContainer) == 'undefined') {
            throw new Error('this.uploadStatusContainer\' is undefined');
        }
        else if(uploadStatusContainer.length == 0) {
            throw new Error('uploadStatusContainer not found');
        }


        /**
         *    Template for "upload" link
         **/
        this.uploadLinkTemplate = $('#modaluploadpanel_upload-link_template');

        /**
         *    Template for a UploadFileWidget
         **/
        this.uploadFileWidgetTemplate = $('#uploadfilewidget_template');

        /**
         *    Input element for collection_id
         **/
        var collectionIdInputElement = this.collectionIdInputElement = $('#upload_panel_collection_id');
        if(!collectionIdInputElement) {
            throw new Error('this.collectionIdInputElement is undefined');
        }
        else if(!collectionIdInputElement.length) {
            throw new Error('collectionIdInputElement not found');
        }

        /* Callbacks for fileupload plugin */
        _.bindAll(this, '_handle_file_added');
        _.bindAll(this, '_handle_upload_progress');

        /* Watch the user's uploadedFiles list for newly added files */
        _.bindAll(this, '_handle_uploaded_file');
        com.concertsoundorganizer.modelManager.user.bind('add:uploadedFiles', this._handle_uploaded_file);

        /* When the upload link button is clicked */
        _.bindAll(this, '_show');
        uploadMiniStatusContainer.bind('click', this._show);
    },

    /**
     *    Called when a new uploaded file is added to the user's list.
     **/
    _handle_uploaded_file: function (audioFile) {
        // console.log('ModalUploadPanel._handle_uploaded_file');
        // console.log('audioFile:');
        // console.log(audioFile);

        /* If file is not done */
        if(audioFile.get('status') != 'd') {
            /* render UploadFileWidget */
            var widget = new UploadFileWidget({
                model: audioFile, 
                template: this.uploadFileWidgetTemplate,
                panel: this
            });

            /* Add to uploadStatusContainer */
            /* TODO: initially this method will be called a whole bunch of times
            if there are files processing, and DOM will potentially reflow repeatedly */
            this.uploadStatusContainer.append(widget.render().el);
        }
    }, 

    /**
     *    When we're on the collections view, hide upload status area.
     **/
    render_collections: function () {
        this._hideMiniStatus();
    },

    /**
     *    When we're looking at a collection, show status
     *    of this collection's uploads.
     **/
    render_collection: function (collectionId, collection) {
        this._showMiniStatus(collection);
        this.collectionIdInputElement.attr('value', collection.get('id'));
    }, 

    /**
     *  When we're looking at a collection's audio, show status
     *  of this collection's uploads.
     **/
    render_collection_audio: function (collectionId, collection) {
        this.render_collection(collectionId, collection);
    }, 

    /**
     *    When we're looking at a specific audio file, show
     *    status of this collection's uploads.
     **/
    render_collection_audio_file: function (collectionId, audioFileId, collection, audioFile) {
        this.render_collection(collectionId, collection);
    }, 

    /**
     *    When we're looking at an audio segment, show status
     *    of this collection's uploads.
     **/
    render_collection_audio_segment: function (collectionId, audioFileId, audioSegmentId, collection, audioFile, audioSegment) {
        this.render_collection(collectionId, collection);
    },
    
    /**
     *  Show the modal panel
     **/
    _show: function() {
        /* jQuery File Upload plugin */
        $('#upload_panel_form').fileupload({
            url: "/upload/", 
            dataType: "json", 
            dropZone: null, 
            fileInput: $('#upload_panel_file_chooser'),
            /* When file is added */
            add: this._handle_file_added,

            /* on upload progress */
            progress: this._handle_upload_progress
        });
            // .bind('fileuploadadd', this._handle_file_added)
            // .bind('fileuploadsend', function (e, data) {console.log('fileuploadsend');console.log('data:');
            // console.log(data);})
            // .bind('fileuploaddone', function (e, data) {console.log('fileuploadone');console.log('data:');
            // console.log(data);})
            // .bind('fileuploadfail', function (e, data) {console.log('fileuploadfail');console.log('data:');
            // console.log(data);})
            // .bind('fileuploadalways', function (e, data) {console.log('fileuploadalways');console.log('data:');
            // console.log(data);})
            // .bind('fileuploadprogress', function (e, data) {console.log('fileuploadprogress');console.log('data:');
            // console.log(data);});
            // .bind('fileuploadprogressall', function (e, data) {console.log('fileuploadprogressall');console.log('data:');
            // console.log(data);});
            // .bind('fileuploadstart', function (e) {console.log('fileuploadstart');})
            // .bind('fileuploadstop', function (e) {console.log('fileuploadstop');})
            // .bind('fileuploadchange', function (e, data) {console.log('fileuploadchange');console.log('data:');
            // console.log(data);})
            // .bind('fileuploaddrop', function (e, data) {console.log('fileuploaddrop');console.log('data:');
            // console.log(data);})
            // .bind('fileuploaddragover', function (e) {console.log('fileuploaddragover');console.log('data:');
            // console.log(data);});
        this.el.removeClass('hidden');
        
        /* Bind to the escape key just once */
        $(document).one('keyup', _.bind(function(e) {
            if(e.keyCode == 27) {
                /* go back to wherever we were */
                // com.concertsoundorganizer.router.goBack();
                /* Just close window for now */
                this._hide();
            }
        }, this));
    }, 
    
    /**
     *  Hide the modal panel
     **/
    _hide: function() {
        this.el.addClass('hidden');
    },

    /**
     *  Show the upload status for a 
     *  given collection.
     **/
    _showMiniStatus: function (collection) {
        /* render upload link in status container */
        this.uploadMiniStatusContainer.html(
            this.uploadLinkTemplate.tmpl(collection)
        );

        /* Show upload status container, since we're on a specific collection */
        this.uploadMiniStatusContainer.show();

    }, 

    /**
     *  Hide upload status.
     **/
    _hideMiniStatus: function () {
        this.uploadMiniStatusContainer.hide();
    }, 

    /**
     *    Called when a file is added to be uploaded.
     **/
    _handle_file_added: function (e, data) {
        var files = data.files;
        if(files.length != 1) {
            throw new Error('Not implemented');
        }
        var file = data.files[0];

        /* Create file object for this currently uploading file */
        com.concertsoundorganizer.modelManager.user.upload_file(file, data);
    },

    /**
     *    Called from upload plugin when a progress event is
     *  triggered.
     **/
    _handle_upload_progress: function (e, data) {
        /* Round progress to one decimal point */
        var progress = Math.round((data.loaded / data.total)*10)/10;
        /* "change" event will only be fired if progress is set to new value */
        data.audioFile.set({'progress': progress});
    }
});

