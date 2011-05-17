/**
 *  @file       SettingsLinkLargeIconButton.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  A button specific for the settings at the top of the page.
 *	@class
 **/
function SettingsLinkLargeIconButton(params) {
    if(params) {
        this.init(params);
    }
}
SettingsLinkLargeIconButton.prototype = new LinkLargeIconButton();

SettingsLinkLargeIconButton.prototype.init = function(params) {
    LinkLargeIconButton.prototype.init.call(this, params);

    /* Do nothing! yay! */
}