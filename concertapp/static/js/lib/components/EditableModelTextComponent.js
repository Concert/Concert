/**
 *  @file       EditableModelTextComponent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/
 

var EditableModelTextComponent = Component.extend(
	/**
	 *	@scope	EditableModelTextComponent.prototype
	 **/
{
    initialize: function() {
        Component.prototype.initialize.call(this);
        
        var params = this.options;
        
        var el = $(this.el);
        
        /* The attribute we are changing on this model instance */
        var attr = params.attr;
        if(typeof(attr) == 'undefined') {
            throw new Error('params.attr is undefined');
        }
        this.attr = attr;
        
        /* Get input element (for changing the attribute) */
        var inputElement = el.children('input');
        if(typeof(inputElement) == 'undefined') {
            throw new Error('inputElement is undefined');
        }
        else if(inputElement.length == 0) {
            throw new Error('inputElement not found');
        }
        /* remove from DOM */
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
        this.displayElement = displayElement;
        
        /* Make sure proper classes are on elements */
        if(!displayElement.hasClass('editable_attribute')) {
            throw new Error('displayElement should have class "editable_attribute"');
        }
        
        if(!inputElement.hasClass('attribute_editor')) {
            throw new Error('inputElement should have class "attribute_editor"');
        }
        
        
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
        /* Switch to input box */
        $(this.el).html(this.inputElement);
        
        /* Give input box focus */
        this.inputElement.focus();

        this.delegateEvents();
    }, 
    
    /**
     *  Called from self when new attribute field was blurred.  Might still be
     *  old name.  
     **/
    attr_input_blurred: function(e) {

        var inputElement = this.inputElement;        
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
        
        /* Change display element to new attr */
        this.displayElement.html(newAttr);
        
        /* Put back display element */
        $(this.el).html(this.displayElement);
    },
});