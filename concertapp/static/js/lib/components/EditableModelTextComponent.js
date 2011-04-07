/**
 *  @file       EditableModelTextComponent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 

var EditableModelTextComponent = concertapp.components.Component.extend(
	/**
	 *	@scope	EditableModelTextComponent.prototype
	 **/
{
    initialize: function() {
       concertapp.components.Component.prototype.initialize.call(this);
        
        var params = this.options;
        
        var el = $(this.el);
        
        var attr = params.attr;
        if(typeof(attr) == 'undefined') {
            throw new Error('params.attr is undefined');
        }
        /**
         *  The name of the attribute we are changing on this model instance.
         **/
        this.attr = attr;
        
        var inputElement = el.children('input');
        if(typeof(inputElement) == 'undefined') {
            throw new Error('inputElement is undefined');
        }
        else if(inputElement.length == 0) {
            throw new Error('inputElement not found');
        }
        /**
         *  The input element that we will use to modify the attribute. (removed
         *  from DOM).
         **/
        this.inputElement = inputElement.detach();
        
        /* If there is more than one element left */
        if(el.children().length > 1) {
            throw new Error('There are too many elements in this.el');
        }
        
        /* Get other element */
        var displayElement = el.children().first();
        if(typeof(displayElement) == 'undefined') {
            throw new Error('el.children().first() is undefined');
        }
        /**
         *  The element we will use to display the value of this attribute. (removed
         *  from DOM).
         **/
        this.displayElement = displayElement;
        
        /* Make sure proper classes are on elements */
        if(!displayElement.hasClass('editable_attribute')) {
            throw new Error('displayElement should have class "editable_attribute"');
        }
        
        if(!inputElement.hasClass('attribute_editor')) {
            throw new Error('inputElement should have class "attribute_editor"');
        }
        
        /* Bind keyup events in input element to our keyup handler */
        _.bindAll(this, '_handle_input_keyup');
        inputElement.bind('keyup', this._handle_input_keyup);
        
        _.bindAll(this, 'attr_clicked');
        _.bindAll(this, 'attr_input_blurred');
    }, 
    
    events: {
        'blur .attribute_editor': 'attr_input_blurred',
        'click .editable_attribute': 'attr_clicked', 
    }, 
    
    /**
     *  Called from self when the attribute of the model is clicked.
     **/
    attr_clicked: function(){
        var inputElement = this.inputElement;
        
        /* Switch to input box */
        $(this.el).html(inputElement);
        
        /* Give input box focus */
        this.inputElement.focus();

        this.delegateEvents();
    }, 
    
    /**
     *  Called from inputElement keyup event handler.
     *
     *  @param  {Event}     e   The keyup event
     **/
    _handle_input_keyup: function(e) {
        
        /* If this was a return key */
        var keycode = e.keyCode;
        if(keycode == 13) {
//            e.stopPropagation();
            
            /* Blur field */
            this.inputElement.blur();
            
        }
    }, 
    
    /**
     *  Called from self when new attribute field was blurred.  Might still be
     *  old name.  
     **/
    attr_input_blurred: function(e) {
        var inputElement = this.inputElement;
        var displayElement = this.displayElement;        
        
        /* New attribute */
        var newAttr = inputElement.val();
        
        var model = this.model;
        var attr = this.attr;
        
        var oldAttr = model.get(attr);
        
        /* If name has changed */
        if(oldAttr != newAttr) {
            /* Save new name */
            model.save({
                name: newAttr
            }, {
                /* If save fails */
                error_message: 'New '+attr+' was not saved.',
                error_callback: function(model, oldAttr) {
                    /* Put back old attr */ 
                    return function() {
                        model.set({name: oldAttr});
                    };
                }(model, oldAttr), 
            });
        }
        
        
        /* Change display element to new attr text */
        displayElement.html(newAttr);

        /* Put back display element */
        $(this.el).html(displayElement);
    },
});