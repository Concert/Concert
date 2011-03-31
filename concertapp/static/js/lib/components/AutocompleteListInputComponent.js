/**
 *  @file       AutocompleteListInputComponent.js
 *
 *  @author     Colin Sullivan <colinsul [at] gmail.com>
 **/

/**
 *  This is a component when we need to input a list of entities, with auto complete.
 *  @class
 *  @extends    Component
 **/
var AutocompleteListInputComponent = Component.extend(
/**
 *  @scope AudiocompleteListInputComponent.prototype
 **/
{
    initialize: function() {
        Component.prototype.initialize.call(this);

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
            /* Grab previous token */
            var token = wordSplit[0];
            
            /* Remove everything from inputElement */
            inputElement.val('');
            
            /* If token was fo-real */
            if(token.length) {
                this._handle_new_token(token);
            }
            
        }
    },
    
    /**
     *  Handle a new token that was entered in the inputElement.
     *
     *  @param  {String}    token   The token that was entered.
     **/
    _handle_new_token: function(token) {
        return;
    },
});