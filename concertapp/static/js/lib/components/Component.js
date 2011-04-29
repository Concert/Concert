/**
 *  @file       Component.js
 *  
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 
/**
 *  Things that each component will need
 *  @class
 *  @extends    Backbone.View
 **/
var Component = Backbone.View.extend(
	/**
	 *	@scope	Component.prototype
	 **/
{
    initialize: function() {
        Backbone.View.prototype.initialize.call(this);

        var params = this.options;

        var panel = params.panel;
        if(typeof(panel) == 'undefined') {
            throw new Error('params.panel is undefined');
        }
        /**
         *  The panel that interacts with this component.
         **/
        this.panel = panel;


        this._initialize_elements();
        
        this._initialize_events();
        
        
        
        _.bindAll(this, "render");
    },
    
    /**
     *  Any elements that this component is associated with on the DOM should be
     *  initialized here.
     **/
    _initialize_elements: function() {
        
        
    }, 
    
    /**
     *  Any event handlers that need to occur for this component should be 
     *  created here.
     **/
    _initialize_events: function() {
        
    }, 

    render: function() {
        Backbone.View.prototype.render.call(this);
        
        return this;
    }
});
