/**
 *  @file       ListWidget.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  This is a widget that is found in the list panel.
 *  page.
 *  @class
 *  @extends    Widget
 **/
var ListWidget = Widget.extend(
	/**
	 *	@scope	ListWidget.prototype
	 **/
{
    
    initialize: function() {
        Widget.prototype.initialize.call(this);
        
        var params = this.options;
    },
    render: function() {
        Widget.prototype.render.call(this);
        
        return this;
    },    
    events: {
        'click': '_handle_click',
        'mouseenter': '_handle_mouseenter', 
        'mouseleave': '_handle_mouseleave'
    },
    
    /**
     *  When this widget was clicked on.  Subclasses all probably need to handle
     *  this.
     **/
    _handle_click: function(e) {
        /* Go to click url */
        window.location.assign(this.clickUrl);
    },
    
    /**
     *  When this widget is moused over.
     **/
    _handle_mouseenter: function(e) {
        
    }, 
    
    /**
     *  When this widget receives a mouseout event.
     **/
    _handle_mouseleave: function(e) {
        
    }, 
    
    /**
     *  When the model that this widget represents is selected, we will 
     *  add a selected class.  Called from the panel.
     **/
    select: function() {
        var el = $(this.el);
        el.addClass('selected');
    }, 
    
    /**
     *  When another model is selected, remove the selected class from this 
     *  segment.  Called from the panel.
     **/
    deselect: function() {
        var el = $(this.el);
        el.removeClass('selected');
    }, 
});

