/**
 *  @file       UploadPanel.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  The panel that contains the upload form for the user to upload multiple files.
 *  @class
 **/
var UploadPanel = Panel.extend(
	/**
	 *	@scope	UploadPanel.prototype
	 **/
{
    initialize: function() {
        Panel.prototype.initialize.call(this);

        var params = this.options;
        
        var contents = this.contents;
        var $ = jQuery;
        
        /* We will keep the filewidgets here, indexed by their 'count' */
        this.files = [];

        /* We will also keep the filewidgets here, but remove them when they start
            uploading */
        this.filesToUpload = [];

        /* The form we will change each time we upload a file */
        var uploadFormElement = $('#server_upload_form');
        if(typeof(uploadFormElement) == 'undefined') {
            throw new Error('params.uploadFormElement is undefined');
        }
        else if(uploadFormElement.length == 0) {
            throw new Error('uploadFormElement not found');
        }
        this.uploadFormElement = uploadFormElement;

        var fileChooserContainer = $('#choose_file_container');
        if(typeof(fileChooserContainer) == 'undefined') {
            throw new Error('params.fileChooserContainer is undefined');
        }
        else if(fileChooserContainer.length == 0) {
            throw new Error('fileChooserContainer not found');
        }
        this.fileChooserContainer = fileChooserContainer;

        var fileChooserTemplate = $('#file_chooser_template');
        if(typeof(fileChooserTemplate) == 'undefined') {
            throw new Error('params.fileChooserTemplate is undefined');
        }
        else if(fileChooserTemplate.length == 0) {
            throw new Error('fileChooserTemplate not found');
        }
        this.fileChooserTemplate = fileChooserTemplate;

        var uploadFileWidgetTemplate = $('#uploadfilewidget_template');
        if(typeof(uploadFileWidgetTemplate) == 'undefined') {
            throw new Error('params.uploadFileWidgetTemplate is undefined');
        }
        else if(uploadFileWidgetTemplate.length == 0) {
            throw new Error('uploadFileWidgetTemplate not found');
        }
        this.uploadFileWidgetTemplate = uploadFileWidgetTemplate;

        var filesTable = $('#files_table');
        if(typeof(filesTable) == 'undefined') {
            throw new Error('params.filesTable is undefined');
        }
        else if(filesTable.length == 0) {
            throw new Error('filesTable not found');
        }
        this.filesTable = filesTable;

        var uploadButtonElement = $('#upload_submit_button');
        if(typeof(uploadButtonElement) == 'undefined') {
            throw new Error('params.uploadButtonElement is undefined');
        }
        else if(uploadButtonElement.length == 0) {
            throw new Error('uploadButtonElement not found');
        }
        this.uploadButtonElement = uploadButtonElement;

        var fileChooserLabel = $('#file_uploader_label');
        if(typeof(fileChooserLabel) == 'undefined') {
            throw new Error('params.fileChooserLabel is undefined');
        }
        else if(fileChooserLabel.length == 0) {
            throw new Error('fileChooserLabel not found');
        }
        this.fileChooserLabel = fileChooserLabel;

        var statusContainer = $('#status_container');
        if(typeof(statusContainer) == 'undefined') {
            throw new Error('params.statusContainer is undefined');
        }
        else if(statusContainer.length == 0) {
            throw new Error('statusContainer not found');
        }
        this.statusContainer = statusContainer;

        /* This will animate the dots on the status container */
        this.dotsAnimator = new AnimatedDots({
            container: $('#status_animated_dots')
        });

        /* We don't need to show status container right now */
        statusContainer.hide();


        /* When upload button is pressed, start uploading */
        uploadButtonElement.click(function(me) {
            return function() {
                me.startUpload();
            };
        }(this));


        /* The current file chooser that the user can see */
        this.currentFileChooser = null;

        /* Keep track of how many files have been chosen.  This is incremented
            when a file is chosen. */
        this.fileIndex = -1;


        this.createNewFileChooser();
        

        
        this.render();
    },
    render: function() {
        
        return this;
    },

    

    handleUploadError: function() {
        /* TODO: Write this function */
    },
    /**
     *  Increment this.count member variable, and create the new "file chooser".  Then
     *  put this in the appropriate location in the DOM.
     **/
    createNewFileChooser: function() {
        /* Increment the file index because we may add a new file */
        var newFileIndex = ++this.fileIndex;

        /* Create new file chooser */
        var chooser = this.fileChooserTemplate.tmpl({
            id: newFileIndex 
        });

        /* When a file is chosen with this new element */
        chooser.bind('change', function(me){
            return function() {
                me.addFile($(this));
            };
        }(this));

        /* Add chooser to DOM */
        this.fileChooserContainer.html(chooser);    

    },
    /**
     *  This should be called when the user selects a file.  It will add the file to 
     *  the queue, as well as to the 'file_list' in the DOM.  This will be done by
     *  creating a new UploadingFileWidget, and moving the inputElement into the
     *  widget.
     *
     *  @param  {jQuery HTMLInputElement}   fileChooser - the <input> element that 
     *                                      the user used to select this file.
     **/
    addFile: function(fileChooser) {
        /* The index for the current file */
        var index = this.fileIndex;

        /* Create new UploadFileWidget */
        var widget = new UploadFileWidget({
            template: this.uploadFileWidgetTemplate, 
            model: new Backbone.Model({
                filename: fileChooser.attr('files')[0].fileName, 
                id: index
            }),
            /* Remove fileChooser from DOM, and send to UploadFileWidget */
            fileChooser: fileChooser.detach(), 
            panel: this
        });


        /* Add widget to DOM */
        this.filesTable.append($(widget.render().el));
        /* Add widget to data structures */
        this.files[index] = widget;
        this.filesToUpload[index] = widget;

        /* Re-populate document with new file chooser (do this when we can support
            multiple file uploads) */
        //this.createNewFileChooser();

        /* Remove "select a file to upload" button */
        this.fileChooserLabel.hide();
    },
    /**
     *  Should be called when upload button is pressed.  This will initiate the uploading
     *  of all the widgets in the queue.
     **/
    startUpload: function() {

        /* Hide upload button */
        this.uploadButtonElement.hide();

        /* Hide file chooser and file chooser label form */
        this.fileChooserContainer.hide();
        this.fileChooserLabel.hide();

        /* Show "uploading..." or something of that nature at the top of the file list */
        this.statusContainer.show();

        /* Start dot animation */
        this.dotsAnimator.start();

        /* Upload first file */
        this.uploadNext();
    },
    /**
     *  This should be called after startUpload has been called once, and after
     *  each file is done uploading.
     **/
    uploadNext: function() {
        var next = this.filesToUpload.shift();

        next.startUpload();
    }
});

