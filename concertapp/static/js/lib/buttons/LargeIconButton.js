/**
 *  @file       LargeIconButton.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/ 


/**
 *  This is a class for the large buttons (right now found in top options bar).  
 *  Label appears underneath icon when hovered, and goes away afterwards.
 *	@class
 **/
function LargeIconButton(params) {
    if(params) {
        this.init(params);
    }
}
LargeIconButton.prototype = new IconButton();

LargeIconButton.prototype.init = function(params) {
    IconButton.prototype.init.call(this, params);

    /* There are no new params. */

}

/**
 *  We will override the hoverIn so we can show the label (if one exists).
 **/
LargeIconButton.prototype.hoverIn = function() {
    var label = this.label;
    /* If we have a label */
    if(typeof(label) != 'undefined') {
        /* Add the 'hover' class to our label */
        label.addClass('hover');
    }

    /* Then call parent */
    IconButton.prototype.hoverIn.call(this);
}

/**
 *  We will also override the hoverOut so we can hide the label
 **/
LargeIconButton.prototype.hoverOut = function() {
    var label = this.label;
    
    /* If we have a label */
    if(typeof(label) != 'undefined') {
        /* remove the 'hover' class from the label */
        label.removeClass('hover');
    }
    
    /* Then call parent */
    IconButton.prototype.hoverOut.call(this);
}