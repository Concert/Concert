/**
 *  @file       LinkLargeIconButton.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  Just a large icon button that redirects to a URL when clicked.
 *	@class
 **/
function LinkLargeIconButton(params) {
    if(params) {
        this.init(params);
    }
}
LinkLargeIconButton.prototype = new LargeIconButton();

LinkLargeIconButton.prototype.init = function(params) {
    LargeIconButton.prototype.init.call(this, params);

    /* Get data-href attribute from container.  This will define where the page 
        redirects to */
    var href = this.container.data('href');
    if(typeof(href) == 'undefined') {
        throw new Error('Element #'+container.attr('id')+'\'s data-href attribute is undefined');
    }
    this.href = href;
    
}

/**
 *  When button is clicked, just redirect to the location specified in the data-href
 *  attribute of the container.
 **/
LinkLargeIconButton.prototype.click = function() {
    LargeIconButton.prototype.click.call(this);
    
    window.location = this.href;
}