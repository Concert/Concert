/**
 *  @file       GlobalOptionsPanel.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  The panel on the top of every page.
 *	@class
 *  @param  {jQuery HTMLSelectElement}      params.collectionSelector - The
 *                                          select which chooses which collection to
 *                                          organize.
 *  @param  {UploadLinkLargeIconButton}     params.uploadButton
 *
 **/
var GlobalOptionsPanel = Panel.extend(
	/**
	 *	@scope	GlobalOptionsPanel.prototype
	 **/
{
    initialize: function() {
        Panel.prototype.initialize.call(this);

        var params = this.options;

        var contents = this.contents;

        /* Make sure parameter was passed in */
        var collectionSelector = contents.find('.collection_selector');
        if(typeof(collectionSelector) == 'undefined' || collectionSelector.length == 0) {
            throw new Error('collectionSelector not found');
        }
        /* Save as member */
        this.collectionSelector = collectionSelector;


        /* Get upload button */
        var uploadButtonContainer = contents.find('#upload_button');
        /* If this page has an upload button */
        if(uploadButtonContainer.length) {
            /* Create UploadLinkLargeIconButton object */
            this.uploadButton = new UploadLinkLargeIconButton({
                container: uploadButtonContainer 
            });        
        }

        /* get settings button */
        var settingsButtonContainer = contents.find('#settings_button');
        /* if this page has a settings button */
        if(settingsButtonContainer.length) {
            /* Create settings Button */
            this.settingsButton = new SettingsLinkLargeIconButton({
                container: settingsButtonContainer 
            });
        }

        var userMemberCollections = params.userMemberCollections;
        if(typeof(userMemberCollections) == 'undefined') {
            throw new Error('params.userMemberCollections is undefined');
        }
        this.userMemberCollections = userMemberCollections;

        


        /** INitialize behavior for collection selector */
        collectionSelector.bind('change', function(e) {
            var collection_id = $(this).val();

//            window.location = '/organize/collection/'+collection_id;
        });

        /* This is the template for the collection dropdown */
        var collectionSelectorOptionsTemplate = $('#collection_selector_options_template');
        if(typeof(collectionSelectorOptionsTemplate) == 'undefined' || collectionSelectorOptionsTemplate.length == 0) {
            throw new Error('collectionSelectorOptionsTemplate not found');
        }
        this.collectionSelectorOptionsTemplate = collectionSelectorOptionsTemplate;


        
        
        /* Bind collection events to render */
        userMemberCollections.bind('reset', this.render);
        userMemberCollections.bind('add', this.render);
        userMemberCollections.bind('remove', this.render);
    },
    
    /* To render this panel, just populate the dropdown */
    render: function() {
        
        /* If there are collections */
        if(this.userMemberCollections.length) {
            /* The dropdown should not be disabled.  TODO: This logic can be in the template. */
            if(this.collectionSelector.attr('disabled')) {
                this.collectionSelector.removeAttr('disabled');
            }
            /* Populate dropdown */
            this.collectionSelector.html(
                this.collectionSelectorOptionsTemplate.tmpl({
                    collections: this.userMemberCollections.toJSON() 
                })
            );            
        }
        else {
            /* There are not collections */
            
            /* Disable dropdown */
            this.collectionSelector.attr('disabled', 'true');
            
            /* TODO: Display notification, or some text in selector?  This logic can also be in the template. */
        }


        return this;
    }

});


