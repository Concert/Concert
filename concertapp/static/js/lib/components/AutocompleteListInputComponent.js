/**
 *  @file       AutocompleteListInputComponent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  This is a component when we need to input a list of entities, with auto complete.
 *  @class
 *  @extends    Backbone.View
 **/
var AutocompleteListInputComponent = Backbone.View.extend(
/**
 *  @scope AudiocompleteListInputComponent.prototype
 **/
{
    initialize: function() {
        Backbone.View.prototype.initialize.call(this);

        var params = this.options;
        
        var inputElement = params.inputElement;
        if(typeof(inputElement) == 'undefined') {
            throw new Error('params.inputElement is undefined');
        }
        this.inputElement = inputElement;
        
        _.bindAll(this, '_handle_input_keyup');
        inputElement.bind('keyup', this._handle_input_keyup);

        _.bindAll(this, "render");
    },
    
    /**
     *  Regexp used to split the input into separate tokens.
     **/
    TOKEN_SPLITTER: /[,\s]+/, 

    render: function() {
        Backbone.View.prototype.render.call(this);
        
        return this;
    },
    /**
     *  Called when there is a keyup event on the input element.
     *
     *  @param  {Event}    e    The keyup event.
     **/
    _handle_input_keyup: function(e) {
        var inputElement = this.inputElement;
        
        var wordSplit = inputElement.val().split(AutocompleteListInputComponent.prototype.TOKEN_SPLITTER);
        
        /* If another token was created */
        if(wordSplit.length > 1) {
            /* TODO: Handle tag creation here */
        }
    }, 
});