/**
 *  @file       IconButton.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  This is a class for a button with an icon.  This is subclassed into 
 *  SmallIconButton and LargeIconButton.
 *	@class
 *  @augments Button
 **/
function IconButton(params) {
    if(params) {
        this.init(params);
    }
}
IconButton.prototype = new Button();

/**
 *  Initialize button behaviors and such.
 **/
IconButton.prototype.init = function(params) {
    Button.prototype.init.call(this, params);

    var container = this.container;
    
    /* Get label and icon by traversing from container */
    var label = container.children('.large-icon-button-label');
    if(typeof(label) == 'undefined' || label.length == 0) {
        throw new Error('label not found for '+container.attr('id'));
    }
    this.label = label;
    
    var icon = container.children('.large-icon-button-icon');
    if(typeof(icon) == 'undefined' || icon.length == 0) {
        throw new Error('icon not found for '+container.attr('id'));
    }
    this.icon = icon;
    
}