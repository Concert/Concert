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
var Component = Backbone.View.extend({
    initialize: function() {
        Backbone.View.prototype.initialize.call(this);

        var params = this.options;

        var panel = params.panel;
        if(typeof(panel) == 'undefined') {
            throw new Error('params.panel is undefined');
        }
        this.panel = panel;


        this._initializeElements();
        
        this._initializeEvents();
        
        
        
        _.bindAll(this, "render");
    },
    
    /**
     *  Any elements that this component is associated with on the DOM should be
     *  initialized here.
     **/
    _initializeElements: function() {
        
        
    }, 
    
    /**
     *  Any event handlers that need to occur for this component should be 
     *  created here.
     **/
    _initializeEvents: function() {
        
    }, 

    render: function() {
        Backbone.View.prototype.render.call(this);
        
        return this;
    }
});
