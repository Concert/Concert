/**
 *  @file       Widget.js
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/


/**
 *  This contains general stuff that needs to take place for any widget on the UI.
 *	@class
 *  @extends    Backbone.View
 **/
var Widget = Backbone.View.extend(
	/**
	 *	@scope	Widget.prototype
	 **/
{
    /**
     *  Create the DOM elements associated with this widget using a template.  
     *  The widget is not inserted into the DOM in this class.  That is for whoever
     *  is instantiating the widget to take care of.
     *
     *  @param  {jQuery tmpl object}    params.template -   The template.
     *  @param  {Panel}                 params.panel    -   Panel that we belong to.  
     **/    
    initialize: function(params) {
        var params = this.options;
        
        var template = params.template;
        if(typeof(template) == 'undefined' && typeof(params.el) == 'undefined') {
            throw new Error('params.template or params.el must be undefined');
        }
        else if(typeof(template) != 'undefined' && template.length == 0) {
            throw new Error('template not found');
        }
        this.template = template;

        var panel = params.panel;
        if(typeof(panel) == 'undefined') {
            throw new Error('params.panel is undefined');
        }
        this.panel = panel;

        _.bindAll(this, 'render');
        if(this.model) {
            this.model.bind('change', this.render);
        }
    },
    render: function() {
        var template = this.template;
        if(template) {
            /* render new widget */
            var newel = template.tmpl(
                /* with model data and extra template data */
                _.extend(this.model.toJSON(), this._extra_template_data())
            );
            if(newel.length != 1) {
                throw new Error('widgets must have a single containing element');
            }
            var el = this.el;
            
            /* If this element is currently in the DOM */
            if($(el).parent().length) {
                /* replace old widget in DOM (or non-dom) */
                $(el).replaceWith(newel);                
            }
            /* Save reference to new widget */
            this.el = newel.get(0);
        }
        
        this.delegateEvents();
                
        return this;
    },
    /**
     *  This method will be called when rendering, and can be overridden to send
     *  extra arbitrary data to the template.
     **/
    _extra_template_data: function() {
        return {};
    } 
});