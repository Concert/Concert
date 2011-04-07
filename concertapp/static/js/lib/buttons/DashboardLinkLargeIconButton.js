/**
 *  @file       DashboardLinkLargeIconButton.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  This is the button to navigate to the dashboard.
 *	@class
 **/
function DashboardLinkLargeIconButton(params) {
    if(params) {
        this.init(params);
    }
}
DashboardLinkLargeIconButton.prototype = new LinkLargeIconButton();

DashboardLinkLargeIconButton.prototype.init = function(params) {
    LinkLargeIconButton.prototype.init.call(this, params);

    /* No new params */
    

}