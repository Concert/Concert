/**
 *  @file       UploadLinkLargeIconButton.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  The button that will take you to the upload form.  This is where we'll define
 *  all specific functionality, animations, etc for this particular button.
 *	@class
 **/
function UploadLinkLargeIconButton(params) {
    if(params) {
        this.init(params);
    }
}
UploadLinkLargeIconButton.prototype = new LinkLargeIconButton();

UploadLinkLargeIconButton.prototype.init = function(params) {
    LinkLargeIconButton.prototype.init.call(this, params);

    /* Nothing right now */
}